const express = require("express");
const stockTiketController = require("../controller/stockTiketController");
const { checkRole } = require("../middleware/authVerify");
const routeStockTiket = express.Router()


routeStockTiket.post('/add-stock-tiket',(req,res,next) => checkRole(req,res,next,'Admin'),stockTiketController.create)
routeStockTiket.put('/edit-stock-tiket',(req,res,next) => checkRole(req,res,next,'Admin'),stockTiketController.update)
routeStockTiket.delete('/delete-stock-tiket',(req,res,next) => checkRole(req,res,next,'Admin'),stockTiketController.delete)
routeStockTiket.get('/get-data',(req,res,next) => checkRole(req,res,next,'Admin'),stockTiketController.getAll)


module.exports = routeStockTiket
