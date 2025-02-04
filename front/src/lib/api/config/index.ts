import { FetchWithAuth, Response } from "@/lib/api"

// 로그인 세션이 유효한지 확인
type CheckIsValidSessionResponse = {}
export const CheckIsValidSession = async (): Promise<Response<CheckIsValidSessionResponse>> => {
	const res = await FetchWithAuth("/users/validate-token", {
		method: "GET",
	})
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}
