const {Wisata,StockTiket,User} = require('../models')

const stockTiketController = {}

/*
    this is auto generate example, you can continue 

*/
stockTiketController.create = async(req,res) => {
    const nameWisata = req.query.nameWisata
    const {stock_tiket} = req.body

    try {
        const getIdWisata = await Wisata.findOne({
            where: {
                name: nameWisata
            }
        })
        if(!getIdWisata) {
            return res.status(401).json({
                status: "Fail",
                message: "Nama Wisata tidak ada diDatabase",
              });
        }
        const getIdWisataInStockTiket = await StockTiket.findOne({
            where: {
                id_wisata: getIdWisata.id
            }
        })
        if(getIdWisataInStockTiket) {
            return res.status(401).json({
                status: "Fail",
                message: "Hanya Boleh Menambahkan Satu Stock Tiket Per Wisata",
              });
        }
        const result = await StockTiket.create({
            id_wisata: getIdWisata.id,
            stock_tiket
        });
        return res.status(201).json({
            status: "Ok",
            message: "Stock Tiket Berhasil Ditambahakan"
        });
    } catch (error) {
        return res.status(500).json({
            Status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

stockTiketController.update = async(req,res) => {
    const idWisata = req.query.idWisata
    const stockTiket = req.body.stock_tiket
    try {
        const findWisataByIdInStockTiket = await StockTiket.findOne({where:{id_wisata:idWisata}})

        if(!findWisataByIdInStockTiket) {
            return res.status(401).json({
                status: "Fail",
                message: "Id Wisata tidak ada diDatabase",
              });
        }

        const updateStockByAdmin = await StockTiket.update(
            {
                stock_tiket: findWisataByIdInStockTiket.stock_tiket + stockTiket
            },
            {
                where: {
                    id_wisata: idWisata
                }
            }
        )
        return res.status(201).json({
            status: "Ok",
            message: "Stock Tiket Berhasil Diperbarui"
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

stockTiketController.delete = async(req,res) => {
    const idStockTiket = req.query.idStockTiket
    try {
        const getIdStockTiketById = await StockTiket.findOne({where:{id:idStockTiket}})
        if(!getIdStockTiketById) {
            return res.status(401).json({
                status: "Fail",
                message: "Id Stock Tiket tidak ada diDatabase",
            });
        }

        const deleteStockTiket = await StockTiket.destroy({where:{id:idStockTiket}})
        return res.status(201).json({
            status: "Ok",
            message: "Stock Tiket Berhasil Dihapus"
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

stockTiketController.getAll = async(req,res) => {
    const idAdmin = req.query.idAdmin
    try {
        const cekAdminData = await User.findOne({where:{id:idAdmin}})

        if(!cekAdminData) {
            return res.status(401).json({
                status: "Fail",
                message: "Data Admin tidak ada diDatabase",
            });
        }

        const getAllDataStockTiket = await StockTiket.findAll()
        return res.status(201).json({
            status: "Ok",
            message: "Data Berhaisl Dimuat",
            data: getAllDataStockTiket
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

module.exports = stockTiketController

