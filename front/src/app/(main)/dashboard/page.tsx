"use client"

import React from 'react';

import CoupleInfoCard from '@/app/(main)/dashboard/components/CoupleInfoCard';
import SharedMemoCard from '@/app/(main)/dashboard/components/SharedMemoCard';

export default function DashboardMainPage() {

	// TODO : 백엔드 연결 ( 가져오기 및 업데이트 )
	const handleUpdateCoupleInfo = async () => { }

	// TODO : 백엔드 연결 ( 가져오기 및 업데이트 )
	const handleUpdateMemo = async (message: string) => { }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<CoupleInfoCard
					startDate={null}
					handleUpdateCoupleInfo={handleUpdateCoupleInfo}
				/>

				<SharedMemoCard
					sharedMessage="안녕하세요"
					handleUpdateMemo={handleUpdateMemo}
				/>
      </div>
    </div>
  )
}

