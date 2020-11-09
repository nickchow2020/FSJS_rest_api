'use strict';
const {Model} = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course,{
        foreignKey:{
          fieldName: "userId"
        }
      })
    }
  };

  //model initial
  User.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    firstName: {
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg:"first name property can't be null!"
        },
        notEmpty:{
          msg:"first name property can't be empty!"
        }
      }
    },
    lastName: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"last name property can't be null!"
        },
        notEmpty:{
          msg:"last name property can't be empty!"
        }
      }
    },
    emailAddress: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        msg:"already exist user email,please try another one"
      },
      validate:{
        notNull:{
          msg:"email address can't not be null!"
        },
        notEmpty:{
          msg:"email address can't not be empty!"
        },
        isEmail:{
          msg:"please provide a valid email!"
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"password can't be null!"
        },
        notEmpty:{
          msg:"password can't be empty!"
        }
      },
      set(val){
          const encrypted = bcrypt.hashSync(val,10);
          this.setDataValue("password",encrypted);
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};