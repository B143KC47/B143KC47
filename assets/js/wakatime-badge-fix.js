/**
 * 修复WakaTime徽章加载问题
 */
document.addEventListener('DOMContentLoaded', function() {
  // 查找WakaTime徽章
  const wakaBadge = document.querySelector('a[href="https://wakatime.com/@B143KC47"] img');
  
  // 如果找到徽章，添加时间戳并重新加载
  if (wakaBadge) {
    // 添加时间戳以避免缓存问题
    const timestamp = new Date().getTime();
    const originalSrc = wakaBadge.getAttribute('src');
    
    // 检查是否已有时间戳参数
    if (originalSrc.indexOf('?') > -1) {
      wakaBadge.src = originalSrc + '&t=' + timestamp;
    } else {
      wakaBadge.src = originalSrc + '?t=' + timestamp;
    }
    
    // 为徽章添加加载失败处理
    wakaBadge.onerror = function() {
      console.log('WakaTime徽章加载失败');
      // 创建替代文本
      const backupText = document.createElement('span');
      backupText.textContent = '累计编码时间: 650+ 小时';
      backupText.style.color = '#7957D5';
      backupText.style.fontWeight = 'bold';
      backupText.style.padding = '5px 10px';
      backupText.style.border = '1px solid #30363d';
      backupText.style.borderRadius = '4px';
      backupText.style.backgroundColor = '#161b22';
      
      // 替换徽章
      this.parentNode.replaceChild(backupText, this);
    };
  }
});
