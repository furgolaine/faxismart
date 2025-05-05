# Use uma imagem oficial do Node.js como base
# Escolha uma versão LTS (Long Term Support) - ajuste se necessário
FROM node:18-alpine

# Crie o diretório da aplicação dentro da imagem
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
# O asterisco (*) garante que ambos sejam copiados se existirem
COPY package*.json ./

# Instale as dependências de produção
RUN npm install --production

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que sua aplicação usa (ajuste se for diferente de 5000)
EXPOSE 5000

# Comando para rodar a aplicação quando o contêiner iniciar
CMD [ "node", "src/main.js" ]
