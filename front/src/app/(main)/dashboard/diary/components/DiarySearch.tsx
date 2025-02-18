"use client";

import React from 'react';
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

import { DiarySearchType } from "@/types/diary";

const DiarySearch = () => {
	const router = useRouter();

	const [isOpen, setIsOpen] = React.useState<boolean>(false)
	const [searchType, setSearchType] = React.useState<DiarySearchType>("TITLE")
	const [searchValue, setSearchValue] = React.useState<string | Date>("")


	const handleChangeDialog = () => {
		setIsOpen(() => !isOpen)
	}

	const handleChangeSearchType = (searchType: DiarySearchType) => {
		setSearchType(() => searchType)
		setSearchValue(() => "")
	}

	const handleChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(() => e.target.value)
	}

	const handleSearch = () => {
		if (!searchValue) {
			Swal.fire({
				icon: "error",
				title: "검색어를 입력해주세요",
				timer: 1000,
			})
			return
		}
		if (searchType === "DIARYDATE") {
			const date = new Date(searchValue as string)
			const year = date.getFullYear()
			const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
			const day = date.getDate()
			const formattedDate = `${year}-${month}-${day}`
			router.push(`/dashboard/diary/search?searchType=${searchType}&searchValue=${formattedDate}`)
		} else {
			router.push(`/dashboard/diary/search?searchType=${searchType}&searchValue=${searchValue}`)
		}

		setIsOpen(() => false)
		setSearchType(() => "TITLE")
		setSearchValue(() => "")
	}

	return (
		<div className="w-full flex justify-end">
			<Button onClick={handleChangeDialog} variant="outline" className="w-full sm:w-auto">
				검색
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>다이어리 검색</DialogTitle>
					</DialogHeader>
					<div className="grid gap-2 grid-cols-1">
						{/* 검색 옵션 Trigger */}
						<Select value={searchType} onValueChange={handleChangeSearchType}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="다이어리 검색 옵션" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="TITLE">제목</SelectItem>
								<SelectItem value="CONTENT">내용</SelectItem>
								<SelectItem value="DIARYDATE">작성 기준일</SelectItem>
							</SelectContent>
						</Select>
						<div className="grid gap-2 md:grid-cols-2 grid-cols-1">
							{/* 검색 옵션에 맞는 UI */}
							{searchType === "TITLE" && (
								<Input placeholder="다이어리 제목을 입력해주세요" onChange={handleChangeSearchValue} />
							)}
							{searchType === "CONTENT" && (
								<Input placeholder="다이어리 내용을 입력해주세요" onChange={handleChangeSearchValue} />
							)}
							{searchType === "DIARYDATE" && (
								<Calendar 
									mode="single"
									selected={searchValue as Date}
									onSelect={(date) => setSearchValue(date as Date)}
									disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
								/>
							)}
							<Button onClick={handleSearch}>검색</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DiarySearch;
