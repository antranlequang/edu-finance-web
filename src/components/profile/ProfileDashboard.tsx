
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Award, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function ProfileDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [eduscoreResult, setEduscoreResult] = useState<{ eduscore: number; reasoning: string } | null>(null);
  const [isScoreLoading, setIsScoreLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
        const storedResult = localStorage.getItem('eduscoreResult');
        if (storedResult) {
          try {
            setEduscoreResult(JSON.parse(storedResult));
          } catch (e) {
            console.error("Failed to parse eduscoreResult from localStorage", e);
            localStorage.removeItem('eduscoreResult');
          }
        }
    }
    setIsScoreLoading(false);
  }, [user]);

  if (loading || !user || isScoreLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = eduscoreResult ? [{ name: 'Eduscore', value: eduscoreResult.eduscore, fill: 'hsl(var(--primary))' }] : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || user.email || 'Student'}!</h1>
      <p className="text-muted-foreground mb-8">This is your personal dashboard. Track your progress and find opportunities.</p>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            {user.role === 'admin' && (
              <Card className="bg-primary/10 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LayoutDashboard />
                        Admin Access
                    </CardTitle>
                    <CardDescription>You have administrative privileges.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Access the admin dashboard to manage users, applications, and site content.</p>
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
                    </Button>
                </CardFooter>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award /> Your Eduscore</CardTitle>
                {!eduscoreResult && (
                  <CardDescription>
                    You haven&apos;t completed the survey yet. Your Eduscore helps match you with scholarships.
                  </CardDescription>
                )}
              </CardHeader>
              {eduscoreResult ? (
                <>
                  <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar background dataKey='value' cornerRadius={10} />
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-foreground">
                            {eduscoreResult.eduscore}
                          </text>
                          <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-md fill-muted-foreground">
                            / 100
                          </text>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-primary">AI Evaluation Summary</h3>
                        <p className="text-sm text-muted-foreground italic">&quot;{eduscoreResult.reasoning}&quot;</p>
                    </div>
                  </CardContent>
                  <CardFooter className='flex-col items-start gap-4'>
                    <p className='text-sm text-muted-foreground'>Your score is now being used to recommend scholarships for you.</p>
                    <Button asChild>
                        <Link href="/scholarship">
                            View Matching Scholarships <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center text-center p-12">
                  <p className="text-muted-foreground mb-4">Complete the Eduscore survey to unlock financial aid opportunities and personalized scholarship matching.</p>
                  <Button asChild>
                    <Link href="/survey">Take the Survey</Link>
                  </Button>
                </CardContent>
              )}
            </Card>
        </div>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
                <p className="font-semibold">Name</p> 
                <p className="text-muted-foreground">{user.name || 'Not set'}</p>
            </div>
            <div className="text-sm">
                <p className="font-semibold">Email</p> 
                <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="text-sm">
                <p className="font-semibold">Role</p> 
                <p className="text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button variant="outline" className="w-full mt-4 !mb-0">Edit Profile</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
