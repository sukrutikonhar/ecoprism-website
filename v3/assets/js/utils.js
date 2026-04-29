// Utility functions for Ecoprism Website

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
  const elementPosition = element.offsetTop - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: "smooth",
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
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
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification("Copied to clipboard!", "success");
  } catch (err) {
    console.error("Failed to copy: ", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showNotification("Copied to clipboard!", "success");
  }
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate random ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Format date
function formatDate(date, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", { ...defaultOptions, ...options }).format(date);
}

// Show notification
function showNotification(message, type = "info", duration = 5000) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

  // Set notification styles based on type
  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  notification.className += ` ${styles[type] || styles.info}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  // Auto remove
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener("DOMContentLoaded", lazyLoadImages);

// Preload critical images
function preloadImages(urls) {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

// Get element offset from top of page
function getOffsetTop(element) {
  let offsetTop = 0;
  do {
    if (!isNaN(element.offsetTop)) {
      offsetTop += element.offsetTop;
    }
  } while ((element = element.offsetParent));
  return offsetTop;
}

// Animate counter
function animateCounter(element, start, end, duration = 2000) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    element.textContent = current;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

// Handle form submission
async function handleFormSubmission(form, endpoint) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showNotification("Message sent successfully!", "success");
      form.reset();
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    console.error("Error:", error);
    showNotification("Failed to send message. Please try again.", "error");
  }
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Show/hide scroll to top button
function initScrollToTop() {
  const button = document.querySelector(".scroll-to-top");
  if (!button) return;

  const toggleButton = throttle(() => {
    if (window.scrollY > 300) {
      button.classList.add("opacity-100", "pointer-events-auto");
      button.classList.remove("opacity-0", "pointer-events-none");
    } else {
      button.classList.add("opacity-0", "pointer-events-none");
      button.classList.remove("opacity-100", "pointer-events-auto");
    }
  }, 100);

  window.addEventListener("scroll", toggleButton);
  button.addEventListener("click", scrollToTop);
}

// Initialize scroll to top when DOM is ready
document.addEventListener("DOMContentLoaded", initScrollToTop);

// Export functions for use in other scripts
window.EcoprismUtils = {
  scrollToElement,
  debounce,
  throttle,
  copyToClipboard,
  formatNumber,
  generateId,
  isValidEmail,
  formatDate,
  showNotification,
  lazyLoadImages,
  preloadImages,
  isInViewport,
  getOffsetTop,
  animateCounter,
  handleFormSubmission,
  scrollToTop,
  initScrollToTop,
};
