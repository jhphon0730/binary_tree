"use client";

import React from 'react';

import { useRouter } from 'next/navigation'

const MainPage = () => {
	const router = useRouter();

	React.useEffect(() => {
		router.push('/dashboard');
	}, []);

	return (
		<div></div>
	);
};

export default MainPage;
