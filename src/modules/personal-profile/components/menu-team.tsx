'use client';

import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { TeamMemberDetailPage } from './team-info-page';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar?: string;
}

interface TeamListPageProps {
  onBack: () => void;
}

export function TeamListPage({ onBack }: TeamListPageProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Nguyễn Minh Quang',
      position: 'Nhân viên Part time',
      avatar: '/man.jpg',
    },
    {
      id: '2',
      name: 'Bùi Lê Đăng Khoa',
      position: 'Nhân viên Part time',
      avatar: '/man-selfie.jpg',
    },
    {
      id: '3',
      name: 'Phan Ngọc Vinh',
      position: 'Nhân viên Part time',
      avatar: '/man-phone.jpg',
    },
    { id: '4', name: 'Nguyễn Quang Vinh', position: 'Nhân viên Part time' },
    { id: '5', name: 'Trần Quang Mạnh', position: 'Nhân viên Part time' },
    { id: '6', name: 'Phù Minh Quý', position: 'Nhân viên Part time' },
    { id: '7', name: 'Nguyễn Thanh Tùng', position: 'Nhân viên Part time' },
    {
      id: '8',
      name: 'Nguyễn Minh Quang',
      position: 'Nhân viên Part time',
      avatar: '/man.jpg',
    },
    {
      id: '9',
      name: 'Nguyễn Mạnh Thịnh',
      position: 'Nhân viên Part time',
      avatar: '/man-bike.jpg',
    },
    {
      id: '10',
      name: 'Lê Thuỳ Tường Vy',
      position: 'Nhân viên Part time',
      avatar: '/teddy-bear.jpg',
    },
  ];

  if (selectedMember) {
    return (
      <TeamMemberDetailPage
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
      />
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col">
      <div className="bg-[#658C58] shadow-sm flex items-center gap-4 p-4 z-20">
        <button
          onClick={onBack}
          className="text-gray-900 hover:bg-[#31694E] p-1 rounded-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 divide-y divide-gray-200">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="bg-white p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-pink-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">
                {member.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{member.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
