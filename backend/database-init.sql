
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

/* Task Assignees (1:N with max 1 user por task) */
CREATE TABLE task_assignees (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id , user_id),
    UNIQUE KEY uniq_task_assignment (task_id),
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
    task_id INT NOT NULL,
    tag_id INT NOT NULL,
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
    resolved BOOLEAN DEFAULT FALSE,
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
    is_read BOOLEAN DEFAULT FALSE,
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
    project_id INT NOT NULL,
    name VARCHAR(100),
    description TEXT,
    status_id INT NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE,
    FOREIGN KEY (status_id)
        REFERENCES project_status (id)
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
INSERT INTO users (id, name, email, phone, gender, active, created_at) VALUES 
(1, 'Ana Martins','ana@email.com','910000001', 'Female', 1, '2026-01-10 09:00:00'),
(2, 'Bruno Alves','bruno@email.com','910000002', 'Male', 1, '2026-01-11 09:00:00'),
(3, 'Catarina Dias','catarina@email.com','910000003', 'Female', 1, '2026-01-12 09:00:00'),
(4, 'Diogo Rocha','diogo@email.com','910000004', 'Male', 1, '2026-01-13 09:00:00'),
(5, 'Eduarda Gomes','eduarda@email.com','910000005', 'Female', 1, '2026-01-14 09:00:00'),
(6, 'Fabio Lopes','fabio@email.com','910000006', 'Male', 1, '2026-01-15 09:00:00'),
(7, 'Gabriela Vaz','gabriela.vaz@email.pt','910000007', 'Female', 1, NOW()),
(8, 'Hugo Neves','hugo.neves@email.com','910000008', 'Male', 1, NOW()),
(9, 'Inês Duarte','ines.duarte@email.com','910000009', 'Female', 1, NOW()),
(10, 'Jorge Mota','jorge.mota@email.pt','910000010', 'Male', 1, NOW()),
(11, 'Laura Pinto','laura@email.com','910000011', 'Female', 1, NOW()),
(12, 'Marco Silva','marco@email.com','910000012', 'Male', 1, NOW()),
(13, 'Nuno Costa','nuno@email.com','910000013', 'Male', 1, NOW()),
(14, 'Olga Ferreira','olga@email.com','910000014', 'Female', 1, NOW()),
(15, 'Paulo Ribeiro','paulo@email.com','910000015', 'Male', 1, NOW()),
(16, 'Rita Carvalho','rita@email.com','910000016', 'Female', 1, NOW()),
(17, 'Sofia Teixeira','sofia@email.com','910000017', 'Female', 1, NOW()),
(18, 'Tiago Monteiro','tiago@email.com','910000018', 'Male', 1, NOW()),
(19, 'Vera Batista','vera@email.com','910000019', 'Female', 1, NOW()),
(20, 'Zé Santos','ze@email.com','910000020', 'Male', 1, NOW());

/* 2. Project Status & Projects (Todos os 9) */
INSERT INTO project_status (name, flow_order) VALUES 
('Ativo', 1), 
('Em Desenvolvimento', 2), 
('Terminado', 3);

INSERT INTO project (name, description, project_status_id, start_date, end_date_expected) VALUES 
('Sistema Gestão Escolar', 'Plataforma para gestão escolar', 1, '2026-01-15', '2026-09-01'), 
('App Delivery', 'Aplicação para entregas locais', 2, '2026-02-01', '2026-07-01'), 
('E-commerce de Artesanato', 'Plataforma para venda de produtos.', 1, DATE_ADD(NOW(), INTERVAL 5 DAY), '2026-12-15 23:59:59'), 
('Portal de Voluntariado', 'Website para conectar ONGs.', 1, DATE_ADD(NOW(), INTERVAL 12 DAY), '2026-08-10 19:00:00'), 
('Monitor de Gastos Energéticos', 'Sistema IoT.', 3, DATE_ADD(NOW(), INTERVAL 20 DAY), '2027-01-30 14:00:00');

/* 3. Task Meta-data */
INSERT INTO task_status (name, flow_order) VALUES 
('Backlog',1), 
('Pendente',2), 
('Em Progresso',3), 
('Revisão',4), 
('Concluida',5),
('Arquivado',6);

INSERT INTO priorities (name, flow_order) VALUES 
('Baixa', 1), 
('Médio', 2), 
('Alta', 3), 
('Critica', 4);

