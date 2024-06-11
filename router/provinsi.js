const express = require("express");
const addDataDestinationController = require("../controller/addDataDestinationController");
const destinationPlaces = require("../controller/destinationPlaces");
const { checkRole } = require("../middleware/authVerify");
const routeProvinsi = express.Router();

routeProvinsi.post('/add-province',(req,res,next) => checkRole(req,res,next, 'Admin'),addDataDestinationController.province)
routeProvinsi.get('/province',(req,res,next) => checkRole(req,res,next, 'Admin'),destinationPlaces.province)
routeProvinsi.get('/detail',(req,res,next) => checkRole(req,res,next, 'Admin'),destinationPlaces.detail)
routeProvinsi.get('/photo',(req,res,next) => checkRole(req,res,next, 'Admin'),destinationPlaces.getPhoto)
routeProvinsi.get('/recomendation',(req,res,next) => checkRole(req,res,next, 'Admin'),destinationPlaces.recomendation)
routeProvinsi.get('/get-map',(req,res,next) => checkRole(req,res,next, 'Admin'),destinationPlaces.getMap)




module.exports = routeProvinsi