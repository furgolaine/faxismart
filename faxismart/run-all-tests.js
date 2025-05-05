// Script para executar todos os testes do aplicativo Faxismart

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Diretórios de teste
const BACKEND_DIR = path.resolve(__dirname, 'backend');
const FRONTEND_DIR = path.resolve(__dirname, 'frontend');

// Função para executar comandos e exibir saída
function runCommand(command, cwd) {
  console.log(`\n\n==== Executando: ${command} em ${cwd} ====\n`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Erro ao executar: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Função para criar relatório de testes
function createTestReport(backendSuccess, frontendUnitSuccess, e2eSuccess) {
  const reportPath = path.resolve(__dirname, 'test-report.md');
  const timestamp = new Date().toISOString();
  
  const content = `# Relatório de Testes do Faxismart
Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

## Resumo

| Tipo de Teste | Status | Observações |
|---------------|--------|-------------|
| Backend (Unitários e Integração) | ${backendSuccess ? '✅ Passou' : '❌ Falhou'} | Testes para API, modelos e lógica de negócio |
| Frontend (Unitários e Componentes) | ${frontendUnitSuccess ? '✅ Passou' : '❌ Falhou'} | Testes para componentes React e serviços |
| End-to-End | ${e2eSuccess ? '✅ Passou' : '❌ Falhou'} | Testes de fluxos completos do aplicativo |

## Detalhes

### Backend
- Testes unitários para o sistema financeiro
- Testes de integração para o sistema de pagamentos
- Testes de integração para o sistema de referências

### Frontend
- Testes de componentes para o sistema financeiro
- Testes de componentes para o sistema de referências

### End-to-End
- Fluxo de registro e login
- Fluxo de cliente (busca, agendamento, pagamento)
- Fluxo de profissional (solicitações, agendamentos, ganhos)

## Próximos Passos
- Corrigir quaisquer falhas identificadas nos testes
- Realizar testes de usabilidade com usuários reais
- Implementar melhorias com base no feedback dos testes

`;
  
  fs.writeFileSync(reportPath, content);
  console.log(`\nRelatório de testes criado em: ${reportPath}`);
}

// Função principal para executar todos os testes
async function runAllTests() {
  console.log('==== Iniciando testes do aplicativo Faxismart ====');
  
  // Executar testes do backend
  console.log('\n==== Testes do Backend ====');
  const backendSuccess = runCommand('npm test', BACKEND_DIR);
  
  // Executar testes unitários do frontend
  console.log('\n==== Testes Unitários do Frontend ====');
  const frontendUnitSuccess = runCommand('npm test', FRONTEND_DIR);
  
  // Executar testes end-to-end
  console.log('\n==== Testes End-to-End ====');
  const e2eSuccess = runCommand('npx cypress run', FRONTEND_DIR);
  
  // Criar relatório de testes
  createTestReport(backendSuccess, frontendUnitSuccess, e2eSuccess);
  
  // Resultado final
  if (backendSuccess && frontendUnitSuccess && e2eSuccess) {
    console.log('\n✅ Todos os testes passaram com sucesso!');
    return 0;
  } else {
    console.log('\n❌ Alguns testes falharam. Verifique o relatório para mais detalhes.');
    return 1;
  }
}

// Executar testes
runAllTests().then(exitCode => {
  process.exit(exitCode);
});
