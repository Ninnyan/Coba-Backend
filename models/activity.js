'use strict';
const {
  Model
} = require('sequelize');
const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Activity.init({
    id_user: {
      type: DataTypes.STRING(21),
      references: {
        model: "Users",
        key: "id"
      }
    },
    loginAt: DataTypes.DATE,
    logoutAt: DataTypes.DATE,
    token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Activity',
    hooks: {
      beforeCreate: (data, option) => {

        data.id = generateId()
      }
    }
  });
  return Activity;
};