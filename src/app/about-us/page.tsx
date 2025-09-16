import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Building, Scale, Lightbulb, Users, Target, HeartHandshake, BookOpen, Award, TrendingUp, Globe, Zap, Crown, User, UserCheck, Briefcase } from 'lucide-react';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfileImage from "@/components/ui/ProfileImage";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-indigo-600/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-anton tracking-wide leading-tight mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
                VỀ HYHAN
              </span>
            </h1>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Building className="w-4 h-4 mr-2" />
              Được thành lập năm 2025
            </div>
            <p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Chúng tôi cam kết tạo ra một thế giới công bằng, minh bạch và kết nối bằng cách trao quyền cho mọi người thông qua giáo dục và công nghệ.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700">
                <Globe className="w-4 h-4 mr-2" />
                Tầm nhìn toàn cầu
              </Badge>
              <Badge className="px-6 py-3 text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <Zap className="w-4 h-4 mr-2" />
                Công nghệ AI
              </Badge>
              <Badge className="px-6 py-3 text-base bg-indigo-600 hover:bg-indigo-700">
                <Award className="w-4 h-4 mr-2" />
                Chất lượng hàng đầu
              </Badge>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-full bg-blue-600 text-white">
                        <Target className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-blue-900">Sứ mệnh của chúng tôi</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify"> 
                      HYHAN tin rằng mỗi bạn trẻ đều xứng đáng được chắp cánh để theo đuổi ước mơ, bất kể xuất phát điểm và mong muốn trở thành một người bạn đồng hành đáng tin cậy, mang đến cơ hội công bằng, minh bạch và bền vững.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-full bg-indigo-600 text-white">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-indigo-900">Tầm nhìn của chúng tôi</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-700 leading-relaxed text-justify">
                      Trở thành nền tảng hàng đầu kết nối giáo dục và tài chính tại Việt Nam, tạo cơ hội bình đẳng cho mọi sinh viên tiếp cận nguồn lực học tập và phát triển sự nghiệp.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 p-1">
                  <div className="h-full w-full rounded-2xl bg-white flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                        100K+
                      </div>
                      <p className="text-xl font-semibold text-gray-800">Học sinh được hỗ trợ</p>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">50+</div>
                          <div className="text-sm text-gray-600">Đối tác</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">95%</div>
                          <div className="text-sm text-gray-600">Hài lòng</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">24/7</div>
                          <div className="text-sm text-gray-600">Hỗ trợ</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">AI</div>
                          <div className="text-sm text-gray-600">Công nghệ</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 leading-tight py-4">                
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Những nguyên tắc định hướng công việc và văn hóa của chúng tôi
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ValueCard
                icon={<Scale />}
                title="Công bằng"
                description="Chúng tôi tin vào cơ hội bình đẳng cho tất cả và xây dựng hệ thống không thiên vị và công bằng."
                gradient="from-blue-500 to-cyan-500"
              />
              <ValueCard
                icon={<Lightbulb />}
                title="Minh bạch"
                description="Chúng tôi hoạt động với sự cởi mở, đảm bảo các quy trình và quyết định rõ ràng, dễ hiểu."
                gradient="from-cyan-500 to-teal-500"
              />
              <ValueCard
                icon={<Users />}
                title="Kết nối"
                description="Chúng tôi thúc đẩy mạng lưới mạnh mẽ giữa sinh viên, cố vấn và nhà tuyển dụng."
                gradient="from-teal-500 to-green-500"
              />
              <ValueCard
                icon={<Target />}
                title="Linh hoạt"
                description="Chúng tôi thích ứng với nhu cầu phát triển của người học và thị trường việc làm."
                gradient="from-green-500 to-emerald-500"
              />
              <ValueCard
                icon={<HeartHandshake />}
                title="Nhân văn"
                description="Chúng tôi ưu tiên phát triển khát vọng của cá nhân, đối xử với mọi người bằng sự đồng cảm."
                gradient="from-emerald-500 to-blue-500"
              />
              <ValueCard
                icon={<BookOpen />}
                title="Bền vững"
                description="Chúng tôi cam kết xây dựng mô hình lâu dài, tự duy trì cho sự phát triển giáo dục."
                gradient="from-purple-500 to-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* Organizational Chart */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent text-white mb-6">
                Cơ cấu tổ chức
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-white">
                Đội ngũ lãnh đạo và các phòng ban của HYHAN
              </p>
            </div>
            <OrganizationChart />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, description, gradient }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  gradient: string 
}) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <CardContent className="relative z-10 p-8 text-center">
        <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}

