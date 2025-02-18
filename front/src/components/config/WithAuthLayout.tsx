'use client';

/** 페이지 접근 시에 사용자의 인증 상태가 올바르지 않다면 로그인 페이지로 이동 시키기 위한 컴포넌트입니다. */

import React from 'react';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/authStore';
import { usePartnerStore } from '@/store/partnerStore';
import { CheckIsValidSession } from '@/lib/api/config';

type WithAuthLayoutProps = {
	children: React.ReactNode;
};

const WithAuthLayout = ({ children }: WithAuthLayoutProps) => {
	const router = useRouter();
	const authStorage = useAuthStore();
	const partnerStorage = usePartnerStore();

	React.useEffect(() => {
		console.log('%c[AuthLayout]', 'color: red');
		handleSession();
	}, [authStorage.user, partnerStorage.partner]);

	const clearSession = () => {
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
		partnerStorage.clearPartner();
		Cookies.remove('token');
		router.push('/sign-in');
		return
	}

	const handleSession = async () => {
		const token = Cookies.get('token');
		if (!authStorage.user || !token || !partnerStorage.partner) {
			clearSession()
			return
		}
		const res = await CheckIsValidSession();
		if (res.error) {
			clearSession()
			return
		}
	}

	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	);
}

export default WithAuthLayout;
