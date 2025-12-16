"use client"

import { ChangePasswordPage } from "@/modules/auth/components/form-reset-password"
import { Card } from "@/react-web-ui-shadcn/src/components/ui/card"
import {
  FileText,
  User,
  Users,
  Briefcase,
  Gift,
  Ticket,
  Receipt,
  RotateCcw,
  Key,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { PersonalProfilePage } from "./menu-profile"

export function PersonalAccountPage() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)

  const menuItems = [
    { id: "job-description", label: "Mô tả công việc", icon: FileText },
    { id: "personal-profile", label: "Hồ sơ cá nhân", icon: User },
    { id: "my-team", label: "Team của tôi", icon: Users },
    { id: "work-process", label: "Quá trình công tác", icon: Briefcase },
    { id: "benefits", label: "Chế độ phúc lợi", icon: Gift },
    { id: "voucher-coupon", label: "Voucher & Coupon", icon: Ticket },
    { id: "payslip", label: "Phiếu báo lương", icon: Receipt },
    { id: "default-store", label: "Cửa hàng mặc định", icon: RotateCcw },
    { id: "change-password", label: "Đổi mật khẩu", icon: Key },
    { id: "logout", label: "Đăng xuất", icon: LogOut },
  ]
  if (selectedMenu === "personal-profile") {
    return <PersonalProfilePage onBack={() => setSelectedMenu(null)} />
  }
  if (selectedMenu === "change-password") {
    return <ChangePasswordPage onBack={() => setSelectedMenu(null)} />
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#658C58] text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold text-center">TÀI KHOẢN CỦA TÔI</h1>
      </div>

      <div className="bg-gray-50 p-4 space-y-3 rounded-b-lg">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-[#658C58]"
              onClick={() => setSelectedMenu(item.id)}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-gray-700" />
                  <span className="text-base font-medium text-gray-900">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-6 text-gray-500 text-sm">Version 1.6.6</div>
    </div>
  )
}
