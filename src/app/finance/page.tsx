'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Star, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEduscore } from "@/lib/eduscore-service";

// Vietnamese bank loan packages data
const loanPackages = [
  // Major Vietnamese banks
  {
    id: 1,
    bank: "Vietcombank",
    package: "Gói vay học phí sinh viên",
    interestRate: "6.5% - 8.5%",
    maxAmount: "200 triệu VND",
    term: "Tối đa 15 năm",
    requirements: ["Sinh viên chính quy", "Bảo lãnh của bố mẹ", "Giấy tờ học tập"],
    features: ["Gia hạn nợ gốc trong thời gian học", "Lãi suất ưu đãi", "Thủ tục đơn giản"],
    minEduscore: 70,
    logo: "🏦",
    rating: 4.5,
    processingTime: "3-5 ngày làm việc"
  },
  {
    id: 2,
    bank: "VietinBank",
    package: "Tín dụng giáo dục",
    interestRate: "6.8% - 9.0%",
    maxAmount: "300 triệu VND",
    term: "Tối đa 20 năm",
    requirements: ["Học sinh, sinh viên", "Thu nhập gia đình ổn định", "Tài sản đảm bảo"],
    features: ["Cho vay 100% học phí", "Ân hạn nợ gốc", "Hỗ trợ du học"],
    minEduscore: 65,
    logo: "🏛️",
    rating: 4.3,
    processingTime: "2-4 ngày làm việc"
  },
  {
    id: 3,
    bank: "BIDV",
    package: "Vay giáo dục toàn diện",
    interestRate: "7.0% - 8.8%",
    maxAmount: "500 triệu VND",
    term: "Tối đa 25 năm",
    requirements: ["Giấy báo trúng tuyển", "Bảo lãnh hoặc thế chấp", "CCCD/CMND"],
    features: ["Vay học phí + sinh hoạt phí", "Lãi suất thả nổi", "Miễn phí thẩm định"],
    minEduscore: 75,
    logo: "🏢",
    rating: 4.4,
    processingTime: "4-7 ngày làm việc"
  },
  {
    id: 4,
    bank: "Agribank",
    package: "Vay học tập nông thôn",
    interestRate: "5.8% - 7.5%",
    maxAmount: "150 triệu VND",
    term: "Tối đa 12 năm",
    requirements: ["Hộ khẩu nông thôn", "Học sinh xuất sắc", "Bảo lãnh tập thể"],
    features: ["Lãi suất ưu đãi đặc biệt", "Hỗ trợ sinh viên vùng khó khăn", "Thủ tục đơn giản"],
    minEduscore: 60,
    logo: "🌾",
    rating: 4.2,
    processingTime: "1-3 ngày làm việc"
  },
  {
    id: 5,
    bank: "Techcombank",
    package: "Smart Study Loan",
    interestRate: "7.5% - 9.5%",
    maxAmount: "800 triệu VND",
    term: "Tối đa 30 năm",
    requirements: ["Điểm thi đại học cao", "Ngành học hot", "Thu nhập gia đình"],
    features: ["Công nghệ số hóa", "Thẩm định nhanh", "Hỗ trợ du học quốc tế"],
    minEduscore: 80,
    logo: "💳",
    rating: 4.6,
    processingTime: "1-2 ngày làm việc"
  },
  {
    id: 6,
    bank: "MB Bank",
    package: "Vay giáo dục MB",
    interestRate: "6.9% - 8.9%",
    maxAmount: "400 triệu VND",
    term: "Tối đa 18 năm",
    requirements: ["Sinh viên chính quy", "Bảo lãnh thu nhập", "Giấy tờ hợp lệ"],
    features: ["Giải ngân linh hoạt", "Tư vấn miễn phí", "Ưu đãi khách hàng cũ"],
    minEduscore: 68,
    logo: "🏪",
    rating: 4.1,
    processingTime: "2-5 ngày làm việc"
  },
  {
    id: 7,
    bank: "ACB",
    package: "Tương lai xanh",
    interestRate: "7.2% - 9.2%",
    maxAmount: "350 triệu VND",
    term: "Tối đa 22 năm",
    requirements: ["Ngành học STEM", "GPA > 3.0", "Kế hoạch học tập rõ ràng"],
    features: ["Ưu tiên ngành công nghệ", "Hỗ trợ thực tập", "Kết nối việc làm"],
    minEduscore: 78,
    logo: "💚",
    rating: 4.3,
    processingTime: "3-6 ngày làm việc"
  },
  {
    id: 8,
    bank: "VPBank",
    package: "Vay tiêu dùng giáo dục",
    interestRate: "8.0% - 10.5%",
    maxAmount: "250 triệu VND",
    term: "Tối đa 10 năm",
    requirements: ["Độ tuổi 18-60", "Thu nhập chứng minh", "Lịch sử tín dụng tốt"],
    features: ["Thủ tục online", "Giải ngân nhanh", "Không cần tài sản thế chấp"],
    minEduscore: 65,
    logo: "💎",
    rating: 4.0,
    processingTime: "1-3 ngày làm việc"
  }
];

