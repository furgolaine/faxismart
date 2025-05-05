require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importação dos routers
const usersRouter = require('./users/users.routes');
const geolocationRouter = require('./geolocation/geolocation.routes');
const appointmentsRouter = require('./appointments/appointments.routes');
const paymentsRouter = require('./payments/payments.routes');
const ratingsRouter = require('./ratings/ratings.routes');
const referralsRouter = require('./referrals/referrals.routes');
const notificationsRouter = require('./notifications/notifications.routes');
const adminRouter = require('./admin/admin.routes');

// Inicialização do app
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/api/users', usersRouter);
app.use('/api/geolocation', geolocationRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/referrals', referralsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Faxismart funcionando corretamente' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'Erro interno do servidor',
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
