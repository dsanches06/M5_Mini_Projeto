
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
CREATE TABLE labels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(10)
);

/* Label_Task (N:M) */
CREATE TABLE label_task (
    task_id INT,
    label_id INT,
    PRIMARY KEY (task_id , label_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (label_id)
        REFERENCES labels (id)
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
('Tarefa 1','Descricao tarefa 1',2,2,2,1,'2026-02-09',NULL,5.00,'2026-02-02'),
('Tarefa 2','Descricao tarefa 2',2,3,3,1,'2026-02-10',NULL,6.00,'2026-02-03'),
('Tarefa 3','Descricao tarefa 3',2,4,1,1,'2026-02-11',NULL,7.00,'2026-02-04'),
('Tarefa 4','Descricao tarefa 4',2,1,2,1,'2026-02-12',NULL,8.00,'2026-02-05'),
('Tarefa 5','Descricao tarefa 5',3,2,3,1,'2026-02-13',NULL,4.00,'2026-02-06'),
('Tarefa 6','Descricao tarefa 6',3,3,1,1,'2026-02-14',NULL,5.00,'2026-02-07'),
('Tarefa 7','Descricao tarefa 7',3,4,2,1,'2026-02-15',NULL,6.00,'2026-02-08'),
('Tarefa 8','Descricao tarefa 8',3,1,3,1,'2026-02-16',NULL,7.00,'2026-02-09'),
('Tarefa 9','Descricao tarefa 9',3,2,1,1,'2026-02-17',NULL,8.00,'2026-02-10'),
('Tarefa 10','Descricao tarefa 10',5,3,2,1,'2026-02-18','2026-02-13',4.00,'2026-02-11'),
('Tarefa 11','Descricao tarefa 11',5,4,3,2,'2026-02-19','2026-02-14',5.00,'2026-02-12'),
('Tarefa 12','Descricao tarefa 12',5,1,1,2,'2026-02-20','2026-02-15',6.00,'2026-02-13'),
('Tarefa 13','Descricao tarefa 13',5,2,2,2,'2026-02-21','2026-02-16',7.00,'2026-02-14'),
('Tarefa 14','Descricao tarefa 14',5,3,3,2,'2026-02-22','2026-02-17',8.00,'2026-02-15'),
('Tarefa 15','Descricao tarefa 15',5,4,1,2,'2026-02-23','2026-02-18',4.00,'2026-02-16');

/* 5. Assignees, Comments & Labels (Tudo o que enviou) */
INSERT INTO task_assignees (task_id, user_id, assigned_at) VALUES
(1,1,'2026-02-02'), 
(2,2,'2026-02-03'), 
(3,3,'2026-02-04'), 
(4,4,'2026-02-05'), 
(5,1,'2026-02-06'), 
(6,2,'2026-02-07'), 
(7,3,'2026-02-08'), 
(8,4,'2026-02-09'), 
(9,5,'2026-02-10'), 
(10,6,'2026-02-11');

INSERT INTO comment (content, task_id, user_id, created_at, resolved) VALUES 
('Comentário tarefa 1',1,1,'2026-02-02 03:00:00', 0), 
('Comentário tarefa 2',2,1,'2026-02-03 03:00:00', 0), 
('Comentário tarefa 3',3,1,'2026-02-04 03:00:00', 0), 
('Comentário tarefa 4',4,1,'2026-02-05 03:00:00', 0), 
('Comentário tarefa 5',5,1,'2026-02-06 03:00:00', 0), 
('Comentário tarefa 6',6,1,'2026-02-07 03:00:00', 0), 
('Comentário tarefa 7',7,1,'2026-02-08 03:00:00', 0);

INSERT INTO labels (name, color) VALUES
 ('Urgente', 'Vermelho'),
 ('Frontend', 'Azul'),
 ('Backend', 'Verde'), 
 ('Bug', 'Laranja'), 
 ('Melhoria', 'Roxo');
 
INSERT INTO label_task (task_id, label_id) VALUES
 (1,1), 
 (1,2), 
 (3,2), 
 (2,3), 
 (2,4), 
 (12,4), 
 (13,4), 
 (14,3), 
 (15,4), 
 (11,5), 
 (5,2), 
 (5,4), 
 (10,1);

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
(10, 'Nova Tarefa', 'Atribuída a tarefa "Configurar Docker".', 0),
(10, 'Backup Concluído', 'Tarefa 24 finalizada.', 1), 
(10, 'Menção', 'Mencionado na tarefa Migração.', 0), 
(2, 'Prazo Próximo', 'Tarefa termina em 48h.', 0),
(2, 'Novo Comentário', 'Admin comentou no Mockup.', 0),
(2, 'Voto Recebido', 'Novo voto na tarefa Dark Mode.', 1),
(1, 'Relatório Semanal', 'Sprint 01 pronto.', 0), 
(3, 'Acesso Concedido', 'Responsável pelo Login.', 0),
(4, 'Simulação Alerta', 'Limite de 1000 users.', 1);

INSERT INTO teams (name, description) VALUES 
('Frontend Devs', 'Interface UI/UX.'), 
('Backend Ops', 'APIs e DB.'), 
('QA & Testes', 'Qualidade.'), 
('Design Criativo', 'Visual.'), 
('Gestão de Produto', 'Requisitos.');

/* 1. Membros das Equipas (Completar as 5 equipas que inserimos no passo anterior) */
INSERT INTO team_members (team_id, user_id, role) VALUES 
(1, 1, 'admin'),
(1, 2, 'member'),
(1, 3, 'member'),
(2, 4, 'admin'),
(2, 5, 'member'), 
(2, 6, 'member'), 
(3, 7, 'member'), 
(3, 8, 'member'),               
(4, 9, 'member'),                                  
(5, 10, 'admin');                                   

/* 2. Permissões de Projeto */
INSERT INTO project_permissions (project_id, user_id, can_edit, can_delete) VALUES 
(1, 1, 1, 1), 
(1, 2, 1, 0), 
(2, 4, 1, 1),
 (2, 5, 1, 0),
(3, 10, 1, 1);

/* 3. Votos em Tarefas */
INSERT INTO task_votes (task_id, user_id, voted_at) VALUES 
(1, 2, NOW()),
 (1, 3, NOW()), 
(5, 1, NOW()),
 (7, 4, NOW()), 
(10, 5, NOW());

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
INSERT INTO sprints (project_id, name, start_date, end_date) VALUES 
(1, 'Sprint 01 - Setup', '2026-02-01', '2026-02-15'),
(1, 'Sprint 02 - Development', '2026-02-16', '2026-03-02');

INSERT INTO sprint_tasks (sprint_id, task_id) VALUES 
(1, 1), 
(1, 2), 
(1, 3), 
(1, 4),
(1, 10),
(2, 5), 
(2, 6), 
(2, 7);

/* 7. Histórico de Estados (Task Status History) */
INSERT INTO task_status_history (task_id, previous_status_id, new_status_id, changed_at) VALUES 
(1, 1, 2, '2026-02-02 09:00:00'),
(5, 2, 3, '2026-02-06 10:00:00'),
(10, 3, 5, '2026-02-13 16:00:00');

/* 8. Registo de Tempo (Time Logs) */
INSERT INTO time_logs (task_id, user_id, hours, description, logged_at) VALUES 
(1, 1, 2.50, 'Análise inicial do esquema', '2026-02-02 14:00:00'),
(1, 1, 1.50, 'Correção de chaves estrangeiras', '2026-02-02 16:00:00'),
(10, 6, 4.00, 'Finalização e testes de QA', '2026-02-13 15:30:00');