export default function FinancePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [bankFilter, setBankFilter] = useState("");
    const [maxAmountFilter, setMaxAmountFilter] = useState("");
    const [interestRateFilter, setInterestRateFilter] = useState("");
    const [showRecommended, setShowRecommended] = useState(false);
    const { getRecommendationContext } = useEduscore();
    
    const [eduscoreContext, setEduscoreContext] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const context = getRecommendationContext();
        setEduscoreContext(context);
        setIsLoading(false);
    }, []);

    const filteredPackages = loanPackages
        .filter(pkg => 
            pkg.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.package.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(pkg => bankFilter === "" || bankFilter === "all" || pkg.bank === bankFilter)
        .filter(pkg => {
            if (!maxAmountFilter || maxAmountFilter === "all") return true;
            const maxAmount = parseInt(pkg.maxAmount.replace(/\D/g, ''));
            switch(maxAmountFilter) {
                case "under-200": return maxAmount < 200;
                case "200-400": return maxAmount >= 200 && maxAmount < 400;
                case "above-400": return maxAmount >= 400;
                default: return true;
            }
        })
        .filter(pkg => {
            if (!interestRateFilter || interestRateFilter === "all") return true;
            const minRate = parseFloat(pkg.interestRate.split('%')[0]);
            switch(interestRateFilter) {
                case "under-7": return minRate < 7;
                case "7-8": return minRate >= 7 && minRate < 8;
                case "above-8": return minRate >= 8;
                default: return true;
            }
        })
        .filter(pkg => {
            if (!showRecommended || !eduscoreContext) return true;
            return eduscoreContext.eduscore >= pkg.minEduscore;
        })
        .sort((a, b) => {
            if (eduscoreContext && showRecommended) {
                const aRecommended = eduscoreContext.eduscore >= a.minEduscore;
                const bRecommended = eduscoreContext.eduscore >= b.minEduscore;
                if (aRecommended && !bRecommended) return -1;
                if (!aRecommended && bRecommended) return 1;
            }
            return b.rating - a.rating;
        });

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Đang tải thông tin...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center">
                    <div className="flex flex-col items-center">
                        <h1 className="text-6xl md:text-8xl font-bold font-anton tracking-wider leading-normal pt-6 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6">
                        HỖ TRỢ TÀI CHÍNH
                        </h1>
                        <p className="text-base md:text-2xl italic">"Đồng hành hôm nay, tiếp bước ngày mai"</p>
                    </div>
                </div>

                {/* EduScore Integration Section */}
                {eduscoreContext ? (
                    <section className="py-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
                        <div className="container mx-auto px-4">
                            <Card className="max-w-4xl mx-auto border-green-200 bg-green-50/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <CheckCircle className="h-6 w-6" />
                                        EduScore của bạn: {eduscoreContext.eduscore}/100
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold mb-2">Thông tin học tập</h3>
                                            <p><strong>Chuyên ngành:</strong> {eduscoreContext.major}</p>
                                            <p><strong>Năm học:</strong> {eduscoreContext.currentYear}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Gói vay phù hợp</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Với EduScore {eduscoreContext.eduscore}, bạn đủ điều kiện cho{" "}
                                                <span className="font-semibold text-green-600">
                                                    {loanPackages.filter(pkg => eduscoreContext.eduscore >= pkg.minEduscore).length}
                                                </span> gói vay
                                            </p>
                                            <Button 
                                                onClick={() => setShowRecommended(!showRecommended)}
                                                variant={showRecommended ? "default" : "outline"}
                                                size="sm"
                                                className="mt-2"
                                            >
                                                <TrendingUp className="h-4 w-4 mr-2" />
                                                {showRecommended ? 'Hiện tất cả' : 'Chỉ gói phù hợp'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                ) : (
                    <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50">
                        <div className="container mx-auto px-4">
                            <Card className="max-w-4xl mx-auto border-amber-200 bg-amber-50/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-amber-800">
                                        <AlertCircle className="h-6 w-6" />
                                        Chưa có EduScore
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">Hoàn thành đánh giá EduScore để nhận được gợi ý gói vay phù hợp với hồ sơ của bạn.</p>
                                    <Button asChild>
                                        <Link href="/eduscore">
                                            Làm EduScore ngay
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Search and Filter Section */}
                <section className="py-8 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center">Tìm kiếm gói vay phù hợp</h2>
                            
                            <Card className="p-6 mb-6">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm theo tên ngân hàng..."
                                            className="pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    
                                    <Select value={bankFilter} onValueChange={setBankFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn ngân hàng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả ngân hàng</SelectItem>
                                            {Array.from(new Set(loanPackages.map(pkg => pkg.bank))).map(bank => (
                                                <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={maxAmountFilter} onValueChange={setMaxAmountFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Số tiền vay" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="under-200">Dưới 200 triệu</SelectItem>
                                            <SelectItem value="200-400">200-400 triệu</SelectItem>
                                            <SelectItem value="above-400">Trên 400 triệu</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={interestRateFilter} onValueChange={setInterestRateFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Lãi suất" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="under-7">Dưới 7%</SelectItem>
                                            <SelectItem value="7-8">7% - 8%</SelectItem>
                                            <SelectItem value="above-8">Trên 8%</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Card>

                            {/* Results Summary */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-muted-foreground">
                                    Hiển thị {filteredPackages.length} gói vay
                                </p>
                                {eduscoreContext && (
                                    <Badge variant={showRecommended ? "default" : "outline"}>
                                        {showRecommended ? 'Gợi ý cho bạn' : 'Tất cả gói vay'}
                                    </Badge>
                                )}
                            </div>

                            {/* Loan Packages Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPackages.map(pkg => (
                                    <LoanPackageCard key={pkg.id} package={pkg} isRecommended={eduscoreContext && eduscoreContext.eduscore >= pkg.minEduscore} />
                                ))}
                            </div>

                            {filteredPackages.length === 0 && (
                                <Card className="p-12 text-center">
                                    <p className="text-muted-foreground mb-4">Không tìm thấy gói vay phù hợp với tiêu chí của bạn</p>
                                    <Button onClick={() => {
                                        setSearchTerm("");
                                        setBankFilter("");
                                        setMaxAmountFilter("");
                                        setInterestRateFilter("");
                                        setShowRecommended(false);
                                    }}>
                                        Xóa bộ lọc
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function LoanPackageCard({ package: pkg, isRecommended }: { package: typeof loanPackages[0], isRecommended: boolean }) {
    return (
        <Card className={`h-full flex flex-col relative ${isRecommended ? 'border-green-300 shadow-lg' : ''}`}>
            {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                    <Star className="h-4 w-4" />
                </div>
            )}
            
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{pkg.logo}</span>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                </div>
                <CardTitle className="text-lg">{pkg.bank}</CardTitle>
                <p className="text-sm font-medium text-blue-600">{pkg.package}</p>
            </CardHeader>

            <CardContent className="flex-grow space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="font-medium text-green-600">Lãi suất:</span>
                        <p className="text-xs">{pkg.interestRate}</p>
                    </div>
                    <div>
                        <span className="font-medium text-blue-600">Số tiền tối đa:</span>
                        <p className="text-xs">{pkg.maxAmount}</p>
                    </div>
                    <div>
                        <span className="font-medium text-purple-600">Thời hạn:</span>
                        <p className="text-xs">{pkg.term}</p>
                    </div>
                    <div>
                        <span className="font-medium text-orange-600">Xử lý:</span>
                        <p className="text-xs">{pkg.processingTime}</p>
                    </div>
                </div>

                <div>
                    <span className="font-medium text-sm">Ưu điểm:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {pkg.features.slice(0, 2).map((feature, index) => (
                            <li key={index} className="flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <span className="font-medium text-sm">Yêu cầu:</span>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {pkg.requirements.slice(0, 2).map((req, index) => (
                            <li key={index} className="flex items-start gap-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                {req}
                            </li>
                        ))}
                    </ul>
                </div>

                {isRecommended && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                        Phù hợp với EduScore của bạn
                    </Badge>
                )}
            </CardContent>

            <CardFooter className="pt-3">
                <Button className="w-full" variant={isRecommended ? "default" : "outline"}>
                    Tìm hiểu thêm
                </Button>
            </CardFooter>
        </Card>
    );
}
