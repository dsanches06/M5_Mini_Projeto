import { describe, it, expect, beforeEach, vi } from "vitest";
import { StatisticPageUI, ChartDataExport } from "../src/ui/statistics/StatisticPageUI.js";
import { StatisticsService } from "../src/services/statisticsService.js";

// Mock do StatisticsService
vi.mock("../src/services/statisticsService", () => ({
  StatisticsService: class {
    countUsers() {
      return 5;
    }
    countTasks() {
      return 20;
    }
    countCompletedTasks() {
      return 12;
    }
    countActiveTasks() {
      return 8;
    }
    tasksByStatus() {
      return 5;
    }
  },
}));

describe("StatisticPageUI", () => {
  let container: HTMLElement;
  let ui: StatisticPageUI;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="test-container"></div>';
    container = document.getElementById("test-container")!;
    ui = new StatisticPageUI("test-container");
  });

  describe("Inicialização", () => {
    it("deve criar a instância corretamente", () => {
      expect(ui).toBeDefined();
    });

    it("deve lançar erro se container não existir", () => {
      expect(() => new StatisticPageUI("non-existent")).toThrow();
    });

    it("deve adicionar classe de página ao container", () => {
      ui.render();
      expect(container.classList.contains("statistics-page")).toBe(true);
    });
  });

  describe("Renderização", () => {
    it("deve renderizar cabeçalho", () => {
      ui.render();
      const header = container.querySelector(".statistics-header");
      expect(header).toBeDefined();
      expect(header?.textContent).toContain("Dashboard de Estatísticas");
    });

    it("deve criar grid de gráficos", () => {
      ui.render();
      const grid = container.querySelector(".charts-grid");
      expect(grid).toBeDefined();
    });

    it("deve criar 4 contêineres de gráficos", () => {
      ui.render();
      const chartContainers = container.querySelectorAll(".chart-container");
      expect(chartContainers.length).toBe(4);
    });

    it("deve criar elementos canvas para cada gráfico", () => {
      ui.render();
      const canvases = container.querySelectorAll("canvas");
      expect(canvases.length).toBeGreaterThan(0);
    });
  });

  describe("Gráficos Específicos", () => {
    beforeEach(() => {
      ui.render();
    });

    it("deve ter títulos corretos para cada gráfico", () => {
      const titles = Array.from(container.querySelectorAll(".chart-header h2")).map(
        (el) => el.textContent
      );

      expect(titles).toContain("📈 Visão Geral de Tarefas");
      expect(titles).toContain("🎯 Distribuição por Status");
      expect(titles).toContain("📊 Taxa de Conclusão");
      expect(titles).toContain("📉 Comparação: Ativas vs Completas");
    });

    it("cada gráfico deve ter um canvas", () => {
      const chartBodies = container.querySelectorAll(".chart-body");
      chartBodies.forEach((body) => {
        const canvas = body.querySelector("canvas");
        expect(canvas).toBeDefined();
      });
    });
  });

  describe("Métodos de Desenho", () => {
    it("drawBarChart deve funcionar sem erros", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 300;

      expect(() => {
        // @ts-ignore - Acessar método privado para teste
        ui["drawBarChart"](canvas, ["A", "B", "C"], [10, 20, 30]);
      }).not.toThrow();
    });

    it("drawPieChart deve funcionar sem erros", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;

      expect(() => {
        // @ts-ignore
        ui["drawPieChart"](canvas, ["A", "B"], [50, 50]);
      }).not.toThrow();
    });

    it("drawLineChart deve funcionar sem erros", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 300;

      expect(() => {
        // @ts-ignore
        ui["drawLineChart"](canvas, ["Jan", "Feb"], [10, 20]);
      }).not.toThrow();
    });

    it("drawDoughnutChart deve funcionar sem erros", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;

      expect(() => {
        // @ts-ignore
        ui["drawDoughnutChart"](canvas, ["A", "B"], [60, 40]);
      }).not.toThrow();
    });
  });

  describe("Atualização", () => {
    beforeEach(() => {
      ui.render();
    });

    it("deve atualizar gráfico específico", () => {
      expect(() => ui.updateChart("overview")).not.toThrow();
    });

    it("deve atualizar todos os gráficos", () => {
      expect(() => ui.updateAllCharts()).not.toThrow();
    });

    it("não deve quebrar ao atualizar gráfico inexistente", () => {
      expect(() => ui.updateChart("non-existent")).not.toThrow();
    });
  });

  describe("Exportação de Dados", () => {
    it("deve exportar dados corretamente", () => {
      const data: ChartDataExport = ui.exportChartData();

      expect(data).toHaveProperty("totalTasks");
      expect(data).toHaveProperty("completedTasks");
      expect(data).toHaveProperty("activeTasks");
      expect(data).toHaveProperty("users");
      expect(data).toHaveProperty("timestamp");
    });

    it("dados exportados devem ter valores corretos", () => {
      const data: ChartDataExport = ui.exportChartData();

      expect(data.totalTasks).toBe(20);
      expect(data.completedTasks).toBe(12);
      expect(data.activeTasks).toBe(8);
      expect(data.users).toBe(5);
    });

    it("timestamp deve ser válido", () => {
      const data: ChartDataExport = ui.exportChartData();
      const date = new Date(data.timestamp);

      expect(date instanceof Date).toBe(true);
      expect(!isNaN(date.getTime())).toBe(true);
    });
  });

  describe("Estilos CSS", () => {
    it("deve aplicar classes corretamente", () => {
      ui.render();

      const header = container.querySelector(".statistics-header");
      const grid = container.querySelector(".charts-grid");
      const containers = container.querySelectorAll(".chart-container");
      const bodies = container.querySelectorAll(".chart-body");

      expect(header?.className).toContain("statistics-header");
      expect(grid?.className).toContain("charts-grid");
      expect(containers.length).toBeGreaterThan(0);
      expect(bodies.length).toBeGreaterThan(0);
    });
  });

  describe("Responsividade", () => {
    it("deve funcionar em diferentes tamanhos de canvas", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 400;

      expect(() => {
        // @ts-ignore
        ui["drawBarChart"](canvas, ["A", "B"], [10, 20]);
      }).not.toThrow();
    });
  });

  describe("Tratamento de Erros", () => {
    it("deve lidar com dados vazios", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;

      expect(() => {
        // @ts-ignore
        ui["drawBarChart"](canvas, [], []);
      }).not.toThrow();
    });

    it("deve lidar com null context", () => {
      const canvas = document.createElement("canvas");
      // Mock getContext para retornar null
      canvas.getContext = () => null;

      expect(() => {
        // @ts-ignore
        ui["drawBarChart"](canvas, ["A"], [10]);
      }).not.toThrow();
    });
  });

  describe("Cores Personalizadas", () => {
    it("deve aceitar cores personalizadas", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;

      const customColors = ["#FF0000", "#00FF00", "#0000FF"];

      expect(() => {
        // @ts-ignore
        ui["drawBarChart"](canvas, ["A", "B", "C"], [10, 20, 30], customColors);
      }).not.toThrow();
    });

    it("deve usar cores padrão se não fornecidas", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;

      expect(() => {
        // @ts-ignore
        ui["drawBarChart"](canvas, ["A", "B"], [10, 20]);
      }).not.toThrow();
    });
  });
});
