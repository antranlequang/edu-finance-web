'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { EvaluateEduscoreSurveyOutput } from '@/ai/flows/evaluate-eduscore-survey';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Target, Briefcase, Download, Loader2 } from 'lucide-react';
import { analyzeJobRequirements, JobRequirementAnalysis } from '@/lib/job-analysis-service';
import { generatePDFReport } from '@/lib/pdf-service';

interface SurveyResultProps {
  result: EvaluateEduscoreSurveyOutput;
}

export default function SurveyResult({ result }: SurveyResultProps) {
  const { eduscore, reasoning } = result;
  const [jobAnalysis, setJobAnalysis] = useState<JobRequirementAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const chartData = [
    { name: 'Eduscore', value: eduscore, fill: 'hsl(var(--primary))' },
  ];

  useEffect(() => {
    const analyzeProfile = async () => {
      setIsAnalyzing(true);
      try {
        // Get stored survey data from localStorage
        const storedData = localStorage.getItem('eduscoreResult');
        const surveyData = localStorage.getItem('surveyData');
        
        if (storedData && surveyData) {
          const parsedSurveyData = JSON.parse(surveyData);
          const eduscoreData = {
            score: eduscore,
            reasoning,
            major: parsedSurveyData.major || 'General Studies',
            currentYear: parsedSurveyData.currentYear || '1st Year',
            university: parsedSurveyData.university || 'Unknown University',
            academicInfoGPA: parsedSurveyData.academicInfoGPA || 3.0,
            extracurricularActivities: parsedSurveyData.extracurricularActivities || 'None',
            awards: parsedSurveyData.awards || 'None',
            aspirations: parsedSurveyData.aspirations || 'None provided',
          };
          
          const analysis = await analyzeJobRequirements(eduscoreData);
          setJobAnalysis(analysis);
        }
      } catch (error) {
        console.error('Error analyzing profile:', error);
        // Set default analysis in case of error
        setJobAnalysis({
          strengths: ['Academic dedication', 'Strong motivation'],
          weaknesses: ['Limited work experience', 'Need more industry exposure'],
          recommendations: ['Gain practical experience', 'Build professional network', 'Develop technical skills'],
          suitableJobTypes: ['Entry-level positions', 'Internships', 'Graduate trainee programs'],
          skillsToImprove: ['Communication skills', 'Technical skills', 'Leadership abilities']
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeProfile();
  }, [eduscore, reasoning]);

  const downloadPDF = () => {
    try {
      const surveyData = localStorage.getItem('surveyData');
      const parsedSurveyData = surveyData ? JSON.parse(surveyData) : {};
      
      generatePDFReport({
        eduscore,
        reasoning,
        userName: parsedSurveyData.university ? `Student from ${parsedSurveyData.university}` : 'Student',
        major: parsedSurveyData.major || 'Unknown Major',
        university: parsedSurveyData.university || 'Unknown University',
        jobAnalysis: jobAnalysis || undefined,
        generatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to generate PDF report. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Your Eduscore Result</CardTitle>
          <CardDescription>This score reflects your overall profile based on the information provided.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="70%" 
                  outerRadius="100%" 
                  data={chartData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey='value'
                    cornerRadius={10}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-5xl font-bold fill-foreground"
                  >
                    {eduscore}
                  </text>
                   <text
                    x="50%"
                    y="65%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-lg fill-muted-foreground"
                  >
                    / 100
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2 text-primary">AI-Powered Evaluation</h3>
              <p className="text-muted-foreground italic">"{reasoning}"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Analyzing your profile and job market requirements...</span>
          </CardContent>
        </Card>
      ) : jobAnalysis && (
        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Areas to Improve</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="jobs">Suitable Jobs</TabsTrigger>
            <TabsTrigger value="skills">Skills to Develop</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Your Strengths
                </CardTitle>
                <CardDescription>Based on your profile, these are your key strengths in the job market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {jobAnalysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-green-800">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weaknesses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Areas to Improve
                </CardTitle>
                <CardDescription>Focus on these areas to enhance your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {jobAnalysis.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-orange-800">{weakness}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Action Plan
                </CardTitle>
                <CardDescription>Specific steps to improve your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {jobAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Suitable Job Opportunities
                </CardTitle>
                <CardDescription>Job types that match your current profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {jobAnalysis.suitableJobTypes.map((job, index) => (
                    <Badge key={index} variant="outline" className="text-purple-700 border-purple-200 justify-start p-3">
                      {job}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Skills to Develop
                </CardTitle>
                <CardDescription>Focus on these skills to boost your employability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {jobAnalysis.skillsToImprove.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="justify-start p-3 bg-indigo-50 text-indigo-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={downloadPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
          <Link href="/profile">
            <Button>
              Go to Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
