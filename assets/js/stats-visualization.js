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
  
  let legend = '<div class="trend-legend" style="margin-bottom: 10px; text-align: center;">';
  
  // 生成图例
  const colors = ['#7957D5', '#007ACC', '#F37626', '#DEA584', '#F34B7D'];
  let i = 0;
  for (const lang in data.languages) {
    legend += `<span style="display: inline-block; margin: 0 10px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: ${colors[i]}; margin-right: 5px;"></span>${lang}</span>`;
    i++;
  }
  legend += '</div>';
  
  // 创建图表区域
  let chartContent = `
    <div class="line-chart-container">
      <svg width="100%" height="300" viewBox="0 0 800 300">
        <g class="line-chart-grid">
          <!-- 水平网格线 -->
          ${Array(6).fill().map((_, i) => `<line x1="50" y1="${i * 50 + 50}" x2="750" y2="${i * 50 + 50}" stroke="#30363d" stroke-width="1" />`).join('')}
          
          <!-- 垂直网格线 -->
          ${Array(data.months.length).fill().map((_, i) => `<line x1="${i * (700/(data.months.length-1)) + 50}" y1="50" x2="${i * (700/(data.months.length-1)) + 50}" y2="250" stroke="#30363d" stroke-width="1" />`).join('')}
          
          <!-- x轴标签 -->
          ${data.months.map((month, i) => `<text x="${i * (700/(data.months.length-1)) + 50}" y="280" text-anchor="middle" font-size="12" fill="#a9b1d6">${month}</text>`).join('')}
          
          <!-- y轴标签 -->
          ${Array(6).fill().map((_, i) => `<text x="40" y="${250 - i * 50 + 5}" text-anchor="end" font-size="12" fill="#a9b1d6">${i * 20}%</text>`).join('')}
        </g>
        
        <!-- 折线 -->
  `;
  
  // 为每种语言绘制折线
  i = 0;
  for (const lang in data.languages) {
    const points = data.languages[lang];
    const pointsArray = points.map((p, idx) => {
      const x = idx * (700/(data.months.length-1)) + 50;
      const y = 250 - p * 2; // 将百分比值转换为坐标
      return `${x},${y}`;
    });
    
    chartContent += `
      <polyline 
        points="${pointsArray.join(' ')}" 
        fill="none" 
        stroke="${colors[i]}" 
        stroke-width="2" 
      />
      
      <!-- 折线上的点 -->
      ${points.map((p, idx) => {
        const x = idx * (700/(data.months.length-1)) + 50;
        const y = 250 - p * 2;
        return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[i]}" stroke="#0d1117" stroke-width="1" />`;
      }).join('')}
    `;
    i++;
  }
  
  chartContent += `
      </svg>
    </div>
  `;
  
  chart.innerHTML = legend + chartContent;
  container.appendChild(chart);
}

/**
 * 创建项目活跃度气泡图
 */
function createProjectBubbleChart() {
  const container = document.querySelector('.project-bubbles');
  if (!container) return;
  
  // 模拟项目数据
  const projects = [
    { name: 'VLM_Vision_Helper', commits: 250, loc: 15000, contributors: 3 },
    { name: 'CityU_GenAi_AIcademy', commits: 180, loc: 8000, contributors: 5 },
    { name: 'AI_Research', commits: 120, loc: 5000, contributors: 2 },
    { name: 'ML_Experiments', commits: 80, loc: 3000, contributors: 1 },
    { name: 'Utils', commits: 50, loc: 2000, contributors: 2 }
  ];
  
  const bubbleChart = document.createElement('div');
  bubbleChart.className = 'bubble-chart';
  
  // 创建气泡
  projects.forEach((project, index) => {
    const size = Math.max(30, Math.min(100, project.commits / 3)); // 气泡大小基于提交数
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // 根据索引计算位置，实际应用中可以使用更复杂的布局算法
    const x = 20 + (index * 150) % (container.offsetWidth - 100);
    const y = 50 + Math.floor(index / 3) * 150;
    
    // 设置随机颜色，但保持在主题色范围内
    const colors = ['#7957D5', '#c792ea', '#7fdbca', '#ff6e96', '#F37626'];
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.style.backgroundColor = colors[index % colors.length];
    
    // 添加提示内容
    bubble.setAttribute('title', `${project.name}\n提交: ${project.commits}\n代码行数: ${project.loc}\n贡献者: ${project.contributors}`);
    
    // 添加文本
    bubble.innerHTML = `<span style="font-size: ${Math.max(10, size / 6)}px;">${project.name}</span>`;
    
    bubbleChart.appendChild(bubble);
  });
  
  container.appendChild(bubbleChart);
}

/**
 * 创建编码时间分布图
 */
function createCodingTimeDistribution() {
  const container = document.querySelector('.coding-time-distribution');
  if (!container) return;
  
  // 模拟一天24小时编码分布数据
  const hourlyData = [
    1, 0, 0, 0, 1, 2, 5, 8, 12, 15, 18, 20,  // 0-11点
    18, 22, 25, 23, 20, 18, 25, 30, 28, 15, 8, 3  // 12-23点
  ];
  
  const hours = Array.from({length: 24}, (_, i) => i);
  
  const chartContainer = document.createElement('div');
  chartContainer.className = 'coding-time-chart';
  
  // 创建标题
  const chartTitle = document.createElement('h4');
  chartTitle.textContent = '24小时编码活动分布';
  chartTitle.style.textAlign = 'center';
  chartTitle.style.color = '#c792ea';
  
  // 创建图表
  const chart = document.createElement('div');
  chart.className = 'grouped-bar-chart';
  chart.style.height = '200px';
  
  // 找出最大值用于比例计算
  const maxValue = Math.max(...hourlyData);
  
  // 创建柱状图
  hours.forEach((hour, index) => {
    const value = hourlyData[index];
    const height = (value / maxValue) * 180; // 最大高度180px
    
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${height}px`;
    
    // 设置不同时间段不同颜色
    if (hour >= 0 && hour < 6) {
      bar.style.backgroundColor = '#393E46'; // 深夜
    } else if (hour >= 6 && hour < 12) {
      bar.style.backgroundColor = '#7fdbca'; // 上午
    } else if (hour >= 12 && hour < 18) {
      bar.style.backgroundColor = '#F37626'; // 下午
    } else {
      bar.style.backgroundColor = '#7957D5'; // 晚上
    }
    
    // 添加提示
    bar.title = `${hour}:00 - ${hour}:59: ${value}%`;
    
    chart.appendChild(bar);
  });
  
  // 添加图表说明
  const legend = document.createElement('div');
  legend.className = 'time-legend';
  legend.style.display = 'flex';
  legend.style.justifyContent = 'center';
  legend.style.margin = '10px 0';
  
  legend.innerHTML = `
    <div style="margin: 0 10px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: #393E46; margin-right: 5px;"></span>深夜 (0-6点)</div>
    <div style="margin: 0 10px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: #7fdbca; margin-right: 5px;"></span>上午 (6-12点)</div>
    <div style="margin: 0 10px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: #F37626; margin-right: 5px;"></span>下午 (12-18点)</div>
    <div style="margin: 0 10px;"><span style="display: inline-block; width: 12px; height: 12px; background-color: #7957D5; margin-right: 5px;"></span>晚上 (18-24点)</div>
  `;
  
  // 添加元素到容器
  chartContainer.appendChild(chartTitle);
  chartContainer.appendChild(chart);
  chartContainer.appendChild(legend);
  
  container.appendChild(chartContainer);
}

