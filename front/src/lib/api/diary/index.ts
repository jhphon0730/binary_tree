import { FetchWithAuth, Response } from "@/lib/api"

import { Diary, DiaryViewType } from "@/types/diary"

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

/** 다이어리 목록을 조회
 * 사용자가 작성한 다이어리, 커플이 작성한 다이어리, 커플과 사용자가 함께 작성한 다이어리를 모두 조회
 */
type GetDiariesRequest = {
	DiaryViewType: DiaryViewType
}
type GetDiariesResponse = {
	diaries: Diary[]
}
export const GetDiaries = async ({DiaryViewType}: GetDiariesRequest): Promise<Response<GetDiariesResponse>> => {
	const res = await FetchWithAuth(`/diaries/all?category=${DiaryViewType}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
