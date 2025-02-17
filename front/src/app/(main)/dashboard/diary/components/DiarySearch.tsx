"use client";

import React from 'react';

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
import { Input } from "@/components/ui/input"

import { DiarySearchType } from "@/types/diary";

const DiarySearch = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false)
	const [searchType, setSearchType] = React.useState<DiarySearchType>("TITLE")

	const handleChangeDialogOpen = () => {
		setIsOpen(() => !isOpen)
	}

	const handleChangeSearchType = (searchType: DiarySearchType) => {
		setSearchType(() => searchType)
	}

	return (
		<div className="w-full flex justify-end">
			<Button onClick={handleChangeDialogOpen} variant="outline" className="w-full sm:w-auto">
				검색
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>다이어리 검색</DialogTitle>
					</DialogHeader>
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

					{/* 검색 옵션에 맞는 UI */}
					{searchType === "TITLE" && (
						<Input placeholder="다이어리 제목을 입력해주세요" />
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DiarySearch;
