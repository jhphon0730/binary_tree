'use client'

import React from 'react'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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

	const pageMoveHandler = (path: string) => {
		router.push(path)
	}

	const signOutHandler = async () => {
		const res = await RequestSignOut()
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
		}).then(() => {
			Cookies.remove('token');
			authStore.clearUser();
		})
		router.push('/sign-in')
	}

	if (!authStore.user) {
		return null
	}

	return (
    <nav className="flex items-center justify-between md:justify-end p-4 bg-white border-b">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold md:hidden">커플 다이어리</h1>
      <div className='flex items-center'>
				<DropdownMenu>
          <DropdownMenuTrigger asChild className='cursor-pointer'>
						<div className="w-10 h-10 rounded-full border overflow-hidden">
							<Image 
								className="w-full h-full object-cover"
								src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${authStore.user.profile_image_file}`}
								alt={authStore.user.name}
								width={40}
								height={40}
								sizes="100%"
							/>
						</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
						{/*title*/}
						<DropdownMenuItem className="font-bold" onClick={() => { pageMoveHandler('/profile'); }}>{authStore.user.name}</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
            <DropdownMenuItem onClick={signOutHandler}>로그아웃</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
	)
}

export default Navbar;
