'use client';

import { useEffect, useState } from 'react';
import { Calendar, Filter, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { WorkExplanationForm } from './form-work-explaination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/popover';
import { format, isAfter, isBefore, startOfDay, subDays } from 'date-fns';
import { Calendar as CalendarComponent } from '@/react-web-ui-shadcn/src/components/ui/calendar';
import { Skeleton } from '@/react-web-ui-shadcn/src/components/ui/skeleton';
import axios from 'axios';
import { shift } from '@/constants/shift';

export type WorkRecord = {
  id: number;
  employeeId: number;
  attendanceId: number;
  workScheduleId: number;
  reason: string;
  note: string | null;
  approvalStatus: string;
  explanationStatus: 'YES' | 'NO';
  submissionStatus: 'YES' | 'NO';
  proposedCheckInTime: string | null;
  proposedCheckOutTime: string | null;
  proposedShiftId: number | null;
  createdAt: string;
  updatedAt: string;

  employee: {
    id: number;
    fullName: string;
    employeeCode?: string;
  };

  workSchedule: {
    shiftId: number | null;
    shift: {
      endTime: string;
      startTime: string;
    };
    workDate: string;
  };

  attendance: {
    logType: 'IN' | 'OUT';
    logTime: string;
  } | null;
};

export function WorkExplanationPage() {
  const [selectedRecord, setSelectedRecord] = useState<WorkRecord | null>(null);
  const [fromDate, setFromDate] = useState<Date>(subDays(new Date(), 10));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [records, setRecords] = useState<WorkRecord[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchStatus() {
    if (isAfter(startOfDay(fromDate), startOfDay(toDate))) {
      alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/explaination', {
        fromDate: fromDate,
        toDate: toDate,
        content: 'getData',
      });
      setRecords(res.data.result ?? []);
      console.log(res.data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  }

  useEffect(() => {
    setIsMounted(true);
    fetchStatus();
  }, []);

  if (!isMounted) return null;
  const handleBackAndRefresh = async () => {
    setSelectedRecord(null);
    await fetchStatus();
  };
  if (selectedRecord) {
    return (
      <WorkExplanationForm
        record={selectedRecord}
        onBack={handleBackAndRefresh}
      />
    );
  }

  const handleSubmit = async (id: number) => {
    setIsLoading(true);
    try {
      await axios.post('/api/explaination', { content: 'sent', id: id });
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const formatVNTime = (time: string) => {
    const d = new Date(time);
    d.setHours(d.getHours() - 8);
    return format(d, 'HH:mm');
  };
  return (
    <div className="relative space-y-6 max-w-5xl mx-auto min-h-screen">
      {isLoading && (
        <div className="absolute inset-0 z-50 cursor-wait bg-white/10" />
      )}

      <div className="p-4 bg-white rounded-lg shadow-sm border">
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

      <div className="text-center">
        <h2 className="text-xl font-bold text-[#658C58]">
          TỔNG ({records.length})
        </h2>
      </div>

      <div className="space-y-4">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <Card
                key={i}
                className="p-6 shadow-md border-l-4 border-l-gray-300 space-y-4"
              >
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </Card>
            ))
          : records.map((record) => (
              <Card
                key={record.id}
                className="p-6 shadow-md border-l-4 border-l-[#658C58]"
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-800">
                    Mã nhân viên: {record.employeeId}
                  </h3>
                  <p className="font-bold text-gray-900">
                    Tên nhân viên:{' '}
                    {record.employee?.fullName ?? 'Không xác định'}
                  </p>

                  {/* Chi tiết công việc */}
                  <p className="text-gray-700">
                    Ngày: {format(new Date(record.createdAt), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-gray-700">
                    Ca làm:{' '}
                    {record.workSchedule?.shift
                      ? `${formatVNTime(
                          record.workSchedule.shift.startTime
                        )} - ${formatVNTime(record.workSchedule.shift.endTime)}`
                      : 'OFF'}
                  </p>
                  {/* <p className="text-gray-700">
                    Công thực tế 1: {record.proposedCheckInTime || '-'}
                  </p>
                  <p className="text-gray-700">
                    Công thực tế 2: {record.proposedCheckOutTime || '-'}
                  </p> */}

                  {record.explanationStatus === 'YES' && (
                    <div className="bg-[#E8F0FE] p-3 rounded-lg border border-[#D2E3FC] space-y-1">
                      <p className="text-[#1967D2] text-sm font-medium">
                        Ca: {record.reason || 'Đổi/Chưa phân/Phân sai...'}
                      </p>
                      <p>
                        {record.proposedShiftId === null
                          ? 'Chưa xác định'
                          : (() => {
                              const s = shift.find(
                                (x) => x.id === record.proposedShiftId
                              );
                              return s
                                ? `${s.name} (${s.startTime} - ${s.endTime})`
                                : 'Không tồn tại ca';
                            })()}
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">
                      Ngày tạo:
                    </span>{' '}
                    {new Date(record.createdAt).toLocaleDateString('vi-VN')}
                  </p>

                  <p className="text-red-500 font-medium">
                    Trạng thái:{' '}
                    {record.approvalStatus === 'approved'
                      ? 'Đã duyệt'
                      : record.approvalStatus === 'rejected'
                      ? 'Đã từ chối'
                      : record.submissionStatus === 'YES'
                      ? 'Chờ duyệt'
                      : record.explanationStatus === 'YES'
                      ? 'Chờ gửi'
                      : 'Chờ giải trình'}
                  </p>

                  <div className="pt-2">
                    {/* Khi chưa nộp (NO) - Hiển thị các nút thao tác */}
                    {record.submissionStatus === 'NO' && (
                      <div className="flex gap-3">
                        <Button
                          disabled={isLoading}
                          variant="outline"
                          className="flex-1 border-[#658C58] text-[#658C58] hover:bg-[#658C58] hover:text-white bg-transparent disabled:opacity-50"
                          onClick={() => setSelectedRecord(record)}
                        >
                          Giải trình
                        </Button>

                        {record.explanationStatus === 'YES' && (
                          <Button
                            disabled={isLoading}
                            variant="outline"
                            className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent disabled:opacity-50"
                            onClick={() => handleSubmit(record.id)}
                          >
                            Gửi đơn
                          </Button>
                        )}
                      </div>
                    )}

                    {record.submissionStatus === 'YES' && (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-400 text-gray-400 bg-transparent cursor-default"
                        >
                          {record.approvalStatus === 'NO'
                            ? 'Chờ duyệt'
                            : record.approvalStatus === 'rejected'
                            ? 'Đã từ chối'
                            : 'Đã duyệt'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
