'use client';

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, CheckCircle, FileText, ChevronDown, History, BarChart3, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SurveyWizard from "@/components/survey/SurveyWizard";
import { useEduscore } from "@/lib/eduscore-service";
import { useAuth } from "@/hooks/use-auth-neon";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default function EduscorePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showSurvey, setShowSurvey] = useState(false);
    const { getEduscoreData, hasValidEduscore } = useEduscore();
    const [eduscoreData, setEduscoreData] = useState(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const data = getEduscoreData();
        setEduscoreData(data);
    }, []);

    const scrollToContent = () => {
        const contentSection = document.getElementById('how-it-works');
        if (contentSection) {
            const headerHeight = 80; // Approximate header height
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const showSurveySection = () => {
        setShowSurvey(true);
        // Scroll to survey section after showing it
        setTimeout(() => {
            const surveySection = document.getElementById('survey-section');
            if (surveySection) {
                const headerHeight = 80;
                const elementPosition = surveySection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    // Show loading screen
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Show login required screen if not authenticated
    if (!user) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto p-8 text-center">
                        <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                            <Award className="h-12 w-12 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Yêu Cầu Đăng Nhập</h2>
                        <p className="text-gray-600 mb-6">
                            Để sử dụng tính năng EduScore, bạn cần đăng nhập vào tài khoản của mình.
                            EduScore giúp bạn đánh giá hồ sơ cá nhân và tìm kiếm học bổng phù hợp.
                        </p>
                        <div className="space-y-3">
                            <Button className="w-full" asChild>
                                <Link href="/login">Đăng Nhập</Link>
                            </Button>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/register">Tạo Tài Khoản Mới</Link>
                            </Button>
                        </div>
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
                {/* Main Content */}
                <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center overflow-hidden ">
                    <div className="flex flex-col items-center">
                        <h1 className="text-6xl md:text-8xl font-bold font-anton tracking-wider leading-normal pt-4 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6">
                        EDUSCORE
                        </h1>
                        <p className="text-base md:text-2xl">Hệ thống chấm điểm đánh giá hồ sơ ứng viên</p>
                    </div>
                </div>
                
                <section className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 text-primary-foreground py-20 md:py-32">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">EduScore Là Gì?</h1>
                            <p className="text-lg text-primary-foreground/90 max-w-lg mx-auto md:mx-0 text-center md:text-justify">
                                Eduscore là hệ thống chấm điểm hồ sơ được cá nhân hóa, hỗ trợ bởi AI để cung cấp cái nhìn tổng thể về điểm mạnh học thuật, ngoại khóa và cá nhân, từ đó đề xuất các học bổng phù hợp, giúp doanh nghiệp hiểu rõ hơn về hồ sơ của người dùng.
                            </p>
                            <Button 
                                size="lg" 
                                className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" 
                                onClick={scrollToContent}
                            >
                                Thử ngay <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex-1">
                        <Image 
                            src="/images/banner-eduscore.png" 
                            alt="Vậy Hyhan là gì?" 
                            width={500} 
                            height={400} 
                            className="w-full h-auto object-contain rounded-2xl shadow-lg"
                        />
                        </div>

                    </div>
                </section>

                <section id="how-it-works" className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800">Cách Thức Hoạt Động</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Quy trình đơn giản 3 bước của chúng tôi sử dụng AI để xây dựng hồ sơ toàn diện của bạn.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                           <FeatureCard 
                             icon={<FileText className="w-12 h-12 text-primary" />}
                             title="Hoàn Thành Khảo Sát"
                             description="Điền vào khảo sát đa bước an toàn của chúng tôi bao gồm học tập, hoạt động và nguyện vọng cá nhân."
                           />
                           <FeatureCard 
                             icon={<Bot className="w-12 h-12 text-primary" />}
                             title="Đánh Giá Bởi AI"
                             description="AI tiên tiến của chúng tôi phân tích câu trả lời của bạn dựa trên tiêu chí độc quyền để tạo ra Eduscore độc đáo của bạn."
                           />
                           <FeatureCard 
                             icon={<CheckCircle className="w-12 h-12 text-primary" />}
                             title="Mở Khóa Cơ Hội"
                             description="Sử dụng Eduscore của bạn để tìm học bổng phù hợp, nhận lời khuyên cá nhân hóa và cải thiện hồ sơ."
                           />
                        </div>
                    </div>
                </section>

                {/* EduScore History Section - Only show if user has EduScore data */}
                {eduscoreData && (
                    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-4">
                                    <History className="inline-block mr-3 h-8 w-8" />
                                    Lịch Sử EduScore Của Bạn
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Xem lại kết quả đánh giá và theo dõi sự tiến bộ của bạn theo thời gian
                                </p>
                            </div>
                            
                            <div className="max-w-4xl mx-auto">
                                {/* Current EduScore Summary */}
                                <Card className="p-8 mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                                <Award className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">EduScore Hiện Tại</h3>
                                                <p className="text-white/80">
                                                    Cập nhật {formatDistanceToNow(eduscoreData.completedAt, { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-5xl font-bold mb-2">
                                                {eduscoreData.score}
                                                <span className="text-2xl text-white/80">/100</span>
                                            </div>
                                            <Badge className="bg-white/20 text-white border-white/30">
                                                {eduscoreData.score >= 90 ? 'Xuất sắc' : 
                                                 eduscoreData.score >= 80 ? 'Tốt' : 
                                                 eduscoreData.score >= 70 ? 'Khá' : 
                                                 eduscoreData.score >= 60 ? 'Trung bình' : 'Cần cải thiện'}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    {/* Quick Stats */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <BarChart3 className="h-5 w-5" />
                                                <span className="font-medium">Chuyên ngành</span>
                                            </div>
                                            <p className="text-white/90">{eduscoreData.surveyData.major}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Calendar className="h-5 w-5" />
                                                <span className="font-medium">Năm học</span>
                                            </div>
                                            <p className="text-white/90">{eduscoreData.surveyData.currentYear}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FileText className="h-5 w-5" />
                                                <span className="font-medium">GPA</span>
                                            </div>
                                            <p className="text-white/90">{eduscoreData.surveyData.academicInfoGPA}/4.0</p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Detailed Analysis */}
                                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl">
                                    <div className="mb-6">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">Phân Tích Chi Tiết</h4>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {eduscoreData.reasoning}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button 
                                            onClick={showSurveySection}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                        >
                                            Làm Khảo Sát Mới
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="flex-1"
                                            asChild
                                        >
                                            <Link href="/ai-advice">
                                                Nhận Tư Vấn AI
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </section>
                )}
                
                <section className="bg-secondary py-16 md:py-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800">
                    <div className="container mx-auto px-4 text-center ">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Sẵn Sàng Khám Phá Tiềm Năng Của Bạn?</h2>
                        <p className="mt-4 text-lg text-muted-foreground mb-8 text-white">
                           Bắt đầu ngay hôm nay và xem những cơ hội nào đang chờ đợi bạn.
                        </p>
                        <Button 
                            size="lg" 
                            className="bg-accent hover:bg-accent/90"
                            onClick={showSurveySection}
                        >
                            Bắt Đầu Khảo Sát Eduscore <ChevronDown className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>

                {/* Survey Section - Only shown when button is clicked */}
                {showSurvey && (
                    <section id="survey-section" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6">
                                    Khảo Sát EduScore
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Hoàn thành khảo sát để nhận được điểm EduScore của bạn
                                </p>
                            </div>
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
                                    <SurveyWizard />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}

function FeatureCard({icon, title, description}: {icon: React.ReactNode, title: string, description: string}) {
    return (
        <Card className="p-6 border-t-4 border-primary">
            <CardHeader className="items-center p-2">
                {icon}
                <CardTitle className="mt-4 text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
