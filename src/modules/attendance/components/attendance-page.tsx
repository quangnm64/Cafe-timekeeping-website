'use client';

import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/popover';
import { Calendar as CalendarComponent } from '@/react-web-ui-shadcn/src/components/ui/calendar';
import { Skeleton } from '@/react-web-ui-shadcn/src/components/ui/skeleton';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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

export function AttendancePage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [records, setRecords] = useState<AttendanceLog[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchStatus() {
    // Kiểm tra logic ngày trước khi gọi API
    if (isAfter(startOfDay(fromDate), startOfDay(toDate))) {
      alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/attendance', {
        fromDate: fromDate,
        toDate: toDate,
      });
      setRecords(res.data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }

  useEffect(() => {
    setIsMounted(true);
    fetchStatus();
  }, []);

  const handleNavigation = (type: 'checkin' | 'checkout') => {
    if (isLoading) return;
    router.push(`/time-keeping?type=${type}`);
  };

  if (!isMounted) return null;

  return (
    <div className="relative h-full bg-gray-100 flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 z-[100] cursor-wait bg-transparent" />
      )}

      <div className="p-4 bg-white">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-5">
            <label className="block text-sm font-medium mb-2">Từ ngày</label>
            <Popover
              open={fromDateOpen}
              onOpenChange={isLoading ? undefined : setFromDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  disabled={isLoading}
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
                      // Kiểm tra: Nếu ngày bắt đầu mới chọn > ngày kết thúc hiện tại
                      if (isAfter(startOfDay(date), startOfDay(toDate))) {
                        alert(
                          'Ngày bắt đầu không được lớn hơn ngày kết thúc hiện tại!'
                        );
                        return;
                      }
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
            <Popover
              open={toDateOpen}
              onOpenChange={isLoading ? undefined : setToDateOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  disabled={isLoading}
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
                      // Kiểm tra: Nếu ngày kết thúc mới chọn < ngày bắt đầu hiện tại
                      if (isBefore(startOfDay(date), startOfDay(fromDate))) {
                        alert(
                          'Ngày kết thúc không được nhỏ hơn ngày bắt đầu hiện tại!'
                        );
                        return;
                      }
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
              disabled={isLoading}
              onClick={fetchStatus}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-[42px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                'Tìm kiếm'
              )}
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
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-sm space-y-2"
              >
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4 mt-2" />
              </div>
            ))
          : records.map((record) => {
              const isCheckOut = record.logType === 'OUT';
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    Ngày làm việc:{' '}
                    <span className="font-medium text-gray-700">
                      {new Date(record.workDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="mb-1">
                    Loại công:{' '}
                    <span
                      className={
                        isCheckOut ? 'text-[#C93B3B]' : 'text-[#10B981]'
                      }
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
                    Tạo lúc:{' '}
                    {new Date(record.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              );
            })}
      </div>

      <div className="bg-white border-t border-border p-4 pb-0 mb-0 flex gap-4 sticky bottom-0 z-50">
        <Button
          disabled={isLoading}
          onClick={() => handleNavigation('checkin')}
          className="flex-1 bg-[#658C58] hover:bg-[#547549] text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-all active:scale-95 mb-4 disabled:opacity-50"
        >
          Chấm công vào
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => handleNavigation('checkout')}
          className="flex-1 bg-[#BBC863] hover:bg-[#a6b358] text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-all active:scale-95 mb-4 disabled:opacity-50"
        >
          Chấm công ra
        </Button>
      </div>
    </div>
  );
}
