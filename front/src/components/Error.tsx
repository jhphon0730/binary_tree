'use client';

import React from 'react';
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';

type ErrorProps = {
	error: string;
}

const Error = ({error}: ErrorProps) => {
	const router = useRouter();

	return (
		<Dialog open={true}>
			<DialogContent>
				<DialogTitle>에러가 발생했습니다.</DialogTitle>
				<div className="flex items-center justify-center">
					<div className="grid gap-3 text-center">
						{new Date().toLocaleString()}
						<p className="text-xl font-bold text-red-500">{error}</p>
						<Button
							onClick={() => router.push('/sign-in')}
							type="button"
							variant="outline"
							className="w-full"
						>
							로그인 페이지로 이동
						</Button>
						<Button
							onClick={() => router.refresh()}
							type="button"
							className="w-full"
						>
							페이지 새로고침
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default Error;
