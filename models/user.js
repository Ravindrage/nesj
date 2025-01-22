/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   /* static associate(models) {
      // define association here
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',  // Specify the correct table name
    timestamps: false     // Optional: if you don't have `createdAt` and `updatedAt` fields
  });
  return User;
};
*/

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
