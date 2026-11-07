const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  calcularSubtotal,
  aplicarCupomDesconto,
  calcularFrete,
  calcularCashback,
  finalizarPedido
} = require('../src/sistemaCheckout.js');

describe('Requisitos Obrigatórios do Sistema de Checkout', () => {

  test('1 - Deve calcular o subtotal somando precoUnitario * quantidade para todos os itens', () => {
    const itens = [
      { nome: 'Teclado Mecânico', precoUnitario: 120.50, quantidade: 1 },
      { nome: 'Mouse Gamer', precoUnitario: 80.00, quantidade: 2 }
    ];
    // 120.50 + 160.00 = 280.50
    assert.equal(calcularSubtotal(itens), 280.50);
  });

  test('2 - Deve retornar 0 se a lista de itens estiver vazia', () => {
    assert.equal(calcularSubtotal([]), 0);
  });

  test('3 - Deve aplicar cupom PROMO10 com 10% de desconto corretamente', () => {
    // 100 - 10% = 90
    assert.equal(aplicarCupomDesconto(100, 'PROMO10'), 90);
  });

  test('4 - Deve aplicar cupom BEMVINDO20 com 20% de desconto corretamente', () => {
    // 200 - 20% = 160
    assert.equal(aplicarCupomDesconto(200, 'BEMVINDO20'), 160);
  });

  test('5 - Deve aplicar cupom VIP30 de 30% apenas para subtotal igual ou maior a R$ 100', () => {
    assert.equal(aplicarCupomDesconto(150, 'VIP30'), 105);
    // Subtotal de 80 não atinge o mínimo de 100, então não deve aplicar desconto
    assert.equal(aplicarCupomDesconto(80, 'VIP30'), 80);
  });

  test('6 - Não deve aplicar desconto para cupons inválidos ou desconhecidos', () => {
    assert.equal(aplicarCupomDesconto(100, 'CUPOM_FALSO'), 100);
    assert.equal(aplicarCupomDesconto(100, null), 100);
  });

  test('7 - Deve conceder frete grátis (0.00) se o valor com desconto for maior ou igual a R$ 150', () => {
    assert.equal(calcularFrete(150, '01001-000', 'NORTE'), 0);
    assert.equal(calcularFrete(250, '01001-000', 'SUDESTE'), 0);
  });

  test('8 - Deve calcular o valor do frete por região para compras abaixo de R$ 150', () => {
    assert.equal(calcularFrete(100, '01001-000', 'SUDESTE'), 15.00);
    assert.equal(calcularFrete(100, '80000-000', 'SUL'), 20.00);
    assert.equal(calcularFrete(100, '70000-000', 'CENTRO-OESTE'), 25.00);
    assert.equal(calcularFrete(100, '40000-000', 'NORDESTE'), 30.00);
    assert.equal(calcularFrete(100, '69000-000', 'NORTE'), 35.00);
    assert.equal(calcularFrete(100, '99999-999', 'OUTRA'), 40.00);
  });

  test('9 - Deve calcular cashback conforme categoria (BRONZE: 2%, PRATA: 5%, OURO: 10%)', () => {
    assert.equal(calcularCashback(100, 'BRONZE'), 2.00);
    assert.equal(calcularCashback(100, 'PRATA'), 5.00);
    assert.equal(calcularCashback(100, 'OURO'), 10.00);
    assert.equal(calcularCashback(100, 'OUTRA'), 0.00);
  });

  test('10 - Deve finalizar o pedido integrando todas as regras e retornando o resumo completo', () => {
    const itens = [
      { nome: 'Headset Pro', precoUnitario: 100.00, quantidade: 2 } // Subtotal = 200
    ];
    // Subtotal 200 -> Cupom VIP30 (30%) -> valorComDesconto = 140
    // Valor 140 < 150 -> Frete SUDESTE = 15.00 -> totalAPagar = 155.00
    // Cashback OURO (10% de 155) = 15.50
    const pedido = finalizarPedido(itens, 'VIP30', '01001-000', 'SUDESTE', 'OURO');

    assert.deepEqual(pedido, {
      subtotal: 200,
      valorComDesconto: 140,
      frete: 15.00,
      totalAPagar: 155.00,
      cashbackGerado: 15.50,
      aprovado: true
    });
  });

});
