
<h1 align="center">🖥️ Monitoria Node</h1>

<p align="center">
  Sistema automatizado de rotação de páginas com painel administrativo em tempo real, ideal para monitoramentos e dashboards.
</p>

---

## 📸 Demonstração

![Dashboard em rotação](https://user-images.githubusercontent.com/00000000/000000000-00000000-0000-000000000.png)
> *Exemplo de painel em rotação com botão flutuante de acesso ao painel administrativo.*

---

## 🚀 Funcionalidades

- 🌐 Rotação de páginas em modo **recarregar** ou **alternar abas**
- 🛠️ Painel administrativo para adicionar, editar, excluir e ordenar URLs
- 📌 Identificação visual da página ativa
- 🧭 Escolha do tempo individual ou padrão por página
- ⏸️ Pausar/retomar rotação com 1 clique
- ⚙️ Alteração dinâmica da porta da interface administrativa
- 💬 Popup flutuante com o nome do site atual
- 🖱️ Botão flutuante arrastável para abrir o painel administrativo

---

## 🧑‍💻 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Puppeteer](https://pptr.dev/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📂 Estrutura do Projeto

```
Monitoria_Node/
├── admin/               # Interface administrativa (painel web)
│   ├── views/           # Arquivo index.html com painel de controle
│   └── public/          # Recursos estáticos (se houver)
├── controller/          # Lógica principal de rotação (monitor.js)
├── scripts/             # Scripts auxiliares (opcional)
├── config.json          # Configurações gerais (porta, tempo padrão etc)
├── urls.json            # Lista de URLs com tempo, ordem e apelido
├── pause.json           # Controle de pausa da rotação
├── current.json         # Indica qual URL está sendo exibida no momento
├── server.js            # Arquivo principal para iniciar o sistema
├── README.md            # Este arquivo
└── package.json         # Dependências e scripts
```

---

## 🧪 Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/ruisauloc/Monitoria_Node.git
   cd Monitoria_Node
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   node server.js
   ```

> 💡 A interface administrativa será aberta automaticamente (por padrão em http://localhost:4001)

---

## 📄 Exemplo de `urls.json`

```json
[
  {
    "url": "https://www.example.com",
    "duration": 10,
    "label": "Exemplo",
    "order": 1
  },
  {
    "url": "https://www.google.com",
    "duration": 15,
    "label": "Pesquisa",
    "order": 2
  }
]
```

---

## 🔐 .gitignore

Seu projeto ignora arquivos como:

```
node_modules/
dist/
*.log
*.zip
.env
```

---

## 🛡️ Licença

Este projeto é de uso interno e livre para modificação com créditos.  
© 2025 - [Rui Saulo](https://github.com/ruisauloc)
