package errors

import "errors"

var (
	ErrInvalidRequest = errors.New("잘못된 요청입니다.")

	// USER
	ErrCannotFindUser        = errors.New("사용자를 찾을 수 없습니다.")
	ErrUserAlreadyExists     = errors.New("이미 존재하는 사용자입니다.")
	ErrAllFieldsRequired     = errors.New("모든 항목을 입력해주세요.")
	ErrEmailAlreadyExists    = errors.New("이미 존재하는 이메일입니다.")
	ErrUsernameAlreadyExists = errors.New("이미 존재하는 아이디입니다.")

	//// Login
	ErrUserNotFound   = errors.New("사용자를 찾을 수 없습니다.")
	ErrGenerateToken  = errors.New("토큰을 발급할 수 없습니다.")
	ErrInternalServer = errors.New("서버 내부 오류가 발생했습니다.")

	//// Invite
	ErrInvalidInviteCode    = errors.New("유효하지 않은 초대 코드입니다.")
	ErrCannotFindInviteUser = errors.New("초대한 사용자를 찾을 수 없습니다.")
	ErrAlreadyCouple        = errors.New("이미 커플이 되어있는 사용자입니다.")
	ErrNotCouple            = errors.New("커플이 존재하지 않습니다.")
	ErrCannotFindPartner    = errors.New("상대방 사용자를 찾을 수 없습니다.")

	// BCRYPT
	ErrBCRYPT_COSTNotSet = errors.New("BCRYPT의 비용이 설정되지 않았습니다.")
	ErrInvalidPassword   = errors.New("비밀번호가 일치하지 않습니다.")

	// DTO
	ErrContainsSpace         = errors.New("공백을 포함할 수 없습니다.")
	ErrorAllFieldsRequired   = errors.New("모든 항목을 입력해주세요.")
	ErrInvalidEmailFormat    = errors.New("이메일 형식이 올바르지 않습니다.")
	ErrInvalidPasswordFormat = errors.New("비밀번호는 최소 8자, 대소문자, 숫자를 포함해야 합니다.")
	ErrInvalidUsernameFormat = errors.New("사용자 이름은 최소 3자 이상이어야 합니다.")

	// JWT
	ErrInvalidToken = errors.New("올바르지 않은 토큰입니다.")
	ErrExpiredToken = errors.New("토큰이 만료되었습니다.")

	// REDIS
	ErrFailedToConnectRedis = errors.New("Redis에 연결할 수 없습니다.")
	ErrFailedToSetRedis     = errors.New("Redis에 저장할 수 없습니다.")
	ErrFailedToDeleteRedis  = errors.New("Redis에서 삭제할 수 없습니다.")
	ErrFailedToGetRedis     = errors.New("Redis에서 가져올 수 없습니다.")
	ErrSessionNotFound      = errors.New("세션이 존재하지 않습니다.")

	// FILE
	ErrFailedToUploadProfileImage = errors.New("프로필 이미지를 업로드할 수 없습니다.")

	// COUPLE
	ERRCannotCreateCouple      = errors.New("커플로 등록할 수 없습니다.")
	ErrCannotInviteSelf        = errors.New("자기 자신을 초대할 수 없습니다.")
	ErrCannotFindCouple        = errors.New("커플을 찾을 수 없습니다.")
	ErrInvalidSharedNoteFormat = errors.New("공유 메모 형식이 올바르지 않습니다.")

	// DIARY
	ErrDiaryTitleIsRequired     = errors.New("제목을 입력해주세요.")
	ErrDiaryContentIsRequired   = errors.New("내용을 입력해주세요.")
	ErrInvalidImageType				  = errors.New("jpg, jpeg, png 파일만 허용됩니다.")
	ErrFailedToUploadDiaryImage = errors.New("다이어리 이미지를 업로드할 수 없습니다.")
	ErrCannotFindCoupleID			  = errors.New("커플을 찾을 수 없습니다.")
	ErrInvalidCoupleID					= errors.New("유효하지 않은 커플 ID입니다.")
	ErrCannotSaveLatestDiary		= errors.New("최신 다이어리를 저장할 수 없습니다.")
	ErrDiaryNotFound						= errors.New("다이어리를 찾을 수 없습니다.")
	ErrCannotGetLatestDiary			= errors.New("최신 다이어리를 가져올 수 없습니다.")
	ErrCannotFindCategory				= errors.New("카테고리를 찾을 수 없습니다.")
	ErrInvalidCategory					= errors.New("유효하지 않은 카테고리입니다.")
	ErrCannotFindDiares					= errors.New("다이어리를 찾을 수 없습니다.")
	ErrCannotFindDiaryID				= errors.New("다이어리를 찾을 수 없습니다.")
	ErrInvalidDiaryID						= errors.New("유효하지 않은 다이어리 ID입니다.")
	ErrFailedToDeleteDiaryImage = errors.New("다이어리 이미지를 삭제할 수 없습니다.")
	ErrInvalidDeleteImages			= errors.New("삭제할 이미지를 찾을 수 없습니다.")
	ErrCannotDeleteDiary				= errors.New("다이어리 작성자가 아니면 다이어리 삭제가 불가능합니다.")
	ErrCannotFindTitle					= errors.New("제목을 찾을 수 없습니다.")
	ErrCannotFindContent				= errors.New("내용을 찾을 수 없습니다.")
	ErrCannotFindDiaryDate			= errors.New("작성 날짜를 찾을 수 없습니다.")

	// Schedule
	ErrCannotFindSchedules 				= errors.New("일정을 찾을 수 없습니다.")
	ErrCannotFindSchedule  				= errors.New("일정을 찾을 수 없습니다.")
	ErrCannotFindScheduleDB  			= errors.New("저장된 일정을 찾을 수 없습니다.")
	ErrCannotDeleteSchedule 			= errors.New("일정을 삭제할 수 없습니다.")
	ErrCannotDeleteScheduleDetail = errors.New("일정 상세를 삭제할 수 없습니다.")
	ErrCannotFindScheduleID 			= errors.New("일정을 찾을 수 없습니다.")
	ErrIsNotScheduleOwner 				= errors.New("일정 작성자가 아니면 일정 삭제가 불가능합니다.")
	ErrCannotUpdateScheduleDetail = errors.New("일정 상세를 업데이트할 수 없습니다.")
	ErrCannotCreateScheduleDetail = errors.New("일정 상세를 생성할 수 없습니다.")
	ErrCannotUpdateSchedule				= errors.New("일정을 업데이트할 수 없습니다.")
)
