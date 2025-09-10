
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth-neon';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Địa chỉ email không hợp lệ.' }),
  password: z.string().min(1, { message: 'Mật khẩu là bắt buộc.' }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/';
      router.replace(destination);
    }
  }, [user, loading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        await login(values.email, values.password);
        toast({ title: 'Thành Công', description: 'Đăng nhập thành công.' });
        // The useEffect will handle the redirection.
    } catch (error: any) {
        console.error("Login failed:", error);
        toast({ 
            variant: 'destructive',
            title: 'Đăng Nhập Thất Bại', 
            description: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.'
        });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading || user) {
     return (
        <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center mb-2">ĐĂNG NHẬP</CardTitle>
        <CardDescription className="text-center">Nhập thông tin đăng nhập để truy cập tài khoản của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="nguyenvana@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật Khẩu:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng Nhập
            </Button>
            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                Quên mật khẩu?
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
