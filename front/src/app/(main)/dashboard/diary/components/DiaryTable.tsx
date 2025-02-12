"use client"

import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import type { Diary } from "@/types/diary"

type DiaryTableProps = {
  diaries: Diary[]
  onDiaryClick: (diary: Diary) => void
}

const DiaryTable = ({ diaries, onDiaryClick }: DiaryTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">작성일</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[200px]">최종 수정일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diaries.map((diary) => (
            <TableRow key={diary.ID} className="cursor-pointer hover:bg-muted/50" onClick={() => onDiaryClick(diary)}>
              <TableCell className="font-medium">{format(new Date(diary.CreatedAt), "PPP", { locale: ko })}</TableCell>
              <TableCell>{diary.title}</TableCell>
              <TableCell>{format(new Date(diary.UpdatedAt), "PPP", { locale: ko })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DiaryTable
