const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');
const User = require('../users/user.model');

const Professional = sequelize.define('Professional', {
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
  experience: {
    type: DataTypes.INTEGER, // Anos de experiência
    allowNull: false,
    defaultValue: 0
  },
  pricePerSquareMeter: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.00,
    validate: {
      min: 1.00,
      max: 2.00
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  documentVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associação com User
Professional.belongsTo(User, { foreignKey: 'userId' });

module.exports = Professional;
