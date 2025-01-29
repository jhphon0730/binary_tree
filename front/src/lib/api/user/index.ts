import { FetchWithOutAuth, Response } from "@/lib/api"
import { User } from '@/types/user'

type SignInRequest = {
  username: string;
  password: string;
}
type SignInResponse = {
  token: string;
  user: User;
}
export const RequestSignIn = async ({username, password}: SignInRequest): Promise<Response<SignInResponse>> => {
  const res = await FetchWithOutAuth('/users/sign-in', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}