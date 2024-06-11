'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Riwayat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Riwayat.init({
    id_wisata: {
      type: DataTypes.STRING(21),
      references: {
        model: "Wisata",
        key: "id",
        onDelete: 'CASCADE'
      },
    },
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Riwayat',
  });
  return Riwayat;
};