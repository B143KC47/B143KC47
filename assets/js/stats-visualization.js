document.addEventListener('DOMContentLoaded', function() {
  // 初始化各种可视化图表
  initializeVisualizations();
  
  // 动画效果
  animateStatsOnScroll();
});

/**
 * 初始化所有数据可视化
 */
function initializeVisualizations() {
  // 1. 初始化进度条动画
  initProgressBars();
  
  // 2. 初始化环形进度条
  initGoalRing();
  
  // 3. 加载交互式提交热力图
  loadCommitHeatmap();
  
  // 4. 语言使用变化趋势
  loadLanguageTrends();
  
  // 5. 项目活跃度气泡图
  createProjectBubbleChart();
  
  // 6. 编码时间分布图表
  createCodingTimeDistribution();
}

/**
 * 初始化进度条动画
 */
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-width') + '%';
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });
}

/**
 * 初始化环形目标进度
 */
function initGoalRing() {
  const goalRing = document.querySelector('.goal-ring');
  if (!goalRing) return;
  
  const percentage = parseInt(goalRing.getAttribute('data-percent') || 0);
  
  goalRing.style.background = `conic-gradient(
    #7957D5 ${percentage}%,
    #2D333B ${percentage}%
  )`;
  
  // 添加动画效果
  const percentDisplay = document.querySelector('.goal-inner span');
  if (percentDisplay) {
    let currentPercent = 0;
    const interval = setInterval(() => {
      if (currentPercent >= percentage) {
        clearInterval(interval);
      } else {
        currentPercent++;
        percentDisplay.textContent = `${currentPercent}%`;
      }
    }, 20);
  }
}

/**
 * 加载交互式提交热力图
 */
function loadCommitHeatmap() {
  const heatmapContainer = document.querySelector('.github-heatmap');
  if (!heatmapContainer) return;
  
  // 模拟GitHub贡献热力图数据
  // 实际实现需要通过GitHub API获取贡献数据
  const mockData = generateMockCommitData();
  
  // 创建热力图
  createHeatmap(heatmapContainer, mockData);
}

/**
 * 生成模拟提交数据
 */
function generateMockCommitData() {
  const data = [];
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const commitCount = Math.floor(Math.random() * 10); // 随机0-9次提交
    data.push({
      date: new Date(d),
      count: commitCount
    });
  }
  
  return data;
}

/**
 * 创建热力图
 */
function createHeatmap(container, data) {
  // 清空容器
  container.innerHTML = '';
  
  // 创建网格
  const weeks = Math.ceil(data.length / 7);
  
  for (let w = 0; w < weeks; w++) {
    const week = document.createElement('div');
    week.className = 'heatmap-week';
    week.style.display = 'inline-block';
    
    for (let d = 0; d < 7; d++) {
      const index = w * 7 + d;
      if (index < data.length) {
        const item = data[index];
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        // 根据提交次数设置颜色深浅
        const intensity = item.count > 0 ? Math.min(item.count / 10 * 0.8 + 0.2, 1) : 0;
        cell.style.backgroundColor = item.count > 0 
          ? `rgba(121, 87, 213, ${intensity})` 
          : '#2D333B';
        
        // 添加提示信息
        cell.title = `${item.date.toLocaleDateString()}: ${item.count}次提交`;
        
        week.appendChild(cell);
      }
    }
    
    container.appendChild(week);
  }
}

/**
 * 加载语言使用趋势
 */
function loadLanguageTrends() {
  const trendContainer = document.querySelector('.language-trends');
  if (!trendContainer) return;
  
  // 模拟数据 - 不同月份的语言使用百分比
  const trendData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    languages: {
      'Python': [45, 48, 50, 47, 52, 55],
      'JavaScript': [25, 23, 20, 22, 18, 15],
      'TypeScript': [10, 12, 15, 18, 20, 22],
      'C++': [15, 12, 10, 8, 5, 3],
      'Rust': [5, 5, 5, 5, 5, 5]
    }
  };
  
  // 创建趋势图
  createTrendChart(trendContainer, trendData);
}

/**
 * 创建语言趋势图表
 */
function createTrendChart(container, data) {
  // 实际实现可以使用Chart.js或D3.js等库
  // 这里仅创建简化版HTML结构
  
  const chart = document.createElement('div');
  chart.className = 'trend-chart';
  
  let legend = '<div class="trend-legend" style="margin-