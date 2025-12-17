'use client';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import {
  ChevronLeft,
  Clock,
  ClipboardList,
  User,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

interface DashboardSidebarProps {
  currentPage:
    | 'dashboard'
    | 'timekeeping'
    | 'work-explanation'
    | 'personal-account'
    | 'attendance'
    | 'work-schedule';
  onPageChange: (
    page:
      | 'dashboard'
      | 'timekeeping'
      | 'work-explanation'
      | 'personal-account'
      | 'attendance'
      | 'work-schedule'
  ) => void;
}

export function DashboardSidebar({
  currentPage,
  onPageChange,
}: DashboardSidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

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
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
              List Menu
            </h3>

            <button
              onClick={() => onPageChange('timekeeping')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                currentPage === 'timekeeping' ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Chấm công</span>
              </div>
            </button>

            <button
              onClick={() => onPageChange('work-explanation')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                currentPage === 'work-explanation'
                  ? 'bg-primary-foreground/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">Giải trình công</span>
              </div>
            </button>

            <button
              onClick={() => onPageChange('personal-account')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                currentPage === 'personal-account'
                  ? 'bg-primary-foreground/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Cá nhân</span>
              </div>
            </button>

            <button
              onClick={() => onPageChange('attendance')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                currentPage === 'attendance' ? 'bg-primary-foreground/20' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Bảng chấm công</span>
              </div>
            </button>

            <button
              onClick={() => onPageChange('work-schedule')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-primary-foreground/10 transition-colors ${
                currentPage === 'work-schedule'
                  ? 'bg-primary-foreground/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Lịch làm việc</span>
              </div>
            </button>
          </div>
        </nav>
      )}
    </aside>
  );
}
