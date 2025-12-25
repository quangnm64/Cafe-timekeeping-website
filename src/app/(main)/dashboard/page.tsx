'use client';
import { useState } from 'react';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState<
    | 'dashboard'
    | 'timekeeping'
    | 'work-explanation'
    | 'personal-account'
    | 'attendance'
    | 'work-schedule'
    | 'explaination-approval'
  >('dashboard');
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 space-y-6"></main>
    </div>
  );
}
