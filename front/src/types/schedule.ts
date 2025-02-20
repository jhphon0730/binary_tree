export type EventType = "anniversary" | "daily" | "party" | "work" | "holiday" | "reminder" | "custom"
export type RepeatType = "yearly" | "monthly" | "daily" | "none"

export type CreateScheduleDTO = {
  title: string
  description: string
  start_date: Date
  end_date: Date
  event_type: EventType
  repeat_type?: RepeatType
  repeat_until?: Date | null
}

export type Schedule = CreateScheduleDTO & {
	ID: number;

  couple_id: number
  author_id: number

  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;

	details: ScheduleDetail[]
}

export type ScheduleDetail = {
	ID: number;

	schedule_id: number;

	title: string;
	description: string;
	start_time: string;
	end_time: string;

  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
}

export type ScheduleViewType = "MY" | "COUPLE" | "ALL"
