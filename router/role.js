const express = require("express");
const roleController = require("../controller/roleController");
const { checkRole } = require("../middleware/authVerify");
const routeRole = express.Router()


routeRole.post('/add-role',roleController.create)
routeRole.get('/get-role',roleController.getAll)


module.exports = routeRole
