'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DaySchedule {
  date: number;
  status: 'off' | 'hc' | 'vh' | 'late' | 'absent' | 'scheduled' | '';
  label?: string;
}

export function WorkSchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

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

  const scheduleData: Record<number, DaySchedule> = {
    1: { date: 1, status: 'off', label: 'Off' },
    2: { date: 2, status: 'off', label: 'Off' },
    3: { date: 3, status: 'off', label: 'Off' },
    4: { date: 4, status: 'off', label: 'Off' },
    5: { date: 5, status: 'vh', label: 'VH' },
    6: { date: 6, status: 'off', label: 'Off' },
    7: { date: 7, status: 'hc', label: 'HC' },
    8: { date: 8, status: 'off', label: 'Off' },
    9: { date: 9, status: 'off', label: 'Off' },
    10: { date: 10, status: 'off', label: 'Off' },
    11: { date: 11, status: 'off', label: 'Off' },
    12: { date: 12, status: 'off', label: 'Off' },
    13: { date: 13, status: 'off', label: 'Off' },
    14: { date: 14, status: 'late', label: 'HC' },
    15: { date: 15, status: 'hc', label: 'HC' },
    16: { date: 16, status: 'off', label: 'Off' },
    17: { date: 17, status: 'scheduled', label: 'HC' },
    18: { date: 18, status: 'off', label: 'Off' },
    19: { date: 19, status: 'off', label: 'Off' },
    20: { date: 20, status: 'off', label: 'Off' },
    21: { date: 21, status: 'off', label: 'Off' },
    22: { date: 22, status: '', label: '' },
    23: { date: 23, status: '', label: '' },
    24: { date: 24, status: '', label: '' },
    25: { date: 25, status: '', label: '' },
    26: { date: 26, status: '', label: '' },
    27: { date: 27, status: '', label: '' },
    28: { date: 28, status: '', label: '' },
    29: { date: 29, status: '', label: '' },
    30: { date: 30, status: '', label: '' },
    31: { date: 31, status: '', label: '' },
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

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
  const today = 16;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hc':
        return 'bg-[#31694E] text-white';
      case 'vh':
        return 'bg-[#31694E] text-white';
      case 'late':
        return 'bg-[#F0E491] text-black';
      case 'absent':
        return 'bg-[#DC2626] text-white';
      case 'scheduled':
        return 'bg-[#658C58] text-white';
      default:
        return 'bg-white text-black';
    }
  };

  const renderCalendar = () => {
    const days = [];
    const totalSlots = firstDay + daysInMonth;

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const schedule = scheduleData[day];
      const isToday = day === today;
      const statusColor = schedule
        ? getStatusColor(schedule.status)
        : 'bg-white text-black';

      days.push(
        <div
          key={day}
          className={`p-2 rounded-lg flex flex-col items-center justify-center min-h-[70px] ${statusColor} ${
            isToday ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="font-bold text-lg">{day}</div>
          {schedule && schedule.label && (
            <div className="text-sm font-semibold">{schedule.label}</div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#658C58] text-white py-4 px-4 flex items-center justify-center relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 text-white hover:bg-white/10"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">LỊCH LÀM VIỆC</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {monthNames[currentMonth]}, {currentYear}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="text-emerald-950 hover:bg-emerald-950"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="text-emerald-950 hover:bg-emerald-950"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-[#31694E] rounded"></div>
            <div className="flex-1">
              <span className="font-medium">Đúng giờ đầy đủ</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>S: Ca Sáng</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-[#F0E491] rounded"></div>
            <div className="flex-1">
              <span className="font-medium">Đi trễ / Về sớm</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>C: Ca Chiều</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-[#DC2626] rounded"></div>
            <div className="flex-1">
              <span className="font-medium">Vắng Mặt</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>G: Ca Gây</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-[#658C58] rounded"></div>
            <div className="flex-1">
              <span className="font-medium">Có lịch làm việc</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>P: Phép/ Công tác</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-white border-2 border-gray-300 rounded"></div>
            <div className="flex-1">
              <span className="font-medium">Không lịch làm việc</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>F: Flex/Fle2/Fle3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
