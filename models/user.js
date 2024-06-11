'use strict';
const {
  Model
} = require('sequelize');
const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Activity, {foreignKey: 'id_user'})
      User.belongsToMany(models.Wisata, {through: 'Order', foreignKey: 'id_user'})
    }
  }
  User.init({
    id_role: {
      type: DataTypes.STRING(21),
      references: {
        model: "Roles",
        key: "id"
      }
    },
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordSalt: DataTypes.STRING,
    gender: DataTypes.STRING,
    telephone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (data, option) => {
        data.id = generateId()
      }
    }
  });
  return User;
};