const fs = require('fs');

// Ler o arquivo JSON com todos os dados
const lojasData = JSON.parse(fs.readFileSync('lojas_raw.json', 'utf8'));

// Filtrar apenas lojas do Rio de Janeiro
const lojasRioDeJaneiro = lojasData.filter(loja => {
  const texto = loja.texto;
  // Verificar se contém "Rio de Janeiro / RJ" (cidade, estado)
  return texto.includes('Rio de Janeiro / RJ');
});

console.log(`Total de lojas encontradas: ${lojasData.length}`);
console.log(`Lojas do Rio de Janeiro / RJ: ${lojasRioDeJaneiro.length}`);

// Processar os dados para extrair informações estruturadas
const lojasProcessadas = lojasRioDeJaneiro.map(loja => {
  if (loja.tipo === 'table' && loja.dados && loja.dados.length >= 4) {
    const [nome, tipo, endereco, telefone, email, ...resto] = loja.dados;

    // Extrair bairro e CEP do endereço
    let bairro = '';
    let cep = '';
    let enderecoLimpo = endereco;

    // Pattern: ..., Bairro, Rio de Janeiro / RJ CEP: XXXXX-XXX
    const match = endereco.match(/,\s*([^,]+),\s*Rio de Janeiro\s*\/\s*RJ\s*CEP:\s*(\d{5}-\d{3})/i);
    if (match) {
      bairro = match[1].trim();
      cep = match[2];
      enderecoLimpo = endereco.substring(0, match.index);
    }

    return {
      nome: nome || '',
      tipo: tipo || '',
      endereco: enderecoLimpo || '',
      bairro: bairro,
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: cep,
      telefone: telefone || '',
      email: email || ''
    };
  } else {
    // Para dados não estruturados, tentar extrair do texto
    const texto = loja.texto;
    return {
      nome: '',
      tipo: '',
      endereco: texto,
      bairro: '',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '',
      telefone: '',
      email: ''
    };
  }
});

// Salvar em CSV formatado
const csvLines = ['Nome,Tipo,Endereço,Bairro,Cidade,Estado,CEP,Telefone,Email'];

lojasProcessadas.forEach(loja => {
  const linha = [
    `"${loja.nome.replace(/"/g, '""')}"`,
    `"${loja.tipo.replace(/"/g, '""')}"`,
    `"${loja.endereco.replace(/"/g, '""')}"`,
    `"${loja.bairro.replace(/"/g, '""')}"`,
    `"${loja.cidade}"`,
    `"${loja.estado}"`,
    `"${loja.cep}"`,
    `"${loja.telefone.replace(/"/g, '""')}"`,
    `"${loja.email.replace(/"/g, '""')}"`
  ].join(',');

  csvLines.push(linha);
});

fs.writeFileSync('lojas_rio_de_janeiro.csv', csvLines.join('\n'));
console.log('✓ CSV limpo salvo em lojas_rio_de_janeiro.csv');

// Salvar também em JSON
fs.writeFileSync('lojas_rio_de_janeiro.json', JSON.stringify(lojasProcessadas, null, 2));
console.log('✓ JSON salvo em lojas_rio_de_janeiro.json');

// Criar um arquivo de texto mais legível
const textoFormatado = lojasProcessadas.map((loja, i) => {
  return `
${i + 1}. ${loja.nome}
   Tipo: ${loja.tipo}
   Endereço: ${loja.endereco}
   Bairro: ${loja.bairro}
   CEP: ${loja.cep}
   Telefone: ${loja.telefone}
   Email: ${loja.email}
`.trim();
}).join('\n\n');

fs.writeFileSync('lojas_rio_de_janeiro.txt', textoFormatado);
console.log('✓ Arquivo de texto formatado salvo em lojas_rio_de_janeiro.txt');

console.log(`\n✓ Total de ${lojasProcessadas.length} lojas do Rio de Janeiro extraídas com sucesso!`);
