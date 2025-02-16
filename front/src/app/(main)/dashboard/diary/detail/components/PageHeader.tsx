"use client";

import React from "react"
import Link from "next/link"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Diary } from "@/types/diary"
import { DeleteDiary } from "@/lib/api/diary";

type PageHeaderProps = {
	diary: Diary
}

const PageHeader = ({ diary}: PageHeaderProps) => {
	const router = useRouter()

	const handleDeleteDiary = async () => {
		const confirm = await Swal.fire({
			title: "정말로 삭제하시겠습니까?",
			text: "삭제된 데이터는 복구할 수 없습니다.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
		})
		if (!confirm.isConfirmed) { return }

		const deleteDiaryResponse = await DeleteDiary({ diaryID: diary.ID })
		if (deleteDiaryResponse.error) {
			Swal.fire({
				title: "삭제 실패",
				text: deleteDiaryResponse.error,
				icon: "error",
			})
			return
		}
		await Swal.fire({
			title: "삭제 성공",
			icon: "success",
		})

		router.push("/dashboard/diary")
	}

	return (
		<div className="flex justify-between items-center">
			<h1 className="text-3xl font-bold">{diary.title}</h1>
			<div className="space-x-2">
				<Link href={`/dashboard/diary/update/${diary.ID}`}>
					<Button variant="outline">
						<Pencil className="mr-2 h-4 w-4" />
						수정
					</Button>
				</Link>
				<Link href="">
					<Button variant="destructive" onClick={handleDeleteDiary}>
						<Trash2 className="mr-2 h-4 w-4" />
						삭제
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default PageHeader;
