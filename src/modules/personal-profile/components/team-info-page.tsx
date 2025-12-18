'use client';

import { ChevronLeft } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
}

interface TeamMemberDetailPageProps {
  member: TeamMember;
  onBack: () => void;
}

export function TeamMemberDetailPage({
  member,
  onBack,
}: TeamMemberDetailPageProps) {
  const subordinate = {
    name: 'Trương Tịnh Khang',
    position: 'Quản lý Khu vực',
    department: 'Phòng Vận hành HTCH',
    email: 'KHANGTT1@PHUCLONG.MASANGROUP.COM',
    phone: '0387565292',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#658C58] px-4 py-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#31694E] rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-[#E8EAF0] px-4 pb-6 pt-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
            {member.avatar ? (
              <img
                src={member.avatar || '/placeholder.svg'}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-pink-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {member.name}
          </h2>

          <div className="w-full space-y-3 text-base">
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Chức vụ:
              </span>
              <span className="text-gray-900">{member.position}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Bộ phận:
              </span>
              <span className="text-gray-900">Khối vận hành - Cửa hàng_3P</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Email:
              </span>
              <span className="text-gray-900">KHÔNG CÓ EMAIL</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                SĐT:
              </span>
              <span className="text-gray-900">0765835389</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Số máy lẻ:
              </span>
              <span className="text-gray-900"></span>
            </div>
          </div>

          <div className="flex gap-3 mt-6 w-full">
            <button className="flex-1 bg-[#DC3545] text-white font-medium py-3 rounded-lg hover:bg-[#C82333] transition-colors">
              Quản lý trực tiếp
            </button>
            <button className="flex-1 bg-[#E8A5AD] text-white font-medium py-3 rounded-lg hover:bg-[#DC8B94] transition-colors">
              Quản lý cáo trên
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-pink-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {subordinate.name}
          </h3>

          <div className="w-full space-y-3 text-base">
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Chức vụ:
              </span>
              <span className="text-gray-900">{subordinate.position}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Bộ phận:
              </span>
              <span className="text-gray-900">{subordinate.department}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Email:
              </span>
              <span className="text-gray-900 text-sm">{subordinate.email}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                SĐT:
              </span>
              <span className="text-gray-900">{subordinate.phone}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-900 min-w-[120px]">
                Số máy lẻ:
              </span>
              <span className="text-gray-900"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
