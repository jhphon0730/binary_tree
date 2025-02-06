'use client';

import React from 'react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import CoupleInvitationModal from '@/components/invite/CoupleInvitationModal';

import { RequestGenerateInviteCode } from '@/lib/api/invite';

const CoupleInvitationPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [invitationCode, setInvitationCode] = React.useState<string>('');

	const handleOpenModal = () => {
		setIsOpen(true);
	}

	const handleCloseModal = () => {
		setIsOpen(false);
	}

	const handleGenerateCode = async (): Promise<void> => {
		const token = searchParams.get('token');
		if (token === null) {
			Swal.fire({
				icon: 'error',
				title: '초대 코드 생성 실패',
				text: '로그인 정보가 없습니다. 다시 로그인해주세요.',
			});
			return
		}
		const res = await RequestGenerateInviteCode({token});
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '초대 코드 생성 실패',
				text: res.error,
			});
			return
		}
		setInvitationCode(() => res.data.inviteCode);
	}

	// 초대 코드 입력 이후 제출 하기 버튼을 눌렀을 때
	const handleSubmitEnterdCode = async (code: string): Promise<void> => {

	}

	return (
    <div>
      <h1 className="text-2xl font-bold mb-4">커플 연결</h1>
      <p className="mb-4">
        앱을 사용하기 위해서는 상대방과 커플로 연결되어야 합니다. 아래 버튼을 클릭하여 연결을 시작하세요.
      </p>
      <Button onClick={handleOpenModal}>커플 연결 시작하기</Button>
      <CoupleInvitationModal
				isOpen={isOpen}
				invitationCode={invitationCode}
				handleClose={handleCloseModal}
				handleGenerateCode={handleGenerateCode}
				handleSubmitEnterdCode={handleSubmitEnterdCode}
			/>
    </div>
	);
};

export default CoupleInvitationPage;
