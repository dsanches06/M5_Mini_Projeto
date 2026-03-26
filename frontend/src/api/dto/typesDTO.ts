import { UserRole } from "../../security/UserRole.js";

/** Type para representar usuário vindo da API */
export type UserAPIResponse = {
  id: number;
  name: string;
  email: string;
  phone: number;
  gender: string;
  active: number;
  role?: UserRole;
};

/** Type para representar notificação vindo da API */
export type NotificationAPIResponse = {
  id: number;
  title: string;
  message: string;
  is_read: number;
  sent_at: string;
};

/** Type para representar tarefa vindo da API */
export type TaskAPIResponse = {
  id: number;
  title: string;
  description?: string;
  status_id?: number;
  priority_id?: number;
  assigned_to?: number;
  project_id?: number;
  sprint_id?: number;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
};

/** Type para representar comentário de tarefa vindo da API */
export type TaskCommentAPIResponse = {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
};

/** Type para representar tag vindo da API */
export type TagAPIResponse = {
  id: number;
  name: string;
  color?: string;
  description?: string;
};

/** Type para representar projeto vindo da API */
export type ProjectAPIResponse = {
  id: number;
  name: string;
  description?: string;
  project_status_id?: number;
  start_date?: string;
  end_date_expected?: string;
  created_at?: string;
  updated_at?: string;
};

/** Type para representar status de projeto vindo da API */
export type ProjectStatusAPIResponse = {
  id: number;
  name: string;
  description?: string;
};

/** Type para representar permissão de projeto vindo da API */
export type ProjectPermissionAPIResponse = {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
};

/** Type para representar equipe vindo da API */
export type TeamAPIResponse = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

/** Type para representar membro de equipe vindo da API */
export type TeamMemberAPIResponse = {
  id: number;
  team_id: number;
  user_id: number;
  role?: string;
};

/** Type para representar sprint vindo da API */
export type SprintAPIResponse = {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

/** Type para representar tarefa de sprint vindo da API */
export type SprintTaskAPIResponse = {
  id: number;
  sprint_id: number;
  task_id: number;
};

/** Type para representar prioridade vindo da API */
export type PriorityAPIResponse = {
  id: number;
  name: string;
  level?: number;
  color?: string;
};

/** Type para representar status de tarefa vindo da API */
export type TaskStatusAPIResponse = {
  id: number;
  name: string;
  color?: string;
  description?: string;
};

/** Type para representar histórico de status vindo da API */
export type TaskStatusHistoryAPIResponse = {
  id: number;
  task_id: number;
  status_id: number;
  changed_by: number;
  changed_at: string;
  previous_status_id?: number;
};

/** Type para representar anexo de tarefa vindo da API */
export type TaskAttachmentAPIResponse = {
  id: number;
  task_id: number;
  file_path: string;
  file_name: string;
  uploaded_by: number;
  uploaded_at?: string;
};

/** Type para representar dependência de tarefa vindo da API */
export type TaskDependencyAPIResponse = {
  id: number;
  task_id: number;
  depends_on_task_id: number;
  dependency_type?: string;
};

/** Type para representar votação de tarefa vindo da API */
export type TaskVoteAPIResponse = {
  id: number;
  task_id: number;
  user_id: number;
  vote_type: string;
};

/** Type para representar menção vindo da API */
export type MentionAPIResponse = {
  id: number;
  user_id: number;
  task_id?: number;
  comment_id?: number;
  mentioned_by: number;
  created_at?: string;
};

/** Type para representar lembrete vindo da API */
export type ReminderAPIResponse = {
  id: number;
  task_id: number;
  user_id: number;
  reminder_date: string;
  message?: string;
  is_sent: number;
};

/** Type para representar log de tempo vindo da API */
export type TimeLogAPIResponse = {
  id: number;
  task_id: number;
  user_id: number;
  hours: number;
  description?: string;
  log_date: string;
};

/** Type para representar tarefa e tag vindo da API */
export type TagTaskAPIResponse = {
  id: number;
  task_id: number;
  tag_id: number;
};

/** Type para representar tarefa favorita vindo da API */
export type FavoriteTaskAPIResponse = {
  id: number;
  task_id: number;
  user_id: number;
};

/** Type para representar atribuição de tarefa vindo da API */
export type TaskAssigneeAPIResponse = {
  id: number;
  task_id: number;
  user_id: number;
  assigned_by: number;
  assigned_at?: string;
};
