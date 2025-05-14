const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL_FILE = path.join(__dirname, '..', 'urls.json');
let pinned = [];
let nextX = 0;

async function startMonitor() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  // Página principal para rotação
  const mainPage = await browser.newPage();
  const urls = JSON.parse(fs.readFileSync(URL_FILE));
  let index = 0;

  setInterval(async () => {
    if (urls.length === 0) return;
    const currentUrl = urls[index];
    console.log("Alternando para:", currentUrl);
    try {
      await mainPage.goto(currentUrl, { waitUntil: 'networkidle2' });
    } catch (e) {
      console.error("Erro ao carregar:", currentUrl);
    }
    index = (index + 1) % urls.length;
  }, 15000); // troca a cada 15s

  // Função global para criar cards fixos
  global.pinUrl = async function (url) {
    const pinnedPage = await browser.newPage();
    await pinnedPage.setViewport({ width: 600, height: 400 });

    // Posiciona a janela de forma sequencial
    await pinnedPage._client.send('Browser.setWindowBounds', {
      windowId: (await pinnedPage._client.send('Browser.getWindowForTarget')).windowId,
      bounds: {
        top: 100,
        left: nextX,
        width: 600,
        height: 400
      }
    });
    nextX += 620; // Próximo card ao lado

    await pinnedPage.goto(url, { waitUntil: 'networkidle2' });
    pinned.push(pinnedPage);
  };
}

module.exports = { startMonitor };
