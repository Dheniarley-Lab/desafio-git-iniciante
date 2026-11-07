/**
 * DESAFIO PRÁTICO: SISTEMA DE CHECKOUT & CASHBACK
 * Plataforma: Dheniarley Lab
 * 
 * Instruções:
 * Implemente as funções abaixo de acordo com as regras de negócio
 * especificadas no arquivo README.md.
 * 
 * Para testar seu código a qualquer momento, execute no terminal:
 * npm test
 */

/**
 * 1. Calcula a soma total dos produtos do carrinho.
 * @param {Array<{ nome: string, precoUnitario: number, quantidade: number }>} itens 
 * @returns {number} Subtotal dos produtos
 */
function calcularSubtotal(itens) {
  // TODO: Implemente seu código aqui
  return 0;
}

/**
 * 2. Aplica cupom de desconto sobre o subtotal.
 * Cupons aceitos:
 * - "PROMO10": 10% de desconto
 * - "BEMVINDO20": 20% de desconto
 * - "VIP30": 30% de desconto (somente para subtotal >= 100)
 * @param {number} subtotal 
 * @param {string} codigoCupom 
 * @returns {number} Valor com desconto aplicado
 */
function aplicarCupomDesconto(subtotal, codigoCupom) {
  // TODO: Implemente seu código aqui
  return subtotal;
}

/**
 * 3. Calcula o frete de entrega.
 * Regras:
 * - Frete Grátis (0.00) se o valor com desconto for maior ou igual a R$ 150.
 * - Regiões:
 *   "SUDESTE": 15.00
 *   "SUL": 20.00
 *   "CENTRO-OESTE": 25.00
 *   "NORDESTE": 30.00
 *   "NORTE": 35.00
 *   Demais regiões: 40.00
 * @param {number} valorComDesconto 
 * @param {string} cepDestino 
 * @param {string} regiao 
 * @returns {number} Valor do frete
 */
function calcularFrete(valorComDesconto, cepDestino, regiao) {
  // TODO: Implemente seu código aqui
  return 0;
}

/**
 * 4. Calcula o valor em reais de cashback para a próxima compra.
 * Categorias:
 * - "BRONZE": 2% do valor final
 * - "PRATA": 5% do valor final
 * - "OURO": 10% do valor final
 * - Outras: 0%
 * @param {number} valorFinal 
 * @param {string} categoriaCliente 
 * @returns {number} Valor do cashback arredondado com 2 casas decimais
 */
function calcularCashback(valorFinal, categoriaCliente) {
  // TODO: Implemente seu código aqui
  return 0;
}

/**
 * 5. Integra todas as etapas anteriores e finaliza o pedido.
 * Retorna um objeto contendo:
 * {
 *   subtotal: number,
 *   valorComDesconto: number,
 *   frete: number,
 *   totalAPagar: number,
 *   cashbackGerado: number,
 *   aprovado: boolean
 * }
 */
function finalizarPedido(itens, codigoCupom, cepDestino, regiao, categoriaCliente) {
  // TODO: Implemente seu código aqui
  return {
    subtotal: 0,
    valorComDesconto: 0,
    frete: 0,
    totalAPagar: 0,
    cashbackGerado: 0,
    aprovado: false
  };
}

module.exports = {
  calcularSubtotal,
  aplicarCupomDesconto,
  calcularFrete,
  calcularCashback,
  finalizarPedido
};
