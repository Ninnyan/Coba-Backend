const {Role,User} = require('../models')
const roleController = {}

/*
    this is auto generate example, you can continue 

*/
roleController.getAll = async(req,res) => {
    try {
        const getRole = await Role.findAll({
          order: [["createdAt", "DESC"]],
          include: [{
            model: User,
            attributes: {
                exclude: ["password","passwordSalt"]
            }
          }]
        });
        return res.status(200).json({
          status: 'Ok',
          data: getRole,
        });
      } catch (error) {
        return res.status(500).json({
          status: 'Fail',
          message: "Terjadi kesalahan pada server",
        });
      } 
}

roleController.create = async(req,res) => {
    const {role} = req.body
    try {
        const cekRole = await Role.findOne({
            where: {
              role,
            },
          });
      
          if (!role) {
            return res.status(400).json({
              status: 'Fail',
              message: "Gagal menambahkan role. Mohon isi role",
            });
          }
          if (cekRole) {
            return res.status(400).json({
              status: 'Fail',
              message: "Data sudah terdaftar",
            });
          } else {
            const createRole = await Role.create({
              role: role,
            });
            return res.status(201).json({
              status: "OK",
              message: "Data Berhasil dibuat",
            });
          }
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
          });
    }
}

module.exports = roleController

