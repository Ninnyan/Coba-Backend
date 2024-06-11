
const { User, Activity } = require("../models");
const activityController = {}

/*
    this is auto generate example, you can continue 

*/
activityController.getData = async(req,res) => {
    try {
        const id_role = req.id_role
        const dataActivity = await User.findAll({
          include: [{
            model: Activity,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'token']
            }
          }],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'passwordSalt']
        },
          where: {
            id_role
          }
        })
        return res.status(201).json({
          status: "Ok",
          message: "Data Berhasil Dimuat",
          result: dataActivity
        });
    } catch (error) {
        return res.status(500).json({
          status: 'Fail',
        message: "Terjadi kesalahan pada server",
      });
    }
}

module.exports = activityController

