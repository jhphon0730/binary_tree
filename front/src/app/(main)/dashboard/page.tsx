import React from 'react';

import CoupleInfoCard from '@/app/(main)/dashboard/components/CoupleInfoCard';
import SharedMemoCard from '@/app/(main)/dashboard/components/SharedMemoCard';
import LatestDiaryCard from '@/app/(main)/dashboard/components/LatestDiaryCard';
import Container from '@/components/Container';
import SSRError from '@/components/SSRError';

import { GetLatestDiary } from '@/lib/api/diary';
import { GetCoupleInfo } from '@/lib/api/couple';

const DashboardMainPage = async () => {
	const coupleInfoResponse = await GetCoupleInfo();
	if (coupleInfoResponse.error || !coupleInfoResponse.data) {
		return (<SSRError error={coupleInfoResponse.error || coupleInfoResponse.message} />);
	}

	const latestDiary = await GetLatestDiary({coupleID: coupleInfoResponse.data.coupleInfo.ID});
	if (latestDiary.error || !latestDiary.data) {
		return (<SSRError error={latestDiary.error || latestDiary.message} />);
	}

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* 상대 커플의 정보 및 연애 시작일 */}
				<CoupleInfoCard
					startDate={coupleInfoResponse.data.coupleInfo.start_date}
				/>

				{/* 상대 커플과 공유하는 메모 하나 */}
				<SharedMemoCard
					sharedMessage={coupleInfoResponse.data.coupleInfo.shared_note}
				/>

				{/* 커플이 서로 작성한 최근 일기 */}
				<LatestDiaryCard
					latestDiary={latestDiary.data.latest_diary}
				/>
      </div>
    </Container>
  )
}

export default DashboardMainPage;
