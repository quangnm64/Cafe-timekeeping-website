'use client';

import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/react-web-ui-shadcn/src/components/ui/form';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';

/**
 * 1. Định nghĩa Schema kiểm tra dữ liệu bằng Zod
 * Bao gồm: ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
 */
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ cái viết hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ cái viết thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// Trích xuất kiểu dữ liệu từ Schema để sử dụng cho Form (Tránh lỗi Unexpected any)
type ChangePasswordValues = z.infer<typeof passwordSchema>;

interface ChangePasswordPageProps {
  onBack: () => void;
}

export function ChangePasswordPage({ onBack }: ChangePasswordPageProps) {
  // States kiểm soát hiển thị mật khẩu
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Khởi tạo Form với Zod Resolver
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 3. Hàm xử lý gửi dữ liệu
  const onSubmit = async (values: ChangePasswordValues) => {
    setLoading(true);
    try {
      const result = await axios.post('/api/auth/reset-password', values);

      if (result.status === 200 || result.status === 201) {
        form.reset();
        // Đăng xuất và điều hướng về trang login sau khi đổi thành công
        await axios.post('/api/auth/log-out').catch(() => {
          /* Bỏ qua lỗi logout nếu có */
        });
        window.location.href = '/log-in';
      }
    } catch (error) {
      // Xử lý lỗi TypeScript "Unexpected any" bằng cách ép kiểu AxiosError
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 'Đã xảy ra lỗi không xác định';

      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden mt-4">
      {/* Header */}
      <div className="bg-[#658C58] text-white p-6 relative flex items-center">
        <button
          type="button"
          className="p-2 hover:bg-white/20 rounded-lg transition-colors absolute left-4"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold w-full text-center">ĐỔI MẬT KHẨU</h1>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Mật khẩu cũ */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Mật khẩu cũ
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showOld ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu cũ của bạn"
                        className="h-12 pr-10 border-gray-300"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOld ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mật khẩu mới */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Mật khẩu mới
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNew ? 'text' : 'password'}
                        placeholder="Tối thiểu 8 ký tự, 1 hoa, 1 số, 1 đặc biệt"
                        className="h-12 pr-10 border-gray-300"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Xác nhận mật khẩu mới */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Xác nhận mật khẩu mới
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        className="h-12 pr-10 border-gray-300"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-[#658C58] hover:bg-[#547549] text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang lưu thay đổi...
                  </div>
                ) : (
                  'XÁC NHẬN THAY ĐỔI'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
