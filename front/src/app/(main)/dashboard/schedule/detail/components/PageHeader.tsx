"use client";

import React from 'react';
import Link from "next/link"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Schedule } from "@/types/schedule";
import { DeleteSchedule } from "@/lib/api/schedule";

type PageHeaderProps = {
	schedule: Schedule
}

const PageHeader = ({ schedule }: PageHeaderProps) => {
	const router = useRouter()

	const handleDeleteSchedule = async () => {
		const confirm = await Swal.fire({
			title: "정말로 삭제하시겠습니까?",
			text: "삭제된 데이터는 복구할 수 없습니다.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "삭제",
			cancelButtonText: "취소",
		})
		if (!confirm.isConfirmed) { return }

		const DeleteScheduleResponse = await DeleteSchedule({ scheduleID: schedule.ID })
		if (DeleteScheduleResponse.error) {
			Swal.fire({
				title: "삭제 실패",
				text: DeleteScheduleResponse.error,
				icon: "error",
			})
			return
		}
		await Swal.fire({
			title: "삭제 성공",
			icon: "success",
		})

		router.push("/dashboard/schedule")
	}

	return (
		<div className="flex justify-between items-center">
			<h1 className="text-3xl font-bold">{schedule.title}</h1>
			<div className="space-x-2">
				<Link href={`/dashboard/schedule/update/${schedule.ID}`}>
					<Button variant="outline">
						<Pencil className="h-4 w-4 mr-2" />
						수정
					</Button>
				</Link>
				<Link href="">
					<Button variant="destructive" onClick={handleDeleteSchedule}>
						<Trash2 className="h-4 w-4 mr-2" />
						삭제
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default PageHeader;
