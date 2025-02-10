"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type SharedMessageCardProps = {
  sharedMessage: string | null
  handleUpdateMemo: (message: string) => Promise<void>
}

const SharedMessageCard = ({ sharedMessage, handleUpdateMemo }: SharedMessageCardProps) => {
  const [editedMemo, setEditedMemo] = useState<string>(sharedMessage || "")

	const handleChangeMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedMemo(() => e.target.value)
	}

  const handleSave = async () => {
		await handleUpdateMemo(editedMemo)
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
