import { FetchWithAuthFormData, FetchWithOutAuth, FetchWithAuth, Response } from "@/lib/api"
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
	profileImageFile: File | null;
}
type SignUpResponse = {
	user: User; // But this is not used in the code
}
export const RequestSignUp = async (signUpProps: SignUpRequest): Promise<Response<SignUpResponse>> => {
	const formData = new FormData()
	formData.append('username', signUpProps.username)
	formData.append('name', signUpProps.name)
	formData.append('email', signUpProps.email)
	formData.append('password', signUpProps.password)
	if (signUpProps.profileImageFile) { formData.append('profile_image_file', signUpProps.profileImageFile) }
	const res = await FetchWithAuthFormData('/users/sign-up', {
		method: 'POST',
		body: formData,
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}

type SignOutResponse = null
type SignOutRequest = null
export const RequestSignOut = async (_: SignOutRequest): Promise<Response<SignOutResponse>> => {
	const res = await FetchWithAuth('/users/sign-out', {
		method: 'POST',
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