function OrganizationChart() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* CEO and Advisory Board Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 justify-items-center">
        <OrgCard
          title="Giám đốc điều hành"
          name=" Ông Trần Lê Quang An"
          icon={<Crown />}
          level="ceo"
          gradient="from-purple-600 to-indigo-600"
          imageUrl="/images/team/ceo.jpg"
        />
        <OrgCard
          title=""
          name="Hội đồng Cố vấn"
          icon={<Users />}
          level="advisory"
          gradient="from-blue-600 to-cyan-600"
        />
      </div>

      {/* Connection Line from CEO */}
      <div className="flex justify-center mb-8">
        <div className="w-1 h-12 bg-white"></div>
      </div>

      {/* C-Level Executives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16 justify-items-center">
        <OrgCard
          title="Giám đốc công nghệ"
          name="Bà Bùi Thị Ngọc Hà"
          icon={<Zap />}
          level="executive"
          gradient="from-purple-600 to-pink-600"
          imageUrl="/images/team/cto.jpg"
        />
        <OrgCard
          title="Giám đốc vận hành"
          name="Bà Huỳnh Thị Ngọc Nhi"
          icon={<Target />}
          level="executive"
          gradient="from-blue-600 to-indigo-600"
          imageUrl="/images/team/coo.jpg"
        />
        <OrgCard
          title="Giám đốc tài chính"
          name="Ông Nguyễn Hạo"
          icon={<Briefcase />}
          level="executive"
          gradient="from-green-600 to-emerald-600"
          imageUrl="/images/team/cfo.jpg"
        />
        <OrgCard
          title="Giám đốc Marketing"
          name="Bà Lê Hoàng Phi Yến"
          icon={<TrendingUp />}
          level="executive"
          gradient="from-orange-500 to-red-500"
          imageUrl="/images/team/cmo.jpg"
        />
        <OrgCard
          title="Trưởng Phòng Pháp chế"
          name="Hứa Hoàng Long"
          icon={<Scale />}
          level="executive"
          gradient="from-gray-600 to-slate-600"
          imageUrl="/images/team/legal.jpg"
        />
      </div>

      {/* Connection Line to Departments */}
      <div className="flex justify-center mb-8">
        <div className="w-1 h-12 bg-white"></div>
      </div>

      {/* Department Level */}
      <div className="text-center mb-8">
        <div className="inline-block px-6 py-3 bg-gray-100 rounded-full text-gray-600 font-semibold">
          Các phòng ban
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DepartmentCard
          name="Phòng Công nghệ"
          gradient="from-purple-500 to-pink-500"
        />
        <DepartmentCard
          name="Phòng Vận hành"
          gradient="from-blue-500 to-indigo-500"
        />
        <DepartmentCard
          name="Phòng Tài chính"
          gradient="from-green-500 to-emerald-500"
        />
        <DepartmentCard
          name="Phòng Marketing"
          gradient="from-orange-500 to-red-500"
        />
        <DepartmentCard
          name="Phòng Nhân sự"
          gradient="from-teal-500 to-cyan-500"
        />
        <DepartmentCard
          name="Phòng Kinh doanh"
          gradient="from-pink-500 to-rose-500"
        />
        <DepartmentCard
          name="Phòng Hỗ trợ"
          gradient="from-indigo-500 to-purple-500"
        />
        <DepartmentCard
          name="Phòng Nội dung"
          gradient="from-emerald-500 to-teal-500"
        />
      </div>
    </div>
  );
}

function OrgCard({ title, name, icon, level, gradient, imageUrl }: {
  title: string,
  name: string,
  icon: React.ReactNode,
  level: 'ceo' | 'advisory' | 'executive',
  gradient: string,
  imageUrl?: string
}) {
  const getCardSize = () => {
    switch (level) {
      case 'ceo': return 'w-72 h-40';
      case 'advisory': return 'w-72 h-40';
      case 'executive': return 'w-64 h-36';
      default: return 'w-64 h-36';
    }
  };

  const getIconSize = () => {
    switch (level) {
      case 'ceo': return 'w-20 h-20';
      case 'advisory': return 'w-20 h-20';
      case 'executive': return 'w-16 h-16';
      default: return 'w-16 h-16';
    }
  };

  const getNameSize = () => {
    switch (level) {
      case 'ceo': return 'text-xl font-bold';
      case 'advisory': return 'text-xl font-bold';
      case 'executive': return 'text-lg font-bold';
      default: return 'text-lg font-bold';
    }
  };

  const getTitleSize = () => {
    switch (level) {
      case 'ceo': return 'text-lg font-semibold';
      case 'advisory': return 'text-lg font-semibold';
      case 'executive': return 'text-base font-semibold';
      default: return 'text-base font-semibold';
    }
  };

  return (
    <Card className={`${getCardSize()} shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
        {/* Photo/Icon at the top */}
        <div className={`${getIconSize()} rounded-full mb-4 shadow-lg overflow-hidden`}>
          {imageUrl ? (
            <ProfileImage
              src={imageUrl}
              alt={`${name} - ${title}`}
              width={level === 'ceo' || level === 'advisory' ? 80 : 64}
              height={level === 'ceo' || level === 'advisory' ? 80 : 64}
              fallbackIcon={icon}
              gradient={gradient}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white rounded-full`}>
              {icon}
            </div>
          )}
        </div>
        
        {/* Name */}
        <h3 className={`${getNameSize()} text-gray-800 mb-2 leading-tight`}>
          {name}
        </h3>
        
        {/* Position/Title */}
        <p className={`${getTitleSize()} text-gray-600`}>
          {title}
        </p>
      </CardContent>
    </Card>
  );
}

function DepartmentCard({ name, gradient }: { name: string, gradient: string }) {
  return (
    <Card className="shadow-md border-0 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-4 text-center">
        <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3`}>
          <Briefcase className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-gray-800 text-sm">{name}</h4>
      </CardContent>
    </Card>
  );
}
