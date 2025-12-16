"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/react-web-ui-shadcn/src/components/ui/input"
import { Button } from "@/react-web-ui-shadcn/src/components/ui/button"

interface ChangePasswordPageProps {
  onBack: () => void
}

export function ChangePasswordPage({ onBack }: ChangePasswordPageProps) {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change logic here
    console.log("Password change submitted")
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#658C58] text-white p-6 rounded-t-lg relative">
        <button onClick={onBack} className="p-2 hover:bg-[#31694E] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-center">ĐỔI MẬT KHẨU</h1>
      </div>

      <div className="bg-white p-6 space-y-6 rounded-b-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="old-password" className="text-base font-medium text-gray-900">
              Mật khẩu cũ
            </Label>
            <div className="relative">
              <Input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="pr-10 h-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-base font-medium text-gray-900">
              Mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10 h-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-base font-medium text-gray-900">
              Nhập lại mật khẩu mới
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10 h-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-14 bg-[#658C58] hover:bg-[#31694E] text-white text-lg font-semibold rounded-lg"
            >
              Xác nhận
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
