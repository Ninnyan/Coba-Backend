const generateId = require('../middleware/generateId')
const {Order,StockTiket,Wisata,User, Riwayat} = require('../models')
const dotenv = require("dotenv");

dotenv.config();
const orderController = {}

/*
    this is auto generate example, you can continue 

*/
orderController.create = async(req,res) => {
    const id_user = req.id_user
    const idUserByQuery = req.query.idUser
    const id_wisata = req.query.idWisata
    const {qty} = req.body
    try {
        if(id_user != idUserByQuery) {
            return res.status(401).json({
                status: "Fail",
                message: "Anda Tidak Boleh Mengakses Laman User Lain",
              });
        }
        const response = await fetch(`https://api.sandbox.midtrans.com/v2/2/status`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(process.env.SERVER_KEY).toString('base64'),
                'Content-Type': 'application/json'
            }
        });
        const status = await response.json()
        const getIdWisata = await Wisata.findOne({
            where:{
                id: id_wisata
            }
        })
        if(!getIdWisata) {
            return res.status(401).json({
                status: "Fail",
                message: "Id Wisata Tidak Ditemukan",
              });
        }
        const getStockTiketById = await StockTiket.findOne({
            where:{
                id_wisata
            }
        })
        if(!getStockTiketById) {
            return res.status(401).json({
                status: "Fail",
                message: "Stock Tiket Masih kosong",
              });
        }
        if(qty > getStockTiketById.stock_tiket) {
            return res.status(401).json({
                status: "Fail",
                message: `Stock Tiket Hanya [ ${getStockTiketById.stock_tiket} ], Mohon Sesuaikan dengan jumlah Stock Yang ada !`,
              });
        }

        const updateStockTiket = await StockTiket.update(
            {
                stock_tiket: getStockTiketById.stock_tiket - qty,
                updateAt: new Date().toISOString()
            }, {
                where: {
                    id_wisata
                }
            }
        )
   
        const result = await Order.create({
            id_user: idUserByQuery,
            id_wisata,
            tiket: getIdWisata.harga_tiket,
            order_id: generateId(),
            qty,
            total_price: getIdWisata.harga_tiket * qty,
            order_date: new Date().toISOString(),
            status: status.status_message
        });

        
        const cekDataWisataInRiwayat = await Riwayat.findOne({where:{id_wisata:id_wisata}})

        if (!cekDataWisataInRiwayat) {
            const createDataInRiwayat = await Riwayat.create(
                {
                    id_wisata: id_wisata,
                    total: 0
                }
            )
        }

        return res.status(201).json({
            status: "Ok",
            message: "Order Telah Berhasil"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

orderController.getData = async(req,res) => {
    const id_user = req.id_user
    const idUserByQuery = req.query.idUser
    try {

        const getIdUserFromOrder = await Order.findAll({where:{id_user:idUserByQuery}})
        if(getIdUserFromOrder.length === 0) {
            return res.status(401).json({
                status: "Fail",
                message: "id_user tidak ditemukan",
            });
        }
        const getDataUser = await User.findAll({where:{id:getIdUserFromOrder[0].id_user}})
        const getDataWisata = await Wisata.findAll({where:{id:getIdUserFromOrder[0].id_wisata}})

        const result = {
            status: "Ok",
            message: "Data Berhasil Dimuat",
            data: getDataUser.map((user) => ({
                id: user.id,
                id_role: user.id_role,
                nama: user.nama,
                email: user.email,
                gender: user.gender,
                telephone: user.telephone,
                Orders: getIdUserFromOrder.map((order) => ({
                    id_user: order.id_user,
                    id_wisata: order.id_wisata,
                    order_id: order.order_id,
                    tiket: order.tiket,
                    qty: order.qty,
                    total_price: order.total_price,
                    order_date: order.order_date,
                    status: order.status,
                    expiredDate: order.expiredDate,
                    Wisata: getDataWisata.map((wisata) => ({
                        id: wisata.id,
                        name: wisata.name,
                        id_province: wisata.id_province,
                        harga_tiket: wisata.harga_tiket,
                        formatted_address: wisata.formatted_address,
                        photos_1: 0,
                        photos_2: 1,
                        photos_3: 2,
                    }))
                }))
            }))
        }
        if(!getIdUserFromOrder) {
            return res.status(401).json({
                status: "Fail",
                message: "Id User Tidak Ditemukan",
              });
        }
        return res.status(201).json({
            status: "Ok",
            message: "Data Berhasil Dimuat",
            result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

orderController.delete = async(req,res) => {
    const id_order = req.query.idOrder;
  try {
    const cekOrder = await Order.findOne({
      where: {
        order_id: id_order,
      },
    });
    if (!cekOrder) {
      return res.status(404).json({
        status: "Fail",
        message: "Data tidak ditemukan",
      });
    } 

    if(cekOrder.status === 'settlement') {
        return res.status(404).json({
            status: "Fail",
            message: "Anda Tidak Bisa menghapus Order dengan status [ Settlement / berhasil ]",
        })
    }

    const getStockTiket = await StockTiket.findOne({where:{id_wisata:cekOrder.id_wisata}})
    const deleteOrder = await Order.destroy({
    where: {
        order_id: id_order,
    },
    });
    const updateStockTiket = await StockTiket.update(
        {
            stock_tiket: getStockTiket.stock_tiket + cekOrder.qty
          },
          {
            where: {
              id_wisata: cekOrder.id_wisata
            }
          }
    )
    return res.status(200).json({
        status: 'Ok',
        message: "Data berhasil dihapus",
    });
    
  } catch (error) {
    return res.status(500).json({
        status: 'Fail',
        message: "Terjadi kesalahan pada server",
    });
  }
}

module.exports = orderController

