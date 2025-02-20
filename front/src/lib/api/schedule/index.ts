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

/** 커플의 캘린더 목록 조회 함수 ( 오늘 날짜에 해당하는 일정 ) */
type GetRedisSchedulesByCoupleIDRequest = { }
type GetRedisSchedulesByCoupleIDResponse = {
	schedules: Schedule[]
}
export const GetRedisSchedulesByCoupleID = async (): Promise<Response<GetRedisSchedulesByCoupleIDResponse>> => {
	const res = await FetchWithAuth("/schedules/redis", {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

/** 커플의 캘린더 목록 조회 함수 ( 오늘 날짜에 해당하는 반복 일정 ) */
type GetRedisRepeatSchedulesByCoupleIDRequest = { }
type GetRedisRepeatSchedulesByCoupleIDResponse = {
	schedules: Schedule[]
}
export const GetRedisRepeatSchedulesByCoupleID = async (): Promise<Response<GetRedisRepeatSchedulesByCoupleIDResponse>> => {
	const res = await FetchWithAuth("/schedules/redis/repeat", {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

/** 캘린더 삭제 함수 */
type DeleteScheduleRequest = { schedule_id: number }
type DeleteScheduleResponse = { }
export const DeleteSchedule = async (deleteScheduleProps: DeleteScheduleRequest): Promise<Response<DeleteScheduleResponse>> => {
	const res = await FetchWithAuth(`/schedules/?scheduleID=${deleteScheduleProps.schedule_id}`, {
		method: "DELETE",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

/** 캘린더 상세 조회 함수 */
type GetScheduleByIDRequest = { schedule_id: number }
type GetScheduleByIDResponse = {
	schedule: Schedule
}
export const GetScheduleByID = async (getScheduleByIDProps: GetScheduleByIDRequest): Promise<Response<GetScheduleByIDResponse>> => {
	const res = await FetchWithAuth(`/schedules/detail?scheduleID=${getScheduleByIDProps.schedule_id}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
