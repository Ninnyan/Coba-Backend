const { User, Activity, Role } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const fs = require("fs");
const userController = {};

dotenv.config();

userController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({
      where: { email },
    });
    const getIdByNameRole = await Role.findOne({
      where: {
        role: 'User'
      }
    })
    if(findUser.id_role !== getIdByNameRole.id) {
      return res.status(400).json({
        status: "Fail",
        message: "Login Ini hanya untuk User",
      });
    }
    if (!email || !password) {
      return res.status(400).json({
        status: "Fail",
        message: "Email dan Paswword tidak boleh kosong",
      });
    }
    if (!findUser) {
      return res.status(401).json({
        status: "Fail",
        message: "Gagal Login, Password dan Email salah",
      });
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);

    if (!comparePassword) {
      return res.status(401).json({
        status: "Fail",
        message: "Gagal Login, Password salah",
      });
    }
    const payloadToken = {
      id: findUser.id,
      id_role: findUser.id_role,
      name: findUser.name,
      email: findUser.email,
      gender: findUser.gender,
      telephone: findUser.telephone,
    };
    const token = jwt.sign(payloadToken, process.env.PRIVATE_KEY, {
      algorithm: "HS256",
      expiresIn: "10h",
    });
    const getStatusUser = await Activity.findOne({
      where: {
        id_user: findUser.id
      }
    })
    if(getStatusUser) {
      const logOutActivity = await Activity.update(
        {
          loginAt: new Date().toISOString(),
          logoutAt: null,
          token
        },
        {
          where: {
            id_user: findUser.id
          }
        }
      )
      return res.status(200).json({
        data: {
          status: "Ok",
          message: "Berhasil Login",
          id_user: findUser.id,
          token: token
        },
      });

    }
    const logInActivity = await Activity.create({
      id_user: findUser.id,
      loginAt: new Date().toISOString(),
      token
    })
    return res.status(200).json({
      data: {
        status: "Ok",
        message: "Berhasil Login",
        id_user: findUser.id,
        token: token
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      data: {
        message: "Gagal Login, Terjadi kesalahan pada server",
      },
    });
  }
};

userController.register = async (req, res) => {
  try {
    const { nama, email, password, gender, telephone } =
      req.body;
    const cekEmail = await User.findOne({ where: { email: email } });
    if (cekEmail) {
      return res.status(400).json({
        status: "Fail",
        message: "Email sudah terdaftar",
      });
    }
    const fields = [
      "nama",
      "email",
      "password",
      "gender",
      "telephone",
    ];
    const filterFields = fields.filter((f) => !req.body[f]);
    if (filterFields.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "Fail",
        message: `Mohon lengkapi data ${filterFields.join(",")}`,
      });
    }
    
    const saltRounds = 10;
    const generateSalt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, generateSalt);
    const getIdRole = await Role.findOne({where:{role: 'User'}})
    const createUser = await User.create({
      nama:nama,
      email: email,
      gender: gender,
      password: hashPassword,
      passwordSalt: generateSalt,
      telephone: telephone,
      id_role: getIdRole.id,
    });
    return res.status(201).json({
      status: "Ok",
      message: "User berhasil dibuat",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: "Terjadi kesalahan pada server",
    });
  }
};

userController.update = async (req, res) => {
  const idUser = req.query.idUser
  try {
    const { nama, email, password, gender, telephone } =
      req.body;
    const cekUser = await User.findOne({ where: { id: idUser } });
    const getIdRole = await Role.findOne({where:{role: 'User'}})

    if (!cekUser) {
      return res.status(400).json({
        status: "Fail",
        message: "Tidak Ada daftar user yang sesuai",
      });
    }
    const fields = [
      "nama",
      "email",
      "password",
      "gender",
      "telephone",
    ];
    const filterFields = fields.filter((f) => !req.body[f]);
    if (filterFields.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: "Fail",
        message: `Mohon lengkapi data ${filterFields.join(",")}`,
      });
    }
    
    const saltRounds = 10;
    const generateSalt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, generateSalt);

    const createUser = await User.update({
      nama: nama,
      email: email,
      gender: gender,
      password: hashPassword,
      passwordSalt: generateSalt,
      telephone: telephone,
      id_role: getIdRole.id,
    },{
      where: {
        id: idUser
      }
    });
    return res.status(201).json({
      status: "Ok",
      message: "User berhasil diperbaruhi",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Fail",
      message: "Terjadi kesalahan pada server",
    });
  }
};

userController.getOne = async (req, res) => {
  const idUser = req.query.idUser
  try {
    const getUser = await User.findOne({
      where: {id: idUser},
      order: [["createdAt", "DESC"]],
      attributes: {exclude: ['password', 'passwordSalt']}
    });
    return res.status(200).json({
      status: 'Ok',
      message: 'Data berhasil dimuat',
      data: getUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Fail",
      message: "Terjadi kesalahan pada server",
    });
  }
};


// userController.delete = async (req, res) => {
//   const id_user = req.id_user;
//   try {
//     const cekUser = await User.findOne({ where: { id: id_user } });
//     if (!cekUser) {
//       return res.status(404).json({
//         message: "Data tidak ditemukan",
//       });
//     } else {
//       const deleteUser = await User.destroy({
//         where: {
//           id: id_user,
//         },
//       });
//       return res.status(201).json({
//         message: "User berhasil dihapus",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: "Terjadi kesalahan pada server",
//     });
//   }
// };

userController.logout = async (req, res) => {
  try {
    const id_user = req.id_user;
    const findUser = await User.findOne({
      where: { id: id_user },
    });
    const payloadToken = {
      id: findUser.id,
      id_role: findUser.id_role,
      name: findUser.name,
      email: findUser.email,
      gender: findUser.gender,
      telephone: findUser.telephone,
    };
    const token = jwt.sign(payloadToken, process.env.PRIVATE_KEY, {
      algorithm: "HS256",
      expiresIn: 1,
    });
    const getTokenInActivity = await Activity.findOne({
      where: {
        id_user: findUser.id
      }
    })
    if(!getTokenInActivity.token) {
      return res.status(401).json({
        status: "Fail",
        message: `Anda Sudah Logout, Silahkan Login kembali`,
      });
    }
    const logOutActivity = await Activity.update(
      {
        logoutAt: new Date().toISOString(),
        token: null
      },
      {
        where: {
          id_user: findUser.id
        }
      }
    )
    return res.status(200).json({
      status: "Ok",
      message: "Logout berhasil",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Fail",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = userController;
