const express = require('express');
const router = express.Router();
const User = require('../users/user.model');
const Professional = require('../users/professional.model');
const Client = require('../users/client.model');
const firebase = require('firebase-admin');

// Middleware para verificar autenticação
const authMiddleware = require('../users/auth.middleware');

// Inicializar Firebase (simulado)
if (!firebase.apps.length) {
  try {
    firebase.initializeApp({
      // Configurações do Firebase seriam colocadas aqui
      credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "faxismart-ff13b",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@faxismart-ff13b.iam.gserviceaccount.com",
        privateKey: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjaVO7sJ8dt2uq\nwVEB70MP5DCCECGpwm0fmn7CJi0EknXvGl9EA/3EwHPe36MtCqIFPIWlHmKAN+PF\n3/q2iYKidkiWLaDU8dkclRpi4KTlwH+S6I1JgXvBG23EQbBqWcTjTSLCn1HkFrE5\ngTTiDLihpqlj6V7Rk4dhsawOU//CI//V9AGO+ufID/qdZgLd9HHLEkY3ts5+qPWw\nwEj3hZXQD2IZ5S1FOiwkxvv8SX2u0xjpwxGOimemJ1dATejwZI7Fym/FmEaF8BA8\nhdCqEPDgh+GrxmumRsfu4Lu8Rj5eMhnIJlP2vBr9oXDYgW5bBKhxhUAqAUl/Waak\nmFA0b+spAgMBAAECggEADyOJYdiFjTO6cknRjuvTGyxJQCttavQ7ttNRzfvKbOOC\nsIGRdNQn1Ov9cBbo35neE70dJoRvnLBQ1jqfV/zaUOHDbMJSZZf4RLkdhi6IqE5S\no1IPENHBnMzFOQra5KdnYaV6RGyNIiPmDE1HkG+cRUGS7NIoeiMARlE2/ubSSXJ1\nbAruqDk87LO0MYms1IFoSXhHDX4Vz7lN5i2Oqic+UnDS6cB7DFi7jSVAEazNXMHC\n8BmTHC77o2JcDw+0cP2kdh0SKnQEnLVK55tIChoLEX4xolScMOs7I6J15GR4p4IR\nRxbDMZOHEwlb10DImpWf+lhjqOkLO5i/wiVHMWFG2QKBgQDTzRLIxxFYlLhqO7YJ\nqsR2NqGbvwMjw/uqdk6h+yKbfyb3J6tS/bDsWi21SOhEg2v3zxybfxiJUd8VbsKW\nirA31otasZLitdzYZwuPryztMovg9IHBYfI9nNUUEwVMJhyoo6z0/MoUpLvYXA1r\n0i7uBnliBX+YLrcTcCkiK3XPNQKBgQDFgymBAGqzvQYbbdCtZvR/briz13XHMrar\nkwL/u5Ai/yqZxC/pC1BU8R/FXXnC5X1HRMAsKBtgSPCvN4dAvkm1VFVwTKkx8a8Y\nLD5f3sjlRxe4bKCVCTgj6MdDcWm3jGcfgYdg8ZvQT6UGvaelYNUdOzIRfGkQDVIW\n84rDFDGmpQKBgQDBeujZ+N/jp5f/k6RrmE/4HVfsSsW3emUABys11ZB7s+AIj3h2\nS8G/Z3Gx1XQ4gkWzDsP3WFc1ulCr545irzbjC14p72VbLP8dwKRTEZdc53vYeAPA\ngJUlq4sK14VTVs1/UGXDNtnzmbjvoMex40NztP5ViOhSQPqFC0TILiNksQKBgFZb\nKJRciEqZxMfNVcXbE997m4oWFErJ45BUsKT7buO+SPP+ESyFY9QfsNJsMkaCbCny\n50rnJkEM4x7Y2mv2RuffPZPiEL/jebjJ72OfVprYYIikBfnjlAYvSqA0QBKecqAV\n1AkQ2h1UFUVDOr9V/RfQv+1hRdZc3J1oUi1E8Qh5AoGAaScpm6bnDFY3Kd7SmvkY\ni2tEefVmgkSFSa26KSQ9/OwkLceDM6V1vB6VmkOxzLveyRLUp90k99YHCJBo3P03\n49rwses/O3kt9HXZr1Njlwl0u8yLa9KopfNozX1unKzwaChm+Z6/50ua53WQith8\novcM/9vgLzTaH2HQzWLEDcY=\n-----END PRIVATE KEY-----\n"
      })
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error);
  }
}

// Rota para enviar notificação para um usuário específico
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    // Verificar permissões (apenas admin ou sistema)
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Permissão negada' });
    }

    // Buscar usuário
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Aqui seria implementada a lógica para buscar o token do dispositivo do usuário
    // e enviar a notificação via Firebase Cloud Messaging
    
    // Simulação de envio de notificação
    console.log(`Enviando notificação para ${user.name}: ${title} - ${body}`);
    
    // Em uma implementação real, seria algo como:
    /*
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: userDeviceToken,
    };

    const response = await firebase.messaging().send(message);
    */

    res.json({
      message: 'Notificação enviada com sucesso',
      // response: response
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
});

// Rota para enviar notificação para todos os profissionais
router.post('/send/professionals', authMiddleware, async (req, res) => {
  try {
    const { title, body, data } = req.body;

    // Verificar permissões (apenas admin ou sistema)
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Permissão negada' });
    }

    // Buscar todos os profissionais ativos
    const professionals = await Professional.findAll({
      include: [
        {
          model: User,
          where: { status: 'active' },
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    // Simulação de envio de notificação em massa
    console.log(`Enviando notificação para ${professionals.length} profissionais: ${title} - ${body}`);
    
    // Em uma implementação real, seria algo como:
    /*
    const messages = professionals.map(professional => ({
      notification: {
        title,
        body,
      },
      data: data || {},
      token: professionalDeviceToken,
    }));

    const response = await firebase.messaging().sendAll(messages);
    */

    res.json({
      message: `Notificação enviada para ${professionals.length} profissionais`,
      // response: response
    });
  } catch (error) {
    console.error('Erro ao enviar notificação em massa:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação em massa' });
  }
});

// Rota para enviar notificação para todos os clientes
router.post('/send/clients', authMiddleware, async (req, res) => {
  try {
    const { title, body, data } = req.body;

    // Verificar permissões (apenas admin ou sistema)
    if (req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Permissão negada' });
    }

    // Buscar todos os clientes ativos
    const clients = await Client.findAll({
      include: [
        {
          model: User,
          where: { status: 'active' },
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    // Simulação de envio de notificação em massa
    console.log(`Enviando notificação para ${clients.length} clientes: ${title} - ${body}`);
    
    // Em uma implementação real, seria algo como:
    /*
    const messages = clients.map(client => ({
      notification: {
        title,
        body,
      },
      data: data || {},
      token: clientDeviceToken,
    }));

    const response = await firebase.messaging().sendAll(messages);
    */

    res.json({
      message: `Notificação enviada para ${clients.length} clientes`,
      // response: response
    });
  } catch (error) {
    console.error('Erro ao enviar notificação em massa:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação em massa' });
  }
});

module.exports = router;
