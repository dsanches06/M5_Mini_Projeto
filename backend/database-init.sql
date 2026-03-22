/* Base de Dados */
DROP DATABASE IF EXISTS clickup_db;
CREATE DATABASE IF NOT EXISTS clickup_db;

USE clickup_db;

/* Tabela Utilizador */
CREATE TABLE utilizador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone INT,
    activo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Tabela Estados do projeto */
CREATE TABLE estados_projeto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ordem_fluxo INT
);

/* Tabela Projeto */
CREATE TABLE projeto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    id_estado_projeto INT,
    data_inicio DATETIME,
    data_fim_prevista DATETIME,
	FOREIGN KEY (id_estado_projeto) REFERENCES estados_projeto (id)
);

/* Tabela Estados */
CREATE TABLE estados_tarefa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ordem_fluxo INT
);

/* Tabela Categorias */
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ordem_fluxo INT
);

/* Tabela Prioridade */
CREATE TABLE prioridades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    ordem_fluxo INT
);

/* Tabela Tarefa */
CREATE TABLE tarefa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    id_estado_tarefa INT NOT NULL,
    id_prioridade INT NOT NULL,
    id_categoria INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_projeto INT NOT NULL,
    data_limite DATETIME,
    data_conclusao DATETIME,
    horas_estimadas INT NOT NULL,
    FOREIGN KEY (id_projeto) REFERENCES projeto (id),
    FOREIGN KEY (id_estado_tarefa) REFERENCES estados_tarefa (id),
    FOREIGN KEY (id_prioridade) REFERENCES prioridades (id),
    FOREIGN KEY (id_categoria) REFERENCES categorias (id)
);

/* Tabela Intermédia: Tarefa_Responsavel  (N:M) */
CREATE TABLE tarefa_responsavel (
    id_tarefa INT NOT NULL,
    id_utilizador INT NOT NULL,
    data_atribuicao DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_tarefa , id_utilizador),
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE,
    FOREIGN KEY (id_utilizador) REFERENCES utilizador (id)
);

/* Tabela Etiqueta */
CREATE TABLE etiquetas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    cor VARCHAR(10)
);

/* Tabela Intermédia: Etiqueta_Tarefa (N:M) */
CREATE TABLE etiqueta_tarefa (
    id_tarefa INT,
    id_etiqueta INT,
    PRIMARY KEY (id_tarefa , id_etiqueta),
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE,
    FOREIGN KEY (id_etiqueta) REFERENCES etiquetas (id)
);

/* Tabela Comentários */
CREATE TABLE comentario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto TEXT NOT NULL,
    id_tarefa INT NOT NULL,
    id_utilizador INT NOT NULL,
    data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    editado_em DATETIME,
    resolvido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE,
    FOREIGN KEY (id_utilizador) REFERENCES utilizador (id)
);

/* tabela Anexos de tarefas */
CREATE TABLE anexos_tarefas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_tarefa INT NOT NULL,
    nome_ficheiro VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    tamanho_kb INT,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE
);

/* Tabela Notificações */
CREATE TABLE notificacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_utilizador INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilizador) REFERENCES utilizador(id) ON DELETE CASCADE
);

/* Tabela Equipas*/
CREATE TABLE equipas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Tabela Membros de Equipa (N:M) */
CREATE TABLE equipa_membros (
    id_equipa INT NOT NULL,
    id_utilizador INT NOT NULL,
    papel VARCHAR(20) CHECK (papel IN ('admin', 'membro')) DEFAULT 'membro',
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_equipa , id_utilizador),
    FOREIGN KEY (id_equipa) REFERENCES equipas (id),
    FOREIGN KEY (id_utilizador) REFERENCES utilizador (id)
);

/* Tabela Votos em Tarefas (Prioridade por votação) */
CREATE TABLE votos_tarefas (
    id_tarefa INT NOT NULL,
    id_utilizador INT NOT NULL,
    data_voto DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_tarefa , id_utilizador),
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE,
    FOREIGN KEY (id_utilizador) REFERENCES utilizador (id)
);

/* Tabela Histórico de Estado */
CREATE TABLE historico_estado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_tarefa INT NOT NULL,
    id_estado_anterior INT NOT NULL,
    id_estado_novo INT NOT NULL,
    data_mudanca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tarefa)  REFERENCES tarefa(id) ON DELETE CASCADE,
    FOREIGN KEY (id_estado_anterior) REFERENCES estados_tarefa(id),
	FOREIGN KEY (id_estado_novo)  REFERENCES estados_tarefa(id)
);

