"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-web-ui-shadcn/src/components/ui/card";
import { Button } from "@/react-web-ui-shadcn/src/components/ui/button";
import { LucideCoffee, Loader2, UserPlus, EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/react-web-ui-shadcn/src/components/ui/input";
import Link from "next/link";

export default function FormSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordType = isShowPassword ? "text" : "password";
  const confirmPasswordType = isShowConfirmPassword ? "text" : "password";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.");
        setLoading(false);
        return;
    }
    
    console.log("Đăng ký người dùng:", email);

    // Giả lập API call
    setTimeout(() => {
        setLoading(false);
        // Giả sử thành công
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
    }, 2000);
  };

  return (
   <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#F0E491] via-[#BBC863] to-[#658C58] p-4">
    <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none overflow-hidden bg-white/95 backdrop-blur-sm py-0">
        <CardHeader className="text-center space-y-2 pt-8 pb-6 bg-[#31694E]">
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-[#BBC863]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-[#F0E491] tracking-wider">
            Tạo Tài khoản
          </CardTitle>
          <p className="text-sm text-[#BBC863]">Tham gia Hệ thống Chấm công</p>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4 pb-6 px-8"> 
            <div className="space-y-1"> 
              <label className="text-sm font-medium text-[#31694E]">Họ và Tên</label>
              <Input
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 border-2 border-[#BBC863] focus-visible:ring-2 focus-visible:ring-[#658C58] focus-visible:ring-offset-0 text-[#31694E]"
                required
              />
            </div>
            <div className="space-y-1"> 
              <label className="text-sm font-medium text-[#31694E]">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-2 border-[#BBC863] focus-visible:ring-2 focus-visible:ring-[#658C58] focus-visible:ring-offset-0 text-[#31694E]"
                required
              />
            </div>

              <div className="space-y-1"> 
                <label className="text-sm font-medium text-[#31694E]">Mật khẩu</label>
                <div className="relative">
                  <Input
                    type={passwordType}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 border-2 border-[#BBC863] focus-visible:ring-2 focus-visible:ring-[#658C58] focus-visible:ring-offset-0 text-[#31694E] pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 text-[#658C58] hover:bg-transparent hover:text-[#31694E]"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    tabIndex={-1}
                  >
                    {isShowPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </Button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="space-y-1"> 
                  <label className="text-sm font-medium text-[#31694E]">Xác nhận Mật khẩu</label>
                  <div className="relative">
                    <Input
                      type={confirmPasswordType}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10 border-2 border-[#BBC863] focus-visible:ring-2 focus-visible:ring-[#658C58] focus-visible:ring-offset-0 text-[#31694E] pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 text-[#658C58] hover:bg-transparent hover:text-[#31694E]"
                      onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                      tabIndex={-1}
                    >
                      {isShowConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </Button>
                  </div>
              </div>

              {error && <p className="text-sm text-center text-red-500 font-medium">{error}</p>}

              <Button
                  type="submit"
                  className="w-full h-10 bg-[#658C58] hover:bg-[#31694E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#658C58]/30 hover:shadow-[#31694E]/40"
                  disabled={loading}
              >
                  {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      "Đăng ký"
                  )}
              </Button>
              
              <p className="text-center text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <Link href="/log-in" className="text-[#31694E] hover:underline font-semibold">
                      Đăng nhập ngay
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