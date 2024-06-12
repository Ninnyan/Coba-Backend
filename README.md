# API WEB KALIMANTAN EXPLORE

## Overview
 Ini Merupakan Back-end dari Web Kalimantan Explore

# Resources 
* ExpressJs
* Sequelize
* Nodemon
* mysql2
* uuid
* midtrans-client
* multer
* eslint
* cors
* jsonwebtoken
* bcrypt

## Dokumentasi API dari Postman
https://documenter.getpostman.com/view/29696074/2sA3XLDiov

## User Endpoint
|Endpoint|METHOD|BODY|Usage|Example|HEADERS |
|------------|------------|---------|---------|---------|------------|
|/auth/user/register|/POST| "nama": string, "email": string, "password": string,"gender": string,"telephone": string |Register User|-|{Content-Type:: application/json}|
|/auth/user/login|/POST|"email": string, "password": string|Login User|-|-|
|/user/logout|/POST|-|Logout User|-|{Authorizations: Bearer {token}}|
|/user/get-data-user?idUser={id_user}|/GET|-|Mendapatkan Data User|/user/get-data-user?idUser=e43413d29bf548b3ba9c0|{Authorizations: Bearer {token}}|
|/user/update-user?idUser={id_user}|/PUT|"nama": string, "email": string, "password": string,"gender": string,"telephone": string |Mengedit Data User|/user/update-user?idUser=e43413d29bf548b3ba9c0|{Authorizations: Bearer {token}}|
|/order/add-order?idWisata={id_wisata}&idUser={id_user}|/POST|"qty"= integer|Order Tiket Wisata|/order/add-order?idWisata=87e458c4b99b4eaaaffb0&idUser=5a4ae7ce110347bd81692|{Authorizations: Bearer {token}, Content-Type: application/json}|
|/order/ordered-tiket?idUser={id_user}|/GET|-|Mendapatkan Riwayat Order Tiket|/order/ordered-tiket?idUser=5a4ae7ce110347bd81692|{Authorizations: Bearer {token}}|
|/order/delete-order?idOrder={id_order}|/DELETE|-|Menghapus Order Tiket|/order/delete-order?idOrder=80e812d61c7143dfad141|{Authorizations: Bearer {token}}|
|/payment/pay?idOrder={id_order}&idUser={id_user}|/POST|-|Melakukan Payment|/payment/pay?idOrder=80e812d61c7143dfad141&idUser=5a4ae7ce110347bd81692|{Authorizations: Bearer {token}}|


## Admin Endpoint
|Endpoint|METHOD|BODY|Usage|Example|HEADERS |
|------------|------------|---------|---------|---------|------------|
|/auth-private/admin/register|/POST|"nama": string, "email": string, "password": string,"gender": string,"telephone": string,"admin_key": string|Register Admin|-|{Content-Type: application/json}|
|/auth-private/admin/login|/POST|"email": string,"password": string|Login Admin|-|-|
|/admin/logout|/POST|-|Logout Admin|-|{Authorizations: Bearer {token}}|
|/auth-private/admin/update?idAdmin={id_admin}|/PUT|"nama": string, "email": string, "password": string,"gender": string,"telephone": string,"admin_key": string|Update Data Admin|/auth-private/admin/update?idAdmin=ab3bb3f6b4834ff79d956|{Authorizations: Bearer {token}, Content-Type: application/json}|
|/places/add-destinasi?idAdmin={id_admin}|/POST|"name": string,"deskripsi": string,"harga_tiket: string,"jam_operasional": string,"provinsi": string,"photos": 3 file|Menambahkan Data Wisata|/places/add-destinasi?idAdmin=ab3bb3f6b4834ff79d956|{Authorizations: Bearer {token}, Content-Type: application/json}|
|/places/edit-destinasi?idWisata={id_wisata}|/PUT|"name": string,"deskripsi": string,"harga_tiket: string,"jam_operasional": string,"provinsi": string,"photos": 3 file|Memperbaruhi Data Wisata|/places/edit-destinasi?idWisata=87e458c4b99b4eaaaffb0|{Authorizations: Bearer {token}, Content-Type: application/json}|
|/provinces/province?idUser={id_user}|/GET|-|Mendapatkan Semua Data Wisata|/provinces/province?idUser=ab3bb3f6b4834ff79d956|{Authorizations: Bearer {token}}|
|/provinces/detail?idWisata={id_wisata}|/GET|-|Mendapatkan Detail Data Wisata|/provinces/detail?idWisata=87e458c4b99b4eaaaffb0|{Authorizations: Bearer {token}}|
|/provinces/get-map?place_id={place_id}|/GET|-|Memperoleh Lokasi Google Map|/provinces/get-map?place_id=ChIJzZZVS8Ij5C0RZYldusnP-tIw|{Authorizations: Bearer {token}}|
|/places/delete-destinasi?idWisata={id_wisata}|/DELETE|-|Menghapus Data Wisata|/places/delete-destinasi?idWisata=87e458c4b99b4eaaaffb0|{Authorizations: Bearer {token}}|
|/provinces/photo?idWisata={id}&photoReference={pilih angka antara 0 sampai 2}|/GET|-|Mendapatkan Data Photo|/provinces/photo?idWisata=87e458c4b99b4eaaaffb0&photoReference=0|{Authorizations: Bearer {token}}|
|/activity/get-activity|/GET|-|Mendapatakan Aktivitas login User|-|{Authorizations: Bearer {token}}|
|/stock-tiket/stock|/GET|-|Mendapatkan Data Stock Tiket Wisata|-|{Authorizations: Bearer {token}}|
|/stock-tiket/delete-stock-tiket?idStockTiket={id_stockTiket}|/DELETE|-|Menghapus Data Stock Tiket|/stock-tiket/delete-stock-tiket?idStockTiket=ad91haowhahdo022h0|{Authorizations: Bearer {token}}|
|/stock-tiket/edit-stock-tiket?idWisata={id_wisata}|/PUT|"qty": integer|Memperbarui Stock Tiket|/stock-tiket/edit-stock-tiket?idWisata=87e458c4b99b4eaaaffb0|{Authorizations: Bearer {token}, Content-Type: application/json}|
|/admin/get-data-admin?idAdmin={id_admin}|/GET|-|Mendapatkan Data Admin|-|{Authorizations: Bearer {token}}|
|/provinces/recommendation|/GET|-|Mendapatkan Data Rekomendasi|-|{Authorizations: Bearer {token}}|


                    
                          

