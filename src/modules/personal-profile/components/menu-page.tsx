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
import { JobDescriptionPage } from "./job-decsription-page"
import { StoreListPage } from "./store-page"

export function PersonalAccountPage() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
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
  const handleMenuClick = (menuId: string) => {
    if (menuId === "logout") {
      setShowLogoutDialog(true)
    } else {
      setSelectedMenu(menuId)
    }
  }

  const handleLogout = () => {
    console.log("User logged out")
    setShowLogoutDialog(false)
  }
  if (selectedMenu === "personal-profile") {
    return <PersonalProfilePage onBack={() => setSelectedMenu(null)} />
  }
  if (selectedMenu === "job-description") {
    return <JobDescriptionPage onBack={() => setSelectedMenu(null)} />
  }
  if (selectedMenu === "change-password") {
    return <ChangePasswordPage onBack={() => setSelectedMenu(null)} />
  }
  if (selectedMenu === "default-store") {
    return <StoreListPage onBack={() => setSelectedMenu(null)} />
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
              onClick={() => handleMenuClick(item.id)}
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
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-10 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100 opacity-100 border-2 border-gray-200">
              <div className="p-7">
                <div className="flex justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-[#658C58]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Xác nhận Đăng xuất
                </h2>
                <p className="text-gray-500 text-center mb-7">
                  Bạn có chắc chắn muốn kết thúc phiên làm việc hiện tại không?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowLogoutDialog(false)}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-[#658C58] text-white font-semibold rounded-lg shadow-md shadow-[#658c58]/30 hover:bg-[#527047] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#658C58] focus:ring-opacity-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
