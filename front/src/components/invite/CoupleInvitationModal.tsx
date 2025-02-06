import React from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { RequestGenerateInviteCode } from '@/lib/api/invite';

type CoupleInvitationModalProps = { };

const CoupleInvitationModal = () => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [mode, setMode] = React.useState<'generate' | 'enter'>('generate');
	const [invitationCode, setInvitationCode] = React.useState<string>('');
	const [enterdCode, setEnteredCode] = React.useState<string>('');

	const handleClose = () => {
		setIsOpen(() => false);
	}

	const handleGenerateCode = async (): Promise<void> => {
		const res = await RequestGenerateInviteCode({});
		if (res.error) {
			Swal.fire({
				icon: 'error',
				title: '초대 코드 생성 실패',
				text: res.message,
			});
			return
		}
		setInvitationCode(() => res.data.inviteCode);
	}

	const handleSubmitCode = () => {

	}

	React.useEffect(() => {
		setIsOpen(() => true);
	}, []);


	return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader >
          <DialogTitle>커플 연결</DialogTitle>
          <DialogDescription>앱을 사용하기 위해서는 상대방과 커플로 연결되어야 합니다.</DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          {mode === "generate" ? (
            <div className="space-y-4">
              <Button onClick={handleGenerateCode} className="w-full">
                초대 코드 생성하기
              </Button>
              {invitationCode && (
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-2">생성된 초대 코드:</p>
                  <p className="text-lg font-bold">{invitationCode}</p>
                </div>
              )}
              <div className="text-center">
                <Button variant="link" onClick={() => setMode("enter")}>
                  초대 코드 입력하기
                </Button>
								<Button variant="link">
									로그아웃
								</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="초대 코드를 입력하세요"
                value={enterdCode}
                onChange={(e) => setEnteredCode(e.target.value)}
              />
              <Button onClick={handleSubmitCode} className="w-full">
                코드 제출하기
              </Button>
              <div className="text-center">
                <Button variant="link" onClick={() => setMode("generate")}>
                  초대 코드 생성하기
                </Button>
								<Button variant="link">
									로그아웃
								</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
	);
};

export default CoupleInvitationModal;
