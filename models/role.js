'use strict';
const {
  Model
} = require('sequelize');
const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, {foreignKey: 'id_role'})
    }
  }
  Role.init({
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    hooks: {
      beforeCreate: (data, option) => {

        data.id = generateId()
      }
    }
  });
  return Role;
};