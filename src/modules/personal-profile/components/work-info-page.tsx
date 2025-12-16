"use client"

import { Card } from "@/react-web-ui-shadcn/src/components/ui/card"
import { ArrowLeft, Mail } from "lucide-react"

interface WorkInfoPageProps {
  onBack: () => void
}

export function WorkInfoPage({ onBack }: WorkInfoPageProps) {
  const workInfo = [
    { label: "Họ và tên", value: "Nguyễn Minh Quang" },
    { label: "Mã nhân viên", value: "06183836" },
    { label: "Master Code", value: "VG06183836" },
    { label: "Thông tin pháp lý", value: "", isHeader: true },
    { label: "P&L", value: "Phúc Long" },
    { label: "Ban/Chuỗi/Khối", value: "Khối Vận hành" },
    { label: "Phòng/Vùng/Miền", value: "Miền Trung" },
    { label: "Đơn vị thành viên", value: "Khối Vận hành - Trực tiếp_3P" },
    { label: "Phòng/Bộ phận/Nhóm", value: "Khối vận hành - Cửa hàng_3P" },
    { label: "Nhóm chức danh", value: "", isHeader: true },
    { label: "Chức danh", value: "Nhân viên Part time" },
    { label: "Cấp bậc", value: "6A" },
    { label: "SĐT cố định - máy lẻ", value: "", isHeader: true },
    { label: "SĐT di động", value: "0394642365" },
    { label: "Email", value: "KHÔNG CÓ EMAIL" },
    { label: "Ngày vào tập đoàn", value: "26/12/2024" },
    {
      label: "Địa điểm làm việc",
      value: "2115, 21 Ngô Gia Tự - KHA, Phường Tân Lập, Thành phố Nha Trang, Tỉnh Khánh Hòa",
    },
  ]

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#658C58] text-white p-6 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-[#31694E] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">THÔNG TIN CÔNG VIỆC</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto space-y-4">
        {/* Profile Card */}
        <Card className="bg-white p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#658C58] flex items-center justify-center text-white font-bold text-lg">
              AD
            </div>
            <div>
              <p className="font-bold text-lg">AD 6183836</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5" />
                <span>KHÔNG CÓ EMAIL</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Work Info Card */}
        <Card className="bg-white p-4">
          <div className="space-y-3">
            {workInfo.map((item, index) => (
              <div key={index}>
                {item.isHeader ? (
                  <h3 className="font-semibold text-gray-700 mt-4 mb-2">{item.label}</h3>
                ) : item.value ? (
                  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="text-gray-900 font-medium text-right flex-1 ml-4">{item.value}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
