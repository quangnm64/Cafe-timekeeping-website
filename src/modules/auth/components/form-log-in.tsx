'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/react-web-ui-shadcn/src/components/ui/form';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';

import { LucideCoffee, EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { LogInDto } from '../interfaces/auth.interfaces';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function FormLogin() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputType = isShowPassword ? 'text' : 'password';

  const form = useForm<LogInDto>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LogInDto) => {
    try {
      setLoading(true);
      const user = await axios.post('/api/auth/login', values);
      if (user.data.status) {
        router.push('/time-keeping');
        setLoading(false);
      } else {
        alert('chưa tìm thấy tài khoản');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F0E491] via-[#BBC863] to-[#658C58] p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none overflow-hidden bg-white/95 backdrop-blur-sm py-0">
        <CardHeader className="text-center space-y-2 pt-8 pb-6 bg-[#31694E]">
          <div className="flex justify-center">
            <LucideCoffee className="h-12 w-12 text-[#BBC863]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-[#F0E491] tracking-wider">
            Hệ thống chấm công
          </CardTitle>
          <p className="text-sm text-[#BBC863]">
            Đăng nhập để bắt đầu chấm công
          </p>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-6 pb-8 px-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#31694E]">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Username"
                        className="h-11 border-2 border-[#BBC863] focus-visible:ring-2 focus-visible:ring-[#658C58]"
                        {...field}
                      />
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
                    <FormLabel className="text-[#31694E]">Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={inputType}
                          placeholder="••••••••"
                          className="h-11 border-2 border-[#BBC863] pr-10 focus-visible:ring-2 focus-visible:ring-[#658C58]"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full w-10 text-[#658C58]"
                          onClick={() => setIsShowPassword(!isShowPassword)}
                          tabIndex={-1}
                        >
                          {!isShowPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-[#658C58] hover:bg-[#31694E] text-white font-bold rounded-xl shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </CardContent>
          </form>
        </Form>

        <div className="p-4 bg-gray-50/50 text-center text-xs text-gray-500 border-t">
          © {new Date().getFullYear()} - Developed with 💚 and Coffee.
        </div>
      </Card>
    </div>
  );
}
