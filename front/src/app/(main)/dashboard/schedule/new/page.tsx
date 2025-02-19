"use client"

import React from "react"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import Swal from "sweetalert2"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import { cn } from "@/lib/utils"
import { CreateSchedule } from "@/lib/api/schedule"
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
  { value: "none", label: "반복 안함" },
  { value: "yearly", label: "매년" },
  { value: "monthly", label: "매월" },
  { value: "daily", label: "매일" },
]

// formSchema의 repeat_type 타입 수정
const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
	// default 값 수정
  start_date: z.date({
    required_error: "시작일을 선택해주세요.",
  }).default(() => new Date()),
  end_date: z.date({
    required_error: "종료일을 선택해주세요.",
  }).default(() => new Date()),
  event_type: z.enum(["anniversary", "daily", "party", "work", "holiday", "reminder", "custom"]),
  is_repeat: z.boolean().default(false),
  repeat_type: z.enum(["none", "yearly", "monthly", "daily"]).optional(),
  repeat_until: z.date().optional().nullable(),
})

const NewSchedulePage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // form의 defaultValues 수정
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
    },
  })

  const isRepeat = form.watch("is_repeat")

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.start_date > values.end_date) {
      form.setError("end_date", {
        type: "manual",
        message: "종료일은 시작일보다 이후여야 합니다.",
      })
      return
    }

		// #TODO :  Create 함수 붙여주기...
		const res = await CreateSchedule({
			title: values.title,
			description: values.description,
			start_date: values.start_date,
			end_date: values.end_date,
			event_type: values.event_type,
			repeat_type: values.repeat_type,
			repeat_until: values.repeat_until,
		})
		if (res.error) {
			await Swal.fire({
				icon: "error",
				title: "일정 생성에 실패했습니다.",
				text: res.error
			})
			return
		}

		await Swal.fire({
			icon: "success",
			title: "일정이 생성되었습니다.",
			showConfirmButton: false,
			timer: 1500,
		})

		router.push("/dashboard/schedule")
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">새 일정 만들기</h1>
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
                          {field.value ? format(field.value, "PPP") : <span>날짜를 선택하세요</span>}
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
                          {field.value ? format(field.value, "PPP") : <span>날짜를 선택하세요</span>}
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

              <FormField
                control={form.control}
                name="repeat_until"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>반복 종료일</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>날짜를 선택하세요</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>선택하지 않으면 무기한 반복됩니다</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            일정 생성
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default NewSchedulePage

