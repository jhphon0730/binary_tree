'use client'

import { useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'

export const SignupPage = () => {
  const router = useRouter()

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Signup attempt with:', data)
    router.push('/auth/login')
  }

  return <AuthForm type="signup" onSubmit={handleSubmit} />
}

export default SignupPage;