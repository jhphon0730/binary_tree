const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface response<T> {
	data: T,
	state: number,
	message: string,
	error: string | null
}

export const getJWT = async () => {
  let token

  if (typeof window !== "undefined") {
    // 클라이언트 사이드
    token = localStorage.getItem("token")
  } else {
    // 서버 사이드
    const { cookies } = await import("next/headers")
    token = (await cookies()).get("token")
  }
  return token
}

export interface fetchOptions {
	headers?: {[key: string]: any};
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: string | FormData;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
}

// NO JWT 
export const FetchWithOutAuth = async <T>(url: string, options: fetchOptions = {}): Promise<response<T>> => {
  const mergeOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }
  const res = await fetch(`${API_BASE_URL}${url}`, mergeOptions)
  return await res.json()
}

// JWT
export const FetchWithAuth = async <T>(url: string, options: fetchOptions = {}): Promise<response<T>> => {
  const token = await getJWT()
  const mergeOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  }
  const res = await fetch(`${API_BASE_URL}${url}`, mergeOptions)
  return await res.json()
}