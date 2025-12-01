const fs = require('fs');

// Ler os dados do mapa
const lojas = JSON.parse(fs.readFileSync('lojas_mapa.json', 'utf8'));

console.log(`Total de lojas original: ${lojas.length}`);
console.log('\n🧹 Removendo duplicados...\n');

// Criar um Map para rastrear lojas únicas por endereço + bairro
const lojasUnicas = new Map();
const duplicadosRemovidos = [];

lojas.forEach((loja, index) => {
  // Criar chave única baseada em endereço e bairro (normalizado)
  const chave = `${loja.endereco.toLowerCase().trim()}|${loja.bairro.toLowerCase().trim()}`;

  if (lojasUnicas.has(chave)) {
    // Duplicado encontrado
    const lojaExistente = lojasUnicas.get(chave);

    // Manter a loja com nome mais completo (maior)
    if (loja.nome.length > lojaExistente.nome.length) {
      duplicadosRemovidos.push({
        removido: lojaExistente.nome,
        mantido: loja.nome,
        endereco: loja.endereco,
        bairro: loja.bairro
      });
      lojasUnicas.set(chave, loja);
    } else {
      duplicadosRemovidos.push({
        removido: loja.nome,
        mantido: lojaExistente.nome,
        endereco: loja.endereco,
        bairro: loja.bairro
      });
    }
  } else {
    // Primeira ocorrência, adicionar ao Map
    lojasUnicas.set(chave, loja);
  }
});

const lojasLimpas = Array.from(lojasUnicas.values());

console.log(`✓ Total de lojas após remoção: ${lojasLimpas.length}`);
console.log(`✓ Duplicados removidos: ${duplicadosRemovidos.length}\n`);

if (duplicadosRemovidos.length > 0) {
  console.log('📋 Lojas duplicadas removidas:\n');
  duplicadosRemovidos.forEach((dup, i) => {
    console.log(`${i + 1}. Removido: "${dup.removido}"`);
    console.log(`   Mantido: "${dup.mantido}"`);
    console.log(`   Local: ${dup.endereco}, ${dup.bairro}\n`);
  });
}

// Salvar backup do arquivo original
fs.writeFileSync('lojas_mapa_original.json', JSON.stringify(lojas, null, 2));
console.log('💾 Backup salvo em: lojas_mapa_original.json');

// Salvar arquivo limpo
fs.writeFileSync('lojas_mapa.json', JSON.stringify(lojasLimpas, null, 2));
console.log('✓ Arquivo limpo salvo em: lojas_mapa.json');

// Salvar relatório
const relatorio = {
  totalOriginal: lojas.length,
  totalLimpo: lojasLimpas.length,
  duplicadosRemovidos: duplicadosRemovidos.length,
  detalhes: duplicadosRemovidos
};

fs.writeFileSync('relatorio-remocao.json', JSON.stringify(relatorio, null, 2));
console.log('✓ Relatório salvo em: relatorio-remocao.json');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ LIMPEZA CONCLUÍDA!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📊 ${lojasLimpas.length} lojas únicas no mapa`);
console.log(`🗑️  ${duplicadosRemovidos.length} duplicados removidos`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
