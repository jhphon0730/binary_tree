"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import type { Emotion } from "@/types/diary"

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  emotion: z.enum(["HAPPY", "SAD", "ANGRY", "EXCITED", "NEUTRAL"]).optional(),
  diary_date: z.date({
    required_error: "날짜를 선택해주세요.",
  }),
  images: z.array(z.instanceof(File)).optional(),
})

const emotionOptions: { value: Emotion; label: string }[] = [
  { value: "HAPPY", label: "행복" },
  { value: "SAD", label: "슬픔" },
  { value: "ANGRY", label: "화남" },
  { value: "EXCITED", label: "신남" },
  { value: "NEUTRAL", label: "보통" },
]

const NewDiaryPage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      diary_date: new Date(),
    },
  })

  const handleChangeInput = useCallback(
    (name: "title" | "content") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      form.setValue(name, e.target.value)
    },
    [form],
  )

  const handleChangeImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        form.setValue("images", Array.from(files))
      }
    },
    [form],
  )

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
		const formData = new FormData()
		formData.append("title", values.title)
		formData.append("content", values.content)
		formData.append("diary_date", values.diary_date.toISOString())
		if (values.emotion) {
			formData.append("emotion", values.emotion)
		}
		if (values.images) {
			values.images.forEach((image, index) => {
				formData.append("images", image)
			})
		}

		const response = await fetch("http://your-backend-url.com/api/diaries", {
			method: "POST",
			body: formData,
		})

		if (!response.ok) {
			throw new Error("Failed to create diary")
		}

		router.push("/diary")
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">새 다이어리 작성</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input
                    placeholder="다이어리 제목을 입력하세요"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleChangeInput("title")(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>내용</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="오늘 하루는 어땠나요?"
                    className="min-h-[200px]"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleChangeInput("content")(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emotion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>감정</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="오늘의 감정을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emotionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>오늘 하루를 대표하는 감정을 선택해주세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diary_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>날짜</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>날짜를 선택하세요</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이미지</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e)
                      handleChangeImage(e)
                    }}
                  />
                </FormControl>
                <FormDescription>다이어리에 첨부할 이미지를 선택해주세요. (여러 장 선택 가능)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            다이어리 저장
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default NewDiaryPage

