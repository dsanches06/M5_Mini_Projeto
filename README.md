# Projeto 2 - API Completa com Banco de Dados

Uma API RESTful criada com Node.js, Express e MySQL para gerir tarefas, utilizadores, tags, comentários, projetos e sprints.

## 📌 Visão Geral

Este projeto está organizado como um monorepo com duas pastas principais:

- `backend/` - API em Node.js + Express com MySQL
- `frontend/` - aplicação em TypeScript + Vite

## 🚀 Começando

### 1. Clonar o repositório

```bash
git clone https://github.com/dsanches06/M5_Mini_Projeto.git
cd M5_Mini_Projeto
```

### 2. Instalar dependências

No diretório raiz:

```bash
npm install
```

Isso instala as dependências para o `backend` e o `frontend`, pois o projeto utiliza npm workspaces.

### 3. Configurar o banco de dados

No MySQL, execute o script de criação de tabelas:

```bash
mysql -u seu_usuario -p < backend/database-init.sql
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` dentro de `backend/src/` com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=database
PORT=3000
```

### 5. Executar o backend

No diretório raiz:

```bash
npm start
```

Ou diretamente:

```bash
npm run start:backend
```

O backend irá rodar em `http://localhost:3000`.

### 6. Executar o frontend

No diretório raiz:

```bash
npm run start:frontend
```

O frontend é servido pelo Vite, normalmente em `http://localhost:5173`.

## 🧩 Scripts importantes

- `npm install` - instalar dependências de todo o monorepo
- `npm start` - iniciar o backend
- `npm run start:backend` - iniciar apenas o backend
- `npm run start:frontend` - iniciar apenas o frontend
- `npm run build:frontend` - construir o frontend para produção

## 📁 Estrutura do Projeto

```
M5_Mini_Projeto/
├── package.json           # Workspace npm
├── backend/               # API RESTful com Node.js e Express
│   ├── package.json
│   ├── database-init.sql
│   └── src/
│       ├── app.js
│       ├── db.js
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── services/
└── frontend/              # Interface com TypeScript e Vite
    ├── package.json
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── index.html
    ├── main.ts
    ├── src/
    └── testes/
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

### Tags

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tags` | Buscar todas as tags |
| POST | `/tags` | Criar nova tag |
| DELETE | `/tags/:id` | Deletar tag |
| GET | `/tags/:id/tasks` | Buscar tarefas por tag |

### Utilizadores (Users)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Buscar todos os utilizadores |
| POST | `/users` | Criar novo utilizador |
| PUT | `/users/:id` | Atualizar utilizador |
| DELETE | `/users/:id` | Deletar utilizador |
| PATCH | `/users/:id` | Alternar status (ativo/inativo) |
| GET | `/users/stats` | Buscar estatísticas |

### Comentários (em Tarefas)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tasks/:id/comments` | Criar comentário |
| GET | `/tasks/:id/comments` | Buscar comentários |
| DELETE | `/tasks/:id/comments/:commentId` | Deletar comentário |

### Tags em Tarefas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/tasks/:id/tags` | Adicionar tag à tarefa |
| GET | `/tasks/:id/tags` | Buscar tags da tarefa |
| DELETE | `/tasks/:id/tags` | Remover tag da tarefa |

### Busca e Ordenação

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tasks?search=termo&sort=asc` | Buscar tarefas com filtro |
| GET | `/users?search=termo&sort=asc` | Buscar utilizadores com filtro |

**Parâmetros de query:**
- `search` - Termo de busca (opcional)
- `sort` - Ordenação: `asc` (crescente) ou `desc` (decrescente)

### Projetos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/projects` | Buscar todos os projetos |
| POST | `/projects` | Criar novo projeto |
| PUT | `/projects/:id` | Atualizar projeto |
| DELETE | `/projects/:id` | Deletar projeto |

### Sprints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/sprints` | Buscar todos os sprints |
| POST | `/sprints` | Criar novo sprint |
| PUT | `/sprints/:id` | Atualizar sprint |
| DELETE | `/sprints/:id` | Deletar sprint |

