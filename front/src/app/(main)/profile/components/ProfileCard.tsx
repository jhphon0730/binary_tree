'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Mail, Calendar } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { User } from '@/types/user'

type ProfileCardProps = {
  user: User
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gray-200" />
      <CardContent className="relative pt-4">
        <div className="absolute -top-16 left-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={user.profile_image_file} alt={user.name} />
            <AvatarFallback>
							<Image 
								className="w-full h-full object-cover"
								src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profile_image_file}`}
								alt={user.name}
								width={40}
								height={40}
								sizes="100%"
							/>
						</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="mt-10 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(user.CreatedAt), 'yyyy년 MM월 dd일', { locale: ko })} 가입
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
