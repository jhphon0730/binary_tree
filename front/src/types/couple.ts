import { User } from '@/types/user';

export type Couple = {
	ID: number;
	user1_id: number;
	user2_id: number;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string;
	User1: User;
	User2: User;
	start_date: string;
	shared_note: string;
	UniqueIndex: string;
}
