# Documentação do Aplicativo Faxismart

## Visão Geral

O Faxismart é um aplicativo de agendamento de serviços de limpeza que conecta clientes a profissionais qualificados. O sistema permite que clientes encontrem profissionais próximos, agendem serviços com base na metragem do imóvel, realizem pagamentos e avaliem os serviços prestados. Para os profissionais, o aplicativo oferece oportunidades de trabalho, gerenciamento de agendamentos e um sistema de ganhos transparente.

## Arquitetura do Sistema

O aplicativo Faxismart foi desenvolvido utilizando uma arquitetura cliente-servidor, com separação clara entre frontend e backend:

### Backend

- **Tecnologias**: Node.js, Express, MongoDB
- **Padrão de Arquitetura**: MVC (Model-View-Controller)
- **Autenticação**: JWT (JSON Web Tokens)
- **Principais Módulos**:
  - Usuários (clientes e profissionais)
  - Geolocalização
  - Agendamentos
  - Pagamentos
  - Avaliações
  - Referências
  - Notificações
  - Administração

### Frontend

- **Tecnologias**: React Native, Redux
- **Padrão de Arquitetura**: Flux (com Redux)
- **Principais Telas**:
  - Autenticação (login, registro)
  - Home (busca de profissionais)
  - Detalhes de profissionais
  - Agendamento
  - Pagamento
  - Histórico de agendamentos
  - Perfil
  - Ganhos (para profissionais)
  - Referências

## Funcionalidades Principais

### Para Clientes

1. **Registro e Login**
   - Cadastro com informações pessoais e endereço
   - Login com e-mail e senha

2. **Busca de Profissionais**
   - Busca por localização (geolocalização)
   - Filtros por avaliação e disponibilidade
   - Visualização de perfis de profissionais

3. **Agendamento de Serviços**
   - Seleção de data e horário
   - Especificação da metragem do imóvel
   - Seleção do nível de complexidade do serviço
   - Cálculo automático de preço

4. **Pagamento**
   - Processamento de pagamentos com cartão de crédito
   - Histórico de pagamentos

5. **Avaliação**
   - Avaliação de profissionais após a conclusão do serviço
   - Comentários e classificação por estrelas

6. **Programa de Indicação**
   - Geração de código de referência
   - Desconto de 10% no próximo serviço ao indicar amigos

### Para Profissionais

1. **Registro e Login**
   - Cadastro com informações pessoais, endereço e dados bancários
   - Login com e-mail e senha

2. **Gerenciamento de Solicitações**
   - Visualização de solicitações de serviço próximas
   - Aceitação ou recusa de solicitações

3. **Gerenciamento de Agendamentos**
   - Visualização de agendamentos confirmados
   - Histórico de serviços realizados

4. **Sistema de Ganhos**
   - Visualização de ganhos totais e por período
   - Detalhamento de valores por serviço

5. **Programa de Indicação**
   - Geração de código de referência
   - Ganho de 5% do valor dos serviços realizados por profissionais indicados

## Sistema Financeiro

### Precificação

O sistema de precificação do Faxismart é baseado em dois fatores principais:
1. Metragem do imóvel
2. Nível de complexidade do serviço

**Fórmula de Cálculo**:
```
Preço = Metragem × Preço por m² × Multiplicador de Complexidade
```

Onde:
- Preço por m² = R$ 1,50 (valor base)
- Multiplicador de Complexidade:
  - Nível 1 (Limpeza básica): 1.0
  - Nível 2 (Limpeza intermediária): 1.1
  - Nível 3 (Limpeza pesada): 1.2
  - Nível 4 (Limpeza pós-obra): 1.3
  - Nível 5 (Limpeza especializada): 1.4

### Divisão de Valores

O valor total do serviço é dividido entre:
1. Plataforma Faxismart
2. Profissional de limpeza
3. Usuário que fez a indicação (se aplicável)

**Divisão Percentual**:
- Plataforma: 10% do valor total
- Indicação: 5% do valor total (quando aplicável)
- Profissional: 85% do valor total (ou 90% quando não há indicação)

## Sistema de Referências

O Faxismart possui um sistema de indicações que beneficia tanto quem indica quanto quem é indicado:

### Para Clientes
- Ao indicar um amigo, o cliente recebe 10% de desconto no próximo serviço quando o amigo realizar sua primeira limpeza.

