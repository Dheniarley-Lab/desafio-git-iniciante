programa {
  funcao inicio() {
    // ========================================================
    // DESAFIO PRÁTICO: SISTEMA DE CHECKOUT E-COMMERCE
    // Plataforma: Dheniarley Lab
    // ========================================================
    //
    // Este programa simula o fechamento de um pedido de compras.
    // Você aplicará tudo o que aprendeu nas fases práticas de Portugol:
    // variáveis, leitura de dados, operações aritméticas e estruturas condicionais (se/senao).
    //
    // --------------------------------------------------------
    // ENTRADAS DO PROGRAMA (nesta exata ordem com leia):
    // 1. subtotal (real): valor dos produtos no carrinho
    // 2. cupom (cadeia): código do cupom digitado
    // 3. regiao (cadeia): região de entrega (SUDESTE, SUL, etc.)
    // 4. categoria (cadeia): categoria do cliente (BRONZE, PRATA, OURO ou NORMAL)
    // --------------------------------------------------------

    real subtotal
    cadeia cupom
    cadeia regiao
    cadeia categoria

    // 1. Leitura das informações da compra
    escreva("Digite o subtotal da compra: ")
    leia(subtotal)

    escreva("Digite o código do cupom (ou SEM_CUPOM): ")
    leia(cupom)

    escreva("Digite a região de entrega: ")
    leia(regiao)

    escreva("Digite a categoria do cliente (BRONZE, PRATA, OURO ou NORMAL): ")
    leia(categoria)

    // ========================================================
    // PASSO 1: APLICAR CUPOM DE DESCONTO SOBRE O SUBTOTAL
    // Regras:
    // - Se cupom == "PROMO10"    -> 10% de desconto (subtotal * 0.10)
    // - Se cupom == "BEMVINDO20" -> 20% de desconto (subtotal * 0.20)
    // - Se cupom == "VIP30" e subtotal >= 100 -> 30% de desconto (subtotal * 0.30)
    // - Qualquer outro cupom: 0% de desconto
    // ========================================================
    real desconto = 0.0

    // TODO: Implemente a validação do cupom aqui com se / senao se:
    se (cupom == "PROMO10") {
      desconto = subtotal * 0.10
    } senao se (cupom == "BEMVINDO20") {
      desconto = subtotal * 0.20
    } senao se (cupom == "VIP30" e subtotal >= 100) {
      desconto = subtotal * 0.30
    }

    real valor_com_desconto = subtotal - desconto

    // ========================================================
    // PASSO 2: CALCULAR O FRETE DE ENTREGA
    // Regras:
    // - Se valor_com_desconto >= 150.0 -> Frete Grátis (0.00)
    // - Senão, calcular conforme a região:
    //     SUDESTE      -> 15.00
    //     SUL          -> 20.00
    //     CENTRO-OESTE -> 25.00
    //     NORDESTE     -> 30.00
    //     NORTE        -> 35.00
    //     Outras       -> 40.00
    // ========================================================
    real frete = 0.0

    // TODO: Implemente a lógica do frete aqui com se / senao se:


    // ========================================================
    // PASSO 3: CALCULAR TOTAL A PAGAR
    // total = valor_com_desconto + frete
    // ========================================================
    real total_a_pagar = valor_com_desconto + frete

    // ========================================================
    // PASSO 4: CALCULAR O CASHBACK GERADO
    // Calculado sobre o total_a_pagar:
    // - Se categoria == "BRONZE" -> 2% (total_a_pagar * 0.02)
    // - Se categoria == "PRATA"  -> 5% (total_a_pagar * 0.05)
    // - Se categoria == "OURO"   -> 10% (total_a_pagar * 0.10)
    // - Outras                  -> 0%
    // ========================================================
    real cashback = 0.0

    // TODO: Implemente o cálculo do cashback aqui com se / senao se:


    // ========================================================
    // PASSO 5: EXIBIÇÃO DO RECIBO FINAL DO PEDIDO
    // O sistema imprime o resumo formatado:
    // ========================================================
    escreva("\n========================================\n")
    escreva("RESUMO DO PEDIDO - DHENIARLEY LAB\n")
    escreva("========================================\n")
    escreva("Subtotal: R$ ", subtotal, "\n")
    escreva("Desconto: R$ ", desconto, "\n")
    escreva("Valor com Desconto: R$ ", valor_com_desconto, "\n")
    escreva("Frete: R$ ", frete, "\n")
    escreva("Total a Pagar: R$ ", total_a_pagar, "\n")
    escreva("Cashback Gerado: R$ ", cashback, "\n")
    escreva("Status: Pedido Concluido com Sucesso!\n")
    escreva("========================================\n")
  }
}
