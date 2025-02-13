import { FetchWithAuth, FetchWithAuthFormData, Response } from "@/lib/api"

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
	const res = await FetchWithAuth(`/diaries/all?category=${DiaryViewType.toLowerCase()}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

/** 다이러리 생성 함수
 * formData로 서버에 데이터를 보냄
 */
type CreateDiaryRequest = {
	title: string;
	content: string;
	diary_date: Date;
	emotion?: string;
	images?: File[];
}
type CreateDiaryResponse = { }
export const CreateDiary = async (createDiaryProps: CreateDiaryRequest): Promise<Response<CreateDiaryResponse>> => {
	const formData = new FormData()
	formData.append("title", createDiaryProps.title)
	formData.append("content", createDiaryProps.content)
	formData.append("diary_date", createDiaryProps.diary_date.toISOString())
	if (createDiaryProps.emotion) {
		formData.append("emotion", createDiaryProps.emotion)
	}
	if (createDiaryProps.images) {
		createDiaryProps.images.forEach((image) => {
			formData.append("images", image)
		})
	}
	const res = await FetchWithAuthFormData(`/diaries/new`, {
		method: "POST",
		body: formData,
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
