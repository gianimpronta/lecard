# 🔄 Guia de Versionamento

## 📦 Repositório

**GitHub:** https://github.com/gianimpronta/lecard

## 🌳 Branches

- `main` - Branch principal (produção)

## 📝 Commits

### Histórico

```
eb9a88b - Adicionar funcionalidade de busca de lojas próximas
6ccc754 - initial
```

### Convenção de Commits

Use mensagens descritivas seguindo o padrão:

```
Título curto (50 caracteres)

- Descrição detalhada da mudança
- Lista de alterações principais
- Impacto ou funcionalidades adicionadas

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 🚀 Comandos Úteis

### Verificar status
```bash
git status
```

### Adicionar arquivos
```bash
git add arquivo.js
# ou adicionar tudo
git add .
```

### Fazer commit
```bash
git commit -m "Descrição da mudança"
```

### Push para GitHub
```bash
git push origin main
```

### Pull do GitHub
```bash
git pull origin main
```

### Ver histórico
```bash
git log --oneline -10
```

### Ver diferenças
```bash
git diff
```

## 📂 Arquivos Versionados

### Principais
- `index.html` - Mapa interativo
- `lojas_mapa.json` - Dados das 423 lojas (125 KB)
- `lojas_rio_de_janeiro.json` - Dados completos das lojas
- `package.json` - Dependências do projeto

### Scripts
- `scrape-lojas.js` - Scraping do site LeCard
- `limpar-dados-rio.js` - Processamento de dados
- `geocodificar.js` - Geocodificação de endereços
- `verificar-duplicados.js` - Detecção de duplicados
- `remover-duplicados.js` - Remoção de duplicados
- `verificar-progresso.sh` - Monitor de progresso
- `monitorar-progresso.sh` - Monitor em tempo real

### Documentação
- `README.md` - Documentação principal
- `COMO-PUBLICAR.md` - Guia de publicação
- `VERSIONAMENTO.md` - Este arquivo

## 🚫 Arquivos Ignorados (.gitignore)

### Não versionados
- `node_modules/` - Dependências (npm install para reinstalar)
- `.env` - Credenciais (NUNCA commitar)
- `*.png` - Screenshots
- Arquivos temporários e de log
- Dados brutos e intermediários

### Motivo
- **Segurança**: Credenciais não devem estar no Git
- **Tamanho**: node_modules pode ter centenas de MB
- **Temporários**: Arquivos gerados podem ser recriados

## 🔒 Segurança

### ⚠️ NUNCA commitar:
- Arquivos `.env` com credenciais
- Senhas ou tokens
- Chaves de API
- Dados sensíveis de usuários

### ✅ Sempre verificar antes do commit:
```bash
git status
git diff
```

## 🎯 Workflow Recomendado

### Para nova funcionalidade:

1. **Verificar status**
   ```bash
   git status
   ```

2. **Fazer alterações no código**

3. **Testar localmente**
   ```bash
   npm test  # ou testar manualmente
   ```

4. **Adicionar arquivos**
   ```bash
   git add arquivo.js
   ```

5. **Commit com mensagem descritiva**
   ```bash
   git commit -m "Adicionar funcionalidade X"
   ```

6. **Push para GitHub**
   ```bash
   git push origin main
   ```

### Para correção de bug:

1. **Criar branch (opcional)**
   ```bash
   git checkout -b fix/nome-do-bug
   ```

2. **Corrigir o bug**

3. **Testar correção**

4. **Commit**
   ```bash
   git commit -m "Corrigir bug X"
   ```

5. **Push**
   ```bash
   git push origin fix/nome-do-bug
   ```

6. **Merge na main** (via Pull Request no GitHub)

## 📊 Estatísticas do Projeto

- **Arquivos principais**: ~15
- **Tamanho do repositório**: ~150 KB (sem node_modules)
- **Linhas de código**: ~1000+ (JavaScript + HTML + CSS)
- **Dados**: 423 lojas geocodificadas

## 🔄 Atualizando Dados

### Se os dados das lojas mudarem:

1. **Executar scraping novamente**
   ```bash
   node scrape-lojas.js
   ```

2. **Processar dados**
   ```bash
   node limpar-dados-rio.js
   ```

3. **Geocodificar (se necessário)**
   ```bash
   node geocodificar.js
   ```

4. **Remover duplicados**
   ```bash
   node remover-duplicados.js
   ```

5. **Commit e push**
   ```bash
   git add lojas_mapa.json lojas_rio_de_janeiro.json
   git commit -m "Atualizar dados das lojas"
   git push origin main
   ```

## 📱 Deploy Automático

### GitHub Pages
Se configurado, cada push na `main` atualiza automaticamente o site em:
`https://gianimpronta.github.io/lecard`

### Netlify/Vercel
Se conectado ao GitHub, cada push dispara deploy automático.

## 🆘 Problemas Comuns

### Erro ao fazer push
```bash
# Se houver conflitos
git pull origin main
# Resolver conflitos manualmente
git add .
git commit -m "Resolver conflitos"
git push origin main
```

### Desfazer último commit (antes do push)
```bash
git reset --soft HEAD~1
```

### Ver o que mudou em um commit
```bash
git show eb9a88b
```

### Voltar para versão anterior
```bash
git checkout eb9a88b arquivo.js
```

## 📞 Ajuda

- **Documentação Git**: https://git-scm.com/docs
- **GitHub Docs**: https://docs.github.com
- **Problemas**: Abra uma issue no GitHub

---

**Última atualização:** 2025-12-01
