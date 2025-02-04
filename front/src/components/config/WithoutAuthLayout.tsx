'use client';

/** 페이지 접근 시에 사용자의 인증 상태를 초기화 해주기 위한 컴포넌트입니다. */

import React from 'react';
import Cookies from 'js-cookie';

import { useAuthStore } from '@/store/authStore';

import { RequestSignOut } from '@/lib/api/user';

type WithoutAuthLayoutProps = {
	children: React.ReactNode;
};

const WithoutAuthLayout = ({ children }: WithoutAuthLayoutProps) => {
	const authStore = useAuthStore();

	React.useEffect(() => {
		clearSession();
	}, []);

	const clearSession = async () => {
		authStore.clearUser();
		if (Cookies.get('token')) {
			await RequestSignOut()
			Cookies.remove('token');
		}
	}

	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	);
}

export default WithoutAuthLayout;
