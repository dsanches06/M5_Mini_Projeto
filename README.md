# Projeto 2 - API Completa com Banco de Dados

Uma API RESTful completa desenvolvida com Node.js, Express e MySQL para gerenciar tarefas, utilizadores, tags e comentários.

## 📋 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **Nodemon** - Monitor de desenvolvimento
- **Dotenv** - Variáveis de ambiente

## 🚀 Como Iniciar

### 1. Instalar Dependências

```bash
npm install
```

Instala todas as dependências necessárias listadas em `package.json`.

### 2. Configurar Banco de Dados

Execute o script de inicialização do banco:

```bash
mysql -u seu_usuario < database-init.sql
```

Ou importe o arquivo `database-init.sql` no seu cliente MySQL.

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env` em `src/`:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=database
PORT=3000
```

### 4. Iniciar o Servidor

```bash
npm start
```

O servidor rodará em: `http://localhost:3000`

**Nota:** O servidor reinicia automaticamente ao salvar arquivos (nodemon ativado).

### 5. Parar o Servidor

Pressione `Ctrl+C` no terminal.

## 📁 Estrutura do Projeto

```
src/
├── app.js                 # Aplicação Express principal
├── db.js                  # Configuração do banco de dados
├── controllers/           # Controladores das rotas
│   ├── taskController.js
│   ├── tagController.js
│   └── userController.js
├── middlewares/           # Middlewares personalizados
│   ├── checkUserExists.js
│   └── loggerMiddleware.js
├── routes/                # Definição das rotas
│   ├── taskRoutes.js
│   ├── tagRoutes.js
│   └── userRoutes.js
└── services/              # Lógica de negócio
    ├── taskService.js
    ├── tagService.js
    ├── userService.js
    └── commentService.js
```

## 📡 Documentação das Rotas

### Tarefas (Tasks)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tasks` | Buscar todas as tarefas |
| POST | `/tasks` | Criar nova tarefa |
| PUT | `/tasks/:id` | Atualizar tarefa |
| DELETE | `/tasks/:id` | Deletar tarefa |
| GET | `/tasks/stats` | Buscar estatísticas |

**Exemplo - Criar tarefa:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nova Tarefa","responsavel":"João","categoria":"Backend"}'
```

### Tags

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tags` | Buscar todas as tags |
| POST | `/tags` | Criar nova tag |
| DELETE | `/tags/:id` | Deletar tag |
| GET | `/tags/:id/tasks` | Buscar tarefas por tag |

**Exemplo - Criar tag:**
```bash
curl -X POST http://localhost:3000/tags \
  -H "Content-Type: application/json" \
  -d '{"nome":"nova-tag"}'
```

### Utilizadores (Users)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Buscar todos os utilizadores |
| POST | `/users` | Criar novo utilizador |
| PUT | `/users/:id` | Atualizar utilizador |
| DELETE | `/users/:id` | Deletar utilizador |
| PATCH | `/users/:id` | Alternar status (ativo/inativo) |
| GET | `/users/stats` | Buscar estatísticas |

**Exemplo - Criar utilizador:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com"}'
```

### Comentários (em Tarefas)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tasks/:id/comments` | Criar comentário |
| GET | `/tasks/:id/comments` | Buscar comentários |
| DELETE | `/tasks/:id/comments/:commentId` | Deletar comentário |

**Exemplo - Criar comentário:**
```bash
curl -X POST http://localhost:3000/tasks/1/comments \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"conteudo":"Esse é um comentário de teste"}'
```

### Tags em Tarefas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tasks/:id/tags` | Adicionar tag à tarefa |
| GET | `/tasks/:id/tags` | Buscar tags da tarefa |
| DELETE | `/tasks/:id/tags` | Remover tag da tarefa |

**Exemplo - Adicionar tag:**
```bash
curl -X POST http://localhost:3000/tasks/1/tags \
  -H "Content-Type: application/json" \
  -d '{"tagId":1}'
```

### Busca e Ordenação

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tasks?search=termo&sort=asc` | Buscar tarefas com filtro |
| GET | `/users?search=termo&sort=asc` | Buscar utilizadores com filtro |

**Parâmetros de query:**
- `search` - Termo de busca (opcional)
- `sort` - Ordenação: `asc` (crescente) ou `desc` (decrescente)

**Exemplo - Buscar tarefas com filtro:**
```bash
curl "http://localhost:3000/tasks?search=API&sort=asc"
```

### Projetos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/projects` | Buscar todos os projetos |
| POST | `/projects` | Criar novo projeto |
| PUT | `/projects/:id` | Atualizar projeto |
| DELETE | `/projects/:id` | Deletar projeto |

