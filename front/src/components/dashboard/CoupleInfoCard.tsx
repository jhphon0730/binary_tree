"use client"

import React from "react"
import Swal from 'sweetalert2'
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation";

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
import SkeletonCard from '@/components/SkeletonCard';

import { UpdateStartDate } from '@/lib/api/couple';
import { usePartnerStore } from '@/store/partnerStore'

type CoupleInfoCardProps = {
  startDate: string | null
}

const CoupleInfoCard = ({ startDate }: CoupleInfoCardProps) => {
	const router = useRouter()
	const { partner } = usePartnerStore()

  const [isEditing, setIsEditing] = React.useState(false)
  const [editedStartDate, setEditedStartDate] = React.useState<Date | undefined>( startDate ? new Date(startDate) : undefined,)

	const handleEdit = async () => {
		setIsEditing(() => true)
	}

  const handleSave = async () => {
		if (!editedStartDate) {
			Swal.fire({
				icon: 'error',
				title: '연애 시작일을 선택해주세요.',
			})
			return
		}

		const res = await UpdateStartDate({ start_date: editedStartDate.toString() })
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '연애 시작일을 수정하는 중 오류가 발생했습니다.',
				text: res.error,
			})
			return
		}

		Swal.fire({
			icon: 'success',
			title: '연애 시작일이 수정되었습니다.',
		})
    setIsEditing(() => false)
		router.refresh()
  }

	if (!partner) {
		return (
			<SkeletonCard />
		)
	}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
					<p className="text-xl">상대 커플 정보</p>
          <Button variant="outline" size="icon" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm grid grid-cols-1 gap-2">
        <div className="mb-3">
					<span className="font-bold">연애 시작일: </span>
          <span>{startDate ? format(new Date(startDate), "PPP", { locale: ko }) : "설정되지 않음"}</span>
        </div>
				<div>
					<span className="font-bold">커플 이름: </span>
					<span>{partner.name}</span>
				</div>
				<div>
					<span className="font-bold">커플 이메일: </span>
					<span>{partner.email}</span>
				</div>
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>커플 정보 수정</DialogTitle>
            <DialogDescription>연애 시작일을 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
						<Calendar
							mode="single"
							selected={editedStartDate}
							onSelect={setEditedStartDate}
							className="rounded-md border"
						/>
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
