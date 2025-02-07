'use client';

import React from 'react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import CoupleInvitationModal from '@/components/invite/CoupleInvitationModal';

import { RequestGenerateInviteCode, RequestAcceptInvitation, RequestGetMyCoupleStatus } from '@/lib/api/invite';

const CoupleInvitationPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [invitationCode, setInvitationCode] = React.useState<string>('');

	React.useEffect(() => {
		const token = searchParams.get('token');
		if (token === null) {
			Swal.fire({
				icon: 'error',
				title: '404',
				text: '로그인 정보가 없습니다. 다시 로그인해주세요.',
			});
			router.push('/sign-in');
			return
		}
		handleCheckCoupleStatus()
	}, [])

	const handleCheckCoupleStatus = async (): Promise<void> => {
		const token = searchParams.get('token');
		if (token === null) { Swal.fire({
				icon: 'error',
				title: '초대 코드 생성 실패',
				text: '로그인 정보가 없습니다. 다시 로그인해주세요.',
			});
			router.push('/sign-in');
			return
		}
		const res = await RequestGetMyCoupleStatus({token});
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '커플 상태 확인 실패',
				text: res.error,
			});
			router.push('/sign-in');
			return
		}
		if (res.data.status == "coupled") {
			Swal.fire({
				icon: 'info',
				title: '커플 상태 확인 성공',
				text: '이미 커플로 연결되어 있습니다.',
			});
			router.push('/sign-in');
			return
		}
	}

	const handleOpenModal = () => {
		setIsOpen(true);
	}

	const handleCloseModal = () => {
		setIsOpen(false);
	}

	const handleGenerateCode = async (): Promise<void> => {
		const token = searchParams.get('token');
		if (token === null) { Swal.fire({
				icon: 'error',
				title: '초대 코드 생성 실패',
				text: '로그인 정보가 없습니다. 다시 로그인해주세요.',
			});
			router.push('/sign-in');
			return
		}
		const res = await RequestGenerateInviteCode({token});
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '초대 코드 생성 실패',
				text: res.error,
			});
			router.push('/sign-in');
			return
		}
		setInvitationCode(() => res.data.inviteCode);
	}

	// 초대 코드 입력 이후 제출 하기 버튼을 눌렀을 때
	const handleSubmitEnterdCode = async (code: string): Promise<void> => {
		if (code.trim().length === 0) {
			Swal.fire({
				icon: 'error',
				title: '초대 코드 입력 실패',
				text: '초대 코드를 입력해주세요.',
			});
			return
		}
		const token = searchParams.get('token');
		if (token === null) { Swal.fire({
				icon: 'error',
				title: '초대 코드 입력 실패',
				text: '로그인 정보가 없습니다. 다시 로그인해주세요.',
			});
			router.push('/sign-in');
			return
		}
		const res = await RequestAcceptInvitation({token, inviteCode: code});
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '초대 코드 입력 실패',
				text: res.error,
			});
			return
		}
		Swal.fire({
			icon: 'success',
			title: '초대 코드 입력 성공',
			text: '커플 연결이 완료되었습니다. 다시 로그인해주세요.',
		});
		router.push('/sign-in');
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
