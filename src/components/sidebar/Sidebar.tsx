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
    | 'explaination-approval-management'
    | 'personal-account-profile';

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
      | 'personal-account-profile'
  ) => void;
}

export function DashboardSidebar({
  currentPage,
  onPageChange,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
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
            <button
              onClick={() => {
                router.push('/explaination');
                onPageChange('work-explanation');
              }}
              className={`${
                role !== 1 ? 'flex' : 'hidden'
              } w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/explaination') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">Giải trình công</span>
              </div>
            </button>

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

            <button
              onClick={() => {
                router.push('/attendance');
                onPageChange('attendance');
              }}
              className={`${
                role !== 1 ? 'flex' : 'hidden'
              } w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/attendance') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Chấm công</span>
              </div>
            </button>

            <button
              onClick={() => {
                router.push('/schedule');
                onPageChange('work-schedule');
              }}
              className={`${
                role !== 1 ? 'flex' : 'hidden'
              } w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/schedule') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Lịch làm việc</span>
              </div>
            </button>

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
                <span className="text-sm">Tài khoản</span>
              </div>
            </button>
            <button
              onClick={() => {
                router.push('/profile/personal');
                onPageChange('personal-account-profile');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/profile/personal') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Thông tin cá nhân</span>
              </div>
            </button>
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

            <button
              onClick={() => {
                router.push('/staff-management');
                onPageChange('staff-management');
              }}
              className={`${
                role === 1 ? 'flex' : 'hidden'
              } w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/staff-management') ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">Quản lý nhân viên</span>
              </div>
            </button>

            <button
              onClick={() => {
                router.push('/explaination-approval-management');
                onPageChange('explaination-approval-management');
              }}
              className={`${
                role === 1 ? 'flex' : 'hidden'
              } w-full items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                isActive('/explaination-approval-management')
                  ? 'bg-primary-foreground/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">Quản lý duyệt giải trình</span>
              </div>
            </button>
          </div>
        </nav>
      )}
    </aside>
  );
}
