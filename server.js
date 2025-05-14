
// server.js - Gerencia a inicialização de monitor.js e admin.js com reinício dinâmico

const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
const open = require('open').default;

let adminProcess = null;
const CONFIG_FILE = path.join(__dirname, 'config.json');

function getAdminPort() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    return config.adminPort || 4001;
  } catch {
    return 4001;
  }
}

function startAdmin() {
  const port = getAdminPort();
  adminProcess = fork(path.join(__dirname, 'admin', 'admin.js'), [port]);
  console.log("Painel iniciado na porta:", port);
  open(`http://localhost:${port}`);
}

function restartAdmin() {
  if (adminProcess) {
    adminProcess.kill();
    console.log("Reiniciando painel administrativo...");
    setTimeout(startAdmin, 1000); // pequeno delay
  }
}

// Observa mudanças no config.json para reiniciar se a porta for alterada
let lastPort = getAdminPort();
fs.watchFile(CONFIG_FILE, () => {
  const currentPort = getAdminPort();
  if (currentPort !== lastPort) {
    lastPort = currentPort;
    restartAdmin();
  }
});

// Inicia o monitor.js normalmente
fork(path.join(__dirname, 'controller', 'monitor.js'));

// Inicia admin.js
startAdmin();
