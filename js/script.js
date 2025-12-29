const burger = document.querySelector(".burger");
const navMobile = document.querySelector(".nav-mobile");
const menuOverlay = document.querySelector(".menu-overlay");

const navSlide = () => {
  if (!burger || !navMobile) return;
  
  burger.addEventListener("click", () => {
    navMobile.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
    menuOverlay?.classList.toggle("active");
    
    if (navMobile.classList.contains("nav-active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  menuOverlay?.addEventListener("click", () => {
    navMobile.classList.remove("nav-active");
    burger.classList.remove("toggle");
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  const navLinks = document.querySelectorAll(".nav-link-direct, .nav-accordion-content a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMobile.classList.remove("nav-active");
      burger.classList.remove("toggle");
      menuOverlay?.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMobile.classList.contains("nav-active")) {
      navMobile.classList.remove("nav-active");
      burger.classList.remove("toggle");
      menuOverlay?.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
};

navSlide();

const initAccordion = () => {
  const accordionHeaders = document.querySelectorAll(".nav-accordion-header");
  
  accordionHeaders.forEach(header => {
    header.addEventListener("click", (e) => {
      e.stopPropagation();
      const accordionItem = header.parentElement;
      const isActive = accordionItem.classList.contains("active");
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        document.querySelectorAll(".nav-accordion-item").forEach(item => {
          if (item !== accordionItem) {
            item.classList.remove("active");
          }
        });
      }
      
      accordionItem.classList.toggle("active");
    });
  });

  document.addEventListener("click", (e) => {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      const isClickInsideNav = e.target.closest(".nav-accordion-item");
      
      if (!isClickInsideNav) {
        document.querySelectorAll(".nav-accordion-item").forEach(item => {
          item.classList.remove("active");
        });
      }
    }
  });

  const accordionLinks = document.querySelectorAll(".nav-accordion-content a");
  accordionLinks.forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        document.querySelectorAll(".nav-accordion-item").forEach(item => {
          item.classList.remove("active");
        });
      }, 300);
    });
  });
};

initAccordion();