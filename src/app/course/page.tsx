import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star } from "lucide-react";

const courses = [
    { title: "Web Development Bootcamp", category: "Technology", price: "Paid", rating: 4.8, students: 1250, image: "https://picsum.photos/400/200?random=1", dataAiHint: "laptop code" },
    { title: "Introduction to Business", category: "Business", price: "Free", rating: 4.5, students: 850, image: "https://picsum.photos/400/200?random=2", dataAiHint: "business meeting" },
    { title: "Graphic Design Masterclass", category: "Design", price: "Paid", rating: 4.9, students: 2100, image: "https://picsum.photos/400/200?random=3", dataAiHint: "design tools" },
    { title: "Data Science with Python", category: "Technology", price: "Paid", rating: 4.7, students: 1800, image: "https://picsum.photos/400/200?random=4", dataAiHint: "data graph" },
    { title: "The Science of Well-being", category: "Science", price: "Free", rating: 4.9, students: 5400, image: "https://picsum.photos/400/200?random=5", dataAiHint: "person meditating" },
    { title: "Digital Marketing Essentials", category: "Business", price: "Paid", rating: 4.6, students: 980, image: "https://picsum.photos/400/200?random=6", dataAiHint: "social media" },
    { title: "UI/UX Design Fundamentals", category: "Design", price: "Free", rating: 4.7, students: 3200, image: "https://picsum.photos/400/200?random=7", dataAiHint: "app interface" },
    { title: "Quantum Physics Explained", category: "Science", price: "Paid", rating: 4.8, students: 600, image: "https://picsum.photos/400/200?random=8", dataAiHint: "atom model" },
];

export default function CoursePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Main Content */}
                <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center overflow-hidden ">
                    <div className="flex flex-col items-center">
                        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6 animate-fade-in">
                            KHÓA HỌC
                        </h1>
                        <p className="text-base md:text-2xl">Khóa học phù hợp cho học sinh, sinh viên</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-8 ">
                    <aside className="md:col-span-1 ">
                        <Card className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 text-white">
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Category</h3>
                                    <div className="space-y-2">
                                        <FilterCheckbox id="tech" label="Technology" />
                                        <FilterCheckbox id="business" label="Business" />
                                        <FilterCheckbox id="design" label="Design" />
                                        <FilterCheckbox id="science" label="Science" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">Price</h3>
                                    <div className="space-y-2">
                                        <FilterCheckbox id="free" label="Free" />
                                        <FilterCheckbox id="paid" label="Paid" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800">Apply Filters</Button>
                            </CardFooter>
                        </Card>
                    </aside>

                    <section className="md:col-span-3">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {courses.map(course => (
                                <CourseCard key={course.title} {...course} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function FilterCheckbox({ id, label }: { id: string, label: string }) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={id} />
            <Label htmlFor={id} className="font-normal text-sm">{label}</Label>
        </div>
    );
}

function CourseCard({ title, category, price, rating, students, image, dataAiHint }: typeof courses[0]) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
             <div className="relative w-full h-48">
                <Image src={image} alt={title} data-ai-hint={dataAiHint} layout="fill" objectFit="cover" />
             </div>
            <CardHeader>
                <Badge variant={price === 'Free' ? 'secondary' : 'default'} className="absolute top-3 right-3">{price}</Badge>
                <CardTitle className="text-xl mt-2">{title}</CardTitle>
                <CardDescription>{category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 {/* Can add more details here later */}
            </CardContent>
            <CardFooter className="p-4 pt-2 border-t flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{rating}</span>
                </div>
                <span>{students.toLocaleString()} students</span>
            </CardFooter>
        </Card>
    );
}
