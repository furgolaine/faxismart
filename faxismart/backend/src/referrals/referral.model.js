const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  professionalId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Professional,
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'used'),
    defaultValue: 'pending'
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  bonusAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 10.00
  },
  bonusPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Associações
Referral.belongsTo(Professional, { foreignKey: 'professionalId' });
Referral.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Referral;
