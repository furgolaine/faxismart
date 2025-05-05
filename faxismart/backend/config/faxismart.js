require('dotenv').config();

// Arquivo de configuração do ambiente
module.exports = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Configurações do banco de dados
  database: {
    name: process.env.DB_NAME || 'faxismart',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  
  // Configurações de autenticação
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'faxismart_secret',
    jwtExpiration: '7d',
    saltRounds: 10
  },
  
  // Configurações de pagamento
  payment: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_example',
    platformFeePercentage: 0.10, // 10%
    referralFeePercentage: 0.05, // 5%
  },
  
  // Configurações do Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'faxismart',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'example@faxismart.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || 'dummy-key',
  },
  
  // Configurações de geolocalização
  geolocation: {
    defaultSearchRadius: 10, // km
  },
  
  // Configurações de upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    storageType: process.env.STORAGE_TYPE || 'local', // 'local' ou 's3'
    s3: {
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  }
};
