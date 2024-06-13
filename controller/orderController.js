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
    const qty = req.body.qty
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
            message: "Order Telah Berhasil",
            result: qty,
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
        if (id_user !== idUserByQuery) {
            return res.status(401).json({
                status: "Fail",
                message: "id_user tidak match",
            });
        }
        const getIdUserFromOrder = await Order.findAll({
            include: [{
                model: Wisata,
                attributes: {
                    exclude: ["id","tiket","order_date","expiredDate","createdAt", "updatedAt"]
                  }
            }],
            attributes: {
                exclude: ['id_province', 'place_id', 'deskripsi','harga_tiket','jam_operasional','fotmatted_address','photos_1', 'photos_2']
            }
        }, {
            where: {
                id_user: idUserByQuery
            }
        })
        if(getIdUserFromOrder.length === 0) {
            return res.status(401).json({
                status: "Fail",
                message: "id_user tidak ditemukan",
            });
        }
        if(!getIdUserFromOrder) {
            return res.status(401).json({
                status: "Fail",
                message: "Id User Tidak Ditemukan",
              });
        }

        const result = getIdUserFromOrder.map((order) => ({
            order_id: order.order_id,
            qty: order.qty,
            total: order.total_price,
            status: order.status,
            nama: order.Wisatum.name,
            address: order.Wisatum.formatted_address,
            img: 1,
            id_wisata: order.id_wisata
        }))

        
  
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

