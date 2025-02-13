import { FetchWithAuth, Response } from "@/lib/api"

/** 초대 코드 생성, 기존 초대 코드가 있으면 기존 초대 코드를 반환 */
type GenerateInviteCodeRequest = {
	token: string;
}
type GenerateInviteCodeResponse = {
	inviteCode: string;
}
export const RequestGenerateInviteCode = async ({token}: GenerateInviteCodeRequest): Promise<Response<GenerateInviteCodeResponse>> => {
  const res = await FetchWithAuth('/users/invite-generate', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
    method: 'POST',
  })
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}

/** 초대 코드 입력 후 제출 */
type AcceptInvitationRequest = {
	token: string;
	inviteCode: string;
}
type AcceptInvitationResponse = { }
export const RequestAcceptInvitation = async ({token, inviteCode}: AcceptInvitationRequest): Promise<Response<AcceptInvitationResponse>> => {
	const res = await FetchWithAuth(`/users/invite-accept?inviteCode=${inviteCode}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		method: "PUT",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

/** 현재 내가 커플이 있는 지 확인 */
type GetMyCoupleStatusRequest = {
	token: string;
}
type GetMyCoupleStatusResponse = {
	status: string;
}
export const RequestGetMyCoupleStatus = async ({token}: GetMyCoupleStatusRequest): Promise<Response<GetMyCoupleStatusResponse>> => {
	const res = await FetchWithAuth('/users/invite-couple-status', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
