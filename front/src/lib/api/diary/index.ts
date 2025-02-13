import { FetchWithAuth, Response } from "@/lib/api"

import { Diary } from "@/types/diary"

// 커플이 서로 가장 마지막에 작성한 다이어리를 가져옴
type GetLatestDiaryRequest = {
	coupleID: number
}
type GetLatestDiaryResponse = {
	latest_diary: Diary
}
export const GetLatestDiary = async ({coupleID}: GetLatestDiaryRequest): Promise<Response<GetLatestDiaryResponse>> => {
	const res = await FetchWithAuth(`/diaries/latest?coupleID=${coupleID}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
