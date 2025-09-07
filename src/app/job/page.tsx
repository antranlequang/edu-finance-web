"use client";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Clock, DollarSign, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useEduscore } from "@/lib/eduscore-service";

const jobs = [
    // Tech Jobs
    { title: "Junior Web Developer", company: "FPT Software", location: "Hồ Chí Minh", type: "Full-Time", salary: "15-20 triệu VND", experience: "0-1 năm", tags: ["React", "Node.js", "JavaScript"] },
    { title: "Mobile App Developer Intern", company: "VNG Corporation", location: "Hà Nội", type: "Internship", salary: "5-8 triệu VND", experience: "Sinh viên", tags: ["Flutter", "React Native", "Mobile"] },
    { title: "Data Analyst", company: "Tiki", location: "Hồ Chí Minh", type: "Full-Time", salary: "18-25 triệu VND", experience: "1-2 năm", tags: ["SQL", "Python", "Analytics"] },
    { title: "UI/UX Designer", company: "Grab Vietnam", location: "Hà Nội", type: "Part-Time", salary: "12-18 triệu VND", experience: "0-2 năm", tags: ["Figma", "Design", "UX"] },
    
    // Service Jobs
    { title: "Nhân viên phục vụ", company: "Highland Coffee", location: "Hồ Chí Minh", type: "Part-Time", salary: "4-6 triệu VND", experience: "Không yêu cầu", tags: ["Dịch vụ khách hàng", "Làm việc nhóm", "Giao tiếp"] },
    { title: "Waiter/Waitress", company: "Pizza Hut", location: "Đà Nẵng", type: "Part-Time", salary: "4.5-7 triệu VND", experience: "0-1 năm", tags: ["Customer Service", "Food Service", "Team Work"] },
    { title: "Bartender", company: "Rooftop Bar Saigon", location: "Hồ Chí Minh", type: "Full-Time", salary: "8-12 triệu VND", experience: "1-2 năm", tags: ["Cocktails", "Customer Service", "Evening Shift"] },
    
    // Office Jobs
    { title: "Nhân viên văn phòng", company: "Vietcombank", location: "Hà Nội", type: "Full-Time", salary: "12-16 triệu VND", experience: "0-1 năm", tags: ["MS Office", "Administration", "Banking"] },
    { title: "Administrative Assistant", company: "Samsung Vietnam", location: "Bắc Ninh", type: "Full-Time", salary: "10-14 triệu VND", experience: "0-2 năm", tags: ["Office", "Organization", "Communication"] },
    { title: "HR Assistant", company: "Unilever Vietnam", location: "Hồ Chí Minh", type: "Part-Time", salary: "8-12 triệu VND", experience: "Sinh viên", tags: ["HR", "Recruitment", "People Skills"] },
    
    // Sales & Marketing
    { title: "Sales Representative", company: "Vinamilk", location: "Hà Nội", type: "Full-Time", salary: "10-15 triệu VND + Hoa hồng", experience: "0-1 năm", tags: ["Sales", "Communication", "FMCG"] },
    { title: "Digital Marketing Intern", company: "Shopee Vietnam", location: "Hồ Chí Minh", type: "Internship", salary: "6-9 triệu VND", experience: "Sinh viên", tags: ["Digital Marketing", "Social Media", "E-commerce"] },
    { title: "Content Creator", company: "TikTok Vietnam", location: "Hà Nội", type: "Part-Time", salary: "8-15 triệu VND", experience: "0-1 năm", tags: ["Content", "Social Media", "Creative"] },
    
    // Retail & Customer Service
    { title: "Cashier", company: "Lotte Mart", location: "Hồ Chí Minh", type: "Part-Time", salary: "4-6 triệu VND", experience: "Không yêu cầu", tags: ["Retail", "Customer Service", "POS"] },
    { title: "Store Assistant", company: "The Gioi Di Dong", location: "Đà Nẵng", type: "Full-Time", salary: "7-10 triệu VND", experience: "0-1 năm", tags: ["Retail", "Electronics", "Sales"] },
    { title: "Customer Service Representative", company: "Viettel", location: "Hà Nội", type: "Full-Time", salary: "8-12 triệu VND", experience: "0-1 năm", tags: ["Call Center", "Support", "Communication"] },
    
    // Education & Training
    { title: "English Tutor", company: "ILA Vietnam", location: "Hồ Chí Minh", type: "Part-Time", salary: "150-250k VND/giờ", experience: "0-1 năm", tags: ["Teaching", "English", "Education"] },
    { title: "Teaching Assistant", company: "RMIT Vietnam", location: "Hà Nội", type: "Part-Time", salary: "100-200k VND/giờ", experience: "Sinh viên", tags: ["Education", "Support", "University"] },
    
    // Delivery & Logistics
    { title: "Delivery Driver", company: "Grab Food", location: "Hồ Chí Minh", type: "Part-Time", salary: "6-12 triệu VND", experience: "Không yêu cầu", tags: ["Delivery", "Driver License", "Flexible Hours"] },
    { title: "Warehouse Staff", company: "Lazada Vietnam", location: "Bình Dương", type: "Full-Time", salary: "8-11 triệu VND", experience: "0-1 năm", tags: ["Warehouse", "Logistics", "Physical Work"] },
];

