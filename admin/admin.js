const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.argv[2] || 4001;
const app = express();

const URL_FILE = path.resolve(__dirname, '../urls.json');
const CONFIG_FILE = path.resolve(__dirname, '../config.json');
const CURRENT_FILE = path.resolve(__dirname, '../current.json');
const PAUSE_FILE = path.resolve(__dirname, '../pause.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  const urls = JSON.parse(fs.readFileSync(URL_FILE)).sort((a, b) => (a.order || 999) - (b.order || 999));
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
  let currentUrl = "";
  let paused = false;
  try {
    currentUrl = JSON.parse(fs.readFileSync(CURRENT_FILE)).currentUrl;
  } catch {}
  try {
    paused = JSON.parse(fs.readFileSync(PAUSE_FILE)).paused;
  } catch {}
  res.render('index', { urls, config, currentUrl, paused });
});

// 🔐 Validações fortes para impedir URL inválida ou dados ausentes
function isValidUrl(url) {
  return typeof url === 'string' && /^https?:\/\//.test(url);
}

function isValidNumber(n) {
  return typeof n === 'number' && !isNaN(n);
}

// ➕ Adiciona nova URL
app.post('/add-url', (req, res) => {
  const { url, duration, label, order } = req.body;
  if (!isValidUrl(url)) return res.status(400).send("URL inválida.");
  if (!isValidNumber(duration)) return res.status(400).send("Duração inválida.");
  if (!isValidNumber(order)) return res.status(400).send("Ordem inválida.");

  const urls = JSON.parse(fs.readFileSync(URL_FILE));
  urls.push({ url, duration, label, order });
  fs.writeFileSync(URL_FILE, JSON.stringify(urls, null, 2));
  res.sendStatus(200);
});

// ✏️ Edita URL
app.post('/edit-url', (req, res) => {
  const { index, url, duration, label, order } = req.body;
  if (!isValidUrl(url)) return res.status(400).send("URL inválida.");
  if (!isValidNumber(duration)) return res.status(400).send("Duração inválida.");
  if (!isValidNumber(order)) return res.status(400).send("Ordem inválida.");

  const urls = JSON.parse(fs.readFileSync(URL_FILE));
  if (urls[index]) {
    urls[index] = { url, duration, label, order };
    fs.writeFileSync(URL_FILE, JSON.stringify(urls, null, 2));
  }
  res.sendStatus(200);
});

// ❌ Remove URL
app.post('/delete-url', (req, res) => {
  const { index } = req.body;
  const urls = JSON.parse(fs.readFileSync(URL_FILE));
  urls.splice(index, 1);
  fs.writeFileSync(URL_FILE, JSON.stringify(urls, null, 2));
  res.sendStatus(200);
});


// ⏸️ Alternar pausa
app.post('/toggle-pause', (req, res) => {
  const current = JSON.parse(fs.readFileSync(PAUSE_FILE));
  const updated = { paused: !current.paused };
  fs.writeFileSync(PAUSE_FILE, JSON.stringify(updated, null, 2));
  res.json(updated);
});

// 🔁 Trocar modo de rotação
app.post('/set-rotation-mode', (req, res) => {
  const { mode } = req.body;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
  config.rotationMode = mode;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  res.sendStatus(200);
});

// ⚙️ Alterar porta do painel
app.post('/set-admin-port', (req, res) => {
  const { port } = req.body;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
  config.adminPort = parseInt(port);
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  res.sendStatus(200);
});

// 📄 Servir o current.json para destacar o card ativo no painel
app.get('/current.json', (req, res) => {
  try {
    const content = fs.readFileSync(CURRENT_FILE);
    res.setHeader('Content-Type', 'application/json');
    res.send(content);
  } catch {
    res.status(500).json({ currentUrl: null });
  }
});

app.listen(PORT, () => {
  console.log(`Admin disponível em http://localhost:${PORT}`);
});
