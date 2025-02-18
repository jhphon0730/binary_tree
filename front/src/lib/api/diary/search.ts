import { FetchWithAuth, Response } from "@/lib/api"

import { Diary } from "@/types/diary"

const getSearchType = (type: string): string => {
	if (type === "TITLE") {
		return "t"
	} else if (type === "CONTENT") {
		return "c"
	} else {
		return "d"
	}
}

const getSearchValueQuery = (type: string): string => {
	if (type === "TITLE") {
		return "title"
	} else if (type === "CONTENT") {
		return "content"
	} else {
		return "diary_date"
	}
}

// 제목을 통해 다이어리를 검색
type SearchDiaryRequest = {
	search_query: {
		type: string;
		value: string;
	}
}
type SearchDiaryResponse = {
	diaries: Diary[]
}
export const SearchDiary = async ({ search_query }: SearchDiaryRequest): Promise<Response<SearchDiaryResponse>> => {
	// GET /diaries/search/:type/:type?=:value
	const res = await FetchWithAuth(`/diaries/search/${getSearchType(search_query.type)}?${getSearchValueQuery(search_query.type)}=${search_query.value}`, {
		method: "GET",
	})
	return {
		data: res.data,
		state: res.state,
		message: res.message,
		error: res.error,
	}
}