/**
 * 为统计元素添加滚动动画效果
 */
function animateStatsOnScroll() {
  // 获取所有需要动画的元素
  const animatedElements = document.querySelectorAll('.stats-card, .goal-ring, .bar, .bubble, .heatmap-cell');
  
  // 检查IntersectionObserver API是否可用
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 当元素进入视口时添加动画类
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // 一旦添加动画，就不再观察
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // 元素有10%进入视口时触发
    
    // 开始观察每个元素
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // 如果不支持IntersectionObserver，则直接显示所有元素
    animatedElements.forEach(element => {
      element.classList.add('animated');
    });
  }
}

/**
 * 初始化统计信息的交互功能
 */
function initializeStatsInteractions() {
  // 为卡片添加悬停效果
  const statsCards = document.querySelectorAll('.stats-card');
  statsCards.forEach(card => {
    card.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
    });
    
    card.addEventListener('mouseout', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
  
  // 为详情摘要添加切换动画
  const summaries = document.querySelectorAll('summary');
  summaries.forEach(summary => {
    summary.addEventListener('click', function() {
      const details = this.parentNode;
      if (details.hasAttribute('open')) {
        // 正在关闭
        const content = details.querySelector('div');
        content.style.maxHeight = content.scrollHeight + 'px';
        setTimeout(() => {
          content.style.maxHeight = '0';
        }, 10);
      } else {
        // 正在打开
        const content = details.querySelector('div');
        content.style.maxHeight = '0';
        setTimeout(() => {
          content.style.maxHeight = content.scrollHeight + 'px';
        }, 10);
      }
    });
  });
}

// 在DOM加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', function() {
  initializeStatsInteractions();
});