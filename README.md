# 🗺️ Mapa de Lojas LeCard - Estado do Rio de Janeiro

Sistema de scraping e visualização de estabelecimentos credenciados LeCard em todo o Estado do Rio de Janeiro.

## 🌐 Demo Online

**🚀 Acesse o mapa:** [https://lecard.netlify.app/](https://lecard.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5c6a3d6-8f2b-4a5c-9d1e-3f7b8c9d0e1f/deploy-status)](https://app.netlify.com/sites/lecard/deploys)

## 📁 Arquivos

### Dados
- `lojas_rio_de_janeiro.csv` - Lista completa das lojas (CSV)
- `lojas_rio_de_janeiro.json` - Lista completa das lojas (JSON)
- `lojas_rio_de_janeiro.txt` - Lista formatada para leitura
- `lojas_geocodificadas.json` - Lojas com coordenadas GPS
- `lojas_mapa.json` - Dados otimizados para o mapa

### Scripts
- `scrape-lojas.js` - Extrai lojas do site LeCard
- `limpar-dados-rio.js` - Filtra apenas lojas do Rio de Janeiro
- `geocodificar.js` - Converte endereços em coordenadas GPS

### Web
- `index.html` - Mapa interativo das lojas

## 🚀 Como usar

### 1. Executar Scraping
```bash
# Editar credenciais no .env primeiro
node scrape-lojas.js
```

### 2. Processar Dados
```bash
node limpar-dados-rio.js
```

### 3. Geocodificar Endereços
```bash
# Demora ~7-8 minutos (443 lojas × 1 seg cada)
node geocodificar.js
```

### 4. Visualizar Mapa
```bash
# Abrir o arquivo index.html no navegador
# Ou usar um servidor local:
npx http-server -p 8000
```

Depois acesse: http://localhost:8000

## 🌍 Deploy

### ✅ Netlify (Em Produção)

Este projeto está configurado para deploy automático no Netlify:

- **Deploy automático**: Cada push na branch `main` dispara novo deploy
- **HTTPS**: SSL/TLS automático
- **CDN Global**: Carregamento rápido em qualquer lugar do mundo
- **Formulários**: Suporte nativo (se necessário no futuro)

**Configuração:**
- Arquivo `netlify.toml` define configurações de build
- Deploy direto do repositório GitHub

### Outras Opções

**GitHub Pages:**
- Settings → Pages → Source: main branch
- URL: `https://gianimpronta.github.io/lecard`

**Vercel:**
- Import do GitHub
- Deploy automático similar ao Netlify

## 📊 Estatísticas

- **879 lojas geocodificadas** em todo o Estado do Rio de Janeiro
- **92 cidades** cobertas (de Angra dos Reis a Volta Redonda)
- **11 tipos** de estabelecimentos
- **Dados completos**: Nome, Endereço, Cidade, Bairro, CEP, Telefone, Email
- **100% das lojas no mapa** possuem coordenadas GPS precisas
- **Top 3 cidades**: Petrópolis (107), Barra Mansa (61), São João da Barra (47)

## 🛠️ Tecnologias

- **Scraping**: Playwright
- **Geocoding**: Nominatim (OpenStreetMap) via Netlify Serverless Function
- **Mapa**: Leaflet.js + MarkerCluster
- **Design**: CSS moderno e responsivo
- **Backend**: Netlify Functions (serverless)

## 📝 Notas

- A geocodificação usa serviço gratuito (Nominatim)
- Rate limit: 1 requisição por segundo
- Checkpoints salvos a cada 50 lojas
- Mapa funciona offline após carregar dados

### ⚡ Serverless Function (Geocoding Proxy)

O projeto inclui uma Netlify Function que serve como proxy para geocodificação:

**Localização:** `netlify/functions/geocode.js`

**Features:**
- ✅ Evita bloqueios de CORS/API no navegador
- ✅ Cache em memória (24 horas)
- ✅ Rate limiting automático (1 req/segundo)
- ✅ Headers otimizados para Nominatim
- ✅ Tratamento de erros robusto

**Endpoint:** `/.netlify/functions/geocode?q=endereco`

**Testar localmente:**
```bash
# Instalar Netlify CLI (se não tiver)
npm install -g netlify-cli

# Rodar em modo dev
netlify dev

# Testar endpoint
curl "http://localhost:8888/.netlify/functions/geocode?q=Copacabana"
```

O mapa usa automaticamente esta função em produção e desenvolvimento.

## 🔒 Segurança

- Credenciais armazenadas no `.env`
- Arquivo `.env` não é versionado (`.gitignore`)
- Nunca compartilhe suas credenciais

## 📞 Dados das Lojas

Os dados incluem:
- Nome do estabelecimento
- Tipo (Supermercado, Açougue, etc.)
- Endereço completo
- Bairro
- CEP
- Telefone
- Email

## 🎨 Features do Mapa

- ✅ **Busca por endereço**: Digite seu endereço e encontre as 10 lojas mais próximas
- ✅ **Cálculo de distância**: Distâncias reais em metros/km
- ✅ **Rota visual**: Linha pontilhada do seu local até a loja
- ✅ **Clustering**: Agrupa lojas próximas para melhor visualização
- ✅ **Cores por tipo**: Diferentes cores para cada tipo de estabelecimento
- ✅ **Popups interativos**: Informações completas ao clicar
- ✅ **Responsivo**: Funciona perfeitamente em mobile e desktop
- ✅ **Estatísticas**: Total de lojas, bairros e tipos em tempo real
