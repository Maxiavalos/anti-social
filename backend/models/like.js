const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['UserId', 'PostId'] 
      }
    ]
  });