/* tabela Permissões de Projeto */
CREATE TABLE permissoes_projeto (
    id_projeto INT NOT NULL,
    id_utilizador INT NOT NULL,
    pode_editar BOOLEAN NOT NULL DEFAULT FALSE,
    pode_apagar BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_projeto, id_utilizador)
);

-- =====================================================
-- 🧩 NOVAS TABELAS — FUNCIONALIDADES EXTRA DA PLATAFORMA
-- =====================================================


-- =====================================================
-- 📌 1️⃣ SUBTAREFAS (tarefas hierárquicas)
-- Uma tarefa pode ter subtarefas
-- self-relationship
-- =====================================================

CREATE TABLE subtarefas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_tarefa_pai INT,
  titulo VARCHAR(200),
  id_estado INT,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_tarefa_pai) REFERENCES tarefa (id) ON DELETE CASCADE,
  FOREIGN KEY (id_estado) REFERENCES estados_tarefa (id)
);


-- =====================================================
-- 1 DEPENDÊNCIAS ENTRE TAREFAS
-- bloquear / depende de
-- N:N na própria tabela tarefas
-- =====================================================

CREATE TABLE dependencias_tarefas (
  id_tarefa INT,
  id_tarefa_dependente INT,
  tipo VARCHAR(30),   -- bloqueia / depende
  PRIMARY KEY (id_tarefa, id_tarefa_dependente),
  FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE,
  FOREIGN KEY (id_tarefa_dependente) REFERENCES tarefa (id) ON DELETE CASCADE
);

-- =====================================================
-- 2 FAVORITOS (utilizador marca tarefa como favorita)
-- =====================================================

CREATE TABLE tarefas_favoritas (
  id_utilizador INT,
  id_tarefa INT,
  data_marcacao DATETIME,
  PRIMARY KEY (id_utilizador, id_tarefa),
  FOREIGN KEY (id_utilizador) REFERENCES utilizador (id),
  FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE
);

-- =====================================================
-- 3 LEMBRETES
-- notificações agendadas
-- =====================================================

CREATE TABLE lembretes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_utilizador INT,
  id_tarefa INT,
  mensagem VARCHAR(200),
  data_lembrete DATETIME,
  enviado BOOLEAN,
  FOREIGN KEY (id_utilizador) REFERENCES utilizador (id),
  FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE
);

-- =====================================================
-- 4 SPRINTS
-- organização ágil
-- =====================================================

CREATE TABLE sprints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_projeto INT,
    nome VARCHAR(100),
    data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_fim DATETIME,
    FOREIGN KEY (id_projeto) REFERENCES projeto (id)
);

CREATE TABLE sprint_tarefas (
    id_sprint INT,
    id_tarefa INT,
    PRIMARY KEY (id_sprint , id_tarefa),
    FOREIGN KEY (id_sprint) REFERENCES sprints (id),
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE
);

-- =====================================================
-- 5 MENÇÕES (@user em comentários)
-- =====================================================

CREATE TABLE mencoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_comentario INT,
    id_utilizador_mencionado INT,
    FOREIGN KEY (id_comentario) REFERENCES comentario (id),
    FOREIGN KEY (id_utilizador_mencionado) REFERENCES utilizador (id)
);

-- =====================================================
-- 6 Log 
-- =====================================================
CREATE TABLE registos_tempo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_tarefa INT,
    id_utilizador INT,
    horas INT NOT NULL, 
    descricao TEXT NOT NULL,
    data_conclusao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilizador) REFERENCES utilizador (id),
    FOREIGN KEY (id_tarefa) REFERENCES tarefa (id) ON DELETE CASCADE
);

-- =====================================================
-- DADOS DE TESTE
-- =====================================================

USE clickup_db;

