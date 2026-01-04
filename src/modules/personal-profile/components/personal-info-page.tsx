'use client';

import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { useUser } from '@/shared/contexts/user-context';
import { ArrowLeft, Mail } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export function PersonalInfoPage() {
  const { user, loading, refetch } = useUser();
  useEffect(() => {
    refetch();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) return <div>Chưa đăng nhập</div>;
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
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Họ và tên</div>
              <div className="col-span-2 text-gray-900 text-sm font-medium text-right">
                {user.fullName}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Giới tính</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.gender === 'female'
                  ? 'Nữ'
                  : user.gender === 'male'
                  ? 'Nam'
                  : '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Ngày sinh</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">CCCD</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.citizenIdNumber || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Ngày cấp</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.citizenIdIssueDate
                  ? new Date(user.citizenIdIssueDate).toLocaleDateString(
                      'vi-VN'
                    )
                  : '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Nơi cấp</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.citizenIdIssuePlace || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Quốc tịch</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.nationality}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Dân tộc</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.ethnicity || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Tôn giáo</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.religion || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Địa chỉ thường trú</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.permanentAddress || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Địa chỉ hiện tại</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.currentAddress || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Trình độ học vấn</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.educationLevel || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Chuyên ngành</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.major || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Trường</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.university || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Ngày vào làm</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {new Date(user.hireDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Ngân hàng</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.bankName || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Số tài khoản</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.bankAccountNumber || '-'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-600 text-sm">Mã số thuế</div>
              <div className="col-span-2 text-right text-sm font-medium">
                {user.taxCode || '-'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
