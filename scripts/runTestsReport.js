const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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
  const results = [];
  const seen = new Set();

  for (const line of lines) {
    const trimmed = line.trim();
    // Identifica linhas de teste (ex: "✔ 1 - Deve calcular...")
    // Ignora a seção repetida "failing tests:" no final do output
    if ((trimmed.startsWith('✔') || trimmed.startsWith('✖')) && !trimmed.includes('failing tests:')) {
      const isPass = trimmed.startsWith('✔');
      const cleanName = trimmed
        .replace(/^[✔✖]\s*/, '')
        .replace(/\s*\(\d+(\.\d+)?ms\)$/, '')
        .trim();

      // Considera apenas testes numerados (ex: "1 - ...", "2 - ...")
      if (/^\d+\s*-\s*/.test(cleanName) && !seen.has(cleanName)) {
        seen.add(cleanName);
        results.push({
          name: cleanName,
          passed: isPass
        });
      }
    }
  }

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