### Para Profissionais
- Ao indicar um amigo para se tornar profissional, o indicador recebe 5% do valor de cada serviço que o amigo realizar.

**Funcionamento**:
1. Cada usuário recebe um código de referência único (formato: FXAAAA1234)
2. O usuário compartilha seu código com amigos
3. Novos usuários inserem o código durante o cadastro
4. O sistema vincula o novo usuário ao indicador
5. Benefícios são aplicados conforme as regras acima

## Fluxos de Usuário

### Fluxo do Cliente

1. Cliente se registra no aplicativo
2. Busca profissionais próximos
3. Seleciona um profissional
4. Agenda um serviço (data, horário, metragem)
5. Confirma o agendamento
6. Realiza o pagamento
7. Recebe o serviço
8. Avalia o profissional

### Fluxo do Profissional

1. Profissional se registra no aplicativo
2. Recebe solicitações de serviço
3. Aceita uma solicitação
4. Realiza o serviço na data agendada
5. Recebe o pagamento (após dedução das taxas)
6. Recebe avaliação do cliente

## Estrutura de Diretórios

```
faxismart/
├── backend/
│   ├── config/
│   ├── database/
│   ├── src/
│   │   ├── admin/
│   │   ├── appointments/
│   │   ├── geolocation/
│   │   ├── notifications/
│   │   ├── payments/
│   │   ├── ratings/
│   │   ├── referrals/
│   │   └── users/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── redux/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── tests/
└── docs/
```

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh-token` - Renovação de token

### Usuários

- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil do usuário
- `GET /api/users/professionals` - Listar profissionais disponíveis

### Agendamentos

- `POST /api/appointments` - Criar novo agendamento
- `GET /api/appointments` - Listar agendamentos do usuário
- `GET /api/appointments/:id` - Obter detalhes de um agendamento
- `PUT /api/appointments/:id` - Atualizar status de um agendamento

### Pagamentos

- `POST /api/payments/calculate` - Calcular preço de um serviço
- `POST /api/payments/process` - Processar pagamento
- `GET /api/payments/client/:clientId` - Obter histórico de pagamentos de um cliente
- `GET /api/payments/professional/:professionalId` - Obter ganhos de um profissional

### Avaliações

- `POST /api/ratings` - Criar nova avaliação
- `GET /api/ratings/professional/:professionalId` - Obter avaliações de um profissional

### Referências

- `POST /api/referrals/generate/:userId` - Gerar código de referência
- `POST /api/referrals/apply/:userId` - Aplicar código de referência
- `GET /api/referrals/stats/:userId` - Obter estatísticas de referência
- `GET /api/referrals/users/:userId` - Listar usuários referidos

## Requisitos de Sistema

### Backend

- Node.js 14+
- MongoDB 4.4+
- NPM 6+

### Frontend

- React Native 0.64+
- Expo 44+
- Node.js 14+
- NPM 6+

### Dispositivos Suportados

- iOS 12+
- Android 8+

## Instalação e Configuração

### Backend

1. Clone o repositório
2. Navegue até a pasta `backend`
3. Execute `npm install` para instalar as dependências
4. Configure as variáveis de ambiente no arquivo `.env`
5. Execute `npm start` para iniciar o servidor

### Frontend

1. Navegue até a pasta `frontend`
2. Execute `npm install` para instalar as dependências
3. Configure as variáveis de ambiente no arquivo `.env`
4. Execute `npm start` para iniciar o aplicativo

## Testes

O aplicativo Faxismart inclui testes abrangentes para garantir a qualidade do código:

### Testes Unitários

- Testes para o sistema financeiro
- Testes para componentes do frontend

### Testes de Integração

- Testes para o sistema de pagamentos
- Testes para o sistema de referências

### Testes End-to-End

- Fluxo de registro e login
- Fluxo de cliente
- Fluxo de profissional

Para executar todos os testes, use o comando:
```
node run-all-tests.js
```

## Considerações de Segurança

- Autenticação com JWT
- Senhas armazenadas com hash e salt
- Validação de dados em todas as requisições
- Proteção contra ataques CSRF
- Limitação de taxa de requisições
- Dados sensíveis criptografados

## Manutenção e Suporte

Para manutenção e suporte do aplicativo Faxismart, entre em contato com a equipe de desenvolvimento através do e-mail suporte@faxismart.com.br.

## Licença

O aplicativo Faxismart é propriedade exclusiva da empresa Faxismart Ltda. Todos os direitos reservados.
