'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import axios from 'axios';

export function TimekeepingPage() {
  // const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  // const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [status, setStatus] = useState(false);

  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  useEffect(() => {
    async function fetchStatus() {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLong(longitude);

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      const res = await fetch(url);
      const data = await res.json();
      const addr = `${data.address.state},${data.address.suburb},${data.address.road}`;

      await axios.get('/api/timekeeping', {}).then((res) => {
        if (
          res.data.store.state +
            ',' +
            res.data.store.suburb +
            ',' +
            res.data.store.road ===
          addr
        ) {
          setStatus(true);
        } else setStatus(false);
      });
    }
    fetchStatus();
  }, []);
  const handleCheckIn = async () => {
    await axios.post('/api/timekeeping', { value: 'checkin' });
  };

  const handleCheckOut = async () => {
    await axios.post('/api/timekeeping', { value: 'checkout' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 text-center bg-linear-to-br from-[#658C58] to-[#31694E] text-white">
        <div className="flex items-center justify-center mb-4">
          <Clock className="w-12 h-12 mr-3" />
          <h2 className="text-2xl font-semibold"></h2>
        </div>
        <div className="text-xl opacity-90">
          {status ? 'Bạn đã đúng vị trí' : 'Bạn đã lệch vị trí'}
          <br></br>
          {address + ' ' + lat + ' ' + long}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#BBC863] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <Button
              onClick={handleCheckIn}
              disabled={status ? false : true}
              className="w-full bg-[#658C58] hover:bg-[#31694E] text-white"
              size="lg"
            >
              <h3 className="text-xl font-semibold mb-2">Chấm Công Vào</h3>
              {/* {checkInTime ? 'Đã Chấm Công' : 'Xác Nhận Vào'} */}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F0E491] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#31694E]" />
            </div>

            <Button
              onClick={handleCheckOut}
              disabled={status ? false : true}
              className="w-full bg-[#BBC863] hover:bg-[#658C58] text-white"
              size="lg"
            >
              <h3 className="text-xl font-semibold mb-2">Chấm Công Ra</h3>
              {/* {checkOutTime ? 'Đã Chấm Công' : 'Xác Nhận Ra'} */}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
