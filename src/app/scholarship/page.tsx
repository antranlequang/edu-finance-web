'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-neon';
import { useRouter } from 'next/navigation';
import { useEduscore } from '@/lib/eduscore-service';
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { Loader2, AlertCircle, Filter, CheckCircle, Star, TrendingUp } from 'lucide-react';

const allScholarships = [
  // Vietnamese Government Scholarships
  { 
    name: "Học bổng Chính phủ Việt Nam", 
    provider: "Bộ Giáo dục và Đào tạo", 
    amount: 2500, 
    minEduscore: 85, 
    deadline: "2025-03-31",
    category: "government",
    targetMajors: ["all"],
    description: "Học bổng toàn phần cho sinh viên xuất sắc trong và ngoài nước",
    benefits: ["Học phí miễn phí", "Trợ cấp sinh hoạt", "Bảo hiểm y tế"]
  },
  { 
    name: "Học bổng Vương Tài", 
    provider: "Quỹ Vương Tài", 
    amount: 1500, 
    minEduscore: 75, 
    deadline: "2025-02-28",
    category: "private",
    targetMajors: ["Economics", "Business Administration", "Finance Banking"],
    description: "Hỗ trợ sinh viên ngành kinh tế có hoàn cảnh khó khăn",
    benefits: ["Học phí một phần", "Cơ hội thực tập", "Mentoring"]
  },
  { 
    name: "Học bổng FPT", 
    provider: "Tập đoàn FPT", 
    amount: 3000, 
    minEduscore: 80, 
    deadline: "2025-01-15",
    category: "corporate",
    targetMajors: ["Computer Science", "Software Engineering", "Information Technology", "Data Science"],
    description: "Học bổng cho sinh viên IT có năng lực và đam mê công nghệ",
    benefits: ["Học phí toàn phần", "Thực tập có lương", "Cơ hội việc làm"]
  },
  { 
    name: "Học bổng Vinamilk", 
    provider: "Tập đoàn Vinamilk", 
    amount: 2000, 
    minEduscore: 70, 
    deadline: "2024-12-31",
    category: "corporate",
    targetMajors: ["Agriculture", "Food Technology", "Marketing", "Business Administration"],
    description: "Học bổng cho sinh viên ngành nông nghiệp và công nghệ thực phẩm",
    benefits: ["Hỗ trợ học phí", "Khóa đào tạo chuyên môn", "Thực tập tại nhà máy"]
  },
  { 
    name: "Học bổng BIDV", 
    provider: "Ngân hàng BIDV", 
    amount: 2500, 
    minEduscore: 78, 
    deadline: "2025-02-15",
    category: "corporate",
    targetMajors: ["Finance Banking", "Economics", "Accounting", "International Business"],
    description: "Học bổng cho sinh viên ngành tài chính ngân hàng",
    benefits: ["Học phí", "Thực tập tại BIDV", "Cơ hội việc làm sau tốt nghiệp"]
  },
  { 
    name: "Học bổng Toyota Việt Nam", 
    provider: "Toyota Motor Vietnam", 
    amount: 2200, 
    minEduscore: 82, 
    deadline: "2025-01-30",
    category: "corporate",
    targetMajors: ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
    description: "Học bổng cho sinh viên ngành kỹ thuật có tiềm năng",
    benefits: ["Học phí toàn phần", "Khóa đào tạo kỹ năng", "Thực tập tại Nhật Bản"]
  },
  { 
    name: "Học bổng Thiện Tâm", 
    provider: "Quỹ Thiện Tâm", 
    amount: 1000, 
    minEduscore: 65, 
    deadline: "2025-04-30",
    category: "charity",
    targetMajors: ["Medicine", "Pharmacy", "Nursing", "Education"],
    description: "Hỗ trợ sinh viên có hoàn cảnh khó khăn ngành y tế và giáo dục",
    benefits: ["Hỗ trợ sinh hoạt phí", "Sách vở học tập", "Tư vấn nghề nghiệp"]
  },
  { 
    name: "Học bổng Nâng bước em tới trường", 
    provider: "Tập đoàn TH True Milk", 
    amount: 800, 
    minEduscore: 60, 
    deadline: "2025-03-15",
    category: "charity",
    targetMajors: ["all"],
    description: "Học bổng cho sinh viên vùng nông thôn, miền núi",
    benefits: ["Hỗ trợ học phí", "Đồ dùng học tập", "Chương trình mentoring"]
  },
  // International Scholarships
  { 
    name: "ASEAN Undergraduate Scholarship", 
    provider: "ASEAN Foundation", 
    amount: 5000, 
    minEduscore: 88, 
    deadline: "2025-01-31",
    category: "international",
    targetMajors: ["International Relations", "Economics", "Law", "English Language"],
    description: "Scholarship for ASEAN students pursuing undergraduate studies",
    benefits: ["Full tuition", "Living allowance", "Cultural exchange program"]
  },
  { 
    name: "Australia Awards Scholarship", 
    provider: "Australian Government", 
    amount: 8000, 
    minEduscore: 90, 
    deadline: "2025-04-30",
    category: "international",
    targetMajors: ["Engineering", "Environmental Science", "Public Administration"],
    description: "Full scholarship for Vietnamese students to study in Australia",
    benefits: ["Full tuition & living costs", "Health insurance", "Return flights"]
  },
  { 
    name: "JICA Scholarship", 
    provider: "Japan International Cooperation Agency", 
    amount: 6000, 
    minEduscore: 85, 
    deadline: "2025-05-15",
    category: "international",
    targetMajors: ["Civil Engineering", "Transportation", "Environmental Science"],
    description: "Scholarship for development-focused studies in Japan",
    benefits: ["Full tuition", "Monthly stipend", "Japanese language training"]
  },
  { 
    name: "Korean Government Scholarship", 
    provider: "Korean Government", 
    amount: 7000, 
    minEduscore: 87, 
    deadline: "2025-03-31",
    category: "international",
    targetMajors: ["all"],
    description: "Full scholarship for undergraduate and graduate studies in Korea",
    benefits: ["Full tuition", "Monthly allowance", "Korean language course"]
  }
];

