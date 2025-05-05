const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const Appointment = require('../appointments/appointment.model');

const Rating = sequelize.define('Rating', {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associações
Rating.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Rating.belongsTo(Client, { foreignKey: 'clientId' });
Rating.belongsTo(Professional, { foreignKey: 'professionalId' });

module.exports = Rating;
