"use client"

import React from "react"
import Swal from "sweetalert2"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { UpdateDiary, GetDiaryByID } from "@/lib/api/diary"
import { Emotion, DiaryImages } from "@/types/diary"

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  emotion: z.enum(["None", "HAPPY", "SAD", "ANGRY", "EXCITED", "NEUTRAL"]).optional(),
  diary_date: z.date({
    required_error: "날짜를 선택해주세요.",
  }),
  new_images: z.array(z.instanceof(File)).optional(),
})

const emotionOptions: { value: Emotion; label: string }[] = [
  { value: "None", label: "없음" },
  { value: "HAPPY", label: "행복" },
  { value: "SAD", label: "슬픔" },
  { value: "ANGRY", label: "화남" },
  { value: "EXCITED", label: "신남" },
  { value: "NEUTRAL", label: "보통" },
]

const UpdateDiaryPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [existingImages, setExistingImages] = React.useState<DiaryImages[]>([])
  const [imagesToDelete, setImagesToDelete] = React.useState<number[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      diary_date: new Date(),
      new_images: [],
    },
  })

	React.useEffect(() => {
		handleGetDiary()
	}, [])

	const handleGetDiary = async () => {
		const { id } = await params

		const res = await GetDiaryByID({ diaryID: +id })
		if (res.error) {
			Swal.fire("다이어리 조회 실패", res.message, "error")
			router.back()
			return
		}
		const { diary } = res.data
		form.setValue("title", diary.title)
		form.setValue("content", diary.content)
		form.setValue("emotion", diary.emotion)
		form.setValue("diary_date", new Date(diary.diary_date))
		setExistingImages(diary.images)
	}

  const handleChangeInput = React.useCallback(
    (name: "title" | "content") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      form.setValue(name, e.target.value)
    },
    [form],
  )

  const handleChangeImage = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        form.setValue("new_images", Array.from(files))
      }
    },
    [form],
  )

  const handleDeleteExistingImage = async (imageId: number) => {
		const confirm = await Swal.fire({
			title: "이미지 삭제",
			text: "이미지를 삭제하시겠습니까?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
		})
		if (!confirm.isConfirmed) {
			return
		}

    setImagesToDelete((prev) => [...prev, imageId])
    setExistingImages((prev) => prev.filter((img) => img.ID !== imageId))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

		const { id } = await params
		const { title, content, emotion, diary_date, new_images } = values

		const res = await UpdateDiary({title, content, emotion, diary_date, new_images, deleteImages: imagesToDelete, diaryID: +id})
		if (res.error) {
			Swal.fire({
				title: "다이어리 수정 실패",
				text: res.error,
				icon: "error",
			})
			return
		}
		await Swal.fire({
			title: "다이어리 수정 성공",
			icon: "success",
		})
		router.push("/dashboard/diary")
		return
	}

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">다이어리 수정</h1>
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
          <FormItem>
            <FormLabel>기존 이미지</FormLabel>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>미리보기</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingImages.map((image) => (
                  <TableRow key={image.ID}>
                    <TableCell>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.image_url}`}
                        alt={image.diary_id.toString()}
                        className="w-20 h-20 object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteExistingImage(image.ID)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FormItem>
          <FormField
            control={form.control}
            name="new_images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새 이미지 추가</FormLabel>
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
                <FormDescription>다이어리에 첨부할 새 이미지를 선택해주세요. (여러 장 선택 가능)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            다이어리 수정
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UpdateDiaryPage

