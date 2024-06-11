'use strict';
const {
  Model
} = require('sequelize');
const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class StockTiket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockTiket.init({
    id_wisata: {
      type: DataTypes.STRING(21),
      references: {
        model: "Wisata",
        key: "id",
        onDelete: 'CASCADE'
      },
    },
    stock_tiket: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockTiket',
    hooks: {
      beforeCreate: (data, option) => {

        data.id = generateId()
      }
    }
  });
  return StockTiket;
};