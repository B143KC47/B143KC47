/**
 * GitHub统计数据可视化配置
 * 负责初始化各种图表的数据
 */

document.addEventListener('DOMContentLoaded', function() {
  // 导入图表组件库
  const ChartComponents = initializeChartComponents();
  
  // 加载各种图表数据
  initializeAllCharts(ChartComponents);
});

/**
 * 初始化所有图表
 * @param {Object} ChartComponents - 图表组件库
 */
function initializeAllCharts(ChartComponents) {
  if (!ChartComponents) return;
  
  // 1. 初始化编程技能雷达图
  initializeProgrammingSkills(ChartComponents);
  
  // 2. 初始化项目代码量树状图
  initializeCodeTreemap(ChartComponents);
  
  // 3. 初始化技术栈演变图
  initializeTechStackEvolution(ChartComponents);
  
  // 4. 初始化周编码时间图表
  initializeWeeklyCodingTime(ChartComponents);
  
  // 5. 初始化编程工作流漏斗图
  initializeCodingWorkflow(ChartComponents);
  
  // 6. 初始化编程里程碑时间线
  initializeCodingMilestones(ChartComponents);
  
  // 7. 初始化项目类型环形图
  initializeProjectTypes(ChartComponents);
  
  // 8. 初始化每日编码活动时钟图
  initializeCodingActivityClock(ChartComponents);
}

/**
 * 初始化编程技能雷达图
 */
function initializeProgrammingSkills(ChartComponents) {
  // 创建容器元素
  createChartContainer('programming-skills', '🔬 技能雷达图');
  
  // 技能数据
  const skillsData = {
    'Python': 90,
    'JavaScript': 80,
    'AI/ML': 85,
    'DevOps': 65,
    'Backend': 75,
    'Frontend': 60,
  };
  
  // 渲染雷达图
  ChartComponents.createRadarChart('programming-skills', skillsData);
}

/**
 * 初始化项目代码量树状图
 */
function initializeCodeTreemap(ChartComponents) {
  // 创建容器元素
  createChartContainer('code-treemap', '📊 项目代码量分布');
  
  // 项目代码量数据
  const projectData = [
    { name: 'VLM_Vision_Helper', value: 12500 },
    { name: 'CityU_GenAi_AIcademy', value: 8200 },
    { name: 'ML_Experiments', value: 6300 },
    { name: 'AI_Research', value: 4800 },
    { name: 'Utils', value: 2100 },
    { name: 'Documentation', value: 1500 }
  ];
  
  // 渲染树状图
  ChartComponents.createTreemap('code-treemap', projectData);
}

/**
 * 初始化技术栈演变图
 */
function initializeTechStackEvolution(ChartComponents) {
  // 创建容器元素
  createChartContainer('tech-stack-evolution', '📈 技术栈演变');
  
  // 技术栈演变数据
  const evolutionData = {
    timePoints: ['2019', '2020', '2021', '2022', '2023', '2024'],
    values: {
      'Web': [20, 15, 10, 15, 20, 25],
      'Mobile': [10, 10, 5, 5, 5, 0],
      'AI/ML': [40, 45, 55, 60, 55, 50],
      'DevOps': [20, 20, 15, 10, 10, 15],
      'Backend': [10, 10, 15, 10, 10, 10]
    }
  };
  
  // 渲染堆叠面积图
  ChartComponents.createStackedAreaChart('tech-stack-evolution', evolutionData);
}

/**
 * 初始化周编码时间图表
 */
function initializeWeeklyCodingTime(ChartComponents) {
  // 创建容器元素
  createChartContainer('weekly-coding-time', '⏱️ 每周编码时间');
  
  // 周编码时间数据
  const weeklyData = [
    { week: '本周', hours: 28, isCurrentWeek: true },
    { week: '上周', hours: 32, isCurrentWeek: false },
    { week: '两周前', hours: 25, isCurrentWeek: false },
    { week: '三周前', hours: 35, isCurrentWeek: false },
    { week: '四周前', hours: 18, isCurrentWeek: false }
  ];
  
  // 渲染横向条形图
  ChartComponents.createWeeklyBarChart('weekly-coding-time', weeklyData);
}

/**
 * 初始化编程工作流漏斗图
 */
function initializeCodingWorkflow(ChartComponents) {
  // 创建容器元素
  createChartContainer('coding-workflow', '🔄 编程工作流');
  
  // 工作流程数据
  const workflowData = [
    { name: '规划 & 设计', percentage: 100 },
    { name: '开发 & 编码', percentage: 85 },
    { name: '测试 & 调试', percentage: 70 },
    { name: '重构 & 优化', percentage: 55 },
    { name: '部署 & 发布', percentage: 40 }
  ];
  
  // 渲染漏斗图
  ChartComponents.createFunnelChart('coding-workflow', workflowData);
}

