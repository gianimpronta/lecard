# 🗺️ Mapa de Lojas LeCard - Rio de Janeiro

Sistema de scraping e visualização de estabelecimentos credenciados LeCard no Rio de Janeiro.

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

## 🌍 Publicar na Internet

### Opção 1: GitHub Pages (Gratuito)
1. Crie um repositório no GitHub
2. Faça upload dos arquivos:
   - index.html
   - lojas_mapa.json
3. Ative GitHub Pages nas configurações
4. Acesse: https://seu-usuario.github.io/seu-repo

### Opção 2: Netlify (Gratuito)
1. Crie conta em https://netlify.com
2. Arraste a pasta do projeto
3. Pronto! URL gerada automaticamente

### Opção 3: Vercel (Gratuito)
1. Crie conta em https://vercel.com
2. Import do GitHub ou upload direto
3. Deploy automático

## 📊 Estatísticas

- **443 lojas** no Rio de Janeiro
- **Tipos**: Supermercados, Açougues, Mercearias, etc.
- **Dados**: Nome, Endereço, Bairro, CEP, Telefone, Email

## 🛠️ Tecnologias

- **Scraping**: Playwright
- **Geocoding**: Nominatim (OpenStreetMap)
- **Mapa**: Leaflet.js + MarkerCluster
- **Design**: CSS moderno e responsivo

## 📝 Notas

- A geocodificação usa serviço gratuito (Nominatim)
- Rate limit: 1 requisição por segundo
- Checkpoints salvos a cada 50 lojas
- Mapa funciona offline após carregar dados

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

- ✅ Clustering de marcadores (agrupa lojas próximas)
- ✅ Cores por tipo de estabelecimento
- ✅ Popups com informações detalhadas
- ✅ Responsivo (mobile-friendly)
- ✅ Estatísticas (total de lojas, bairros, tipos)
- ✅ Zoom e navegação suave
