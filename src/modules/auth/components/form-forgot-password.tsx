'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Loader2, Mail } from 'lucide-react';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import Link from 'next/link';
import axios from 'axios';

export default function FormForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/auth/log-out');
    window.location.href = '/log-in';
    setLoading(true);
    setMessage(null);

    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      // Giả sử thành công
      setMessage('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E491] via-[#BBC863] to-[#658C58] p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none overflow-hidden bg-white/95 backdrop-blur-sm py-0">
        <CardHeader className="text-center space-y-2 pt-8 pb-6 bg-[#31694E]">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-[#BBC863]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-[#F0E491] tracking-wider">
            Quên Mật khẩu?
          </CardTitle>
          <p className="text-sm text-[#BBC863]">
            Nhập email để nhận liên kết đặt lại
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit} method="POST">
          <CardContent className="space-y-6 pt-6 pb-8 px-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#31694E]">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-2 border-[#BBC863] focus-visible:ring-2 focus-visible:ring-[#658C58] focus-visible:ring-offset-0 text-[#31694E]"
                required
              />
            </div>

            {message && (
              <p className="text-sm text-center text-green-600 font-medium">
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#658C58] hover:bg-[#31694E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#658C58]/30 hover:shadow-[#31694E]/40"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Gửi yêu cầu'
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Đã nhớ mật khẩu?{' '}
              <Link
                href="/log-in"
                className="text-[#31694E] hover:underline font-semibold"
              >
                Đăng nhập
              </Link>
            </p>
          </CardContent>
        </form>

        <div className="p-4 bg-gray-50/50 text-center text-xs text-gray-500 border-t border-gray-100">
          © {new Date().getFullYear()} - Developed with 💚 and Coffee.
        </div>
      </Card>
    </div>
  );
}