export default function ScholarshipPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [eduscore, setEduscore] = useState<number | null>(null);
    const [userMajor, setUserMajor] = useState<string | null>(null);
    const [isScoreLoading, setIsScoreLoading] = useState(true);
    const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [amountFilter, setAmountFilter] = useState<string>('all');
    const { getRecommendationContext } = useEduscore();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const context = getRecommendationContext();
        if (context) {
            setEduscore(context.eduscore);
            setUserMajor(context.major);
        } else {
            // Fallback to legacy localStorage
            const storedResult = localStorage.getItem('eduscoreResult');
            const storedSurvey = localStorage.getItem('surveyData');
            if (storedResult) {
                try {
                    const result = JSON.parse(storedResult);
                    setEduscore(result.eduscore);
                    if (storedSurvey) {
                        const surveyData = JSON.parse(storedSurvey);
                        setUserMajor(surveyData.major);
                    }
                } catch (e) {
                    console.error("Failed to parse eduscoreResult", e);
                }
            }
        }
        setIsScoreLoading(false);
    }, [getRecommendationContext]);

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
    
    // Filter scholarships based on various criteria
    const filteredScholarships = allScholarships
        .filter(s => {
            // EduScore filter
            if (showOnlyRecommended && eduscore) {
                return eduscore >= s.minEduscore;
            }
            return true;
        })
        .filter(s => {
            // Category filter
            if (categoryFilter === 'all') return true;
            return s.category === categoryFilter;
        })
        .filter(s => {
            // Amount filter
            if (amountFilter === 'all') return true;
            switch (amountFilter) {
                case 'low': return s.amount < 2000;
                case 'medium': return s.amount >= 2000 && s.amount < 5000;
                case 'high': return s.amount >= 5000;
                default: return true;
            }
        })
        .filter(s => {
            // Major relevance filter (when user has EduScore)
            if (userMajor && s.targetMajors.length > 0 && !s.targetMajors.includes('all')) {
                return s.targetMajors.includes(userMajor);
            }
            return true;
        });

    const matchedScholarships = eduscore ? filteredScholarships.filter(s => eduscore >= s.minEduscore) : [];
    const otherScholarships = eduscore ? filteredScholarships.filter(s => eduscore < s.minEduscore) : filteredScholarships;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow bg-whité">
                <div className="container mx-auto px-4 py-16 bg-">
                    {/* Main Content */}
                    <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center overflow-hidden ">
                        <div className="flex flex-col items-center">
                            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6 animate-fade-in">
                                HỌC BỔNG
                            </h1>
                            <p className="text-base md:text-2xl">Tìm kiếm các học bổng đang có hiện nay</p>
                        </div>
                    </div>
                    
                    {/* EduScore Status */}
                    {eduscore ? (
                        <Card className="max-w-4xl mx-auto bg-green-50 border-green-200 mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-800">
                                    <CheckCircle className="h-6 w-6" />
                                    EduScore của bạn: {eduscore}/100
                                    {userMajor && <Badge className="ml-2">{userMajor}</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <p className="text-green-700">
                                        Bạn đủ điều kiện cho {matchedScholarships.length} học bổng phù hợp với EduScore của mình
                                    </p>
                                    <Button 
                                        onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
                                        variant={showOnlyRecommended ? "default" : "outline"}
                                        size="sm"
                                    >
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        {showOnlyRecommended ? 'Hiện tất cả' : 'Chỉ gợi ý EduScore'}
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
                                <CardDescription>
                                    Hoàn thành đánh giá EduScore để xem học bổng phù hợp với bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-amber-700">EduScore giúp chúng tôi gợi ý học bổng phù hợp nhất với hồ sơ của bạn</p>
                                <Button asChild>
                                    <Link href="/eduscore">Làm EduScore ngay</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Filters */}
                    <Card className="max-w-6xl mx-auto p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Bộ lọc tìm kiếm
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Loại học bổng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả loại</SelectItem>
                                    <SelectItem value="government">Chính phủ</SelectItem>
                                    <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                                    <SelectItem value="charity">Từ thiện</SelectItem>
                                    <SelectItem value="international">Quốc tế</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={amountFilter} onValueChange={setAmountFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Giá trị học bổng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="low">Dưới $2,000</SelectItem>
                                    <SelectItem value="medium">$2,000 - $5,000</SelectItem>
                                    <SelectItem value="high">Trên $5,000</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Hiển thị {filteredScholarships.length} học bổng
                                </span>
                            </div>
                        </div>
                    </Card>
                    
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {filteredScholarships.map(s => <ScholarshipCard key={s.name} {...s} eduscore={eduscore} userMajor={userMajor} />)}
                        </div>
                        
                        {filteredScholarships.length === 0 && (
                            <Card className="p-12 text-center">
                                <p className="text-muted-foreground mb-4">Không tìm thấy học bổng phù hợp với tiêu chí của bạn</p>
                                <Button onClick={() => {
                                    setCategoryFilter('all');
                                    setAmountFilter('all');
                                    setShowOnlyRecommended(false);
                                }}>
                                    Xóa bộ lọc
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ScholarshipCard({ name, provider, amount, minEduscore, deadline, category, description, benefits, targetMajors, eduscore, userMajor }: typeof allScholarships[0] & { eduscore: number | null, userMajor: string | null }) {
    const isMatch = eduscore ? eduscore >= minEduscore : false;
    const isMajorMatch = userMajor && targetMajors.includes(userMajor) || targetMajors.includes('all');
    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const categoryColors = {
        government: 'bg-blue-100 text-blue-800',
        corporate: 'bg-purple-100 text-purple-800',
        charity: 'bg-green-100 text-green-800',
        international: 'bg-orange-100 text-orange-800',
        private: 'bg-gray-100 text-gray-800'
    };

    return (
        <Card className={`flex flex-col h-full relative ${isMatch ? 'border-green-300 shadow-lg' : ''}`}>
            {isMatch && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                    <Star className="h-4 w-4" />
                </div>
            )}
            
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                    <Badge className={categoryColors[category as keyof typeof categoryColors]}>{category}</Badge>
                    {isMajorMatch && <Badge variant="outline" className="text-xs">Ngành phù hợp</Badge>}
                </div>
                <CardTitle className="text-lg leading-tight">{name}</CardTitle>
                <CardDescription className="text-sm">{provider}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow space-y-3">
                <p className="text-2xl font-bold text-primary">${amount.toLocaleString()}</p>
                
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Min EduScore:</span>
                        <span className="font-semibold">{minEduscore}</span>
                    </div>
                    {eduscore && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Điểm của bạn:</span>
                                <span className={`font-semibold ${isMatch ? 'text-green-600' : 'text-red-600'}`}>{eduscore}</span>
                            </div>
                            <Progress value={Math.min((eduscore / minEduscore) * 100, 100)} className="h-2" />
                        </>
                    )}
                </div>

                <div>
                    <span className="font-medium text-sm">Lợi ích:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                {isMatch && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Phù hợp với EduScore của bạn
                    </Badge>
                )}
            </CardContent>

            <CardFooter className="pt-3 space-y-2">
                <p className="text-xs text-muted-foreground w-full text-center">
                    {daysLeft > 0 ? `Còn ${daysLeft} ngày để nộp đơn` : 'Đã hết hạn'}
                </p>
                <Button className="w-full" variant={isMatch ? "default" : "outline"} disabled={daysLeft <= 0}>
                    {daysLeft <= 0 ? 'Hết hạn' : 'Tìm hiểu thêm'}
                </Button>
            </CardFooter>
        </Card>
    );
}

