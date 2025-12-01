const fs = require('fs');

// Ler os dados do mapa
const lojas = JSON.parse(fs.readFileSync('lojas_mapa.json', 'utf8'));

console.log(`Total de lojas: ${lojas.length}`);
console.log('\n🔍 Verificando duplicados...\n');

// Verificar duplicados por nome
const nomes = {};
const duplicadosPorNome = [];

lojas.forEach((loja, index) => {
  const nome = loja.nome.toLowerCase().trim();
  if (nomes[nome]) {
    nomes[nome].push(index);
  } else {
    nomes[nome] = [index];
  }
});

Object.keys(nomes).forEach(nome => {
  if (nomes[nome].length > 1) {
    duplicadosPorNome.push({
      nome: nome,
      indices: nomes[nome],
      count: nomes[nome].length
    });
  }
});

if (duplicadosPorNome.length > 0) {
  console.log(`❌ Encontrados ${duplicadosPorNome.length} nomes duplicados:\n`);
  duplicadosPorNome.forEach(dup => {
    console.log(`  "${dup.nome}" - ${dup.count} ocorrências`);
    dup.indices.forEach(idx => {
      const loja = lojas[idx];
      console.log(`    • ${loja.endereco}, ${loja.bairro} (${loja.lat}, ${loja.lng})`);
    });
    console.log('');
  });
} else {
  console.log('✅ Nenhum nome duplicado encontrado');
}

// Verificar duplicados por coordenadas (mesmo local)
console.log('\n🌍 Verificando lojas no mesmo local (coordenadas iguais)...\n');

const coordenadas = {};
const duplicadosPorCoordenadas = [];

lojas.forEach((loja, index) => {
  const coord = `${loja.lat.toFixed(6)},${loja.lng.toFixed(6)}`;
  if (coordenadas[coord]) {
    coordenadas[coord].push(index);
  } else {
    coordenadas[coord] = [index];
  }
});

Object.keys(coordenadas).forEach(coord => {
  if (coordenadas[coord].length > 1) {
    duplicadosPorCoordenadas.push({
      coord: coord,
      indices: coordenadas[coord],
      count: coordenadas[coord].length
    });
  }
});

if (duplicadosPorCoordenadas.length > 0) {
  console.log(`⚠️  Encontradas ${duplicadosPorCoordenadas.length} localizações com múltiplas lojas:\n`);
  duplicadosPorCoordenadas.slice(0, 10).forEach(dup => {
    console.log(`  Coordenadas: ${dup.coord} - ${dup.count} lojas`);
    dup.indices.forEach(idx => {
      const loja = lojas[idx];
      console.log(`    • ${loja.nome} - ${loja.endereco}`);
    });
    console.log('');
  });

  if (duplicadosPorCoordenadas.length > 10) {
    console.log(`  ... e mais ${duplicadosPorCoordenadas.length - 10} localizações\n`);
  }
} else {
  console.log('✅ Nenhuma coordenada duplicada encontrada');
}

// Verificar endereços muito similares
console.log('\n📍 Verificando endereços similares...\n');

const enderecos = {};
const duplicadosPorEndereco = [];

lojas.forEach((loja, index) => {
  const endereco = `${loja.endereco.toLowerCase().trim()}, ${loja.bairro.toLowerCase().trim()}`;
  if (enderecos[endereco]) {
    enderecos[endereco].push(index);
  } else {
    enderecos[endereco] = [index];
  }
});

Object.keys(enderecos).forEach(endereco => {
  if (enderecos[endereco].length > 1) {
    duplicadosPorEndereco.push({
      endereco: endereco,
      indices: enderecos[endereco],
      count: enderecos[endereco].length
    });
  }
});

if (duplicadosPorEndereco.length > 0) {
  console.log(`❌ Encontrados ${duplicadosPorEndereco.length} endereços duplicados:\n`);
  duplicadosPorEndereco.forEach(dup => {
    console.log(`  "${dup.endereco}" - ${dup.count} ocorrências`);
    dup.indices.forEach(idx => {
      const loja = lojas[idx];
      console.log(`    • ${loja.nome} - ${loja.tipo}`);
    });
    console.log('');
  });
} else {
  console.log('✅ Nenhum endereço duplicado encontrado');
}

// Resumo
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RESUMO DA VERIFICAÇÃO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total de lojas no mapa: ${lojas.length}`);
console.log(`Nomes duplicados: ${duplicadosPorNome.length}`);
console.log(`Endereços duplicados: ${duplicadosPorEndereco.length}`);
console.log(`Localizações com múltiplas lojas: ${duplicadosPorCoordenadas.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Salvar relatório
const relatorio = {
  totalLojas: lojas.length,
  duplicadosPorNome: duplicadosPorNome.length,
  duplicadosPorEndereco: duplicadosPorEndereco.length,
  duplicadosPorCoordenadas: duplicadosPorCoordenadas.length,
  detalhes: {
    nomes: duplicadosPorNome,
    enderecos: duplicadosPorEndereco,
    coordenadas: duplicadosPorCoordenadas.slice(0, 20) // Primeiras 20
  }
};

fs.writeFileSync('relatorio-duplicados.json', JSON.stringify(relatorio, null, 2));
console.log('✓ Relatório salvo em relatorio-duplicados.json\n');
