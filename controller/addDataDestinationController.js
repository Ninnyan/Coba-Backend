
const {Wisata, Provinsi, StockTiket, Order, Riwayat} = require('../models');
const dotenv = require("dotenv")
dotenv.config()

const addDataDestinationController = {}



addDataDestinationController.province = async(req,res) => {
    try {
        const result = await Provinsi.create({
            name: req.body.name
        });
        return res.status(201).json({
            status: "Ok",
            message: "Data Provinsi Berhasil Ditambahakan"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

addDataDestinationController.wisata = async(req,res) => {
    const apiKey = process.env.API_MAP_KEY;
    const {name,
        deskripsi,
        harga_tiket,
        jam_operasional,
        provinsi,
    } = req.body
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
    const photos = req.files
    try {
        const response = await fetch(url)
        const data = await response.json()
        const cekProvinsiId = await Provinsi.findOne({
            where: {
                name: provinsi
            }
        })
        const cekPlaceId = await Wisata.findOne({
            where: {
                place_id: data.candidates[0].place_id
            }
        })

        if(!cekProvinsiId) {
            return res.status(400).json({
                status: "Fail",
                message: "Provinsi Tidak Ditemukan",
              });
        }
        const fields = [
            "name",
            "deskripsi",
            "harga_tiket",
            "jam_operasional",
            "provinsi",
        ];
        const filterFields = fields.filter((f) => !req.body[f]);
        if (filterFields.length) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
              status: "Fail",
              message: `Mohon lengkapi data ${filterFields.join(",")}`,
            });
        }
        if (cekPlaceId) {
            return res.status(400).json({
            status: "Fail",
            message: "Place_id sudah terdaftar",
            });
        }
        const result = await Wisata.create({
            name,
            id_province: cekProvinsiId.id,
            place_id: data.candidates[0].place_id,
            deskripsi,
            harga_tiket,
            jam_operasional,
            formatted_address: data.candidates[0].formatted_address,
            photos_1: photos[0].buffer,
            photos_2: photos[1].buffer,
            photos_3: photos[2].buffer
        });
        return res.status(201).json({
            status: "Ok",
            message: "Data Wisata Berhasil Ditambahakan"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

addDataDestinationController.editWisata = async(req,res) => {
    const apiKey = process.env.API_MAP_KEY;
    const getId = req.query.idWisata
    const {name,
        deskripsi,
        harga_tiket,
        jam_operasional,
        provinsi,
    } = req.body
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
    const photos = req.files
    try {
        const response = await fetch(url)
        const data = await response.json()

        const cekProvinsiId = await Provinsi.findOne({
            where: {
                name: provinsi
            }
        })
        const cekPlaceId = await Wisata.findOne({
            where: {
                id: getId
            }
        })

        if(!cekProvinsiId) {
            return res.status(400).json({
                status: "Fail",
                message: "Provinsi Tidak Ditemukan",
              });
        }
        const fields = [
            "name",
            "deskripsi",
            "harga_tiket",
            "jam_operasional",
            "provinsi",
        ];
        const filterFields = fields.filter((f) => !req.body[f]);
        if (filterFields.length) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
              status: "Fail",
              message: `Mohon lengkapi data ${filterFields.join(",")}`,
            });
        }
        if (cekPlaceId) {
            return res.status(400).json({
            status: "Fail",
            message: "Place_id sudah terdaftar",
            });
        }
        const result = await Wisata.update({
            name,
            id_province: cekProvinsiId.id,
            place_id: data.candidates[0].place_id,
            deskripsi,
            harga_tiket,
            jam_operasional,
            formatted_address: data.candidates[0].formatted_address,
            photos_1: photos[0].buffer,
            photos_2: photos[1].buffer,
            photos_3: photos[2].buffer
        }, {
            where: {
                id: getId
            }
        });
        return res.status(201).json({
            status: "Ok",
            message: "Data Wisata Berhasil Diperbarui"
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

addDataDestinationController.delete = async(req,res) => {
    const idWisata = req.query.idWisata
    try {

        const getDataWisataById = await Wisata.findOne({where:{id:idWisata}})
        if(!getDataWisataById) {
            return res.status(401).json({
                status: "Fail",
                message: "Id Wsiata tidak ada diDatabase",
            });
        }
        const deleteStockTiket = await StockTiket.destroy({where:{id_wisata:idWisata}})
        const deleteOrderTiket = await Order.destroy({where:{id_wisata:idWisata}})
        const deleteRiwayat = await Riwayat.destroy({where: {id_wisata:idWisata}})
        const deleteDataWisataById = await Wisata.destroy({where:{id:idWisata}})
        return res.status(201).json({
            status: "Ok",
            message: "Data Wisata Berhasil Dihapus"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
    }
}

module.exports = addDataDestinationController

