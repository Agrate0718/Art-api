
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comment.belongsTo(models.save)
    }
  }
  comment.init({
    user_name: DataTypes.STRING,
    paragraph: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    saveId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};