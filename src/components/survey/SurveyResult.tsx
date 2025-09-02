'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { EvaluateEduscoreSurveyOutput } from '@/ai/flows/evaluate-eduscore-survey';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SurveyResultProps {
  result: EvaluateEduscoreSurveyOutput;
}

export default function SurveyResult({ result }: SurveyResultProps) {
  const { eduscore, reasoning } = result;

  const chartData = [
    { name: 'Eduscore', value: eduscore, fill: 'hsl(var(--primary))' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
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
        <CardFooter className="flex justify-center">
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
