# Desafio Prático: Sistema de Checkout & Cashback (E-Commerce) 🛒

Bem-vindo(a) ao seu primeiro desafio prático integrado com **Git & GitHub** da **Dheniarley Lab**!

Neste projeto de vivência real de mercado, você atuará como desenvolvedor(a) júnior implementando o motor de regras de negócio de um sistema de vendas real. 

Você aplicará de forma consolidada todos os conceitos que aprendeu no laboratório:
- **Variáveis e Tipos:** Números decimais (reais), inteiros, textos e booleanos;
- **Operadores Aritméticos:** Descontos percentuais, acréscimos de frete e cashback;
- **Estruturas Condicionais (`if` / `else`):** Regras de frete grátis, cupons VIP e validação de estoque;
- **Laços de Repetição e Coleções:** Cálculo do valor total do carrinho a partir da lista de itens;
- **Modularização (Funções):** Funções limpas, legíveis e com responsabilidade única.

---

## 🤖 Avaliador Automatizado (GitHub Actions)

Este repositório possui um **robô de correção contínua (CI/CD)**!  
Assim que você abrir o seu **Pull Request (PR)**, o GitHub Actions executará os testes automatizados e publicará um comentário detalhado no seu PR informando sua nota e quais requisitos foram aprovados (✔) ou reprovados (❌).

---

## 📋 Requisitos Obrigatórios do Sistema

O arquivo principal a ser desenvolvido é o `src/sistemaCheckout.js`. Cada função possui suas regras de negócio especificadas abaixo:

### 1. `calcularSubtotal(itens)`
- Recebe um array de itens, onde cada item tem `{ nome: string, precoUnitario: number, quantidade: number }`.
- Retorna a soma do valor total dos produtos (`precoUnitario * quantidade`).
- Se a lista estiver vazia, retorna `0`.

### 2. `aplicarCupomDesconto(subtotal, codigoCupom)`
- Aplica um desconto sobre o subtotal de acordo com a tabela de cupons:
  - `"PROMO10"`: 10% de desconto.
  - `"BEMVINDO20"`: 20% de desconto.
  - `"VIP30"`: 30% de desconto (válido apenas se o subtotal for maior ou igual a R$ 100).
- Qualquer outro cupom inválido ou inexistente: não aplica desconto (0%).
- Retorna o novo valor com desconto aplicado.

### 3. `calcularFrete(valorComDesconto, cepDestino, regiao)`
- Regra de Frete Grátis: se `valorComDesconto` for maior ou igual a **R$ 150**, o frete é **R$ 0,00**.
- Caso contrário, calcula conforme a região:
  - `"SUDESTE"`: R$ 15,00
  - `"SUL"`: R$ 20,00
  - `"CENTRO-OESTE"`: R$ 25,00
  - `"NORDESTE"`: R$ 30,00
  - `"NORTE"`: R$ 35,00
  - Outras regiões ou desconhecidas: R$ 40,00

### 4. `calcularCashback(valorFinal, categoriaCliente)`
- Calcula o crédito de cashback gerado para a próxima compra do cliente:
  - `"BRONZE"`: 2% do valor final.
  - `"PRATA"`: 5% do valor final.
  - `"OURO"`: 10% do valor final.
- Retorna o valor de cashback arredondado com 2 casas decimais.

### 5. `finalizarPedido(itens, codigoCupom, cepDestino, regiao, categoriaCliente)`
- Integra todas as funções anteriores e retorna um resumo completo em formato de objeto:
  ```json
  {
    "subtotal": 200.0,
    "valorComDesconto": 160.0,
    "frete": 0.0,
    "totalAPagar": 160.0,
    "cashbackGerado": 16.0,
    "aprovado": true
  }
  ```

---

## 💻 Pré-requisitos & Preparação do Ambiente

Antes de começar a desenvolver o projeto na sua máquina, certifique-se de ter os seguintes recursos preparados:

1. **Git Instalado:** Para controle de versões e gerenciamento de branches.
   - [Baixar Git Oficial](https://git-scm.com/downloads) (verifique com `git --version` no terminal).
2. **Node.js (v18 ou superior):** Necessário para executar a bateria de testes automatizados locais (`npm test`).
   - [Baixar Node.js LTS](https://nodejs.org/) (verifique com `node -v` e `npm -v`).
3. **Editor de Código (Recomendado: VS Code):**
   - [Baixar Visual Studio Code](https://code.visualstudio.com/).
4. **Conta no GitHub com Chave SSH ou Personal Access Token:**
   - Necessário para autenticar no terminal ao clonar (`git clone`) e enviar suas alterações (`git push`).

> 🚀 **Alternativa Sem Instalações (Nuvem):**  
> Se preferir não instalar nada no computador agora, você pode usar o **GitHub Codespaces** direto no navegador!  
> No seu fork, clique no botão verde **`<> Code`** ➔ aba **Codespaces** ➔ **Create codespace on main**. Um VS Code completo no navegador já abrirá com Git e Node.js configurados!

---

## 🛠️ Passo a Passo para Desenvolver e Submeter

### Passo 1: Fazer o Fork
Clique no botão **Fork** (no topo direito deste repositório) para criar uma cópia dele no seu próprio perfil do GitHub.

### Passo 2: Clonar o seu Repositório
Abra o terminal do seu computador (com a sua chave SSH configurada) e clone o seu fork:
```bash
git clone git@github.com:SEU_USUARIO/desafio-git-iniciante.git
cd desafio-git-iniciante
```

### Passo 3: Criar uma Branch de Trabalho
Nunca trabalhe diretamente na branch `main`:
```bash
git checkout -b feature/solucao-checkout
```

### Passo 4: Instalar as Dependências e Rodar os Testes Locais
```bash
npm install
npm test
```
*Dica:* Você pode rodar `npm test` quantas vezes quiser no seu terminal para ver quais requisitos já estão passando!

### Passo 5: Fazer Commits Semânticos
À medida que for resolvendo cada função, salve suas alterações com mensagens padronizadas de mercado:
```bash
git add .
git commit -m "feat: implementar calculo de subtotal e cupons"
```

### Passo 6: Enviar para o seu GitHub e Abrir o Pull Request
```bash
git push -u origin feature/solucao-checkout
```
1. Vá até a página do seu fork no GitHub.
2. Clique no botão verde **"Compare & pull request"**.
3. Confirme a criação do Pull Request contra a branch `main` do repositório oficial.
4. O robô do **GitHub Actions** avaliará seu código em poucos segundos! Copie o link do PR e cole na plataforma para resgatar seus **500 XP**.
