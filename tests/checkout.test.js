const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { executePortugol } = require('../scripts/portugolRunner');

const porFilePath = path.resolve(__dirname, '..', 'sistema_checkout.por');
const porCode = fs.readFileSync(porFilePath, 'utf-8');

describe('Requisitos Obrigatórios: Sistema de Checkout em Portugol', () => {

  test('1 - Deve aplicar cupom PROMO10 com 10% de desconto corretamente', () => {
    // subtotal = 100, cupom = PROMO10, regiao = SUDESTE, categoria = NORMAL
    const { memory } = executePortugol(porCode, [100, 'PROMO10', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(memory.desconto?.value), 10);
    assert.equal(Number(memory.valor_com_desconto?.value), 90);
  });

  test('2 - Deve aplicar cupom BEMVINDO20 com 20% de desconto corretamente', () => {
    // subtotal = 200, cupom = BEMVINDO20, regiao = SUDESTE, categoria = NORMAL
    const { memory } = executePortugol(porCode, [200, 'BEMVINDO20', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(memory.desconto?.value), 40);
    assert.equal(Number(memory.valor_com_desconto?.value), 160);
  });

  test('3 - Deve aplicar cupom VIP30 (30%) apenas para subtotal >= 100', () => {
    // Subtotal 150 >= 100 -> Desconto 30% = 45
    const resApto = executePortugol(porCode, [150, 'VIP30', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(resApto.memory.desconto?.value), 45);

    // Subtotal 80 < 100 -> Desconto = 0
    const resInapto = executePortugol(porCode, [80, 'VIP30', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(resInapto.memory.desconto?.value), 0);
  });

  test('4 - Não deve aplicar desconto para cupons desconhecidos ou inválidos', () => {
    const { memory } = executePortugol(porCode, [100, 'CUPOM_INVALIDO', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(memory.desconto?.value), 0);
    assert.equal(Number(memory.valor_com_desconto?.value), 100);
  });

  test('5 - Deve conceder frete grátis (0.00) se valor com desconto for maior ou igual a R$ 150', () => {
    // 200 sem desconto = 200 >= 150 -> frete = 0
    const { memory } = executePortugol(porCode, [200, 'SEM_CUPOM', 'NORTE', 'NORMAL']);
    assert.equal(Number(memory.frete?.value), 0);
  });

  test('6 - Deve calcular frete correto por região para compras abaixo de R$ 150', () => {
    // SUDESTE = 15.00
    const rSudeste = executePortugol(porCode, [100, 'SEM_CUPOM', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(rSudeste.memory.frete?.value), 15);

    // SUL = 20.00
    const rSul = executePortugol(porCode, [100, 'SEM_CUPOM', 'SUL', 'NORMAL']);
    assert.equal(Number(rSul.memory.frete?.value), 20);

    // NORDESTE = 30.00
    const rNordeste = executePortugol(porCode, [100, 'SEM_CUPOM', 'NORDESTE', 'NORMAL']);
    assert.equal(Number(rNordeste.memory.frete?.value), 30);
  });

  test('7 - Deve somar valor com desconto e frete no total_a_pagar', () => {
    // 100 - 10 (PROMO10) = 90 + 15 (SUDESTE) = 105
    const { memory } = executePortugol(porCode, [100, 'PROMO10', 'SUDESTE', 'NORMAL']);
    assert.equal(Number(memory.total_a_pagar?.value), 105);
  });

  test('8 - Deve calcular cashback conforme categoria (BRONZE: 2%, PRATA: 5%, OURO: 10%)', () => {
    // Total 100 com categoria OURO -> 10% = 10.00
    const rOuro = executePortugol(porCode, [200, 'SEM_CUPOM', 'SUDESTE', 'OURO']); // total 200 -> 20 cashback
    assert.equal(Number(rOuro.memory.cashback?.value), 20);

    // Categoria PRATA -> 5%
    const rPrata = executePortugol(porCode, [200, 'SEM_CUPOM', 'SUDESTE', 'PRATA']);
    assert.equal(Number(rPrata.memory.cashback?.value), 10);

    // Categoria BRONZE -> 2%
    const rBronze = executePortugol(porCode, [200, 'SEM_CUPOM', 'SUDESTE', 'BRONZE']);
    assert.equal(Number(rBronze.memory.cashback?.value), 4);
  });

  test('9 - Deve exibir o resumo formatado no console com status concluído', () => {
    const { finalOutput } = executePortugol(porCode, [100, 'PROMO10', 'SUDESTE', 'OURO']);
    const allOut = finalOutput.join(' ');
    assert.match(allOut, /RESUMO DO PEDIDO/i);
    assert.match(allOut, /Total a Pagar:/i);
    assert.match(allOut, /Pedido Concluido/i);
  });

  test('10 - Fluxo integrado completo: subtotal 200, cupom VIP30, frete SUDESTE, categoria OURO', () => {
    // 200 - 30% (VIP30) = 140
    // 140 < 150 -> frete SUDESTE = 15 -> total = 155
    // cashback OURO = 10% de 155 = 15.5
    const { memory } = executePortugol(porCode, [200, 'VIP30', 'SUDESTE', 'OURO']);
    assert.equal(Number(memory.subtotal?.value), 200);
    assert.equal(Number(memory.desconto?.value), 60);
    assert.equal(Number(memory.valor_com_desconto?.value), 140);
    assert.equal(Number(memory.frete?.value), 15);
    assert.equal(Number(memory.total_a_pagar?.value), 155);
    assert.equal(Number(memory.cashback?.value), 15.5);
  });

});
