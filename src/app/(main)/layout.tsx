'use client';
import { DashboardHeader } from '@/components/headers/Topbar';
import { DashboardSidebar } from '@/components/sidebar/Sidebar';
import { AttendancePage } from '@/modules/attendance/components/attendance-page';
import { PersonalAccountPage } from '@/modules/personal-profile/components/menu-page';
import { TimekeepingPage } from '@/modules/timekeeping/components/form-timekeeping';
import { WorkExplanationPage } from '@/modules/work-explaination/components/page-work-explaination';
import { WorkSchedulePage } from '@/modules/work-schedule/components/work-schedule-page';
import { useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <DashboardSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">{children}</main>
        <footer className="bg-[#31694E] text-white py-3 px-6 text-center text-sm">
          Lorem Ipsum is simply dummy
        </footer>
      </div>
    </div>
  );
}
