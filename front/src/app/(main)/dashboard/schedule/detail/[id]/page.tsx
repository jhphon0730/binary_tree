import React from 'react';
import { ko } from "date-fns/locale"
import { format, parse } from "date-fns"
import { CalendarClock, CalendarDays, ListTodo, Repeat, Type } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SSRError from "@/components/SSRError"
import PageHeader from "@/app/(main)/dashboard/schedule/detail/components/PageHeader"

import { Schedule, ScheduleDetail } from "@/types/schedule"
import { GetScheduleByID } from "@/lib/api/schedule"

type ScheduleDetailPageProps = {
	params: Promise<{
		id: string
	}>
}

const formatTime = (timeString: string): string => {
	const date = parse(timeString, "HH:mm", new Date())
	return format(date, "a h:mm", { locale: ko })
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

const renderScheduleDetails = (details: ScheduleDetail[]) => {
	return details.map((detail, index) => (
		<div key={detail.ID} className="rounded-lg border p-4 space-y-3">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">{detail.title}</h3>
				<Badge variant="outline">
					{formatTime(detail.start_time)} - {formatTime(detail.end_time)}
				</Badge>
			</div>
			<p className="text-sm text-muted-foreground">{detail.description}</p>
		</div>
	))
}

const ScheduleDetailPage = async ({ params }: ScheduleDetailPageProps) => {
	const { id } = await params;

	let schedule: Schedule | null = null

	const scheduleDetailResponse = await GetScheduleByID({ scheduleID: Number(id) })
	if (scheduleDetailResponse.error || !scheduleDetailResponse.data) {
		return <SSRError error={scheduleDetailResponse.error || scheduleDetailResponse.message} />
	}
	schedule = scheduleDetailResponse.data.schedule

  if (!schedule) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-muted-foreground">일정을 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto space-y-6">
				<PageHeader schedule={schedule} />

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
									<div className="font-medium">기간</div>
									<p className="text-sm text-muted-foreground">
										{format(new Date(schedule.start_date), "PPP", { locale: ko })}
										{" ~ "}
										{format(new Date(schedule.end_date), "PPP", { locale: ko })}
									</p>
								</div>
							</div>

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

							<Separator />

							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<ListTodo className="h-5 w-5 text-muted-foreground" />
									<div className="font-medium">상세 일정</div>
								</div>
								<ScrollArea className="h-[300px] pr-4">
									<div className="space-y-3">
										{schedule.details && schedule.details.length > 0 ? (
											renderScheduleDetails(schedule.details)
										) : (
											<div className="text-center text-muted-foreground py-8">등록된 상세 일정이 없습니다.</div>
										)}
									</div>
								</ScrollArea>
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
  )
}

export default ScheduleDetailPage
