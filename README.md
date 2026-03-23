# Projeto 2 - API Completa com Banco de Dados

Uma API RESTful completa desenvolvida com Node.js, Express e MySQL para gerenciar tarefas, utilizadores, tags e comentários.

## � Como Obter o Projeto

### Clonar do GitHub

```bash
git clone https://github.com/dsanches06/M5_Mini_Projeto.git
cd M5_Mini_Projeto
```

Ou use HTTPS:

```bash
git clone https://github.com/dsanches06/M5_Mini_Projeto.git
cd M5_Mini_Projeto
```

## �📋 Tecnologias Utilizadas

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
M5_Mini_Projeto/
├── package.json           # Dependências e scripts
├── database-init.sql      # Script de inicialização do banco de dados
├── test-api-full.ps1      # Script de testes automatizados (PowerShell)
│
├── backend/               # API RESTful com Node.js e Express
│   ├── package.json
│   ├── database-init.sql
│   ├── test-api-full.ps1
│   └── src/
│       ├── .env                   # Variáveis de ambiente (CRIAR MANUALMENTE)
│       ├── app.js                 # Aplicação Express principal
│       ├── db.js                  # Configuração do banco de dados
│       ├── controllers/           # Controladores das rotas
│       │   ├── taskController.js
│       │   ├── tagController.js
│       │   ├── userController.js
│       │   ├── projectController.js
│       │   ├── sprintController.js
│       │   ├── notificationController.js
│       │   └── commentController.js
│       ├── middlewares/           # Middlewares personalizados
│       │   ├── checkUserExists.js
│       │   └── loggerMiddleware.js
│       ├── routes/                # Definição das rotas
│       │   ├── taskRoutes.js
│       │   ├── tagRoutes.js
│       │   ├── userRoutes.js
│       │   ├── projectRoutes.js
│       │   ├── sprintRoutes.js
│       │   ├── notificationRoutes.js
│       │   └── commentRoutes.js
│       └── services/              # Lógica de negócio
│           ├── taskService.js
│           ├── tagService.js
│           ├── userService.js
│           ├── projectService.js
│           ├── sprintService.js
│           ├── notificationService.js
│           ├── commentService.js
│           └── otherServices.js
│
└── frontend/              # Interface com TypeScript e Vite
    ├── package.json
    ├── tsconfig.json
    ├── vitest.config.ts
    ├── index.html
    ├── main.ts
    ├── src/
    │   ├── assets/                # Imagens e recursos estáticos
    │   ├── attachments/           # Serviços de anexos
    │   │   └── Attachment.ts
    │   ├── comments/              # Serviços de comentários
    │   │   └── Comment.ts
    │   ├── dashboards/            # Configurações de dashboard
    │   │   ├── DashboardColumn.ts
    │   │   └── DashboardConfig.ts
    │   ├── helpers/               # Funções auxiliares
    │   │   ├── Buffer.ts
    │   │   ├── fakeData.ts
    │   │   ├── generateRandomColor.ts
    │   │   ├── getTaskByFilter.ts
    │   │   ├── infoBanner.ts
    │   │   └── index.ts
    │   ├── logs/                  # Sistema de logging
    │   │   └── SystemLogger.ts
    │   ├── models/                # Modelos de dados
    │   │   ├── BaseEntity.ts
    │   │   ├── IUser.ts
    │   │   ├── UserClass.ts
    │   │   └── index.ts
    │   ├── notifications/         # Sistema de notificações
    │   │   └── Notifications.ts
    │   ├── security/              # Segurança e permissões
    │   │   ├── PermissionService.ts
    │   │   ├── UserRole.ts
    │   │   └── index.ts
    │   ├── services/              # Serviços de negócio
    │   │   ├── assignmentService.ts
    │   │   ├── attachmentService.ts
    │   │   ├── automationRulesService.ts
    │   │   ├── backupService.ts
    │   │   ├── BusinessRules.ts
    │   │   ├── commentService.ts
    │   │   ├── deadLineService.ts
    │   │   ├── notificationService.ts
    │   │   ├── searchService.ts
    │   │   ├── statisticsService.ts
    │   │   ├── SystemConfig.ts
    │   │   └── index.ts
    │   ├── styles/                # Folhas de estilo CSS
    │   ├── tasks/                 # Componentes de tarefas
    │   ├── ui/                    # Componentes UI reutilizáveis
    │   └── utils/                 # Utilitários gerais
    │
    └── testes/                    # Testes com Vitest
        ├── assignmentService.test.ts
        ├── attachmentService.test.ts
        ├── automationRulesService.test.ts
        ├── backupService.test.ts
        ├── businessRules.test.ts
        ├── commentService.test.ts
        ├── deadLineService.test.ts
        ├── dependencyGraph.test.ts
        ├── entityList.test.ts
        ├── favorites.test.ts
        ├── notificationService.test.ts
        ├── paginator.test.ts
        ├── priorityManager.test.ts
        ├── ratingSystem.test.ts
        ├── searchService.test.ts
        ├── simpleCache.test.ts
        ├── statisticsService.test.ts
        ├── systemConfig.test.ts
        ├── tagManager.test.ts
        ├── taskService.test.ts
        ├── taskUtils.test.ts
        ├── userService.test.ts
        └── watcherSystem.test.ts
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
  -d '{"nome":"João Silva","email":"joao@example.com","telefone":"987654321"}'
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
