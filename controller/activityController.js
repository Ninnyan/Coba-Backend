
const { User, Activity, Role } = require("../models");
const activityController = {}

/*
    this is auto generate example, you can continue 

*/
activityController.getData = async(req,res) => {
    try {
        const id_role = req.id_role
        const getIdRole = await Role.findOne({where:{role: 'User'}})
        const dataActivity = await User.findAll({
          include: [{
            model: Activity,
            attributes: {
                exclude: ['createdAt', 'updatedAt', ]
            }
          }],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'passwordSalt']
        },
          where: {
            id_role: getIdRole.id
          }
        })


        const mapping = dataActivity.map((user) => ({
          nama: user.nama,
          email: user.email,
          noTelpon: user.telephone,
          jenisKelamin: user.gender,
          tanggal: user.Activities[0].loginAt,
          aktifitas: user.Activities[0].token ? 'Login': 'Logout'
        }))


        return res.status(201).json({
          status: "Ok",
          message: "Data Berhasil Dimuat",
          result: mapping
        });
    } catch (error) {
      console.log(error);
        return res.status(500).json({
          status: 'Fail',
        message: "Terjadi kesalahan pada server",
      });
    }
}

module.exports = activityController

