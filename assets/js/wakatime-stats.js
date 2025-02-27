/**
 * WakaTime统计数据处理脚本
 * 用于处理和显示WakaTime编码统计
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化WakaTime统计
  initializeWakaTimeStats();
  
  // 加载里程碑动画
  animateMilestone();
});

/**
 * 初始化WakaTime统计
 */
function initializeWakaTimeStats() {
  // 尝试获取WakaTime徽章
  fetchWakaTimeBadge();
  
  // 优化WakaTime图表显示
  enhanceWakaTimeCharts();
  
  // 添加进度条动画
  animateWakaTimeProgressBars();
}

/**
 * 获取WakaTime徽章并确保正确显示
 */
function fetchWakaTimeBadge() {
  const badgeImg = document.querySelector('a[href="https://wakatime.com/@B143KC47"] img');
  if (badgeImg) {
    // 确保徽章加载失败时有替代文字
    badgeImg.onerror = function() {
      const parent = this.parentNode;
      if (parent) {
        const textNode = document.createElement('span');
        textNode.textContent = '累计编程时间: 650+ 小时';
        textNode.style.color = '#7957D5';
        textNode.style.fontWeight = 'bold';
        parent.replaceChild(textNode, this);
      }
    };
    
    // 尝试重新加载徽章
    badgeImg.src = `https://wakatime.com/badge/user/b143kc47/b143kc47.svg?${new Date().getTime()}`;
  }
}

/**
 * 优化WakaTime图表显示
 */
function enhanceWakaTimeCharts() {
  // 为WakaTime图表添加加载动画
  const charts = document.querySelectorAll('.wakatime-chart img');
  charts.forEach(chart => {
    // 添加加载指示器
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chart-loading';
    loadingDiv.textContent = '加载中...';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.color = '#7fdbca';
    loadingDiv.style.padding = '20px';
    
    const parent = chart.parentNode;
    parent.insertBefore(loadingDiv, chart);
    
    // 图表加载完成后移除加载指示器
    chart.onload = function() {
      loadingDiv.remove();
      this.style.display = 'block';
    };
    
    // 初始隐藏图表
    chart.style.display = 'none';
    
    // 添加时间戳以防止缓存
    chart.src = chart.src + '?t=' + new Date().getTime();
  });
}

/**
 * 为WakaTime进度条添加动画
 */
function animateWakaTimeProgressBars() {
  // 获取所有进度条
  const progressBars = document.querySelectorAll('.progress-fill');
  
  // 为每个进度条添加动画
  progressBars.forEach(bar => {
    // 获取目标宽度
    const targetWidth = bar.getAttribute('data-width') || bar.style.width;
    
    // 设置初始宽度为0
    bar.style.width = '0';
    
    // 添加过渡动画
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });
}

/**
 * 里程碑进度条动画
 */
function animateMilestone() {
  const milestoneBar = document.querySelector('.milestone-progress-bar');
  const milestoneCircle = document.querySelector('.milestone-circle');
  
  if (milestoneBar && milestoneCircle) {
    // 获取目标进度
    const targetPercent = parseInt(milestoneBar.style.width) || 65;
    
    // 设置初始状态
    milestoneBar.style.width = '0%';
    milestoneCircle.style.background = 'conic-gradient(#7957D5 0%, #2D333B 0%)';
    
    // 添加动画
    setTimeout(() => {
      // 更新进度条
      milestoneBar.style.width = `${targetPercent}%`;
      
      // 更新环形进度
      milestoneCircle.style.background = `conic-gradient(#7957D5 ${targetPercent}%, #2D333B 0%)`;
      
      // 增加计数器动画
      const percentEl = document.getElementById('milestone-percent');
      if (percentEl) {
        let currentPercent = 0;
        const interval = setInterval(() => {
          if (currentPercent >= targetPercent) {
            clearInterval(interval);
          } else {
            currentPercent++;
            percentEl.textContent = `${currentPercent}%`;
          }
        }, 20);
      }
    }, 500);
  }
}
