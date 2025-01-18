import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

import { SidebarProvider } from '@/components/ui/sidebar'

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
      </body>
    </html>
  )
}

