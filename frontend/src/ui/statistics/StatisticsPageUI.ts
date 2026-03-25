/**
 * Exemplo de uso do StatisticPageUI
 * 
 * Este arquivo demonstra como usar a classe StatisticPageUI para exibir
 * múltiplos tipos de gráficos em sua aplicação.
 */

import { StatisticPageUI } from "./StatisticUI.js";
import { clearContainer, addElementInContainer } from "../dom/index.js";

// ============================================
// EXEMPLO 1: Inicialização básica
// ============================================
export function initializeStatisticsPage(): void {
  // Certifique-se de que o HTML contém um elemento com id="statistics-container"
  const ui = new StatisticPageUI("statistics-container");
  
  // Renderizar todos os gráficos
  ui.render();
  
  console.log("📊 Página de estatísticas inicializada com sucesso!");
}

// ============================================
// EXEMPLO 2: Atualizar gráficos em tempo real
// ============================================
export function setupAutoUpdate(ui: StatisticPageUI, intervalMs: number = 5000): void {
  setInterval(() => {
    ui.updateAllCharts();
    console.log("🔄 Gráficos atualizados");
  }, intervalMs);
}

// ============================================
// EXEMPLO 3: Atualizar um gráfico específico
// ============================================
export function updateSpecificChart(ui: StatisticPageUI, chartName: string): void {
  // Possíveis valores: "overview", "status", "completion", "comparison"
  ui.updateChart(chartName);
  console.log(`✅ Gráfico "${chartName}" atualizado`);
}

// ============================================
// EXEMPLO 4: Exportar dados para análise
// ============================================
export function exportStatisticsData(ui: StatisticPageUI) {
  const data = ui.exportChartData();
  console.log("📥 Dados exportados:", data);
  
  // Converter para JSON e salvar/enviar
  const jsonData = JSON.stringify(data, null, 2);
  console.log(jsonData);
  
  return data;
}

// ============================================
// EXEMPLO 5: Adicionar botões de controle
// ============================================
export function addControlButtons(ui: StatisticPageUI): void {
  const controlDiv = document.createElement("div");
  controlDiv.className = "statistics-controls";
  controlDiv.style.cssText = `
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  `;
  
  // Botão para atualizar todos os gráficos
  const updateAllBtn = document.createElement("button");
  updateAllBtn.textContent = "🔄 Atualizar Todos";
  updateAllBtn.style.cssText = `
    padding: 0.75rem 1.5rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;
  `;
  updateAllBtn.addEventListener("mouseenter", (e) => {
    (e.target as HTMLElement).style.background = "#2980b9";
  });
  updateAllBtn.addEventListener("mouseleave", (e) => {
    (e.target as HTMLElement).style.background = "#3498db";
  });
  updateAllBtn.addEventListener("click", () => {
    ui.updateAllCharts();
  });
  
  // Botão para exportar dados
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "📥 Exportar Dados";
  exportBtn.style.cssText = `
    padding: 0.75rem 1.5rem;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;
  `;
  exportBtn.addEventListener("mouseenter", (e) => {
    (e.target as HTMLElement).style.background = "#27ae60";
  });
  exportBtn.addEventListener("mouseleave", (e) => {
    (e.target as HTMLElement).style.background = "#2ecc71";
  });
  exportBtn.addEventListener("click", () => {
    const data = exportStatisticsData(ui);
    // Opcional: Fazer download do arquivo JSON
    downloadJSON(data, "statistics.json");
  });
  
  controlDiv.appendChild(updateAllBtn);
  controlDiv.appendChild(exportBtn);
  
  const container = document.getElementById("statistics-container");
  if (container) {
    container.parentElement?.appendChild(controlDiv);
  }
}

// ============================================
// HELPER: Download de arquivo JSON
// ============================================
function downloadJSON(data: object, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  console.log(`📄 Arquivo ${filename} baixado`);
}

// ============================================
// EXEMPLO 6: Integração com eventos
// ============================================
export function setupEventListeners(ui: StatisticPageUI): void {
  // Atualizar gráficos quando uma tarefa é criada/atualizada
  document.addEventListener("taskCreated", () => {
    console.log("✨ Nova tarefa criada - atualizando gráficos");
    ui.updateAllCharts();
  });
  
  document.addEventListener("taskCompleted", () => {
    console.log("✅ Tarefa completada - atualizando gráficos");
    ui.updateAllCharts();
  });
  
  document.addEventListener("taskDeleted", () => {
    console.log("🗑️ Tarefa deletada - atualizando gráficos");
    ui.updateAllCharts();
  });
}

// ============================================
// EXEMPLO 7: Setup completo
// ============================================
export function setupCompleteStatisticsPage(): void {
  try {
    // Limpar o container principal
    clearContainer("#containerSection");
    
    // Criar container para as estatísticas
    const statisticsContainer = document.createElement("div");
    statisticsContainer.id = "statistics-container";
    
    // Adicionar ao documento
    addElementInContainer("#containerSection", statisticsContainer);
    
    // Importar CSS se ainda não estiver carregado
    if (!document.querySelector('link[href*="statistics.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./src/styles/statistics.css";
      document.head.appendChild(link);
    }
    
    // Inicializar UI
    const ui = new StatisticPageUI("statistics-container");
    ui.render();
    
    // Adicionar controles
    addControlButtons(ui);
    
    // Configurar auto-atualização (a cada 30 segundos)
    setupAutoUpdate(ui, 30000);
    
    // Configurar event listeners
    setupEventListeners(ui);
    
    console.log("✅ Dashboard de estatísticas totalmente configurado!");
  } catch (error) {
    console.error("❌ Erro ao configurar dashboard:", error);
  }
}

// ============================================
// EXEMPLO 8: Tipos de gráficos disponíveis
// ============================================
/**
 * A classe StatisticPageUI suporta os seguintes tipos de gráficos:
 * 
 * 1. BAR CHART (Gráfico de Barras)
 *    - Ideal para comparar valores entre categorias
 *    - Usado em: Visão geral de tarefas
 * 
 * 2. PIE CHART (Gráfico de Pizza)
 *    - Ideal para mostrar proporções
 *    - Usado em: Distribuição por status
 * 
 * 3. LINE CHART (Gráfico de Linhas)
 *    - Ideal para mostrar tendências ao longo do tempo
 *    - Usado em: Comparação Ativas vs Completas
 * 
 * 4. DOUGHNUT CHART (Gráfico de Rosca)
 *    - Similar ao gráfico de pizza, mas com um furo no centro
 *    - Usado em: Taxa de conclusão
 * 
 * Todos os gráficos são desenhados usando HTML5 Canvas,
 * sem dependências externas, garantindo máxima compatibilidade.
 */

export const CHART_TYPES = {
  BAR: "bar",
  PIE: "pie",
  LINE: "line",
  DOUGHNUT: "doughnut",
  AREA: "area",
} as const;
