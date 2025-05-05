# Guia de Instalação e Implantação - Faxismart

Este guia fornece instruções detalhadas para instalar, configurar e implantar o aplicativo Faxismart em ambientes de desenvolvimento, teste e produção.

## Requisitos de Sistema

### Backend
- Node.js 14.x ou superior
- MongoDB 4.4.x ou superior
- NPM 6.x ou superior
- Acesso a serviços de geolocalização (Google Maps API)
- Acesso a gateway de pagamento

### Frontend
- Node.js 14.x ou superior
- NPM 6.x ou superior
- React Native CLI
- Expo CLI (opcional para desenvolvimento)
- Android Studio (para build Android)
- Xcode (para build iOS, apenas em macOS)

### Infraestrutura Recomendada (Produção)
- Servidor: AWS EC2 ou similar (mínimo 2 vCPUs, 4GB RAM)
- Banco de Dados: MongoDB Atlas ou instância dedicada
- Armazenamento: AWS S3 ou similar para arquivos estáticos
- CDN: Cloudflare ou similar para distribuição de conteúdo
- CI/CD: GitHub Actions, Jenkins ou similar

## Instalação do Backend

### Configuração do Ambiente

1. Clone o repositório:
```bashcd 
git clone https://github.com/faxismart/faxismart.git
cd faxismart\backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do diretório backend com as seguintes variáveis:
```
# Configuração do Servidor
PORT=5000
NODE_ENV=development

# Configuração do Banco de Dados
MONGO_URI=mongodb://localhost:27017/faxismart
MONGO_URI_TEST=mongodb://localhost:27017/faxismart_test

# Configuração de Autenticação
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Configuração de APIs Externas
GOOGLE_MAPS_API_KEY=sua_chave_api_google_maps
PAYMENT_GATEWAY_API_KEY=sua_chave_api_gateway_pagamento

# Configuração de E-mail
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_EMAIL=noreply@faxismart.com.br
SMTP_PASSWORD=sua_senha_smtp
FROM_EMAIL=noreply@faxismart.com.br
FROM_NAME=Faxismart
```

4. Configure o banco de dados MongoDB:
   - Instale o MongoDB localmente ou use um serviço como MongoDB Atlas
   - Certifique-se de que a URI no arquivo `.env` está correta

### Inicialização do Backend

1. Para ambiente de desenvolvimento:
```bash
npm run dev
```

2. Para ambiente de produção:
```bash
npm run build
npm start
```

3. Verifique se o servidor está rodando acessando:
```
http://localhost:5000/api/health
```

## Instalação do Frontend

### Configuração do Ambiente

1. Navegue até o diretório frontend:
```bash
cd ../frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do diretório frontend com as seguintes variáveis:
```
# Configuração da API
API_URL=http://localhost:5000/api

# Configuração de APIs Externas
GOOGLE_MAPS_API_KEY=sua_chave_api_google_maps

# Configuração do App
APP_NAME=Faxismart
APP_VERSION=1.0.0
```

### Inicialização do Frontend

1. Para ambiente de desenvolvimento:
```bash
npm start
```

2. Para executar no emulador Android:
```bash
npm run android
```

3. Para executar no emulador iOS (apenas macOS):
```bash
npm run ios
```

## Configuração do Banco de Dados

### Inicialização do Banco de Dados

1. Certifique-se de que o MongoDB está instalado e rodando

2. Execute o script de inicialização para criar as coleções e índices necessários:
```bash
cd ../backend
npm run db:init
```

3. (Opcional) Carregue dados de exemplo para desenvolvimento:
```bash
npm run db:seed
```

### Backup e Restauração

1. Para fazer backup do banco de dados:
```bash
mongodump --uri="mongodb://localhost:27017/faxismart" --out=./backup
```

2. Para restaurar o banco de dados:
```bash
mongorestore --uri="mongodb://localhost:27017/faxismart" ./backup/faxismart
```

## Implantação em Produção

### Backend

#### Implantação em Servidor Dedicado

1. Configure o servidor com Node.js e MongoDB

2. Clone o repositório no servidor:
```bash
git clone https://github.com/faxismart/faxismart.git
cd faxismart/backend
```

