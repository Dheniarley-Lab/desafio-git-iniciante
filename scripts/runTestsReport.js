const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Lista pré-definida dos 10 requisitos oficiais do projeto
const DEFAULT_CRITERIA = [
  '1 - Deve aplicar cupom PROMO10 com 10% de desconto corretamente',
  '2 - Deve aplicar cupom BEMVINDO20 com 20% de desconto corretamente',
  '3 - Deve aplicar cupom VIP30 (30%) apenas para subtotal >= 100',
  '4 - Não deve aplicar desconto para cupons desconhecidos ou inválidos',
  '5 - Deve conceder frete grátis (0.00) se valor com desconto for maior ou igual a R$ 150',
  '6 - Deve calcular frete correto por região para compras abaixo de R$ 150',
  '7 - Deve somar valor com desconto e frete no total_a_pagar',
  '8 - Deve calcular cashback conforme categoria (BRONZE: 2%, PRATA: 5%, OURO: 10%)',
  '9 - Deve exibir o resumo formatado no console com status concluído',
  '10 - Fluxo integrado completo: subtotal 200, cupom VIP30, frete SUDESTE, categoria OURO'
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
    // Normalizar caracteres para Linux (Actions) e Windows
    const trimmed = line.trim();

    // No Linux/CI os símbolos podem ser ✔/✖ ou ascii tick/cross, ou [eval]/node runner
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

  // Gerar o feedback em Markdown estilo Trybe / GitHub Actions
  let md = `## 📊 Resultado da Avaliação do Projeto\n\n`;
  md += `| Item | Status |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Desempenho** | **${report.isApproved ? '🟢 Aprovado' : '🔴 Insuficiente para aprovação'}** |\n`;
  md += `| **Critério Mínimo** | 70% de aprovação |\n`;
  md += `| **Percentual Cumprido** | **${report.percentage}%** (${report.passed}/${report.total} requisitos) |\n\n`;

  md += `### 📋 Resultado por Requisito\n\n`;
  md += `| Requisito / Critério de Aceite | Avaliação |\n`;
  md += `| :--- | :---: |\n`;

  for (const r of results) {
    const icon = r.passed ? '✔' : '❌';
    md += `| ${r.name} | ${icon} |\n`;
  }

  if (report.isApproved) {
    md += `\n> 🚀 **Parabéns!** Seu projeto atingiu os critérios de aprovação de mercado. Seus pontos de XP foram creditados com sucesso na plataforma!\n`;
  } else {
    md += `\n> ⚠️ **Atenção:** Você precisa de no mínimo 70% de aproveitamento para aprovação. Revise os requisitos com ❌, faça as correções e faça um novo commit na sua branch para reavaliar!\n`;
  }

  const mdPath = path.resolve(__dirname, '..', 'feedback_final.md');
  fs.writeFileSync(mdPath, md, 'utf-8');
  console.log(`[OK] Feedback Markdown gerado com sucesso em: ${mdPath}`);
});
