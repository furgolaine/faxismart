// Documentação do Sistema Financeiro do Faxismart

/**
 * Este arquivo contém a documentação detalhada do sistema financeiro do aplicativo Faxismart,
 * incluindo a lógica de precificação, divisão de valores e sistema de referências.
 */

/**
 * SISTEMA DE PRECIFICAÇÃO
 * 
 * O sistema de precificação do Faxismart é baseado em dois fatores principais:
 * 1. Metragem do imóvel
 * 2. Nível de complexidade do serviço
 * 
 * Fórmula básica:
 * Preço = Metragem × Preço por m² × Multiplicador de Complexidade
 * 
 * Onde:
 * - Preço por m² = R$ 1,50 (valor base)
 * - Multiplicador de Complexidade:
 *   - Nível 1 (Limpeza básica): 1.0
 *   - Nível 2 (Limpeza intermediária): 1.1
 *   - Nível 3 (Limpeza pesada): 1.2
 *   - Nível 4 (Limpeza pós-obra): 1.3
 *   - Nível 5 (Limpeza especializada): 1.4
 * 
 * Exemplo:
 * Para um imóvel de 80m² com nível de complexidade 2:
 * Preço = 80 × 1,50 × 1,1 = R$ 132,00
 */

/**
 * SISTEMA DE DIVISÃO DE VALORES
 * 
 * O valor total do serviço é dividido entre:
 * 1. Plataforma Faxismart
 * 2. Profissional de limpeza
 * 3. Usuário que fez a indicação (se aplicável)
 * 
 * Divisão percentual:
 * - Plataforma: 10% do valor total
 * - Indicação: 5% do valor total (quando aplicável)
 * - Profissional: 85% do valor total (ou 90% quando não há indicação)
 * 
 * Exemplo:
 * Para um serviço de R$ 132,00 com indicação:
 * - Plataforma: R$ 13,20 (10%)
 * - Indicação: R$ 6,60 (5%)
 * - Profissional: R$ 112,20 (85%)
 * 
 * Para um serviço de R$ 132,00 sem indicação:
 * - Plataforma: R$ 13,20 (10%)
 * - Profissional: R$ 118,80 (90%)
 */

/**
 * SISTEMA DE REFERÊNCIAS E INDICAÇÕES
 * 
 * O Faxismart possui um sistema de indicações que beneficia tanto quem indica quanto quem é indicado:
 * 
 * Para clientes:
 * - Ao indicar um amigo, o cliente recebe 10% de desconto no próximo serviço quando o amigo realizar
 *   sua primeira limpeza.
 * 
 * Para profissionais:
 * - Ao indicar um amigo para se tornar profissional, o indicador recebe 5% do valor de cada serviço
 *   que o amigo realizar.
 * 
 * Funcionamento:
 * 1. Cada usuário recebe um código de referência único (formato: FXAAAA1234)
 * 2. O usuário compartilha seu código com amigos
 * 3. Novos usuários inserem o código durante o cadastro
 * 4. O sistema vincula o novo usuário ao indicador
 * 5. Benefícios são aplicados conforme as regras acima
 */

/**
 * IMPLEMENTAÇÃO TÉCNICA
 * 
 * Backend:
 * - FinancialSystem: Classe principal que implementa a lógica de precificação e divisão de valores
 * - PaymentController: Controlador para processamento de pagamentos e cálculo de ganhos
 * - ReferralController: Controlador para gerenciamento do sistema de referências
 * 
 * Frontend:
 * - FinancialService: Serviço para integração com o sistema financeiro do backend
 * - ReferralService: Serviço para integração com o sistema de referências do backend
 * - PriceDetailsComponent: Componente para exibição de detalhes de preço e divisão financeira
 * - ReferralSystemComponent: Componente para gerenciamento do sistema de referências
 * 
 * Testes:
 * - Testes unitários para validar a lógica de precificação e divisão de valores
 * - Cobertura de testes para garantir a qualidade do código
 */

/**
 * FLUXO DE PAGAMENTO
 * 
 * 1. Cliente solicita um serviço de limpeza
 * 2. Sistema calcula o preço com base na metragem e complexidade
 * 3. Cliente confirma o agendamento
 * 4. Após a conclusão do serviço, cliente realiza o pagamento
 * 5. Sistema processa o pagamento e divide o valor conforme as regras
 * 6. Plataforma retém sua taxa (10%)
 * 7. Se houver indicação, o indicador recebe sua parte (5%)
 * 8. Profissional recebe o valor restante (85% ou 90%)
 * 9. Sistema registra a transação e atualiza os saldos
 */
