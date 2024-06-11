'use strict';
const {
  Model
} = require('sequelize');
const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class Wisata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wisata.belongsToMany(models.User, {through: 'Order', foreignKey: 'id_wisata'})
      Wisata.hasOne(models.StockTiket, {foreignKey: 'id_wisata'})
    }
  }
  Wisata.init({
    name: DataTypes.STRING,
    id_province: {
      type: DataTypes.STRING(21),
      references: {
        model: "Provinsis",
        key: "id"
      }
    },
    place_id: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    harga_tiket: DataTypes.STRING,
    jam_operasional: DataTypes.STRING,
    formatted_address: DataTypes.STRING,
    photos_1: DataTypes.STRING,
    photos_2: DataTypes.STRING,
    photos_3: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wisata',
    hooks: {
      beforeCreate: (data, option) => {

        data.id = generateId()
      }
    }
  });
  return Wisata;
};