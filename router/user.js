const express = require("express");
const userController = require("../controller/userController");
const { checkRole, validation } = require("../middleware/authVerify");
const routeUser = express.Router()


routeUser.post('/user/register',validation(),userController.register)
routeUser.post('/user/login',userController.login)
routeUser.post('/logout',userController.logout)
routeUser.put('/update-user',userController.update)
routeUser.get('/get-data-user',userController.getOne)



module.exports = routeUser
