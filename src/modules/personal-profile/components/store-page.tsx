'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Store {
  city: string;
  country: string;
  road: string;
  state: string;
  storeName: string;
  suburb: string;
}

interface StoreListPageProps {
  onBack: () => void;
}

export function StoreListPage({ onBack }: StoreListPageProps) {
  const [selectedStore, setSelectedStore] = useState<string>('PL2115');
  const [searchQuery, setSearchQuery] = useState('');
  // const [store,setStore]=useState<Store>

  // const filteredStores = stores.filter(
  //   (store) =>
  //     store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     store.address.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  async function fetchStatus() {
    const result = await axios.get('/api/store');
    // setStore(result.data.store);
  }
  useEffect(() => {
    fetchStatus();
  }, []);
  // const handleSelectStore = () => {
  //   onBack();
  // };

  return (
    <div className="inset-0 bg-gray-100 flex flex-col z-50">
      <div className="bg-[#658C58] text-white p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#31694E] rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center mr-10">
          CỬA HÀNG ĐANG LÀM VIỆC
        </h1>
      </div>

      {/* <div className="p-4">
        <Input
          type="text"
          placeholder="placeholder_enter_site_code_site_name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-gray-300 text-gray-400 placeholder:text-gray-400"
        />
      </div> */}

      {/* <div className="bg-blue-100 py-3 px-4 text-center">
        <span className="text-blue-600 font-bold text-lg">
          TỔNG ({filteredStores.length})
        </span>
      </div> */}

      {/* <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredStores.map((store) => (
          <div
            key={store}
            onClick={() => setSelectedStore(store.)}
            className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedStore === store.id
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedStore === store.id && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-gray-900 font-medium">
                  {store.code} - {store.name}, {store.address}
                </span>
              </div>
            </div>
          </div>
         ))}
      </div> */}

      {/* <div className="p-4">
        <Button
          onClick={handleSelectStore}
          className="w-full bg-[#658C58] hover:bg-[#31694E] text-white font-bold py-6 text-lg rounded-lg"
        >
          Chọn
        </Button>
      </div> */}
    </div>
  );
}
