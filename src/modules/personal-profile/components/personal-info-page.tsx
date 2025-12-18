'use client';

import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { useUser } from '@/shared/contexts/user-context';
import { ArrowLeft, Mail } from 'lucide-react';
import { useEffect } from 'react';

export function PersonalInfoPage() {
  const { user, loading, refetch } = useUser();
  useEffect(() => {
    if (!loading && user === null) {
      refetch();
    }
  }, [loading, user, refetch]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) return <div>Chưa đăng nhập</div>;
  const personalData = [
    { label: 'Họ và tên', value: user?.fullName },
    { label: 'Giới tính', value: 'gioi tinh' },
    { label: 'Ngày sinh', value: '' },
    { label: 'Mã số thuế', value: '056204000394' },
    {
      label: 'Tên ngân hàng',
      value: 'NHTMCP KY THUONG VN (TECHCOMBANK) - HOI SO CHINH HA NOI',
    },
    { label: 'Số tài khoản', value: '6413193021' },
    { label: 'Dân tộc', value: 'Kinh' },
    { label: 'Tôn giáo', value: 'Không' },
    { label: 'Số CCCD', value: '056204000394' },
    { label: 'Ngày cấp', value: '10/04/2021' },
    { label: 'Nơi cấp', value: 'Cục CS Quản lý HC về TTXH' },
    { label: 'Trình độ học vấn', value: 'Đại học' },
    { label: 'Chuyên ngành', value: 'Khác' },
    { label: 'Trường đào tạo', value: 'Khác' },
    { label: 'Nơi sinh', value: 'Tỉnh Khánh Hòa' },
    { label: 'Nguyên quán', value: '' },
    { label: 'Quốc tịch', value: 'Việt Nam' },
    {
      label: 'Nơi ĐK hộ khẩu',
      value: 'Phú Lộc Đông 3, Thị trấn Diên Khánh, Huyện Diên Khánh, Khánh Hòa',
    },
    { label: 'Thường trú', value: '' },
    {
      label: 'Chỗ ở hiện tại',
      value: 'Phú Lộc Đông 3, Thị trấn Diên Khánh, Huyện Diên Khánh, Khánh Hòa',
    },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-[#658C58] text-white p-6 flex items-center justify-between">
        <button className="p-2 hover:bg-[#31694E] rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
          THÔNG TIN CÁ NHÂN
        </h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <Card className="bg-white p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#658C58] flex items-center justify-center text-white font-bold text-lg">
              AD
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">AD 6183836</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5" />
                <span className="text-sm font-medium">KHÔNG CÓ EMAIL</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <div className="space-y-4">
            {personalData.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-gray-600 text-sm">
                  {item.label}
                </div>
                <div className="col-span-2 text-gray-900 text-sm font-medium text-right">
                  {item.value || '-'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
