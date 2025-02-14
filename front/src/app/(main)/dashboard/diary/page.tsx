"use client"

import React from "react"
import Swal from 'sweetalert2'
import { PenLine } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import DiaryTable from "@/app/(main)/dashboard/diary/components/DiaryTable"
import DiaryViewSelector from "@/app/(main)/dashboard/diary/components/DiaryViewSelector"

import { GetDiaries } from "@/lib/api/diary";
import type { Diary, DiaryViewType } from "@/types/diary"

const DiaryMainPage = () => {
	const router = useRouter()

  const [viewType, setViewType] = React.useState<DiaryViewType>("MY")
  const [diaries, setDiaries] = React.useState<Diary[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
		handleGetDiaries()
  }, [viewType])

	const handleGetDiaries = async () => {
		const res = await GetDiaries({DiaryViewType: viewType})
		if (res.error) {
			await Swal.fire({
				icon: "error",
				title: "다이어리 불러오기 실패",
				text: res.error || "알 수 없는 오류가 발생했습니다.",
			})
			return
		}
		setDiaries(() => res.data.diaries)
		setLoading(() => false)
	}

	const handleChangeViewType = (viewType: DiaryViewType) => {
		setLoading(() => true)
		setViewType(() => viewType)
	}

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">다이어리</h1>
        <Button onClick={() => router.push("/dashboard/diary/new")}>
          <PenLine className="mr-2 h-4 w-4" />새 다이어리 작성
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DiaryViewSelector value={viewType} onChange={handleChangeViewType} />
        <div className="text-sm text-muted-foreground">총 {diaries.length}개의 다이어리</div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : diaries.length > 0 ? (
        <DiaryTable diaries={diaries} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">작성된 다이어리가 없습니다.</div>
      )}
    </div>
  )
}

export default DiaryMainPage
