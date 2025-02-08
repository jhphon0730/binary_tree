package dto

type UpdateSharedNoteDTO struct {
	SharedNote string `form:"shared_note"`
}

func (dto *UpdateSharedNoteDTO) Validate() error {
	return nil
}
