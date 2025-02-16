import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Diary } from "@/types/diary"

type RecentDiariesCardProps = {
  latestDiary: Diary
}

const LatestDiaryCard = ({ latestDiary }: RecentDiariesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
					<p className="text-xl">최근 일기</p>
				</CardTitle>
      </CardHeader>
      <CardContent>
				{ // 최근에 작성한 일기가 없을 경우 다른 문구를 표시
					latestDiary.ID === 0 && (
						<p className="text-sm text-gray-500">최근에 작성한 일기가 없습니다.</p>
					)
				}
				{
					latestDiary.ID !== 0 && (
						<div>
							<p className="text-sm text-gray-500 mb-2">최근에 작성한 일기입니다.</p>
							<p className="font-semibold">{latestDiary.title}</p>
							<p className="text-sm text-gray-500">작성일: {format(new Date(latestDiary.CreatedAt), "PPP", { locale: ko })}</p>
							<p className="text-sm text-gray-500">작성 기준일: {format(new Date(latestDiary.diary_date), "PPP", { locale: ko })}</p>
							<p className="text-sm text-gray-500">이미지: {latestDiary.images ? latestDiary.images.length : 0}개</p>
						</div>
					)
				}
      </CardContent>
      <CardFooter>
        <Button variant="outline">
					<Link href="/dashboard/diary">
						다이어리 목록 보기
					</Link>
				</Button>
      </CardFooter>
    </Card>
  )
}

export default LatestDiaryCard;