/**
 * 初始化编程里程碑时间线
 */
function initializeCodingMilestones(ChartComponents) {
  // 创建容器元素
  createChartContainer('coding-milestones', '🏆 编程历程');
  
  // 里程碑数据
  const milestonesData = [
    {
      date: '2019年5月',
      title: '编程入门',
      description: '开始学习Python和基础编程概念，完成第一个自动化脚本'
    },
    {
      date: '2020年8月',
      title: '第一个ML项目',
      description: '完成第一个机器学习项目，使用scikit-learn进行图像分类'
    },
    {
      date: '2021年3月',
      title: 'AI研究深入',
      description: '深入学习深度学习框架，开始研究计算机视觉模型'
    },
    {
      date: '2022年6月',
      title: '开源贡献',
      description: '为多个开源NLP项目贡献代码，提交多个功能改进'
    },
    {
      date: '2023年10月',
      title: 'VLM项目',
      description: '开发视觉语言模型辅助工具，集成多模态AI功能'
    }
  ];
  
  // 渲染时间线
  ChartComponents.createTimeline('coding-milestones', milestonesData);
}

/**
 * 初始化项目类型环形图
 */
function initializeProjectTypes(ChartComponents) {
  // 创建容器元素
  createChartContainer('project-types', '🧩 项目类型分布');
  
  // 项目类型数据
  const projectTypesData = [
    { name: '研究项目', value: 45 },
    { name: 'AI应用', value: 30 },
    { name: '工具开发', value: 15 },
    { name: '文档', value: 10 }
  ];
  
  // 渲染环形图
  ChartComponents.createDonutChart('project-types', projectTypesData);
}

/**
 * 初始化每日编码活动时钟图
 */
function initializeCodingActivityClock(ChartComponents) {
  // 创建容器元素
  createChartContainer('coding-activity-clock', '🕒 全天编码活动分布');
  
  // 24小时活动数据 (0-23小时)
  const hourlyData = [
    5, 3, 2, 1, 0, 2, 
    8, 15, 25, 35, 40, 45, 
    40, 38, 35, 40, 50, 55, 
    60, 50, 40, 30, 20, 10
  ];
  
  // 渲染时钟形活动图
  ChartComponents.createCodeActivityClock('coding-activity-clock', hourlyData);
}

/**
 * 创建图表容器
 * @param {string} id - 容器ID
 * @param {string} title - 图表标题
 */
function createChartContainer(id, title) {
  // 检查是否已存在统计卡片区域
  let statsContainer = document.getElementById('stats-charts');
  if (!statsContainer) {
    // 如果不存在，创建一个新的容器区域
    statsContainer = document.createElement('div');
    statsContainer.id = 'stats-charts';
    statsContainer.className = 'stats-charts-container';
    statsContainer.style.marginTop = '30px';
    
    // 创建一个标题
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = '📊 编程统计图表';
    sectionTitle.style.textAlign = 'center';
    sectionTitle.style.color = '#c792ea';
    sectionTitle.style.marginBottom = '20px';
    
    // 添加标题到容器
    statsContainer.appendChild(sectionTitle);
    
    // 将容器添加到页面中适当的位置
    const codeStatsSection = document.querySelector('h3:contains("编程时间统计")') || 
                            document.querySelector('h2:contains("统计")');
    
    if (codeStatsSection) {
      codeStatsSection.parentNode.insertBefore(statsContainer, codeStatsSection.nextSibling);
    } else {
      // 如果找不到适当的位置，添加到页面底部
      document.body.appendChild(statsContainer);
    }
  }
  
  // 创建图表容器
  const chartContainer = document.createElement('div');
  chartContainer.id = id;
  chartContainer.className = 'stats-card';
  chartContainer.style.marginBottom = '30px';
  
  // 创建图表标题
  const chartTitle = document.createElement('h3');
  chartTitle.textContent = title;
  chartTitle.style.color = '#7fdbca';
  chartTitle.style.margin = '0 0 15px 0';
  chartTitle.style.textAlign = 'center';
  
  // 创建图表内容区域
  const chartContent = document.createElement('div');
  chartContent.className = 'chart-content';
  chartContent.style.minHeight = '250px';
  
  // 组装图表容器
  chartContainer.appendChild(chartTitle);
  chartContainer.appendChild(chartContent);
  
  // 添加到统计卡片区域
  statsContainer.appendChild(chartContainer);
  
  return chartContent;
}

/**
 * 初始化图表组件库
 * @returns {Object} 图表组件函数集合
 */
