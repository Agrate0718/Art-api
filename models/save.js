'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class save extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.save.belongsToMany(models.user, { through: "user_save"} )
      models.save.hasMany(models.comment)
    }
  }
  save.init({
    title: DataTypes.STRING,
    imdbID: DataTypes.STRING,
    poster: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'save',
  });
  return save;
};