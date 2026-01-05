'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import axios from 'axios';
import {
  ChevronLeft,
  Clock,
  ClipboardList,
  User,
  Calendar,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'; // Thêm usePathname
import { useEffect, useState } from 'react';

interface DashboardSidebarProps {
  currentPage:
    | 'dashboard'
    | 'timekeeping'
    | 'work-explanation'
    | 'personal-account'
    | 'attendance'
    | 'work-schedule'
    | 'explaination-approval'
    | 'arrange-schedule'
    | 'staff-management'
    | 'explaination-approval-management';

  onPageChange: (
    page:
      | 'dashboard'
      | 'timekeeping'
      | 'work-explanation'
      | 'personal-account'
      | 'attendance'
      | 'work-schedule'
      | 'explaination-approval'
      | 'arrange-schedule'
      | 'staff-management'
      | 'explaination-approval-management'
  ) => void;
}

export function DashboardSidebar({
  currentPage,
  onPageChange,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // Lấy URL hiện tại
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState<number | null>(null);

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

  // Hàm kiểm tra xem nút có đang active hay không dựa trên URL
  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`bg-primary text-primary-foreground flex flex-col transition-all ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-primary-foreground/20 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </div>

      {!isCollapsed && (
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            {/* Chấm công */}
            <button
              onClick={() => {
                router.push('/time-keeping');
                onPageChange('timekeeping');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/time-keeping') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Chấm công</span>
              </div>
            </button>

            {/* Giải trình công */}
            <button
              onClick={() => {
                router.push('/explaination');
                onPageChange('work-explanation');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/explaination') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">Giải trình công</span>
              </div>
            </button>

            {/* Phê duyệt giải trình công */}
            <button
              onClick={() => {
                router.push('/explaination-approval');
                onPageChange('explaination-approval');
              }}
              className={`${
                role === 2 ? 'flex' : 'hidden'
              } w-full items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/explaination-approval')
                  ? 'bg-primary-foreground/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2 ">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Phê duyệt giải trình công</span>
              </div>
            </button>

            {/* Bảng chấm công */}
            <button
              onClick={() => {
                router.push('/attendance');
                onPageChange('attendance');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/attendance') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Bảng chấm công</span>
              </div>
            </button>

            {/* Lịch làm việc */}
            <button
              onClick={() => {
                router.push('/schedule');
                onPageChange('work-schedule');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/schedule') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Lịch làm việc</span>
              </div>
            </button>

            {/* Cá nhân */}
            <button
              onClick={() => {
                router.push('/profile');
                onPageChange('personal-account');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/profile') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Cá nhân</span>
              </div>
            </button>

            {/* Xếp lịch */}
            <button
              onClick={() => {
                router.push('/arrange-schedule');
                onPageChange('arrange-schedule');
              }}
              className={`${
                role === 2 ? 'flex' : 'hidden'
              } w-full items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/arrange-schedule') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Xếp lịch</span>
              </div>
            </button>

            {/* Super Admin */}
            <button
              onClick={() => {
                router.push('/staff-management');
                onPageChange('staff-management');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/staff-management') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Super Admin</span>
              </div>
            </button>

            {/* Quản lý duyệt giải trình */}
            <button
              onClick={() => {
                router.push('/explaination-approval-management');
                onPageChange('explaination-approval-management');
              }}
              className={` w-full items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/explaination-approval-management')
                  ? 'bg-primary-foreground/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Quản lý duyệt giải trình</span>
              </div>
            </button>
          </div>
        </nav>
      )}
    </aside>
  );
}
