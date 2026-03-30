export function showConfirmDialog(
  message: string,
  title = "Confirmação",
): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement("section") as HTMLElement;
    modal.className = "modal";
    modal.id = "confirmDialogModal";

    const content = document.createElement("section") as HTMLElement;
    content.className = "modal-content";

    const closeBtn = document.createElement("span") as HTMLSpanElement;
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => closeDialog(false));

    const heading = document.createElement("h2") as HTMLHeadingElement;
    heading.textContent = title;
    heading.style.marginBottom = "1rem";

    const messageElement = document.createElement("p") as HTMLElement;
    messageElement.textContent = message;
    messageElement.style.marginBottom = "1.75rem";
    messageElement.style.lineHeight = "1.5";

    const buttonGroup = document.createElement("div") as HTMLElement;
    buttonGroup.style.display = "flex";
    buttonGroup.style.justifyContent = "flex-end";
    buttonGroup.style.gap = "0.75rem";

    const cancelButton = document.createElement("button") as HTMLButtonElement;
    cancelButton.type = "button";
    cancelButton.textContent = "Cancelar";
    cancelButton.style.backgroundColor = "#ccc";
    cancelButton.style.color = "#333";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "6px";
    cancelButton.style.padding = "0.6rem 1rem";
    cancelButton.style.cursor = "pointer";
    cancelButton.addEventListener("click", () => closeDialog(false));

    const confirmButton = document.createElement("button") as HTMLButtonElement;
    confirmButton.type = "button";
    confirmButton.textContent = "Confirmar";
    confirmButton.style.backgroundColor = "#f44336";
    confirmButton.style.color = "#fff";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "6px";
    confirmButton.style.padding = "0.6rem 1rem";
    confirmButton.style.cursor = "pointer";
    confirmButton.addEventListener("click", () => closeDialog(true));

    buttonGroup.append(cancelButton, confirmButton);
    content.append(closeBtn, heading, messageElement, buttonGroup);
    modal.append(content);
    document.body.appendChild(modal);
    modal.style.display = "block";

    const handleOverlayClick = (event: MouseEvent) => {
      if (event.target === modal) {
        closeDialog(false);
      }
    };

    modal.addEventListener("click", handleOverlayClick);

    const previousActiveElement = document.activeElement as HTMLElement | null;
    confirmButton.focus();

    function closeDialog(result: boolean) {
      modal.removeEventListener("click", handleOverlayClick);
      modal.remove();
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
      resolve(result);
    }
  });
}
