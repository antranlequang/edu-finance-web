import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase } from "lucide-react";

const jobs = [
    { title: "Junior Web Developer Intern", company: "Innovatech Solutions", location: "Remote", type: "Internship", tags: ["React", "Node.js", "Web Dev"] },
    { title: "Marketing Assistant (Part-Time)", company: "Growth Wizards", location: "New York, NY", type: "Part-Time", tags: ["Social Media", "SEO", "Marketing"] },
    { title: "Data Analyst Intern", company: "DataDriven Inc.", location: "San Francisco, CA", type: "Internship", tags: ["SQL", "Python", "Tableau"] },
    { title: "Graphic Design Intern", company: "Creative Minds Agency", location: "Remote", type: "Internship", tags: ["Photoshop", "Illustrator", "UI/UX"] },
    { title: "Business Development Trainee", company: "Future Corp", location: "Chicago, IL", type: "Full-Time", tags: ["Sales", "CRM", "Business"] },
    { title: "Software Engineer Co-op", company: "CodeCrafters", location: "Boston, MA", type: "Co-op", tags: ["Java", "Spring", "Cloud"] },
];

export default function JobPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <section className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 mb-12">
                    <h1 className="text-4xl font-bold mb-3">Find Your Next Opportunity</h1>
                    <p className="text-lg text-primary-foreground/80 mb-6">Search for internships, part-time, and full-time jobs for students.</p>
                    <div className="bg-background rounded-lg p-2 flex flex-col md:flex-row gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Job title, keyword, or company" className="pl-10 h-12 text-base" />
                        </div>
                        <div className="relative flex-grow">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="City, state, or remote" className="pl-10 h-12 text-base" />
                        </div>
                        <Button size="lg" className="h-12 w-full md:w-auto">Search Jobs</Button>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard key={job.title} {...job} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

function JobCard({ title, company, location, type, tags }: typeof jobs[0]) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-primary font-medium">{company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{type}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
        </Card>
    );
}
