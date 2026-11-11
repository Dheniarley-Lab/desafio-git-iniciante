const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Lista oficial dos 10 requisitos técnicos do projeto
const DEFAULT_CRITERIA = [
  '1 - Aplicar cupom PROMO10 com 10% de desconto',
  '2 - Aplicar cupom BEMVINDO20 com 20% de desconto',
  '3 - Aplicar cupom VIP30 (30%) para compras >= R$ 100',
  '4 - Não conceder desconto para cupons inválidos ou desconhecidos',
  '5 - Conceder frete grátis (R$ 0,00) em compras com desconto >= R$ 150',
  '6 - Calcular tabela de frete por região para compras < R$ 150',
  '7 - Calcular total final somando subtotal com desconto e frete',
  '8 - Calcular cashback por categoria (BRONZE: 2%, PRATA: 5%, OURO: 10%)',
  '9 - Exibir resumo formatado do pedido no terminal',
  '10 - Fluxo integrado de ponta a ponta (Carrinho completo)'
];

// Executa os testes usando o test runner nativo com reporter TAP / spec
const testProcess = spawn(process.execPath, ['--test', 'tests/checkout.test.js'], {
  cwd: path.resolve(__dirname, '..'),
  env: process.env
});

let output = '';

testProcess.stdout.on('data', (data) => {
  output += data.toString();
  process.stdout.write(data);
});

testProcess.stderr.on('data', (data) => {
  output += data.toString();
  process.stderr.write(data);
});

testProcess.on('close', () => {
  const lines = output.split('\n');
  const evaluatedMap = new Map();

  for (const line of lines) {
    const trimmed = line.trim();

    const isSuccess = trimmed.startsWith('✔') || trimmed.startsWith('ok ') || trimmed.includes('✔');
    const isFail = trimmed.startsWith('✖') || trimmed.startsWith('not ok ') || trimmed.includes('✖');

    if ((isSuccess || isFail) && !trimmed.includes('failing tests:')) {
      const isPass = isSuccess && !isFail;
      const cleanName = trimmed
        .replace(/^[✔✖]|^(ok|not ok)\s*\d*\s*-?\s*/i, '')
        .replace(/\s*\(\d+(\.\d+)?ms\)$/, '')
        .trim();

      const matchNum = cleanName.match(/^(\d+)\s*-\s*(.+)/);
      if (matchNum) {
        const num = parseInt(matchNum[1], 10);
        evaluatedMap.set(num, isPass);
      }
    }
  }

  // Montar lista com TODOS os 10 requisitos fixos e garantidos
  const results = DEFAULT_CRITERIA.map((criteriaText, idx) => {
    const num = idx + 1;
    const passed = evaluatedMap.has(num) ? evaluatedMap.get(num) : false;
    return {
      num,
      name: criteriaText,
      passed: Boolean(passed)
    };
  });

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  const report = {
    total,
    passed,
    failed: total - passed,
    percentage: Number(percentage),
    isApproved: Number(percentage) >= 70,
    results
  };

  const reportPath = path.resolve(__dirname, '..', 'resultado_testes.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n[OK] Relatório gerado com sucesso em: ${reportPath}`);

  // Barra de progresso visual com emojis seguros para markdown
  const totalBlocks = 10;
  const filledBlocks = Math.round((Number(percentage) / 100) * totalBlocks);
  const progressBar = '🟩'.repeat(filledBlocks) + '⬜'.repeat(totalBlocks - filledBlocks);

  // Layout Dheniarley Lab com identidade visual própria
  const logoUrl = 'https://raw.githubusercontent.com/Dheniarley-Lab/desafio-git-iniciante/main/assets/logo-dheniarley-lab.png';

  let md = `<div align="center">\n\n`;
  md += `<img src="${logoUrl}" alt="Dheniarley Lab" width="130" />\n\n`;
  md += `## 🚀 Dheniarley Lab — Avaliador de Projetos\n`;
  md += `**Desafio Prático: Sistema de Checkout em Portugol**\n\n`;
  md += `</div>\n\n`;

  md += `### 📊 Painel de Desempenho\n\n`;
  md += `| Métrica | Resultado |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Status** | ${report.isApproved ? '🟢 **Aprovado**' : '🔴 **Insuficiente para aprovação**'} |\n`;
  md += `| **Progresso** | ${progressBar} **${report.percentage}%** (${report.passed}/${report.total} requisitos) |\n`;
  md += `| **Critério Mínimo** | 70% de conformidade |\n\n`;

  md += `### 📋 Checklist de Validação dos Requisitos\n\n`;
  md += `| # | Requisito do Desafio | Status |\n`;
  md += `| :-: | :--- | :-: |\n`;

  for (const r of results) {
    const statusBadge = r.passed ? '✅ Aprovado' : '❌ Pendente';
    md += `| **${r.num}** | ${r.name} | ${statusBadge} |\n`;
  }

  if (report.isApproved) {
    md += `\n---\n`;
    md += `> 🎉 **Excelente trabalho!** Você superou os 70% exigidos e atendeu aos critérios de qualidade do Dheniarley Lab. Seus pontos de XP foram creditados!\n`;
  } else {
    md += `\n---\n`;
    md += `> 💡 **Dica de Engenharia:** Revise os itens marcados como **❌ Pendente**. Ajuste a lógica no arquivo \`sistema_checkout.por\` e faça um novo commit na sua branch para atualizar este painel automaticamente!\n`;
  }

  const mdPath = path.resolve(__dirname, '..', 'feedback_final.md');
  fs.writeFileSync(mdPath, md, 'utf-8');
  console.log(`[OK] Feedback Markdown gerado com sucesso em: ${mdPath}`);
});
