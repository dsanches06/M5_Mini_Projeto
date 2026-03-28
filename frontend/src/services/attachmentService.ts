import { TaskAttachmentAPIResponse } from "@api/dto/typesDTO.js";
import * as fetchTaskAttachments from "../api/fetchTaskAttachments.js";
import Attachment from "../attachments/Attachment.js";

/* Serviço para gerir anexos associados a tarefas */
export class AttachmentService {
  /* Obtém a lista de anexos de tarefas da API */
  static async getTaskAttachments(): Promise<TaskAttachmentAPIResponse[]> {
    return await fetchTaskAttachments.getTaskAttachments();
  }

  /* Obtém um anexo de tarefa por ID da API */
  static async getTaskAttachmentById(id: number): Promise<TaskAttachmentAPIResponse | null> {
    return await fetchTaskAttachments.getTaskAttachmentById(id);
  }

  /* Cria um novo anexo de tarefa na API */
  static async createTaskAttachment(attachment: any): Promise<TaskAttachmentAPIResponse | null> {
    return await fetchTaskAttachments.createTaskAttachment(attachment);
  }

  /* Atualiza um anexo de tarefa na API */
  static async updateTaskAttachment(
    id: number,
    attachment: any,
  ): Promise<TaskAttachmentAPIResponse | null> {
    return await fetchTaskAttachments.updateTaskAttachment(id, attachment);
  }

  /* Exclui um anexo de tarefa na API */
  static async deleteTaskAttachment(id: number): Promise<boolean> {
    return await fetchTaskAttachments.deleteTaskAttachment(id);
  }
}
