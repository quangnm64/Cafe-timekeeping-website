'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';

export function TimekeepingPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    setCheckOutTime(new Date());
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Chấm Công</h1>
        <p className="text-muted-foreground">
          Hệ thống quản lý thời gian làm việc
        </p>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-[#658C58] to-[#31694E] text-white">
        <div className="flex items-center justify-center mb-4">
          <Clock className="w-12 h-12 mr-3" />
          <h2 className="text-2xl font-semibold">Thời Gian Hiện Tại</h2>
        </div>
        <div className="text-6xl font-bold mb-2">{formatTime(currentTime)}</div>
        <div className="text-xl opacity-90">{formatDate(currentTime)}</div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#BBC863] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chấm Công Vào</h3>
            {checkInTime ? (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Đã chấm công lúc:
                </p>
                <p className="text-2xl font-bold text-[#658C58]">
                  {formatTime(checkInTime)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground mb-4">Chưa chấm công</p>
            )}
            <Button
              onClick={handleCheckIn}
              disabled={!!checkInTime}
              className="w-full bg-[#658C58] hover:bg-[#31694E] text-white"
              size="lg"
            >
              {checkInTime ? 'Đã Chấm Công' : 'Xác Nhận Vào'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0E491] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#31694E]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chấm Công Ra</h3>
            {checkOutTime ? (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Đã chấm công lúc:
                </p>
                <p className="text-2xl font-bold text-[#658C58]">
                  {formatTime(checkOutTime)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground mb-4">Chưa chấm công</p>
            )}
            <Button
              onClick={handleCheckOut}
              disabled={!checkInTime || !!checkOutTime}
              className="w-full bg-[#BBC863] hover:bg-[#658C58] text-white"
              size="lg"
            >
              {checkOutTime ? 'Đã Chấm Công' : 'Xác Nhận Ra'}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-[#658C58]" />
          <h3 className="text-xl font-semibold">Tổng Kết Hôm Nay</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Giờ Vào</p>
            <p className="text-xl font-bold text-[#658C58]">
              {checkInTime ? formatTime(checkInTime) : '--:--:--'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Giờ Ra</p>
            <p className="text-xl font-bold text-[#658C58]">
              {checkOutTime ? formatTime(checkOutTime) : '--:--:--'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Tổng Giờ Làm</p>
            <p className="text-xl font-bold text-[#658C58]">
              {checkInTime && checkOutTime
                ? `${Math.floor(
                    (checkOutTime.getTime() - checkInTime.getTime()) / 3600000
                  )}h ${Math.floor(
                    ((checkOutTime.getTime() - checkInTime.getTime()) %
                      3600000) /
                      60000
                  )}m`
                : '--h --m'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
