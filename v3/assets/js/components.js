// Alpine.js Components for Ecoprism Website

// Component Cache (avoid redeclaration if script is loaded multiple times)
if (typeof window.componentCache === "undefined") {
  window.componentCache = new Map();
}
// Reference to the global cache (use var to avoid redeclaration errors on multiple script loads)
var componentCache = window.componentCache;

// Manual component loading function
window.loadComponentIntoElement = async function (componentName, targetElement) {
  try {
    const componentHTML = await loadComponent(componentName);
    if (targetElement) {
      targetElement.innerHTML = componentHTML;
      // Re-initialize Alpine on the new content
      if (window.Alpine) {
        Alpine.initTree(targetElement);
      }
    }
    return componentHTML;
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
    if (targetElement) {
      targetElement.innerHTML = `<div class="text-red-500 p-4">Failed to load ${componentName} component</div>`;
    }
    return null;
  }
};

// Strip <script> tags — innerHTML injection does not execute them
function stripComponentScripts(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

// Manrope is the font the Sandbox theme header (about-us) uses — make sure
// every page that embeds the shared header loads it.
function ensureHeaderFont() {
  if (document.querySelector('link[data-header-font]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap";
  link.setAttribute("data-header-font", "");
  document.head.appendChild(link);
}

// Load shared site header after DOM is ready
async function loadSiteHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer || headerContainer.dataset.headerLoaded === "true") return;

  ensureHeaderFont();

  try {
    let componentHTML = await loadComponent("header");
    if (!componentHTML) return;

    componentHTML = stripComponentScripts(componentHTML);
    headerContainer.innerHTML = componentHTML;
    headerContainer.dataset.headerLoaded = "true";

    // Pre-set the correct logo src before Alpine hydrates (avoids flash).
    // Alpine's :src binding takes full control once initTree() runs.
    const variant = headerContainer.getAttribute("data-header-variant") || "light";
    const logoImg = headerContainer.querySelector(".site-header-logo");
    if (logoImg) {
      logoImg.src = variant === "light"
        ? "/assets/img/logo-light.webp"
        : "/assets/img/logo.webp";
    }

    if (window.Alpine) {
      Alpine.initTree(headerContainer);
    }
  } catch (error) {
    console.error("Failed to load site header:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSiteHeader);
} else {
  loadSiteHeader();
}

// Component Loader
async function loadComponent(componentName) {
  console.log(`Loading component: ${componentName}`);

  // Check cache first
  if (componentCache.has(componentName)) {
    console.log(`Component ${componentName} found in cache`);
    return componentCache.get(componentName);
  }

  try {
    // Try multiple paths for compatibility with local and production environments
    const paths = [
      `/v3/components/${componentName}.html?v=1.1.1`, // Production absolute path
      `./v3/components/${componentName}.html?v=1.1.1`, // Local relative from root
      `../v3/components/${componentName}.html?v=1.1.1`, // Local relative (one level deep)
      `../../v3/components/${componentName}.html?v=1.1.1`, // Local relative (two levels deep)
    ];

    let lastError = null;
    
    for (const componentPath of paths) {
      try {
        console.log(`Attempting to fetch from: ${componentPath}`);
        const response = await fetch(componentPath);
        
        if (response.ok) {
          const componentHTML = await response.text();
          console.log(`Component ${componentName} loaded successfully from: ${componentPath}`);
          
          // Cache the component
          componentCache.set(componentName, componentHTML);
          return componentHTML;
        }
      } catch (e) {
        lastError = e;
        console.log(`Path failed, trying next: ${componentPath}`);
        continue;
      }
    }
    
    // If all paths failed, throw error with helpful message
    throw new Error(`Could not load component from any path. Last error: ${lastError?.message}`);
  } catch (error) {
    console.error(`Error loading component ${componentName}:`, error);
    return `<div class="text-red-500 p-4">Error loading ${componentName} component: ${error.message}</div>`;
  }
}

// Component Loading Alpine Directive
document.addEventListener("alpine:init", () => {
  // Shared v3 site header (injected via loadSiteHeader)
  Alpine.data("headerComponent", () => ({
    mobileMenuOpen: false,
    activeDropdown: null,
    isScrolled: false,
    variant: "light",

    init() {
      const container = document.getElementById("header-container");
      if (container) {
        this.variant = container.getAttribute("data-header-variant") || "light";
      }

      const updateScroll = () => {
        this.isScrolled = window.scrollY > 0;
      };

      updateScroll();
      window.addEventListener("scroll", updateScroll, { passive: true });
    },
  }));

  // Component loader directive
  Alpine.directive("component", async (el, { expression }, { Alpine }) => {
    const componentName = expression.replace(/['"]/g, "");

    // Show loading state
    el.innerHTML = `<div class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-ecoprism-primary"></div>
      <span class="ml-2 text-gray-600">Loading...</span>
    </div>`;

    try {
      const componentHTML = await loadComponent(componentName);

      // Insert the component HTML
      el.innerHTML = componentHTML;

      // Re-initialize Alpine on the new content
      Alpine.initTree(el);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      el.innerHTML = `<div class="text-red-500 p-4">Failed to load ${componentName} component</div>`;
    }
  });
  // Scroll Progress Component
  Alpine.data("scrollProgress", () => ({
    progress: 0,

    init() {
      window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        this.progress = (winScroll / height) * 100;
      });
    },
  }));

  // Counter Animation Component
  Alpine.data("counter", (start = 0, end = 100, duration = 2000) => ({
    count: start,
    isVisible: false,

    init() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isVisible) {
            this.isVisible = true;
            this.animate();
          }
        });
      });
      observer.observe(this.$el);
    },

    animate() {
      const startTime = performance.now();
      const startCount = this.count;

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        this.count = Math.floor(startCount + (end - startCount) * easeOut);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          this.count = end;
        }
      };

      requestAnimationFrame(updateCount);
    },
  }));

  // Typing Animation Component
  Alpine.data("typing", (texts = ["ESG Solutions", "Sustainability", "Innovation"], speed = 100) => ({
    currentText: "",
    currentIndex: 0,
    currentTextIndex: 0,
    isDeleting: false,

    init() {
      this.type();
    },

    type() {
      const current = texts[this.currentTextIndex];

      if (this.isDeleting) {
        this.currentText = current.substring(0, this.currentIndex - 1);
        this.currentIndex--;
      } else {
        this.currentText = current.substring(0, this.currentIndex + 1);
        this.currentIndex++;
      }

      let typeSpeed = speed;

      if (this.isDeleting) {
        typeSpeed /= 2;
      }

      if (!this.isDeleting && this.currentText === current) {
        typeSpeed = 2000; // Pause at end
        this.isDeleting = true;
      } else if (this.isDeleting && this.currentText === "") {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before next word
      }

      setTimeout(() => this.type(), typeSpeed);
    },
  }));

  // Parallax Component
  Alpine.data("parallax", (speed = 0.5) => ({
    offset: 0,

    init() {
      window.addEventListener("scroll", () => {
        this.offset = window.pageYOffset * speed;
        this.$el.style.transform = `translateY(${this.offset}px)`;
      });
    },
  }));

  // Lazy Loading Component
  Alpine.data("lazyLoad", () => ({
    loaded: false,

    init() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.loaded) {
            this.loaded = true;
            this.loadImage();
          }
        });
      });
      observer.observe(this.$el);
    },

    loadImage() {
      const img = this.$el.querySelector("img");
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");
      }
    },
  }));

  // Modal Component
  Alpine.data("modal", () => ({
    open: false,

    show() {
      this.open = true;
      document.body.style.overflow = "hidden";
    },

    hide() {
      this.open = false;
      document.body.style.overflow = "auto";
    },

    init() {
      // Close on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.open) {
          this.hide();
        }
      });
    },
  }));

  // Tabs Component
  Alpine.data("tabs", (defaultTab = 0) => ({
    activeTab: defaultTab,

    setActiveTab(index) {
      this.activeTab = index;
    },
  }));

  // Accordion Component
  Alpine.data("accordion", () => ({
    activeIndex: null,

    toggle(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  }));

  // Form Validation Component
  Alpine.data("formValidation", () => ({
    errors: {},
    isSubmitting: false,

    validate(formData) {
      this.errors = {};

      // Email validation
      if (!formData.email || !this.isValidEmail(formData.email)) {
        this.errors.email = "Please enter a valid email address";
      }

      // Name validation
      if (!formData.name || formData.name.trim().length < 2) {
        this.errors.name = "Please enter your full name";
      }

      // Message validation
      if (!formData.message || formData.message.trim().length < 10) {
        this.errors.message = "Please enter a message (at least 10 characters)";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async submit(formData) {
      if (!this.validate(formData)) {
        return false;
      }

      this.isSubmitting = true;

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Success - show success message
          this.showSuccess();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        this.errors.submit = "Failed to send message. Please try again.";
      } finally {
        this.isSubmitting = false;
      }
    },

    showSuccess() {
      // You can implement a success notification here
      alert("Thank you for your message! We'll get back to you soon.");
    },
  }));

  // Search Component
  Alpine.data("search", () => ({
    query: "",
    results: [],
    isOpen: false,

    async search() {
      if (this.query.length < 2) {
        this.results = [];
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(this.query)}`);
        this.results = await response.json();
        this.isOpen = true;
      } catch (error) {
        console.error("Search failed:", error);
      }
    },

    selectResult(result) {
      this.query = result.title;
      this.isOpen = false;
      window.location.href = result.url;
    },

    init() {
      // Close search on outside click
      document.addEventListener("click", (e) => {
        if (!this.$el.contains(e.target)) {
          this.isOpen = false;
        }
      });
    },
  }));

  // Notification Component
  Alpine.data("notification", () => ({
    message: "",
    type: "info", // info, success, warning, error
    show: false,
    duration: 5000,

    showNotification(message, type = "info", duration = 5000) {
      this.message = message;
      this.type = type;
      this.duration = duration;
      this.show = true;

      setTimeout(() => {
        this.hide();
      }, duration);
    },

    hide() {
      this.show = false;
    },

    init() {
      // Listen for global notification events
      document.addEventListener("notification", (e) => {
        this.showNotification(e.detail.message, e.detail.type, e.detail.duration);
      });
    },
  }));

  // Theme Toggle Component
  Alpine.data("themeToggle", () => ({
    darkMode: false,

    init() {
      // Check for saved theme preference or default to light mode
      this.darkMode = localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);

      this.updateTheme();

      // Listen for system theme changes
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.darkMode = e.matches;
          this.updateTheme();
        }
      });
    },

    toggle() {
      this.darkMode = !this.darkMode;
      this.updateTheme();
      localStorage.setItem("theme", this.darkMode ? "dark" : "light");
    },

    updateTheme() {
      if (this.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  }));

  // Back to Top Component
  Alpine.data("backToTop", () => ({
    show: false,
    threshold: 300,

    init() {
      window.addEventListener("scroll", () => {
        this.show = window.scrollY > this.threshold;
      });
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  }));

  // Image Gallery Component
  Alpine.data("imageGallery", () => ({
    images: [],
    currentIndex: 0,
    isOpen: false,

    open(index = 0) {
      this.currentIndex = index;
      this.isOpen = true;
      document.body.style.overflow = "hidden";
    },

    close() {
      this.isOpen = false;
      document.body.style.overflow = "auto";
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },

    previous() {
      this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    },

    init() {
      // Close on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      });
    },
  }));

  // Utility Functions
  Alpine.data("utils", () => ({
    // Debounce function
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle(func, limit) {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    // Copy to clipboard
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.showNotification("Copied to clipboard!", "success");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    },

    // Format number with commas
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Generate random ID
    generateId() {
      return Math.random().toString(36).substr(2, 9);
    },
  }));
});

// Global utility functions
window.EcoprismUtils = {
  // Show notification
  notify(message, type = "info", duration = 5000) {
    document.dispatchEvent(
      new CustomEvent("notification", {
        detail: { message, type, duration },
      })
    );
  },

  // Format date
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", { ...defaultOptions, ...options }).format(date);
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  },
};
