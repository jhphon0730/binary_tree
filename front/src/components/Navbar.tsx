'use client'

import React from 'react'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { useAuthStore } from '@/store/authStore'

const Navbar = () => {
  const authStore = useAuthStore()

	return (
    <nav className="flex items-center justify-between md:justify-end p-4 bg-white border-b">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold md:hidden">커플 다이어리</h1>
      <div>
        <span className='me-2'>{authStore.user?.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuItem>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
	)
}

export default Navbar;
