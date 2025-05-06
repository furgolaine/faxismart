const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');

const Appointment = sequelize.define('Appointment', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  squareMeters: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  complexityLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 5
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'refunded', 'failed'),
    defaultValue: 'pending'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associações
Appointment.belongsTo(Professional, { foreignKey: 'professionalId' });
Appointment.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = Appointment;
