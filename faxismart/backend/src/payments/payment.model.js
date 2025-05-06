const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const Appointment = require('../appointments/appointment.model');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Appointment,
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
  professionalId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Professional,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  platformFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  referralFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  professionalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'pix'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'refunded', 'failed'),
    defaultValue: 'pending'
  },
  gatewayId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gatewayResponse: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associações
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Payment.belongsTo(Client, { foreignKey: 'clientId' });
Payment.belongsTo(Professional, { foreignKey: 'professionalId' });

module.exports = Payment;
