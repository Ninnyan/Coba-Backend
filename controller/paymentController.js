const paymentController = {}
const midtransClient = require('midtrans-client');
const {Order, User, Wisata, Riwayat} = require('../models')
const dotenv = require("dotenv");

dotenv.config();
/*
    this is auto generate example, you can continue 

*/
let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction : false,
    serverKey : process.env.SERVER_KEY
});

paymentController.payment = async(req,res) => {
    const id_user = req.id_user
    const id_order = req.query.idOrder
    const idUserFromQuery = req.query.idUser
    try {
        if(id_user !== idUserFromQuery) {
            return res.status(401).json({
                status: "Fail",
                message: "Anda Tidak Boleh Mengakses Laman User Lain",
              });
        }
        const getDataOrderForPayment = await Order.findOne(
            {
                where: { order_id: id_order },
                attributes: {include: ['id']}
            },
        ) 
        const cekDataWisataInRiwayat = await Riwayat.findOne({where:{id_wisata:getDataOrderForPayment.id_wisata}})
        const getDataUserForPayment = await User.findOne({where:{id: idUserFromQuery}})

        let data = {
            "transaction_details": {
                "order_id": getDataOrderForPayment.order_id,
                "gross_amount": getDataOrderForPayment.total_price
            },
            "customer_details": {
                "first_name": getDataUserForPayment.nama,
                "email": getDataUserForPayment.email,
                "gender": getDataUserForPayment.gender,
                "phone": getDataUserForPayment.telephone
            }
        }

        if(getDataOrderForPayment.status == "settlement") {
            const response = await fetch(`https://api.sandbox.midtrans.com/v2/${id_order}/status`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.SERVER_KEY).toString('base64'),
                    'Content-Type': 'application/json'
                }
            });
            const status = await response.json()
            
           
            
            return res.status(400).json({
                status: 'Fail',
                message: "Pembayaran Sudah Berakhir, Silahkan cek Pada Riwayat Transaksi",
            });
        }
        if(getDataOrderForPayment.status == "Transaction doesn't exist.") {
            const tokenPayment = await snap.createTransaction(data)
            const updateStatusPayment = await Order.update(
                {
                    status: 'settlement'
                }, {
                    where: {
                        order_id: id_order
                    }
                }
            )
            const updateDataInRiwayat = await Riwayat.update(
                {
                    total: cekDataWisataInRiwayat.total + getDataOrderForPayment.total_price
                },{
                    where: {
                        id_wisata: getDataOrderForPayment.id_wisata
                    }
                }
            )
            return res.status(200).json({
                status: 'Ok',
                token: tokenPayment.token,
            });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: "Terjadi kesalahan pada server",
        });
      } 
}

module.exports = paymentController

