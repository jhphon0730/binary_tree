import React from 'react';
import Swal from 'sweetalert2';
import { redirect } from 'next/navigation'

import DiaryTable from "@/app/(main)/dashboard/diary/components/DiaryTable"

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
		})
		redirect("/dashboard/diary")
		return;
	}

	return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">
					다이어리 검색 결과
				</h1>
      </div>

			<div className="space-y-4">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
				))}
			</div>
		</div>
	);
};

export default DiarySearchPage;
