"use client"

import React from "react"
import { CalendarClock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import type { Schedule } from "@/types/schedule"

type TodaySchedulesProps = {
	schedules: Schedule[]
}

const TodaySchedules = ({ schedules }: TodaySchedulesProps) => {
  const getEventTypeLabel = (eventType: string): string => {
    const eventTypes: Record<string, string> = {
      anniversary: "기념일",
      daily: "일상",
      party: "모임/파티",
      work: "업무",
      holiday: "휴일",
      reminder: "리마인더",
      custom: "기타",
    }
    return eventTypes[eventType] || eventType
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          오늘의 일정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-4">
					{ schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.ID} className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{schedule.title}</h3>
                    <span className="text-sm text-muted-foreground">{getEventTypeLabel(schedule.event_type)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{schedule.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              오늘 예정된 일정이 없습니다.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}


export default TodaySchedules
