# M5 Mini Projeto - Gestão de utilizadores e tarefas ✅

## 📌 Descrição

Projeto exemplar de gestão de utilizadores e tarefas, implementado em **TypeScript**. Inclui operações básicas (CRUD), associação de tarefas a utilizadores, e um conjunto de utilitários genéricos com testes unitários.

## 🔧 Funcionalidades principais

- Gestão de utilizadores (CRUD)
- Gestão de tarefas (CRUD)
- Associação de tarefas a utilizadores
- Utilitários genéricos (cache, favoritos, tags, paginação, etc.)
- Testes unitários com **Vitest**

## 🧰 Tecnologias

- TypeScript
- Javascript
- Node JS
- Mysql Database
- Vitest (testes)

## 📁 Estrutura do projeto (resumo)

### Frontend (`frontend/`)

- `main.ts` — ponto de entrada
- `index.html` — template HTML
- `src/` — código fonte
  - `assets/` — imagens e recursos (incl. favicon)
  - `styles/` — arquivos CSS
  - `models/` — entidades (User, Task, etc.)
  - `tasks/` — implementações de tarefas (BugTask, FeatureTask, Task)
  - `utils/` — utilitários genéricos (EntityList, SimpleCache, Paginator...)
  - `services/` — serviços da aplicação
  - `ui/` — componentes e interface do utilizador
  - `logs/`, `notifications/`, `security/`, etc.
- `testes/` — testes unitários (Vitest)
- `tsconfig.json` — configuração TypeScript
- `vitest.config.ts` — configuração de testes
- `dist/` — build compilado (gerado com `npm run build`)

### Backend (`backend/`)

- `server.js` — servidor Node.js/Express
- `package.json` — dependências
- `routes/` — rotas da API
  - `users.js`
  - `tasks.js`
  - `projects.js`
  - `sprints.js`
  - `comments.js`
  - `notifications.js`
- `connectionsDB/` — configuração de base de dados
  - `connectionDatabase.js`
  - `connectionOptions.json`

---

## 🚀 Como usar

### Setup Inicial

```bash
git clone https://github.com/dsanches06/M5_Mini_Projeto.git
cd M5_Mini_Projeto
```

---

## 🎨 Frontend

### 1) Instalar dependências

```bash
cd frontend
npm install
```

### 2) Compilar TypeScript + copiar assets/styles

```bash
npm run build
```

Isto irá:
- Compilar o TypeScript com `tsc`
- Copiar automaticamente `src/assets/` e `src/styles/` para `dist/src/`

---

## 🖥️ Backend

### 1) Instalar dependências

```bash
cd backend
npm install
```

### 2) Configurar conexão MySQL

Edite o arquivo `backend/connectionsDB/connectionOptions.json` com as credenciais da sua base de dados:

```json
{
  "host": "localhost",
  "port": 3306,
  "user": "seu_usuario",
  "password": "sua_senha",
  "database": "nome_da_database"
}
```

O servidor conectará automaticamente à base de dados ao iniciar.

### 3) Iniciar servidor

```bash
npm run start
```

O servidor será iniciado em `http://localhost:3000` (ou a porta configurada) e a base de dados conectada automaticamente.

---

## 📡 API e Rotas

O backend expõe as seguintes rotas (endpoints) para gerir utilizadores, tarefas, projetos e notificações:

### Rotas de Utilizadores (`routes/users.js`)

- `GET /api/users` — listar todos os utilizadores
- `GET /api/users/:id` — obter um utilizador específico
- `POST /api/users` — criar novo utilizador
- `PUT /api/users/:id` — atualizar utilizador
- `DELETE /api/users/:id` — eliminar utilizador

### Rotas de Tarefas (`routes/tasks.js`)

- `GET /api/tasks` — listar todas as tarefas
- `GET /api/tasks/:id` — obter uma tarefa específica
- `POST /api/tasks` — criar nova tarefa
- `PUT /api/tasks/:id` — atualizar tarefa
- `DELETE /api/tasks/:id` — eliminar tarefa

### Rotas de Projetos (`routes/projects.js`)

- `GET /api/projects` — listar todos os projetos
- `POST /api/projects` — criar novo projeto
- `PUT /api/projects/:id` — atualizar projeto
- `DELETE /api/projects/:id` — eliminar projeto

### Rotas de Sprints (`routes/sprints.js`)

- `GET /api/sprints` — listar todos os sprints
- `POST /api/sprints` — criar novo sprint
- `PUT /api/sprints/:id` — atualizar sprint

### Rotas de Comentários (`routes/comments.js`)

- `GET /api/comments` — listar comentários
- `POST /api/comments` — criar comentário
- `DELETE /api/comments/:id` — eliminar comentário

### Rotas de Notificações (`routes/notifications.js`)

- `GET /api/notifications` — listar notificações
- `POST /api/notifications` — criar notificação
- `PUT /api/notifications/:id` — marcar como lida

---

## 👤 Autor

**Danilson Sanches** — @upskill217
