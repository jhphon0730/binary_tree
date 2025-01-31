'use client'

import React from 'react'
import Swal from 'sweetalert2'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { RequestSignOut } from '@/lib/api/user';
import { useAuthStore } from '@/store/authStore'

const Navbar = () => {
	const router = useRouter();
  const authStore = useAuthStore()

	const signOutHandler = async () => {
		const res = await RequestSignOut(null)
		if (res.error) {
			router.push('/sign-in')
			return
		}
		Swal.fire({
			title: '로그아웃',
			text: '로그아웃 되었습니다',
			icon: 'success',
			showConfirmButton: false,
			timer: 1500,
		})
		router.push('/sign-in')
	}

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
            <DropdownMenuItem onClick={signOutHandler}>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
	)
}

export default Navbar;
