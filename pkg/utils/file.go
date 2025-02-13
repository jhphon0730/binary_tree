package utils

import (
	"binary_tree/internal/errors"

	"io"
	"os"
	"path/filepath"
	"mime/multipart"
)

func SaveUploadedFile(file *multipart.FileHeader, dst string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	if err = os.MkdirAll(filepath.Dir(dst), 0750); err != nil {
		return err
	}

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, src)
	return err
}

func UploadProfileImage(profileImageFile *multipart.FileHeader) (string, error) {
	parentPath := "media/user_profile_images/" + profileImageFile.Filename
	if err := SaveUploadedFile(profileImageFile, parentPath); err != nil {
		return "", errors.ErrFailedToUploadProfileImage
	}
	return parentPath, nil
}

func UploadDiaryImage(diaryImageFile *multipart.FileHeader) (string, error) {
	parentPath := "media/diary_images/" + diaryImageFile.Filename
	if err := SaveUploadedFile(diaryImageFile, parentPath); err != nil {
		return "", errors.ErrFailedToUploadDiaryImage
	}
	return parentPath, nil
}
