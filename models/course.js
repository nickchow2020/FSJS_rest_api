'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User,{
        as:"authenticateUser",
        foreignKey:{
          fieldName: "userId"
        }
      })
    }
  };
  Course.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg: "title property not allow null!"
        },
        notEmpty:{
          msg: "title property not allow empty!"
        }
      }
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{
          msg: "description property not allow null!"
        },
        notEmpty:{
          msg:"description property not allow empty!"
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};