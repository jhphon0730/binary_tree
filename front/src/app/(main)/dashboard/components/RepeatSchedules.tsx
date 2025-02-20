"use client"

import React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Repeat } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import type { Schedule } from "@/types/schedule"

type RepeatSchedulesProps = {
	schedules: Schedule[]
}

const RepeatSchedules = ({ schedules }: RepeatSchedulesProps) => {

  const getRepeatTypeLabel = (repeatType: string | undefined): string => {
    if (!repeatType) return "반복 없음"
    const repeatTypes: Record<string, string> = {
      yearly: "매년",
      monthly: "매월",
      daily: "매일",
    }
    return repeatTypes[repeatType] || repeatType
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          오늘의 반복 일정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          { schedules && schedules.length > 0 ? (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.ID} className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{schedule.title}</h3>
                    <span className="text-sm text-muted-foreground">{getRepeatTypeLabel(schedule.repeat_type)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{schedule.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    {schedule.repeat_until && (
                      <span className="text-muted-foreground">
                        ~{format(new Date(schedule.repeat_until), "yyyy.MM.dd", { locale: ko })}까지
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              오늘 해당하는 반복 일정이 없습니다.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RepeatSchedules
