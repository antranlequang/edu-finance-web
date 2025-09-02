
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap, ChevronDown, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial render
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    closeMenu();
  };
  
  const closeMenu = () => setIsOpen(false);

  const mainLinks = [
    { href: '/eduscore', label: 'Eduscore' },
    { href: '/ai-advice', label: 'Tư Vấn AI' },
    { href: '/about-us', label: 'Về Chúng Tôi' },
  ];
  
  const discoverLinks = [
    { href: '/course', label: 'Khóa Học' },
    { href: '/scholarship', label: 'Học Bổng' },
    { href: '/job', label: 'Việc Làm' },
    { href: '/finance', label: 'Tài Chính' },
  ];

  const renderAuthSection = (isMobile = false) => {
    if (user) {
      return (
        <div className={cn("flex items-center gap-2", isMobile && "flex-col w-full")}>
            {user.role === 'admin' && (
              <Button variant="ghost" asChild className={cn(isMobile && "w-full justify-start")}>
                  <Link href="/admin/dashboard" onClick={closeMenu}>Bảng Điều Khiển Admin</Link>
              </Button>
            )}
           <Button variant="ghost" asChild className={cn(isMobile && "w-full justify-start")}>
            <Link href="/profile" onClick={closeMenu}>Hồ Sơ</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout} className={cn(isMobile && "w-full")}>Đăng Xuất</Button>
        </div>
      );
    }
    return (
      <div className={cn("flex items-center gap-2", isMobile && "flex-col w-full")}>
        <Button variant="ghost" asChild className={cn(isMobile && "w-full")}>
          <Link href="/login" onClick={closeMenu}>Đăng Nhập</Link>
        </Button>
        <Button asChild className={cn("bg-accent hover:bg-accent/90", isMobile && "w-full")}>
          <Link href="/register" onClick={closeMenu}>Đăng Ký</Link>
        </Button>
      </div>
    );
  };

  const headerClasses = cn(
    "sticky top-0 z-50 transition-all duration-300",
    isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
  );
  
  const textColorClass = "text-foreground";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <GraduationCap className={cn("h-8 w-8 text-primary")} />
            <span className={cn( "text-xl font-bold text-primary")}>HYHAN EDUCATION</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn("font-medium hover:text-primary transition-colors flex items-center gap-1 text-sm", textColorClass)}>
                        Khám Phá <ChevronDown className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {discoverLinks.map((link) => (
                         <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>{link.label}</Link>
                         </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn("font-medium hover:text-primary transition-colors text-sm", textColorClass)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {renderAuthSection()}
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className={cn("h-6 w-6", textColorClass)} /> : <Menu className={cn("h-6 w-6", textColorClass)} />}
            </Button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <h3 className="px-2 text-sm font-semibold text-muted-foreground">Khám Phá</h3>
            {discoverLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground font-medium block p-2 rounded-md hover:bg-secondary transition-colors" onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
            <div className='my-2 border-t'></div>
            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground font-medium block p-2 rounded-md hover:bg-secondary transition-colors" onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t">
              {renderAuthSection(true)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
