'use server';

/**
 * @fileOverview Evaluates the Eduscore survey responses and provides an Eduscore.
 *
 * - evaluateEduscoreSurvey - A function that handles the Eduscore survey evaluation process.
 * - EvaluateEduscoreSurveyInput - The input type for the evaluateEduscoreSurvey function.
 * - EvaluateEduscoreSurveyOutput - The return type for the evaluateEduscoreSurvey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateEduscoreSurveyInputSchema = z.object({
  academicInfoGPA: z
    .number()
    .describe('Grade Point Average on a 4.0 scale.'),
  academicInfoTranscriptDataUri: z
    .string()
    .describe(
      "The student's academic transcript, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  extracurricularActivities: z
    .string()
    .describe('List of extracurricular activities the student participated in.'),
  awards: z.string().describe('Awards or special achievements.'),
  familyIncome: z
    .string()
    .describe('Total monthly income of the family (tranche).'),
  dependents: z.number().describe('Number of dependents in the family.'),
  valuableAssets: z
    .string()
    .describe('Information about valuable assets owned by the family.'),
  medicalExpenses: z
    .string()
    .describe('Information about special medical expenses of the family.'),
  specialCircumstances: z
    .string()
    .describe('Information about any special circumstances faced by the family.'),
  aspirations: z
    .string()
    .describe('A short essay about the student, their dreams and reasons for seeking support.'),
  recommendationLetterDataUri: z
    .string()
    .describe(
      'A recommendation letter from a teacher or local authority as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});

export type EvaluateEduscoreSurveyInput = z.infer<
  typeof EvaluateEduscoreSurveyInputSchema
>;

const EvaluateEduscoreSurveyOutputSchema = z.object({
  eduscore: z
    .number()
    .describe('The Eduscore representing the overall qualifications of the student.'),
  reasoning: z.string().describe('Reasoning for Eduscore assigned.'),
});

export type EvaluateEduscoreSurveyOutput = z.infer<
  typeof EvaluateEduscoreSurveyOutputSchema
>;

export async function evaluateEduscoreSurvey(
  input: EvaluateEduscoreSurveyInput
): Promise<EvaluateEduscoreSurveyOutput> {
  return evaluateEduscoreSurveyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateEduscoreSurveyPrompt',
  input: {schema: EvaluateEduscoreSurveyInputSchema},
  output: {schema: EvaluateEduscoreSurveyOutputSchema},
  prompt: `You are an expert evaluator assessing student applications for financial aid.

  Evaluate the following Eduscore survey responses based on a proprietary rubric, and provide an Eduscore (out of 100) representing the overall qualifications of the student.

  Consider the following factors:
  - Academic performance (GPA, transcript)
  - Extracurricular activities and awards
  - Family income and assets
  - Special circumstances
  - Aspirations and recommendations

  Explain the reasoning behind the Eduscore assigned. Be brief and specific.

  Academic Info GPA: {{{academicInfoGPA}}}
  Academic Info Transcript: {{media url=academicInfoTranscriptDataUri}}
  Extracurricular Activities: {{{extracurricularActivities}}}
  Awards: {{{awards}}}
  Family Income: {{{familyIncome}}}
  Dependents: {{{dependents}}}
  Valuable Assets: {{{valuableAssets}}}
  Medical Expenses: {{{medicalExpenses}}}
  Special Circumstances: {{{specialCircumstances}}}
  Aspirations: {{{aspirations}}}
  Recommendation Letter: {{media url=recommendationLetterDataUri}}`,
});

const evaluateEduscoreSurveyFlow = ai.defineFlow(
  {
    name: 'evaluateEduscoreSurveyFlow',
    inputSchema: EvaluateEduscoreSurveyInputSchema,
    outputSchema: EvaluateEduscoreSurveyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
