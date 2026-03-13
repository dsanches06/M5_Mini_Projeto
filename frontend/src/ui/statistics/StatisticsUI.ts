
declare global {
  const d3: any;
}

export class StatisticsUI {
  private container: HTMLElement;
  private data: any[];

  constructor(containerId: string) {
    const element = document.querySelector(`#${containerId}`) as HTMLElement;
    if (!element) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = element;
    this.data = [];
  }

  setData(data: any[]): void {
    this.data = data;
  }

  renderBarChart(xKey: string, yKey: string, options?: { width?: number; height?: number; margin?: any }): void {
    const defaultOptions = {
      width: 800,
      height: 400,
      margin: { top: 20, right: 30, bottom: 30, left: 60 }
    };
    const config = { ...defaultOptions, ...options };

    // Clear the container
    d3.select(this.container).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(this.container)
      .append('svg')
      .attr('width', config.width)
      .attr('height', config.height);

    const g = svg.append('g')
      .attr('transform', `translate(${config.margin.left},${config.margin.top})`);

    const width = config.width - config.margin.left - config.margin.right;
    const height = config.height - config.margin.top - config.margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(this.data.map((d: any) => d[xKey]))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, (d: any) => d[yKey]) as number])
      .range([height, 0]);

    // Create bars
    g.selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => xScale(d[xKey]) || 0)
      .attr('y', (d: any) => yScale(d[yKey]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: any) => height - yScale(d[yKey]))
      .attr('fill', '#4CAF50');

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);
  }

  renderLineChart(xKey: string, yKey: string, options?: { width?: number; height?: number; margin?: any }): void {
    const defaultOptions = {
      width: 800,
      height: 400,
      margin: { top: 20, right: 30, bottom: 30, left: 60 }
    };
    const config = { ...defaultOptions, ...options };

    // Clear the container
    d3.select(this.container).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(this.container)
      .append('svg')
      .attr('width', config.width)
      .attr('height', config.height);

    const g = svg.append('g')
      .attr('transform', `translate(${config.margin.left},${config.margin.top})`);

    const width = config.width - config.margin.left - config.margin.right;
    const height = config.height - config.margin.top - config.margin.bottom;

    // Create scales
    const xScale = d3.scalePoint()
      .domain(this.data.map((d: any) => d[xKey]))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, (d: any) => d[yKey]) as number])
      .range([height, 0]);

    // Create line generator
    const line = d3.line()
      .x((d: any) => xScale(d[xKey]) || 0)
      .y((d: any) => yScale(d[yKey]));

    // Create path
    g.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#2196F3')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);
  }

  renderPieChart(labelKey: string, valueKey: string, options?: { width?: number; height?: number }): void {
    const defaultOptions = {
      width: 500,
      height: 500
    };
    const config = { ...defaultOptions, ...options };

    // Clear the container
    d3.select(this.container).selectAll('*').remove();

    const radius = Math.min(config.width, config.height) / 2;

    const svg = d3.select(this.container)
      .append('svg')
      .attr('width', config.width)
      .attr('height', config.height)
      .append('g')
      .attr('transform', `translate(${config.width / 2},${config.height / 2})`);

    const pie = d3.pie()
      .value((d: any) => d[valueKey]);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const color = d3.scaleOrdinal()
      .domain(this.data.map((d: any) => d[labelKey]))
      .range(d3.schemeCategory10);

    const arcs = svg.selectAll('arc')
      .data(pie(this.data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => color(d.data[labelKey]));

    arcs.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text((d: any) => d.data[labelKey]);
  }
}