/* Exercício 6 — Inserir utilizadores */
INSERT INTO utilizador (nome, email, telefone, data_criacao)
VALUES 
	('Ana Martins','ana@email.com',910000001,'2026-01-10 09:00:00'),
	('Bruno Alves','bruno@email.com',910000002,'2026-01-11 09:00:00'),
	('Catarina Dias','catarina@email.com',910000003,'2026-01-12 09:00:00'),
	('Diogo Rocha','diogo@email.com',910000004,'2026-01-13 09:00:00'),
	('Eduarda Gomes','eduarda@email.com',910000005,'2026-01-14 09:00:00'),
	('Fabio Lopes','fabio@email.com',910000006,'2026-01-15 09:00:00'),
    ('Gabriela Vaz', 'gabriela.vaz@email.pt', 910000007, DATE_ADD(NOW(), INTERVAL 2 DAY)),
    ('Hugo Neves', 'hugo.neves@email.com', 910000008, DATE_ADD(NOW(), INTERVAL 5 DAY)),
    ('Inês Duarte', 'ines.duarte@email.com', 910000009, DATE_ADD(NOW(), INTERVAL 4 DAY)),
    ('Jorge Mota', 'jorge.mota@email.pt', 910000010, DATE_ADD(NOW(), INTERVAL 7 DAY));

/* Exercício 7 — Inserir projeto */
INSERT INTO estados_projeto (nome, ordem_fluxo ) 
VALUES 
	('Ativo', 1),
    ('Em Desenvolvimento', 2),
	('Terminado', 3);
    
INSERT INTO projeto (nome, descricao, id_estado_projeto, data_inicio , data_fim_prevista)
VALUES 
    ('Sistema Gestão Escolar','Plataforma para gestão escolar',1,'2026-02-01','2026-09-01'),
    ('App Delivery','Aplicação para entregas locais',2,'2026-02-01','2026-07-01'),
	('E-commerce de Artesanato', 'Plataforma para venda de produtos feitos à mão com integração de pagamentos.', 1, DATE_ADD(NOW(), INTERVAL 5 DAY), '2026-12-15 23:59:59'),
    ('Portal de Voluntariado', 'Website para conectar ONGs a voluntários com base em competências e localização.',1 , DATE_ADD(NOW(), INTERVAL 12 DAY), '2026-08-10 19:00:00'),
    ('Monitor de Gastos Energéticos', 'Sistema IoT para monitorização em tempo real do consumo elétrico doméstico.', 3, DATE_ADD(NOW(), INTERVAL 20 DAY), '2027-01-30 14:00:00'),
	('Migração de Base de Dados Antiga', 'Migração crítica de dados legados para SQL Server.', 2, '2023-10-01 09:00:00', '2023-12-15 18:00:00'),
    ('Redesign do Site Institucional', 'Atualização da interface e UX do portal principal.', 1, '2024-01-10 10:00:00', '2024-03-01 17:30:00'),
    ('Manutenção de Servidores Legados', 'Correção de vulnerabilidades em servidores antigos.', 3, '2023-05-20 08:00:00', '2023-06-10 12:00:00'),
    ('Implementação de Firewall Interna', 'Configuração de novas regras de segurança de rede.', 1, '2024-02-15 09:00:00', '2024-02-28 23:59:59');

/* Exercício 8 — Inserir tarefas */
INSERT INTO estados_tarefa (nome, ordem_fluxo ) 
VALUES 
	('Backlog',1),
	('Pendente',2),
	('Em Progresso',3),
	('Revisão',4),
	('Concluída',5);

INSERT INTO prioridades (nome, ordem_fluxo ) 
VALUES 
	('Baixa', 1),
	('Médio', 2),
	('Alta', 3),
	('Critica', 4);

INSERT INTO categorias (nome, ordem_fluxo ) 
VALUES 
	('Backend',1),
	('Frontend',2),
	('Infraestrutura',3);

