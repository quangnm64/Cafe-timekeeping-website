'use client';

import { ChangePasswordPage } from '@/modules/auth/components/form-reset-password';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import {
  FileText,
  RotateCcw,
  Key,
  LogOut,
  ChevronRight,
  CircleChevronRight,
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { JobDescriptionPage } from './job-decsription-page';
import { StoreListPage } from './store-page';
import axios from 'axios';

export function PersonalAccountPage() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [role, setRole] = useState<number | null>(null);

  const menuItems = [
    { id: 'job-description', label: 'Mô tả công việc', icon: FileText },
    { id: 'default-store', label: 'Cửa hàng mặc định', icon: RotateCcw },
    { id: 'change-password', label: 'Đổi mật khẩu', icon: Key },
    { id: 'logout', label: 'Đăng xuất', icon: LogOut },
  ];

  // Lọc danh sách menu dựa trên role
  const filteredMenuItems = useMemo(() => {
    if (role === 1) {
      // Nếu role là 1, loại bỏ 'Mô tả công việc' và 'Cửa hàng mặc định'
      return menuItems.filter(
        (item) => item.id !== 'job-description' && item.id !== 'default-store'
      );
    }
    return menuItems;
  }, [role]);

  async function fetchStatus() {
    await axios
      .get('/api/getToken', {})
      .then((res) => {
        setRole(res.data.user.role_id ?? null);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'logout') {
      setShowLogoutDialog(true);
    } else {
      setSelectedMenu(menuId);
    }
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/log-out');
    window.location.href = '/log-in';
    setShowLogoutDialog(false);
  };

  if (selectedMenu === 'job-description') {
    return <JobDescriptionPage onBack={() => setSelectedMenu(null)} />;
  }
  if (selectedMenu === 'change-password') {
    return <ChangePasswordPage onBack={() => setSelectedMenu(null)} />;
  }
  if (selectedMenu === 'default-store') {
    return <StoreListPage onBack={() => setSelectedMenu(null)} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#658C58] text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold text-center">TÀI KHOẢN CỦA TÔI</h1>
      </div>

      <div className="bg-gray-50 p-4 space-y-3 rounded-b-lg">
        {/* Sử dụng danh sách đã được lọc ở đây */}
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.id}
              className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-[#658C58]"
              onClick={() => handleMenuClick(item.id)}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-gray-700" />
                  <span className="text-base font-medium text-gray-900">
                    {item.label}
                  </span>
                </div>
                <CircleChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-6 text-gray-500 text-sm">
        Version 1.6.6
      </div>

      {/* Logout Dialog giữ nguyên */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border-2 border-gray-200">
            <div className="p-7">
              <div className="flex justify-center mb-4">
                <LogOut className="w-10 h-10 text-[#658C58]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xác nhận Đăng xuất
              </h2>
              <p className="text-gray-500 text-center mb-7">
                Bạn có chắc chắn muốn kết thúc phiên làm việc hiện tại không?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-[#658C58] text-white font-semibold rounded-lg shadow-md hover:bg-[#527047] transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
