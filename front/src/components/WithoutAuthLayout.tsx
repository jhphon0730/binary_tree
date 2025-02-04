'use client';

/** 페이지 접근 시에 사용자의 인증 상태를 초기화 해주기 위한 컴포넌트입니다. */

import React from 'react';
import Cookies from 'js-cookie';

import { useAuthStore } from '@/store/authStore';

type WithoutAuthLayoutProps = {
	children: React.ReactNode;
};

const WithoutAuthLayout = ({ children }: WithoutAuthLayoutProps) => {
	const authStore = useAuthStore();

	React.useEffect(() => {
		authStore.clearUser();
		Cookies.remove('token');
	}, []);

	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	);
}

export default WithoutAuthLayout;
