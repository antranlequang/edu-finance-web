import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle, FileText } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Main Banner Section */}
        <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://picsum.photos/1920/1080"
              alt="Diverse group of students"
              data-ai-hint="diverse students"
              fill
              style={{ objectFit: 'cover' }}
              className="brightness-50"
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          </div>
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in-down">
              Tương Lai Của Bạn, Được Hỗ Trợ Bởi AI
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 animate-fade-in-up">
              Chúng tôi cung cấp con đường công bằng, minh bạch và cá nhân hóa đến giáo dục, sự nghiệp và hỗ trợ tài chính.
            </p>
            <Link href="/survey">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground animate-fade-in-up delay-200">
                Nhận Điểm Eduscore Miễn Phí <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Con Đường Thành Công Đơn Giản Hơn</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Quy trình đơn giản 3 bước của chúng tôi sử dụng AI để xây dựng hồ sơ toàn diện và kết nối bạn với các cơ hội phù hợp.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                   <FeatureCard 
                     icon={<FileText className="w-12 h-12 text-primary" />}
                     title="1. Xây Dựng Hồ Sơ"
                     description="Hoàn thành khảo sát Eduscore toàn diện để tạo ra cái nhìn tổng thể về kỹ năng và nguyện vọng của bạn."
                   />
                   <FeatureCard 
                     icon={<Bot className="w-12 h-12 text-primary" />}
                     title="2. Nhận Thông Tin Từ AI"
                     description="Nhận gợi ý cá nhân hóa về học bổng, khóa học và việc làm phù hợp với hồ sơ độc đáo của bạn."
                   />
                   <FeatureCard 
                     icon={<CheckCircle className="w-12 h-12 text-primary" />}
                     title="3. Ứng Tuyển Tự Tin"
                     description="Sử dụng hồ sơ được nâng cao để ứng tuyển các cơ hội và theo dõi tiến trình hướng tới mục tiêu."
                   />
                </div>
            </div>
        </section>

        {/* Core Services Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Dịch Vụ Cốt Lõi</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tất cả những gì bạn cần cho hành trình giáo dục và sự nghiệp, tất cả ở một nơi.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceCard
                title="Eduscore"
                description="Nhận điểm số độc đáo được hỗ trợ bởi AI để mở khóa các cơ hội cá nhân hóa."
                link="/eduscore"
                image={{ src: "https://picsum.photos/400/300?random=1", hint: "student profile" }}
              />
              <ServiceCard
                title="Học Bổng"
                description="Tìm kiếm và ứng tuyển học bổng phù hợp với hồ sơ học tập và tài chính của bạn."
                link="/scholarship"
                image={{ src: "https://picsum.photos/400/300?random=2", hint: "graduation cap money" }}
              />
              <ServiceCard
                title="Khóa Học"
                description="Khám phá các khóa học từ các tổ chức hàng đầu để nâng cao kỹ năng và thúc đẩy sự nghiệp."
                link="/course"
                image={{ src: "https://picsum.photos/400/300?random=3", hint: "online learning" }}
              />
              <ServiceCard
                title="Việc Làm & Thực Tập"
                description="Khám phá cơ hội việc làm và thực tập phù hợp với sinh viên và người mới tốt nghiệp."
                link="/job"
                image={{ src: "https://picsum.photos/400/300?random=4", hint: "professional handshake" }}
              />
               <ServiceCard
                title="Hỗ Trợ Tài Chính"
                description="Tiếp cận các khoản vay sinh viên linh hoạt và tùy chọn hỗ trợ tài chính để tài trợ cho giáo dục."
                link="/finance"
                image={{ src: "https://picsum.photos/400/300?random=5", hint: "student signing papers" }}
              />
               <ServiceCard
                title="Cố Vấn AI"
                description="Nhận lời khuyên tức thì và cá nhân hóa về con đường sự nghiệp và giáo dục từ trợ lý AI của chúng tôi."
                link="/ai-advice"
                image={{ src: "https://picsum.photos/400/300?random=6", hint: "robot chat" }}
              />
            </div>
          </div>
        </section>

         {/* Final CTA Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Sẵn Sàng Khám Phá Tiềm Năng Của Bạn?</h2>
                <p className="mt-4 text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                   Hành trình đến tương lai tươi sáng của bạn bắt đầu từ bây giờ. Nhận Eduscore miễn phí để khám phá các cơ hội được thiết kế riêng cho bạn.
                </p>
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                   <Link href="/survey">Bắt Đầu Khảo Sát Eduscore <ArrowRight className="ml-2 h-5 w-5" /></Link>
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
        <Card className="p-6 border-0 shadow-lg bg-card transform hover:-translate-y-2 transition-transform duration-300">
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

function ServiceCard({ title, description, link, image }: { title: string, description: string, link: string, image: { src: string, hint: string } }) {
  return (
    <Link href={link} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={image.src}
            alt={title}
            data-ai-hint={image.hint}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}