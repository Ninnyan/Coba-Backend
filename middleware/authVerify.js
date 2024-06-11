const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {Activity, Role} = require('../models')
const { body } = require('express-validator');
dotenv.config();

const authVerify = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer")[1].trim();
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        message: "Token tidak boleh kosong",
      });
    }
    jwt.verify(token, process.env.PRIVATE_KEY, async (err, data) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {

          const decodeToken = jwt.decode(token)

          if (decodeToken && decodeToken.id) {
            const updateActivity = await Activity.update({
              logoutAt: new Date().toISOString(),
              token: null
            },{
              where: {
                id_user: decodeToken.id
              }
            })
            return res.status(401).json({
              status: 'Fail',
              message: 'Token Expired'
            });
          }
          
        }
        return res.status(403).json({
          status: 'Fail',
          message: 'Token Invalid'
        });
      }
      const getDataToken = await Activity.findOne({
        where: {
          id_user: data.id
        }
      })
      if(!getDataToken) {
        return res.status(401).json({
          status: "Fail",
          message: "Token Masih belum ada",
        });
      }
      if(token !== getDataToken.token) {
        return res.status(401).json({
          status: "Fail",
          message: "Token Telah logout, silahkan Login Kembali",
        });
      }
        req.id_role = data.id_role;
        req.id_user = data.id
        next();

    });
    
  } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: "Terjadi kesalahan pada server",
      });
  }
};

const checkRole = async (req, res, next, role) => {
  const getIdByNameRole = await Role.findOne({
    where: {
      role
    }
  })
  if (req.id_role == getIdByNameRole.id) {
    next();
  } else {
    return res.status(404).json({
      status: 'Fail',
      message: "Anda tidak diizinkan mengakses halaman ini"
    });
  }
};

const validation = () => ([
  body('email').isEmail().withMessage('Email Tidak Seusai'),
  body('telephone').isMobilePhone('id-ID').withMessage('nomor HP yang dimasukan tidak sesuai dengan pedoman penomoran Indonesia, silahkan sesuaikan kembali')
])

module.exports = { authVerify, checkRole, validation };
