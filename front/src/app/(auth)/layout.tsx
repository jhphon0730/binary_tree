import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '커플 다이어리',
  description: '커플 다이어리 로그인 및 회원가입',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md px-4">
          {children}
        </div>
      </main>
    </div>
  )
}

