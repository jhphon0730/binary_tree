'use client'

import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

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
    const a = await RequestSignIn({ username, password })
    console.log(a)
  }

  return <AuthForm type="login" onSubmitAction={handleSubmit} />
}

export default SignInPage
