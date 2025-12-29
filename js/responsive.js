class ResponsiveManager {
  constructor() {
    this.init();
  }

  init() {
    this.handleViewportHeight();
    this.handleMobileMenu();
    this.handleResponsiveTables();
    this.handleScrollEffects();
    this.handleImageLoading();
    this.handleTouchEvents();
    this.handleOrientationChange();
    this.handleResizeDebounce();
  }

  handleViewportHeight() {
    let timeout;
    const setViewportHeight = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    
    const debouncedResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(setViewportHeight, 150);
    };
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('orientationchange', setViewportHeight, { passive: true });
  }

  handleMobileMenu() {
    const burger = document.querySelector('.burger');
    const navMobile = document.querySelector('.nav-mobile');

    burger?.addEventListener('click', () => {
      burger.classList.toggle('toggle');
      navMobile?.classList.toggle('nav-active');
    });

    document.querySelectorAll('.nav-mobile a').forEach(link => {
      link.addEventListener('click', () => {
        burger?.classList.remove('toggle');
        navMobile?.classList.remove('nav-active');
      });
    });
  }

  handleResponsiveTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.overflowX = 'auto';
        wrapper.style.webkitOverflowScrolling = 'touch';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);

        if (window.innerWidth <= 768) {
          const indicator = document.createElement('div');
          indicator.className = 'scroll-indicator';
          indicator.textContent = '← Scroll untuk melihat lebih banyak →';
          indicator.style.cssText = `
            text-align: center;
            padding: 0.5rem;
            background: rgba(123, 104, 238, 0.2);
            color: #d45719;
            font-size: 0.85rem;
            border-radius: 5px;
            margin-top: 0.5rem;
          `;
          wrapper.parentNode.insertBefore(indicator, wrapper.nextSibling);

          wrapper.addEventListener('scroll', () => {
            indicator.style.display = 'none';
          }, { once: true });
        }
      }
    });
  }

  handleScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    let ticking = false;

    const updateHeader = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      if (currentScroll > lastScroll && currentScroll > 500) {
        header?.style.transform = 'translateY(-100%)';
      } else {
        header?.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerHeight = header?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  handleImageLoading() {
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in';
        
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });

        if (img.complete) {
          img.style.opacity = '1';
        }

        imageObserver.observe(img);
      });
    }
  }

  handleTouchEvents() {
    const interactiveElements = document.querySelectorAll('a, button, .service, .portfolio');
    
    interactiveElements.forEach(element => {
      element.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });

      element.addEventListener('touchend', function() {
        this.style.transform = '';
      }, { passive: true });
    });

    const buttons = document.querySelectorAll('button, .burger');
    buttons.forEach(button => {
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.click();
      }, { passive: false });
    });
  }

  handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
      const navMobile = document.querySelector('.nav-mobile');
      const burger = document.querySelector('.burger');
      
      navMobile?.classList.remove('nav-active');
      burger?.classList.remove('toggle');

      setTimeout(() => {
        window.scrollTo(0, window.scrollY);
      }, 100);
    });
  }

  handleResizeDebounce() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      document.body.classList.add('resize-animation-stopper');
      
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
        this.checkBreakpoint();
      }, 400);
    });
  }

  checkBreakpoint() {
    const width = window.innerWidth;
    const body = document.body;

    body.classList.remove('mobile', 'tablet', 'desktop');

    if (width <= 768) {
      body.classList.add('mobile');
    } else if (width <= 1024) {
      body.classList.add('tablet');
    } else {
      body.classList.add('desktop');
    }

    window.dispatchEvent(new CustomEvent('breakpointChange', {
      detail: { width, type: body.className }
    }));
  }
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.responsiveManager = new ResponsiveManager();
  });
} else {
  window.responsiveManager = new ResponsiveManager();
}

const style = document.createElement('style');
style.textContent = `
  .resize-animation-stopper * {
    animation: none !important;
    transition: none !important;
  }

  header {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  header.scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .table-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .table-wrapper::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  .table-wrapper::-webkit-scrollbar-thumb {
    background: rgba(123, 104, 238, 0.5);
    border-radius: 10px;
  }

  .table-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(123, 104, 238, 0.8);
  }

  @media (hover: none) {
    .service:hover,
    .portfolio:hover {
      transform: none;
    }
  }
`;
document.head.appendChild(style);

window.ResponsiveUtils = {
  isMobile,
  isTouchDevice,
  getCurrentBreakpoint
};
