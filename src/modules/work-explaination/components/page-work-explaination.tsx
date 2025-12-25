'use client';

import { useEffect, useState } from 'react';
import { Calendar, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { WorkExplanationForm } from './form-work-explaination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/react-web-ui-shadcn/src/components/ui/calendar';
import axios from 'axios';

export type WorkRecord = {
  id: number;
  employeeId: number;
  attendanceId: number;
  workScheduleId: number;

  reason: string;
  note: string | null;

  approvalStatus: 'YES' | 'NO';
  explanationStatus: 'YES' | 'NO';
  submissionStatus: 'YES' | 'NO';

  proposedCheckInTime: string | null;
  proposedCheckOutTime: string | null;
  proposedShiftId: number | null;

  createdAt: string;
  updatedAt: string;
};

export function WorkExplanationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<WorkRecord | null>(null);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [records, setRecords] = useState<WorkRecord[]>([]);

  async function fetchStatus() {
    await axios
      .post('/api/explaination', {
        fromDate: fromDate,
        toDate: toDate,
      })
      .then((res) => setRecords(res.data.result))
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchStatus();
  }, []);

  if (selectedRecord) {
    return (
      <WorkExplanationForm
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
      />
    );
  }
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#658C58] text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">GIẢI TRÌNH CÔNG</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-5">
            <label className="block text-sm font-medium mb-2">Từ ngày</label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-blue-500 hover:bg-white font-normal bg-transparent hover:text-black"
                >
                  {format(fromDate, 'dd/MM/yyyy')}
                  <Calendar className="w-5 h-5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    if (date) {
                      setFromDate(date);
                      setFromDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-5">
            <label className="block text-sm font-medium mb-2">Đến ngày</label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-blue-500 hover:bg-white font-normal bg-transparent hover:text-black"
                >
                  {format(toDate, 'dd/MM/yyyy')}
                  <Calendar className="w-5 h-5 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    if (date) {
                      setToDate(date);
                      setToDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-2">
            <Button
              onClick={fetchStatus}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-[42px]"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-[#658C58]">
          TỔNG ({records.length})
        </h2>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <Card
            key={record.id}
            className="p-6 shadow-md border-l-4 border-l-[#658C58]"
          >
            <div className="space-y-3">
              <h3 className="font-bold text-lg">
                Mã nhân viên: {record.employeeId}
              </h3>

              <p className="text-sm">
                <span className="font-medium">Lý do:</span> {record.reason}
              </p>

              <p className="text-sm">
                <span className="font-medium">Ngày tạo:</span>{' '}
                {new Date(record.createdAt).toLocaleDateString('vi-VN')}
              </p>

              {/* <p className="text-sm">
                <span className="font-medium">Giờ vào đề xuất:</span>{' '}
                {record.proposedCheckInTime
                  ? new Date(record.proposedCheckInTime).toLocaleTimeString(
                      'vi-VN',
                      { hour: '2-digit', minute: '2-digit' }
                    )
                  : '--:--'}
              </p>

              <p className="text-sm">
                <span className="font-medium">Giờ ra đề xuất:</span>{' '}
                {record.proposedCheckOutTime
                  ? new Date(record.proposedCheckOutTime).toLocaleTimeString(
                      'vi-VN',
                      { hour: '2-digit', minute: '2-digit' }
                    )
                  : '--:--'}
              </p> */}

              <div className="pt-2">
                <div className="text-sm font-medium mb-3 flex flex-col gap-1">
                  <p>
                    Nộp đơn:{' '}
                    <span
                      className={
                        record.submissionStatus === 'YES'
                          ? 'text-green-600'
                          : 'text-orange-500'
                      }
                    >
                      {record.submissionStatus === 'YES'
                        ? 'Đã gửi'
                        : 'Bản nháp'}
                    </span>
                  </p>
                  <p>
                    Duyệt:{' '}
                    <span
                      className={
                        record.approvalStatus === 'YES'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }
                    >
                      {record.approvalStatus === 'YES'
                        ? 'Đã phê duyệt'
                        : 'Chờ duyệt'}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#658C58] text-[#658C58] hover:bg-[#658C58] hover:text-white bg-transparent"
                  >
                    Lịch sử
                  </Button>

                  {record.approvalStatus === 'NO' && (
                    <Button
                      variant="outline"
                      className="flex-1 border-[#658C58] text-[#658C58] hover:bg-[#658C58] hover:text-white bg-transparent"
                      onClick={() => setSelectedRecord(record)}
                    >
                      Giải trình
                    </Button>
                  )}

                  {record.submissionStatus === 'NO' && (
                    <Button
                      variant="outline"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                    >
                      Gửi đơn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