INSERT INTO tarefa (titulo,descricao,id_estado_tarefa,id_prioridade,id_categoria,data_criacao,id_projeto,data_limite,data_conclusao,horas_estimadas) VALUES
('Tarefa 1','Descricao tarefa 1',2,2,2,'2026-02-02 00:00:00',1,'2026-02-09 00:00:00',NULL,5),
('Tarefa 2','Descricao tarefa 2',2,3,3,'2026-02-03 00:00:00',1,'2026-02-10 00:00:00',NULL,6),
('Tarefa 3','Descricao tarefa 3',2,4,1,'2026-02-04 00:00:00',1,'2026-02-11 00:00:00',NULL,7),
('Tarefa 4','Descricao tarefa 4',2,1,2,'2026-02-05 00:00:00',1,'2026-02-12 00:00:00',NULL,8),
('Tarefa 5','Descricao tarefa 5',3,2,3,'2026-02-06 00:00:00',1,'2026-02-13 00:00:00',NULL,4),
('Tarefa 6','Descricao tarefa 6',3,3,1,'2026-02-07 00:00:00',1,'2026-02-14 00:00:00',NULL,5),
('Tarefa 7','Descricao tarefa 7',3,4,2,'2026-02-08 00:00:00',1,'2026-02-15 00:00:00',NULL,6),
('Tarefa 8','Descricao tarefa 8',3,1,3,'2026-02-09 00:00:00',1,'2026-02-16 00:00:00',NULL,7),
('Tarefa 9','Descricao tarefa 9',3,2,1,'2026-02-10 00:00:00',1,'2026-02-17 00:00:00',NULL,8),
('Tarefa 10','Descricao tarefa 10',5,3,2,'2026-02-11 00:00:00',1,'2026-02-18 00:00:00','2026-02-13 00:00:00',4),
('Tarefa 11','Descricao tarefa 11',5,4,3,'2026-02-12 00:00:00',2,'2026-02-19 00:00:00','2026-02-14 00:00:00',5),
('Tarefa 12','Descricao tarefa 12',5,1,1,'2026-02-13 00:00:00',2,'2026-02-20 00:00:00','2026-02-15 00:00:00',6),
('Tarefa 13','Descricao tarefa 13',5,2,2,'2026-02-14 00:00:00',2,'2026-02-21 00:00:00','2026-02-16 00:00:00',7),
('Tarefa 14','Descricao tarefa 14',5,3,3,'2026-02-15 00:00:00',2,'2026-02-22 00:00:00','2026-02-17 00:00:00',8),
('Tarefa 15','Descricao tarefa 15',5,4,1,'2026-02-16 00:00:00',2,'2026-02-23 00:00:00','2026-02-18 00:00:00',4);

INSERT INTO tarefa_responsavel (id_tarefa, id_utilizador, data_atribuicao)
VALUES 
	(1,1,'2026-02-02 10:00:00'),
	(2,2,'2026-02-03 10:00:00'),
	(3,3,'2026-02-04 10:00:00'),
	(4,4,'2026-02-05 10:00:00'),
	(5,1,'2026-02-06 10:00:00'),
	(6,2,'2026-02-07 10:00:00'),
	(7,3,'2026-02-08 10:00:00'),
	(8,4,'2026-02-09 10:00:00'),
	(9,5,'2026-02-10 10:00:00'),
	(10,6,'2026-02-11 10:00:00');

INSERT INTO comentario (texto, id_tarefa, id_utilizador, data_comentario, editado_em, resolvido)
VALUES 
('Comentário tarefa 1',1,1,'2026-02-02 03:00:00',NULL, FALSE),
('Comentário tarefa 2',2,1,'2026-02-03 03:00:00',NULL, FALSE),
('Comentário tarefa 3',3,1,'2026-02-04 03:00:00',NULL, FALSE),
('Comentário tarefa 4',4,1,'2026-02-05 03:00:00',NULL, FALSE),
('Comentário tarefa 5',5,1,'2026-02-06 03:00:00',NULL, FALSE),
('Comentário tarefa 6',6,1,'2026-02-07 03:00:00',NULL, FALSE),
('Comentário tarefa 7',7,1,'2026-02-08 03:00:00',NULL, FALSE);

INSERT INTO etiquetas (nome, cor) 
VALUES
	('Urgente', 'Vermelho'),
	('Frontend', 'Azul'),
	('Backend', 'Verde'),
	('Bug', 'Laranja'),
	('Melhoria', 'Roxo');

INSERT INTO etiqueta_tarefa (id_tarefa, id_etiqueta) 
VALUES
	(1, 1), (1, 2),
	(3, 2),
	(2, 3), (2, 4),
	(12, 4), (13, 4),
	(14, 3), (15, 4),
	(11, 5),
	(5, 2), (5, 4),
	(10, 1);

INSERT INTO anexos_tarefas (id_tarefa, nome_ficheiro, tipo, tamanho_kb) 
VALUES 
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

