import React from 'react'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import WithoutAuthLayout from '@/components/WithoutAuthLayout';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '다이어리',
  description: '커플 다이어리 로그인 및 회원가입',
}

export default function AuthLayout({ children, }: { children: React.ReactNode }) {
  return (
		<WithoutAuthLayout>
			<div className={`min-h-screen flex flex-col ${inter.className}`}>
				<main className="flex-grow flex items-center justify-center bg-gray-100">
					<div className="w-full max-w-md px-4">
						{children}
					</div>
				</main>
			</div>
		</WithoutAuthLayout>
  )
}

