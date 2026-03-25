# 📊 Dashboard de Estatísticas - StatisticPageUI

Um sistema completo e robusto para exibir múltiplos tipos de gráficos em sua aplicação, sem dependências externas. Todos os gráficos são desenhados usando HTML5 Canvas.

## ✨ Características

- ✅ **5 Tipos de Gráficos**: Barras, Pizza, Linhas, Rosca e Área
- ✅ **Sem Dependências**: Utiliza Canvas nativo do HTML5
- ✅ **Design Responsivo**: Adapta-se automaticamente a diferentes tamanhos de tela
- ✅ **Tema Moderno**: Gradientes, sombras e animações suaves
- ✅ **Atualização em Tempo Real**: Atualize dados dinamicamente
- ✅ **Exportação de Dados**: Exporte estatísticas em JSON
- ✅ **TypeScript**: Totalmente tipado com TypeScript

## 📦 Tipos de Gráficos Suportados

### 1. Bar Chart (Gráfico de Barras)
Ideal para comparar valores entre categorias.
```typescript
drawBarChart(canvas, labels, data, colors);
```

### 2. Pie Chart (Gráfico de Pizza)
Perfeito para mostrar proporções e percentuais.
```typescript
drawPieChart(canvas, labels, data, colors);
```

### 3. Line Chart (Gráfico de Linhas)
Excelente para visualizar tendências ao longo do tempo.
```typescript
drawLineChart(canvas, labels, data, colors);
```

### 4. Doughnut Chart (Gráfico de Rosca)
Variação do gráfico de pizza com um furo no centro.
```typescript
drawDoughnutChart(canvas, labels, data, colors);
```

### 5. Area Chart (Gráfico de Área)
Combina recursos de gráfico de linhas com preenchimento.

## 🚀 Como Usar

### 1. Setup Básico

```typescript
import { StatisticPageUI } from "./ui/statistics/StatisticPageUI.js";

// Criar instância
const ui = new StatisticPageUI("statistics-container");

// Renderizar todos os gráficos
ui.render();
```

### 2. HTML Necessário

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/src/styles/statistics.css">
</head>
<body>
  <div id="statistics-container"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 3. Gráficos Disponíveis

A página de estatísticas renderiza automaticamente 4 gráficos:

1. **Visão Geral de Tarefas** 📈
   - Mostra total, completadas e ativas
   - Tipo: Gráfico de Barras

2. **Distribuição por Status** 🎯
   - Pendente, Em Progresso, Concluída
   - Tipo: Gráfico de Pizza

3. **Taxa de Conclusão** 📊
   - Proporção de concluídas vs pendentes
   - Tipo: Gráfico de Rosca

4. **Comparação: Ativas vs Completas** 📉
   - Tendência de tarefas
   - Tipo: Gráfico de Linhas

## 📚 API Completa

### Métodos Principais

#### `render()`
Renderiza a página completa com todos os gráficos.

```typescript
ui.render();
```

#### `updateChart(chartName: string)`
Atualiza um gráfico específico.

```typescript
ui.updateChart("overview");    // Visão geral
ui.updateChart("status");      // Status
ui.updateChart("completion");  // Taxa de conclusão
ui.updateChart("comparison");  // Comparação
```

#### `updateAllCharts()`
Atualiza todos os gráficos de uma vez.

```typescript
ui.updateAllCharts();
```

#### `exportChartData()`
Exporta os dados dos gráficos como JSON.

```typescript
const data = ui.exportChartData();
console.log(data);
// {
//   totalTasks: 10,
//   completedTasks: 6,
//   activeTasks: 4,
//   users: 2,
//   timestamp: "2026-03-25T10:30:00Z"
// }
```

## 🎨 Customização

### Customizar Cores

Cada método de desenho aceita um array de cores:

```typescript
const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1"];
this.drawBarChart(canvas, labels, data, colors);
```

### Cores Pré-definidas

```typescript
const defaultColors = [
  "#3498db",  // Azul
  "#e74c3c",  // Vermelho
  "#2ecc71",  // Verde
  "#f39c12",  // Laranja
  "#9b59b6",  // Roxo
  "#1abc9c",  // Turquesa
];
```

### Customizar Estilos CSS

Edite `src/styles/statistics.css`:

```css
.statistics-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.chart-container {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

## 🔄 Atualização em Tempo Real

### Auto-Atualizar a Cada Intervalo

```typescript
import { setupAutoUpdate } from "./ui/statistics/StatisticsPageExample.js";

const ui = new StatisticPageUI("statistics-container");
ui.render();

// Atualizar a cada 5 segundos
setupAutoUpdate(ui, 5000);
```

### Atualizar com Event Listeners

```typescript
// Atualizar quando uma tarefa é criada
document.addEventListener("taskCreated", () => {
  ui.updateAllCharts();
});

// Atualizar quando uma tarefa é completada
document.addEventListener("taskCompleted", () => {
  ui.updateAllCharts();
});
```

## 💾 Exportar Dados

### Como JSON

```typescript
const data = ui.exportChartData();
const jsonString = JSON.stringify(data, null, 2);
```

### Fazer Download

```typescript
function downloadJSON(data, filename) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

downloadJSON(ui.exportChartData(), "statistics.json");
```

## 📱 Responsividade

A página é totalmente responsiva:

- **Desktop**: Grid com até 2 colunas
- **Tablet**: Grid com 1 coluna
- **Mobile**: Um gráfico por tela

```css
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🌙 Tema Escuro

Suporte automático para preferência de tema escuro:

```css
@media (prefers-color-scheme: dark) {
  .statistics-page {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  }
}
```

## ⚙️ Requisitos

- TypeScript 4.5+
- HTML5 Canvas support
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 📊 Estrutura de Dados

Os dados vêm do `StatisticsService`:

```typescript
class StatisticsService {
  countUsers(): number
  countTasks(): number
  countCompletedTasks(): number
  countActiveTasks(): number
  tasksByStatus(status: TaskStatus): number
}
```

## 🐛 Troubleshooting

### Gráfico não aparece
- Verifique se o container com id existe no HTML
- Ensure que o CSS foi carregado
- Abra o console para erros

### Dados não atualizam
- Chamou `ui.updateAllCharts()`?
- O `StatisticsService` está retornando dados novos?
- Verifique o intervalo de auto-atualização

### Canvas branco/vazio
- Verifique as dimensões do canvas
- Confira se o contexto 2D foi obtido corretamente
- Teste em outro navegador

## 📝 Exemplo Completo

```typescript
import { StatisticPageUI } from "./ui/statistics/StatisticPageUI.js";
import { setupAutoUpdate, addControlButtons } from "./ui/statistics/StatisticsPageExample.js";

// Inicializar
const ui = new StatisticPageUI("statistics-container");

// Renderizar
ui.render();

// Adicionar controles
addControlButtons(ui);

// Auto-atualizar a cada 30 segundos
setupAutoUpdate(ui, 30000);

// Exportar em caso de necessidade
const data = ui.exportChartData();
console.log("Dados:", data);
```

## 🎯 Próximos Passos

- [ ] Adicionar mais tipos de gráficos (Scatter, Radar)
- [ ] Suporte para temas personalizados
- [ ] Filtros de data personalizada
- [ ] Comparação entre períodos
- [ ] Exportar para PDF/Excel
- [ ] Integração com backend para dados em tempo real

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para Gestão de Tarefas**