function initializeChartComponents() {
  try {
    // 尝试使用外部图表组件
    if (typeof window.createRadarChart === 'function') {
      return {
        createRadarChart: window.createRadarChart,
        createTreemap: window.createTreemap,
        createStackedAreaChart: window.createStackedAreaChart,
        createWeeklyBarChart: window.createWeeklyBarChart,
        createFunnelChart: window.createFunnelChart,
        createTimeline: window.createTimeline,
        createDonutChart: window.createDonutChart,
        createCodeActivityClock: window.createCodeActivityClock
      };
    } else if (typeof ChartComponents !== 'undefined') {
      // 如果有全局ChartComponents对象
      return ChartComponents;
    } else {
      // 如果找不到外部组件，则加载脚本
      loadChartComponentsScript();
      return null; // 异步加载，返回null
    }
  } catch (error) {
    console.error('初始化图表组件失败:', error);
    return null;
  }
}

/**
 * 加载图表组件脚本
 */
function loadChartComponentsScript() {
  const script = document.createElement('script');
  script.src = '/assets/js/chart-components.js';
  script.onload = function() {
    // 脚本加载完成后重新初始化
    const ChartComponents = initializeChartComponents();
    if (ChartComponents) {
      initializeAllCharts(ChartComponents);
    }
  };
  script.onerror = function() {
    console.error('加载图表组件脚本失败');
  };
  document.head.appendChild(script);
}

/**
 * 获取WakaTime统计数据
 * 注意：实际使用需要与WakaTime API集成或使用已有数据
 */
function getWakaTimeStats() {
  // 这里可以添加从API获取WakaTime数据的逻辑
  // 或者直接使用已有的数据
  return {
    totalCodeTime: 650, // 总编码时间(小时)
    languages: {
      'Python': 45,
      'JavaScript': 20,
      'TypeScript': 15,
      'C++': 10,
      'Markdown': 5,
      'Other': 5
    },
    dailyAverage: 3.5, // 日均编码时间(小时)
    mostActiveProject: 'VLM_Vision_Helper',
    mostActiveDay: '星期三'
  };
}

/**
 * 更新统计摘要信息
 * 在页面中创建或更新统计摘要卡片
 */
function updateStatsSummary() {
  const stats = getWakaTimeStats();
  
  // 创建摘要容器
  let summaryContainer = document.getElementById('stats-summary');
  if (!summaryContainer) {
    summaryContainer = document.createElement('div');
    summaryContainer.id = 'stats-summary';
    summaryContainer.className = 'stats-summary';
    summaryContainer.style.display = 'flex';
    summaryContainer.style.flexWrap = 'wrap';
    summaryContainer.style.justifyContent = 'space-between';
    summaryContainer.style.margin = '20px 0';
    
    // 将容器添加到页面中合适的位置
    const codingStats = document.querySelector('h2:contains("编程时间统计")');
    if (codingStats) {
      codingStats.parentNode.insertBefore(summaryContainer, codingStats.nextSibling);
    }
  }
  
  // 创建摘要卡片
  createSummaryCard(summaryContainer, '⏱️ 总编码时间', `${stats.totalCodeTime} 小时`, '#7957D5');
  createSummaryCard(summaryContainer, '📊 日均编码', `${stats.dailyAverage} 小时/天`, '#ff6e96');
  createSummaryCard(summaryContainer, '🔥 最活跃项目', stats.mostActiveProject, '#7fdbca');
  createSummaryCard(summaryContainer, '📅 最活跃日', stats.mostActiveDay, '#F37626');
}

/**
 * 创建统计摘要卡片
 * @param {HTMLElement} container - 父容器
 * @param {string} title - 卡片标题
 * @param {string} value - 卡片值
 * @param {string} color - 强调颜色
 */
function createSummaryCard(container, title, value, color) {
  const card = document.createElement('div');
  card.className = 'summary-card';
  card.style.backgroundColor = '#161b22';
  card.style.borderRadius = '8px';
  card.style.padding = '15px';
  card.style.margin = '10px 0';
  card.style.width = 'calc(25% - 15px)';
  card.style.boxSizing = 'border-box';
  card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  card.style.transition = 'transform 0.3s';
  card.style.minWidth = '200px';
  
  // 悬停效果
  card.addEventListener('mouseover', () => {
    card.style.transform = 'translateY(-5px)';
  });
  
  card.addEventListener('mouseout', () => {
    card.style.transform = 'translateY(0)';
  });
  
  // 卡片标题
  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  titleEl.style.color = '#a9b1d6';
  titleEl.style.fontSize = '14px';
  titleEl.style.marginBottom = '5px';
  
  // 卡片值
  const valueEl = document.createElement('div');
  valueEl.textContent = value;
  valueEl.style.color = color;
  valueEl.style.fontSize = '20px';
  valueEl.style.fontWeight = 'bold';
  
  // 组装卡片
  card.appendChild(titleEl);
  card.appendChild(valueEl);
  
  // 添加到容器
  container.appendChild(card);
}

// 在文档加载完成后更新统计摘要
document.addEventListener('DOMContentLoaded', function() {
  updateStatsSummary();
});