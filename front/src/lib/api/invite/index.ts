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
