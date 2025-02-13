"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DiaryViewType } from "@/types/diary"

type DiaryViewSelectorProps = {
  value: DiaryViewType
  onChange: (value: DiaryViewType) => void
}

const DiaryViewSelector = ({ value, onChange }: DiaryViewSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[280px]">
        <SelectValue placeholder="다이어리 보기 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MY">내가 작성한 다이어리</SelectItem>
        <SelectItem value="COUPLE">커플이 작성한 다이어리</SelectItem>
        <SelectItem value="ALL">서로 작성한 다이어리</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default DiaryViewSelector
