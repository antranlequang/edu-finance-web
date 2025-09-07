'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Bot, CheckCircle, FileText, GraduationCap, Target, Eye, Heart, CreditCard, BookOpen, Briefcase, Award, MessageSquare, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Main Banner Section with White Background */}
        <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden bg-white">
          {/* Blue Grid Background Behind Text */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="relative w-[600px] h-[400px] opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="localizedGrid" patternUnits="userSpaceOnUse" width="40" height="40">
                    <rect width="40" height="40" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#localizedGrid)" />
              </svg>
              {/* Radial fade from center */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent via-70% to-white" />
            </div>
          </div>

         {/* Main Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h1 className="text-8xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6 animate-fade-in">
              HYHAN
            </h1>
            <p className="text-3xl md:text-2xl text-gray-600 font-medium mb-6">
              NỀN TẢNG KẾT NỐI TÀI CHÍNH - GIÁO DỤC
            </p>
            <button 
              onClick={() => {
                const nextSection = document.getElementById('what-is-hyhan');
                if (nextSection) {
                  const headerHeight = 80; // Approximate header height
                  const elementPosition = nextSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerHeight;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-3">
                Khám phá ngay
              </span>
              
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-blue-400/30 scale-110 animate-pulse group-hover:scale-125 transition-transform duration-300" />
            </button>
          </div> 
        </section>

        {/* What is Hyhan Section */}
        <section id="what-is-hyhan" className="py-16 md:py-24 bg-white mt-0">
          <div className="container mx-auto px-4">
            <div className="responsive-section">
              <div className="mobile-order-last">
                <h2 className="responsive-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-8 lg:mb-10 mobile-title-center">Vậy Hyhan là gì?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="responsive-subheading font-semibold text-gray-900 mb-2">Nền tảng kết nối giáo dục và tài chính</h3>
                      <p className="text-gray-600 text-justify lg:text-left">Hyhan là cầu nối thông minh giữa sinh viên và các cơ hội giáo dục, học bổng, việc làm cùng hỗ trợ tài chính.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-100 p-2 rounded-lg flex-shrink-0">
                      <Bot className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="responsive-subheading font-semibold text-gray-900 mb-2">Công nghệ AI tiên tiến</h3>
                      <p className="text-gray-600 text-justify lg:text-left">Sử dụng trí tuệ nhân tạo để phân tích hồ sơ cá nhân và đưa ra gợi ý phù hợp nhất cho từng sinh viên.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="responsive-subheading font-semibold text-gray-900 mb-2">Giải pháp toàn diện</h3>
                      <p className="text-gray-600 text-justify lg:text-left">Từ đánh giá năng lực đến kết nối cơ hội, Hyhan đồng hành cùng bạn trong suốt hành trình phát triển.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mobile-order-first responsive-image-container">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 lg:p-8 shadow-xl w-full max-w-md lg:max-w-none">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                      <GraduationCap className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Hơn 10,000+</h3>
                    <p className="text-sm lg:text-base text-gray-600">Sinh viên đã tin tưởng và sử dụng nền tảng Hyhan để phát triển sự nghiệp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision, Mission, Goals Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tầm nhìn - Sứ mệnh - Mục tiêu</h2>
              <p className="text-lg text-white">Định hướng phát triển và cam kết của Hyhan</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <VisionCard
                icon={<Eye className="w-8 h-8" />}
                title="Tầm nhìn"
                description="Trở thành nền tảng hàng đầu kết nối giáo dục và tài chính tại Việt Nam, tạo cơ hội bình đẳng cho mọi sinh viên tiếp cận nguồn lực học tập và phát triển sự nghiệp."
              />
              <VisionCard
                icon={<Target className="w-8 h-8" />}
                title="Sứ mệnh"
                description="Sử dụng công nghệ AI để cá nhân hóa trải nghiệm giáo dục, kết nối sinh viên với các cơ hội học bổng, khóa học và việc làm phù hợp nhất với tiềm năng của họ."
              />
              <VisionCard
                icon={<Heart className="w-8 h-8" />}
                title="Mục tiêu"
                description="Hỗ trợ 100,000 sinh viên Việt Nam trong 5 năm tới, giúp họ tiết kiệm 50% thời gian tìm kiếm cơ hội và tăng 80% khả năng thành công trong ứng tuyển."
              />
            </div>
          </div>
        </section>

        {/* Platform Services Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-4">Nền tảng cung cấp những dịch vụ gì?</h2>
              <p className="text-lg text-gray-600">Khám phá các tính năng nổi bật của Hyhan</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceFeature
                icon={<Award className="w-8 h-8 text-blue-600" />}
                title="EduScore - Đánh giá năng lực"
                description="Hệ thống đánh giá thông minh với AI, tạo hồ sơ cá nhân chi tiết và gợi ý cơ hội phù hợp."
                link="/eduscore"
              />
              <ServiceFeature
                icon={<GraduationCap className="w-8 h-8 text-green-600" />}
                title="Học bổng"
                description="Tìm kiếm và ứng tuyển hàng ngàn học bổng từ các tổ chức uy tín trong và ngoài nước."
                link="/scholarship"
              />
              <ServiceFeature
                icon={<BookOpen className="w-8 h-8 text-purple-600" />}
                title="Khóa học trực tuyến"
                description="Thư viện khóa học đa dạng từ các trường đại học và tổ chức giáo dục hàng đầu."
                link="/course"
              />
              <ServiceFeature
                icon={<Briefcase className="w-8 h-8 text-orange-600" />}
                title="Việc làm & Thực tập"
                description="Kết nối với hàng nghìn cơ hội việc làm và thực tập từ các doanh nghiệp uy tín."
                link="/job"
              />
              <ServiceFeature
                icon={<MessageSquare className="w-8 h-8 text-cyan-600" />}
                title="AI Tư vấn"
                description="Trợ lý AI 24/7 hỗ trợ tư vấn định hướng nghề nghiệp và lộ trình học tập cá nhân."
                link="/ai-advice"
              />
              <ServiceFeature
                icon={<CreditCard className="w-8 h-8 text-red-600" />}
                title="Hỗ trợ tài chính"
                description="Dịch vụ tư vấn và kết nối các gói vay học phí với lãi suất ưu đãi cho sinh viên."
                link="/finance"
              />
            </div>
          </div>
        </section>

        {/* EduScore Introduction */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="responsive-section">
              <div className="mobile-order-last">
                <h2 className="responsive-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6 mobile-title-center">EduScore - Chìa khóa mở ra cơ hội</h2>
                <div className="space-y-4 mb-8">
                  <p className="text-base lg:text-lg text-gray-700 text-center lg:text-left">
                    EduScore là hệ thống đánh giá năng lực độc quyền của Hyhan, sử dụng AI để phân tích toàn diện kỹ năng, 
                    kiến thức và tiềm năng của bạn.
                  </p>
                  <div className="flex items-start lg:items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 lg:mt-0" />
                    <span className="text-sm lg:text-base text-gray-700">Đánh giá 360 độ về năng lực học thuật và kỹ năng mềm</span>
                  </div>
                  <div className="flex items-start lg:items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 lg:mt-0" />
                    <span className="text-sm lg:text-base text-gray-700">Gợi ý cơ hội học bổng và việc làm phù hợp 90%</span>
                  </div>
                  <div className="flex items-start lg:items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 lg:mt-0" />
                    <span className="text-sm lg:text-base text-gray-700">Cập nhật và tối ưu hồ sơ theo thời gian thực</span>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Link href="/eduscore">Tìm hiểu thêm <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </div>
              <div className="mobile-order-first responsive-image-container">
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-md lg:max-w-none">
                  <div className="text-center mb-4 lg:mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                      <Award className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">EduScore: 850/1000</h3>
                    <p className="text-sm lg:text-base text-gray-600">Mức độ xuất sắc</p>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm font-medium text-gray-700">Kỹ năng học thuật</span>
                      <span className="text-xs lg:text-sm font-bold text-blue-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[92%]"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm font-medium text-gray-700">Kỹ năng mềm</span>
                      <span className="text-xs lg:text-sm font-bold text-cyan-600">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-600 h-2 rounded-full w-[88%]"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs lg:text-sm font-medium text-gray-700">Kinh nghiệm thực tế</span>
                      <span className="text-xs lg:text-sm font-bold text-green-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[75%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Finance Introduction */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6">Hỗ trợ tài chính học tập</h2>
              <p className="text-lg text-gray-600 mb-12">
                Hyhan kết nối bạn với các tổ chức tài chính uy tín, cung cấp các gói vay học phí 
                với lãi suất ưu đãi và điều kiện linh hoạt.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lãi suất thấp</h3>
                  <p className="text-gray-600">Chỉ từ 6.5%/năm cho sinh viên có EduScore cao</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thủ tục đơn giản</h3>
                  <p className="text-gray-600">Duyệt hồ sơ nhanh chóng chỉ trong 1 chạm</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanh toán linh hoạt</h3>
                  <p className="text-gray-600">Gia hạn và trả góp theo khả năng tài chính</p>
                </div>
              </div>
              <Button size="lg" asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Link href="/finance">Tìm hiểu gói vay <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Những câu hỏi thường gặp</h2>
              <p className="text-lg text-gray-600">Giải đáp những thắc mắc phổ biến về nền tảng Hyhan</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <FAQSection />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng khám phá tiềm năng của bạn?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Hành trình đến tương lai tươi sáng bắt đầu từ hôm nay. Tạo EduScore miễn phí và khám phá những cơ hội dành riêng cho bạn.
            </p>
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Link href="/survey">Bắt đầu ngay <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function VisionCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="p-8 h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
          <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

function ServiceFeature({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <Card className="p-6 h-full bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
          <Button variant="outline" size="sm" asChild className="group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors duration-300">
            <Link href={link}>Tìm hiểu thêm <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "EduScore là gì và nó hoạt động như thế nào?",
      answer: "EduScore là hệ thống đánh giá năng lực độc quyền của Hyhan, sử dụng AI để phân tích toàn diện kỹ năng, kiến thức và tiềm năng của bạn. Thông qua bài khảo sát chi tiết, chúng tôi tạo ra một điểm số từ 0-1000 giúp định hướng các cơ hội học tập và việc làm phù hợp nhất."
    },
    {
      question: "Làm thế nào để tìm được học bổng phù hợp trên Hyhan?",
      answer: "Sau khi hoàn thành EduScore, AI của chúng tôi sẽ tự động gợi ý các học bổng phù hợp với hồ sơ của bạn. Bạn cũng có thể sử dụng bộ lọc tìm kiếm theo lĩnh vực, mức học bổng, và điều kiện ứng tuyển để tìm ra những cơ hội tốt nhất."
    },
    {
      question: "Tôi có phải trả phí để sử dụng dịch vụ của Hyhan không?",
      answer: "Hyhan cung cấp nhiều dịch vụ miễn phí bao gồm tạo EduScore, tìm kiếm học bổng cơ bản, và tư vấn AI. Các dịch vụ premium như phân tích chi tiết, tư vấn cá nhân 1-1, và hỗ trợ ứng tuyển chuyên sâu sẽ có phí dịch vụ hợp lý."
    },
    {
      question: "Làm sao để được hỗ trợ vay học phí với lãi suất ưu đãi?",
      answer: "Sinh viên có EduScore từ 700 trở lên sẽ được ưu tiên vay với lãi suất từ 6.5%/năm. Bạn cần cung cấp hồ sơ học tập, EduScore và thông tin tài chính. Quá trình duyệt hồ sơ diễn ra nhanh chóng với thủ tục đơn giản."
    },
    {
      question: "AI Tư vấn của Hyhan có thể giúp tôi những gì?",
      answer: "AI Tư vấn hoạt động 24/7 để hỗ trợ bạn về định hướng nghề nghiệp, lộ trình học tập, gợi ý khóa học phù hợp, và tư vấn ứng tuyển. AI được huấn luyện trên dữ liệu giáo dục và thị trường việc làm Việt Nam, đảm bảo lời khuyên chính xác và phù hợp."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
            <CollapsibleTrigger className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6 mt-4">
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}