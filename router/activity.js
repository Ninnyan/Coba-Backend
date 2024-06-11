const express = require("express");
const activityController = require("../controller/activityController");
const { checkRole } = require("../middleware/authVerify");
const routeActivity = express.Router()

routeActivity.get('/get-activity',(req,res,next) => checkRole(req,res,next,'Admin'),activityController.getData)


module.exports = routeActivity
