'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { evaluateEduscoreSurvey, EvaluateEduscoreSurveyOutput } from '@/ai/flows/evaluate-eduscore-survey';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-neon';
import { saveEduscoreResult, uploadVerificationDocument } from '@/lib/database';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import SurveyResult from './SurveyResult';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  academicInfoGPA: z.coerce.number().min(0, "GPA must be at least 0.").max(4, "GPA cannot exceed 4.0."),
  major: z.string({ required_error: "Please select your major/field of study." }),
  majorSpecialization: z.string().optional(),
  technicalSkills: z.string().min(1, "Please list your technical skills."),
  programmingLanguages: z.string().optional(),
  certifications: z.string().min(1, "Please list your certifications, or type 'None'."),
  currentYear: z.string({ required_error: "Please select your current academic year." }),
  university: z.string().min(1, "Please enter your university/institution name."),
  academicInfoTranscript: z.any()
    .refine((files) => files?.length == 1, "Transcript is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Only .pdf, .jpg, .jpeg, and .png files are accepted."),
  extracurricularActivities: z.string().min(1, "Please list your activities."),
  awards: z.string().min(1, "Please list any awards, or type 'None'."),
  languageSkills: z.string().min(1, "Please describe your language skills."),
  workExperience: z.string().min(1, "Please describe your work experience, or type 'None'."),
  familyIncome: z.string({ required_error: "Please select an income range." }),
  dependents: z.coerce.number().min(0, "Number of dependents cannot be negative."),
  valuableAssets: z.string().min(1, "Please describe valuable assets, or type 'None'."),
  medicalExpenses: z.string().min(1, "Please describe medical expenses, or type 'None'."),
  specialCircumstances: z.string().min(1, "Please describe special circumstances, or type 'None'."),
  aspirations: z.string().min(50, "Please write at least 50 characters.").max(1500),
  careerGoals: z.string().min(50, "Please describe your career goals.").max(1000),
  recommendationLetter: z.any()
    .refine((files) => files?.length == 1, "Recommendation letter is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Only .pdf, .jpg, .jpeg, and .png files are accepted."),
});

type SurveyFormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'Academic Information', fields: ['academicInfoGPA', 'major', 'majorSpecialization', 'currentYear', 'university', 'academicInfoTranscript'] },
  { id: 2, title: 'Skills & Experience', fields: ['technicalSkills', 'programmingLanguages', 'certifications', 'languageSkills', 'workExperience'] },
  { id: 3, title: 'Extracurriculars & Awards', fields: ['extracurricularActivities', 'awards'] },
  { id: 4, title: 'Financial Information', fields: ['familyIncome', 'dependents', 'valuableAssets'] },
  { id: 5, title: 'Special Circumstances', fields: ['medicalExpenses', 'specialCircumstances'] },
  { id: 6, title: 'Aspirations & Recommendations', fields: ['aspirations', 'careerGoals', 'recommendationLetter'] },
];

