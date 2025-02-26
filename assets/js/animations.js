document.addEventListener('DOMContentLoaded', function() {
  // 页面载入动画
  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('visible');
    }, 100 * index);
  });

  // 滚动动画
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  
  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('scrolled');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      } else if (elementOutofView(el)) {
        hideScrollElement(el)
      }
    })
  }

  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });

  // 代码高亮动画
  const codeBlocks = document.querySelectorAll('pre code');
  if (codeBlocks.length > 0) {
    codeBlocks.forEach(block => {
      block.classList.add('code-highlight');
    });
  }
  
  // 主题切换功能
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('light-theme');
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
    });
    
    // 检查用户之前的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }
  
  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
