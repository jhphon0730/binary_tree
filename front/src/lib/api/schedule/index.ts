import { FetchWithAuth, Response } from "@/lib/api"

import { CreateScheduleDTO } from "@/types/schedule"

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

