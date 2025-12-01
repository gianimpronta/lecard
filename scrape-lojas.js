require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeLojas() {
  console.log('Iniciando scraping...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navegando para a página de login...');
    await page.goto('https://cartao.algorix.com/Lecard/Atend/ConsLojas.aspx', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });

    console.log('Página carregada, aguardando estabilização...');

    // Aguardar um pouco para ver a página
    await page.waitForTimeout(3000);

    // Tirar screenshot antes do login
    await page.screenshot({ path: 'antes-login.png', fullPage: true });
    console.log('Screenshot antes do login salvo em antes-login.png');

    // Descobrir todos os campos de input disponíveis
    const inputs = await page.evaluate(() => {
      const allInputs = Array.from(document.querySelectorAll('input'));
      return allInputs.map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        placeholder: input.placeholder,
        className: input.className
      }));
    });

    console.log('Campos de input encontrados:', JSON.stringify(inputs, null, 2));

    if (process.env.LECARD_LOGIN && process.env.LECARD_PASSWORD) {
      console.log('Tentando fazer login...');

      try {
        // Tentar encontrar e preencher o campo de login (cartão)
        const loginSelectors = [
          'input[name*="Cartao"]',
          'input[name*="cartao"]',
          'input[id*="Cartao"]',
          'input[id*="cartao"]',
          'input[type="text"]',
          'input:not([type="password"]):not([type="submit"]):not([type="button"])'
        ];

        let loginFilled = false;
        for (const selector of loginSelectors) {
          const field = await page.$(selector);
          if (field) {
            await field.fill(process.env.LECARD_LOGIN);
            console.log(`Campo de login preenchido usando seletor: ${selector}`);
            loginFilled = true;
            break;
          }
        }

        if (!loginFilled) {
          console.log('AVISO: Não foi possível encontrar campo de login');
        }

        // Tentar encontrar e preencher o campo de senha
        const passwordSelectors = [
          'input[type="password"]',
          'input[name*="Senha"]',
          'input[name*="senha"]',
          'input[id*="Senha"]',
          'input[id*="senha"]'
        ];

        let passwordFilled = false;
        for (const selector of passwordSelectors) {
          const field = await page.$(selector);
          if (field) {
            await field.fill(process.env.LECARD_PASSWORD);
            console.log(`Campo de senha preenchido usando seletor: ${selector}`);
            passwordFilled = true;
            break;
          }
        }

        if (!passwordFilled) {
          console.log('AVISO: Não foi possível encontrar campo de senha');
        }

        // Screenshot após preencher
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'campos-preenchidos.png', fullPage: true });
        console.log('Screenshot com campos preenchidos salvo em campos-preenchidos.png');

        // Tentar clicar no botão de submit
        const submitSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button:has-text("Entrar")',
          'button:has-text("Login")',
          'input[value*="Entrar"]',
          'input[value*="Login"]'
        ];

        let submitClicked = false;
        for (const selector of submitSelectors) {
          const button = await page.$(selector);
          if (button) {
            console.log(`Clicando no botão de submit usando seletor: ${selector}`);
            await button.click();
            submitClicked = true;
            break;
          }
        }

        if (!submitClicked) {
          console.log('AVISO: Não foi possível encontrar botão de submit');
        }

        // Aguardar navegação ou mudança na página
        console.log('Aguardando após clicar no botão...');
        await page.waitForTimeout(5000);

        // Screenshot após login
        await page.screenshot({ path: 'apos-login.png', fullPage: true });
        console.log('Screenshot após login salvo em apos-login.png');

        // Agora procurar pelo link de consulta de lojas/estabelecimentos
        console.log('Procurando link para consulta de estabelecimentos...');

        const linkSelectors = [
          'a:has-text("estabelecimentos credenciados")',
          'a:has-text("Consulta estabelecimentos")',
          'a:has-text("lojas")',
          'a[href*="ConsLojas"]',
          'a[href*="Lojas"]'
        ];

        let linkClicked = false;
        for (const selector of linkSelectors) {
          try {
            const link = await page.$(selector);
            if (link) {
              console.log(`Link encontrado usando seletor: ${selector}`);
              await link.click();
              linkClicked = true;
              console.log('Aguardando página de lojas carregar...');
              await page.waitForTimeout(3000);
              await page.screenshot({ path: 'pagina-lojas-real.png', fullPage: true });
              console.log('Screenshot da página de lojas salvo em pagina-lojas-real.png');
              break;
            }
          } catch (e) {
            // Tentar próximo seletor
            continue;
          }
        }

        if (!linkClicked) {
          console.log('AVISO: Não foi possível encontrar link para página de lojas');
          console.log('Tentando acessar diretamente a URL...');
          await page.goto('https://cartao.algorix.com/Lecard/Atend/ConsLojas.aspx', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
          });
          await page.waitForTimeout(3000);
        }

      } catch (loginError) {
        console.error('Erro durante o login:', loginError.message);
      }
    }

    console.log('Extraindo dados da página...');

    // Tirar screenshot para debug (sem esperar fontes)
    try {
      await page.screenshot({ path: 'pagina-lojas.png', fullPage: true, timeout: 10000 });
      console.log('Screenshot salvo como pagina-lojas.png');
    } catch (e) {
      console.log('Aviso: Não foi possível tirar screenshot completo');
    }

    // Primeiro, vamos ver a estrutura da página
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });

    console.log('Informações da página:', JSON.stringify(pageInfo, null, 2));

    // Extrair dados das lojas
    const lojas = await page.evaluate(() => {
      const results = [];

      // Tentar encontrar tabelas (muito comum em páginas ASP.NET antigas)
      const tables = document.querySelectorAll('table');

      if (tables.length > 0) {
        console.log(`Encontradas ${tables.length} tabelas`);

        tables.forEach((table, tableIndex) => {
          const rows = table.querySelectorAll('tr');

          rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td, th');
            const rowData = [];

            cells.forEach(cell => {
              const texto = cell.innerText || cell.textContent;
              if (texto && texto.trim()) {
                rowData.push(texto.trim());
              }
            });

            if (rowData.length > 0) {
              results.push({
                tipo: 'table',
                tableIndex: tableIndex,
                rowIndex: rowIndex,
                dados: rowData,
                texto: rowData.join(' | ')
              });
            }
          });
        });
      }

      // Tentar divs com informações
      const divs = document.querySelectorAll('div[class*="loja"], div[class*="estabelecimento"], div[id*="loja"], div[id*="estabelecimento"]');

      if (divs.length > 0) {
        divs.forEach((div, index) => {
          const texto = div.innerText || div.textContent;
          if (texto && texto.trim().length > 20) {
            results.push({
              tipo: 'div',
              index: index,
              texto: texto.trim()
            });
          }
        });
      }

      // Se ainda não encontrou nada específico, pegar todo o conteúdo
      if (results.length === 0) {
        const bodyText = document.body.innerText;
        results.push({
          tipo: 'body_completo',
          texto: bodyText
        });
      }

      return results;
    });

    console.log(`Encontrados ${lojas.length} elementos`);

    // Salvar dados brutos
    fs.writeFileSync('lojas_raw.json', JSON.stringify(lojas, null, 2));
    console.log('Dados brutos salvos em lojas_raw.json');

    // Filtrar apenas lojas do Rio de Janeiro
    const lojasRio = lojas.filter(loja => {
      const texto = loja.texto.toLowerCase();
      return texto.includes('rio de janeiro') || texto.includes('rio de janeiro/rj');
    });

    console.log(`Encontradas ${lojasRio.length} lojas no Rio de Janeiro`);

    // Salvar em formato de texto
    const textoLojas = lojas.map((loja, i) => {
      return `\n=== LOJA ${i + 1} ===\n${loja.texto}\n`;
    }).join('\n');

    fs.writeFileSync('lojas_todas.txt', textoLojas);
    console.log('Todas as lojas salvas em lojas_todas.txt');

    // Salvar apenas lojas do Rio
    const textoLojasRio = lojasRio.map((loja, i) => {
      return `\n=== LOJA RIO ${i + 1} ===\n${loja.texto}\n`;
    }).join('\n');

    fs.writeFileSync('lojas_rio.txt', textoLojasRio);
    console.log('Lojas do Rio de Janeiro salvas em lojas_rio.txt');

    // Criar CSV das lojas do Rio
    const csvLines = ['Nome,Endereço,Bairro,Cidade,Estado,Telefone'];

    lojasRio.forEach(loja => {
      // Tentar extrair informações estruturadas
      if (loja.tipo === 'table' && loja.dados) {
        const linha = loja.dados.map(d => `"${d.replace(/"/g, '""')}"`).join(',');
        csvLines.push(linha);
      } else {
        csvLines.push(`"${loja.texto.replace(/"/g, '""')}","","","Rio de Janeiro","RJ",""`);
      }
    });

    fs.writeFileSync('lojas_rio.csv', csvLines.join('\n'));
    console.log('CSV das lojas do Rio salvo em lojas_rio.csv');

    // Aguardar um pouco antes de fechar
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Erro durante o scraping:', error);
    await page.screenshot({ path: 'erro.png' });
    console.log('Screenshot do erro salvo como erro.png');
  } finally {
    await browser.close();
    console.log('Navegador fechado');
  }
}

scrapeLojas().catch(console.error);
