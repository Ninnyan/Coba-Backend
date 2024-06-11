const express = require("express");
const adminController = require("../controller/adminController");
const { validation } = require("../middleware/authVerify");
const routeAdmin = express.Router()


routeAdmin.post('/admin/register',validation(),adminController.register)
routeAdmin.post('/admin/login',adminController.login)
routeAdmin.post('/logout',adminController.logout)
routeAdmin.put('/update-admin',adminController.update)
routeAdmin.get('/get-data-admin',adminController.getOne)


module.exports = routeAdmin
