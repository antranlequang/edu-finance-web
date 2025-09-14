
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { useAuth } from '@/hooks/use-auth-neon';
import ReCAPTCHA from "react-google-recaptcha";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.string({ required_error: "Please select a gender." }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string().min(8, { message: 'Confirm password must be at least 8 characters.' }),
  captcha: z.string().min(1, { message: 'Vui lòng xác thực CAPTCHA.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      captcha: '',
    }
  });

  const [inputValue, setInputValue] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Verify CAPTCHA
      if (!values.captcha) {
        toast({
          variant: 'destructive',
          title: 'Lỗi xác thực',
          description: 'Vui lòng hoàn thành xác thực CAPTCHA.'
        });
        setIsLoading(false);
        return;
      }

      await register(
        values.email, 
        values.password, 
        values.fullName, 
        values.dob,
        values.gender
      );
      
      // Reset CAPTCHA on success
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      
      toast({ 
        title: 'Đăng ký thành công!', 
        description: 'Tài khoản của bạn đã được tạo thành công!' 
      });
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      // Handle specific registration errors
      if (error.message.includes('Email đã tồn tại')) {
        form.setError('email', {
          type: 'manual',
          message: 'Email này đã được sử dụng.',
        });
      } else if (error.message.includes("Mật khẩu không khớp")) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: 'Mật khẩu không khớp.',
        });
      } else {
        toast({ 
            variant: 'destructive',
            title: 'Đăng ký thất bại', 
            description: error.message || 'Lỗi không xác định, hãy thử lại.' 
        });
      }
      
      // Reset CAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        form.setValue('captcha', '');
      }
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Tạo tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end h-full">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Ngày sinh</FormLabel>
                    <Popover>
                      <FormControl>
                        <div className="flex">
                          <Input
                            placeholder="dd/mm/yyyy"
                            value={inputValue}
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const prevLength = inputValue.length;
                              const currentLength = rawValue.length;
                              
                              // Handle deletion
                              if (currentLength < prevLength) {
                                let val = rawValue.replace(/\D/g, '');
                                
                                // Auto-format with slashes
                                if (val.length >= 2) {
                                  val = val.substring(0, 2) + '/' + val.substring(2);
                                }
                                if (val.length >= 5) {
                                  val = val.substring(0, 5) + '/' + val.substring(5, 9);
                                }
                                
                                setInputValue(val);
                              } else {
                                // Handle normal input
                                let val = rawValue.replace(/\D/g, '');
                                
                                // Limit to 8 digits (DDMMYYYY)
                                val = val.substring(0, 8);
                                
                                // Auto-format with slashes
                                if (val.length >= 2) {
                                  val = val.substring(0, 2) + '/' + val.substring(2);
                                }
                                if (val.length >= 5) {
                                  val = val.substring(0, 5) + '/' + val.substring(5);
                                }
                                
                                setInputValue(val);
                              }

                              // Parse and validate date
                              const cleanVal = rawValue.replace(/\D/g, '');
                              if (cleanVal.length === 8) {
                                const day = cleanVal.substring(0, 2);
                                const month = cleanVal.substring(2, 4);
                                const year = cleanVal.substring(4, 8);
                                
                                const parsed = new Date(`${year}-${month}-${day}`);
                                if (!isNaN(parsed.getTime())) {
                                  field.onChange(parsed);
                                }
                              }
                            }}
                          />
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              type="button"
                              className="ml-2"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                        </div>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3 border-b">
                          <div className="flex gap-2">
                            <Select
                              value={field.value ? (field.value.getMonth() + 1).toString() : ""}
                              onValueChange={(value) => {
                                const currentDate = field.value || new Date();
                                const newDate = new Date(currentDate.getFullYear(), parseInt(value) - 1, currentDate.getDate());
                                field.onChange(newDate);
                                setInputValue(format(newDate, "dd/MM/yyyy", { locale: vi }));
                              }}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Tháng" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                                  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
                                ].map((month, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={field.value ? field.value.getFullYear().toString() : ""}
                              onValueChange={(value) => {
                                const currentDate = field.value || new Date();
                                const newDate = new Date(parseInt(value), currentDate.getMonth(), currentDate.getDate());
                                field.onChange(newDate);
                                setInputValue(format(newDate, "dd/MM/yyyy", { locale: vi }));
                              }}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Năm" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setInputValue(format(date, "dd/MM/yyyy", { locale: vi }));
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          month={field.value || new Date()}
                          onMonthChange={(month) => {
                            if (field.value) {
                              const newDate = new Date(month.getFullYear(), month.getMonth(), field.value.getDate());
                              field.onChange(newDate);
                              setInputValue(format(newDate, "dd/MM/yyyy", { locale: vi }));
                            }
                          }}
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col justify-end h-full">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Giới tính</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="captcha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác thực bảo mật</FormLabel>
                  <FormControl>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      onChange={(token) => {
                        field.onChange(token || "");
                      }}
                      onExpired={() => {
                        field.onChange("");
                      }}
                      hl="vi"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo tài khoản
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
