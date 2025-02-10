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
