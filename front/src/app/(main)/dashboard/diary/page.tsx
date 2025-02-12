"use client"

import React from "react"
import { PenLine } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import DiaryTable from "@/app/(main)/dashboard/diary/components/DiaryTable"
import DiaryViewSelector from "@/app/(main)/dashboard/diary/components/DiaryViewSelector"

import type { Diary, DiaryViewType } from "@/types/diary"

const DiaryMainPage = () => {
  const router = useRouter()
  const [viewType, setViewType] = React.useState<DiaryViewType>("MY")
  const [diaries, setDiaries] = React.useState<Diary[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
  }, [viewType])

  const handleDiaryClick = (diary: Diary) => {
    // router.push(`/diary/${diary.id}`)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">다이어리</h1>
        <Button onClick={() => router.push("/diary/new")}>
          <PenLine className="mr-2 h-4 w-4" />새 다이어리 작성
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DiaryViewSelector value={viewType} onChange={(value) => setViewType(value as DiaryViewType)} />
        <div className="text-sm text-muted-foreground">총 {diaries.length}개의 다이어리</div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : diaries.length > 0 ? (
        <DiaryTable diaries={diaries} onDiaryClick={handleDiaryClick} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">작성된 다이어리가 없습니다.</div>
      )}
    </div>
  )
}

export default DiaryMainPage
