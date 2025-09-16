'use client';

import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, CheckCircle, FileText, ChevronDown, History, BarChart3, Calendar, Award, TrendingUp, Target, BookOpen, Briefcase, Users, DollarSign, PieChart, Activity, Zap, Brain } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import Image from "next/image";
import Link from "next/link";
import SurveyWizard from "@/components/survey/SurveyWizard";
import { useEduscore, EduscoreData } from "@/lib/eduscore-service";
import { useAuth } from "@/hooks/use-auth-neon";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getEduscoreByUserId, getEduscoreHistoryByUserId } from "@/lib/database";
import { getSampleEduscoreData, hasSampleEduscoreData } from "@/lib/sample-eduscore-data";
import { FormattedText } from "@/components/ui/formatted-text";
import { analyzeEduscoreCharts, AnalyzeEduscoreChartsOutput } from "@/ai/flows/analyze-eduscore-charts";

// Helper functions for chart data
function getScoreBreakdownData(eduscoreData: EduscoreData, aiAnalysis?: AnalyzeEduscoreChartsOutput) {
    if (aiAnalysis) {
        return [
            { name: 'Học tập', score: Math.round(aiAnalysis.scoreBreakdown.academic) },
            { name: 'Kỹ năng', score: Math.round(aiAnalysis.scoreBreakdown.skills) },
            { name: 'Hoạt động', score: Math.round(aiAnalysis.scoreBreakdown.activities) },
            { name: 'Tài chính', score: Math.round(aiAnalysis.scoreBreakdown.financial) }
        ];
    }
    
    // Fallback to original logic if AI analysis not available
    const gpaScore = (eduscoreData.surveyData.academicInfoGPA / 4.0) * 40;
    const skillsScore = 23; // Based on sample data showing 23/25
    const activitiesScore = 18; // Based on sample data showing 18/20  
    const financialScore = 11; // Based on sample data showing 11/15
    
    return [
        { name: 'Học tập', score: Math.round(gpaScore) },
        { name: 'Kỹ năng', score: skillsScore },
        { name: 'Hoạt động', score: activitiesScore },
        { name: 'Tài chính', score: financialScore }
    ];
}

function getSkillsDistributionData(eduscoreData: EduscoreData, aiAnalysis?: AnalyzeEduscoreChartsOutput) {
    if (aiAnalysis) {
        return [
            { name: 'Kỹ năng kỹ thuật', value: aiAnalysis.skillsDistribution.technicalSkills },
            { name: 'Ngôn ngữ lập trình', value: aiAnalysis.skillsDistribution.programmingLanguages },
            { name: 'Chứng chỉ', value: aiAnalysis.skillsDistribution.certifications },
            { name: 'Kinh nghiệm', value: aiAnalysis.skillsDistribution.workExperience },
            { name: 'Ngoại ngữ', value: aiAnalysis.skillsDistribution.languageSkills }
        ];
    }
    
    // Fallback to original logic if AI analysis not available
    const skills = eduscoreData.surveyData.technicalSkills.split(',').map(s => s.trim());
    const programmingLangs = eduscoreData.surveyData.programmingLanguages?.split(',').map(s => s.trim()) || [];
    
    return [
        { name: 'Kỹ năng kỹ thuật', value: skills.length },
        { name: 'Ngôn ngữ lập trình', value: programmingLangs.length },
        { name: 'Chứng chỉ', value: eduscoreData.surveyData.certifications ? 4 : 0 },
        { name: 'Kinh nghiệm', value: eduscoreData.surveyData.workExperience ? 3 : 0 }
    ];
}

function getSkillColors() {
    return ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
}

