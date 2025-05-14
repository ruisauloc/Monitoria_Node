# 🖥️ Monitoria Node

Sistema de monitoramento e exibição automática de páginas da web em rotação, com painel administrativo integrado para controle em tempo real. Desenvolvido em Node.js e Puppeteer, com interface moderna e dark usando Tailwind CSS.

---

## 🚀 Funcionalidades principais

- 🔁 Rotação automática entre várias URLs com tempo configurável.
- ⚙️ Painel administrativo via navegador para:
  - Adicionar, editar ou excluir URLs.
  - Atribuir apelidos para identificar melhor cada site.
  - Definir a ordem de exibição.
  - Configurar o tempo individual de exibição de cada URL.
  - Alternar entre dois modos de rotação:
    - **Recarregar (`goto`)**: uma aba única sendo atualizada.
    - **Abas (`bringToFront`)**: múltiplas abas alternadas com foco.
  - Pausar e continuar a rotação com um clique.
  - Alterar a porta do painel dinamicamente.
- 📌 Fixar qualquer página como "card flutuante" (minimizada).
- 🪟 Botão flutuante de acesso ao painel, arrastável na tela.
- 📢 Popup superior com o apelido da URL atual.

---

## 🧰 Requisitos

- ✅ [Node.js](https://nodejs.org) (v16 ou superior)
- ✅ Sistema operacional: Windows (testado nessa plataforma)
- ✅ Acesso à internet (para sites externos)

---

## 📁 Estrutura do projeto

```
Monitoria_Node/
├── admin/
│   ├── admin.js
│   ├── public/
│   └── views/
├── controller/
│   └── monitor.js
├── urls.json
├── config.json
├── pause.json
├── current.json
├── server.js
└── package.json
```

---

## ⚙️ Como executar

### 1. Baixe ou clone o projeto:
```bash
git clone https://github.com/seuusuario/Monitoria_Node.git
cd Monitoria_Node
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Execute o sistema:
```bash
node server.js
```

### 4. Acesse o painel de controle:
Abra o navegador e digite:
```
http://localhost:4001
```

---

## 🔄 Modos de rotação

| Modo           | Descrição                                                  |
|----------------|------------------------------------------------------------|
| `reload`       | Uma única aba, sendo recarregada a cada novo site.         |
| `tabs`         | Abas individuais são abertas e alternadas com foco.        |

Você pode mudar o modo diretamente pelo painel administrativo.

---

## 📝 Sobre os arquivos JSON

### `urls.json`  
Armazena as URLs cadastradas com suas configurações:

```json
[
  {
    "url": "https://example.com",
    "label": "Exemplo",
    "duration": 15,
    "order": 1
  }
]
```

### `config.json`  
Configurações gerais da aplicação:

```json
{
  "defaultDuration": 10,
  "rotationMode": "reload",
  "adminPort": 4001
}
```

### `pause.json`  
Controla o estado de pausa da rotação:

```json
{ "paused": false }
```

### `current.json`  
Indica a URL atualmente sendo exibida:

```json
{ "currentUrl": "https://..." }
```

---

## 💡 Melhorias futuras (sugestões)

- Empacotamento do sistema como `.exe` com Electron
- Suporte a autenticação no painel
- Exportar/importar lista de URLs
- Relatórios de tempo de exibição

---

## 👨‍💻 Autor

Desenvolvido por **[Rui Saulo de Carvalho Júnior]**  
📧 Entre em contato para colaborações, sugestões ou melhorias.

---

## 🛡️ Licença

Este projeto é de uso livre para fins pessoais ou institucionais.  
Distribuição comercial não autorizada sem permissão prévia.
