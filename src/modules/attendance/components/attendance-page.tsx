"use client"

import { ArrowLeft, Calendar } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/react-web-ui-shadcn/src/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/react-web-ui-shadcn/src/components/ui/popover"
import { Calendar as CalendarComponent } from "@/react-web-ui-shadcn/src/components/ui/calendar"

interface AttendanceRecord {
  id: string
  department: string
  type: "check-in" | "check-out"
  time: string
  status: string
}

export function AttendancePage() {
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 11, 9))
  const [toDate, setToDate] = useState<Date>(new Date(2025, 11, 16))
  const [fromDateOpen, setFromDateOpen] = useState(false)
  const [toDateOpen, setToDateOpen] = useState(false)

  const records: AttendanceRecord[] = [
    {
      id: "1",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-out",
      time: "15/12/2025 17:07",
      status: "Đã duyệt",
    },
    {
      id: "2",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-in",
      time: "15/12/2025 07:02",
      status: "Đã duyệt",
    },
    {
      id: "3",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-out",
      time: "14/12/2025 16:10",
      status: "Đã duyệt",
    },
    {
      id: "4",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-in",
      time: "14/12/2025 11:42",
      status: "Đã duyệt",
    },
    {
      id: "5",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-out",
      time: "12/12/2025 22:38",
      status: "Đã duyệt",
    },
    {
      id: "6",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-in",
      time: "12/12/2025 08:15",
      status: "Đã duyệt",
    },
    {
      id: "7",
      department: "06183836 - PL2115 - 2115, 21 Ngõ Gia Tự - KHA",
      type: "check-out",
      time: "11/12/2025 18:30",
      status: "Đã duyệt",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-[#658C58] text-white p-4 flex items-center gap-4">
        <button className="hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-10">CHẤM CÔNG</h1>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Từ ngày</label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-blue-500 hover:bg-gray-50 font-normal bg-transparent"
                >
                  {format(fromDate, "dd/MM/yyyy")}
                  <Calendar className="w-5 h-5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    if (date) {
                      setFromDate(date)
                      setFromDateOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đến ngày</label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-blue-500 hover:bg-gray-50 font-normal bg-transparent"
                >
                  {format(toDate, "dd/MM/yyyy")}
                  <Calendar className="w-5 h-5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    if (date) {
                      setToDate(date)
                      setToDateOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 py-3 text-center">
        <span className="text-[#658C58] font-bold text-lg">TỔNG ({records.length})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="font-medium mb-2">
              Bộ phận: <span className="font-normal">{record.department}</span>
            </div>
            <div className="mb-1">
              Loại công:{" "}
              <span className={record.type === "check-out" ? "text-[#C93B3B]" : "text-[#10B981]"}>
                {record.type === "check-out" ? "Chấm công ra" : "Chấm công vào"}
              </span>
            </div>
            <div className="mb-1">
              Thời gian: <span className="font-semibold">{record.time}</span>
            </div>
            <div>
              Tình trạng: <span>{record.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
