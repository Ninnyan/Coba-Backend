const express = require("express");
const addDataDestinationController = require("../controller/addDataDestinationController");
const destinationPlaces = require("../controller/destinationPlaces");
const { checkRole } = require("../middleware/authVerify");
const routeProvinsi = express.Router();

routeProvinsi.post('/add-province',(req,res,next) => checkRole(req,res,next, 'Admin'),addDataDestinationController.province)
routeProvinsi.get('/province',destinationPlaces.province)
routeProvinsi.get('/detail',destinationPlaces.detail)
routeProvinsi.get('/photo',destinationPlaces.getPhoto)
routeProvinsi.get('/recomendation',destinationPlaces.recomendation)
routeProvinsi.get('/get-map', destinationPlaces.getMap)




module.exports = routeProvinsi