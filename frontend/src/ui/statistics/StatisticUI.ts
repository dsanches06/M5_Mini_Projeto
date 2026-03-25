import { StatisticsService } from "../../services/statisticsService.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";

export type ChartType = "bar" | "pie" | "line" | "doughnut" | "area";

export interface ChartConfig {
  type: ChartType;
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      fill?: boolean;
    }[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    [key: string]: any;
  };
}

export interface ChartDataExport {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  users: number;
  timestamp: string;
}

export class StatisticPageUI {
  private container: HTMLElement;
  private statisticsService: StatisticsService;
  private charts: Map<string, HTMLCanvasElement> = new Map();

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = element;
    this.statisticsService = new StatisticsService();
  }

  /**
   * Renderiza a página completa com todos os gráficos
   */
  public render(): void {
    this.container.innerHTML = "";
    this.container.classList.add("statistics-page");

    // Cabeçalho
    const header = this.createHeader();
    this.container.appendChild(header);

    // Grid de gráficos
    const chartsGrid = this.createChartsGrid();
    this.container.appendChild(chartsGrid);

    // Renderizar cada gráfico
    this.renderTasksOverviewChart(chartsGrid);
    this.renderTasksStatusChart(chartsGrid);
    this.renderCompletionRateChart(chartsGrid);
    this.renderTasksComparisonChart(chartsGrid);
  }

  /**
   * Cria o cabeçalho da página
   */
  private createHeader(): HTMLElement {
    const header = document.createElement("div");
    header.className = "statistics-header";
    header.innerHTML = `
      <h1>📊 Dashboard de Estatísticas</h1>
      <p>Visualize os dados e métricas do projeto</p>
    `;
    return header;
  }

  /**
   * Cria o grid para os gráficos
   */
  private createChartsGrid(): HTMLElement {
    const grid = document.createElement("div");
    grid.className = "charts-grid";
    return grid;
  }

  /**
   * Cria um contêiner para um gráfico
   */
  private createChartContainer(title: string): HTMLElement {
    const container = document.createElement("div");
    container.className = "chart-container";
    container.innerHTML = `
      <div class="chart-header">
        <h2>${title}</h2>
      </div>
      <div class="chart-body"></div>
    `;
    return container;
  }

  /**
   * Desenha gráfico de barra (Bar Chart)
   */
  private drawBarChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    data: number[],
    colors: string[] = []
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barHeight = canvas.height / (labels.length + 1);
    const maxData = Math.max(...data);
    const barWidth = (canvas.width * 0.6) / maxData;
    const defaultColors = [
      "#007bff",
      "#dc3545",
      "#28a745",
      "#ffc107",
      "#17a2b8",
      "#6c757d",
    ];

    labels.forEach((label, index) => {
      const y = (index + 1) * barHeight;
      const width = data[index] * barWidth;
      const color = colors[index] || defaultColors[index % defaultColors.length];

      // Desenhar barra
      ctx.fillStyle = color;
      ctx.fillRect(100, y - barHeight / 2 + 10, width, barHeight - 20);

      // Desenhar label à esquerda
      ctx.fillStyle = "#333";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "right";
      ctx.fillText(label, 90, y + 5);

      // Desenhar valor à direita
      ctx.fillStyle = "#333";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "left";
      ctx.fillText(String(data[index]), width + 110, y + 5);
    });
  }

  /**
   * Desenha gráfico de pizza (Pie Chart)
   */
  private drawPieChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    data: number[],
    colors: string[] = []
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    const total = data.reduce((a, b) => a + b, 0);

    const defaultColors = [
      "#007bff",
      "#dc3545",
      "#28a745",
      "#ffc107",
      "#17a2b8",
      "#6c757d",
    ];

    let currentAngle = -Math.PI / 2;

    labels.forEach((label, index) => {
      const sliceAngle = (data[index] / total) * 2 * Math.PI;
      const color =
        colors[index] || defaultColors[index % defaultColors.length];

      // Desenhar fatia
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Desenhar label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX =
        centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY =
        centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const percentage = ((data[index] / total) * 100).toFixed(1);
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Legenda
    this.drawLegend(ctx, labels, data, colors, canvas.width - 150);
  }

  /**
   * Desenha gráfico de linha (Line Chart)
   */
  private drawLineChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    data: number[],
    colors: string[] = []
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 60;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;

    const maxValue = Math.max(...data) * 1.1;
    const stepX = graphWidth / (labels.length - 1 || 1);
    const stepY = graphHeight / maxValue;

    const color = colors[0] || "#007bff";

    // Desenhar grid
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (graphHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Desenhar linha
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = canvas.height - padding - value * stepY;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Desenhar pontos
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = canvas.height - padding - value * stepY;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Desenhar eixos
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Labels do eixo X
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    labels.forEach((label, index) => {
      const x = padding + index * stepX;
      ctx.fillText(label, x, canvas.height - padding + 20);
    });

    // Labels do eixo Y
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = padding + (graphHeight / 5) * i;
      const value = (maxValue * (5 - i)) / 5;
      ctx.fillText(value.toFixed(0), padding - 10, y + 5);
    }
  }

  /**
   * Desenha gráfico de rosca (Doughnut Chart)
   */
  private drawDoughnutChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    data: number[],
    colors: string[] = []
  ): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 50;
    const innerRadius = outerRadius * 0.6;
    const total = data.reduce((a, b) => a + b, 0);

    const defaultColors = [
      "#007bff",
      "#dc3545",
      "#28a745",
      "#ffc107",
      "#17a2b8",
      "#6c757d",
    ];

    let currentAngle = -Math.PI / 2;

    labels.forEach((label, index) => {
      const sliceAngle = (data[index] / total) * 2 * Math.PI;
      const color =
        colors[index] || defaultColors[index % defaultColors.length];

      // Desenhar setor externo
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        outerRadius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.lineTo(
        centerX + Math.cos(currentAngle + sliceAngle) * innerRadius,
        centerY + Math.sin(currentAngle + sliceAngle) * innerRadius
      );
      ctx.arc(
        centerX,
        centerY,
        innerRadius,
        currentAngle + sliceAngle,
        currentAngle,
        true
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Legenda
    this.drawLegend(ctx, labels, data, colors, canvas.width - 150);
  }

  /**
   * Desenha legenda para gráficos
   */
  private drawLegend(
    ctx: CanvasRenderingContext2D,
    labels: string[],
    data: number[],
    colors: string[],
    startX: number
  ): void {
    const defaultColors = [
      "#007bff",
      "#dc3545",
      "#28a745",
      "#ffc107",
      "#17a2b8",
      "#6c757d",
    ];

    const total = data.reduce((a, b) => a + b, 0);
    let startY = 20;

    labels.forEach((label, index) => {
      const color =
        colors[index] || defaultColors[index % defaultColors.length];
      const percentage = ((data[index] / total) * 100).toFixed(1);

      // Quadrado de cor
      ctx.fillStyle = color;
      ctx.fillRect(startX, startY, 12, 12);

      // Label
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${label} (${percentage}%)`, startX + 18, startY + 10);

      startY += 20;
    });
  }

  /**
   * Renderiza gráfico de visão geral de tarefas
   */
  private renderTasksOverviewChart(container: HTMLElement): void {
    const chartContainer = this.createChartContainer(
      "📈 Visão Geral de Tarefas"
    );
    container.appendChild(chartContainer);

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 300;

    const totalTasks = this.statisticsService.countTasks();
    const completedTasks = this.statisticsService.countCompletedTasks();
    const activeTasks = this.statisticsService.countActiveTasks();

    this.drawBarChart(
      canvas,
      ["Total", "Completadas", "Ativas"],
      [totalTasks, completedTasks, activeTasks],
      ["#007bff", "#28a745", "#ffc107"]
    );

    chartContainer.querySelector(".chart-body")?.appendChild(canvas);
    this.charts.set("overview", canvas);
  }

  /**
   * Renderiza gráfico de status de tarefas
   */
  private renderTasksStatusChart(container: HTMLElement): void {
    const chartContainer = this.createChartContainer(
      "🎯 Distribuição por Status"
    );
    container.appendChild(chartContainer);

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;

    const statuses: TaskStatus[] = [
      TaskStatus.ASSIGNED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ];
    const statusNames = ["Pendente", "Em Progresso", "Concluída"];
    const data = statuses.map((status) =>
      this.statisticsService.tasksByStatus(status)
    );

    this.drawPieChart(canvas, statusNames, data, [
      "#dc3545",
      "#ffc107",
      "#28a745",
    ]);

    chartContainer.querySelector(".chart-body")?.appendChild(canvas);
    this.charts.set("status", canvas);
  }

  /**
   * Renderiza gráfico de taxa de conclusão
   */
  private renderCompletionRateChart(container: HTMLElement): void {
    const chartContainer = this.createChartContainer(
      "📊 Taxa de Conclusão"
    );
    container.appendChild(chartContainer);

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;

    const total = this.statisticsService.countTasks();
    const completed = this.statisticsService.countCompletedTasks();
    const remaining = total - completed;

    this.drawDoughnutChart(
      canvas,
      ["Concluídas", "Pendentes"],
      [completed, remaining],
      ["#28a745", "#dc3545"]
    );

    chartContainer.querySelector(".chart-body")?.appendChild(canvas);
    this.charts.set("completion", canvas);
  }

  /**
   * Renderiza gráfico de comparação de tarefas
   */
  private renderTasksComparisonChart(container: HTMLElement): void {
    const chartContainer = this.createChartContainer(
      "📉 Comparação: Ativas vs Completas"
    );
    container.appendChild(chartContainer);

    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 300;

    const active = this.statisticsService.countActiveTasks();
    const completed = this.statisticsService.countCompletedTasks();

    this.drawLineChart(
      canvas,
      ["Ativas", "Completadas"],
      [active, completed],
      ["#007bff"]
    );

    chartContainer.querySelector(".chart-body")?.appendChild(canvas);
    this.charts.set("comparison", canvas);
  }

  /**
   * Atualiza um gráfico específico
   */
  public updateChart(chartName: string): void {
    const canvas = this.charts.get(chartName);
    if (canvas) {
      // Limpar canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Re-renderizar baseado no tipo
      switch (chartName) {
        case "overview":
          this.renderTasksOverviewChart(this.container);
          break;
        case "status":
          this.renderTasksStatusChart(this.container);
          break;
        case "completion":
          this.renderCompletionRateChart(this.container);
          break;
        case "comparison":
          this.renderTasksComparisonChart(this.container);
          break;
      }
    }
  }

  /**
   * Atualiza todos os gráficos
   */
  public updateAllCharts(): void {
    this.render();
  }

  /**
   * Exporta dados dos gráficos como JSON
   */
  public exportChartData(): ChartDataExport {
    return {
      totalTasks: this.statisticsService.countTasks(),
      completedTasks: this.statisticsService.countCompletedTasks(),
      activeTasks: this.statisticsService.countActiveTasks(),
      users: this.statisticsService.countUsers(),
      timestamp: new Date().toISOString(),
    };
  }
}
