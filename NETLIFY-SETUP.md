# 🚀 Guia de Deploy no Netlify

## ✅ Status

Deploy configurado e pronto! O Netlify irá automaticamente:
- Detectar mudanças na branch `main`
- Fazer build (não necessário para site estático)
- Publicar automaticamente

## 📋 Checklist de Configuração

### 1. Conectar Repositório GitHub

1. Acesse: https://app.netlify.com
2. Clique em "Add new site" → "Import an existing project"
3. Escolha "GitHub"
4. Selecione o repositório: `gianimpronta/lecard`
5. Configure:
   - **Branch to deploy:** `main`
   - **Build command:** (deixe vazio)
   - **Publish directory:** `.` (raiz)
6. Clique em "Deploy site"

### 2. Configurações Aplicadas Automaticamente

O arquivo `netlify.toml` já configura:
- ✅ Diretório de publicação
- ✅ Headers de segurança
- ✅ Políticas de cache
- ✅ Redirects (SPA fallback)
- ✅ Variáveis de ambiente por contexto

### 3. URL Personalizada (Opcional)

Após o deploy inicial:

1. **Site settings** → **Domain management**
2. **Custom domains** → **Add custom domain**
3. Digite seu domínio (ex: `mapa.seusite.com`)
4. Siga instruções para configurar DNS

**Ou use domínio gratuito do Netlify:**
1. **Domain settings** → **Edit site name**
2. Mude de `random-name-123.netlify.app` para `lecard-rio.netlify.app`

### 4. Badge de Status (Opcional)

Adicione ao README.md:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/SEU-SITE-ID/deploy-status)](https://app.netlify.com/sites/SEU-NOME-SITE/deploys)
```

Encontre seu badge em: **Site settings** → **Status badges**

### 5. HTTPS

✅ **Automático!** O Netlify provisiona certificado SSL gratuito via Let's Encrypt.

## 🔧 Variáveis de Ambiente

Se precisar adicionar variáveis de ambiente no futuro:

1. **Site settings** → **Environment variables**
2. Adicionar variáveis necessárias
3. **NÃO** commitar `.env` no Git!

## 📊 Monitoramento

### Analytics (Grátis no plano básico)

1. **Site settings** → **Analytics**
2. Ver estatísticas de acesso, bandwidth, etc.

### Deploy Logs

Ver logs de cada deploy em: **Deploys** → Clicar no deploy → **Deploy log**

## 🚨 Troubleshooting

### Deploy falhou?

1. Verificar **Deploy log** para ver o erro
2. Confirmar que `netlify.toml` está na raiz
3. Verificar se branch `main` tem os arquivos necessários:
   - `index.html`
   - `lojas_mapa.json`

### Site não carrega?

1. Verificar se `index.html` está na raiz do projeto
2. Conferir **Deploy log** - deve mostrar "Site is live"
3. Limpar cache do navegador

### Arquivos JSON não carregam?

1. Verificar headers em `_headers` ou `netlify.toml`
2. Confirmar que `lojas_mapa.json` foi commitado
3. Testar URL direta: `https://seu-site.netlify.app/lojas_mapa.json`

## 🔄 Workflow de Atualização

### Para atualizar o site:

```bash
# 1. Fazer alterações localmente
# 2. Testar localmente
npx http-server -p 8000

# 3. Commit e push
git add .
git commit -m "Descrição da mudança"
git push origin main

# 4. Netlify faz deploy automaticamente!
# Aguardar ~30 segundos
```

### Deploy Preview (Branches)

Criar branch para testar mudanças:

```bash
git checkout -b feature/nova-funcionalidade
# Fazer alterações
git push origin feature/nova-funcionalidade
```

Netlify cria **Deploy Preview** automaticamente!
URL: `https://deploy-preview-X--seu-site.netlify.app`

## 📱 Features do Netlify

### Ativadas no Projeto:

- ✅ **Deploy automático** de `main`
- ✅ **Deploy previews** de pull requests
- ✅ **SSL/TLS** automático (HTTPS)
- ✅ **CDN Global** (200+ localizações)
- ✅ **Headers customizados** (segurança)
- ✅ **Cache otimizado** (performance)

### Disponíveis para Ativar:

- 📧 **Form handling** (formulários)
- 🔒 **Identity** (autenticação)
- ⚡ **Edge Functions** (serverless)
- 🎨 **Asset optimization** (compressão)

## 💰 Limites do Plano Gratuito

- ✅ **100 GB/mês** de bandwidth
- ✅ **Deploys ilimitados**
- ✅ **Sites ilimitados**
- ✅ **1 membro** da equipe
- ✅ **300 minutos/mês** de build

**Nosso uso estimado:**
- Bandwidth: ~1-5 GB/mês (baixo, site estático)
- Build time: 0 minutos (sem build)
- Storage: ~150 KB (muito baixo)

## 🎯 Otimizações Aplicadas

### Cache Headers

```
HTML: max-age=0 (sempre atualizado)
JSON: max-age=3600 (1 hora)
CSS/JS: max-age=31536000 (1 ano, immutable)
```

### Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Compressão

- Gzip automático
- Brotli automático (ainda melhor)

## 📞 Suporte

- **Documentação:** https://docs.netlify.com
- **Community:** https://answers.netlify.com
- **Status:** https://www.netlifystatus.com

## ✨ Próximos Passos

Após o primeiro deploy bem-sucedido:

1. ✅ Anotar URL do site
2. ✅ Atualizar README.md com URL real
3. ✅ Adicionar badge de status
4. ✅ Configurar domínio customizado (opcional)
5. ✅ Testar em diferentes dispositivos
6. ✅ Compartilhar! 🎉

---

**Configurado em:** 2025-12-01
**Repositório:** https://github.com/gianimpronta/lecard
**Deploy:** Netlify (automático)
