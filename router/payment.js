const express = require("express");
const paymentController = require("../controller/paymentController");
const { checkRole } = require("../middleware/authVerify");
const routePayment = express.Router()


routePayment.post('/pay',(req,res,next) => checkRole(req,res,next,"User"),paymentController.payment)


module.exports = routePayment