export default function SurveyWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluateEduscoreSurveyOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });
  
  const transcriptFileRef = form.register("academicInfoTranscript");
  const letterFileRef = form.register("recommendationLetter");

  const handleNext = async () => {
    const fields = steps[currentStep].fields as (keyof SurveyFormValues)[];
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const onSubmit = async (data: SurveyFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: "Error", description: "You must be logged in to submit the survey." });
      return;
    }
    
    setIsLoading(true);
    try {
      // Upload verification documents
      const transcriptUrl = await uploadVerificationDocument(
        user.email, 
        data.academicInfoTranscript[0], 
        'transcript'
      );
      
      const recommendationUrl = await uploadVerificationDocument(
        user.email, 
        data.recommendationLetter[0], 
        'recommendation'
      );
      
      const transcriptDataUri = await fileToDataUri(data.academicInfoTranscript[0]);
      const recommendationLetterDataUri = await fileToDataUri(data.recommendationLetter[0]);

      const surveyResult = await evaluateEduscoreSurvey({
        academicInfoGPA: data.academicInfoGPA,
        major: data.major,
        majorSpecialization: data.majorSpecialization,
        technicalSkills: data.technicalSkills,
        programmingLanguages: data.programmingLanguages,
        certifications: data.certifications,
        languageSkills: data.languageSkills,
        workExperience: data.workExperience,
        currentYear: data.currentYear,
        university: data.university,
        academicInfoTranscriptDataUri: transcriptDataUri,
        extracurricularActivities: data.extracurricularActivities,
        awards: data.awards,
        familyIncome: data.familyIncome,
        dependents: data.dependents,
        valuableAssets: data.valuableAssets,
        medicalExpenses: data.medicalExpenses,
        specialCircumstances: data.specialCircumstances,
        aspirations: data.aspirations,
        careerGoals: data.careerGoals,
        recommendationLetterDataUri: recommendationLetterDataUri,
      });
      
      // Save to database
      await saveEduscoreResult(user.email, {
        userId: user.email,
        score: surveyResult.eduscore,
        reasoning: surveyResult.reasoning,
        surveyData: {
          academicInfoGPA: data.academicInfoGPA,
          major: data.major,
          majorSpecialization: data.majorSpecialization,
          technicalSkills: data.technicalSkills,
          programmingLanguages: data.programmingLanguages,
          certifications: data.certifications,
          languageSkills: data.languageSkills,
          workExperience: data.workExperience,
          currentYear: data.currentYear,
          university: data.university,
          extracurricularActivities: data.extracurricularActivities,
          awards: data.awards,
          familyIncome: data.familyIncome,
          dependents: data.dependents,
          valuableAssets: data.valuableAssets,
          medicalExpenses: data.medicalExpenses,
          specialCircumstances: data.specialCircumstances,
          aspirations: data.aspirations,
          careerGoals: data.careerGoals,
        },
        documentUrls: {
          transcript: transcriptUrl,
          recommendationLetter: recommendationUrl
        }
      });
      
      // Store result and survey data in localStorage for immediate use
      localStorage.setItem('eduscoreResult', JSON.stringify(surveyResult));
      localStorage.setItem('surveyData', JSON.stringify(data));

      setResult(surveyResult);
      toast({ title: "Đánh giá hoàn tất!", description: "Đánh giá Eduscore đã được tính toán xong và lưu trên hệ thống." });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Đã xảy ra lỗi", description: "Không thể đánh giá khảo sát. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Đang đánh giá hồ sơ của bạn...</h2>
        <p className="text-muted-foreground mt-2">Hệ thống đang phân tích phản hồi của bạn. Quá trình này có thể mất một chút thời gian.</p>
      </div>
    );
  }

  if (result) {
    return <SurveyResult result={result} />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="mb-4">
            <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-2" />
        </div>
        <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
        <CardDescription>Please provide the following information.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <>
                <FormField control={form.control} name="academicInfoGPA" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA (4.0 Scale)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="e.g., 3.8" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="major" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major/Field of Study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science">Khoa học máy tính (Computer Science)</SelectItem>
                        <SelectItem value="Software Engineering">Kỹ thuật phần mềm (Software Engineering)</SelectItem>
                        <SelectItem value="Information Technology">Công nghệ thông tin (Information Technology)</SelectItem>
                        <SelectItem value="Data Science">Khoa học dữ liệu (Data Science)</SelectItem>
                        <SelectItem value="Civil Engineering">Kỹ thuật xây dựng (Civil Engineering)</SelectItem>
                        <SelectItem value="Mechanical Engineering">Kỹ thuật cơ khí (Mechanical Engineering)</SelectItem>
                        <SelectItem value="Electrical Engineering">Kỹ thuật điện (Electrical Engineering)</SelectItem>
                        <SelectItem value="Chemical Engineering">Kỹ thuật hóa học (Chemical Engineering)</SelectItem>
                        <SelectItem value="Business Administration">Quản trị kinh doanh (Business Administration)</SelectItem>
                        <SelectItem value="Economics">Kinh tế học (Economics)</SelectItem>
                        <SelectItem value="Finance Banking">Tài chính ngân hàng (Finance & Banking)</SelectItem>
                        <SelectItem value="International Business">Kinh doanh quốc tế (International Business)</SelectItem>
                        <SelectItem value="Marketing">Tiếp thị (Marketing)</SelectItem>
                        <SelectItem value="Accounting">Kế toán (Accounting)</SelectItem>
                        <SelectItem value="Medicine">Y khoa (Medicine)</SelectItem>
                        <SelectItem value="Pharmacy">Dược học (Pharmacy)</SelectItem>
                        <SelectItem value="Nursing">Điều dưỡng (Nursing)</SelectItem>
                        <SelectItem value="Dentistry">Nha khoa (Dentistry)</SelectItem>
                        <SelectItem value="Law">Luật học (Law)</SelectItem>
                        <SelectItem value="International Relations">Quan hệ quốc tế (International Relations)</SelectItem>
                        <SelectItem value="Public Administration">Hành chính công (Public Administration)</SelectItem>
                        <SelectItem value="Education">Sư phạm (Education)</SelectItem>
                        <SelectItem value="English Language">Ngôn ngữ Anh (English Language)</SelectItem>
                        <SelectItem value="Japanese Language">Ngôn ngữ Nhật (Japanese Language)</SelectItem>
                        <SelectItem value="Chinese Language">Ngôn ngữ Trung (Chinese Language)</SelectItem>
                        <SelectItem value="Vietnamese Literature">Ngữ văn Việt Nam (Vietnamese Literature)</SelectItem>
                        <SelectItem value="Psychology">Tâm lý học (Psychology)</SelectItem>
                        <SelectItem value="Sociology">Xã hội học (Sociology)</SelectItem>
                        <SelectItem value="History">Lịch sử (History)</SelectItem>
                        <SelectItem value="Geography">Địa lý (Geography)</SelectItem>
                        <SelectItem value="Mathematics">Toán học (Mathematics)</SelectItem>
                        <SelectItem value="Physics">Vật lý (Physics)</SelectItem>
                        <SelectItem value="Chemistry">Hóa học (Chemistry)</SelectItem>
                        <SelectItem value="Biology">Sinh học (Biology)</SelectItem>
                        <SelectItem value="Environmental Science">Khoa học môi trường (Environmental Science)</SelectItem>
                        <SelectItem value="Architecture">Kiến trúc (Architecture)</SelectItem>
                        <SelectItem value="Art Design">Mỹ thuật & Thiết kế (Art & Design)</SelectItem>
                        <SelectItem value="Music">Âm nhạc (Music)</SelectItem>
                        <SelectItem value="Film Studies">Điện ảnh (Film Studies)</SelectItem>
                        <SelectItem value="Journalism">Báo chí (Journalism)</SelectItem>
                        <SelectItem value="Communication">Truyền thông (Communication)</SelectItem>
                        <SelectItem value="Tourism Hospitality">Du lịch & Khách sạn (Tourism & Hospitality)</SelectItem>
                        <SelectItem value="Agriculture">Nông nghiệp (Agriculture)</SelectItem>
                        <SelectItem value="Veterinary">Thú y (Veterinary)</SelectItem>
                        <SelectItem value="Food Technology">Công nghệ thực phẩm (Food Technology)</SelectItem>
                        <SelectItem value="Transportation">Giao thông vận tải (Transportation)</SelectItem>
                        <SelectItem value="Other">Khác (Other)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="majorSpecialization" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major Specialization (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., AI & Machine Learning, Web Development, Financial Analysis..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="currentYear" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                        <SelectItem value="Graduate">Graduate Student</SelectItem>
                        <SelectItem value="Recent Graduate">Recent Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="university" render={({ field }) => (
                  <FormItem>
                    <FormLabel>University/Institution</FormLabel>
                    <FormControl><Input placeholder="e.g., Đại học Quốc gia Hà Nội" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="academicInfoTranscript" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Transcript</FormLabel>
                    <FormControl><Input type="file" {...transcriptFileRef} /></FormControl>
                    <FormDescription>PDF, JPG, or PNG file. Max 5MB.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 1 && (
              <>
                <FormField control={form.control} name="technicalSkills" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Python, React, Photoshop, Microsoft Office, AutoCAD..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="programmingLanguages" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programming Languages (if applicable)</FormLabel>
                    <FormControl><Input placeholder="e.g., Java, Python, C++, JavaScript, PHP..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="certifications" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications & Licenses</FormLabel>
                    <FormControl><Textarea placeholder="e.g., AWS Certified, Google Analytics, TOEIC, IELTS, or type 'None'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="languageSkills" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Skills</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Vietnamese (Native), English (Advanced), Japanese (Intermediate)..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="workExperience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience</FormLabel>
                    <FormControl><Textarea placeholder="Describe your internships, part-time jobs, or type 'None'" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 2 && (
              <>
                <FormField control={form.control} name="extracurricularActivities" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extracurricular Activities</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Student council, volunteer at local shelter, coding club..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="awards" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Awards & Achievements</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Science fair winner, debate team captain, 'None'..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 3 && (
              <>
                <FormField control={form.control} name="familyIncome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Monthly Family Income</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="< $1,000" /></FormControl>
                                <FormLabel className="font-normal">&lt; $1,000</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="$1,000 - $2,500" /></FormControl>
                                <FormLabel className="font-normal">$1,000 - $2,500</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="$2,501 - $5,000" /></FormControl>
                                <FormLabel className="font-normal">$2,501 - $5,000</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="> $5,000" /></FormControl>
                                <FormLabel className="font-normal">&gt; $5,000</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dependents" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dependents</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="valuableAssets" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valuable Family Assets</FormLabel>
                    <FormControl><Textarea placeholder="e.g., House, car, land. Type 'None' if not applicable." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 4 && (
              <>
                <FormField control={form.control} name="medicalExpenses" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Medical Expenses</FormLabel>
                    <FormControl><Textarea placeholder="Describe any significant, ongoing medical expenses for your family. Type 'None' if not applicable." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="specialCircumstances" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Special Circumstances</FormLabel>
                    <FormControl><Textarea placeholder="Describe any other challenges like job loss, natural disasters, etc. Type 'None' if not applicable." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 5 && (
              <>
                <FormField control={form.control} name="aspirations" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspirations Essay</FormLabel>
                    <FormControl><Textarea rows={6} placeholder="Tell us about yourself, your dreams, and why you are seeking support." {...field} /></FormControl>
                    <FormDescription>Min 50 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="careerGoals" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Goals & Future Plans</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Describe your career goals for the next 5-10 years..." {...field} /></FormControl>
                    <FormDescription>Min 50 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="recommendationLetter" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Recommendation Letter</FormLabel>
                    <FormControl><Input type="file" {...letterFileRef} /></FormControl>
                    <FormDescription>From a teacher or local authority. PDF, JPG, or PNG. Max 5MB.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                Submit & Evaluate
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
