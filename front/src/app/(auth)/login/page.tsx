'use client'

import { useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'

const LoginPage = () => {
  const router = useRouter()

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Login attempt with:', data)
    router.push('/')
  }

  return <AuthForm type="login" onSubmit={handleSubmit} />
}

export default LoginPage