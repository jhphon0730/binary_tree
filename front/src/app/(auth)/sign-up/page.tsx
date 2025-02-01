'use client'

import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

import { AuthForm } from '@/components/auth/AuthForm';

import { RequestSignUp } from '@/lib/api/user';

const SignupPage = () => {
  const router = useRouter()

  const handleSubmit = async (data: Record<string, string>): Promise<void> => {
		const { username, password, email, name } = data;
		if (!username || !password || !email || !name) {
			Swal.fire({
				icon: 'error',
				title: '모든 항목을 입력해주세요',
				text: '아이디와 비밀번호는 필수입력 항목입니다.',
			})
			return
		}
		const res = await RequestSignUp({ username, password, email, name })
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '회원가입 실패',
				text: res.error || '회원가입에 실패했습니다.',
			})
			return
		}
		await Swal.fire({
			icon: 'success',
			title: '회원가입 성공',
			text: '회원가입에 성공했습니다.',
		}).then(() => {
			router.push('/sign-in')
		})
  }

  return <AuthForm type="signup" onSubmitAction={handleSubmit} />
}

export default SignupPage;
