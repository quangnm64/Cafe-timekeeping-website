'use client';

import {
  Avatar,
  AvatarFallback,
} from '@/react-web-ui-shadcn/src/components/ui/avatar';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import { Bell, Search, User } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-20 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
        </div>
      </div>
    </header>
  );
}