export default function JobPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showRecommended, setShowRecommended] = useState(false);
    const [eduscoreContext, setEduscoreContext] = useState<any>(null);
    const { getRecommendationContext } = useEduscore();

    useEffect(() => {
        const context = getRecommendationContext();
        setEduscoreContext(context);
    }, [getRecommendationContext]);

    const filteredJobs = jobs
        .filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter(job => locationFilter === "" || job.location.includes(locationFilter))
        .filter(job => typeFilter === "" || typeFilter === "all" || job.type === typeFilter)
        .filter(job => {
            if (!showRecommended || !eduscoreContext) return true;
            // Recommend jobs based on major and technical skills
            const userSkills = eduscoreContext.technicalSkills || [];
            return job.tags.some(tag => userSkills.some((skill: string) => skill.toLowerCase().includes(tag.toLowerCase())));
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "salary":
                    const salaryA = parseInt(a.salary.replace(/[^\d]/g, ''));
                    const salaryB = parseInt(b.salary.replace(/[^\d]/g, ''));
                    return salaryB - salaryA;
                case "location":
                    return a.location.localeCompare(b.location);
                case "type":
                    return a.type.localeCompare(b.type);
                case "company":
                    return a.company.localeCompare(b.company);
                default:
                    return 0;
            }
        });

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Main Content */}
                <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center overflow-hidden ">
                    <div className="flex flex-col items-center">
                        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6 animate-fade-in">
                            TÌM KIẾM VIỆC LÀM
                        </h1>
                        <p className="text-base md:text-2xl">Nền tảng cung cấp tất cả việc làm phù hợp cho người dùng</p>
                    </div>
                </div>

                {/* EduScore Integration Section */}
                {eduscoreContext ? (
                    <Card className="max-w-4xl mx-auto bg-green-50 border-green-200 mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <CheckCircle className="h-6 w-6" />
                                EduScore của bạn: {eduscoreContext.eduscore}/100
                                {eduscoreContext.major && <Badge className="ml-2">{eduscoreContext.major}</Badge>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-green-700 mb-2">Chúng tôi sẽ gợi ý việc làm phù hợp với kỹ năng và chuyên ngành của bạn</p>
                                    <p className="text-sm text-muted-foreground">
                                        Kỹ năng của bạn: {eduscoreContext.technicalSkills.slice(0, 3).join(', ')}
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => setShowRecommended(!showRecommended)}
                                    variant={showRecommended ? "default" : "outline"}
                                    size="sm"
                                >
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    {showRecommended ? 'Hiện tất cả' : 'Chỉ gợi ý'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="max-w-2xl mx-auto bg-amber-50 border-amber-200 text-center mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2 text-amber-800">
                                <AlertCircle className="text-amber-500" /> 
                                Chưa có EduScore
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-amber-700">Hoàn thành EduScore để nhận gợi ý việc làm phù hợp với hồ sơ của bạn</p>
                            <Button asChild>
                                <Link href="/eduscore">Làm EduScore ngay</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <section className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 text-primary-foreground rounded-lg p-8 md:p-12 mb-8">
                    <h1 className="text-4xl font-bold mb-3">Tìm kiếm cơ hội việc làm</h1>
                    <p className="text-lg text-primary-foreground/80 mb-6">Tìm việc làm toàn thời gian, bán thời gian và thực tập tại Việt Nam</p>
                    <div className="bg-background rounded-lg p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Tên công việc, từ khóa, hoặc công ty" 
                                    className="pl-10 h-12 text-base"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative flex-grow">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Thành phố hoặc tỉnh" 
                                    className="pl-10 h-12 text-base"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                />
                            </div>
                            <Button size="lg" className="h-12 w-full md:w-auto">Tìm việc</Button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 text-gray-500">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Loại công việc" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    <SelectItem value="Full-Time">Toàn thời gian</SelectItem>
                                    <SelectItem value="Part-Time">Bán thời gian</SelectItem>
                                    <SelectItem value="Internship">Thực tập</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="salary">Mức lương</SelectItem>
                                    <SelectItem value="location">Địa điểm</SelectItem>
                                    <SelectItem value="type">Loại công việc</SelectItem>
                                    <SelectItem value="company">Công ty</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <div className="mb-6">
                    <p className="text-muted-foreground">
                        Hiển thị {filteredJobs.length} công việc
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard key={`${job.title}-${job.company}`} {...job} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

function JobCard({ title, company, location, type, salary, experience, tags }: typeof jobs[0]) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-lg leading-tight">{title}</CardTitle>
                <CardDescription className="text-primary font-medium">{company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate text-green-600 font-medium">{salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{experience}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                    {tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{tags.length - 3}</Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">Xem chi tiết</Button>
            </CardFooter>
        </Card>
    );
}
