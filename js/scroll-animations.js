class ScrollAnimations {
  constructor() {
    this.elements = [];
    this.observer = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.findElements();
    this.createObserver();
  }

  findElements() {
    const animatedElements = document.querySelectorAll('[data-scroll]');
    
    animatedElements.forEach(element => {
      const animation = element.getAttribute('data-scroll') || 'fade-up';
      const delay = parseInt(element.getAttribute('data-delay')) || 0;
      const duration = parseInt(element.getAttribute('data-duration')) || 800;
      
      this.elements.push({
        element,
        animation,
        delay,
        duration,
        triggered: false
      });
      
      element.style.willChange = 'opacity, transform';
      element.style.opacity = '0';
      this.setInitialState(element, animation);
    });
  }

  setInitialState(element, animation) {
    switch(animation) {
      case 'fade-up':
        element.style.transform = 'translateY(30px)';
        break;
      case 'fade-down':
        element.style.transform = 'translateY(-30px)';
        break;
      case 'fade-left':
        element.style.transform = 'translateX(30px)';
        break;
      case 'fade-right':
        element.style.transform = 'translateX(-30px)';
        break;
      case 'zoom-in':
        element.style.transform = 'scale(0.8)';
        break;
      case 'zoom-out':
        element.style.transform = 'scale(1.2)';
        break;
      case 'flip-left':
        element.style.transform = 'perspective(1000px) rotateY(-90deg)';
        break;
      case 'flip-right':
        element.style.transform = 'perspective(1000px) rotateY(90deg)';
        break;
      default:
        break;
    }
  }

  createObserver() {
    const options = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animData = this.elements.find(item => item.element === entry.target);
          
          if (animData && !animData.triggered) {
            animData.triggered = true;
            this.animate(animData);
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    this.elements.forEach(item => this.observer.observe(item.element));
  }

  animate(animData) {
    const { element, delay, duration } = animData;
    
    setTimeout(() => {
      element.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateX(0) scale(1) rotateY(0)';
      
      element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
        element.style.transition = '';
      }, { once: true, passive: true });
    }, delay);
  }
}

window.scrollAnimations = new ScrollAnimations();