INSERT INTO categories (name, flow_order) VALUES 
('Backend',1), 
('Frontend',2), 
('Infraestrutura',3);

/* 4. Tasks (Expandido para 30 tarefas) */
INSERT INTO task (title, description, task_status_id, priority_id, category_id, project_id, due_date, completed_at, estimated_hours, created_at) VALUES
('Módulo de Notas', 'Boletim escolar', 2, 4, 1, 1, '2026-03-20', NULL, 15.0, '2026-02-01'),
('Implementação de CSS', 'Estilização mockups', 5, 2, 2, 1, '2026-02-15', '2026-02-14', 20.0, '2026-01-15'),
('Integração de Mapas', 'API Google Maps', 2, 4, 2, 2, '2026-04-10', NULL, 20.0, '2026-02-01'),
('Checkout Transacional', 'Pagamento e frete', 1, 4, 1, 3, DATE_ADD(NOW(), INTERVAL 15 DAY), NULL, 12.0, NOW()),
('Catálogo de Produtos', 'Upload de imagens', 1, 3, 2, 3, '2026-05-10', NULL, 8.0, NOW()),
('Filtro de ONGs', 'Busca por categoria', 1, 2, 1, 4, '2026-06-15', NULL, 10.0, NOW()),
('Mapeamento de Tabelas', 'Organização de campos', 5, 4, 1, 1, '2026-11-01', '2026-10-28', 10.0, '2026-10-01'),
('Limpeza de Dados', 'Remover duplicados', 5, 3, 1, 1, '2026-11-15', '2026-11-10', 12.0, '2026-10-10'),
('Perfil do Voluntário', 'Dashboard de usuário', 1, 3, 2, 4, '2026-06-30', NULL, 14.0, NOW()),
('Configuração de Hub IoT', 'Setup hardware', 2, 4, 3, 5, '2026-12-20', NULL, 25.0, NOW()),
('Gráficos de Consumo', 'Dados em tempo real', 1, 3, 1, 5, '2027-01-15', NULL, 18.0, NOW()),
('Auditoria de Logs', 'Verificação acessos', 5, 4, 3, 5, '2026-06-05', '2026-06-04', 5.0, '2026-05-25'),
('Update SSL', 'Certificados', 5, 3, 3, 3, '2026-06-08', '2026-06-07', 2.0, '2026-06-01'),
('Bloqueio de IPs Externos', 'Regras deny-all', 5, 4, 3, 5, '2026-02-25', '2026-02-24', 4.0, '2026-02-15'),
('Testes de Intrusão', 'Validar regras', 5, 4, 3, 5, '2026-02-28', '2026-02-28', 8.0, '2026-02-20'),
('Menu Responsivo', 'Adaptação para tablets', 1, 2, 2, 1, DATE_ADD(NOW(), INTERVAL 10 DAY), NULL, 6.0, NOW()),
('Otimização de SVGs', 'Reduzir peso das imagens', 2, 1, 2, 1, '2026-04-01', NULL, 4.0, NOW()),
('Fix: Erro de Login', 'Corrigir timeout no mobile', 1, 4, 2, 1, DATE_ADD(NOW(), INTERVAL 7 DAY), NULL, 3.0, NOW()),
('Nova Rota de API', 'Endpoint para histórico', 1, 3, 1, 2, '2026-04-15', NULL, 8.0, NOW()),
('Indexação de Banco', 'Melhorar busca de produtos', 2, 4, 1, 3, '2026-05-05', NULL, 10.0, NOW()),
('Migração v2', 'Upgrade da lib de Stripe', 1, 3, 1, 3, '2026-05-25', NULL, 12.0, NOW()),
('Documentação PDF', 'Gerar manual do usuário', 1, 2, 1, 4, '2026-07-10', NULL, 20.0, NOW()),
('Análise de Custos', 'Levantamento financeiro', 1, 4, 1, 1, '2026-08-01', NULL, 15.0, NOW()),
('Ata de Sprint', 'Revisão da sprint 4', 5, 1, 1, 4, '2026-02-20', '2026-02-20', 2.0, '2026-02-19'),
('Redesign Logo', 'Nova versão vetorial', 1, 2, 2, 4, '2026-07-15', NULL, 10.0, NOW()),
('Dark Mode Specs', 'Definição de cores dark', 2, 3, 2, 4, '2026-07-20', NULL, 8.0, NOW()),
('Stress Test', 'Teste de carga no Hub', 1, 4, 3, 5, '2026-12-30', NULL, 16.0, NOW()),
('Patch de Kernel', 'Atualização segurança OS', 5, 4, 3, 5, '2026-07-01', '2026-06-30', 4.0, '2026-06-25'),
('Firewall Policy', 'Review de portas abertas', 1, 3, 3, 5, '2026-04-10', NULL, 6.0, NOW()),
('Simulação de Invasão', 'Phishing interno teste', 2, 4, 3, 5, '2026-05-01', NULL, 20.0, NOW());


