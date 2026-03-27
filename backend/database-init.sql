
/* Database */
DROP DATABASE IF EXISTS clickup_db;
CREATE DATABASE IF NOT EXISTS clickup_db;

USE clickup_db;

/* Users */
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    gender VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Project Status */
CREATE TABLE project_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);

/* Project */
CREATE TABLE project (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    project_status_id INT,
    start_date DATETIME,
    end_date_expected DATETIME,
    FOREIGN KEY (project_status_id)
        REFERENCES project_status (id)
        ON DELETE CASCADE
);

/* Task Status */
CREATE TABLE task_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);

/* Categories */
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);

/* Priorities */
CREATE TABLE priorities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);

/* Task */
CREATE TABLE task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    task_status_id INT NOT NULL,
    priority_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    project_id INT NOT NULL,
    due_date DATETIME,
    completed_at DATETIME,
    estimated_hours DECIMAL(5 , 2 ) NOT NULL,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_status_id)
        REFERENCES task_status (id)
        ON DELETE CASCADE,
    FOREIGN KEY (priority_id)
        REFERENCES priorities (id)
        ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON DELETE CASCADE
);

/* Task Assignees (N:M) */
CREATE TABLE task_assignees (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id , user_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Labels */
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20)
);

/* tags_Task (N:M) */
CREATE TABLE tags_task (
    task_id INT,
    tag_id INT,
    PRIMARY KEY (task_id , tag_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
);

/* Comments */
CREATE TABLE comment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME,
    resolved TINYINT(1) DEFAULT 0,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Task Attachments */
CREATE TABLE task_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    size_kb INT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);

