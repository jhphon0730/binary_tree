'use client'

import React from 'react';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import AuthForm from '@/components/auth/AuthForm'

import { useAuthStore } from '@/store/authStore'
import { RequestSignIn } from '@/lib/api/user'

const SignInPage = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const handleSubmit = async (data: Record<string, string>, _: File | null): Promise<void> => {
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
    }).then(async () => {
      authStore.setUser(res.data.user)
			Cookies.set('token', res.data.token, {
        expires: 1 / 24,
      })
      router.push('/dashboard')
    })
    return
  }

  return <AuthForm type="login" onSubmitAction={handleSubmit} />
}

export default SignInPage
