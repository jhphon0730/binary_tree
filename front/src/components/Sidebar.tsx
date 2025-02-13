'use client'

import Link from 'next/link'
import { Home, Book, Calendar, MessageSquare, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar'

const sidebarItems = [
  { icon: Home, label: '홈', href: '/dashboard' },
  { icon: Book, label: '다이어리', href: '/dashboard/diary' },
  // { icon: Calendar, label: '캘린더', href: '/calendar' },
  // { icon: MessageSquare, label: '메시지', href: '/messages' },
  // { icon: Settings, label: '설정', href: '/settings' },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-center">다이어리</h1>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                'w-full justify-start px-4 py-6',
                pathname === item.href && 'bg-gray-100'
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {/* 여기에 추가적인 푸터 내용을 넣을 수 있습니다 */}
      </SidebarFooter>
    </ShadcnSidebar>
  )
}

export default Sidebar;
