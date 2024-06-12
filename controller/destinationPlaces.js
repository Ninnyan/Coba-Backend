const destinationPlaces = {}
const dotenv = require("dotenv")
const {Provinsi, Wisata, Order, Riwayat, sequelize} = require('../models')
const path = require('path')
dotenv.config()

const API_KEY = process.env.API_MAP_KEY;  // Ganti dengan API key Anda



/*
    this is auto generate example, you can continue 

*/
destinationPlaces.province = async(req,res) => {
    try {
      const dataWisata = await Wisata.findAll({
        include: [{
          model: Provinsi,
          attributes: {
            exclude: ["id","createdAt", "updatedAt"]
          }
        },],
        attributes: {
          exclude: ["deskripsi", "place_id","jam_operasional", "formatted_address","photos_2","photos_3","createdAt", "updatedAt"]
        }
      }, 
        
      )

      const mappingData = dataWisata.map((data) => ({
        img: 1,
        name: data.name,
        price: `Rp. ${data.harga_tiket}`,
        category: data.Provinsi.name
      }))

      
      return res.status(201).json({
        status: "Ok",
        message: "Data Berhasil Dimuat",
        result: mappingData
      });
  } catch (error) {
    console.log(error);
      return res.status(500).json({
        status: 'Fail',
        message: "Terjadi kesalahan pada server",
    });
  }
}

destinationPlaces.detail = async(req,res) => {
  const id = req.query.idWisata
  try {
    const dataDetail = await Wisata.findOne({
      where: {
        id: id
      }
    })

    if(!dataDetail) {
      return res.status(400).json({
        status: "Fail",
        message: "Data Tidak Ditemukan",
      });
    }
    const mappingData =     {
      id: dataDetail.id,
      name: dataDetail.name,
      place_id: dataDetail.place_id,
      deskripsi: dataDetail.deskripsi,
      address: dataDetail.formatted_address,
      harga_tiket: dataDetail.harga_tiket,
      jam_operasional: dataDetail.jam_operasional,
      photos_1: 0,
      photos_2: 1,
      photos_3: 2
    }
    return res.status(201).json({
      status: "Ok",
      message: "Data Berhasil Dimuat",
      result: mappingData
    });
  } catch (error) {
      return res.status(500).json({
        status: 'Fail',
        message: "Terjadi kesalahan pada server",
      });
  }
}

destinationPlaces.getPhoto = async(req,res) => {
  const id = req.query.idWisata
  const photoReference = req.query.photoReference
  try {
    const getPhotoById = await Wisata.findOne({
      where: {
        id: id
      }
    })
    if(!getPhotoById) {
      return res.status(400).json({
        status: "Fail",
        message: "Data Tidak Ditemukan",
      });
    }
    const getPhotoByReference = Array(getPhotoById.photos_1,getPhotoById.photos_2,getPhotoById.photos_3)
    
    if(getPhotoByReference[photoReference] === undefined) {
      return res.status(400).json({
        status: "Fail",
        message: "Data Tidak Ditemukan",
      });
    }

    const filepath = path.join(__dirname, '../assets/photoWisata', getPhotoByReference[photoReference])

    res.set('Content-Type', 'image/jpeg');
    return res.status(201).sendFile(filepath);
  } catch (error) {
      return res.status(500).json({
        status: 'Fail',
        message: "Terjadi kesalahan pada server",
      });
  }
}

destinationPlaces.recomendation = async(req,res) => {
  try {
    const getRiwayat = await Riwayat.findAll({
      order: [sequelize.literal('total')]
    })
    if(getRiwayat.length == 0) {
      return res.status(400).json({
        status: "Fail",
        message: "Tidak ada pembayaran yang berhasil",
      });
    }
    const arrayId = getRiwayat.map((riwayat) => riwayat.id_wisata)
    const getDataWisataById = await Wisata.findAll({where: {id: arrayId}})
    const mappinWisata = getDataWisataById.map((data) => (
      {
        id: data.id,
        name: data.name,
        place_id: data.place_id,
        deskripsi: data.deskripsi,
        address: data.formatted_address,
        harga_tiket: data.harga_tiket,
        jam_operasional: data.jam_operasional,
        photos_1: 0,
        photos_2: 1,
        photos_3: 2
      }
    ))
    return res.status(201).json({
      status: "Ok",
      message: "Data Berhasil Dimuat",
      result: mappinWisata
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        status: 'Fail',
        message: "Terjadi kesalahan pada server",
      });
  }
}

destinationPlaces.getMap = async(req,res) => {
  const placeId = req.query.place_id
  try {
    const findPlaceId = await Wisata.findOne({where: {place_id: placeId}})
    if(!findPlaceId) {
      return res.status(400).json({
        status: "Fail",
        message: "Place Id Tidak Sesuai",
      });
    }
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${findPlaceId.place_id}&key=${process.env.API_MAP_KEY}`

    const response = await fetch(url)
    const data = await response.json()
    return res.status(201).json({
      status: "Ok",
      message: "Data Berhasil Dimuat",
      result: data.result.url
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Fail',
      message: "Terjadi kesalahan pada server",
    });
  }
}

module.exports = destinationPlaces

