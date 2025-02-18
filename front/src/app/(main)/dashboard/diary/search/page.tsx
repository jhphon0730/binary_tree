import React from 'react';
import Swal from 'sweetalert2';
import { redirect } from 'next/navigation'

import SSRError from "@/components/SSRError";
import DiaryTable from "@/app/(main)/dashboard/diary/components/DiaryTable"
import DiarySearch from "@/app/(main)/dashboard/diary/components/DiarySearch"

import type { Diary } from "@/types/diary";
import { SearchDiary } from "@/lib/api/diary/search";

type DiarySearchPageProps = {
	searchParams: Promise<{
		searchType: string;
		searchValue: string;
	}>
};

const DiarySearchPage = async ( { searchParams }: DiarySearchPageProps) => {
	const { searchType, searchValue } = await searchParams;

	if (!searchValue || !searchType) {
		await Swal.fire({
			icon: "error",
			title: "검색 실패",
			text: "검색에 필요한 정보가 부족합니다.",
			timer: 1000,
		});
		redirect("/dashboard/diary");
		return;
	}

	const diaryInfo = await SearchDiary({ search_query: { type: searchType, value: searchValue } });
	if (diaryInfo.error || !diaryInfo.data) {
		return <SSRError error={diaryInfo.error || ""} />;
	}

	const diaries: Diary[] = diaryInfo.data.diaries;

	return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">
					다이어리 검색 결과
				</h1>
      </div>

      <div>
				<DiarySearch />
      </div>

			<div className="space-y-4">
				{ diaries && diaries.length ? (
					<DiaryTable diaries={diaries} />
				) : (
					<div className="text-center text-lg font-bold">
						검색 결과가 없습니다.
					</div>
				)}
			</div>
		</div>
	);
};

export default DiarySearchPage;
