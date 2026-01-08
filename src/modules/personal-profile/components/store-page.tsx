'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import axios from 'axios';
import { ChevronLeft, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Store {
  city: string;
  country: string;
  road: string;
  state: string;
  storeName: string;
  suburb: string;
  storeId: number;
}

interface StoreListPageProps {
  onBack: () => void;
}

export function StoreListPage({ onBack }: StoreListPageProps) {
  const [stores, setStores] = useState<Store[]>([]);

  async function fetchStatus() {
    const result = await axios.get('/api/store');
    if (result.data.status) {
      // Kiểm tra nếu là object đơn lẻ thì bọc vào mảng để dùng được .map()
      const data = result.data.store;
      setStores(Array.isArray(data) ? data : [data]);
    } else {
      alert('không tìm thấy cửa hàng');
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchStatus();
    };
    loadData();
  }, []);

  return (
    <div className="inset-0 bg-gray-100 flex flex-col z-50 min-h-screen">
      <div className="bg-[#658C58] text-white p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#31694E] rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-10 uppercase">
          CỬA HÀNG ĐANG LÀM VIỆC
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {stores && stores.length > 0 ? (
          stores.map((store) => (
            <div
              key={store.storeId}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
            >
              <h2 className="font-bold text-lg text-[#658C58] mb-1">
                {store.storeName}
              </h2>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-red-500" />
                <p className="text-sm">
                  {store.road}, {store.suburb}, {store.state}, {store.city}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            Đang tải dữ liệu cửa hàng...
          </div>
        )}
      </div>
    </div>
  );
}