export default function EduscorePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showSurvey, setShowSurvey] = useState(false);
    const eduscoreService = useEduscore();
    const [eduscoreData, setEduscoreData] = useState<EduscoreData | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [history, setHistory] = useState<EduscoreData[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<EduscoreData | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<AnalyzeEduscoreChartsOutput | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        const loadEduscoreData = async () => {
            if (user?.email) {
                try {
                    // Check if this is the demo account with sample data
                    if (hasSampleEduscoreData(user.email)) {
                        const sampleData = getSampleEduscoreData(user.email);
                        if (sampleData) {
                            const formattedData: EduscoreData = {
                                score: sampleData.score,
                                reasoning: sampleData.reasoning,
                                surveyData: {
                                    ...sampleData.surveyData,
                                    certifications: sampleData.surveyData.certifications || '',
                                    languageSkills: sampleData.surveyData.languageSkills || '',
                                    workExperience: sampleData.surveyData.workExperience || '',
                                    extracurricularActivities: sampleData.surveyData.extracurricularActivities || '',
                                    awards: sampleData.surveyData.awards || '',
                                    valuableAssets: sampleData.surveyData.valuableAssets || '',
                                    medicalExpenses: sampleData.surveyData.medicalExpenses || '',
                                    specialCircumstances: sampleData.surveyData.specialCircumstances || '',
                                    aspirations: sampleData.surveyData.aspirations || '',
                                    careerGoals: sampleData.surveyData.careerGoals || ''
                                },
                                completedAt: sampleData.createdAt
                            };
                            setEduscoreData(formattedData);
                            return;
                        }
                    }
                    
                    // For other accounts, try to get data from database first
                    const dbData = await getEduscoreByUserId(user.email);
                    if (dbData) {
                        const formattedData: EduscoreData = {
                            score: dbData.score,
                            reasoning: dbData.reasoning,
                            surveyData: {
                                ...dbData.surveyData,
                                certifications: dbData.surveyData.certifications || '',
                                languageSkills: dbData.surveyData.languageSkills || '',
                                workExperience: dbData.surveyData.workExperience || '',
                                extracurricularActivities: dbData.surveyData.extracurricularActivities || '',
                                awards: dbData.surveyData.awards || '',
                                valuableAssets: dbData.surveyData.valuableAssets || '',
                                medicalExpenses: dbData.surveyData.medicalExpenses || '',
                                specialCircumstances: dbData.surveyData.specialCircumstances || '',
                                aspirations: dbData.surveyData.aspirations || '',
                                careerGoals: dbData.surveyData.careerGoals || ''
                            },
                            completedAt: dbData.createdAt || new Date()
                        };
                        setEduscoreData(formattedData);
                        // Load full history as well
                        const historyList = await getEduscoreHistoryByUserId(user.email);
                        setHistory(historyList as unknown as EduscoreData[]);
                    } else {
                        // Fallback to localStorage data
                        const localData = eduscoreService.getEduscoreData(user.email);
                        setEduscoreData(localData);
                    }
                } catch (error) {
                    console.error('Failed to load EduScore data:', error);
                    // Fallback to localStorage data for non-demo accounts
                    if (!hasSampleEduscoreData(user.email)) {
                        const localData = eduscoreService.getEduscoreData(user.email);
                        setEduscoreData(localData);
                    }
                }
            }
        };
        
        loadEduscoreData();
    }, [user?.email, refreshTrigger]);

    // AI Analysis effect - runs when eduscoreData changes
    useEffect(() => {
        const performAiAnalysis = async () => {
            if (!eduscoreData || !user?.email) return;
            
            setIsAnalyzing(true);
            try {
                const analysisInput = {
                    academicInfoGPA: eduscoreData.surveyData.academicInfoGPA,
                    major: eduscoreData.surveyData.major,
                    technicalSkills: eduscoreData.surveyData.technicalSkills || '',
                    programmingLanguages: eduscoreData.surveyData.programmingLanguages || '',
                    certifications: eduscoreData.surveyData.certifications || '',
                    languageSkills: eduscoreData.surveyData.languageSkills || '',
                    workExperience: eduscoreData.surveyData.workExperience || '',
                    currentYear: eduscoreData.surveyData.currentYear,
                    university: eduscoreData.surveyData.university,
                    extracurricularActivities: eduscoreData.surveyData.extracurricularActivities || '',
                    awards: eduscoreData.surveyData.awards || '',
                    familyIncome: eduscoreData.surveyData.familyIncome,
                    dependents: eduscoreData.surveyData.dependents,
                    valuableAssets: eduscoreData.surveyData.valuableAssets || '',
                    medicalExpenses: eduscoreData.surveyData.medicalExpenses || '',
                    specialCircumstances: eduscoreData.surveyData.specialCircumstances || '',
                    aspirations: eduscoreData.surveyData.aspirations || '',
                    careerGoals: eduscoreData.surveyData.careerGoals || '',
                    eduscore: eduscoreData.score,
                };

                const analysis = await analyzeEduscoreCharts(analysisInput);
                setAiAnalysis(analysis);
            } catch (error) {
                console.error('AI Analysis failed:', error);
                // Continue without AI analysis - fallback will be used
            } finally {
                setIsAnalyzing(false);
            }
        };

        performAiAnalysis();
    }, [eduscoreData, user?.email]);

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

    const handleSurveyComplete = () => {
        // Hide survey and refresh data
        setShowSurvey(false);
        setRefreshTrigger(prev => prev + 1);
        
        // Scroll back to results section
        setTimeout(() => {
            const resultsSection = document.querySelector('[data-results-section]');
            if (resultsSection) {
                const headerHeight = 80;
                const elementPosition = resultsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500);
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
                                    <SurveyWizard onComplete={handleSurveyComplete} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                
                {/* EduScore History Section - Only show if user has EduScore data */}
                {eduscoreData && (
                    <section data-results-section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30">
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
                                                <h3 className="text-2xl font-bold">Kết quả EduScore</h3>
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

                                {/* History List */}
                                {history.length > 0 && (
                                  <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-xl">
                                    <div className="mb-4 flex items-center gap-2">
                                      <History className="h-5 w-5 text-blue-600" />
                                      <h4 className="text-lg font-bold text-gray-900">Lịch sử EduScore</h4>
                                    </div>
                                    <div className="space-y-3">
                                      {history.map((h, idx) => (
                                        <div key={h.id || idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                          <div className="flex items-center gap-4">
                                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">{h.score}/100</Badge>
                                            <span className="text-sm text-gray-600">{formatDistanceToNow((h as any).createdAt || h.completedAt || new Date(), { addSuffix: true })}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setSelectedHistory(h)}>
                                              Xem chi tiết
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </Card>
                                )}

                                {/* Enhanced Visual Analytics */}
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {/* Score Breakdown Chart */}
                                    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl">
                                        <div className="mb-4">
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                                Phân Tích Điểm Số Chi Tiết
                                            </h4>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={getScoreBreakdownData(eduscoreData, aiAnalysis || undefined)}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" fontSize={12} />
                                                    <YAxis fontSize={12} />
                                                    <Tooltip />
                                                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>

                                    {/* Skills Distribution */}
                                    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl">
                                        <div className="mb-4">
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                <Target className="h-5 w-5 text-green-600" />
                                                Phân Bố Kỹ Năng
                                            </h4>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RechartsPieChart>
                                                    <Pie
                                                        data={getSkillsDistributionData(eduscoreData, aiAnalysis || undefined)}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {getSkillsDistributionData(eduscoreData, aiAnalysis || undefined).map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={getSkillColors()[index % getSkillColors().length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </RechartsPieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </div>

                                {/* Detailed Performance Breakdown */}
                                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl mb-6">
                                    <div className="mb-6">
                                        <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 mb-6 flex items-center gap-2">
                                            <BarChart3 className="h-6 w-6 text-blue-600" />
                                            Phân Tích Kết Quả Chi Tiết
                                        </h4>
                                        
                                        {/* Performance Categories */}
                                        <div className="grid md:grid-cols-1 gap-6 mb-8">
                                            {/* Academic Performance */}
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-blue-500 p-2 rounded-lg">
                                                        <BookOpen className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900">Thành Tích Học Tập</h5>
                                                        <p className="text-sm text-gray-600">GPA & Nền tảng học thuật</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>GPA {eduscoreData.surveyData.academicInfoGPA}/4.0</span>
                                                        <span className="font-medium">
                                                            {Math.round((eduscoreData.surveyData.academicInfoGPA / 4.0) * 100)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-blue-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-500 h-2 rounded-full" 
                                                            style={{width: `${(eduscoreData.surveyData.academicInfoGPA / 4.0) * 100}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skills & Experience */}
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-green-500 p-2 rounded-lg">
                                                        <Target className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900">Kỹ Năng & Kinh Nghiệm</h5>
                                                        <p className="text-sm text-gray-600">Năng lực chuyên môn</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-justify">
                                                    {eduscoreData.surveyData.programmingLanguages && (
                                                        <div className="flex items-center gap-2 text-justify">
                                                            <span className="text-justify">Lập trình: {eduscoreData.surveyData.programmingLanguages}</span>
                                                        </div>
                                                    )}
                                                    {eduscoreData.surveyData.certifications && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-justify">Chứng chỉ: {eduscoreData.surveyData.certifications}</span>
                                                        </div>
                                                    )}
                                                    {eduscoreData.surveyData.workExperience && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-justify">Kinh nghiệm: {eduscoreData.surveyData.workExperience}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Extracurricular */}
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-purple-500 p-2 rounded-lg">
                                                        <Users className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900">Hoạt Động Ngoại Khóa</h5>
                                                        <p className="text-sm text-gray-600">Kỹ năng mềm & lãnh đạo</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-justify">
                                                    {eduscoreData.surveyData.extracurricularActivities ? (
                                                        <div className="flex items-center gap-2">
                                                            <span>{eduscoreData.surveyData.extracurricularActivities}</span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">Chưa có hoạt động ngoại khóa</p>
                                                    )}
                                                    {eduscoreData.surveyData.awards && (
                                                        <div className="flex items-center gap-2">
                                                            <span>Giải thưởng: {eduscoreData.surveyData.awards}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Financial Profile */}
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="bg-orange-500 p-2 rounded-lg">
                                                        <DollarSign className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900">Hồ Sơ Tài Chính</h5>
                                                        <p className="text-sm text-gray-600">Nhu cầu hỗ trợ</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-justify">
                                                    <div className="flex justify-between">
                                                        <span>Thu nhập gia đình:</span>
                                                        <span className="font-medium">{eduscoreData.surveyData.familyIncome}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Người phụ thuộc:</span>
                                                        <span className="font-medium">{eduscoreData.surveyData.dependents}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Career Goals */}
                                        {eduscoreData.surveyData.careerGoals && (
                                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Briefcase className="h-5 w-5 text-gray-600" />
                                                    <h5 className="font-semibold text-gray-900">Mục Tiêu Nghề Nghiệp</h5>
                                                </div>
                                                <p className="text-gray-700 text-justify">{eduscoreData.surveyData.careerGoals}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Progress Tracking */}
                                <Card className="p-8 mb-8 bg-white rounded-lg p-6 border border-purple-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-purple-500 p-2 rounded-lg">
                                            <Brain className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">Tiềm Năng</h5>
                                            <p className="text-sm text-gray-600">Đánh giá tổng thể</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-600 mb-2">
                                            {eduscoreData.score >= 90 ? 'A+' : 
                                                eduscoreData.score >= 85 ? 'A' : 
                                                eduscoreData.score >= 80 ? 'B+' : 
                                                eduscoreData.score >= 75 ? 'B' : 
                                                eduscoreData.score >= 70 ? 'C+' : 'C'}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">Xếp hạng</p>
                                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                            {eduscoreData.score >= 85 ? 'Xuất sắc' : 
                                                eduscoreData.score >= 75 ? 'Giỏi' : 
                                                eduscoreData.score >= 65 ? 'Khá' : 'Trung bình'}
                                        </Badge>
                                    </div>
                                </Card>

                                <Card className="p-8 mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-2xl">
                                    {/* AI Analysis */}
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Bot className="h-6 w-6 text-white" />
                                            Phân tích kết quả & Lời khuyên cá nhân
                                            </h4>
                                        </div>
                                        
                                        {isAnalyzing ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mr-3"></div>
                                                <span className="text-white">Đang phân tích hồ sơ của bạn...</span>
                                            </div>
                                        ) : (
                                            <div className="text-white text-justify space-y-6">
                                                {/* Original Reasoning */}
                                                <div>
                                                    <FormattedText text={eduscoreData.reasoning} className="text-white" />
                                                </div>
                                                
                                                {/* AI Generated Personalized Advice */}
                                                {aiAnalysis?.personalizedAdvice && (
                                                    <div className="border-t border-white/20 pt-6 mt-6">
                                                        <h5 className="font-semibold mb-4 text-xl flex items-center gap-2">
                                                            <span className="text-2xl">✨</span>
                                                            Lời khuyên cá nhân
                                                        </h5>
                                                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                                            <FormattedText text={aiAnalysis.personalizedAdvice} className="text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>   
                                </Card>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button 
                                        onClick={showSurveySection}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                    >
                                        Cập Nhật EduScore
                                        <TrendingUp className="ml-2 h-4 w-4" />
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

                            </div>
                        </div>
                    </section>
                )}
                

                {/* History Detail Modal */}
                {selectedHistory && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Chi tiết báo cáo EduScore</h3>
                        <Button variant="ghost" onClick={() => setSelectedHistory(null)}>Đóng</Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-5xl font-bold mb-2">{selectedHistory.score}<span className="text-2xl text-gray-500">/100</span></div>
                          <div className="text-sm text-gray-500 mb-4">{formatDistanceToNow((selectedHistory as any).createdAt || selectedHistory.completedAt || new Date(), { addSuffix: true })}</div>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Ngành:</span> {selectedHistory.surveyData.major}</div>
                            <div><span className="font-medium">Năm học:</span> {selectedHistory.surveyData.currentYear}</div>
                            <div><span className="font-medium">GPA:</span> {selectedHistory.surveyData.academicInfoGPA}/4.0</div>
                          </div>
                        </div>
                        <div className="text-sm text-justify">
                          <FormattedText text={selectedHistory.reasoning} />
                        </div>
                      </div>
                    </div>
                  </div>
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

