import React from 'react';

import CoupleInfoCard from '@/app/(main)/dashboard/components/CoupleInfoCard';
import SharedMemoCard from '@/app/(main)/dashboard/components/SharedMemoCard';
import Container from '@/components/Container';
import SSRError from '@/components/SSRError';

import { GetCoupleInfo } from '@/lib/api/couple';

const DashboardMainPage = async () => {
	const coupleInfo = await GetCoupleInfo();

	if (coupleInfo.error || !coupleInfo.data) {
		return (<SSRError error={coupleInfo.error || coupleInfo.message} />);
	}

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* 상대 커플의 정보 및 연애 시작일 */}
				<CoupleInfoCard
					startDate={coupleInfo.data.coupleInfo.start_date}
				/>

				{/* 상대 커플과 공유하는 메모 하나 */}
				<SharedMemoCard
					sharedMessage={coupleInfo.data.coupleInfo.shared_note}
				/>
      </div>
    </Container>
  )
}

export default DashboardMainPage;
