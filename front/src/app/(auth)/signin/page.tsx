'use client'

import { useRouter } from 'next/navigation'
import Sweet from 'sweetalert2'

import { AuthForm } from '@/components/auth/AuthForm'

import { FetchWithOutAuth } from '@/lib/api'

const SignInPage = () => {
  const router = useRouter()

  const handleSubmit = async (data: Record<string, string>) => {
    const { username, password } = data
    if (!username || !password) {
      Sweet.fire({
        icon: 'error',
        title: '모든 항목을 입력해주세요',
        text: '아이디와 비밀번호는 필수입력 항목입니다.',
      })
      return
    }
    await FetchWithOutAuth<null>('/users/sign-in', {
      body: JSON.stringify({ username, password }),
      method: 'POST',
    })
  }

  return <AuthForm type="login" onSubmitAction={handleSubmit} />
}

export default SignInPage