/* Notifications */
CREATE TABLE notification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Teams */
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Team Members */
CREATE TABLE team_members (
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id , user_id),
    FOREIGN KEY (team_id)
        REFERENCES teams (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Task Votes */
CREATE TABLE task_votes (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id , user_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Task Status History */
CREATE TABLE task_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    previous_status_id INT NOT NULL,
    new_status_id INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (previous_status_id)
        REFERENCES task_status (id)
        ON DELETE CASCADE,
    FOREIGN KEY (new_status_id)
        REFERENCES task_status (id)
        ON DELETE CASCADE
);

/* Project Permissions */
CREATE TABLE project_permissions (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    can_edit TINYINT(1) DEFAULT 0,
    can_delete TINYINT(1) DEFAULT 0,
    PRIMARY KEY (project_id , user_id),
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Dependencies */
CREATE TABLE task_dependencies (
    task_id INT,
    dependent_task_id INT,
    type ENUM('blocks', 'depends_on'),
    PRIMARY KEY (task_id , dependent_task_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (dependent_task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);

/* Favorites */
CREATE TABLE favorite_tasks (
    user_id INT,
    task_id INT,
    marked_at DATETIME,
    PRIMARY KEY (user_id , task_id),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);

/* Reminders */
CREATE TABLE reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    task_id INT,
    message VARCHAR(200),
    reminder_date DATETIME,
    sent TINYINT(1),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);

/* Sprints */
CREATE TABLE sprints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    name VARCHAR(100),
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE
);

CREATE TABLE sprint_tasks (
    sprint_id INT,
    task_id INT,
    PRIMARY KEY (sprint_id , task_id),
    FOREIGN KEY (sprint_id)
        REFERENCES sprints (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);

/* Mentions */
CREATE TABLE mentions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT,
    mentioned_user_id INT,
    FOREIGN KEY (comment_id)
        REFERENCES comment (id)
        ON DELETE CASCADE,
    FOREIGN KEY (mentioned_user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

/* Time Logs */
CREATE TABLE time_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    user_id INT,
    hours DECIMAL(5 , 2 ) NOT NULL,
    description TEXT NOT NULL,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);
-- =====================================================
-- DADOS DE TESTE
-- =====================================================
use clickup_db;

/* 1. Users */
INSERT INTO users (name, email, phone, gender, active, created_at) VALUES 
('Ana Martins','ana@email.com','910000001', 'Female', 1, '2026-01-10 09:00:00'),
('Bruno Alves','bruno@email.com','910000002', 'Male', 1, '2026-01-11 09:00:00'),
('Catarina Dias','catarina@email.com','910000003', 'Female', 1, '2026-01-12 09:00:00'),
('Diogo Rocha','diogo@email.com','910000004', 'Male', 1, '2026-01-13 09:00:00'),
('Eduarda Gomes','eduarda@email.com','910000005', 'Female', 1, '2026-01-14 09:00:00'),
('Fabio Lopes','fabio@email.com','910000006', 'Male', 1, '2026-01-15 09:00:00'),
('Gabriela Vaz', 'gabriela.vaz@email.pt', '910000007', 'Female', 1, DATE_ADD(NOW(), INTERVAL 2 DAY)),
('Hugo Neves', 'hugo.neves@email.com', '910000008', 'Male', 1, DATE_ADD(NOW(), INTERVAL 5 DAY)),
('Inês Duarte', 'ines.duarte@email.com', '910000009', 'Female', 1, DATE_ADD(NOW(), INTERVAL 4 DAY)),
('Jorge Mota', 'jorge.mota@email.pt', '910000010', 'Male', 1, DATE_ADD(NOW(), INTERVAL 7 DAY));

/* 2. Project Status & Projects (Todos os 9) */
INSERT INTO project_status (name, flow_order) VALUES 
('Ativo', 1), 
('Em Desenvolvimento', 2), 
('Terminado', 3);

INSERT INTO project (name, description, project_status_id, start_date, end_date_expected) VALUES 
('Sistema Gestão Escolar','Plataforma para gestão escolar',1,'2026-02-01','2026-09-01'),
('App Delivery','Aplicação para entregas locais',2,'2026-02-01','2026-07-01'),
('E-commerce de Artesanato', 'Plataforma para venda de produtos.', 1, DATE_ADD(NOW(), INTERVAL 5 DAY), '2026-12-15 23:59:59'),
('Portal de Voluntariado', 'Website para conectar ONGs.', 1, DATE_ADD(NOW(), INTERVAL 12 DAY), '2026-08-10 19:00:00'),
('Monitor de Gastos Energéticos', 'Sistema IoT.', 3, DATE_ADD(NOW(), INTERVAL 20 DAY), '2027-01-30 14:00:00'),
('Migração de Base de Dados Antiga', 'Migração crítica.', 2, '2023-10-01', '2023-12-15'),
('Redesign do Site Institucional', 'Atualização interface.', 1, '2024-01-10', '2024-03-01'),
('Manutenção de Servidores Legados', 'Correção vulnerabilidades.', 3, '2023-05-20', '2023-06-10'),
('Implementação de Firewall Interna', 'Regras de segurança.', 1, '2024-02-15', '2024-02-28');

/* 3. Task Meta-data */
INSERT INTO task_status (name, flow_order) VALUES 
('Backlog',1), 
('Pendente',2), 
('Em Progresso',3), 
('Revisão',4), 
('Concluída',5);

INSERT INTO priorities (name, flow_order) VALUES 
('Baixa', 1), 
('Médio', 2), 
('Alta', 3), 
('Critica', 4);

INSERT INTO categories (name, flow_order) VALUES 
('Backend',1), 
('Frontend',2), 
('Infraestrutura',3);

/* 4. Tasks (As 15 tarefas) */
INSERT INTO task (title, description, task_status_id, priority_id, category_id, project_id, due_date, completed_at, estimated_hours, created_at) VALUES
('Módulo de Notas', 'Desenvolvimento do boletim escolar', 2, 4, 1, 1, '2026-03-15', NULL, 15.00, '2026-02-01'),
('Integração de Mapas', 'API Google Maps para estafetas', 2, 4, 2, 2, '2026-04-10', NULL, 20.00, '2026-02-01'),
('Checkout Transacional', 'Configuração de pagamento e frete', 1, 4, 1, 3, '2026-05-20', NULL, 12.00, NOW()),
('Catálogo de Produtos', 'Upload de imagens e descrições', 1, 3, 2, 3, '2026-05-10', NULL, 8.00, NOW()),
('Filtro de ONGs', 'Sistema de busca por categoria', 1, 2, 1, 4, '2026-06-15', NULL, 10.00, NOW()),
('Perfil do Voluntário', 'Criação de dashboard de usuário', 1, 3, 2, 4, '2026-06-30', NULL, 14.00, NOW()),
('Configuração de Hub IoT', 'Setup inicial do hardware', 2, 4, 3, 5, '2026-12-20', NULL, 25.00, NOW()),
('Gráficos de Consumo', 'Visualização de dados em tempo real', 1, 3, 1, 5, '2027-01-15', NULL, 18.00, NOW()),
('Mapeamento de Tabelas', 'De/Para de campos antigos', 5, 4, 1, 6, '2023-11-01', '2023-10-28', 10.00, '2023-10-01'),
('Limpeza de Dados', 'Remover duplicados na migração', 5, 3, 1, 6, '2023-11-15', '2023-11-10', 12.00, '2023-10-10'),
('Implementação de CSS', 'Estilização conforme mockups', 5, 2, 2, 7, '2024-02-15', '2024-02-14', 20.00, '2024-01-15'),
('Auditoria de Logs', 'Verificação de acessos indevidos', 5, 4, 3, 8, '2023-06-05', '2023-06-04', 5.00, '2023-05-25'),
('Update SSL', 'Renovação de certificados', 5, 3, 3, 8, '2023-06-08', '2023-06-07', 2.00, '2023-06-01'),
('Bloqueio de IPs Externos', 'Configuração de regras deny-all', 5, 4, 3, 9, '2024-02-25', '2024-02-24', 4.00, '2024-02-15'),
('Testes de Intrusão', 'Validar eficácia das regras', 5, 4, 3, 9, '2024-02-28', '2024-02-28', 8.00, '2024-02-20');

/* 5. Assignees, Comments & Labels (Tudo o que enviou) */
INSERT INTO task_assignees (task_id, user_id, assigned_at) VALUES
(1, 1, '2026-02-02'), 
(2, 2, '2026-02-03'), 
(3, 3, '2026-02-04'), 
(4, 4, '2026-02-05'), 
(5, 5, '2026-02-06'), 
(6, 6, '2026-02-07'), 
(7, 7, '2026-02-08'), 
(8, 8, '2026-02-09'), 
(9, 9, '2026-02-10'), 
(10, 10, '2026-02-11'),
(11, 1, '2026-02-12'), 
(12, 2, '2026-02-13'), 
(13, 3, '2026-02-14'), 
(14, 4, '2026-02-15'), 
(15, 5, '2026-02-16');

INSERT INTO comment (content, task_id, user_id, created_at, resolved) VALUES 
('Análise inicial da tarefa 1', 1, 1, '2026-02-02 10:00:00', 0), 
('Documentação da tarefa 2 pronta', 2, 2, '2026-02-03 11:30:00', 0), 
('Iniciando desenvolvimento da tarefa 3', 3, 3, '2026-02-04 09:15:00', 0), 
('Aguardando feedback na tarefa 4', 4, 4, '2026-02-05 14:00:00', 0), 
('Tarefa 5 em fase de testes', 5, 5, '2026-02-06 16:45:00', 0), 
('Problema técnico na tarefa 6 reportado', 6, 6, '2026-02-07 10:20:00', 0), 
('Tarefa 7 validada pelo QA', 7, 7, '2026-02-08 11:00:00', 0), 
('Revisão de código da tarefa 8 concluída', 8, 8, '2026-02-09 17:30:00', 0), 
('Tarefa 9 enviada para homologação', 9, 9, '2026-02-10 13:00:00', 0), 
('Tarefa 10 finalizada e resolvida', 10, 10, '2026-02-11 18:00:00', 1), 
('Ajustes finos na tarefa 11', 11, 1, '2026-02-12 10:00:00', 0), 
('Tarefa 12 aguardando deploy', 12, 2, '2026-02-13 09:00:00', 0), 
('Início do mapeamento na tarefa 13', 13, 3, '2026-02-14 15:20:00', 0), 
('Tarefa 14 com dependências externas', 14, 4, '2026-02-15 11:45:00', 0), 
('Tarefa 15 pronta para revisão final', 15, 5, '2026-02-16 14:10:00', 0);

INSERT INTO tags (id, name, color) VALUES
(1, 'Urgente', 'Vermelho'),
(2, 'Frontend', 'Azul'),
(3, 'Backend', 'Verde'), 
(4, 'Bug', 'Laranja'), 
(5, 'Melhoria', 'Roxo');

INSERT INTO tags_task (task_id, tag_id) VALUES
-- Tarefas de Desenvolvimento (Frontend/Backend)
(1, 2), (1, 1), -- Tarefa 1: Frontend + Urgente
(2, 3), (2, 4), -- Tarefa 2: Backend + Bug
(3, 2),         -- Tarefa 3: Frontend
(4, 2),         -- Tarefa 4: Frontend
(5, 3), (5, 4), -- Tarefa 5: Backend + Bug
-- Tarefas de Manutenção e Bugs
(6, 4),         -- Tarefa 6: Bug
(7, 5),         -- Tarefa 7: Melhoria
(8, 3),         -- Tarefa 8: Backend
(9, 5),         -- Tarefa 9: Melhoria
(10, 1),        -- Tarefa 10: Urgente
-- Tarefas Finais/Passadas
(11, 2),        -- Tarefa 11: Frontend
(12, 4),        -- Tarefa 12: Bug
(13, 3),        -- Tarefa 13: Backend
(14, 1),        -- Tarefa 14: Urgente
(15, 5);        -- Tarefa 15: Melhoria

/* 6. Task Attachments (Os 22 anexos) */
INSERT INTO task_attachments (task_id, file_name, file_type, size_kb) VALUES 
(1, 'config_mysql.conf', 'text', 15), 
(1, 'log_instalacao.txt', 'txt', 45), 
(2, 'layout_final.fig', 'fig', 12400), 
(2, 'paleta_cores.pdf', 'pdf', 2100), 
(3, 'auth_flow.png', 'png', 850), 
(3, 'jwt_specs.pdf', 'pdf', 120),
(4, 'relatorio_performance.pdf', 'pdf', 3400),
(4, 'grafico_latencia.png', 'png', 620), 
(5, 'swagger_export.json', 'json', 95),
(5, 'exemplo_request.txt', 'txt', 10),
(6, 'print_erro_duplicado.png', 'png', 450),
(6, 'fix_logs.txt', 'txt', 12),
(7, 'stripe_docs.pdf', 'pdf', 5600),
(7, 'webhook_test.json', 'json', 5), 
(8, 'explain_plan.txt', 'txt', 25), 
(8, 'benchmarks.xlsx', 'xlsx', 110),
(9, 'wireframe_mobile.png', 'png', 1100),
(9, 'copywriting_v1.docx', 'docx', 45), 
(10, 'ata_reuniao.pdf', 'pdf', 320), 
(10, 'backlog_priorizado.xlsx', 'xlsx', 85),
(11, 'codigo_antigo.bak', 'bak', 50), 
(11, 'teste_unitario.py', 'py', 8);

/* 7. Notifications & Teams */
INSERT INTO notification (user_id, title, message, is_read) VALUES 
(1, 'Nova Tarefa', 'Atribuída a tarefa 1: Sistema Gestão Escolar.', 0),
(2, 'Nova Tarefa', 'Atribuída a tarefa 2: App Delivery.', 0),
(3, 'Nova Tarefa', 'Atribuída a tarefa 3: Checkout Transacional.', 0),
(4, 'Nova Tarefa', 'Atribuída a tarefa 4: Filtro de ONGs.', 0),
(5, 'Nova Tarefa', 'Atribuída a tarefa 5: Configuração Hub IoT.', 0),
(6, 'Nova Tarefa', 'Atribuída a tarefa 6: Mapeamento de Tabelas.', 1),
(7, 'Nova Tarefa', 'Atribuída a tarefa 7: Implementação CSS.', 1),
(8, 'Nova Tarefa', 'Atribuída a tarefa 8: Auditoria de Logs.', 0),
(9, 'Nova Tarefa', 'Atribuída a tarefa 9: Bloqueio de IPs.', 0),
(10, 'Nova Tarefa', 'Atribuída a tarefa 10: Testes de Intrusão.', 0),
(1, 'Nova Tarefa', 'Atribuída a tarefa 11: Ajustes Finos.', 1),
(2, 'Nova Tarefa', 'Atribuída a tarefa 12: Aguardando Deploy.', 0),
(3, 'Nova Tarefa', 'Atribuída a tarefa 13: Início do Mapeamento.', 0),
(4, 'Nova Tarefa', 'Atribuída a tarefa 14: Dependências Externas.', 1),
(5, 'Nova Tarefa', 'Atribuída a tarefa 15: Revisão Final.', 0);

INSERT INTO teams (name, description) VALUES 
('Frontend Devs', 'Interface UI/UX.'), 
('Backend Ops', 'APIs e DB.'), 
('QA & Testes', 'Qualidade.'), 
('Design Criativo', 'Visual.'), 
('Gestão de Produto', 'Requisitos.');

/* 1. Membros das Equipas (Completar as 5 equipas que inserimos no passo anterior) */
INSERT INTO team_members (team_id, user_id, role) VALUES 
-- Equipa 1: Frontend Devs (User 1 como Admin + 2 Membros)
(1, 1, 'admin'),
(1, 2, 'member'),
(1, 3, 'member'),
-- Equipa 2: Backend Ops (User 4 como Admin + 2 Membros)
(2, 4, 'admin'),
(2, 5, 'member'), 
(2, 6, 'member'), 
-- Equipa 3: QA & Testes (User 7 como Admin + 1 Membro)
(3, 7, 'admin'), 
(3, 8, 'member'),               
-- Equipa 4: Design Criativo (User 9 como Admin)
(4, 9, 'admin'),                                  
-- Equipa 5: Gestão de Produto (User 10 como Admin)
(5, 10, 'admin'),
-- Adicionando um segundo membro à equipa de Gestão para balancear
(5, 1, 'member'); 
                                
/* 2. Permissões de Projeto */
INSERT INTO project_permissions (project_id, user_id, can_edit, can_delete) VALUES 
(1, 1, 1, 1), 
(1, 2, 1, 0), 
(2, 4, 1, 1),
 (2, 5, 1, 0),
(3, 10, 1, 1);

/* 3. Votos em Tarefas */
INSERT INTO task_votes (task_id, user_id, voted_at) VALUES 
(1, 1, NOW()), (1, 2, NOW()), (1, 3, NOW()), -- Tarefa 1 com 3 votos
(10, 10, NOW()), (10, 9, NOW()),             -- Tarefa 10 com 2 votos
(5, 5, NOW()), (5, 6, NOW()),                -- Tarefa 5 com 2 votos
(14, 4, NOW()),                              -- Tarefa 14 com 1 voto
(2, 2, NOW()),                               -- Tarefa 2 com 1 voto
(15, 8, NOW());                              -- Tarefa 15 com 1 voto

/* 4. Tarefas Favoritas */
INSERT INTO favorite_tasks (user_id, task_id, marked_at) VALUES 
(1, 1, '2026-02-02 10:00:00'), 
(1, 5, '2026-02-06 11:00:00'),
(2, 10, '2026-02-13 15:00:00');

/* 5. Dependências entre Tarefas */
INSERT INTO task_dependencies (task_id, dependent_task_id, type) VALUES 
(1, 2, 'blocks'),      -- Tarefa 1 bloqueia a 2
(3, 1, 'depends_on'),  -- Tarefa 3 depende da 1
(6, 7, 'blocks');      -- Tarefa 6 bloqueia a 7

/* 6. Sprints e Sprint Tasks */
/* Criar Sprints */
INSERT INTO sprints (id, project_id, name, start_date, end_date) VALUES 
(1, 1, 'Sprint 01 - Core Gestão', '2026-02-01', '2026-02-15'),
(2, 1, 'Sprint 02 - Refinamento', '2026-02-16', '2026-03-01'),
(3, 2, 'Sprint Alpha - Delivery', '2026-02-01', '2026-02-28');

/* Associar Tarefas às Sprints (sprint_tasks) */
INSERT INTO sprint_tasks (sprint_id, task_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Tarefas da primeira fase do Proj 1
(2, 11), (2, 13),                       -- Tarefas de refinamento do Proj 1
(3, 12), (3, 14), (3, 15);              -- Tarefas do Proj 2

/* 7. Histórico de Estados (Task Status History) */
INSERT INTO task_status_history (task_id, previous_status_id, new_status_id, changed_at) VALUES 
(1, 1, 2, '2026-02-02 09:00:00'),
(5, 2, 3, '2026-02-06 10:00:00'),
(10, 3, 5, '2026-02-13 16:00:00');

/* 8. Registo de Tempo (Time Logs) */
INSERT INTO time_logs (task_id, user_id, hours, description, logged_at) VALUES 
(1, 1, 4.50, 'Desenvolvimento inicial do módulo de notas.', '2026-02-05 10:00:00'),
(2, 2, 6.00, 'Configuração da API de mapas e testes de rota.', '2026-02-06 14:30:00'),
(3, 3, 3.00, 'Configuração inicial do Stripe para checkout.', '2026-02-07 09:00:00'),
(4, 4, 5.50, 'Criação dos filtros de pesquisa por categoria.', '2026-02-08 11:15:00'),
(5, 5, 8.00, 'Montagem e calibração do hardware IoT.', '2026-02-09 16:00:00'),
(6, 6, 4.00, 'Mapeamento de campos da base legado para nova.', '2023-10-05 10:00:00'),
(7, 7, 7.25, 'Ajustes de CSS para mobile e responsividade.', '2024-01-20 13:00:00'),
(8, 8, 2.00, 'Análise de logs de acesso do servidor legado.', '2023-05-25 15:45:00'),
(9, 9, 3.50, 'Configuração de regras de bloqueio no firewall.', '2024-02-18 09:30:00'),
(10, 10, 4.00, 'Execução de pentest e relatório de vulnerabilidades.', '2026-02-15 17:00:00'),
(11, 1, 2.50, 'Refatoração de código após code review.', '2026-02-14 11:00:00'),
(12, 2, 1.50, 'Preparação de scripts de deploy em produção.', '2026-02-16 10:30:00'),
(13, 3, 5.00, 'Finalização do De/Para das tabelas críticas.', '2026-02-17 14:00:00'),
(14, 4, 6.00, 'Resolução de conflitos de dependências NPM.', '2026-02-18 16:20:00'),
(15, 5, 4.00, 'Revisão final de interface e testes unitários.', '2026-02-19 09:00:00');