/* 5. Assignees (Ajustados para as Equipas) */
/* 5. Task Assignees (Sincronização Final com Time Logs e Users 1-20) */
INSERT INTO task_assignees (task_id, user_id, assigned_at) VALUES
(1, 1, '2026-02-01'),   -- Ana Martins
(2, 4, '2026-02-01'),   -- Diogo Rocha
(3, 13, '2026-02-02'),  -- Nuno Costa
(4, 14, '2026-02-05'),  -- Olga Ferreira
(5, 19, '2026-04-01'),  -- Vera Batista
(6, 9, '2026-06-01'),   -- Inês Duarte
(7, 15, '2026-11-20'),  -- Paulo Ribeiro
(8, 16, '2026-12-01'),  -- Rita Carvalho
(9, 10, '2023-10-01'),  -- Jorge Mota
(10, 1, '2023-10-01'),  -- Ana Martins
(11, 2, '2024-01-15'),  -- Bruno Alves
(12, 7, '2023-05-25'),  -- Gabriela Vaz
(13, 8, '2023-06-01'),  -- Hugo Neves
(14, 15, '2024-02-15'), -- Paulo Ribeiro
(15, 16, '2024-02-20'), -- Rita Carvalho
(16, 11, '2026-03-01'), -- Laura Pinto
(17, 12, '2026-03-15'), -- Marco Silva
(18, 3, '2026-02-25'),  -- Catarina Dias
(19, 5, '2026-04-01'),  -- Eduarda Gomes
(20, 6, '2026-04-15'),  -- Fabio Lopes
(21, 13, '2026-05-01'), -- Nuno Costa
(22, 10, '2026-06-15'), -- Jorge Mota
(23, 19, '2026-07-20'), -- Vera Batista
(24, 20, '2026-02-18'), -- Zé Santos
(25, 17, '2026-07-01'), -- Sofia Teixeira
(26, 18, '2026-07-05'), -- Tiago Monteiro
(27, 7, '2026-12-15'),  -- Gabriela Vaz
(28, 8, '2023-06-20'),  -- Hugo Neves
(29, 15, '2026-03-20'), -- Paulo Ribeiro
(30, 16, '2026-04-10'); -- Rita Carvalho

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
(15, 5),        -- Tarefa 15: Melhoria
(16, 2), (17, 2), (18, 4), -- Frontend e Bug
(19, 3), (20, 3), (21, 3), -- Backend
(22, 5), (23, 1),          -- Melhoria e Urgente
(25, 2), (26, 2),          -- Design/Frontend
(27, 4), (28, 1), (30, 1); -- Bugs e Urgente

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

