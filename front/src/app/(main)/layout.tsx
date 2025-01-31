'use client';

import React from 'react'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

import { useAuthStore } from '@/store/authStore';

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
	const router = useRouter();
	const authStorage = useAuthStore();

	// TODO: 페이지가 바뀌거나 authStorage.user가 바뀌면 token과, authStorage.user가 null인지 확인 하는 useEffect 추가하기
	React.useEffect(() => {
		const token = Cookies.get('token');
		if (!authStorage.user && !token) {
			// 세션 만료
			Swal.fire({
				title: '세션이 만료되었습니다.',
				text: '다시 로그인 해주세요.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: '로그인',
				cancelButtonText: '취소',
			})
			// REMOVE
			authStorage.clearUser();
			Cookies.remove('token');
			router.push('/sign-in');
			return
		}
	}, [authStorage.user, window.location.pathname]);

	return (
		<SidebarProvider>
			<div className="flex w-screen h-screen">
				<Sidebar />
				<div className="flex flex-col flex-grow">
					<Navbar />
					<main className="flex-grow p-6 overflow-auto">
						{children}
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default MainLayout;