INSERT INTO notificacao (id_utilizador, titulo, mensagem, lida, data_envio) 
VALUES 
	(10, 'Nova Tarefa', 'Foi-lhe atribuída a tarefa "Configurar Docker Compose".', FALSE, NOW()),
	(10, 'Backup Concluído', 'O dump da base de dados (Tarefa 24) foi finalizado.', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
	(10, 'Menção', 'O utilizador 1 mencionou-o na tarefa de Migração AWS.', FALSE, NOW()),
	(2, 'Prazo Próximo', 'A tarefa "Refatorar CSS Global" termina em 48 horas.', FALSE, NOW()),
	(2, 'Novo Comentário', 'O admin comentou no seu Mockup da Landing Page.', FALSE, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
	(2, 'Voto Recebido', 'A sua tarefa "Dark Mode" recebeu um novo voto de prioridade.', TRUE, NOW()),
	(1, 'Relatório Semanal', 'O resumo da Sprint 01 está pronto para consulta.', FALSE, NOW()),
	(3, 'Acesso Concedido', 'Agora você é responsável pelo Endpoint de Login.', FALSE, NOW()),
	(4, 'Simulação Alerta', 'Os Testes de Carga atingiram o limite de 1000 users.', TRUE, NOW());

INSERT INTO equipas (nome, descricao) 
VALUES 
	('Frontend Devs', 'Equipa responsável pela interface e experiência do utilizador.'),
	('Backend Ops', 'Focada em APIs, base de dados e infraestrutura.'),
	('QA & Testes', 'Garantia de qualidade e automação de testes.'),
	('Design Criativo', 'Criação de assets visuais e protótipos.'),
	('Gestão de Produto', 'Definição de requisitos e roadmap.');

INSERT INTO equipa_membros (id_equipa, id_utilizador, papel) 
VALUES 
	(1, 1, 'admin'), 
    (1, 2, 'membro'),
	(2, 3, 'membro'), 
	(3, 2, 'membro'), 
    (3, 1, 'membro'),
	(4, 10, 'membro'), 
    (4, 4, 'membro'),
	(5, 5, 'membro');

INSERT INTO votos_tarefas (id_tarefa, id_utilizador)
VALUES 
	(1, 2), (1, 3), (1, 10), (1, 4),
	(2, 1), (5, 4), (10, 5), (12, 2);

INSERT INTO historico_estado (id_tarefa, id_estado_anterior, id_estado_novo, data_mudanca) 
VALUES 
	(1,2,3,'2026-02-02 02:00:00'),
	(2,2,3,'2026-02-03 02:00:00'),
	(3,2,3,'2026-02-04 02:00:00'),
	(4,2,3,'2026-02-05 02:00:00'),
	(5,2,3,'2026-02-06 02:00:00');

INSERT INTO permissoes_projeto (id_projeto, id_utilizador, pode_editar, pode_apagar) 
VALUES 
	(1, 1, TRUE, TRUE),
	(1, 2, TRUE, FALSE),
	(2, 3, TRUE, TRUE),
	(3, 4, FALSE, FALSE),
	(1, 5, TRUE, FALSE);

INSERT INTO subtarefas (id_tarefa_pai, titulo, id_estado, data_criacao) VALUES 
	(1, 'Instalar MySQL 8.0 no Servidor', 3, NOW()),
	(1, 'Configurar Utilizadores e Permissões', 2, NOW()),
	(1, 'Criar Script de Migração Inicial', 1, NOW()),
	(2, 'Criar protótipo de baixa fidelidade (Wireframes)', 3, NOW()),
	(2, 'Definir Paleta de Cores e Tipografia', 3, NOW()),
	(2, 'Validar fluxos com o cliente', 2, NOW()),
	(3, 'Gerar Par de Chaves RSA', 3, NOW()),
	(3, 'Escrever testes unitários para Auth', 1, NOW()),
	(3, 'Revisão de código (Code Review)', 1, NOW()),
	(11, 'Configurar Runner do GitHub Actions', 3, NOW()),
	(11, 'Escrever Workflow de Testes Automáticos', 2, NOW()),
	(1, 'Criar conta de teste na Stripe', 3, NOW()),
	(1, 'Implementar Webhook de confirmação', 2, NOW()),
	(7, 'Testar pagamentos com cartão rejeitado', 1, NOW()),
	(7, 'Integrar botão de checkout no Frontend', 1, NOW()),
	(9, 'Desenhar secção Hero', 3, NOW()),
	(9, 'Escrever textos de marketing (Copywriting)', 2, NOW()),
	(9, 'Otimizar SEO e Meta Tags', 1, NOW()),
	(12, 'Remover classes duplicadas', 3, NOW()),
	(12, 'Converter cores para variáveis CSS/SASS', 2, NOW()),
	(12, 'Minificar ficheiro final', 1, NOW());

INSERT INTO dependencias_tarefas (id_tarefa, id_tarefa_dependente, tipo) VALUES 
	(1,2,'bloqueia'),
	(2,3,'bloqueia'),
	(3,4,'bloqueia'),
	(4,5,'depende'),
	(6,7,'bloqueia'),
	(7,8,'depende'),
	(9,10,'bloqueia');

INSERT INTO tarefas_favoritas (id_utilizador, id_tarefa, data_marcacao) 
VALUES 
	(10, 1, NOW()), 
	(10, 11, DATE_SUB(NOW(), INTERVAL 2 DAY)),
	(2, 2, NOW()), 
	(2, 12, DATE_SUB(NOW(), INTERVAL 1 DAY)),
	(2, 13, DATE_SUB(NOW(), INTERVAL 2 DAY)),
	(1, 1, NOW()), 
	(3, 3, NOW()), 
	(4, 4, NOW()), 
	(6, 6, NOW());

INSERT INTO lembretes (id_utilizador, id_tarefa, mensagem, data_lembrete, enviado) VALUES 
	(10, 1, 'Verificar se a Base de Dados terminou o restauro', '2026-02-26 09:00:00', FALSE),
	(10, 1, 'Executar script de migração na AWS (CUIDADO)', '2026-02-26 14:00:00', FALSE),
	(10, 11, 'Certificados SSL expiram em 24h', '2026-02-27 10:00:00', FALSE),
	(10, 3, 'Validar chaves JWT com a equipa', '2026-02-27 10:00:00', FALSE),
	(10, 4, 'Iniciar simulação de carga (1000 users)', '2026-02-27 22:00:00', FALSE),
	(2, 2, 'Revisão final dos Mockups com o Cliente', '2026-02-26 11:30:00', FALSE),
	(2, 12, 'Lembrete: Refatoração de CSS pendente', '2026-02-28 09:00:00', FALSE),
	(1, 10, 'A Reunião de Sprint começa em 15 min', '2026-02-25 15:45:00', FALSE),
	(1, 5, 'Lembrete de follow-up enviado ontem', '2026-02-24 14:00:00', TRUE);

INSERT INTO sprints (id_projeto, nome, data_inicio, data_fim) VALUES 
	(1,'Sprint 1','2026-02-01','2026-02-14'),
	(1,'Sprint 2','2026-02-15','2026-03-01'),
	(2,'Sprint Alpha','2026-02-01','2026-03-01');

INSERT INTO sprint_tarefas (id_sprint, id_tarefa) VALUES 
	(1,1),(1,2),(1,3),(1,4),(1,5),
	(2,6),(2,7),(2,8),(2,9),(2,10),
	(3,11),(3,12),(3,13),(3,14),(3,15);

INSERT INTO mencoes (id_comentario, id_utilizador_mencionado) VALUES 
	(1, 2), 
	(1, 3),
	(2, 10),
	(7, 1),
	(5, 4);

INSERT INTO registos_tempo (id_tarefa, id_utilizador, horas, descricao, data_conclusao) VALUES
	(1,2,2,'Trabalho tarefa 1','2026-02-02 05:00:00'),
	(2,3,3,'Trabalho tarefa 2','2026-02-03 05:00:00'),
	(3,4,4,'Trabalho tarefa 3','2026-02-04 05:00:00'),
	(4,5,1,'Trabalho tarefa 4','2026-02-05 05:00:00'),
	(5,1,2,'Trabalho tarefa 5','2026-02-06 05:00:00'),
	(6,2,3,'Trabalho tarefa 6','2026-02-07 05:00:00'),
	(7,3,4,'Trabalho tarefa 7','2026-02-08 05:00:00'),
	(8,4,1,'Trabalho tarefa 8','2026-02-09 05:00:00'),
	(9,5,2,'Trabalho tarefa 9','2026-02-10 05:00:00'),
	(10,1,3,'Trabalho tarefa 10','2026-02-11 05:00:00'),
	(11,1,4,'Tarefa Extra U1','2026-02-12 05:00:00'), 
	(12,2,5,'Tarefa Extra U2','2026-02-08 05:00:00'),
	(13,3,6,'Tarefa Extra U3','2026-02-09 05:00:00'), 
	(14,4,2,'Tarefa Extra U4','2026-02-10 05:00:00'),
	(15,5,5,'Tarefa Extra U5','2026-02-11 05:00:00');
