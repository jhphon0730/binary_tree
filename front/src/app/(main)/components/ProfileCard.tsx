import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { User } from "@/types/user"

type ProfileCardProps = {
  user: User
  isEditable?: boolean
}

const ProfileCard = ({ user, isEditable = false }: ProfileCardProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{user.name}의 프로필</CardTitle>
        {isEditable && (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user.profile_image_file} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
        <div className="w-full space-y-2">
          <p>
            <strong>이메일:</strong> {user.email}
          </p>
          <p>
            <strong>가입일:</strong> {new Date(user.CreatedAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
