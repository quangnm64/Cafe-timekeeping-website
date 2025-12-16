"use client"

import { useState } from "react"
import { Calendar, Filter, ArrowLeft } from "lucide-react"
import { Button } from "@/react-web-ui-shadcn/src/components/ui/button"
import { Card } from "@/react-web-ui-shadcn/src/components/ui/card"
import { Input } from "@/react-web-ui-shadcn/src/components/ui/input"
import { WorkExplanationForm } from "./form-work-explaination"

type WorkRecord = {
  id: number
  location: string
  employee: string
  date: string
  shift: string
  actualTime1: string
  actualTime2: string
  status: string
}

export function WorkExplanationPage() {
  const [fromDate, setFromDate] = useState("08/12/2025")
  const [toDate, setToDate] = useState("15/12/2025")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<WorkRecord | null>(null)

  const workRecords = [
    {
      id: 1,
      location: "PL2115 - 2115, 21 Ngô Gia Tự - KHA",
      employee: "06183836 - Nguyễn Minh Quang",
      date: "14/12/2025",
      shift: "1133 (11:00 - 15:00)",
      actualTime1: "11:42:00 - 16:10:00",
      actualTime2: "-",
      status: "Chờ giải trình",
    },
    {
      id: 2,
      location: "PL2115 - 2115, 21 Ngô Gia Tự - KHA",
      employee: "06183836 - Nguyễn Minh Quang",
      date: "12/12/2025",
      shift: "OFF",
      actualTime1: "-",
      actualTime2: "-",
      status: "Chờ giải trình",
    },
  ]

  const filteredRecords = workRecords.filter((record) => {
    return (
      record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (selectedRecord) {
    return <WorkExplanationForm record={selectedRecord} onBack={() => setSelectedRecord(null)} />
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#658C58] text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">GIẢI TRÌNH CÔNG</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <Card className="p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Từ ngày</label>
            <div className="relative">
              <Input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="pr-10 border-[#658C58] focus:ring-[#658C58]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#658C58]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đến ngày</label>
            <div className="relative">
              <Input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="pr-10 border-[#658C58] focus:ring-[#658C58]"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#658C58]" />
            </div>
          </div>
        </div>

        <Input
          type="text"
          placeholder="Nhập Mã NV/ Tên NV"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-[#658C58] focus:ring-[#658C58]"
        />
      </Card>

      <div className="text-center">
        <h2 className="text-xl font-bold text-[#658C58]">TỔNG ({filteredRecords.length})</h2>
      </div>

      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="p-6 shadow-md border-l-4 border-l-[#658C58]">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">{record.location}</h3>
              <p className="font-semibold">{record.employee}</p>
              <p className="text-sm">
                <span className="font-medium">Ngày:</span> {record.date}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ca:</span> {record.shift}
              </p>
              <p className="text-sm">
                <span className="font-medium">Công thực tế 1:</span> {record.actualTime1}
              </p>
              <p className="text-sm">
                <span className="font-medium">Công thực tế 2:</span> {record.actualTime2}
              </p>

              <div className="pt-2">
                <p className="text-sm text-red-600 font-medium mb-3">
                  Trạng thái: <span>{record.status}</span>
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#658C58] text-[#658C58] hover:bg-[#658C58] hover:text-white bg-transparent"
                  >
                    Lịch sử
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-[#658C58] text-[#658C58] hover:bg-[#658C58] hover:text-white bg-transparent"
                    onClick={() => setSelectedRecord(record)}
                  >
                    Giải trình
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                  >
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
