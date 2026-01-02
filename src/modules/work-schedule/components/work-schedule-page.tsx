'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type DaySchedule = {
  scheduleId?: number;
  employeeId?: number;
  workDate: string;
  shiftId?: number;
  shift?: Shift;
};

type Shift = {
  id?: number;
  shiftName: string;
  startTime: Date;
  endTime: Date;
};
export function WorkSchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(11);
  const [currentYear, setCurrentYear] = useState(2025);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
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

  async function fetchStatus() {
    await axios
      .post('/api/schedule', {
        month: currentMonth,
        year: currentYear,
      })
      .then((res) => {
        setScheduleData(res.data.schedule);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchStatus();
  }, []);

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const today = new Date().getDate();

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
      const schedule = scheduleData.find((item) => {
        if (!item.workDate) return false;

        const d = new Date(item.workDate);
        return (
          d.getUTCDate() === day &&
          d.getUTCMonth() === currentMonth &&
          d.getUTCFullYear() === currentYear
        );
      });
      const isToday = day === today && currentMonth === new Date().getMonth();
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
          <div className="text-[9px] leading-tight text-center mt-1 font-medium opacity-90">
            {schedule?.shift?.startTime?.toString().slice(11, 16) ?? ''}-
            {schedule?.shift?.endTime?.toString().slice(11, 16) ?? ''}
          </div>
          {/* {schedule?.label && (
            <div
              className={`text-[10px] font-bold uppercase ${
                'work' === 'work' ? 'text-white/90' : 'text-gray-400'
              }`}
            >
              {schedule.label}
            </div>
          )} */}

          {/* {'work' === 'work' && schedule.time ? (
            <div className="text-[9px] leading-tight text-center mt-1 font-medium opacity-90">
              {schedule.time}
            </div>
          ) : 'off' === 'off' ? (
            <div className="text-[9px] mt-1 font-bold">NGHỈ</div>
          ) : null} */}
          {/* <div className="text-[9px] leading-tight text-center mt-1 font-medium opacity-90">
            {schedule.time}
          </div> */}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-gray-50">
      {/* <div className="bg-[#658C58] text-white py-4 px-4 flex items-center justify-center relative shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 text-white hover:bg-white/20"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold tracking-wider">LỊCH LÀM VIỆC</h1>
      </div> */}

      <div className="p-3 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-800">
              {monthNames[currentMonth]}{' '}
              <span className="text-gray-800 font-extrabold ">
                {currentYear}
              </span>
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`text-center text-[11px] font-bold py-2 `}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">{renderCalendar()}</div>
        </div>

        {/* <div className="flex gap-4 px-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#658C58] rounded-sm"></div>
            <span className="text-xs text-gray-600 font-medium">Làm việc</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
            <span className="text-xs text-gray-600 font-medium">
              Nghỉ (Off)
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
