/* Mapeia a resposta da API para o modelo de usuário */
export function mapUserAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    active: data.active,
    role: data.role,
  };
}

/* Mapeia a resposta da API para as estatísticas de usuário */
export function mapUserStatsAPIResponse(data) {
  return {
    totalUsers: data.totalUsers,
    activeUsers: data.activeUsers,
    inactiveUsers: data.inactiveUsers,
    activePercentage: data.activePercentage,
    inactivePercentage: data.inactivePercentage,
  };
}

/* Mapeia a resposta da API para notificação */
export function mapNotificationAPIResponse(data) {
  return {
    id: data.id,
    title: data.title,
    message: data.message,
    is_read: data.is_read,
    sent_at: data.sent_at,
  };
}

/* Mapeia a resposta da API para tarefa */
export function mapTaskAPIResponse(data) {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status_id: data.status_id,
    priority_id: data.priority_id,
    category_id: data.category_id,
    assigned_to: data.assigned_to,
    project_id: data.project_id,
    sprint_id: data.sprint_id,
    start_date: data.start_date,
    due_date: data.due_date,
    completed_at: data.completed_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/* Mapeia a resposta da API para estatísticas de tarefas */
export function mapTaskStatsAPIResponse(data) {
  return {
    totalTasks: data.totalTasks,
    completedTasks: data.completedTasks,
    pendingTasks: data.pendingTasks,
    completedPercentage: data.completedPercentage,
  };
}

/* Mapeia a resposta da API para comentário de tarefa */
export function mapTaskCommentAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/* Mapeia a resposta da API para tag */
export function mapTagAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    description: data.description,
  };
}

/* Mapeia a resposta da API para projeto */
export function mapProjectAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    project_status_id: data.project_status_id,
    start_date: data.start_date,
    end_date_expected: data.end_date_expected,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/* Mapeia a resposta da API para status de projeto */
export function mapProjectStatusAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
  };
}

/* Mapeia a resposta da API para permissão de projeto */
export function mapProjectPermissionAPIResponse(data) {
  return {
    id: data.id,
    project_id: data.project_id,
    user_id: data.user_id,
    role: data.role,
  };
}

/* Mapeia a resposta da API para equipe */
export function mapTeamAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/* Mapeia a resposta da API para membro de equipe */
export function mapTeamMemberAPIResponse(data) {
  return {
    id: data.id,
    team_id: data.team_id,
    user_id: data.user_id,
    role: data.role,
  };
}

/* Mapeia a resposta da API para sprint */
export function mapSprintAPIResponse(data) {
  return {
    id: data.id,
    project_id: data.project_id,
    name: data.name,
    description: data.description,
    status_id: data.status_id,
    start_date: data.start_date,
    end_date: data.end_date,
  };
}

/* Mapeia a resposta da API para tarefa de sprint */
export function mapSprintTaskAPIResponse(data) {
  return {
    id: data.id,
    sprint_id: data.sprint_id,
    task_id: data.task_id,
  };
}

/* Mapeia a resposta da API para prioridade */
export function mapPriorityAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    level: data.level,
    color: data.color,
  };
}

/* Mapeia a resposta da API para status de tarefa */
export function mapTaskStatusAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    description: data.description,
  };
}

/* Mapeia a resposta da API para histórico de status */
export function mapTaskStatusHistoryAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    status_id: data.status_id,
    changed_by: data.changed_by,
    changed_at: data.changed_at,
    previous_status_id: data.previous_status_id,
  };
}

/* Mapeia a resposta da API para anexo de tarefa */
export function mapTaskAttachmentAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    file_path: data.file_path,
    file_name: data.file_name,
    uploaded_by: data.uploaded_by,
    uploaded_at: data.uploaded_at,
  };
}

/* Mapeia a resposta da API para dependência de tarefa */
export function mapTaskDependencyAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    depends_on_task_id: data.depends_on_task_id,
    dependency_type: data.dependency_type,
  };
}

/* Mapeia a resposta da API para votação de tarefa */
export function mapTaskVoteAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    vote_type: data.vote_type,
  };
}

/* Mapeia a resposta da API para menção */
export function mapMentionAPIResponse(data) {
  return {
    id: data.id,
    user_id: data.user_id,
    task_id: data.task_id,
    comment_id: data.comment_id,
    mentioned_by: data.mentioned_by,
    created_at: data.created_at,
  };
}

/* Mapeia a resposta da API para lembrete */
export function mapReminderAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    reminder_date: data.reminder_date,
    message: data.message,
    is_sent: data.is_sent,
  };
}

/* Mapeia a resposta da API para log de tempo */
export function mapTimeLogAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    hours: data.hours,
    description: data.description,
    logged_at: data.logged_at,
  };
}

/* Mapeia a resposta da API para tarefa e tag */
export function mapTagTaskAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    tag_id: data.tag_id,
  };
}

/* Mapeia a resposta da API para tarefa favorita */
export function mapFavoriteTaskAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
  };
}

/* Mapeia a resposta da API para atribuição de tarefa */
export function mapTaskAssigneeAPIResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    assigned_by: data.assigned_by,
    assigned_at: data.assigned_at,
  };
}

/* Mapeia a resposta da API para categoria */
export function mapCategoryAPIResponse(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
  };
}

/* Mapeia a resposta da API para ranking de horas */
export function mapRankingMoreHoursAPIResponse(data) {
  return {
    projeto: data.projeto,
    utilizador: data.utilizador,
    total_horas_reais: data.total_horas_reais,
    ranking: data.ranking,
  };
}

/* Mapeia a resposta da API para ranking de horas de aumento */
export function mapRankingIncreaseHoursAPIResponse(data) {
  return {
    utilizador: data.utilizador,
    data_dia: data.data_dia,
    horas_dia: data.horas_dia,
    horas_dia_anterior: data.horas_dia_anterior,
    ranking_do_dia: data.ranking_do_dia,
  };
}

/* Mapeia a resposta da API para média de horas */
export function mapAverageAPIResponse(data) {
  return {
    projeto: data.projeto,
    total_horas_projeto: data.total_horas_projeto,
    media_geral_sistema: data.media_geral_sistema,
  };
}
