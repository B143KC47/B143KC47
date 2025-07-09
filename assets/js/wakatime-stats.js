/**
 * WakaTime统计数据处理和美化脚本
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化所有WakaTime相关功能
  initWakaTimeEnhancements();
  fixWakaTimeBadges();
  addProgressBarAnimations();
  setupStatsInteractions();
});

/**
 * 初始化WakaTime增强功能
 */
function initWakaTimeEnhancements() {
  // 为WakaTime统计容器添加观察器，实现滚动动画
  const wakaContainer = document.querySelector('.waka-stats-container');
  if (wakaContainer) {
    setupScrollAnimations(wakaContainer);
  }
  
  // 美化统计徽章
  enhanceBadges();
  
  // 添加统计数据解析和美化
  parseAndEnhanceStats();
}

/**
 * 修复WakaTime徽章显示问题
 */
function fixWakaTimeBadges() {
  // 获取START_SECTION:waka和END_SECTION:waka之间的内容
  const content = document.documentElement.innerHTML;
  const regex = /<!--START_SECTION:waka-->([\s\S]*?)<!--END_SECTION:waka-->/;
  const match = content.match(regex);
  
  if (match && match[1]) {
    const wakaSection = match[1].trim();
    
    // 如果找到了徽章，进行美化处理
    const badges = wakaSection.match(/!\[.*?\]\(.*?\)/g);
    if (badges) {
      console.log('WakaTime徽章加载成功，应用美化效果...');
      applyBadgeEnhancements();
    } else {
      console.log('WakaTime统计数据未正确加载，尝试刷新页面');
    }
  }
}

/**
 * 美化徽章
 */
function enhanceBadges() {
  const wakaImages = document.querySelectorAll('img[src*="shields.io"]');
  
  wakaImages.forEach((img, index) => {
    // 添加延迟动画效果
    img.style.animationDelay = `${index * 0.1}s`;
    img.classList.add('waka-badge-enhanced');
    
    // 添加悬停提示
    if (img.alt.includes('Code Time')) {
      img.title = '总编码时间 - 专注于代码创作的时间统计';
    } else if (img.alt.includes('Lines of code') || img.alt.includes('行代码')) {
      img.title = '代码行数 - 从Hello World开始的编程旅程';
    }
    
    // 添加点击效果
    img.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

/**
 * 解析和美化统计数据
 */
function parseAndEnhanceStats() {
  const wakaSection = document.querySelector('[style*="waka-stats-container"]');
  if (!wakaSection) return;
  
  // 查找统计文本并进行格式化
  const textNodes = getTextNodes(wakaSection);
  textNodes.forEach(node => {
    if (node.textContent.includes('hrs') || node.textContent.includes('mins')) {
      wrapTimeText(node);
    }
  });
}

/**
 * 添加进度条动画
 */
function addProgressBarAnimations() {
  // 为将来可能出现的进度条添加动画
  const progressBars = document.querySelectorAll('.waka-progress');
  progressBars.forEach(bar => {
    bar.style.opacity = '0';
    bar.style.transform = 'scaleX(0)';
    
    // 延迟显示动画
    setTimeout(() => {
      bar.style.transition = 'all 1s ease';
      bar.style.opacity = '1';
      bar.style.transform = 'scaleX(1)';
    }, 300);
  });
}

/**
 * 设置统计交互
 */
function setupStatsInteractions() {
  // 为统计容器添加悬停效果
  const statsContainer = document.querySelector('.waka-stats-container');
  if (statsContainer) {
    let hoverTimeout;
    
    statsContainer.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout);
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
    });
    
    statsContainer.addEventListener('mouseleave', function() {
      hoverTimeout = setTimeout(() => {
        this.style.transform = '';
        this.style.boxShadow = '';
      }, 100);
    });
  }
}

/**
 * 设置滚动动画
 */
function setupScrollAnimations(element) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // 为内部元素添加延迟动画
        const children = entry.target.querySelectorAll('img, h3');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(element);
}

/**
 * 应用徽章增强效果
 */
function applyBadgeEnhancements() {
  const wakaContainer = document.querySelector('.waka-stats-container');
  if (wakaContainer) {
    // 为徽章添加包装容器
    const badges = wakaContainer.querySelectorAll('img[src*="shields.io"]');
    if (badges.length > 0) {
      const badgeContainer = document.createElement('div');
      badgeContainer.className = 'waka-badges';
      
      // 将徽章移动到新容器中
      badges.forEach(badge => {
        badgeContainer.appendChild(badge.cloneNode(true));
        badge.remove();
      });
      
      // 找到合适的位置插入徽章容器
      const title = wakaContainer.querySelector('h3');
      if (title) {
        title.insertAdjacentElement('afterend', badgeContainer);
      }
    }
  }
}

/**
 * 获取文本节点
 */
function getTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) {
      textNodes.push(node);
    }
  }
  
  return textNodes;
}

/**
 * 包装时间文本
 */
function wrapTimeText(node) {
  const text = node.textContent;
  const timeRegex = /(\d+)\s*(hrs?|hours?|mins?|minutes?)/gi;
  
  if (timeRegex.test(text)) {
    const parent = node.parentElement;
    const wrapper = document.createElement('span');
    wrapper.className = 'waka-time-highlight';
    wrapper.innerHTML = text.replace(timeRegex, '<strong>$1</strong> <em>$2</em>');
    parent.replaceChild(wrapper, node);
  }
}

// 导出函数供其他脚本使用
window.WakaTimeStats = {
  fixWakaTimeBadges,
  enhanceBadges,
  addProgressBarAnimations
};