### Notificações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/notifications` | Buscar todas as notificações |
| POST | `/notifications` | Criar nova notificação |
| PUT | `/notifications/:id` | Marcar notificação como lida |
| DELETE | `/notifications/:id` | Deletar notificação |

## 🧪 Testes

Use ferramentas como Postman ou Insomnia para testar os endpoints HTTP.

## ✅ Autor

Desenvolvido por **Danilson Sanches** @upskill217

## 🧪 Testando a API

### Com PowerShell (Recomendado)

Execute o script de testes automatizados que testa todos os endpoints:

```powershell
powershell -ExecutionPolicy Bypass -File test-api-full.ps1
```

Este script realiza 25 testes completos cobrindo todas as operações CRUD, validações e endpoints principais da API.

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

### 📋 Exemplos Detalhados de Testes

#### Teste 1: Criar Novo Utilizador (POST /users)

**Requisição:**
```
Method: POST
URI: http://localhost:3000/users
Content-Type: application/json

Body:
{
  "nome": "João Silva",
  "email": "joao.silva@example.com",
  "telefone": "987654321"
}
```

**Resposta (201 Created):**
```json
{
  "id": 5,
  "nome": "João Silva",
  "email": "joao.silva@example.com",
  "telefone": "987654321",
  "ativo": 1,
  "dataCriacão": "2024-03-23T10:30:45.000Z"
}
```

#### Teste 2: Validação de Email Duplicado (POST /users com erro)

**Requisição:**
```
Method: POST
URI: http://localhost:3000/users
Content-Type: application/json

Body:
{
  "nome": "Outro Utilizador",
  "email": "joao.silva@example.com",    ← Email já existe
  "telefone": "123456789"
}
```

**Resposta (400 Bad Request):**
```json
{
  "erro": "Este email já está registrado",
  "codigo": "EMAIL_DUPLICADO",
  "statusCode": 400
}
```

## ✅ Testes Realizados

O script `test-api-full.ps1` executa **25 testes completos** cobrindo toda a API:

### Testes de GET (Listagem)
1. ✅ GET /tasks - Listar todas as tarefas
2. ✅ GET /users - Listar todos os utilizadores
3. ✅ GET /tags - Listar todas as tags
4. ✅ GET /users/stats - Estatísticas de utilizadores
5. ✅ GET /tasks/stats - Estatísticas de tarefas

### Testes de POST (Criação)
6. ✅ POST /users - Criar novo utilizador
7. ✅ POST /tags - Criar nova tag
8. ✅ POST /tasks - Criar nova tarefa
9. ✅ POST /tasks/:id/tags - Adicionar tag à tarefa
10. ✅ POST /tasks/:id/comments - Criar comentário

### Testes de Validação
11. ✅ POST /users (duplicate email) - Validar rejeição de emails duplicados
12. ✅ POST /tags (duplicate name) - Validar rejeição de nomes de tags duplicados

### Testes de PUT (Atualização)
13. ✅ PUT /users/:id - Atualizar utilizador
14. ✅ PUT /tasks/:id - Atualizar tarefa
15. ✅ PUT /tasks/:id/comments/:commentId - Atualizar comentário

### Testes de PATCH (Modificação Parcial)
16. ✅ PATCH /users/:id - Alternar status ativo/inativo
17. ✅ PATCH /tasks/:id/comments/:commentId - Marcar comentário como resolvido

### Testes de DELETE (Remoção)
18. ✅ DELETE /tasks/:id/tags/:tagId - Remover tag da tarefa
19. ✅ DELETE /tasks/:id/comments/:commentId - Deletar comentário
20. ✅ DELETE /tasks/:id - Deletar tarefa
21. ✅ DELETE /tags/:id - Deletar tag
22. ✅ DELETE /users/:id - Deletar utilizador (com validação de FK)

### Testes de GET com Relacionamentos
23. ✅ GET /tasks/:id/tags - Buscar tags de uma tarefa
24. ✅ GET /tasks/:id/comments - Buscar comentários de uma tarefa
25. ✅ GET /tags/:id/tasks - Buscar tarefas com uma tag

## 👨‍💻 Autor

Desenvolvido por **Danilson Sanches** @upskill217
