'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Skeleton } from '@/react-web-ui-shadcn/src/components/ui/skeleton';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Shift = {
  id?: number;
  shiftName: string;
  startTime: Date;
  endTime: Date;
};

type DaySchedule = {
  scheduleId?: number;
  employeeId?: number;
  workDate: string;
  shiftId?: number;
  shift?: Shift;
};

export function WorkSchedulePage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/schedule', {
        month: currentMonth,
        year: currentYear,
      });
      setScheduleData(res.data.schedule);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [currentMonth, currentYear]);

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (isLoading) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (isLoading) return;
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'work':
        return 'bg-[#658C58] text-white border-[#658C58]';
      case 'off':
        return 'bg-gray-50 text-gray-400 border-gray-200';
      default:
        return 'bg-white text-black border-gray-100';
    }
  };

  const renderCalendar = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (isLoading) {
        days.push(
          <div
            key={`skeleton-${day}`}
            className="p-1 border rounded-lg flex flex-col items-center justify-center min-h-20 bg-white border-gray-100"
          >
            <Skeleton className="h-4 w-6 mb-2" />
            <Skeleton className="h-3 w-12" />
          </div>
        );
        continue;
      }

      const schedule = scheduleData.find((item) => {
        if (!item.workDate) return false;
        const d = new Date(item.workDate);
        return (
          d.getUTCDate() === day &&
          d.getUTCMonth() === currentMonth &&
          d.getUTCFullYear() === currentYear
        );
      });

      const isToday =
        day === todayDate &&
        currentMonth === todayMonth &&
        currentYear === todayYear;

      const statusStyle = schedule
        ? getStatusStyle('work')
        : 'bg-white text-black border-gray-100';

      days.push(
        <div
          key={day}
          className={`p-1 border rounded-lg flex flex-col items-center justify-center min-h-20 transition-all ${statusStyle} ${
            isToday ? 'ring-2 ring-orange-500 ring-offset-1' : ''
          }`}
        >
          <div className="font-bold text-base">{day}</div>
          <div className="text-sm leading-tight text-center mt-1 font-semibold">
            {schedule?.shift?.startTime?.toString().slice(11, 16) ?? ''}
            {schedule?.shift ? ' - ' : ''}
            {schedule?.shift?.endTime?.toString().slice(11, 16) ?? ''}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-3 relative">
      {isLoading && <div className="absolute inset-0 z-50 cursor-wait" />}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            {monthNames[currentMonth]}{' '}
            <span className="text-gray-800 font-extrabold">{currentYear}</span>
            {isLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            )}
          </h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[11px] font-bold py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">{renderCalendar()}</div>
      </div>
    </div>
  );
}