/* 5. Comments (Ajustados para os membros das equipas certas) */
INSERT INTO comment (content, task_id, user_id, created_at, resolved) VALUES 
-- Tarefas 1-10 (Desenvolvimento e Gestão inicial)
('Análise inicial do módulo concluída.', 1, 1, '2026-02-02 10:00:00', 0), 
('API de mapas configurada com sucesso.', 2, 4, '2026-02-03 11:30:00', 0), 
('Iniciando integração com a gateway de pagamento.', 3, 13, '2026-02-04 09:15:00', 0), 
('Aguardando imagens finais do cliente.', 4, 14, '2026-02-05 14:00:00', 0), 
('Filtros testados em ambiente de staging.', 5, 19, '2026-02-06 16:45:00', 0), 
('Mockups do dashboard aprovados.', 6, 9, '2026-02-07 10:20:00', 0), 
('Hardware IoT calibrado e pronto.', 7, 15, '2026-02-08 11:00:00', 0), 
('Gráficos a renderizar em < 100ms.', 8, 16, '2026-02-09 17:30:00', 0), 
('Mapeamento enviado para validação do DBA.', 9, 10, '2023-10-10 13:00:00', 0), 
('Duplicados removidos. Base limpa.', 10, 1, '2023-11-12 18:00:00', 1), 
-- Tarefas 11-20 (Frontend, QA e Bugs)
('CSS atualizado conforme novas fontes.', 11, 2, '2024-02-12 10:00:00', 0), 
('Logs de acesso sem anomalias detetadas.', 12, 7, '2023-06-01 09:00:00', 0), 
('Certificado SSL renovado por 1 ano.', 13, 8, '2023-06-05 15:20:00', 1), 
('Regras de IP aplicadas no router principal.', 14, 15, '2024-02-20 11:45:00', 0), 
('Relatório de vulnerabilidades gerado.', 15, 16, '2024-02-27 14:10:00', 1), 
('Menu corrigido para iPhone SE.', 16, 11, NOW(), 0), 
('SVGs minificados (ganho de 40% no bundle).', 17, 12, NOW(), 0), 
('Crash no login era devido ao token expirado.', 18, 3, NOW(), 1), 
('Rota /history a devolver JSON correto.', 19, 5, NOW(), 0), 
('Índice criado na coluna user_email.', 20, 6, NOW(), 0), 
-- Tarefas 21-30 (Novos Membros e Segurança)
('Webhook do Stripe v2 validado.', 21, 13, NOW(), 0), 
('Capítulo 1 do manual finalizado.', 22, 10, NOW(), 0), 
('Budget excedeu em 5% a previsão inicial.', 23, 19, NOW(), 0), 
('Reunião de sprint gravada e ata anexada.', 24, 20, NOW(), 1), 
('Versão dark da logo finalizada.', 25, 17, NOW(), 0), 
('Contraste de cores validado pela acessibilidade.', 26, 18, NOW(), 0), 
('Servidor aguentou 5000 requests/segundo.', 27, 7, NOW(), 0), 
('Kernel atualizado para a versão 6.1 LTS.', 28, 8, '2023-06-29 11:00:00', 1), 
('Porta 8080 fechada por segurança.', 29, 15, NOW(), 0), 
('Simulação de phishing iniciada com a equipa.', 30, 16, NOW(), 0);

/* 7. Notifications */
INSERT INTO notification (user_id, title, message, is_read) VALUES 
(1,'Tarefa','Tarefa 1: Notas',0), (4,'Tarefa','Tarefa 2: Mapas',0), 
(13,'Tarefa','Tarefa 3: Checkout',0), (14,'Tarefa','Tarefa 4: Catálogo',0),
(19,'Tarefa','Tarefa 5: ONGs',0), (9,'Tarefa','Tarefa 6: Perfil',1), 
(15,'Tarefa','Tarefa 7: IoT',1), (16,'Tarefa','Tarefa 8: Gráficos',0),
 (10,'Tarefa','Tarefa 9: Tabelas',0), (1,'Tarefa','Tarefa 10: Limpeza',0),
(2,'Tarefa','Tarefa 11: CSS',1), (7,'Tarefa','Tarefa 12: Logs',0), 
(8,'Tarefa','Tarefa 13: SSL',0), (15,'Tarefa','Tarefa 14: IPs',1), 
(16,'Tarefa','Tarefa 15: Pentest',0), (11,'Tarefa','Tarefa 16: Menu',0),
(12,'Tarefa','Tarefa 17: SVGs',0),
(3,'Tarefa','Tarefa 18: Login',1), 
(5,'Tarefa','Tarefa 19: API',0),
(6,'Tarefa','Tarefa 20: Index',0),
(13,'Tarefa','Tarefa 21: Stripe',0), 
(10,'Tarefa','Tarefa 22: Manual',0), 
(19,'Tarefa','Tarefa 23: Custos',0),
(20,'Tarefa','Tarefa 24: Sprint',1),
(17,'Tarefa','Tarefa 25: Logo',0),
(18,'Tarefa','Tarefa 26: DarkMode',0), 
(7,'Tarefa','Tarefa 27: Stress',0),
(8,'Tarefa','Tarefa 28: Kernel',1),
 (15,'Tarefa','Tarefa 29: Firewall',0), 
 (16,'Tarefa','Tarefa 30: Invasão',0);

/* Equipa */
INSERT INTO teams (id, name, description, created_at) VALUES 
(1, 'Frontend Devs', 'UI/UX', NOW()), 
(2, 'Backend Ops', 'API/DB', NOW()), 
(3, 'QA & Testes', 'Qualidade', NOW()), 
(4, 'Design Criativo', 'Visual', NOW()), 
(5, 'Gestão', 'Requisitos', NOW());

