import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import SSRError from "@/components/SSRError"

import { GetDiaryByID } from "@/lib/api/diary";
import { Diary, Emotion } from "@/types/diary"

const emotionOptions: { value: Emotion; label: string }[] = [
  { value: "None", label: "없음" },
  { value: "HAPPY", label: "행복" },
  { value: "SAD", label: "슬픔" },
  { value: "ANGRY", label: "화남" },
  { value: "EXCITED", label: "신남" },
  { value: "NEUTRAL", label: "보통" },
]

const DiaryDetailPage = async ({ params }: { params: { id: string } }) => {
	const diaryDetailResponse = await GetDiaryByID({diaryID: +params.id})
	if (diaryDetailResponse.error || !diaryDetailResponse.data) {
		return <SSRError error={diaryDetailResponse.error || diaryDetailResponse.message} />
	}

	const diary: Diary = diaryDetailResponse.data.diary

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{diary.title}</h1>
        <div className="space-x-2">
					<Link href={`/dashboard/diary/update/${diary.ID}`}>
						<Button variant="outline">
							<Pencil className="mr-2 h-4 w-4" />
							수정
						</Button>
					</Link>
					<Link href="">
						<Button variant="destructive">
							<Trash2 className="mr-2 h-4 w-4" />
							삭제
						</Button>
					</Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>다이어리 내용</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(diary.diary_date), "PPP")}</span>
						{diary.emotion && (
							<div className="text-sm font-medium">
								{emotionOptions.find((e) => e.value === diary.emotion)?.label || diary.emotion}
							</div>
						)}
          </div>
          <p className="whitespace-pre-wrap">{diary.content}</p>
        </CardContent>
      </Card>

      {diary.images && diary.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>이미지</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-lg mx-auto">
              <CarouselContent>
                {diary.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.image_url}`}
                        alt={`Diary image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DiaryDetailPage

