/**
 * 修复WakaTime徽章加载问题
 */
document.addEventListener('DOMContentLoaded', function() {
  // 查找WakaTime徽章
  const wakaBadges = document.querySelectorAll('img[src*="img.shields.io/badge"]');
  
  // 为每个徽章添加时间戳以避免缓存问题
  wakaBadges.forEach(badge => {
    const timestamp = new Date().getTime();
    const originalSrc = badge.getAttribute('src');
    
    // 检查是否已有时间戳参数
    if (originalSrc.indexOf('?') > -1) {
      badge.src = originalSrc + '&t=' + timestamp;
    } else {
      badge.src = originalSrc + '?t=' + timestamp;
    }
    
    // 为徽章添加加载失败处理
    badge.onerror = function() {
      console.log('徽章加载失败');
      // 创建替代文本
      const backupText = document.createElement('span');
      backupText.textContent = this.alt || '统计数据加载中...';
      backupText.style.color = '#7957D5';
      backupText.style.fontWeight = 'bold';
      backupText.style.padding = '5px 10px';
      backupText.style.border = '1px solid #30363d';
      backupText.style.borderRadius = '4px';
      backupText.style.backgroundColor = '#161b22';
      
      // 替换徽章
      this.parentNode.replaceChild(backupText, this);
    };
  });
});
