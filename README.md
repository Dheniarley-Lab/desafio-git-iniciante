# Desafio Prático: Sistema de Checkout & Cashback (E-Commerce) em Portugol 🛒

Bem-vindo(a) ao seu primeiro desafio prático integrado com **Git & GitHub** da **Dheniarley Lab**!

Neste projeto de vivência real de mercado, você atuará como desenvolvedor(a) júnior implementando as regras de negócio de um sistema de vendas real utilizando a sintaxe oficial do **Portugol Webstudio**.

Você aplicará de forma consolidada todos os conceitos que aprendeu nas 150 fases práticas:
- **Variáveis e Tipos:** Números decimais (`real`), inteiros (`inteiro`) e textos (`cadeia`);
- **Operadores Aritméticos:** Descontos percentuais, acréscimos de frete e cashback;
- **Estruturas Condicionais (`se`, `senao se`, `senao`):** Regras de frete grátis, cupons VIP e categorias de fidelidade;
- **Entrada e Saída (`leia` e `escreva`):** Leitura de dados e impressão do recibo formatado.

---

## 🤖 Avaliador Automatizado (GitHub Actions)

Este repositório possui um **robô de correção contínua (CI/CD)**!  
Assim que você abrir o seu **Pull Request (PR)**, o GitHub Actions executará os testes automatizados diretamente sobre o seu código Portugol (`sistema_checkout.por`) e publicará um comentário detalhado no seu PR informando sua nota e quais requisitos foram aprovados (✔) ou reprovados (❌).

---

## 📋 Requisitos Obrigatórios do Sistema

O arquivo principal a ser desenvolvido é o `sistema_checkout.por`. O programa deve ler os dados e aplicar as 4 regras de negócio especificadas abaixo:

### 1. Cupom de Desconto
Aplica um desconto sobre o subtotal de acordo com o código digitado:
- `"PROMO10"`: 10% de desconto (`subtotal * 0.10`).
- `"BEMVINDO20"`: 20% de desconto (`subtotal * 0.20`).
- `"VIP30"`: 30% de desconto (`subtotal * 0.30`), **válido somente se o subtotal for maior ou igual a R$ 100**.
- Qualquer outro cupom: sem desconto (R$ 0,00).

O valor com desconto é: `valor_com_desconto = subtotal - desconto`.

### 2. Frete de Entrega
- **Frete Grátis (R$ 0,00):** se `valor_com_desconto` for maior ou igual a **R$ 150.00**.
- Caso contrário, calcula conforme a região:
  - `"SUDESTE"`: R$ 15,00
  - `"SUL"`: R$ 20,00
  - `"CENTRO-OESTE"`: R$ 25,00
  - `"NORDESTE"`: R$ 30,00
  - `"NORTE"`: R$ 35,00
  - Outras regiões ou desconhecidas: R$ 40,00

O total a pagar é: `total_a_pagar = valor_com_desconto + frete`.

### 3. Cashback para Próxima Compra
Calculado sobre o `total_a_pagar` de acordo com a categoria de cliente:
- `"BRONZE"`: 2% (`total_a_pagar * 0.02`).
- `"PRATA"`: 5% (`total_a_pagar * 0.05`).
- `"OURO"`: 10% (`total_a_pagar * 0.10`).
- Outras categorias: 0%.

### 4. Resumo Formatado
O programa exibe o recibo completo na tela usando comandos `escreva`, informando o subtotal, desconto, valor com desconto, frete, total a pagar e cashback gerado.

---

## 🛠️ Passo a Passo com Git & GitHub

### Passo 1: Fazer o Fork
Clique no botão **Fork** (no topo direito deste repositório) para criar uma cópia dele no seu perfil do GitHub.

### Passo 2: Clonar o seu Repositório
Abra o terminal do seu computador e clone o seu fork:
```bash
git clone https://github.com/SEU_USUARIO/desafio-git-iniciante.git
cd desafio-git-iniciante
```

### Passo 3: Criar uma Nova Branch
Crie e alterne para uma branch de desenvolvimento:
```bash
git checkout -b feature/solucao-checkout
```

### Passo 4: Desenvolver o Código em Portugol
Abra o arquivo `sistema_checkout.por` no **Portugol Webstudio** (ou no seu editor favorito como VS Code) e preencha a lógica dos passos 1 a 4.

> 💡 **Como testar localmente:**  
> Se tiver o Node instalado na sua máquina, você pode rodar `npm test` a qualquer momento para ver quais critérios já passaram!

### Passo 5: Salvar suas Versões com Commits Semânticos
```bash
git add sistema_checkout.por
git commit -m "feat: implementar regras de desconto, frete e cashback em portugol"
```

### Passo 6: Enviar para o seu GitHub
```bash
git push -u origin feature/solucao-checkout
```

### Passo 7: Abrir o Pull Request
1. Acesse o seu repositório no GitHub.
2. Clique em **Compare & pull request**.
3. Abra o PR contra a branch `main` do repositório oficial.
4. O robô de CI/CD avaliará seu código automaticamente e dará o feedback!
5. Copie o link do seu PR aberto e cole no portal **Dheniarley Lab** para resgatar sua pontuação de XP!
