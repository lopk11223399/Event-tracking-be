module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      "OfflineEvents",
      "typeEvent_code",
      Sequelize.INTEGER
    );
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn("OfflineEvents", "typeEvent_code");
  },
};
