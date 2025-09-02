import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PiggyBank, Landmark, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FinancePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <section className="relative bg-secondary py-20 md:py-32">
                     <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Fund Your Future</h1>
                            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
                                Explore flexible learning loans and financial support options designed for students. We're here to help you invest in your education without the financial stress.
                            </p>
                            <Button size="lg" className="mt-8">
                                Check Eligibility <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                        <div className="relative h-64 md:h-80">
                            <Image 
                                src="https://picsum.photos/600/400"
                                data-ai-hint="student graduation savings"
                                alt="Student saving for education"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                     </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Financial Support?</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                We partner with leading financial institutions to bring you the best options.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                           <FeatureCard 
                             icon={<PiggyBank className="w-12 h-12 text-primary" />}
                             title="Student-First Rates"
                             description="Competitive interest rates and flexible repayment terms that start after you graduate."
                           />
                           <FeatureCard 
                             icon={<Landmark className="w-12 h-12 text-primary" />}
                             title="Trusted Partners"
                             description="We collaborate with reputable banks and financial institutions to ensure your peace of mind."
                           />
                           <FeatureCard 
                             icon={<ShieldCheck className="w-12 h-12 text-primary" />}
                             title="Secure & Transparent"
                             description="A clear and simple application process with no hidden fees. Your data is always protected."
                           />
                        </div>
                    </div>
                </section>
                
                <section className="bg-secondary py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to take the next step?</h2>
                        <p className="mt-4 text-lg text-muted-foreground mb-8">
                            Our simple, 3-step process makes it easy to get started.
                        </p>
                        <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                           <Link href="/survey">Start Your Application</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function FeatureCard({icon, title, description}: {icon: React.ReactNode, title: string, description: string}) {
    return (
        <Card className="p-6">
            <CardHeader className="items-center">
                {icon}
                <CardTitle className="mt-4">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
