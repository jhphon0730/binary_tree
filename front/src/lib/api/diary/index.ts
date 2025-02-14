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

/** 다이어리 조회
 * 다이어리의 id를 받아 해당 다이어리를 조회
 */
type GetDiaryByIDRequest = {
	diaryID: number
}
type GetDiaryByIDResponse = {
	diary: Diary
}
export const GetDiaryByID = async ({diaryID}: GetDiaryByIDRequest): Promise<Response<GetDiaryByIDResponse>> => {
	const res = await FetchWithAuth(`/diaries/detail?diaryID=${diaryID}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

/** 다이어리 수정 함수
 * 삭제할 이미지의 경우 id를 배열로 서버에게 보내줌
 */
type UpdateDiaryRequest = {
	diaryID: number;
	title: string;
	content: string;
	diary_date: Date;
	emotion?: string;
	new_images?: File[];
	deleteImages?: number[];
};
type UpdateDiaryResponse = { }
export const UpdateDiary = async (updateDiaryProps: UpdateDiaryRequest): Promise<Response<UpdateDiaryResponse>> => {
	const formData = new FormData()
	formData.append("diaryID", updateDiaryProps.diaryID.toString())
	formData.append("title", updateDiaryProps.title)
	formData.append("content", updateDiaryProps.content)
	formData.append("diary_date", updateDiaryProps.diary_date.toISOString())
	if (updateDiaryProps.emotion) {
		formData.append("emotion", updateDiaryProps.emotion)
	}
	if (updateDiaryProps.new_images) {
		updateDiaryProps.new_images.forEach((image) => {
			formData.append("images", image)
		})
	}
	if (updateDiaryProps.deleteImages) {
		formData.append("delete_images", JSON.stringify(updateDiaryProps.deleteImages))
	}
	const res = await FetchWithAuthFormData(`/diaries/update?diaryID=${updateDiaryProps.diaryID}`, {
		method: "PUT",
		body: formData,
	}) 

	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
