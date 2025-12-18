'use client';
import { DashboardHeader } from '@/components/headers/Topbar';
import { DashboardSidebar } from '@/components/sidebar/Sidebar';
import { AttendancePage } from '@/modules/attendance/components/attendance-page';
import { PersonalAccountPage } from '@/modules/personal-profile/components/menu-page';
import { TimekeepingPage } from '@/modules/timekeeping/components/form-timekeeping';
import { WorkExplanationPage } from '@/modules/work-explaination/components/page-work-explaination';
import { WorkSchedulePage } from '@/modules/work-schedule/components/work-schedule-page';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    | 'dashboard'
    | 'timekeeping'
    | 'work-explanation'
    | 'personal-account'
    | 'attendance'
    | 'work-schedule'
  >('dashboard');
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 space-y-6"></main>
    </div>
  );
}
