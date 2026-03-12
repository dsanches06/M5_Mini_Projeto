import Attachment from "../attachments/Attachment.js";

/* Serviço para gerir anexos associados a tarefas */
export class AttachmentService {
  private attachments: Map<number, Attachment[]>;

  constructor() {
    this.attachments = new Map<number, Attachment[]>();
  }

  /* Adiciona um anexo a uma tarefa específica */
  addAttachment(taskId: number, attachment: Attachment) {
    if (!this.attachments.has(taskId)) {
      this.attachments.set(taskId, []);
    }
    this.attachments.get(taskId)?.push(attachment);
  }

  /* Obtém todos os anexos associados a uma tarefa específica */
  getAttachments(taskId: number) {
    return this.attachments.get(taskId) || [];
  }

  /* Remove um anexo específico */
  removeAttachment(attachmentId: number) {
    for (const attachments of this.attachments.values()) {
      const index = attachments.findIndex(
        (att) => att.getId() === attachmentId,
      );
      if (index !== -1) {
        attachments.splice(index, 1);
      }
    }
  }
}
