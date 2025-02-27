document.addEventListener('DOMContentLoaded', function() {
  // 为WakaTime统计添加CSS类
  const wakaSection = document.querySelector('h2:contains("我的编程时间统计")').closest('div');
  if (wakaSection) {
    wakaSection.classList.add('waka-stats');
    
    // 查找WakaTime统计内容
    const wakaContent = document.querySelector('div:has(#waka-stats)');
    if (wakaContent) {
      // 应用自定义样式
      wakaContent.classList.add('waka-stats-container');
      
      // 为编程语言添加进度条
      const languageItems = wakaContent.querySelectorAll('li:contains("%")');
      languageItems.forEach(item => {
        const text = item.textContent;
        const langMatch = text.match(/(.+)\s+(\d+\.\d+)%/);
        
        if (langMatch) {
          const language = langMatch[1].trim();
          const percentage = parseFloat(langMatch[2]);
          
          // 创建进度条
          const langClass = `lang-${language.toLowerCase()}`;
          const progressHTML = `
            <div class="waka-lang-details">
              <span>${language}</span>
              <span>${percentage}%</span>
            </div>
            <div class="waka-progress-bar">
              <div class="waka-progress-fill ${langClass}" style="width: ${percentage}%"></div>
            </div>
          `;
          
          // 替换原始内容
          item.innerHTML = progressHTML;
        }
      });
      
      // 添加动画效果
      const progressBars = wakaContent.querySelectorAll('.waka-progress-fill');
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
          bar.style.width = width;
          bar.style.transition = 'width 1s ease-in-out';
        }, 100);
      });
    }
  }
  
  // 为里程碑进度条添加动画
  const milestoneProgress = document.querySelector('.milestone-progress-bar');
  if (milestoneProgress) {
    const targetWidth = milestoneProgress.getAttribute('data-progress') + '%';
    milestoneProgress.style.width = '0';
    
    setTimeout(() => {
      milestoneProgress.style.width = targetWidth;
    }, 500);
  }
  
  // 添加WakaTime数据获取功能
  async function fetchWakaTimeData() {
    try {
      // 注意：这需要配置公开的WakaTime API或代理
      const response = await fetch('https://wakatime.com/api/v1/users/current/stats/last_30_days');
      const data = await response.json();
      
      if (data && data.data) {
        // 更新总编码时间
        const totalSeconds = data.data.total_seconds;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        const totalTimeElement = document.getElementById('total-coding-time');
        if (totalTimeElement) {
          totalTimeElement.textContent = `${hours}小时 ${minutes}分钟`;
        }
        
        // 更新日均编码时间
        const dailyAverage = data.data.daily_average_seconds;
        const avgHours = Math.floor(dailyAverage / 3600);
        const avgMinutes = Math.floor((dailyAverage % 3600) / 60);
        
        const dailyAvgElement = document.getElementById('daily-average-time');
        if (dailyAvgElement) {
          dailyAvgElement.textContent = `${avgHours}小时 ${avgMinutes}分钟`;
        }
      }
    } catch (error) {
      console.error('获取WakaTime数据失败:', error);
    }
  }
  
  // 调用数据获取函数
  fetchWakaTimeData();
});
