'use client';

import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/popover';
import { Calendar as CalendarComponent } from '@/react-web-ui-shadcn/src/components/ui/calendar';
import axios from 'axios';

export interface AttendanceLog {
  id: number;
  userId: number;
  shiftId: number | null;

  logType: 'IN' | 'OUT';
  status: 'present' | 'off_paid' | 'Deviation';

  logTime: string;
  workDate: string;

  createdAt: string;
  updatedAt: string;
}
interface AttendanceSearchPageProps {
  onPageChange: (page: 'attendance' | 'attendance-record') => void;
}
export function AttendancePage({ onPageChange }: AttendanceSearchPageProps) {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [records, setRecords] = useState<AttendanceLog[]>([]);
  async function fetchStatus() {
    await axios
      .post('/api/attendance', {
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

  return (
    <div className=" h-full bg-gray-100 flex flex-col ">
      <div className="bg-[#658C58] text-white p-4 flex items-center gap-4">
        <button className="hover:opacity-80">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-10">
          CHẤM CÔNG
        </h1>
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

      <div className="bg-gray-200 py-3 text-center">
        <span className="text-[#658C58] font-bold text-lg">
          TỔNG ({records.length})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {records.map((record) => {
          const isCheckOut = record.logType === 'OUT';

          return (
            <div key={record.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">
                Ngày làm việc:{' '}
                <span className="font-medium text-gray-700">
                  {new Date(record.workDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="mb-1">
                Loại công:{' '}
                <span
                  className={isCheckOut ? 'text-[#C93B3B]' : 'text-[#10B981]'}
                >
                  {isCheckOut ? 'Chấm công ra' : 'Chấm công vào'}
                </span>
              </div>

              <div className="mb-1">
                Thời gian:{' '}
                <span className="font-semibold">
                  {new Date(record.logTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Tạo lúc: {new Date(record.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-background border-t border-border pt-4 flex gap-4 mt-6 bottom-0 left-0 right-0 sticky">
        <Button
          onClick={() => onPageChange('attendance-record')}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-base cursor-pointer rounded-lg"
        >
          Chấm công vào
        </Button>
        <Button
          onClick={() => onPageChange('attendance-record')}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-6 text-base cursor-pointer rounded-lg"
        >
          Chấm công ra
        </Button>
      </div>
    </div>
  );
}
