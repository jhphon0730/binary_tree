import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '커플 다이어리',
  description: '커플을 위한 공유 다이어리 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
				<main>
					{children}
				</main>
				<footer className="py-4 bg-gray-200">
					<div className="container mx-auto px-4 text-center text-sm text-gray-600">
						&copy; 2025 커플 다이어리. All rights reserved.
					</div>
				</footer>
      </body>
    </html>
  )
}

