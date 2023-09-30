module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      "OnlineEvents",
      "typeEvent_code",
      Sequelize.INTEGER
    );
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn("OnlineEvents", "typeEvent_code");
  },
};
