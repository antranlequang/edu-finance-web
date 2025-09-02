import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EduGuideAI</span>
        </Link>
        <LoginForm />
         <p className="mt-4 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Đăng Ký
          </Link>
        </p>
      </div>
    </div>
  );
}
