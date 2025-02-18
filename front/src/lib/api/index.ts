const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface Response<T> {
	data: T,
	state: number,
	message: string,
	error: string | null
}

export const getJWT = async () => {
  if (typeof window !== "undefined") {
    // 클라이언트 사이드
    const Cookies = (await import("js-cookie")).default
    return Cookies.get("token")
  } 

  // 서버 사이드
  const { cookies } = await import("next/headers")
  return (await cookies()).get("token")?.value
}

export interface fetchOptions {
	headers?: {[key: string]: any};
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: string | FormData;
	cache?: 'no-cache' | 'default' | 'reload' | 'force-cache' | 'only-if-cached';
	revalidate?: number;
	dynamic?: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
}

// NO JWT 
export const FetchWithOutAuth = async (url: string, options: fetchOptions = {}) => {
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
export const FetchWithAuth = async (url: string, options: fetchOptions = {}) => {
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

// JWT & FormData
export const FetchWithAuthFormData = async (url: string, options: fetchOptions = {}) => {
  const token = await getJWT()
  const mergeOptions = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  }
  const res = await fetch(`${API_BASE_URL}${url}`, mergeOptions)
  return await res.json()
}
