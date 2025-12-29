class WebsiteEnhancements {
  constructor() {
    this.init();
  }

  init() {
    requestIdleCallback(() => {
      this.createLoadingScreen();
      this.createScrollProgress();
      this.createBackToTop();
      this.animateExistingCounters();
      this.createThemeToggle();
      
      if (window.innerWidth > 768) {
        this.createCustomCursor();
        this.create3DTiltCards();
      }
    }, { timeout: 2000 });
  }

  createLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'loading-screen';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-logo">NAMLINE</div>
        <div class="loader-bar">
          <div class="loader-progress"></div>
        </div>
        <div class="loader-text">Loading...</div>
      </div>
    `;
    document.body.prepend(loader);

    let progress = 0;
    const progressBar = loader.querySelector('.loader-progress');
    const loaderText = loader.querySelector('.loader-text');

    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 500);
        }, 500);
      }
      progressBar.style.width = progress + '%';
      loaderText.textContent = `Loading... ${Math.floor(progress)}%`;
    }, 200);

    window.addEventListener('load', () => {
      clearInterval(interval);
      progress = 100;
      progressBar.style.width = '100%';
      loaderText.textContent = 'Loading... 100%';
      
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 500);
    });
  }

  createCustomCursor() {
    if (window.innerWidth <= 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotX = e.clientX;
      dotY = e.clientY;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
      
      requestAnimationFrame(animate);
    }
    animate();

    const hoverElements = document.querySelectorAll('a, button, .burger, .service, .portfolio');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }

  createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  createBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  createTypingAnimation() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const originalText = heroName.innerHTML;
    const textContent = 'Tariq Rahmadari';
    
    heroName.innerHTML = `<span class="typing-text"></span><span class="typing-cursor">|</span>`;
    const typingElement = heroName.querySelector('.typing-text');
    
    let charIndex = 0;
    let isFirstPart = true;

    function type() {
      if (charIndex < textContent.length) {
        const char = textContent.charAt(charIndex);
        if (char === ' ' && isFirstPart) {
          typingElement.innerHTML += `</span><span class="hero-name-highlight">`;
          isFirstPart = false;
        } else {
          typingElement.innerHTML += char;
        }
        charIndex++;
        setTimeout(type, 100);
      } else {
        setTimeout(() => {
          heroName.querySelector('.typing-cursor').style.display = 'none';
        }, 1000);
      }
    }

    setTimeout(type, 1000);
  }

  createFloatingParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.querySelector('.background-shapes').appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(123, 104, 238, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(123, 104, 238, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  createSkillBars() {
    const skillsList = document.querySelector('.skills-list');
    if (!skillsList) return;

    const skills = [
      { name: 'HTML', level: 85, emoji: '😊' },
      { name: 'CSS', level: 80, emoji: '😎' },
      { name: 'JavaScript', level: 90, emoji: '😍' },
      { name: 'C', level: 75, emoji: '🤓' },
      { name: 'Python', level: 70, emoji: '🐍' },
      { name: 'C++', level: 85, emoji: '⚡' }
    ];

    skillsList.innerHTML = '';
    skillsList.style.display = 'block';
    skillsList.style.width = '100%';

    skills.forEach((skill, index) => {
      const skillBar = document.createElement('div');
      skillBar.className = 'skill-bar';
      skillBar.innerHTML = `
        <div class="skill-info">
          <span class="skill-name">${skill.emoji} ${skill.name}</span>
          <span class="skill-percentage">0%</span>
        </div>
        <div class="skill-progress">
          <div class="skill-progress-fill" data-level="${skill.level}"></div>
        </div>
      `;
      skillsList.appendChild(skillBar);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = document.querySelectorAll('.skill-progress-fill');
          bars.forEach((bar, index) => {
            setTimeout(() => {
              const level = bar.getAttribute('data-level');
              bar.style.width = level + '%';
              
              const percentage = bar.parentElement.previousElementSibling.querySelector('.skill-percentage');
              let current = 0;
              const increment = level / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= level) {
                  current = level;
                  clearInterval(timer);
                }
                percentage.textContent = Math.floor(current) + '%';
              }, 20);
            }, index * 100);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(skillsList);
  }

  animateExistingCounters() {
    const statsDiv = document.querySelector('.hero-stats');
    if (!statsDiv) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = document.querySelectorAll('.stat-number');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            counter.textContent = '0';

            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
              } else {
                counter.textContent = target + "+";
              }
            };

            updateCounter();
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsDiv);
  }

  create3DTiltCards() {
    const cards = document.querySelectorAll('.service, .portfolio');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = `
      <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" stroke-width="2"/>
      </svg>
      <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
    document.body.appendChild(toggle);

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  createProjectModals() {
    const portfolios = document.querySelectorAll('.portfolio');
    
    portfolios.forEach((portfolio, index) => {
      portfolio.style.cursor = 'pointer';
      portfolio.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
          <div class="modal-content" data-aos="zoom-in">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
              <h2>${portfolio.querySelector('h4').textContent}</h2>
            </div>
            <div class="modal-body">
              <img src="${portfolio.querySelector('img').src}" alt="Project">
              <p>${portfolio.querySelector('p').textContent}</p>
              <div class="modal-tags">
                ${Array.from(portfolio.querySelectorAll('.portfolio-tags div'))
                  .map(tag => `<span class="modal-tag">${tag.textContent}</span>`)
                  .join('')}
              </div>
              <div class="modal-actions">
                <button class="btn-primary">View Live</button>
                <button class="btn-secondary">View Code</button>
              </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => modal.classList.add('show'), 10);

        const closeModal = () => {
          modal.classList.remove('show');
          setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
          }, 300);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      });
    });
  }

  enhanceFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const contactSection = document.createElement('section');
    contactSection.id = 'contact';
    contactSection.className = 'contact-section';
    contactSection.innerHTML = `
      <div class="main-container">
        <h3 data-aos="fade-up" class="pre-title text-center">Get In Touch</h3>
        <h1 data-aos="fade-up" class="section-title text-center">Hubungi Saya</h1>
        
        <div class="contact-container" data-aos="fade-up">
          <div class="contact-info">
            <div class="contact-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div>
                <h4>Email</h4>
                <p>tariq@example.com</p>
              </div>
            </div>
            <div class="contact-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" stroke-width="2"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div>
                <h4>Location</h4>
                <p>Medan, Indonesia</p>
              </div>
            </div>
          </div>

          <form class="contact-form">
            <div class="form-group">
              <input type="text" placeholder="Nama Anda" required>
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email Anda" required>
            </div>
            <div class="form-group">
              <textarea placeholder="Pesan Anda" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-btn">
              Kirim Pesan
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    footer.parentNode.insertBefore(contactSection, footer);

    const form = contactSection.querySelector('.contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('.submit-btn');
      btn.textContent = 'Mengirim...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = `
          Terkirim! ✓
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
          </svg>
        `;
        
        setTimeout(() => {
          form.reset();
          btn.innerHTML = `
            Kirim Pesan
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"/>
            </svg>
          `;
          btn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enhancements = new WebsiteEnhancements();
  });
} else {
  window.enhancements = new WebsiteEnhancements();
}
