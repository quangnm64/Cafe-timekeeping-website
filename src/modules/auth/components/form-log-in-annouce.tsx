'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';

import { LucideCoffee, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AlreadyLogin() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F0E491] via-[#BBC863] to-[#658C58] p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none overflow-hidden bg-white/95 backdrop-blur-sm py-0">
        <CardHeader className="text-center space-y-3 pt-8 pb-6 bg-[#31694E]">
          <div className="flex justify-center">
            <LucideCoffee className="h-12 w-12 text-[#BBC863]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-[#F0E491] tracking-wider">
            Hệ thống chấm công
          </CardTitle>
          <p className="text-sm text-[#BBC863]">Trạng thái đăng nhập</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-10 pb-8 px-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-14 w-14 text-[#658C58]" />
            <p className="text-lg font-semibold text-[#31694E]">
              Bạn đã đăng nhập rồi 🎉
            </p>
            <p className="text-sm text-gray-500">
              Nhấn nút bên dưới để vào trang dashboard
            </p>
          </div>

          <Button
            className="w-full h-11 bg-[#658C58] hover:bg-[#31694E] text-white font-bold rounded-xl shadow-lg"
            onClick={() => router.push('/dashboard')}
          >
            Đi tới Dashboard
          </Button>
        </CardContent>

        <div className="p-4 bg-gray-50/50 text-center text-xs text-gray-500 border-t">
          © {new Date().getFullYear()} - Developed with 💚 and Coffee.
        </div>
      </Card>
    </div>
  );
}
