import { launch } from 'puppeteer';
import fs from 'fs-extra'; // Para manipular o sistema de arquivos

async function scrapeHighStocks() {
  // Inicia o navegador do Puppeteer
  const browser = await launch({ headless: false });
  const page = await browser.newPage();
  
  // Navega até a página de ações do Status Invest
  await page.goto('https://statusinvest.com.br/acoes', { waitUntil: 'networkidle2' });

  // Executa o script no contexto da página para extrair as informações das ações em alta
  const highStocks = await page.evaluate(() => {
    // Seleciona os elementos que contêm as informações das ações
    const stockElements = document.querySelectorAll('div[role="listitem"]');
    
    // Array para armazenar as informações das ações
    const stockList = [];

    // Loop pelos primeiros 10 itens e extrair as informações
    for (let i = 0; i < Math.min(stockElements.length, 6); i++) {
      const item = stockElements[i];
      const ticker = item.querySelector('h4[title="ticker/código do ativo"]')?.innerText.trim() || 'N/A';
      const companyName = item.querySelector('small[title="Nome da empresa"]')?.innerText.trim() || 'N/A';
      const variation = item.querySelector('span.value')?.innerText.trim().split('\n')[1] || 'N/A'; // Captura apenas o valor

      // Adicionar as informações à lista de ações
      stockList.push({ ticker, companyName, variation });
    }

    return stockList;
  });

  // Salva as informações extraídas em um arquivo JSON
  await fs.writeJson('./highStocks.json', { stocks: highStocks }, { spaces: 2 });

  console.log('10 Ações em Alta extraídas com sucesso e salvas no arquivo highStocks.json');

  // Fecha o navegador
  await browser.close();
}

// Executa o scraper
scrapeHighStocks();
