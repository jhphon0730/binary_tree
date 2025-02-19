"use client"

import React from "react"
import Swal from "sweetalert2"
import { CalendarPlus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import ScheduleTable from "@/app/(main)/dashboard/schedule/components/ScheduleTable"
import ScheduleViewSelector from "@/app/(main)/dashboard/schedule/components/ScheduleViewSelector"

import { GetSchedules } from "@/lib/api/schedule"
import type { Schedule, ScheduleViewType } from "@/types/schedule"

const CalendarMainPage = () => {
  const router = useRouter()

  const [viewType, setViewType] = React.useState<ScheduleViewType>("MY")
  const [schedules, setSchedules] = React.useState<Schedule[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    handleGetSchedules()
  }, [viewType])

  const handleGetSchedules = async () => {
    const res = await GetSchedules({ ScheduleViewType: viewType })
    if (res.error) {
      await Swal.fire({
        icon: "error",
        title: "일정 불러오기 실패",
        text: res.error || "알 수 없는 오류가 발생했습니다.",
      })
      return
    }
    setSchedules(() => res.data.schedules)
    setLoading(() => false)
  }

  const handleChangeViewType = (viewType: ScheduleViewType) => {
    setLoading(() => true)
    setViewType(() => viewType)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">캘린더</h1>
        <Button onClick={() => router.push("/dashboard/schedule/new")}>
          <CalendarPlus className="mr-2 h-4 w-4" />새 일정 추가
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <ScheduleViewSelector value={viewType} onChange={handleChangeViewType} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : schedules.length > 0 ? (
        <ScheduleTable schedules={schedules} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">등록된 일정이 없습니다.</div>
      )}
    </div>
  )
}

export default CalendarMainPage

