"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { format, parse } from "date-fns"
import { ko } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Clock, Loader2, Plus, Trash2 } from "lucide-react"
import Swal from "sweetalert2"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"
import { GetScheduleByID } from "@/lib/api/schedule";
import type { EventType, RepeatType } from "@/types/schedule"

const eventTypes: { value: EventType; label: string }[] = [
  { value: "anniversary", label: "기념일" },
  { value: "daily", label: "일상" },
  { value: "party", label: "모임/파티" },
  { value: "work", label: "업무" },
  { value: "holiday", label: "휴일" },
  { value: "reminder", label: "리마인더" },
  { value: "custom", label: "기타" },
]

// repeatTypes 배열 수정
const repeatTypes: { value: RepeatType; label: string }[] = [
  { value: "yearly", label: "매년" },
  { value: "monthly", label: "매월" },
  { value: "daily", label: "매일" },
]

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  start_date: z.date({
    required_error: "시작일을 선택해주세요.",
  }),
  end_date: z.date({
    required_error: "종료일을 선택해주세요.",
  }),
  event_type: z.enum(["anniversary", "daily", "party", "work", "holiday", "reminder", "custom"]),
  is_repeat: z.boolean().default(false),
  repeat_type: z.enum(["none", "yearly", "monthly", "daily"]).optional(),
  repeat_until: z.date().optional().nullable(),
  details: z.array(
    z.object({
      ID: z.number().optional(),
      title: z.string().min(1, "제목을 입력해주세요."),
      description: z.string().min(1, "설명을 입력해주세요."),
      start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "올바른 시간 형식이 아닙니다."),
      end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "올바른 시간 형식이 아닙니다."),
    }),
  ),
})

type UpdateSchedulePageProps = {
	params: Promise<{
		id: string
	}>
}

const UpdateSchedulePage = ({ params }: UpdateSchedulePageProps) => {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
	const [deleteScheduleDetails, setDeleteScheduleDetails] = useState<number[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: new Date(),
      end_date: new Date(),
      event_type: "daily",
      is_repeat: false,
      repeat_type: "none",
      repeat_until: null,
      details: [],
    },
  })

  useEffect(() => {
		handleGetSchedule()
  }, [])

	const handleGetSchedule = async () => {
		const { id } = await params;

		const res = await GetScheduleByID({ scheduleID: Number(id) })
		if (res.error) {
			Swal.fire({
				icon: "error",
				title: "일정 조회에 실패했습니다.",
				text: res.message,
			})
			return
		}

		const schedule = res.data.schedule

		form.setValue("title", schedule.title)
		form.setValue("description", schedule.description)
		form.setValue("start_date", new Date(schedule.start_date))
		form.setValue("end_date", new Date(schedule.end_date))
		form.setValue("event_type", schedule.event_type)
		form.setValue("is_repeat", schedule.repeat_type ? true : false)
		form.setValue("repeat_type", schedule.repeat_type)
		form.setValue("repeat_until", schedule.repeat_until ? new Date(schedule.repeat_until) : null)
		form.setValue("details", schedule.details)

		setLoading(false)
	}

  const isRepeat = form.watch("is_repeat")
  const details = form.watch("details")

  const addDetail = () => {
    const currentDetails = form.getValues("details")
    form.setValue("details", [
      ...currentDetails,
      {
        title: "",
        description: "",
        start_time: "09:00",
        end_time: "10:00",
      },
    ])
  }

  const removeDetail = (detailID: number | undefined, index: number) => {
    const currentDetails = form.getValues("details")
    form.setValue(
      "details",
      currentDetails.filter((_, i) => i !== index),
    )

		if (detailID) {
			setDeleteScheduleDetails([...deleteScheduleDetails, detailID])
		}
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.start_date > values.end_date) {
      form.setError("end_date", {
        type: "manual",
        message: "종료일은 시작일보다 이후여야 합니다.",
      })
      return
    }

    // 각 상세 일정의 시간 검증
    for (const detail of values.details) {
      const startTime = parse(detail.start_time, "HH:mm", new Date())
      const endTime = parse(detail.end_time, "HH:mm", new Date())

      if (startTime >= endTime) {
        Swal.fire({
          icon: "error",
          title: "시간 설정 오류",
          text: "종료 시간은 시작 시간보다 이후여야 합니다.",
        })
        return
      }
    }

    setIsSubmitting(true)

		const { id } = await params;
		let { title, description, start_date, end_date, event_type, repeat_type, repeat_until, is_repeat } = values;
		repeat_type = is_repeat ? values.repeat_type : "none";
		repeat_until = is_repeat ? values.end_date : null;

		console.table({ id, title, description, start_date, end_date, event_type, repeat_type, repeat_until, is_repeat });
		const newDetails = values.details.filter((detail) => !detail.ID);
		const updatedDetails = values.details.filter((detail) => detail.ID);

		console.log({ newDetails, updatedDetails, deleteScheduleDetails });
  }

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">일정 수정</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input placeholder="일정 제목을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea placeholder="일정에 대한 설명을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>시작일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: ko }) : <span>날짜를 선택하세요</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>종료일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: ko }) : <span>날짜를 선택하세요</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>일정 유형</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="일정 유형을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_repeat"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">반복 일정</FormLabel>
                  <FormDescription>이 일정을 반복 일정으로 설정합니다</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {isRepeat && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="repeat_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>반복 주기</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="반복 주기를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {repeatTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">상세 일정</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addDetail}>
                <Plus className="h-4 w-4 mr-2" />
                상세 일정 추가
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {details.map((detail, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">상세 일정 #{index + 1}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDetail(detail.ID, index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`details.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>제목</FormLabel>
                              <FormControl>
                                <Input placeholder="상세 일정 제목" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`details.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>설명</FormLabel>
                              <FormControl>
                                <Textarea placeholder="상세 일정 설명" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`details.${index}.start_time`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>시작 시간</FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <Input type="time" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`details.${index}.end_time`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>종료 시간</FormLabel>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <Input type="time" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            일정 수정
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateSchedulePage;
