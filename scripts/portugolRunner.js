// Interpretador Portugol para execução dos testes automatizados no GitHub Actions
function transpilePortugolToJs(code) {
  let jsLines = [];
  const lines = code.split(/\r?\n/);
  
  jsLines.push('let subtotal = 0, cupom = "", regiao = "", categoria = "";');
  jsLines.push('let desconto = 0, valor_com_desconto = 0, frete = 0, total_a_pagar = 0, cashback = 0;');
  jsLines.push('let _output = [];');
  jsLines.push('function escreva(...args) { _output.push(args.join("")); }');

  // Filtrar as duas últimas chaves de fechamento de "programa {" e "funcao inicio() {"
  let cleanRawLines = [];
  for (let raw of lines) {
    let line = raw.split('//')[0].trim();
    if (!line) continue;
    cleanRawLines.push(line);
  }

  // Se as últimas duas linhas forem "}", remove-las pois fecham programa e funcao inicio
  if (cleanRawLines.length > 0 && cleanRawLines[cleanRawLines.length - 1] === '}') {
    cleanRawLines.pop();
  }
  if (cleanRawLines.length > 0 && cleanRawLines[cleanRawLines.length - 1] === '}') {
    cleanRawLines.pop();
  }

  for (let line of cleanRawLines) {
    if (/^programa\b/i.test(line) || /^funcao\s+inicio/i.test(line)) continue;
    if (line === '{') continue;

    if (line === '}') {
      jsLines.push('}');
      continue;
    }

    // leia(var)
    const readM = line.match(/^leia\s*\(\s*([a-zA-Z0-9_]+)\s*\)/i);
    if (readM) {
      const v = readM[1];
      jsLines.push(`${v} = _inputs.shift();`);
      continue;
    }

    // escreva(...)
    const writeM = line.match(/^escreva\s*\((.*)\)/i);
    if (writeM) {
      jsLines.push(`escreva(${writeM[1]});`);
      continue;
    }

    // Declarações simples sem inicialização (ex: real subtotal, cadeia cupom)
    if (/^(real|inteiro|cadeia|logico)\s+[a-zA-Z0-9_]+$/i.test(line)) {
      continue;
    }

    // Declarações com inicialização: real desconto = 0.0 -> desconto = 0.0
    line = line.replace(/^(real|inteiro|cadeia|logico)\s+/i, '');

    let transformed = line;

    // senao se -> } else if
    if (/^\}\s*senao\s+se\s*\(/i.test(transformed) || /^senao\s+se\s*\(/i.test(transformed)) {
      transformed = transformed.replace(/^(\}\s*)?senao\s+se\s*\((.*)\)\s*\{?$/i, '} else if ($2) {');
    } else if (/^\}\s*senao\s*\{?$/i.test(transformed) || /^senao\s*\{?$/i.test(transformed)) {
      transformed = '} else {';
    } else if (/^se\s*\(/i.test(transformed)) {
      transformed = transformed.replace(/^se\s*\((.*)\)\s*\{?$/i, 'if ($1) {');
    }

    // converter " e " para " && " e " ou " para " || "
    transformed = transformed.replace(/\s+e\s+/gi, ' && ').replace(/\s+ou\s+/gi, ' || ');

    jsLines.push(transformed);
  }

  return jsLines.join('\n');
}

function executePortugol(code, inputList) {
  const transpiled = transpilePortugolToJs(code);
  const fnBody = `
    const _inputs = [..._inputList];
    ${transpiled}
    return {
      finalOutput: _output,
      memory: {
        subtotal: { value: subtotal },
        cupom: { value: cupom },
        regiao: { value: regiao },
        categoria: { value: categoria },
        desconto: { value: desconto },
        valor_com_desconto: { value: valor_com_desconto },
        frete: { value: frete },
        total_a_pagar: { value: total_a_pagar },
        cashback: { value: cashback }
      }
    };
  `;

  try {
    const fn = new Function('_inputList', fnBody);
    return fn(inputList);
  } catch (err) {
    return { finalOutput: [], memory: {}, error: err.message };
  }
}

module.exports = { executePortugol, transpilePortugolToJs };
