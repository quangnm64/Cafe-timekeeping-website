'use client';

import {
  Avatar,
  AvatarFallback,
} from '@/react-web-ui-shadcn/src/components/ui/avatar';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import { Bell, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserInfo } from '@/modules/auth/interfaces/auth.interfaces';

export function DashboardHeader() {
  const [user, setUser] = useState<UserInfo>({
    account_id: '',
    employee_id: '',
    role_id: '',
    username: '',
    last_login: '',
  });

  // const currentDate = new Date().toLocaleDateString("en-US", {
  //   month: "long",
  //   day: "numeric",
  //   year: "numeric",
  // })
  // const currentTime = new Date().toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // })

  return (
    <header className="border-b bg-background">
      <div className="flex h-20 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome {user.username}
          </h1>
          {/* <p className="text-sm text-muted-foreground">
            {currentDate} | {currentTime}
          </p> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-[200px] pl-9 bg-muted/50"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="text-right">
              <p className="text-sm font-medium">Your Name</p>
              <p className="text-xs text-muted-foreground">Your Position</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
