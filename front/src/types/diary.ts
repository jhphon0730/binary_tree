import { User } from '@/types/user';
import { Couple } from '@/types/couple';

export type Diary = {
	ID: number;

	couple_id: number;
	author_id: number;

	title: string;
	content: string;
	emotion: Emotion;
	diary_date: string; // go- date

  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;

	images: DiaryImages[];

	Author: User;
	Couple: Couple;
}

export type DiaryImages = {
	ID: number;

	diary_id: number;
	image_url: string;

  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
}

export type DiaryViewType = "MY" | "COUPLE" | "ALL"
export type Emotion = "None" | "HAPPY" | "SAD" | "ANGRY" | "EXCITED" | "NEUTRAL"
