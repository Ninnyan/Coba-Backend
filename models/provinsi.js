'use strict';
const {
  Model
  } = require('sequelize');
  const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class Provinsi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Provinsi.hasMany(models.Wisata, {foreignKey: 'id_province'})
    }
  }
  Provinsi.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Provinsi',
    hooks: {
      beforeCreate: (data, option) => {

        data.id = generateId()
      }
    }
  });
  return Provinsi;
};