'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EvaluateEduscoreSurveyOutput } from '@/ai/flows/evaluate-eduscore-survey';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-neon';
import { saveEduscoreResult } from '@/lib/database';

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

const formSchema = z.object({
  academicInfoGPA: z.coerce.number().min(0, "Điểm trung bình (GPA) phải từ 0 trở lên.").max(4, "Điểm trung bình (GPA) không được vượt quá 4.0."),
  major: z.string({ required_error: "Vui lòng chọn chuyên ngành/lĩnh vực học tập của bạn." }),
  majorOther: z.string().optional(),
  technicalSkills: z.string().min(1, "Vui lòng liệt kê các kỹ năng chuyên môn của bạn."),
  programmingLanguages: z.string().optional(),
  certifications: z.string().optional(),
  currentYear: z.string({ required_error: "Vui lòng chọn năm học hiện tại của bạn." }),
  university: z.string().min(1, "Vui lòng nhập tên trường đại học/học viện của bạn."),
  extracurricularActivities: z.string().optional(),
  awards: z.string().optional(),
  languageSkills: z.string().optional(),
  workExperience: z.string().optional(),
  familyIncome: z.string({ required_error: "Vui lòng chọn phạm vi thu nhập." }),
  dependents: z.coerce.number().min(0, "Số lượng người phụ thuộc không được âm."),
  valuableAssets: z.string().optional(),
  medicalExpenses: z.string().optional(),
  specialCircumstances: z.string().optional(),
  aspirations: z.string().optional(),
  careerGoals: z.string().optional(),
});

type SurveyFormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'Thông tin cơ bản', fields: ['academicInfoGPA', 'major', 'majorOther', 'currentYear', 'university'] },
  { id: 2, title: 'Kỹ năng & Kinh nghiệm', fields: ['technicalSkills', 'programmingLanguages', 'certifications', 'languageSkills', 'workExperience'] },
  { id: 3, title: 'Hoạt động ngoại khóa & Giải thưởng', fields: ['extracurricularActivities', 'awards'] },
  { id: 4, title: 'Thông tin tài chính', fields: ['familyIncome', 'dependents', 'valuableAssets'] },
  { id: 5, title: 'Hoàn cảnh đặc biệt', fields: ['medicalExpenses', 'specialCircumstances'] },
  { id: 6, title: 'Nguyện vọng', fields: ['aspirations', 'careerGoals'] },
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
    defaultValues: {
      academicInfoGPA: 0,
      major: '',
      majorOther: '',
      technicalSkills: '',
      programmingLanguages: '',
      certifications: '',
      currentYear: '',
      university: '',
      extracurricularActivities: '',
      awards: '',
      languageSkills: '',
      workExperience: '',
      familyIncome: '',
      dependents: 0,
      valuableAssets: '',
      medicalExpenses: '',
      specialCircumstances: '',
      aspirations: '',
      careerGoals: '',
    }
  });

  const handleNext = async () => {
    const fields = steps[currentStep].fields as (keyof SurveyFormValues)[];
    
    // Validate all fields
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

  // Fast local evaluation function - instant scoring
  const evaluateEduscoreFast = (surveyData: SurveyFormValues): EvaluateEduscoreSurveyOutput => {
    let score = 0;
    let reasoning = "Phân tích EduScore của bạn:\n\n";
    
    // Academic Performance (40 points max)
    const gpaScore = (surveyData.academicInfoGPA / 4.0) * 40;
    score += gpaScore;
    reasoning += `📚 **Thành tích học tập (${gpaScore.toFixed(1)}/40 điểm):**\n`;
    reasoning += `- GPA ${surveyData.academicInfoGPA}/4.0 `;
    if (surveyData.academicInfoGPA >= 3.5) {
      reasoning += "- Xuất sắc!\n";
    } else if (surveyData.academicInfoGPA >= 3.0) {
      reasoning += "- Khá tốt\n";
    } else {
      reasoning += "- Cần cải thiện\n";
    }
    reasoning += `- Chuyên ngành: ${surveyData.major}\n`;
    reasoning += `- Trường: ${surveyData.university}\n\n`;
    
    // Skills & Experience (25 points max)
    let skillsScore = 0;
    if (surveyData.technicalSkills.length > 20) skillsScore += 8;
    else if (surveyData.technicalSkills.length > 10) skillsScore += 5;
    else skillsScore += 2;
    
    if (surveyData.programmingLanguages && surveyData.programmingLanguages.length > 0) skillsScore += 5;
    if (surveyData.certifications && surveyData.certifications.length > 0) skillsScore += 5;
    if (surveyData.languageSkills && surveyData.languageSkills.length > 0) skillsScore += 4;
    if (surveyData.workExperience && surveyData.workExperience.length > 0) skillsScore += 3;
    
    skillsScore = Math.min(skillsScore, 25);
    score += skillsScore;
    reasoning += `🔧 **Kỹ năng & Kinh nghiệm (${skillsScore}/25 điểm):**\n`;
    reasoning += `- Kỹ năng chuyên môn: ${surveyData.technicalSkills.substring(0, 50)}...\n`;
    if (surveyData.programmingLanguages) reasoning += `- Ngôn ngữ lập trình: ${surveyData.programmingLanguages}\n`;
    if (surveyData.workExperience) reasoning += `- Kinh nghiệm làm việc có\n`;
    reasoning += "\n";
    
    // Extracurricular & Awards (20 points max)
    let extraScore = 0;
    if (surveyData.extracurricularActivities && surveyData.extracurricularActivities.length > 0) extraScore += 10;
    if (surveyData.awards && surveyData.awards.length > 0) extraScore += 10;
    
    score += extraScore;
    reasoning += `🌟 **Hoạt động & Thành tích (${extraScore}/20 điểm):**\n`;
    if (surveyData.extracurricularActivities) reasoning += `- Hoạt động ngoại khóa: Có\n`;
    if (surveyData.awards) reasoning += `- Giải thưởng: Có\n`;
    if (extraScore === 0) reasoning += "- Chưa có hoạt động ngoại khóa đáng kể\n";
    reasoning += "\n";
    
    // Financial Need & Aspirations (15 points max)
    let needScore = 0;
    if (surveyData.familyIncome.includes('5-10') || surveyData.familyIncome.includes('10-15')) needScore += 8;
    else if (surveyData.familyIncome.includes('15-25')) needScore += 5;
    else needScore += 3;
    
    if (surveyData.dependents >= 2) needScore += 3;
    if (surveyData.aspirations && surveyData.aspirations.length > 50) needScore += 2;
    if (surveyData.careerGoals && surveyData.careerGoals.length > 30) needScore += 2;
    
    score += needScore;
    reasoning += `💰 **Nhu cầu tài chính & Nguyện vọng (${needScore}/15 điểm):**\n`;
    reasoning += `- Thu nhập gia đình: ${surveyData.familyIncome}\n`;
    reasoning += `- Số người phụ thuộc: ${surveyData.dependents}\n`;
    if (surveyData.aspirations) reasoning += "- Có nguyện vọng rõ ràng\n";
    reasoning += "\n";
    
    // Final score adjustment
    score = Math.min(Math.max(score, 30), 100);
    
    reasoning += `📊 **Tổng kết:**\n`;
    reasoning += `- **EduScore: ${Math.round(score)}/100**\n`;
    if (score >= 85) {
      reasoning += "- Hồ sơ xuất sắc! Bạn có cơ hội cao với các học bổng danh giá.\n";
    } else if (score >= 75) {
      reasoning += "- Hồ sơ tốt! Bạn đủ điều kiện cho nhiều học bổng.\n";
    } else if (score >= 65) {
      reasoning += "- Hồ sơ khá ổn. Nên cải thiện thêm để tăng cơ hội.\n";
    } else {
      reasoning += "- Hồ sơ cần cải thiện đáng kể để tăng cơ hội học bổng.\n";
    }
    
    reasoning += "\n✨ **Lời khuyên:** Tiếp tục phát triển kỹ năng, tham gia hoạt động ngoại khóa và duy trì thành tích học tập tốt!";
    
    return {
      eduscore: Math.round(score),
      reasoning: reasoning
    };
  };

  const onSubmit = async (data: SurveyFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: "Error", description: "You must be logged in to submit the survey." });
      return;
    }
    
    setIsLoading(true);
    try {
      let surveyResult;
      
      // Use fast local evaluation for instant results
      surveyResult = evaluateEduscoreFast(data);
      
      // Save to database
      await saveEduscoreResult(user.email, {
        userId: user.email,
        score: surveyResult.eduscore,
        reasoning: surveyResult.reasoning,
        surveyData: {
          academicInfoGPA: data.academicInfoGPA || 0,
          major: data.major || '',
          majorSpecialization: data.majorOther,
          technicalSkills: data.technicalSkills || '',
          programmingLanguages: data.programmingLanguages,
          certifications: data.certifications,
          languageSkills: data.languageSkills,
          workExperience: data.workExperience,
          currentYear: data.currentYear || '',
          university: data.university || '',
          extracurricularActivities: data.extracurricularActivities,
          awards: data.awards,
          familyIncome: data.familyIncome || '',
          dependents: data.dependents || 0,
          valuableAssets: data.valuableAssets,
          medicalExpenses: data.medicalExpenses,
          specialCircumstances: data.specialCircumstances,
          aspirations: data.aspirations,
          careerGoals: data.careerGoals,
        },
        documentUrls: {
          transcript: null,
          recommendationLetter: null
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
        <div className="mb-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Trang {currentStep + 1} / {steps.length}</p>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-2" />
          </div>
        </div>
        <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
        <CardDescription>Hãy cung cấp chính xác các thông tin dưới đây</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <>
                <FormField control={form.control} name="academicInfoGPA" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA (Thang điểm 4)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="vd: 3.8" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="major" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chuyên ngành/Lĩnh vực học tập của bạn?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Nhập ngành bạn đang học" />
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
                    
                    {field.value === "Other" && (
                      <FormField control={form.control} name="majorOther" render={({ field: otherField }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Hãy nhập chuyên ngành của bạn</FormLabel>
                          <FormControl><Input placeholder="Nhập chuyên ngành của bạn" {...otherField} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="currentYear" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bạn là sinh viên năm mấy?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn năm hiện tại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st Year">Năm nhất</SelectItem>
                        <SelectItem value="2nd Year">Năm hai</SelectItem>
                        <SelectItem value="3rd Year">Năm ba</SelectItem>
                        <SelectItem value="4th Year">Năm tư</SelectItem>
                        <SelectItem value="Graduate">Đã tốt nghiệp</SelectItem>
                        <SelectItem value="Recent Graduate">Vừa tốt nghiệp</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="university" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trường đại học/Cao đẳng</FormLabel>
                    <FormControl><Input placeholder="vd: Đại học Kinh tế - Luật" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 1 && (
              <>
                <FormField control={form.control} name="technicalSkills" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kỹ năng chuyên môn (không có thì ghi "Không")</FormLabel>
                    <FormControl><Textarea placeholder="vd: Python, React, Photoshop, Microsoft Office, AutoCAD..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="programmingLanguages" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngôn ngữ lập trình (không có thì ghi "Không")</FormLabel>
                    <FormControl><Input placeholder="vd: Java, Python, C++, JavaScript, PHP..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="certifications" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chứng chỉ & Giấy phép <span className="text-sm text-muted-foreground">(Không bắt buộc)</span></FormLabel>
                    <FormControl><Textarea placeholder="vd: AWS Certified, Google Analytics, TOEIC, IELTS. Để trống nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="languageSkills" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chứng chỉ ngoại ngữ <span className="text-sm text-muted-foreground">(Không bắt buộc)</span></FormLabel>
                    <FormControl><Textarea placeholder="vd: TOEIC 850, IELTS 7.0, HSK Level 4. Để trống nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="workExperience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh nghiệm làm việc <span className="text-sm text-muted-foreground">(Không bắt buộc)</span></FormLabel>
                    <FormControl><Textarea placeholder="Mô tả thực tập, công việc bán thời gian, volunteer work. Để trống nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 2 && (
              <>
                <FormField control={form.control} name="extracurricularActivities" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hoạt động ngoại khóa</FormLabel>
                    <FormControl><Textarea placeholder="vd: Tham gia Đoàn - Hội, tình nguyện tại địa phương/trường, Câu lạc bộ/Đội/Nhóm,..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="awards" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giải thưởng & Thành tích <span className="text-sm text-muted-foreground">(Không bắt buộc)</span></FormLabel>
                    <FormControl><Textarea placeholder="vd: Giải nhất cuộc thi khoa học, đội trưởng đội tranh biện. Để trống nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 3 && (
              <>
                <FormField control={form.control} name="familyIncome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng thu nhập hàng n của gia đình</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="< $1,000" /></FormControl>
                                <FormLabel className="font-normal">&lt; 30 triệu VND/năm</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="$1,000 - $2,500" /></FormControl>
                                <FormLabel className="font-normal">30 triệu đến 118 triệu VND/năm</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="$2,501 - $5,000" /></FormControl>
                                <FormLabel className="font-normal">118 triệu đến 367 triệu VND/năm</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl><RadioGroupItem value="> $5,000" /></FormControl>
                                <FormLabel className="font-normal">&gt; 367 triệu VND/năm</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dependents" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số người phụ thuộc</FormLabel>
                    <FormControl><Input type="number" placeholder="vd: 2" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="valuableAssets" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tài sản giá trị của gia đình</FormLabel>
                    <FormControl><Textarea placeholder="vd: Nhà, xe, đất. Nhập 'Không có' nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 4 && (
              <>
                <FormField control={form.control} name="medicalExpenses" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi phí y tế đặc biệt</FormLabel>
                    <FormControl><Textarea placeholder="Mô tả các chi phí y tế lớn, đang diễn ra của gia đình. Nhập 'Không có' nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="specialCircumstances" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hoàn cảnh đặc biệt khác</FormLabel>
                    <FormControl><Textarea placeholder="Mô tả các khó khăn khác như mất việc, thiên tai... Nhập 'Không có' nếu không có." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
            {currentStep === 5 && (
              <>
                <FormField control={form.control} name="aspirations" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bài luận về nguyện vọng</FormLabel>
                    <FormControl><Textarea rows={6} placeholder="Hãy chia sẻ về bản thân, ước mơ và lý do bạn tìm kiếm sự hỗ trợ." {...field} /></FormControl>
                    <FormDescription>Tối thiểu 50 ký tự.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="careerGoals" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mục tiêu nghề nghiệp & Kế hoạch tương lai</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Mô tả mục tiêu nghề nghiệp trong 5-10 năm tới..." {...field} /></FormControl>
                    <FormDescription>Tối thiểu 50 ký tự.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
              Quay lại
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Tiếp theo
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-accent hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Gửi & Đánh giá'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
