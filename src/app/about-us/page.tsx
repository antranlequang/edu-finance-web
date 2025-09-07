import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Building, Scale, Lightbulb, Users, Target, HeartHandshake, BookOpen } from 'lucide-react';
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        {/* Main Content */}
        <div className="relative h-[30vh] md:h-[40vh] flex items-center justify-center text-center overflow-hidden ">
            <div className="flex flex-col items-center">
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 mb-6">
                    VỀ HYHAN
                </h1>
                <p className="text-base md:text-2xl">Chúng tôi cam kết tạo ra một thế giới công bằng, minh bạch và kết nối bằng cách trao quyền cho mọi người thông qua giáo dục và công nghệ.</p>
            </div>
        </div>

        <section className="py-16 ">
           <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div>
                  <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                      To build a fair and transparent ecosystem connecting learners, educational institutions, and employers. We leverage AI to provide personalized guidance, ensuring everyone can achieve their full potential regardless of their background.
                  </p>
              </div>
               <div>
                  <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                      We envision a future where education is a universal right, not a privilege. Our platform aims to be the leading force in breaking down barriers to create a global community built on knowledge, skill, and opportunity.
                  </p>
              </div>
           </div>
        </section>

        <section className="py-16 bg-secondary -mx-4 px-4">
            <div className="container mx-auto">
                 <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Values</h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    The principles that guide our work and define our culture.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ValuePillar icon={<Scale />} title="Fairness" description="We believe in equal opportunities for all and build systems that are unbiased and equitable." />
                    <ValuePillar icon={<Lightbulb />} title="Transparency" description="We operate with openness, ensuring our processes and decisions are clear and understandable." />
                    <ValuePillar icon={<Users />} title="Connection" description="We foster a strong network between students, mentors, and employers to create a supportive community." />
                    <ValuePillar icon={<Target />} title="Flexibility" description="We adapt to the evolving needs of learners and the job market, providing dynamic and relevant resources." />
                    <ValuePillar icon={<HeartHandshake />} title="Humanity" description="We prioritize the well-being and aspirations of individuals, treating everyone with empathy and respect." />
                    <ValuePillar icon={<BookOpen />} title="Sustainability" description="We are committed to building a long-term, self-sustaining model for educational and career advancement." />
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ValuePillar({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="text-center p-6 border rounded-lg bg-background">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
