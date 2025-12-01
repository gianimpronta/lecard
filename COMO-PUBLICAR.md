# 🌐 Como Publicar o Mapa Online

O mapa está pronto para ser publicado! Você só precisa de 2 arquivos:
- `index.html` (9.8 KB)
- `lojas_mapa.json` (125 KB)

## ✅ Opção 1: Netlify Drop (MAIS FÁCIL - 2 minutos)

1. Acesse: https://app.netlify.com/drop
2. Arraste os 2 arquivos para a página
3. Pronto! URL gerada automaticamente
4. Exemplo: `https://seu-projeto-abc123.netlify.app`

**Vantagens:**
- Gratuito
- Sem cadastro necessário (para drop)
- SSL automático (HTTPS)
- CDN global (carregamento rápido)

---

## 🚀 Opção 2: GitHub Pages (Gratuito)

### Passo a Passo:

1. **Criar repositório no GitHub**
   - Acesse: https://github.com/new
   - Nome: `lecard-mapa-rj` (ou outro nome)
   - Público ou Privado (ambos funcionam)
   - Clique em "Create repository"

2. **Fazer upload dos arquivos**
   - Clique em "uploading an existing file"
   - Arraste `index.html` e `lojas_mapa.json`
   - Commit: "Adicionar mapa de lojas"

3. **Ativar GitHub Pages**
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` → `/root`
   - Save

4. **Acessar o site**
   - Aguarde 1-2 minutos
   - URL: `https://seu-usuario.github.io/lecard-mapa-rj`

---

## ⚡ Opção 3: Vercel (Rápido)

1. Acesse: https://vercel.com
2. Crie uma conta (gratuita)
3. New Project → Import Git Repository (ou Upload files)
4. Faça upload de `index.html` e `lojas_mapa.json`
5. Deploy!

**URL gerada:** `https://seu-projeto.vercel.app`

---

## 📱 Opção 4: Servidor Local (Teste)

Para testar localmente antes de publicar:

```bash
# Opção 1: Python
python3 -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000

# Opção 3: PHP
php -S localhost:8000
```

Acesse: http://localhost:8000

---

## 🎨 Personalizações Opcionais

### Alterar o título
Edite `index.html`, linha 6:
```html
<title>Seu Título Aqui</title>
```

### Alterar cores
Edite `index.html`, no `<style>`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Mude #667eea e #764ba2 para suas cores */
```

### Adicionar logo
No `<header>`, adicione:
```html
<img src="logo.png" alt="Logo" style="height: 50px;">
```

---

## 📊 Estatísticas do Mapa

- **423 lojas** únicas no Rio de Janeiro
- **Todos os dados** incluídos (nome, endereço, telefone, email)
- **Mapa interativo** com clustering
- **Responsivo** (funciona em mobile)
- **Sem dependências** externas (exceto Leaflet via CDN)

---

## 🔒 Segurança

- ✅ Nenhuma credencial exposta
- ✅ Apenas dados públicos (lojas credenciadas)
- ✅ Sem backend necessário
- ✅ Funciona totalmente no navegador

---

## 💡 Dicas

1. **Domínio próprio**: Depois de publicar, você pode adicionar um domínio customizado (ex: `mapa.seusite.com`)

2. **Analytics**: Adicione Google Analytics para ver quantas pessoas acessam

3. **Atualização**: Para atualizar, basta substituir o arquivo `lojas_mapa.json`

4. **SEO**: O mapa já tem meta tags básicas. Para melhorar, adicione:
   ```html
   <meta name="description" content="Mapa de lojas LeCard no Rio de Janeiro">
   <meta name="keywords" content="lecard, lojas, rio de janeiro">
   ```

---

## 📞 Suporte

Se tiver problemas:
1. Verifique se ambos os arquivos estão no mesmo diretório
2. Abra o console do navegador (F12) para ver erros
3. Verifique se o arquivo `lojas_mapa.json` é válido (pode usar jsonlint.com)

---

## ✨ Próximos Passos Possíveis

- [ ] Adicionar filtro por tipo de estabelecimento
- [ ] Adicionar busca por nome ou endereço
- [ ] Adicionar rota do Google Maps ao clicar
- [ ] Adicionar compartilhamento nas redes sociais
- [ ] Adicionar modo escuro

---

**Pronto para publicar! 🚀**

Escolha uma das opções acima e seu mapa estará online em minutos!
