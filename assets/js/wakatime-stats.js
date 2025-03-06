/**
 * WakaTime统计数据处理脚本
 */

document.addEventListener('DOMContentLoaded', function() {
  // 确保WakaTime徽章正确显示
  fixWakaTimeBadges();
});

/**
 * 修复WakaTime徽章显示问题
 */
function fixWakaTimeBadges() {
  // 获取START_SECTION:waka和END_SECTION:waka之间的内容
  const content = document.documentElement.innerHTML;
  const regex = /<!--START_SECTION:waka-->             ([\s\S]*?)<!--END_SECTION:waka-->/;
  const match = content.match(regex);
  
  // 如果找到了对应内容但格式不正确，尝试修复
  if (match && match[1]) {
    const wakaSection = match[1].trim();
    if (!wakaSection.includes('img.shields.io')) {
      console.log('WakaTime统计数据未正确加载，尝试刷新页面');
    }
  }
}
