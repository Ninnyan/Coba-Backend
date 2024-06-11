'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wisata', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING(21)
      },
      name: {
        type: Sequelize.STRING
      },
      id_province: {
        type: Sequelize.STRING,
        references: {
          model: "Provinsis",
          key: "id"
        }
      },
      place_id: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      harga_tiket: {
        type: Sequelize.STRING
      },
      jam_operasional: {
        type: Sequelize.STRING
      },
      formatted_address: {
        type: Sequelize.STRING
      },
      photos_1: {
        type: Sequelize.BLOB('long')
      },
      photos_2: {
        type: Sequelize.BLOB('long')
      },
      photos_3: {
        type: Sequelize.BLOB('long')
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
    await queryInterface.dropTable('Wisata');
  }
};