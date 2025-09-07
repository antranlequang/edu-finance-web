import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">HYHAN EDUCATION</span>
            </Link>
            <p className="text-muted-foreground text-base text-justify italic">
              "Đồng hành hôm nay, tiếp bước ngày mai" 
            </p>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold mb-4">Dịch Vụ</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/course" className="text-muted-foreground hover:text-primary transition-colors text-sm">Khóa Học</Link>
              <Link href="/scholarship" className="text-muted-foreground hover:text-primary transition-colors text-sm">Học Bổng</Link>
              <Link href="/job" className="text-muted-foreground hover:text-primary transition-colors text-sm">Việc Làm</Link>
              <Link href="/finance" className="text-muted-foreground hover:text-primary transition-colors text-sm">Tài Chính</Link>
              <Link href="/ai-advice" className="text-muted-foreground hover:text-primary transition-colors text-sm">Tư Vấn AI</Link>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Công Ty</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about-us" className="text-muted-foreground hover:text-primary transition-colors text-sm">Về Chúng Tôi</Link>
              <Link href="/contact-us" className="text-muted-foreground hover:text-primary transition-colors text-sm">Liên Hệ</Link>
              <Link href="/guide" className="text-muted-foreground hover:text-primary transition-colors text-sm">Hướng Dẫn</Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Pháp Lý</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Chính Sách Bảo Mật</Link>
              <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">Điều Khoản Dịch Vụ</Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm text-center sm:text-left mb-4 sm:mb-0">
                © {new Date().getFullYear()} Hyhan Education. All rights reserved.
            </p>
            <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
