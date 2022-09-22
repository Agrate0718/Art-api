'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_saved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_saved.init({
    userId: DataTypes.INTEGER,
    saveId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_saved',
  });
  return user_saved;
};