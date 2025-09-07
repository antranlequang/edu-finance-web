
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Award, ArrowRight, LayoutDashboard, Shield, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { getAccountLevelName } from '@/lib/utils';
import type { EduscoreData, VerificationDocument } from '@/lib/database-operations';

export default function ProfileDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [eduscoreResult, setEduscoreResult] = useState<EduscoreData | null>(null);
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>([]);
  const [isScoreLoading, setIsScoreLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load Eduscore from API
          const eduscoreResponse = await fetch('/api/user/eduscore');
          if (eduscoreResponse.ok) {
            const { eduscore } = await eduscoreResponse.json();
            if (eduscore) {
              setEduscoreResult(eduscore);
            } else {
              // Fallback to localStorage for backwards compatibility
              const storedResult = localStorage.getItem('eduscoreResult');
              if (storedResult) {
                setEduscoreResult(JSON.parse(storedResult));
              }
            }
          }
          
          // Load verification documents from API
          const docsResponse = await fetch('/api/user/documents');
          if (docsResponse.ok) {
            const { documents } = await docsResponse.json();
            setVerificationDocs(documents);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      setIsScoreLoading(false);
    };
    
    loadUserData();
  }, [user]);

  if (loading || !user || isScoreLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = eduscoreResult ? [{ name: 'Eduscore', value: eduscoreResult.score, fill: 'hsl(var(--primary))' }] : [];
  
  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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
                            {eduscoreResult.score}
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
        
        <div className="space-y-6">
          <Card>
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
              <div className="text-sm">
                  <p className="font-semibold">Account Level</p> 
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getAccountLevelName(user.accountLevel)}</Badge>
                    <span className="text-muted-foreground text-xs">Level {user.accountLevel}</span>
                  </div>
              </div>
              <div className="text-sm">
                  <p className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verification Status
                  </p> 
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getVerificationStatusColor(user.verificationStatus)}`} />
                    <p className="text-muted-foreground capitalize">{user.verificationStatus}</p>
                  </div>
              </div>
              {verificationDocs.length > 0 && (
                <div className="text-sm">
                  <p className="font-semibold flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Documents ({verificationDocs.length})
                  </p>
                  <div className="space-y-1 mt-1">
                    {verificationDocs.slice(0, 3).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{doc.name}</span>
                        <Badge 
                          variant={doc.status === 'verified' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" className="w-full">Edit Profile</Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/verification">Document Verification</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
