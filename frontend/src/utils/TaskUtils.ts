import { ITask } from "../tasks/index.js";
import {
  NotificationService,
  AutomationRulesService,
} from "../services/index.js";
import { SystemLogger } from "../logs/SystemLogger.js";
import { TaskStatus } from "../tasks/TaskStatus.js";
import { UserClass } from "../models/index.js";
import { StateTransitions } from "./index.js";
import { GlobalValidators } from "./GlobalValidators.js";
import {Buffer} from "../helpers/index.js";

/* Processa a tarefa com base no seu tipo e registra logs e notificações */
export function processTask(task: ITask) {
  const type = task.getType();
  const user = task.getUser() as UserClass | undefined;
  const currentStatus = task.getStatus();
  const nextStatus = StateTransitions.getNextStatus(currentStatus);

  if (type === "Bugs" && !user) {
    SystemLogger.log(
      `ERRO: Bug ${task.getTitle()} (id:${task.getId()}) não possui usuário atribuído e não pode ser processado.`,
    );
    return;
  }

  if (currentStatus === TaskStatus.ARCHIVED) {
    Buffer.addArchived(`${task.getTitle()} (id:${task.getId()})`);
    
    return;
  }

  if (currentStatus === nextStatus) {
    Buffer.addAlreadyStatus(task.getTitle());
    return;
  }

  if (!StateTransitions.validTransitions(currentStatus, nextStatus)) {
    Buffer.addInvalidTransition(task.getTitle(), currentStatus.toString(), nextStatus.toString());
    return;
  }

  // Determina comportamento por tipo (preserva comportamento anterior: Bugs notifica no sucesso)
  let notifyOnSuccess = false;
  let notifyAdminsOnSuccess = false;
  const title = task.getTitle();

  switch (type) {
    case "Bugs":
      // Regras mais rígidas: título longo e usuário obrigatório
      if (!GlobalValidators.isValidTitle(title)) {
        SystemLogger.log(
          `ERRO: Bug ${task.getId()} tem título inválido. O título precisa ter pelo menos 10 caracteres.`,
        );
        NotificationService.notifyAdmins(
          `Bug ${task.getTitle()} (id:${task.getId()}) possui título inválido e não pode ser processado.`,
        );
        if (user) {
          NotificationService.notifyUser(
            user.getId(),
            `Bug ${task.getTitle()} não pôde ser processado devido a título inválido.`,
          );
        }
        return;
      }
      if (!user) {
        SystemLogger.log(
          `ERRO: Bug ${task.getId()} não possui usuário atribuído e regras mais rígidas impedem o processamento.`,
        );
        NotificationService.notifyAdmins(
          `Bug ${task.getTitle()} (id:${task.getId()}) sem usuário atribuíd o e não pode ser processado.`,
        );
        return;
      }
      notifyOnSuccess = true;
      notifyAdminsOnSuccess = true;
      break;

    case "Feature":
      // Regras mais flexíveis: apenas titulo não vazio; aviso para título curto
      if (!GlobalValidators.isNonEmpty(title)) {
        SystemLogger.log(
          `ERRO: Feature ${task.getId()} possui título vazio e não pode ser processado.`,
        );
        if (user) {
          NotificationService.notifyUser(
            user.getId(),
            `Feature ${task.getTitle()} não pôde ser processado porque o título está vazio.`,
          );
        }
        return;
      }
      if (!GlobalValidators.minLength(title, 3)) {
        SystemLogger.log(
          `WARN: Feature ${task.getId()} possui título curto, mas será processado por regras mais flexíveis.`,
        );
      }
      break;

    default:
      Buffer.addInvalidType(task.getTitle(), type);
      break;
  }

  processTransition(
    task,
    type,
    user,
    currentStatus,
    nextStatus,
    notifyOnSuccess,
    notifyAdminsOnSuccess,
  );
}

// Helper que encapsula o try/catch e logging/notifications para reduzir duplicação
function processTransition(
  task: ITask,
  type: string,
  user: UserClass | undefined,
  currentStatus: TaskStatus,
  nextStatus: TaskStatus,
  notifyOnSuccess: boolean,
  notifyAdminsOnSuccess: boolean = false,
) {
  try {
    task.moveTo(nextStatus);
    AutomationRulesService.applyRules(task);

    SystemLogger.log(
      `INFO: A tarefa ${task.getTitle()} do tipo ${type} atribuido ao ${user?.getName()} foi processado [${currentStatus.toString()} -> ${nextStatus.toString()}].`,
    );

    // Log automático extra para Bugs
    if (type === "Bugs") {
      SystemLogger.log(
        `AUTO-LOG: Bug ${task.getId()} processado com regras rígidas em ${new Date().toLocaleString("pt-PT")}.`,
      );
    }

    if (notifyOnSuccess && user) {
      NotificationService.notifyUser(
        user.getId(),
        `A tarefa ${task.getTitle()} do tipo ${type} atribuido ao ${user.getName()} foi processado [${currentStatus.toString()} -> ${nextStatus.toString()}].`,
      );
    }

    if (notifyAdminsOnSuccess) {
      NotificationService.notifyAdmins(
        `A tarefa ${task.getTitle()} (id:${task.getId()}) do tipo ${type} foi processada [${currentStatus.toString()} -> ${nextStatus.toString()}].`,
      );
    }
  } catch (error: any) {
    SystemLogger.log(
      `ERRO: Falha ao processar a tarefa ${task.getTitle()} do tipo ${type} atribuido ao ${user?.getName()}. Motivo: ${error.message}`,
    );
    if (user) {
      NotificationService.notifyUser(
        user.getId(),
        `Falha ao processar a tarefa ${task.getTitle()} do tipo ${type} atribuido ao ${user.getName()}. Motivo: ${error.message}`,
      );
    }

    if (notifyAdminsOnSuccess) {
      NotificationService.notifyAdmins(
        `Falha ao processar a tarefa ${task.getTitle()} (id:${task.getId()}) do tipo ${type}. Motivo: ${error.message}`,
      );
    }
  }
}
