/**
 * 高级统计图表组件
 * 提供各种类型的数据可视化组件
 */

/**
 * 创建雷达图 - 比较多维度技能水平
 * @param {string} containerId - 容器ID
 * @param {object} data - 数据对象
 */
function createRadarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 雷达图尺寸和设置
  const width = container.clientWidth;
  const height = Math.min(width, 400);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
  
  // 计算各维度的角度
  const dimensions = Object.keys(data);
  const angleStep = (Math.PI * 2) / dimensions.length;
  
  // 创建SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  
  // 创建背景网格
  const backgroundGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  // 添加同心圆
  const levels = 5;
  for (let i = 1; i <= levels; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', (radius / levels) * i);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#30363d');
    circle.setAttribute('stroke-width', '1');
    backgroundGrid.appendChild(circle);
  }
  
  // 添加轴线
  dimensions.forEach((dim, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius;
    
    const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axis.setAttribute('x1', centerX);
    axis.setAttribute('y1', centerY);
    axis.setAttribute('x2', x2);
    axis.setAttribute('y2', y2);
    axis.setAttribute('stroke', '#30363d');
    axis.setAttribute('stroke-width', '1');
    backgroundGrid.appendChild(axis);
    
    // 添加标签
    const labelX = centerX + Math.cos(angle) * (radius + 20);
    const labelY = centerY + Math.sin(angle) * (radius + 20);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelX);
    text.setAttribute('y', labelY);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#a9b1d6');
    text.setAttribute('font-size', '12');
    text.textContent = dim;
    backgroundGrid.appendChild(text);
  });
  
  svg.appendChild(backgroundGrid);
  
  // 创建数据多边形
  const dataPoints = dimensions.map((dim, i) => {
    const value = data[dim] / 100; // 假设数据为0-100的百分比
    const angle = i * angleStep - Math.PI / 2;
    const distance = value * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    return `${x},${y}`;
  });
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', dataPoints.join(' '));
  polygon.setAttribute('fill', 'rgba(121, 87, 213, 0.3)');
  polygon.setAttribute('stroke', '#7957D5');
  polygon.setAttribute('stroke-width', '2');
  
  svg.appendChild(polygon);
  
  // 添加数据点
  dimensions.forEach((dim, i) => {
    const value = data[dim] / 100;
    const angle = i * angleStep - Math.PI / 2;
    const distance = value * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point.setAttribute('cx', x);
    point.setAttribute('cy', y);
    point.setAttribute('r', '4');
    point.setAttribute('fill', '#7957D5');
    point.setAttribute('stroke', '#0d1117');
    point.setAttribute('stroke-width', '1');
    
    // 添加提示数据
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${dim}: ${data[dim]}%`;
    point.appendChild(title);
    
    svg.appendChild(point);
  });
  
  container.appendChild(svg);
}

/**
 * 创建树状图 - 项目代码行数比例
 * @param {string} containerId - 容器ID
 * @param {Array} data - 项目数据数组
 */
function createTreemap(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 容器尺寸
  const width = container.clientWidth;
  const height = 300;
  
  // 计算数据总和用于比例计算
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // 对数据排序，使较大的项目显示在前面
  data.sort((a, b) => b.value - a.value);
  
  // 创建容器
  const treemapEl = document.createElement('div');
  treemapEl.className = 'treemap-container';
  treemapEl.style.width = '100%';
  treemapEl.style.height = '100%';
  treemapEl.style.display = 'flex';
  treemapEl.style.flexWrap = 'wrap';
  
  // 颜色数组
  const colors = ['#7957D5', '#c792ea', '#7fdbca', '#ff6e96', '#F37626', '#E91E63', '#00ACC1'];
  
  // 创建项目方块
  data.forEach((item, index) => {
    const percentage = item.value / total;
    const cellWidth = Math.sqrt(percentage) * 100; // 简化的树状图布局
    
    const cell = document.createElement('div');
    cell.className = 'treemap-cell';
    cell.style.width = `${cellWidth}%`;
    cell.style.padding = '10px';
    cell.style.boxSizing = 'border-box';
    cell.style.backgroundColor = colors[index % colors.length];
    cell.style.color = 'white';
    cell.style.overflow = 'hidden';
    cell.style.position = 'relative';
    cell.style.opacity = '0.8';
    cell.style.transition = 'transform 0.3s, opacity 0.3s';
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.justifyContent = 'center';
    
    const nameEl = document.createElement('div');
    nameEl.textContent = item.name;
    nameEl.style.fontWeight = 'bold';
    nameEl.style.fontSize = '14px';
    nameEl.style.marginBottom = '5px';
    cell.appendChild(nameEl);
    
    const valueEl = document.createElement('div');
    valueEl.textContent = formatNumber(item.value) + ' 行代码';
    valueEl.style.fontSize = '12px';
    cell.appendChild(valueEl);
    
    // 悬停效果
    cell.addEventListener('mouseover', () => {
      cell.style.opacity = '1';
      cell.style.transform = 'scale(0.98)';
    });
    
    cell.addEventListener('mouseout', () => {
      cell.style.opacity = '0.8';
      cell.style.transform = 'scale(1)';
    });
    
    treemapEl.appendChild(cell);
  });
  
  container.appendChild(treemapEl);
}

/**
 * 创建堆叠面积图 - 技术栈随时间演变
 * @param {string} containerId - 容器ID
 * @param {object} data - 数据对象
 */
function createStackedAreaChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 从数据中提取时间点和技术类别
  const timePoints = data.timePoints;
  const categories = Object.keys(data.values);
  
  // 创建SVG
  const width = container.clientWidth;
  const height = 300;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  
  // 计算绘图区域尺寸
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  
  // 创建横坐标轴
  const xScale = plotWidth / (timePoints.length - 1);
  
  // 创建网格和坐标轴
  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  grid.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
  
  // 创建水平网格线
  for (let i = 0; i <= 10; i++) {
    const y = plotHeight - (i / 10) * plotHeight;
    
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', 0);
    gridLine.setAttribute('y1', y);
    gridLine.setAttribute('x2', plotWidth);
    gridLine.setAttribute('y2', y);
    gridLine.setAttribute('stroke', '#30363d');
    gridLine.setAttribute('stroke-width', '1');
    
    grid.appendChild(gridLine);
    
    // 添加y轴标签
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', -10);
    label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('alignment-baseline', 'middle');
    label.setAttribute('fill', '#a9b1d6');
    label.setAttribute('font-size', '12');
    label.textContent = `${i * 10}%`;
    
    grid.appendChild(label);
  }
  
  // 添加x轴标签
  timePoints.forEach((time, i) => {
    const x = i * xScale;
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', plotHeight + 20);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#a9b1d6');
    label.setAttribute('font-size', '12');
    label.textContent = time;
    
    grid.appendChild(label);
  });
  
  svg.appendChild(grid);
  
  // 颜色映射
  const colors = {
    'Web': '#7957D5',
    'Mobile': '#ff6e96',
    'AI/ML': '#7fdbca',
    'DevOps': '#F37626',
    'Backend': '#c792ea'
  };
  
  // 创建堆叠面积
  const areas = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  areas.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
  
  // 计算堆叠值
  const stackedValues = [];
  
  for (let i = 0; i < timePoints.length; i++) {
    let sum = 0;
    const pointData = {};
    
    categories.forEach(cat => {
      const value = data.values[cat][i];
      pointData[cat] = { start: sum, end: sum + value };
      sum += value;
    });
    
    stackedValues.push(pointData);
  }
  
  // 每个类别创建一个路径
  categories.forEach(cat => {
    const points = [];
    
    // 绘制区域上边缘
    for (let i = 0; i < timePoints.length; i++) {
      const x = i * xScale;
      const y = plotHeight - (stackedValues[i][cat].end / 100) * plotHeight;
      points.push(`${x},${y}`);
    }
    
    // 绘制区域下边缘 (反向)
    for (let i = timePoints.length - 1; i >= 0; i--) {
      const x = i * xScale;
      const y = plotHeight - (stackedValues[i][cat].start / 100) * plotHeight;
      points.push(`${x},${y}`);
    }
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    path.setAttribute('points', points.join(' '));
    path.setAttribute('fill', colors[cat] || '#7957D5');
    path.setAttribute('fill-opacity', '0.7');
    path.setAttribute('stroke', colors[cat] || '#7957D5');
    path.setAttribute('stroke-width', '1');
    
    areas.appendChild(path);
  });
  
  svg.appendChild(areas);
  
  // 添加图例
  const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  legend.setAttribute('transform', `translate(${padding.left}, ${height - 10})`);
  
  categories.forEach((cat, i) => {
    const x = i * (plotWidth / categories.length) + 10;
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', 0);
    rect.setAttribute('width', 10);
    rect.setAttribute('height', 10);
    rect.setAttribute('fill', colors[cat] || '#7957D5');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + 15);
    text.setAttribute('y', 9);
    text.setAttribute('fill', '#a9b1d6');
    text.setAttribute('font-size', '10');
    text.textContent = cat;
    
    legend.appendChild(rect);
    legend.appendChild(text);
  });
  
  svg.appendChild(legend);
  
  container.appendChild(svg);
}

/**
 * 创建水平条形图 - 每周编码时间比较
 * @param {string} containerId - 容器ID 
 * @param {Array} data - 周数据数组
 */
function createWeeklyBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 计算最大值用于比例
  const maxValue = Math.max(...data.map(d => d.hours));
  
  // 创建图表容器
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.padding = '10px 0';
  
  // 为每一周创建横向条形图
  data.forEach(week => {
    const weekRow = document.createElement('div');
    weekRow.style.display = 'flex';
    weekRow.style.alignItems = 'center';
    weekRow.style.margin = '5px 0';
    weekRow.style.padding = '5px 0';
    weekRow.style.borderBottom = '1px solid #30363d';
    
    // 周标签
    const label = document.createElement('div');
    label.textContent = week.week;
    label.style.width = '80px';
    label.style.color = '#a9b1d6';
    label.style.fontSize = '14px';
    weekRow.appendChild(label);
    
    // 条形图容器
    const barContainer = document.createElement('div');
    barContainer.style.flex = '1';
    barContainer.style.position = 'relative';
    barContainer.style.height = '25px';
    
    // 背景条
    const bgBar = document.createElement('div');
    bgBar.style.position = 'absolute';
    bgBar.style.left = '0';
    bgBar.style.top = '0';
    bgBar.style.width = '100%';
    bgBar.style.height = '100%';
    bgBar.style.backgroundColor = '#2D333B';
    bgBar.style.borderRadius = '4px';
    barContainer.appendChild(bgBar);
    
    // 数据条
    const dataBar = document.createElement('div');
    dataBar.style.position = 'absolute';
    dataBar.style.left = '0';
    dataBar.style.top = '0';
    dataBar.style.width = `${(week.hours / maxValue) * 100}%`;
    dataBar.style.height = '100%';
    dataBar.style.backgroundColor = week.isCurrentWeek ? '#7957D5' : '#7fdbca';
    dataBar.style.borderRadius = '4px';
    dataBar.style.transition = 'width 1s ease-out';
    barContainer.appendChild(dataBar);
    
    // 时间标签
    const timeLabel = document.createElement('div');
    timeLabel.textContent = `${week.hours} 小时`;
    timeLabel.style.position = 'absolute';
    timeLabel.style.right = '10px';
    timeLabel.style.top = '50%';
    timeLabel.style.transform = 'translateY(-50%)';
    timeLabel.style.color = 'white';
    timeLabel.style.fontSize = '12px';
    timeLabel.style.fontWeight = 'bold';
    barContainer.appendChild(timeLabel);
    
    weekRow.appendChild(barContainer);
    chartContainer.appendChild(weekRow);
  });
  
  container.appendChild(chartContainer);
}

/**
 * 创建漏斗图 - 编程工作流程
 * @param {string} containerId - 容器ID
 * @param {Array} data - 工作流步骤数据
 */
function createFunnelChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 创建漏斗容器
  const funnelContainer = document.createElement('div');
  funnelContainer.className = 'funnel-chart';
  funnelContainer.style.width = '80%';
  funnelContainer.style.maxWidth = '400px';
  funnelContainer.style.margin = '0 auto';
  
  // 颜色数组
  const colors = ['#7957D5', '#9979EA', '#B89EEF', '#c792ea', '#ff6e96'];

  // 创建每一步骤
  data.forEach((step, index) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'funnel-step';
    
    // 宽度基于百分比值
    stepEl.style.width = `${step.percentage}%`;
    stepEl.style.backgroundColor = colors[index % colors.length];
    stepEl.style.height = '50px';
    stepEl.style.margin = index === 0 ? '0 auto' : '-1px auto';
    stepEl.style.display = 'flex';
    stepEl.style.alignItems = 'center';
    stepEl.style.justifyContent = 'center';
    stepEl.style.color = 'white';
    stepEl.style.position = 'relative';
    stepEl.style.zIndex = data.length - index;
    
    // 应用漏斗形状
    if (index === 0) {
      stepEl.style.clipPath = 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)';
    } else if (index === data.length - 1) {
      stepEl.style.clipPath = 'polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)';
    } else {
      const topPercent = data[index - 1].percentage;
      const widthDiff = (topPercent - step.percentage) / 2;
      stepEl.style.clipPath = `polygon(${widthDiff}% 0%, ${100 - widthDiff}% 0%, ${100 - widthDiff - 5}% 100%, ${widthDiff + 5}% 100%)`;
    }
    
    // 添加文本内容
    const text = document.createElement('div');
    text.style.zIndex = '2';
    text.style.padding = '0 10px';
    text.style.textAlign = 'center';
    
    const title = document.createElement('div');
    title.textContent = step.name;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '14px';
    
    const value = document.createElement('div');
    value.textContent = `${step.percentage}%`;
    value.style.fontSize = '12px';
    
    text.appendChild(title);
    text.appendChild(value);
    stepEl.appendChild(text);
    
    funnelContainer.appendChild(stepEl);
  });
  
  container.appendChild(funnelContainer);
}

/**
 * 创建时间线图表 - 编程历程里程碑
 * @param {string} containerId - 容器ID
 * @param {Array} data - 时间线数据
 */
function createTimeline(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 创建时间线容器
  const timeline = document.createElement('div');
  timeline.className = 'timeline-chart';
  timeline.style.width = '100%';
  timeline.style.margin = '20px 0';
  timeline.style.position = 'relative';
  
  // 时间线背景线
  const timelineBar = document.createElement('div');
  timelineBar.style.position = 'absolute';
  timelineBar.style.top = '0';
  timelineBar.style.left = '50%';
  timelineBar.style.width = '2px';
  timelineBar.style.height = '100%';
  timelineBar.style.backgroundColor = '#30363d';
  timelineBar.style.transform = 'translateX(-50%)';
  timeline.appendChild(timelineBar);
  
  // 添加事件
  data.forEach((event, index) => {
    const isLeft = index % 2 === 0;
    
    // 事件容器
    const eventEl = document.createElement('div');
    eventEl.className = 'timeline-event';
    eventEl.style.position = 'relative';
    eventEl.style.width = '100%';
    eventEl.style.minHeight = '100px';
    eventEl.style.margin = '20px 0';
    
    // 事件点
    const eventDot = document.createElement('div');
    eventDot.style.position = 'absolute';
    eventDot.style.left = '50%';
    eventDot.style.top = '0';
    eventDot.style.width = '20px';
    eventDot.style.height = '20px';
    eventDot.style.backgroundColor = '#7957D5';
    eventDot.style.borderRadius = '50%';
    eventDot.style.transform = 'translate(-50%, -50%)';
    eventDot.style.zIndex = '2';
    eventDot.style.border = '3px solid #0d1117';
    eventEl.appendChild(eventDot);
    
    // 事件内容盒子
    const content = document.createElement('div');
    content.style.position = 'absolute';
    content.style.width = 'calc(50% - 30px)';
    content.style.padding = '15px';
    content.style.backgroundColor = '#161b22';
    content.style.borderRadius = '5px';
    content.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    content.style.border = '1px solid #30363d';
    
    if (isLeft) {
      content.style.left = '0';
    } else {
      content.style.right = '0';
    }
    
    // 添加连接线
    const connector = document.createElement('div');
    connector.style.position = 'absolute';
    connector.style.top = '0';
    connector.style.height = '2px';
    connector.style.backgroundColor = '#7957D5';
    
    if (isLeft) {
      connector.style.left = 'calc(50% - 10px)';
      connector.style.right = 'calc(50% - 30px)';
    } else {
      connector.style.left = 'calc(50% + 10px)';
      connector.style.right = 'calc(50% - 10px)';
    }
    
    eventEl.appendChild(connector);
    
    // 添加日期标签
    const dateLabel = document.createElement('div');
    dateLabel.textContent = event.date;
    dateLabel.style.fontWeight = 'bold';
    dateLabel.style.color = '#7fdbca';
    dateLabel.style.marginBottom = '5px';
    content.appendChild(dateLabel);
    
    // 添加标题
    const title = document.createElement('div');
    title.textContent = event.title;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '16px';
    title.style.color = '#c792ea';
    title.style.marginBottom = '10px';
    content.appendChild(title);
    
    // 添加描述
    const description = document.createElement('div');
    description.textContent = event.description;
    description.style.color = '#a9b1d6';
    description.style.fontSize = '14px';
    content.appendChild(description);
    
    eventEl.appendChild(content);
    timeline.appendChild(eventEl);
  });
  
  container.appendChild(timeline);
}

/**
 * 创建环形图 - 项目类型分布
 * @param {string} containerId - 容器ID
 * @param {Array} data - 数据数组
 */
function createDonutChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 计算总值
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // 创建SVG
  const size = Math.min(container.clientWidth, 300);
  const radius = size / 2;
  const donutWidth = radius * 0.5; // 环形宽度
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  
  // 创建环形图组
  const donutGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  donutGroup.setAttribute('transform', `translate(${radius}, ${radius})`);
  
  // 颜色数组
  const colors = ['#7957D5', '#c792ea', '#7fdbca', '#ff6e96', '#F37626'];
  
  // 计算并创建弧形
  let startAngle = 0;
  
  data.forEach((item, i) => {
    const percentage = item.value / total;
    const endAngle = startAngle + percentage * 2 * Math.PI;
    
    // 计算SVG路径
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    
    const outerX1 = radius * Math.cos(startAngle);
    const outerY1 = radius * Math.sin(startAngle);
    
    const outerX2 = radius * Math.cos(endAngle);
    const outerY2 = radius * Math.sin(endAngle);
    
    const innerRadius = radius - donutWidth;
    
    const innerX1 = innerRadius * Math.cos(endAngle);
    const innerY1 = innerRadius * Math.sin(endAngle);
    
    const innerX2 = innerRadius * Math.cos(startAngle);
    const innerY2 = innerRadius * Math.sin(startAngle);
    
    const d = [
      `M ${outerX1} ${outerY1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}`,
      `L ${innerX1} ${innerY1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX2} ${innerY2}`,
      'Z'
    ].join(' ');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', colors[i % colors.length]);
    
    // 添加悬停效果
    path.setAttribute('stroke', '#0d1117');
    path.setAttribute('stroke-width', '1');
    path.style.transition = 'transform 0.3s';
    
    path.addEventListener('mouseover', () => {
      path.style.transform = 'scale(1.03)';
      path.setAttribute('stroke-width', '2');
      
      // 更新中心文本
      const centerText = document.getElementById(`${containerId}-center-text`);
      const centerValue = document.getElementById(`${containerId}-center-value`);
      if (centerText && centerValue) {
        centerText.textContent = item.name;
        centerValue.textContent = `${Math.round(percentage * 100)}%`;
      }
    });
    
    path.addEventListener('mouseout', () => {
      path.style.transform = 'scale(1)';
      path.setAttribute('stroke-width', '1');
      
      // 复原中心文本
      const centerText = document.getElementById(`${containerId}-center-text`);
      const centerValue = document.getElementById(`${containerId}-center-value`);
      if (centerText && centerValue) {
        centerText.textContent = 'Project Types';
        centerValue.textContent = '100%';
      }
    });
    
    donutGroup.appendChild(path);
    
    // 更新开始角度
    startAngle = endAngle;
  });
  
  svg.appendChild(donutGroup);
  
  // 添加中心圆
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', radius);
  centerCircle.setAttribute('cy', radius);
  centerCircle.setAttribute('r', radius - donutWidth - 5);
  centerCircle.setAttribute('fill', '#0d1117');
  svg.appendChild(centerCircle);
  
  // 添加中心文本
  const centerTextEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centerTextEl.setAttribute('id', `${containerId}-center-text`);
  centerTextEl.setAttribute('x', radius);
  centerTextEl.setAttribute('y', radius - 10);
  centerTextEl.setAttribute('text-anchor', 'middle');
  centerTextEl.setAttribute('fill', '#a9b1d6');
  centerTextEl.setAttribute('font-size', '14');
  centerTextEl.textContent = 'Project Types';
  svg.appendChild(centerTextEl);
  
  const centerValueEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centerValueEl.setAttribute('id', `${containerId}-center-value`);
  centerValueEl.setAttribute('x', radius);
  centerValueEl.setAttribute('y', radius + 15);
  centerValueEl.setAttribute('text-anchor', 'middle');
  centerValueEl.setAttribute('fill', '#c792ea');
  centerValueEl.setAttribute('font-size', '18');
  centerValueEl.setAttribute('font-weight', 'bold');
  centerValueEl.textContent = '100%';
  svg.appendChild(centerValueEl);
  
  // 添加图例
  const legend = document.createElement('div');
  legend.style.display = 'flex';
  legend.style.flexWrap = 'wrap';
  legend.style.justifyContent = 'center';
  legend.style.marginTop = '20px';
  
  data.forEach((item, i) => {
    const legendItem = document.createElement('div');
    legendItem.style.display = 'flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.margin = '0 10px 10px 0';
    
    const colorBox = document.createElement('div');
    colorBox.style.width = '12px';
    colorBox.style.height = '12px';
    colorBox.style.backgroundColor = colors[i % colors.length];
    colorBox.style.marginRight = '5px';
    legendItem.appendChild(colorBox);
    
    const label = document.createElement('span');
    label.textContent = `${item.name}: ${item.value}`;
    label.style.color = '#a9b1d6';
    label.style.fontSize = '12px';
    legendItem.appendChild(label);
    
    legend.appendChild(legendItem);
  });
  
  container.appendChild(svg);
  container.appendChild(legend);
}

/**
 * 数字格式化辅助函数
 * @param {number} num - 需要格式化的数字
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * 创建时钟形代码活动图
 * @param {string} containerId - 容器ID
 * @param {Array} data - 24小时数据数组
 */
function createCodeActivityClock(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // 创建SVG
  const size = Math.min(container.clientWidth, 400);
  const radius = size / 2 - 20;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  
  // 创建时钟背景
  const clockGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  clockGroup.setAttribute('transform', `translate(${size/2}, ${size/2})`);
  
  // 创建背景圆
  const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  backgroundCircle.setAttribute('r', radius);
  backgroundCircle.setAttribute('fill', '#161b22');
  backgroundCircle.setAttribute('stroke', '#30363d');
  backgroundCircle.setAttribute('stroke-width', '2');
  clockGroup.appendChild(backgroundCircle);
  
  // 创建时刻刻度
  for (let hour = 0; hour < 24; hour++) {
    const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // 刻度线
    const tickLength = hour % 6 === 0 ? 10 : 5;
    const tickInnerRadius = radius - tickLength;
    
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', Math.cos(angle) * tickInnerRadius);
    tick.setAttribute('y1', Math.sin(angle) * tickInnerRadius);
    tick.setAttribute('x2', x);
    tick.setAttribute('y2', y);
    tick.setAttribute('stroke', '#7fdbca');
    tick.setAttribute('stroke-width', hour % 6 === 0 ? '2' : '1');
    clockGroup.appendChild(tick);
    
    // 时间标签
    if (hour % 6 === 0) {
      const labelRadius = radius - 25;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('fill', '#a9b1d6');
      text.setAttribute('font-size', '12');
      text.textContent = `${hour}:00`;
      clockGroup.appendChild(text);
    }
  }
  
  // 找出最大活动值
  const maxValue = Math.max(...data);
  
  // 创建活动区域
  const activityArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  // 计算活动路径
  const pathPoints = [];
  
  data.forEach((value, hour) => {
    const percentage = value / maxValue;
    const distance = percentage * (radius * 0.8);
    const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    if (hour === 0) {
      pathPoints.push(`M ${x} ${y}`);
    } else {
      pathPoints.push(`L ${x} ${y}`);
    }
  });
  
  // 闭合路径
  pathPoints.push('Z');
  
  activityArea.setAttribute('d', pathPoints.join(' '));
  activityArea.setAttribute('fill', 'rgba(121, 87, 213, 0.5)');
  activityArea.setAttribute('stroke', '#7957D5');
  activityArea.setAttribute('stroke-width', '2');
  clockGroup.appendChild(activityArea);
  
  // 添加活动点
  data.forEach((value, hour) => {
    const percentage = value / maxValue;
    const distance = percentage * (radius * 0.8);
    const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2;
    
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point.setAttribute('cx', x);
    point.setAttribute('cy', y);
    point.setAttribute('r', '3');
    point.setAttribute('fill', '#ff6e96');
    
    // 添加提示文本
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${hour}:00 - ${hour}:59: ${value}%`;
    point.appendChild(title);
    
    clockGroup.appendChild(point);
  });
  
  svg.appendChild(clockGroup);
  container.appendChild(svg);
  
  // 添加图例
  const legend = document.createElement('div');
  legend.style.textAlign = 'center';
  legend.style.marginTop = '10px';
  legend.style.color = '#a9b1d6';
  legend.innerHTML = '<span style="color: #c792ea; font-weight: bold;">24小时</span> 编码活动分布';
  
  container.appendChild(legend);
}

// 导出所有图表函数
return {
  createRadarChart,
  createTreemap,
  createStackedAreaChart,
  createWeeklyBarChart,
  createFunnelChart,
  createTimeline,
  createDonutChart,
  createCodeActivityClock
};