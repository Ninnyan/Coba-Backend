const express = require("express");
const addDataDestinationController = require("../controller/addDataDestinationController");
const { checkRole } = require("../middleware/authVerify");
const multer = require('multer');
const routePlaces = express.Router()
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "./assets/photoWisata");
    },
    filename: function (req, file, cb) {
      const date = Date.now();
      cb(null, `${date}-${file.originalname}`);
    },
  });
const upload = multer({ storage: storage });


routePlaces.post('/add-destinasi',(req,res,next) => checkRole(req,res,next, 'Admin'),upload.array('photos', 3),addDataDestinationController.wisata)
routePlaces.put('/edit-destinasi',(req,res,next) => checkRole(req,res,next, 'Admin'),upload.array('photos', 3),addDataDestinationController.editWisata)
routePlaces.delete('/delete-destinasi',(req,res,next) => checkRole(req,res,next, 'Admin'),addDataDestinationController.delete)



module.exports = routePlaces
