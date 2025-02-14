"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { Diary } from "@/types/diary"

type DiaryTableProps = {
  diaries: Diary[]
}

const DiaryTable = ({ diaries }: DiaryTableProps) => {
	const router = useRouter()

	const handleDiaryClick = (diary: Diary) => {
		router.push(`/dashboard/diary/detail/${diary.ID}`)
	}

  return (
		<Table className="whitespace-nowrap">
			<TableHeader>
				<TableRow>
					<TableHead className="w-[200px]">작성일</TableHead>
					<TableHead>제목</TableHead>
					<TableHead className="w-[200px]">작성일 기준</TableHead>
					<TableHead className="w-[200px]">최종 수정일</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{diaries.map((diary) => (
					<TableRow key={diary.ID} className="cursor-pointer hover:bg-muted/50" onClick={() => handleDiaryClick(diary)}>
							<TableCell className="font-medium p-4">{format(new Date(diary.CreatedAt), "PPP", { locale: ko })}</TableCell>
							<TableCell>{diary.title}</TableCell>
							<TableCell>{format(new Date(diary.diary_date), "PPP", { locale: ko })}</TableCell>
							<TableCell>{format(new Date(diary.UpdatedAt), "PPP", { locale: ko })}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
  )
}

export default DiaryTable
