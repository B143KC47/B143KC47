/**
 * WakaTime 数据可视化和美化组件
 * 提供丰富的视觉效果和交互体验
 */

class WakaTimeVisualizer {
  constructor() {
    this.colors = {
      primary: '#c792ea',
      secondary: '#7fdbca', 
      accent: '#ff6e96',
      background: '#161b22',
      cardBg: '#21262d',
      border: '#30363d'
    };
    
    this.init();
  }
  
  init() {
    this.setupVisualEnhancements();
    this.createInteractiveElements();
    this.addDataProcessing();
  }
  
  /**
   * 设置视觉增强效果
   */
  setupVisualEnhancements() {
    // 添加粒子背景效果
    this.createParticleBackground();
    
    // 为统计数字添加计数动画
    this.animateNumbers();
    
    // 创建脉冲效果
    this.addPulseEffects();
  }
  
  /**
   * 创建粒子背景
   */
  createParticleBackground() {
    const container = document.querySelector('.waka-stats-container');
    if (!container) return;
    
    const particles = document.createElement('div');
    particles.className = 'waka-particles';
    particles.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    // 创建多个粒子
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: ${this.colors.secondary};
        border-radius: 50%;
        opacity: 0.3;
        animation: float ${3 + Math.random() * 2}s infinite ease-in-out;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
      `;
      particles.appendChild(particle);
    }
    
    container.appendChild(particles);
    this.addParticleStyles();
  }
  
  /**
   * 添加粒子动画样式
   */
  addParticleStyles() {
    if (document.getElementById('waka-particle-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'waka-particle-styles';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-10px) rotate(180deg); opacity: 0.6; }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px ${this.colors.primary}; }
        50% { box-shadow: 0 0 15px ${this.colors.secondary}, 0 0 25px ${this.colors.accent}; }
      }
      
      @keyframes countUp {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      .waka-number-highlight {
        display: inline-block;
        animation: countUp 0.8s ease-out;
        color: ${this.colors.primary};
        font-weight: bold;
        text-shadow: 0 0 8px ${this.colors.primary}40;
      }
      
      .waka-badge-glow {
        animation: glow 3s infinite;
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * 数字计数动画
   */
  animateNumbers() {
    const container = document.querySelector('.waka-stats-container');
    if (!container) return;
    
    // 查找所有包含数字的元素
    const textElements = container.querySelectorAll('*');
    textElements.forEach(element => {
      const text = element.textContent;
      const numberMatch = text.match(/(\d+(?:\.\d+)?)\s*(hrs?|hours?|mins?|minutes?|thousand|million)/i);
      
      if (numberMatch && element.children.length === 0) {
        const [fullMatch, number, unit] = numberMatch;
        const numValue = parseFloat(number);
        
        // 创建动画数字
        this.createAnimatedNumber(element, numValue, unit, fullMatch);
      }
    });
  }
  
  /**
   * 创建动画数字
   */
  createAnimatedNumber(element, targetValue, unit, originalText) {
    const wrapper = document.createElement('span');
    wrapper.innerHTML = element.innerHTML.replace(
      originalText,
      `<span class="waka-number-highlight" data-target="${targetValue}">${targetValue}</span> ${unit}`
    );
    
    element.innerHTML = wrapper.innerHTML;
    
    // 启动计数动画
    const numberElement = element.querySelector('.waka-number-highlight');
    if (numberElement) {
      this.animateCounter(numberElement, 0, targetValue, 1000);
    }
  }
  
  /**
   * 计数器动画
   */
  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用easeOutCubic缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + (end - start) * easeProgress;
      
      element.textContent = currentValue < 1 ? 
        currentValue.toFixed(1) : 
        Math.floor(currentValue).toString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = end.toString();
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
  
  /**
   * 添加脉冲效果
   */
  addPulseEffects() {
    const badges = document.querySelectorAll('img[src*="shields.io"]');
    badges.forEach((badge, index) => {
      // 随机添加发光效果
      if (Math.random() > 0.5) {
        badge.classList.add('waka-badge-glow');
        badge.style.animationDelay = `${index * 0.5}s`;
      }
    });
  }
  
  /**
   * 创建交互元素
   */
  createInteractiveElements() {
    this.addTooltips();
    this.createHoverEffects();
    this.setupClickAnimations();
  }
  
  /**
   * 添加工具提示
   */
  addTooltips() {
    const container = document.querySelector('.waka-stats-container');
    if (!container) return;
    
    // 为容器添加整体提示
    container.title = '这些统计数据每天自动更新，展示我的编程活动和时间分布';
    
    // 为不同类型的统计添加具体提示
    const badges = container.querySelectorAll('img[src*="shields.io"]');
    badges.forEach(badge => {
      if (badge.alt.includes('Code Time')) {
        badge.title = '⏱️ 专注编码时间 - 使用WakaTime追踪的纯编程时间';
      } else if (badge.alt.includes('Lines of code') || badge.alt.includes('行代码')) {
        badge.title = '📝 代码行数统计 - 从Hello World开始的编程旅程里程碑';
      }
    });
  }
  
  /**
   * 创建悬停效果
   */
  createHoverEffects() {
    const container = document.querySelector('.waka-stats-container');
    if (!container) return;
    
    container.addEventListener('mouseenter', () => {
      this.activateHoverMode();
    });
    
    container.addEventListener('mouseleave', () => {
      this.deactivateHoverMode();
    });
  }
  
  /**
   * 激活悬停模式
   */
  activateHoverMode() {
    const particles = document.querySelector('.waka-particles');
    if (particles) {
      particles.style.opacity = '0.8';
    }
    
    const badges = document.querySelectorAll('.waka-stats-container img');
    badges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.transform = 'translateY(-3px) scale(1.05)';
        badge.style.filter = 'brightness(1.2) drop-shadow(0 4px 8px rgba(199, 146, 234, 0.3))';
      }, index * 50);
    });
  }
  
  /**
   * 取消悬停模式
   */
  deactivateHoverMode() {
    const particles = document.querySelector('.waka-particles');
    if (particles) {
      particles.style.opacity = '0.3';
    }
    
    const badges = document.querySelectorAll('.waka-stats-container img');
    badges.forEach(badge => {
      badge.style.transform = '';
      badge.style.filter = '';
    });
  }
  
  /**
   * 设置点击动画
   */
  setupClickAnimations() {
    const badges = document.querySelectorAll('.waka-stats-container img');
    badges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        this.createClickRipple(e);
      });
    });
  }
  
  /**
   * 创建点击波纹效果
   */
  createClickRipple(event) {
    const ripple = document.createElement('div');
    const rect = event.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: radial-gradient(circle, ${this.colors.primary}40 0%, transparent 70%);
      left: ${event.clientX - rect.left - size/2}px;
      top: ${event.clientY - rect.top - size/2}px;
      pointer-events: none;
      animation: ripple 0.6s linear;
      z-index: 10;
    `;
    
    event.target.style.position = 'relative';
    event.target.appendChild(ripple);
    
    // 添加波纹动画样式
    if (!document.getElementById('ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  /**
   * 数据处理
   */
  addDataProcessing() {
    // 解析WakaTime统计数据并创建可视化
    this.parseWakaTimeData();
    
    // 设置自动刷新
    this.setupAutoRefresh();
  }
  
  /**
   * 解析WakaTime数据
   */
  parseWakaTimeData() {
    const container = document.querySelector('.waka-stats-container');
    if (!container) return;
    
    // 提取关键统计信息
    const stats = {
      codeTime: this.extractTimeValue(container, /(\d+)\s*hrs?\s*(\d+)\s*mins?/),
      linesOfCode: this.extractNumberValue(container, /(\d+\.?\d*)\s*(thousand|million)/),
      lastUpdated: new Date().toLocaleDateString('zh-CN')
    };
    
    // 保存统计数据
    this.currentStats = stats;
    
    // 添加统计摘要
    this.addStatsSummary(stats);
  }
  
  /**
   * 提取时间值
   */
  extractTimeValue(container, regex) {
    const text = container.textContent;
    const match = text.match(regex);
    return match ? {
      hours: parseInt(match[1]) || 0,
      minutes: parseInt(match[2]) || 0
    } : { hours: 0, minutes: 0 };
  }
  
  /**
   * 提取数字值
   */
  extractNumberValue(container, regex) {
    const text = container.textContent;
    const match = text.match(regex);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    return unit === 'thousand' ? value * 1000 : 
           unit === 'million' ? value * 1000000 : value;
  }
  
  /**
   * 添加统计摘要
   */
  addStatsSummary(stats) {
    const container = document.querySelector('.waka-stats-container');
    if (!container || container.querySelector('.stats-summary')) return;
    
    const summary = document.createElement('div');
    summary.className = 'stats-summary';
    summary.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      background: rgba(33, 38, 45, 0.5);
      border-radius: 8px;
      font-size: 0.85em;
      color: #7d8590;
      text-align: center;
      border-left: 3px solid ${this.colors.secondary};
    `;
    
    const totalHours = stats.codeTime.hours + (stats.codeTime.minutes / 60);
    summary.innerHTML = `
      <span style="color: ${this.colors.primary};">📊 统计概览</span><br>
      本月编码时间: <strong style="color: ${this.colors.secondary};">${totalHours.toFixed(1)}小时</strong> | 
      代码贡献: <strong style="color: ${this.colors.accent};">${(stats.linesOfCode / 1000).toFixed(1)}K行</strong><br>
      <em style="opacity: 0.7;">数据更新时间: ${stats.lastUpdated}</em>
    `;
    
    container.appendChild(summary);
  }
  
  /**
   * 设置自动刷新
   */
  setupAutoRefresh() {
    // 每5分钟检查一次是否有新数据
    setInterval(() => {
      this.checkForUpdates();
    }, 5 * 60 * 1000);
  }
  
  /**
   * 检查更新
   */
  checkForUpdates() {
    const newStats = this.parseWakaTimeData();
    if (JSON.stringify(newStats) !== JSON.stringify(this.currentStats)) {
      console.log('WakaTime统计数据已更新');
      location.reload(); // 简单的重新加载
    }
  }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化以确保其他脚本已加载
  setTimeout(() => {
    new WakaTimeVisualizer();
  }, 500);
});

// 导出类供其他模块使用
window.WakaTimeVisualizer = WakaTimeVisualizer;
