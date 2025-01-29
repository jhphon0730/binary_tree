'use client'

import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

import { AuthForm } from '@/components/auth/AuthForm'

import { RequestSignIn } from '@/lib/api/user'

const SignInPage = () => {
  const router = useRouter()

  const handleSubmit = async (data: Record<string, string>) => {
    const { username, password } = data
    if (!username || !password) {
      Swal.fire({
        icon: 'error',
        title: '모든 항목을 입력해주세요',
        text: '아이디와 비밀번호는 필수입력 항목입니다.',
      })
      return
    }
    const res = await RequestSignIn({ username, password })
    if (res.error) {
      Swal.fire({
        icon: 'error',
        title: '로그인 실패',
        text: res.error || '로그인에 실패했습니다.',
      })
      return
    }
    await Swal.fire({
      icon: 'success',
      title: '로그인 성공',
      text: '로그인에 성공했습니다.',
    }).then(() => {
      localStorage.setItem('token', res.data.token)
      router.push('/')
    })
    return
  }

  return <AuthForm type="login" onSubmitAction={handleSubmit} />
}

export default SignInPage
