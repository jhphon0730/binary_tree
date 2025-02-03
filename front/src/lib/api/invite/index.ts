import { FetchWithAuth, Response } from "@/lib/api"

/** 초대 코드 생성, 기존 초대 코드가 있으면 기존 초대 코드를 반환 */
type GenerateInviteCodeRequest = {}
type GenerateInviteCodeResponse = {
	inviteCode: string;
}
export const RequestGenerateInviteCode = async ({}: GenerateInviteCodeRequest): Promise<Response<GenerateInviteCodeResponse>> => {
  const res = await FetchWithAuth('/users/invite-generate', {
    method: 'POST',
  })
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}
