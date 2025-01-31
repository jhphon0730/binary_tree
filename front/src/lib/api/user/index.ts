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
export const RequestSignIn = async (signInProps: SignInRequest): Promise<Response<SignInResponse>> => {
  const res = await FetchWithOutAuth('/users/sign-in', {
    method: 'POST',
    body: JSON.stringify({ ...signInProps }),
  })
  return {
    data: res.data,
    state: res.state,
    message: res.message,
    error: res.error,
  }
}

type SignUpRequest = {
  username: string;
  name: string;
  email: string;
  password: string;
}
type SignUpResponse = {
	user: User; // But this is not used in the code
}
export const RequestSignUp = async (signUpProps: SignUpRequest): Promise<Response<SignUpResponse>> => {
	const res = await FetchWithOutAuth('/users/sign-up', {
		method: 'POST',
		body: JSON.stringify({ ...signUpProps }),
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