**Exemplo - Criar projeto:**
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Projeto","descricao":"Descrição do projeto"}'
```

### Sprints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/sprints` | Buscar todos os sprints |
| POST | `/sprints` | Criar novo sprint |
| PUT | `/sprints/:id` | Atualizar sprint |
| DELETE | `/sprints/:id` | Deletar sprint |

**Exemplo - Criar sprint:**
```bash
curl -X POST http://localhost:3000/sprints \
  -H "Content-Type: application/json" \
  -d '{"nome":"Sprint 1","dataInicio":"2024-01-01","dataFim":"2024-01-14"}'
```

### Notificações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/notifications` | Buscar todas as notificações |
| POST | `/notifications` | Criar nova notificação |
| PUT | `/notifications/:id` | Marcar notificação como lida |
| DELETE | `/notifications/:id` | Deletar notificação |

**Exemplo - Criar notificação:**
```bash
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"mensagem":"Você foi atribuído a uma tarefa"}'
```

## 🧪 Testando a API

### Com cURL

Use os exemplos fornecidos em cada seção de rotas. Você pode executá-los diretamente no terminal ou PowerShell.

### Com PowerShell (Recomendado)

Execute o script de testes automatizados que testa todos os endpoints:

```powershell
powershell -ExecutionPolicy Bypass -File test-api-full.ps1
```

Este script realiza 23 testes completos cobrindo todas as operações CRUD e endpoints principais da API.

### Com Postman ou Insomnia

Importe as URLs das rotas listadas na seção "📡 Documentação das Rotas" e faça as requisições manualmente.

## 🔍 Status HTTP

| Status | Significado |
|--------|-------------|
| 200 | OK - Operação bem-sucedida |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Erro de validação |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## ✅ Testes Realizados

### Tarefas (Tasks)
- ✅ GET /tasks - Buscar todas as tarefas (200)
- ✅ POST /tasks - Criar nova tarefa (201)
- ✅ PUT /tasks/:id - Atualizar tarefa (200)
- ✅ DELETE /tasks/:id - Deletar tarefa (200)
- ✅ GET /tasks/stats - Buscar estatísticas (200)

### Tags
- ✅ GET /tags - Buscar todas as tags (200)
- ✅ POST /tags - Criar nova tag (201)
- ✅ DELETE /tags/:id - Deletar tag (200)
- ✅ GET /tags/:id/tasks - Buscar tarefas por tag (200)

### Tags em Tarefas
- ✅ POST /tasks/1/tags - Adicionar tag à tarefa (201)
- ✅ GET /tasks/1/tags - Buscar tags da tarefa (200)
- ✅ DELETE /tasks/1/tags - Remover tag da tarefa (200)

### Utilizadores (Users)
- ✅ GET /users - Buscar todos os utilizadores (200)
- ✅ POST /users - Criar novo utilizador (201)
- ✅ PUT /users/:id - Atualizar utilizador (200)
- ✅ DELETE /users/:id - Deletar utilizador (200)
- ✅ PATCH /users/:id - Alternar status (200)
- ✅ GET /users/stats - Buscar estatísticas (200)

### Comentários (Comments)
- ✅ POST /tasks/1/comments - Criar comentário em tarefa (201)
- ✅ GET /tasks/1/comments - Buscar comentários da tarefa (200)
- ✅ DELETE /tasks/1/comments/:commentId - Deletar comentário (200)

### Projetos
- ✅ GET /projects - Buscar todos os projetos (200)
- ✅ POST /projects - Criar novo projeto (201)
- ✅ PUT /projects/:id - Atualizar projeto (200)
- ✅ DELETE /projects/:id - Deletar projeto (200)

### Sprints
- ✅ GET /sprints - Buscar todos os sprints (200)
- ✅ POST /sprints - Criar novo sprint (201)
- ✅ PUT /sprints/:id - Atualizar sprint (200)
- ✅ DELETE /sprints/:id - Deletar sprint (200)

### Notificações
- ✅ GET /notifications - Buscar todas as notificações (200)
- ✅ POST /notifications - Criar nova notificação (201)
- ✅ PUT /notifications/:id - Marcar como lida (200)
- ✅ DELETE /notifications/:id - Deletar notificação (200)

### Busca e Filtros
- ✅ GET /tasks?search=termo&sort=asc - Buscar tarefas com filtro (200)
- ✅ GET /users?search=termo&sort=asc - Buscar utilizadores com filtro (200)

## 👨‍💻 Autor

Desenvolvido por **Danilson Sanches** @upskill217
