const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');
const User = require('../users/user.model');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complement: {
    type: DataTypes.STRING,
    allowNull: true
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  squareMeters: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'pix'),
    allowNull: true
  },
  referredBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Professionals',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Associação com User
Client.belongsTo(User, { foreignKey: 'userId' });

module.exports = Client;
