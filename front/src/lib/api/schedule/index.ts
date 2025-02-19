import { FetchWithAuth, Response } from "@/lib/api"

import { Schedule, CreateScheduleDTO, ScheduleViewType } from "@/types/schedule"

/* 캘린더/일정 추가 함수 */
type CreateScheduleRequest = CreateScheduleDTO & { }
type CreateScheduleResponse = { }
export const CreateSchedule = async (createScheduleProps: CreateScheduleRequest): Promise<Response<CreateScheduleResponse>> => {
	const res = await FetchWithAuth("/schedules/", {
		method: "POST",
		body: JSON.stringify({
			...createScheduleProps,
			repeat_type: createScheduleProps.repeat_type === "none" ? "" : createScheduleProps.repeat_type,
		}),
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}


/** 캘린더 목록 조회 함수
 * 사용자가 작성한 다이어리, 커플이 작성한 다이어리, 커플과 사용자가 함께 작성한 다이어리를 모두 조회
 */
type GetSchedulesRequest = {
	ScheduleViewType: ScheduleViewType
}
type GetSchedulesResponse = {
	schedules: Schedule[]
}
export const GetSchedules = async ({ScheduleViewType}: GetSchedulesRequest): Promise<Response<GetSchedulesResponse>> => {
	const res = await FetchWithAuth(`/schedules/?category=${ScheduleViewType.toLowerCase()}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
