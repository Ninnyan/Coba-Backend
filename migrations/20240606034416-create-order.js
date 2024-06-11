'use strict';

const generateId = require('../middleware/generateId');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "id"
        }
      },
      id_wisata: {
        type: Sequelize.STRING,
        references: {
          model: "Wisata",
          key: "id",
          onDelete: 'CASCADE'
        }
      },
      tiket: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING(21)
      },
      qty: {
        type: Sequelize.INTEGER
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      order_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      expiredDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};