3. Instale as dependências:
```bash

```

4. Configure o arquivo `.env` para produção

5. Configure o PM2 para gerenciar o processo:
```bash
npm install -g pm2
pm2 start npm --name "faxismart-backend" -- start
pm2 save
pm2 startup
```

#### Implantação com Docker

1. Construa a imagem Docker:
```bash
docker build -t faxismart/backend .
```

2. Execute o contêiner:
```bash
docker run -d -p 5000:5000 --env-file .env --name faxismart-backend faxismart/backend
```

### Frontend

#### Geração de Build para Android

1. Configure o arquivo `android/app/build.gradle` com as informações corretas de versão e pacote

2. Gere uma chave de assinatura:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore faxismart.keystore -alias faxismart -keyalg RSA -keysize 2048 -validity 10000
```

3. Configure as informações de assinatura no arquivo `android/gradle.properties`

4. Gere o APK de release:
```bash
cd android
./gradlew assembleRelease
```

5. O APK estará disponível em `android/app/build/outputs/apk/release/app-release.apk`

#### Geração de Build para iOS (apenas macOS)

1. Abra o projeto no Xcode:
```bash
cd ios
pod install
open faxismart.xcworkspace
```

2. Configure o Bundle Identifier e Team no Xcode

3. Selecione "Generic iOS Device" como destino

4. Selecione Product > Archive no menu

5. Siga as instruções do Xcode para distribuir o aplicativo

### Configuração de CI/CD

#### GitHub Actions

1. Crie o diretório `.github/workflows` na raiz do projeto

2. Crie um arquivo `backend.yml` para o backend:
```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/faxismart
            git pull
            cd backend
            npm ci --production
            pm2 restart faxismart-backend
```

3. Crie um arquivo `frontend.yml` para o frontend:
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Build Android
        run: cd frontend && cd android && ./gradlew assembleRelease
      - name: Upload APK
        uses: actions/upload-artifact@v2
        with:
          name: app-release
          path: frontend/android/app/build/outputs/apk/release/app-release.apk
```

## Monitoramento e Manutenção

### Monitoramento

1. Configure o PM2 para monitoramento básico:
```bash
pm2 monit
```

2. Para monitoramento avançado, configure o PM2 Plus ou use serviços como:
   - New Relic
   - Datadog
   - Sentry (para rastreamento de erros)

### Logs

1. Visualize logs do backend:
```bash
pm2 logs faxismart-backend
```

2. Configure rotação de logs:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Atualizações

1. Para atualizar o backend:
```bash
cd /path/to/faxismart
git pull
cd backend
npm ci --production
pm2 restart faxismart-backend
```

2. Para atualizar o frontend, gere novos builds e distribua através das lojas de aplicativos

## Solução de Problemas

### Problemas Comuns do Backend

1. **Erro de conexão com o banco de dados**
   - Verifique se o MongoDB está rodando
   - Verifique a URI de conexão no arquivo `.env`
   - Verifique as credenciais de acesso

2. **Erro de autenticação JWT**
   - Verifique se o JWT_SECRET está configurado corretamente
   - Verifique se os tokens não estão expirados

3. **Erro de integração com APIs externas**
   - Verifique as chaves de API no arquivo `.env`
   - Verifique se as APIs externas estão disponíveis

### Problemas Comuns do Frontend

1. **Erro de conexão com o backend**
   - Verifique se o backend está rodando
   - Verifique a URL da API no arquivo `.env`
   - Verifique se há problemas de CORS

2. **Erros de build**
   - Limpe a cache do React Native: `npm start -- --reset-cache`
   - Reinstale os node_modules: `rm -rf node_modules && npm install`
   - Verifique se todas as dependências estão instaladas

## Contato e Suporte

Para suporte técnico ou dúvidas sobre a implantação, entre em contato com:

- **E-mail**: dev@faxismart.com.br
- **Telefone**: (11) 1234-5678
- **Horário de atendimento**: Segunda a Sexta, das 9h às 18h

---

© 2025 Faxismart Ltda. Todos os direitos reservados.
