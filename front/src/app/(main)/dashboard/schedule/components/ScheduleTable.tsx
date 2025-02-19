"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Schedule } from "@/types/schedule"

interface ScheduleTableProps {
  schedules: Schedule[]
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules }) => {
  const router = useRouter()

  const handleScheduleClick = (scheduleId: number) => {
    router.push(`/dashboard/schedule/${scheduleId}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>시작일</TableHead>
          <TableHead>종료일</TableHead>
          <TableHead>일정 유형</TableHead>
          <TableHead>반복</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow
            key={schedule.ID}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleScheduleClick(schedule.ID)}
          >
            <TableCell className="font-medium">{schedule.title}</TableCell>
            <TableCell>{format(new Date(schedule.start_date), "PPP", { locale: ko })}</TableCell>
            <TableCell>{format(new Date(schedule.end_date), "PPP", { locale: ko })}</TableCell>
            <TableCell>{getEventTypeLabel(schedule.event_type)}</TableCell>
            <TableCell>{getRepeatTypeLabel(schedule.repeat_type)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function getEventTypeLabel(eventType: string): string {
  const eventTypes: Record<string, string> = {
    anniversary: "기념일",
    daily: "일상",
    party: "모임/파티",
    work: "업무",
    holIDay: "휴일",
    reminder: "리마인더",
    custom: "기타",
  }
  return eventTypes[eventType] || eventType
}

function getRepeatTypeLabel(repeatType: string | undefined): string {
  if (!repeatType) return "반복 없음"
  const repeatTypes: Record<string, string> = {
    yearly: "매년",
    monthly: "매월",
    daily: "매일",
  }
  return repeatTypes[repeatType] || repeatType
}

export default ScheduleTable

