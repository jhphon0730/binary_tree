import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ScheduleViewType } from "@/types/schedule"

interface ScheduleViewSelectorProps {
  value: ScheduleViewType
  onChange: (value: ScheduleViewType) => void
}

const ScheduleViewSelector: React.FC<ScheduleViewSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[280px]">
        <SelectValue placeholder="일정 보기 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MY">내가 작성한 일정</SelectItem>
        <SelectItem value="COUPLE">커플이 작성한 일정</SelectItem>
        <SelectItem value="ALL">서로 작성한 일정</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ScheduleViewSelector

