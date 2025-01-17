"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OfflineEvents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      eventId: {
        type: Sequelize.INTEGER,
      },
      roomId: {
        type: Sequelize.INTEGER,
      },
      topic: {
        type: Sequelize.STRING,
      },
      numberRoom: {
        type: Sequelize.STRING,
      },
      timeRoom: {
        type: Sequelize.STRING,
      },
      qrCode: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OfflineEvents");
  },
};
