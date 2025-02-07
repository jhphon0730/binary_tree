package controller

import (
	"binary_tree/internal/controller/service"
)

type CoupleController interface {
}

type coupleController struct {
	coupleService service.CoupleService
}

func NewCoupleController(coupleService service.CoupleService) CoupleController {
	return &coupleController{
		coupleService: coupleService,
	}
}
