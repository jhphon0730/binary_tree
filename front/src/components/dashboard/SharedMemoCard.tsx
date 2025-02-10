"use client"

import React from "react"
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { UpdateSharedNote } from '@/lib/api/couple';

type SharedMessageCardProps = {
  sharedMessage: string;
}

const SharedMessageCard = ({ sharedMessage }: SharedMessageCardProps) => {
	const router = useRouter()

  const [editedMemo, setEditedMemo] = React.useState<string>(sharedMessage)

	const handleChangeMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedMemo(() => e.target.value)
	}

  const handleSave = async () => {
		const res = await UpdateSharedNote({ shared_note: editedMemo })
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '공유 메시지 수정 실패',
				text: res.error,
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '공유 메시지 수정 성공',
		})
		router.push('/dashboard')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
					<p className="text-xl">공유 메시지</p>
				</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <Textarea
          value={editedMemo}
          onChange={handleChangeMemo}
          placeholder="공유 메시지를 입력하세요"
          className="min-h-[100px]"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>저장</Button>
      </CardFooter>
    </Card>
  )
}

export default SharedMessageCard
