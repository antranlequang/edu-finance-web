'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { evaluateEduscoreSurvey, EvaluateEduscoreSurveyOutput } from '@/ai/flows/evaluate-eduscore-survey';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import SurveyResult from './SurveyResult';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  academicInfoGPA: z.coerce.number().min(0, "GPA must be at least 0.").max(4, "GPA cannot exceed 4.0."),
  academicInfoTranscript: z.any()
    .refine((files) => files?.length == 1, "Transcript is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Only .pdf, .jpg, .jpeg, and .png files are accepted."),
  extracurricularActivities: z.string().min(1, "Please list your activities."),
  awards: z.string().min(1, "Please list any awards, or type 'None'."),
  familyIncome: z.string({ required_error: "Please select an income range." }),
  dependents: z.coerce.number().min(0, "Number of dependents cannot be negative."),
  valuableAssets: z.string().min(1, "Please describe valuable assets, or type 'None'."),
  medicalExpenses: z.string().min(1, "Please describe medical expenses, or type 'None'."),
  specialCircumstances: z.string().min(1, "Please describe special circumstances, or type 'None'."),
  aspirations: z.string().min(50, "Please write at least 50 characters.").max(1500),
  recommendationLetter: z.any()
    .refine((files) => files?.length == 1, "Recommendation letter is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Only .pdf, .jpg, .jpeg, and .png files are accepted."),
});

type SurveyFormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'Academic Information', fields: ['academicInfoGPA', 'academicInfoTranscript'] },
  { id: 2, title: 'Extracurriculars & Awards', fields: ['extracurricularActivities', 'awards'] },
  { id: 3, title: 'Financial Information', fields: ['familyIncome', 'dependents', 'valuableAssets'] },
  { id: 4, title: 'Special Circumstances', fields: ['medicalExpenses', 'specialCircumstances'] },
  { id: 5, title: 'Aspirations & Recommendations', fields: ['aspirations', 'recommendationLetter'] },
];

export default function SurveyWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluateEduscoreSurveyOutput | null>(null);
  const { toast } = useToast();

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
    setIsLoading(true);
    try {
      const transcriptDataUri = await fileToDataUri(data.academicInfoTranscript[0]);
      const recommendationLetterDataUri = await fileToDataUri(data.recommendationLetter[0]);

      const surveyResult = await evaluateEduscoreSurvey({
        academicInfoGPA: data.academicInfoGPA,
        academicInfoTranscriptDataUri: transcriptDataUri,
        extracurricularActivities: data.extracurricularActivities,
        awards: data.awards,
        familyIncome: data.familyIncome,
        dependents: data.dependents,
        valuableAssets: data.valuableAssets,
        medicalExpenses: data.medicalExpenses,
        specialCircumstances: data.specialCircumstances,
        aspirations: data.aspirations,
        recommendationLetterDataUri: recommendationLetterDataUri,
      });
      
      // Store result in localStorage to be used on the profile page.
      localStorage.setItem('eduscoreResult', JSON.stringify(surveyResult));

      setResult(surveyResult);
      toast({ title: "Evaluation Complete!", description: "Your Eduscore has been calculated." });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "An Error Occurred", description: "Failed to evaluate the survey. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Evaluating Your Profile...</h2>
        <p className="text-muted-foreground mt-2">Our AI is analyzing your responses. This may take a moment.</p>
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
            {currentStep === 2 && (
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
            {currentStep === 3 && (
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
            {currentStep === 4 && (
              <>
                <FormField control={form.control} name="aspirations" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspirations Essay</FormLabel>
                    <FormControl><Textarea rows={6} placeholder="Tell us about yourself, your dreams, and why you are seeking support." {...field} /></FormControl>
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
