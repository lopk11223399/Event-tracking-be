"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Events", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      authorId: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      finishDate: {
        type: Sequelize.DATE,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      typeEvent: {
        type: Sequelize.BOOLEAN,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      location: {
        type: Sequelize.STRING,
      },
      linkUrl: {
        type: Sequelize.STRING,
      },
      totalRate: {
        type: Sequelize.FLOAT,
      },
      addPoint: {
        type: Sequelize.FLOAT,
      },
      limitParticipant: {
        type: Sequelize.INTEGER,
      },
      fileNameImage: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Events");
  },
};
