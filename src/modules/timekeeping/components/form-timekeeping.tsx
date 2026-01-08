'use client';

import { useState, useEffect, Suspense } from 'react';
import { Clock, Loader2, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Skeleton } from '@/react-web-ui-shadcn/src/components/ui/skeleton';
import axios from 'axios';

function TimekeepingContent() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type') as 'checkin' | 'checkout' | null;

  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const nextAction = typeFromUrl || 'checkin';

  useEffect(() => {
    async function fetchStatus() {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = position.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url);
        const data = await res.json();
        const addr = `${data.address.state}, ${data.address.suburb}, ${data.address.road}`;
        setAddress(addr);

        const apiRes = await axios.get('/api/timekeeping');
        const storeAddr = `${apiRes.data.store.state},${apiRes.data.store.suburb},${apiRes.data.store.road}`;
        setStatus(storeAddr === addr);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/timekeeping', { value: nextAction });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Xác nhận thành công!`);
    } catch (error) {
      alert('Lỗi kết nối');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      <Card className="p-10 text-center bg-linear-to-br from-[#658C58] to-[#31694E] text-white border-none shadow-[0_10px_30px_-10px_rgba(49,105,78,0.5)] rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />

        <div className="flex flex-col items-center justify-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Chấm Công Hệ Thống
          </h2>

          <div className="flex items-center gap-2 mt-2 py-2 px-4 bg-black/10 rounded-full backdrop-blur-sm border border-white/10">
            {isInitialLoading ? (
              <Skeleton className="h-5 w-40 bg-white/20" />
            ) : (
              <span className="flex items-center gap-2 text-sm font-medium">
                <MapPin
                  className={`w-4 h-4 ${
                    status ? 'text-[#BBC863]' : 'text-orange-300'
                  }`}
                />
                {status ? 'Đã xác thực vị trí' : 'Vị trí chưa khớp'}
              </span>
            )}
          </div>
        </div>
      </Card>

      <div className="max-w-md mx-auto">
        <Card className="p-8 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white ring-1 ring-black/5">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                Xác Nhận {nextAction === 'checkin' ? 'Vào Ca' : 'Ra Ca'}
              </h3>
            </div>

            <Button
              onClick={handleConfirm}
              // disabled={!status || isLoading}
              className={`w-full relative overflow-hidden h-20 rounded-2xl text-xl font-bold shadow-lg transition-all duration-300 active:scale-[0.98] ${
                nextAction === 'checkin'
                  ? 'bg-[#658C58] hover:bg-[#31694E] shadow-[#658C58]/30'
                  : 'bg-[#BBC863] hover:bg-[#a6b358] text-[#31694E] shadow-[#BBC863]/30'
              } disabled:opacity-50 disabled:grayscale`}
            >
              <span
                className={
                  isLoading
                    ? 'opacity-0'
                    : 'flex items-center justify-center gap-2'
                }
              >
                XÁC NHẬN NGAY
              </span>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin w-6 h-6 text-current" />
                    <span className="font-semibold">Đang xử lý...</span>
                  </div>
                </div>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function TimekeepingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-[#658C58]" />
        </div>
      }
    >
      <TimekeepingContent />
    </Suspense>
  );
}