/* Membros de equipa */
INSERT INTO team_members (team_id, user_id, role) VALUES 
(1,1,'admin'), (1,2,'member'), (1,3,'member'), (1,11,'member'), (1,12,'member'),
(2,4,'admin'), (2,5,'member'), (2,6,'member'), (2,13,'member'), (2,14,'member'),
(3,7,'admin'), (3,8,'member'), (3,15,'member'), (3,16,'member'),
(4,9,'admin'), (4,17,'member'), (4,18,'member'),
(5,10,'admin'), (5,19,'member'), (5,20,'member');

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
INSERT INTO sprints (project_id, name, description, status_id, start_date, end_date) VALUES 
(1, 'Sprint 1', 'Setup inicial', 2, '2026-01-15', '2026-01-30'), 
(1, 'Sprint 2', 'Módulos principais', 2, '2026-02-01', '2026-02-15'), 
(1, 'Sprint 3', 'Integrações', 2, '2026-02-16', '2026-03-01'), 
(1, 'Sprint 4', 'Testes finais', 1, '2026-03-02', '2026-03-20'), 
(2, 'Sprint 1', 'Base app', 2, '2026-02-01', '2026-02-10'), 
(2, 'Sprint 2', 'Pedidos', 2, '2026-02-11', '2026-02-25'), 
(2, 'Sprint 3', 'Tracking', 2, '2026-02-26', '2026-03-10'), 
(3, 'Sprint 1', 'Catálogo', 2, '2026-03-01', '2026-03-15'), 
(3, 'Sprint 2', 'Checkout', 2, '2026-03-16', '2026-03-30');


INSERT INTO sprint_tasks (sprint_id, task_id) VALUES
 (1,1),(1,16),(1,18), 
 (2,1),(2,16),(3,18),
 (3,1), (4,1),(5,2),
 (5,19),(6,2),(6,19),
 (6,20),(7,19),(8,3),(8,4),
 (9,3),(9,20),(9,21);


/* 7. Histórico de Estados (Task Status History) */
INSERT INTO task_status_history (task_id, previous_status_id, new_status_id, changed_at) VALUES 
(1, 1, 2, '2026-02-02 09:00:00'),
(5, 2, 3, '2026-02-06 10:00:00'),
(10, 3, 5, '2026-02-13 16:00:00');

/* 8. Registo de Tempo (Time Logs) */
INSERT INTO time_logs (task_id, user_id, hours, description, logged_at) VALUES 
(1, 1, 4.5, 'Implementação inicial', '2026-02-02 10:00:00'), -- Módulo de Notas
(1, 1, 3.0, 'Correções', '2026-02-03 14:00:00'), 
(3, 4, 5.0, 'Integração API mapas', '2026-02-04 11:00:00'), -- Integração de Mapas
(4, 13, 6.5, 'Checkout backend', '2026-02-05 15:00:00'), -- Checkout Transacional
(16, 11, 2.0, 'UI responsiva', '2026-03-01 10:00:00'), -- Menu Responsivo
(18, 3, 1.5, 'Fix login bug', '2026-02-25 16:00:00'), -- Fix: Erro de Login
(20, 6, 3.5, 'Indexação DB', '2026-04-15 11:00:00'), -- Indexação de Banco
(1, 2, 6.0, 'Feature extra', '2026-02-06'),
(16, 11, 5.5, 'UI melhorias', '2026-03-02'), 
(18, 3, 4.0, 'Bug fixing', '2026-03-03'), 
(3, 4, 2.5, 'Refactor API', '2026-02-07'),
(19, 5, 3.0, 'Nova rota', '2026-02-08'), -- Nova Rota de API
(4, 13, 8.0, 'Checkout upgrade', '2026-02-10'), 
(5, 14, 7.5, 'Catálogo expansão', '2026-02-11'), -- Catálogo de Produtos
(20, 6, 6.0, 'DB tuning', '2026-02-12'), 
(6, 19, 1.5, 'Filtro básico', '2026-02-13'), -- Filtro de ONGs
(9, 9, 2.0, 'UI simples', '2026-02-14'), -- Perfil do Voluntário
(10, 15, 4.0, 'Infra setup', '2026-02-15'), -- Configuração de Hub IoT
(11, 16, 3.5, 'Monitor config', '2026-02-16'), -- Gráficos de Consumo
(12, 10, 2.5, 'Migração análise', '2026-02-17'); -- Auditoria de Logs
