'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { Loader2, AlertCircle, Award } from 'lucide-react';

const allScholarships = [
  { name: "Future Leaders Grant", provider: "Tech Innovators Foundation", amount: 5000, minEduscore: 85, deadline: "2024-12-31" },
  { name: "Creative Minds Scholarship", provider: "Arts & Culture Council", amount: 3000, minEduscore: 75, deadline: "2024-11-30" },
  { name: "STEM Achievers Award", provider: "Science & Eng. Society", amount: 10000, minEduscore: 90, deadline: "2025-01-15" },
  { name: "Community First Scholarship", provider: "Local Goodwill Org", amount: 2000, minEduscore: 70, deadline: "2024-12-01" },
  { name: "Phoenix Scholars Program", provider: "Rise Up Foundation", amount: 7500, minEduscore: 80, deadline: "2025-02-01" },
  { name: "Global Citizen Grant", provider: "One World United", amount: 4000, minEduscore: 65, deadline: "2024-11-15" },
];

export default function ScholarshipPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [eduscore, setEduscore] = useState<number | null>(null);
    const [isScoreLoading, setIsScoreLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const storedResult = localStorage.getItem('eduscoreResult');
        if (storedResult) {
            try {
                const result = JSON.parse(storedResult);
                setEduscore(result.eduscore);
            } catch (e) {
                console.error("Failed to parse eduscoreResult", e);
            }
        }
        setIsScoreLoading(false);
    }, []);

    if (loading || isScoreLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }
    
    const matchedScholarships = eduscore ? allScholarships.filter(s => eduscore >= s.minEduscore) : [];
    const otherScholarships = eduscore ? allScholarships.filter(s => eduscore < s.minEduscore) : allScholarships;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-secondary">
                <div className="container mx-auto px-4 py-16">
                    <section className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Scholarship Opportunities</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
                            Discover financial aid opportunities tailored to your profile.
                        </p>
                    </section>
                    
                    {!eduscore && (
                        <Card className="max-w-2xl mx-auto bg-background text-center">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center gap-2"><AlertCircle className="text-amber-500" /> Unlock Personalized Matches</CardTitle>
                                <CardDescription>Complete your Eduscore survey to see which scholarships you are eligible for.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Your Eduscore is a key criterion for many scholarships on our platform.</p>
                                <Button asChild>
                                    <Link href="/survey">Take the Survey Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {eduscore && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-center mb-6">Your Matched Scholarships ({matchedScholarships.length})</h2>
                            {matchedScholarships.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {matchedScholarships.map(s => <ScholarshipCard key={s.name} {...s} eduscore={eduscore} />)}
                                </div>
                             ) : (
                                <p className="text-center text-muted-foreground">No scholarships match your current Eduscore. Keep improving your profile!</p>
                             )}
                        </div>
                    )}
                    
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-6">{eduscore ? 'Other Opportunities' : 'Available Scholarships'} ({otherScholarships.length})</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {otherScholarships.map(s => <ScholarshipCard key={s.name} {...s} eduscore={eduscore} />)}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ScholarshipCard({ name, provider, amount, minEduscore, deadline, eduscore }: typeof allScholarships[0] & { eduscore: number | null }) {
    const isMatch = eduscore ? eduscore >= minEduscore : false;
    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <Card className={`flex flex-col h-full ${isMatch ? 'border-primary' : ''}`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Award className={`w-10 h-10 ${isMatch ? 'text-primary' : 'text-muted-foreground'}`} />
                    {isMatch && <Badge>Matched</Badge>}
                </div>
                <CardTitle className="pt-2">{name}</CardTitle>
                <CardDescription>{provider}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-3xl font-bold text-primary mb-2">${amount.toLocaleString()}</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Min. Eduscore</span>
                        <span className="font-semibold">{minEduscore}</span>
                    </div>
                    {eduscore && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Your Eduscore</span>
                                <span className={`font-semibold ${isMatch ? 'text-green-600' : 'text-red-600'}`}>{eduscore}</span>
                            </div>
                            <Progress value={Math.min((eduscore / minEduscore) * 100, 100)} className="h-2" />
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-3">
                 <p className="text-xs text-muted-foreground w-full text-center">
                    {daysLeft > 0 ? `Apply within ${daysLeft} days` : 'Application closed'}
                </p>
                <Button className="w-full" disabled={!isMatch || daysLeft <= 0}>Apply Now</Button>
            </CardFooter>
        </Card>
    );
}

