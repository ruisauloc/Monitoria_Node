const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos de configuração
const URL_FILE = path.resolve(__dirname, '../urls.json');
const CONFIG_FILE = path.resolve(__dirname, '../config.json');
const CURRENT_FILE = path.resolve(__dirname, '../current.json');
const PAUSE_FILE = path.resolve(__dirname, '../pause.json');

async function startMonitor() {
  const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: [
    '--start-maximized',
    '--use-fake-ui-for-media-stream',   // evita prompts de câmera
    '--disable-media-stream',           // bloqueia acesso a webcam/mic
    '--disable-permissions-api',        // impede API de permissões
    '--disable-features=MediaStream'    // desativa o MediaStream (cam/mic)
  ]
});

  let pages = [];
  let index = 0;
  let lastMode = null;

  // UI flutuante injetada em cada site
  async function injectUI(page, label, adminPort) {
    await page.evaluate((labelText, port) => {
      document.querySelectorAll('#adminBtn, #labelPopup').forEach(el => el.remove());

      const btn = document.createElement('div');
      btn.id = 'adminBtn';
      btn.innerText = '⚙ Painel';
      btn.style.position = 'fixed';
      btn.style.bottom = '20px';
      btn.style.right = '20px';
      btn.style.background = 'rgba(0,255,0,0.2)';
      btn.style.padding = '10px 15px';
      btn.style.borderRadius = '8px';
      btn.style.zIndex = 9999;
      btn.style.cursor = 'move';
      btn.onclick = () => window.open(`http://localhost:${port}`, '_blank');
      document.body.appendChild(btn);

      btn.onmousedown = function (event) {
        event.preventDefault();
        let shiftX = event.clientX - btn.getBoundingClientRect().left;
        let shiftY = event.clientY - btn.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
          btn.style.left = pageX - shiftX + 'px';
          btn.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        btn.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);
          btn.onmouseup = null;
        };
      };

      btn.ondragstart = () => false;

      if (labelText) {
        const popup = document.createElement('div');
        popup.id = 'labelPopup';
        popup.innerText = labelText;
        popup.style.position = 'fixed';
        popup.style.top = '30px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.padding = '15px 30px';
        popup.style.borderRadius = '10px';
        popup.style.fontSize = '20px';
        popup.style.zIndex = 9999;
        popup.style.opacity = 1;
        popup.style.transition = 'opacity 1s ease';
        document.body.appendChild(popup);
        setTimeout(() => {
          popup.style.opacity = 0;
          setTimeout(() => popup.remove(), 1000);
        }, 3000);
      }
    }, label, adminPort);
  }

  async function rotate() {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    const rotationMode = config.rotationMode || 'reload';
    const urls = JSON.parse(fs.readFileSync(URL_FILE));
    const pause = JSON.parse(fs.readFileSync(PAUSE_FILE)).paused;

    if (!urls.length) {
      console.log("Nenhuma URL cadastrada.");
      return setTimeout(rotate, 5000);
    }

    if (pause) {
      console.log("Rotação pausada.");
      return setTimeout(rotate, 3000);
    }

    const entry = urls[index];
    const duration = entry.duration || config.defaultDuration;
    const label = entry.label || "";

    try {
      // Detecta troca de modo entre tabs e reload
      if (rotationMode !== lastMode) {
        console.log(`Modo de rotação alterado para: ${rotationMode}`);
        for (const p of pages) {
          try {
            await p.close();
          } catch {}
        }
        pages = [];
        lastMode = rotationMode;
      }

      if (rotationMode === 'reload') {
        // Modo recarregar: 1 aba apenas
        if (!pages[0]) {
          pages[0] = await browser.newPage();
        }
        const page = pages[0];

        if (!entry.url || !/^https?:\/\//.test(entry.url)) {
          throw new Error("URL inválida ou incompleta");
        }

        await page.goto(entry.url, {
          waitUntil: 'networkidle2',
          timeout: 45000
        });

        await injectUI(page, label, config.adminPort);

      } else {
        // Modo tabs: múltiplas abas reutilizáveis

        // Ajusta número de abas
        while (pages.length < urls.length) {
          const newPage = await browser.newPage();
          pages.push(newPage);
        }

        while (pages.length > urls.length) {
          const oldPage = pages.pop();
          await oldPage.close();
        }

        const currentUrl = urls[index]?.url;
        let page = pages[index];

        if (!currentUrl || !/^https?:\/\//.test(currentUrl)) {
          console.warn(`URL inválida no índice ${index}:`, currentUrl);
        } else {
          try {
            await page.goto(currentUrl, {
              waitUntil: 'domcontentloaded',
              timeout: 45000
            });
          } catch (err) {
            console.error(`Erro ao carregar ${currentUrl}:`, err.message);
          }

          await page.bringToFront();
          await injectUI(page, label, config.adminPort);
        }
      }

      // Atualiza o marcador de URL atual
      fs.writeFileSync(CURRENT_FILE, JSON.stringify({ currentUrl: entry.url }));
      console.log(`Exibindo: ${entry.url} (${label}) por ${duration}s`);

    } catch (err) {
      console.error(`Erro ao exibir ${entry?.url || '[sem URL]'}: ${err.message}`);
      fs.writeFileSync(CURRENT_FILE, JSON.stringify({ currentUrl: `[ERRO] ${entry?.url || ''}` }));
    }

    index = (index + 1) % urls.length;
    setTimeout(rotate, duration * 1000);
  }

  // Inicia a rotação
  rotate();

  // Função para fixar manualmente uma URL em card flutuante (chamada pelo painel)
  global.pinUrl = async function (url) {
    const pinnedPage = await browser.newPage();
    await pinnedPage.setViewport({ width: 600, height: 400 });
    await pinnedPage.goto(url, { waitUntil: 'networkidle2' });
  };
}

// Inicia o sistema
startMonitor();
