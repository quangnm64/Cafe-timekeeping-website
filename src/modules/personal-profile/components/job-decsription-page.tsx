"use client"

import { Card } from "@/react-web-ui-shadcn/src/components/ui/card"
import { ChevronLeft, Plus, Minus } from "lucide-react"
import { useState } from "react"

interface JobDescriptionPageProps {
  onBack: () => void
}

export function JobDescriptionPage({ onBack }: JobDescriptionPageProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const generalJobDescription = [
    "1. Thực hiện duy trì hình ảnh, đảm bảo tình trạng về sinh (hàng hóa, quầy kệ, trang thiết bị, sàn nhà...) và tiêu chuẩn dịch vụ khách hàng",
    "2. Tiếp nhận khiếu nại, báo cáo Cấp trên và xử lý theo hướng dẫn",
    "3. Thực hiện giao, nhận hàng hóa theo quy trình",
    "4. Trưng bày, sắp xếp, bảo quản hàng hóa theo quy định và hướng dẫn liên quan (Plannogram - POG;....)",
    "5. Thực hiện các thao tác, nghiệp vụ bán hàng: tư vấn bán hàng, pha chế, đóng gói, thanh toán, đối/tra, xuất bill...",
    "6. Thực hiện các chương trình và chính sách bán hàng của Công ty",
    "7. Thực hiện duy trì chất lượng hàng hóa/nguyên liệu : lọc hàng kém chất lượng, kiểm han sử dụng...",
    "8. Sử dụng và bảo quản tài sản được giao theo quy định",
    "9. Kiểm kê hàng hóa/tài sản định kỳ hoặc đột xuất theo quy định. Cùng chịu trách nhiệm nếu có hàng hóa hư hỏng/thất thoát vượt định mức.",
    "10. Thanh toán, kết ca và nộp tiền doanh thu bán hàng theo quy định",
    "11. Tuân thủ lịch làm việc được phân công. Sẵn sàng hỗ trợ đồng nghiệp vào giờ cao điểm, ngày lễ, cuối tuần cũng như tham gia đầy đủ các hoạt động đào tạo, gắn kết do cấp trên/ công ty tổ chức",
    "12. Kịp thời báo cáo Cửa hàng trưởng/phó hoặc cấp cao hơn nếu phát hiện các hành vi vi phạm nội quy lao động, quy trình, quy định của Công ty hoặc các hành vi/sự cố có thể gây thiệt hại cho Công ty.",
    "13. Thực hiện một số công việc khác trong phạm vi công việc theo chỉ đạo của Cửa hàng trưởng/ phó/ Cấp trên",
    "14. Đề xuất các cải tiến nhằm nâng cao hiệu quả công việc",
  ]

  const specializedJobDescription = [
    "1. Thực hiện các thao tác, nghiệp vụ bán hàng: bán theo đơn thuốc, chỉ định của bác sĩ/theo quy định ngành, tư vấn cho khách hàng lựa chọn sản phẩm, hướng dẫn sử dụng, thanh toán, xuất bill...",
    "2. Thu thập thông tin khách hàng, cập nhật sổ sách GPP theo phạm vi được phân công",
    "3. Thực hiện duy trì chất lượng hàng hóa/sản phẩm trong suốt quá trình bày bán và lưu trữ : lọc hàng chậm bán, cận hạn sử dụng...",
    "4. (*) Đối với Quản lý chuyên trách (Rank 5C): hỗ trợ CHT trong công tác vận hành chuyên môn nhà thuốc tuân thủ các quy định, tiêu chuẩn liên quan",
  ]

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-[#658C58] text-white p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-[#31694E] rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-6">MÔ TẢ CÔNG VIỆC</h1>
      </div>

      <div className="flex-1 bg-gray-100 p-4 space-y-3 overflow-y-auto pb-20">
        <Card className="bg-white border-l-4 border-l-[#658C58] overflow-hidden">
          <button
            onClick={() => toggleSection("general")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-base font-semibold text-gray-900">Mô tả công việc chung</span>
            {expandedSection === "general" ? (
              <Minus className="w-6 h-6 text-gray-700 flex-shrink-0" />
            ) : (
              <Plus className="w-6 h-6 text-gray-700 flex-shrink-0" />
            )}
          </button>
          {expandedSection === "general" && (
            <div className="px-4 pb-4 space-y-2 text-sm text-gray-700 leading-relaxed">
              {generalJobDescription.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          )}
        </Card>

        <Card className="bg-white border-l-4 border-l-[#658C58] overflow-hidden">
          <button
            onClick={() => toggleSection("specialized")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-base font-semibold text-gray-900">Mô tả công việc chuyên môn</span>
            {expandedSection === "specialized" ? (
              <Minus className="w-6 h-6 text-gray-700 flex-shrink-0" />
            ) : (
              <Plus className="w-6 h-6 text-gray-700 flex-shrink-0" />
            )}
          </button>
          {expandedSection === "specialized" && (
            <div className="px-4 pb-4 space-y-2 text-sm text-gray-700 leading-relaxed">
              {specializedJobDescription.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="bg-[#658C58] text-white py-4 px-6 text-center text-base font-semibold">TỔNG (2)</div>
    </div>
  )
}
