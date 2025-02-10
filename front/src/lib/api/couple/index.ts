import { FetchWithAuth, Response } from "@/lib/api"
import { Couple } from "@/types/couple";

// 대시보드 페이지 구정에 필요한 데이터 조회
type GetCoupleInfoResponse = {
	coupleInfo: Couple;
}
export const GetCoupleInfo = async (): Promise<Response<GetCoupleInfoResponse>> => {
	const res = await FetchWithAuth("/couples/info", {
		method: "GET",
		cache: "no-cache",
	})
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}

// 커플 공유 노트 수정 함수
type UpdateSharedNoteRequest = {
	shared_note: string;
}
type UpdateSharedNoteResponse = { }
export const UpdateSharedNote = async (updateProps: UpdateSharedNoteRequest): Promise<Response<UpdateSharedNoteResponse>> => {
	const res = await FetchWithAuth("/couples/info/shared-note", {
		method: "PATCH",
		body: JSON.stringify(updateProps),
	})
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}

// 커플 연애 시작일 수정 함수
type UpdateStartDateRequest = {
	start_date: string;
}
type UpdateStartDateResponse = { }
export const UpdateStartDate = async (updateProps: UpdateStartDateRequest): Promise<Response<UpdateStartDateResponse>> => {
	const res = await FetchWithAuth("/couples/info/start-date", {
		method: "PATCH",
		body: JSON.stringify(updateProps),
	})
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}
