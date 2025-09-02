import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, CheckCircle, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EduscorePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <section className="relative bg-primary text-primary-foreground py-20 md:py-32">
                     <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eduscore Là Gì?</h1>
                            <p className="text-lg text-primary-foreground/90 max-w-lg mx-auto md:mx-0">
                                Eduscore là hồ sơ cá nhân hóa được hỗ trợ bởi AI cung cấp cái nhìn tổng thể về điểm mạnh học thuật, ngoại khóa và cá nhân để mở khóa các cơ hội phù hợp.
                            </p>
                            <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                                <Link href="/survey">
                                    Nhận Eduscore Miễn Phí <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                        <div className="relative h-64 md:h-80">
                            <Image 
                                src="https://picsum.photos/600/400"
                                data-ai-hint="student profile score"
                                alt="Student profile score illustration"
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
                            <h2 className="text-3xl md:text-4xl font-bold">Cách Thức Hoạt Động</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Quy trình đơn giản 3 bước của chúng tôi sử dụng AI để xây dựng hồ sơ toàn diện của bạn.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                           <FeatureCard 
                             icon={<FileText className="w-12 h-12 text-primary" />}
                             title="1. Hoàn Thành Khảo Sát"
                             description="Điền vào khảo sát đa bước an toàn của chúng tôi bao gồm học tập, hoạt động và nguyện vọng cá nhân."
                           />
                           <FeatureCard 
                             icon={<Bot className="w-12 h-12 text-primary" />}
                             title="2. Đánh Giá Bởi AI"
                             description="AI tiên tiến của chúng tôi phân tích câu trả lời của bạn dựa trên tiêu chí độc quyền để tạo ra Eduscore độc đáo của bạn."
                           />
                           <FeatureCard 
                             icon={<CheckCircle className="w-12 h-12 text-primary" />}
                             title="3. Mở Khóa Cơ Hội"
                             description="Sử dụng Eduscore của bạn để tìm học bổng phù hợp, nhận lời khuyên cá nhân hóa và cải thiện hồ sơ."
                           />
                        </div>
                    </div>
                </section>
                
                <section className="bg-secondary py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold">Sẵn Sàng Khám Phá Tiềm Năng Của Bạn?</h2>
                        <p className="mt-4 text-lg text-muted-foreground mb-8">
                           Bắt đầu ngay hôm nay và xem những cơ hội nào đang chờ đợi bạn.
                        </p>
                        <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                           <Link href="/survey">Bắt Đầu Khảo Sát Eduscore</Link>
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
