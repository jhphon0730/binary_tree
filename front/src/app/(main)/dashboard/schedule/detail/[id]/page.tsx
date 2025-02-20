import React from 'react';
import Swal from "sweetalert2"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarClock, CalendarDays, Clock, Pencil, Repeat, Trash2, Type } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SSRError from "@/components/SSRError"

import { Schedule } from "@/types/schedule"
import { GetScheduleByID } from "@/lib/api/schedule"

type ScheduleDetailPageProps = {
	params: Promise<{
		id: string
	}>
}

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

const getRepeatTypeLabel = (repeatType: string | undefined): string => {
	if (!repeatType) return "반복 없음"
	const repeatTypes: Record<string, string> = {
		yearly: "매년",
		monthly: "매월",
		daily: "매일",
	}
	return repeatTypes[repeatType] || repeatType
}

const ScheduleDetailPage = async ({ params }: ScheduleDetailPageProps) => {
	const { id } = await params;

	let loading: boolean = true
	let schedule: Schedule | null = null

	const scheduleDetailResponse = await GetScheduleByID({ scheduleID: Number(id) })
	if (scheduleDetailResponse.error || !scheduleDetailResponse.data) {
		return <SSRError error={scheduleDetailResponse.error || scheduleDetailResponse.message} />
	}

	schedule = scheduleDetailResponse.data.schedule
	loading = false

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-[200px] bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-muted-foreground">일정을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{schedule.title}</h1>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                일정 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Type className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="font-medium">설명</div>
                    <p className="text-sm text-muted-foreground">{schedule.description}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <CalendarDays className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="font-medium">날짜</div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(schedule.start_date), "PPP", { locale: ko })}
                      {" ~ "}
                      {format(new Date(schedule.end_date), "PPP", { locale: ko })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="font-medium">상세 일정</div>
                    <p className="text-sm text-muted-foreground">
											{"여기가 title 들어갈 부분"}
                      {": "}
                      {format(new Date(schedule.start_date), "a h:mm", { locale: ko })}
                      {" ~ "}
                      {format(new Date(schedule.end_date), "a h:mm", { locale: ko })}
											{" (여기가 description 들어갈 부분)"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <Badge variant="outline">{getEventTypeLabel(schedule.event_type)}</Badge>
                  {schedule.repeat_type && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        {getRepeatTypeLabel(schedule.repeat_type)}
                      </Badge>
                      {schedule.repeat_until && (
                        <span className="text-sm text-muted-foreground">
                          ({format(new Date(schedule.repeat_until), "yyyy.MM.dd", { locale: ko })}까지)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-muted-foreground pt-4">
                <p>작성일: {format(new Date(schedule.CreatedAt), "PPP", { locale: ko })}</p>
                <p>마지막 수정: {format(new Date(schedule.UpdatedAt), "PPP", { locale: ko })}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ScheduleDetailPage
