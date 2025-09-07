'use client';

import { useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, CheckCircle, FileText, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SurveyWizard from "@/components/survey/SurveyWizard";

export default function EduscorePage() {
    const [showSurvey, setShowSurvey] = useState(false);

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

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                {/* Main Content */}
                <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center overflow-hidden ">
                    <div className="flex flex-col items-center">
                        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6 animate-fade-in">
                            EDUSCORE
                        </h1>
                        <p className="text-base md:text-2xl">Hệ thống chấm điểm đánh giá hồ sơ ứng viên</p>
                    </div>
                </div>
                
                <section className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 text-primary-foreground py-20 md:py-32">
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Vậy Eduscore Là Gì?</h1>
                            <p className="text-lg text-primary-foreground/90 max-w-lg mx-auto md:mx-0 text-center md:text-justify">
                                Eduscore là hồ sơ cá nhân hóa được hỗ trợ bởi AI cung cấp cái nhìn tổng thể về điểm mạnh học thuật, ngoại khóa và cá nhân để mở khóa các cơ hội phù hợp.
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
