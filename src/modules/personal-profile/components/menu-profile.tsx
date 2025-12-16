"use client"

import { Card } from "@/react-web-ui-shadcn/src/components/ui/card"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { WorkInfoPage } from "./work-info-page"
import { PersonalInfoPage } from "./personal-info-page"

interface PersonalProfilePageProps {
  onBack: () => void
}

export function PersonalProfilePage({ onBack }: PersonalProfilePageProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  if (selectedItem === "work-info") {
    return <WorkInfoPage onBack={() => setSelectedItem(null)} />
  }
  if (selectedItem === "personal-info") {
      return <PersonalInfoPage onBack={() => setSelectedItem(null)} />
    }

  const profileItems = [
    { id: "personal-info", label: "Thông tin cá nhân" },
    { id: "work-info", label: "Thông tin công việc" },
  ]

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-[#658C58] text-white p-6 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-[#31694E] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">HỒ SƠ CÁ NHÂN</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-gray-100 p-4 space-y-3">
        {profileItems.map((item) => (
          <Card
            key={item.id}
            onClick={() => setSelectedItem(item.id)}
            className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-[#658C58]"
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-base font-medium text-gray-900">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-[#658C58] text-white p-4 text-center font-bold">TỔNG (2)</div>
    </div>
  )
}
