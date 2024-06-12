'use strict';
const {
  Model
} = require('sequelize');
const generateId = require('../middleware/generateId');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Wisata, {foreignKey: 'id_wisata'})
    }
  }
  Order.init({
    id_user: {
      type: DataTypes.STRING(21),
      references: {
        model: "Users",
        key: "id"
      }
    },
    id_wisata: {
      type: DataTypes.STRING(21),
      references: {
        model: "Wisata",
        key: "id",
        onDelete: 'CASCADE'
      },
    },
    order_id: DataTypes.STRING(21),
    tiket: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    order_date: DataTypes.DATE,
    status: DataTypes.STRING,
    expiredDate: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  }, {
    sequelize,
    modelName: 'Order',
    hooks: {
      beforeCreate: (data, option) => {
        data.id = generateId()
      }
    }
  });
  return Order;
};