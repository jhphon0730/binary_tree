"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CoupleInfoCardProps = {
  relationshipStartDate: string | null
  handleUpdateCoupleInfo: (data: { relationshipStartDate: string | null }) => Promise<void>
}

const CoupleInfoCard = ({ relationshipStartDate, handleUpdateCoupleInfo }: CoupleInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedStartDate, setEditedStartDate] = useState<Date | undefined>(
    relationshipStartDate ? new Date(relationshipStartDate) : undefined,
  )

	const handleEdit = async () => {
		setIsEditing(() => true)
	}

  const handleSave = async () => {
    setIsEditing(() => false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          커플 정보
          <Button variant="outline" size="icon" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
					<span>연애 시작일: </span>
          <span>{relationshipStartDate ? format(new Date(relationshipStartDate), "PPP", { locale: ko }) : "설정되지 않음"}</span>
        </div>
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>커플 정보 수정</DialogTitle>
            <DialogDescription>연애 시작일을 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-5 items-center justify-center">
							<div className="col-span-1" />
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={editedStartDate}
                  onSelect={setEditedStartDate}
                  className="rounded-md border"
                />
              </div>
							<div className="col-span-1" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default CoupleInfoCard
