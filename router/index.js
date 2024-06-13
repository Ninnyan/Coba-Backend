const express = require("express");
const routePlaces = require("./places");
const routeProvinsi = require("./provinsi");
const routeRole = require("./role");
const routeUser = require("./user");
const routeAdmin = require("./admin");
const { authVerify, checkRole } = require("../middleware/authVerify");
const routeActivity = require("./activity");
const routeStockTiket = require("./stockTiket");
const routeOrder = require("./order");
const routePayment = require("./payment");
const route = express.Router()



route.use('/places',(req,res,next) => authVerify(req,res,next),routePlaces)
route.use('/provinces',(req,res,next) => authVerify(req,res,next),routeProvinsi)
route.use('/photos',routeProvinsi)
route.use('/map',routeProvinsi)
route.use('/role',routeRole)
route.use('/activity',(req,res,next) => authVerify(req,res,next),routeActivity)
route.use('/stock-tiket',(req,res,next) => authVerify(req,res,next),routeStockTiket)
route.use('/order',(req,res,next) => authVerify(req,res,next),routeOrder)
route.use('/user',(req,res,next) => authVerify(req,res,next),routeUser)
route.use('/admin',(req,res,next) => authVerify(req,res,next),routeAdmin)
route.use('/payment',(req,res,next) => authVerify(req,res,next),routePayment)
route.use('/auth',routeUser)
route.use('/auth-private',routeAdmin)



module.exports = route