

'use strict';
const { Model, DataTypes,Sequelize } = require('sequelize');



module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations if any
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,  // Automatically sets the current time when a user is created
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,  // Automatically sets the current time when a user is created
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',  // Ensure the correct table name
    timestamps: false     // If you don't have timestamp columns (createdAt, updatedAt)
  });

  return User;
};
