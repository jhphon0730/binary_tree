'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type AuthFormProps = {
  type: 'login' | 'signup'
  onSubmitAction: (data: Record<string, string>, file: File | null) => void
}

const formFields = {
  login: ['username', 'password'],
  signup: ['username', 'name', 'email', 'password']
}

const fieldLabels: Record<string, string> = {
  username: '아이디',
  name: '이름',
  email: '이메일',
  password: '비밀번호'
}

const AuthForm =({ type, onSubmitAction }: AuthFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

	const handleChangeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target 
		if (files && files.length > 0) {
			setProfileImageFile(files[0])
		} else {
			setProfileImageFile(null)
		}
	}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitAction(formData, profileImageFile)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {type === 'login' ? '로그인' : '회원가입'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {
              type === 'login' && (
                formFields.login.map(field => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{fieldLabels[field]}</Label>
                    <Input
                      id={field}
                      name={field}
                      type={field === 'password' ? 'password' : 'text'}
                      placeholder={`${fieldLabels[field]}를 입력해주세요`}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))
              )
            }

            {
              type === 'signup' && (
                formFields.signup.map(field => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{fieldLabels[field]}</Label>
                    <Input
                      id={field}
                      name={field}
                      type={field === 'password' ? 'password' : 'text'}
                      placeholder={`${fieldLabels[field]}를 입력해주세요`}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))
              )
            }
						{
							type === 'signup' && (
								<div className="space-y-2">
									<Label htmlFor="profileImage">프로필 이미지</Label>
									<Input
										id="profileImage"
										name="profileImage"
										type="file"
										accept="image/*"
										onChange={handleChangeProfileImage}
									/>
								</div>
							)
						}
          </div>
          <Button type="submit" className="w-full mt-6">
            {type === 'login' ? '로그인' : '회원가입'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        {type === 'login' ? (
          <p>계정이 없으신가요? <Link href="/sign-up" className="text-blue-600 hover:underline">회원가입</Link></p>
        ) : (
          <p>이미 계정이 있으신가요? <Link href="/sign-in" className="text-blue-600 hover:underline">로그인</Link></p>
        )}
      </CardFooter>
    </Card>
  )
}

export default AuthForm
