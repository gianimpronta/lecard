const fs = require('fs');
const axios = require('axios');

// Ler os dados das lojas
const lojas = JSON.parse(fs.readFileSync('lojas_rio_de_janeiro.json', 'utf8'));

console.log(`Geocodificando ${lojas.length} lojas...`);
console.log('Usando serviço Nominatim (OpenStreetMap) - gratuito');

// Função para fazer geocoding com delay para respeitar rate limits
async function geocodificarEndereco(loja, index) {
  try {
    // Construir query de endereço
    const endereco = `${loja.endereco}, ${loja.bairro}, ${loja.cidade}, ${loja.estado}, ${loja.cep}, Brazil`;

    // Usar Nominatim (OpenStreetMap) - gratuito
    const url = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: endereco,
      format: 'json',
      limit: 1,
      countrycodes: 'br'
    };

    const response = await axios.get(url, {
      params,
      headers: {
        'User-Agent': 'LeCard-Mapper/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        ...loja,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        geocoded: true
      };
    } else {
      // Se não encontrar, tentar apenas com bairro e cidade
      const enderecoSimples = `${loja.bairro}, Rio de Janeiro, RJ, Brazil`;
      const response2 = await axios.get(url, {
        params: { ...params, q: enderecoSimples },
        headers: { 'User-Agent': 'LeCard-Mapper/1.0' }
      });

      if (response2.data && response2.data.length > 0) {
        const result = response2.data[0];
        return {
          ...loja,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          geocoded: true,
          geocoded_partial: true
        };
      }

      console.log(`✗ Não foi possível geocodificar: ${loja.nome}`);
      return {
        ...loja,
        latitude: null,
        longitude: null,
        geocoded: false
      };
    }
  } catch (error) {
    console.error(`Erro ao geocodificar ${loja.nome}:`, error.message);
    return {
      ...loja,
      latitude: null,
      longitude: null,
      geocoded: false
    };
  }
}

// Processar em lotes com delay (rate limit do Nominatim: 1 req/segundo)
async function processarLotes() {
  const lojasGeocodificadas = [];
  const batchSize = 50; // Processar em lotes de 50

  for (let i = 0; i < lojas.length; i++) {
    const loja = lojas[i];
    const resultado = await geocodificarEndereco(loja, i);
    lojasGeocodificadas.push(resultado);

    const progresso = ((i + 1) / lojas.length * 100).toFixed(1);
    process.stdout.write(`\rProgresso: ${i + 1}/${lojas.length} (${progresso}%) - ${resultado.geocoded ? '✓' : '✗'} ${loja.nome.substring(0, 40)}`);

    // Delay de 1 segundo entre requisições (rate limit do Nominatim)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Salvar checkpoint a cada 50 lojas
    if ((i + 1) % batchSize === 0) {
      fs.writeFileSync('lojas_geocodificadas_temp.json', JSON.stringify(lojasGeocodificadas, null, 2));
      console.log(`\n✓ Checkpoint salvo: ${i + 1} lojas processadas`);
    }
  }

  console.log('\n\nGeocodificação concluída!');

  const sucesso = lojasGeocodificadas.filter(l => l.geocoded).length;
  const falhas = lojasGeocodificadas.filter(l => !l.geocoded).length;

  console.log(`✓ Sucesso: ${sucesso} lojas`);
  console.log(`✗ Falhas: ${falhas} lojas`);

  // Salvar resultado final
  fs.writeFileSync('lojas_geocodificadas.json', JSON.stringify(lojasGeocodificadas, null, 2));
  console.log('✓ Dados salvos em lojas_geocodificadas.json');

  // Criar versão simplificada para o mapa
  const lojasParaMapa = lojasGeocodificadas
    .filter(l => l.geocoded)
    .map(l => ({
      nome: l.nome,
      tipo: l.tipo,
      endereco: l.endereco,
      bairro: l.bairro,
      cep: l.cep,
      telefone: l.telefone,
      email: l.email,
      lat: l.latitude,
      lng: l.longitude
    }));

  fs.writeFileSync('lojas_mapa.json', JSON.stringify(lojasParaMapa, null, 2));
  console.log(`✓ Arquivo para o mapa salvo: lojas_mapa.json (${lojasParaMapa.length} lojas)`);
}

processarLotes().catch(console.error);
