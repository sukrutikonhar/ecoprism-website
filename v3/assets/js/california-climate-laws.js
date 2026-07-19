/**
 * California Climate Laws explained page
 * /resources/california-climate-laws-explained.html
 */
(function () {
  function loadFooter() {
    var container = document.getElementById("footer-container");
    if (!container) return;
    var url =
      typeof getVersionedUrl === "function"
        ? getVersionedUrl("/v3/components/footer.html")
        : "/v3/components/footer.html?v=" +
          new Date().getFullYear() +
          String(new Date().getMonth() + 1).padStart(2, "0") +
          String(new Date().getDate()).padStart(2, "0");
    fetch(url)
      .then(function (r) {
        return r.text();
      })
      .then(function (data) {
        container.innerHTML = data;
      })
      .catch(function (e) {
        console.error("Error loading footer:", e);
      });
  }

  function initScrollReveals() {
    var nodes = document.querySelectorAll(".js-reveal");
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.caBlogSlider = function () {
    return {
      active: 0,
      count: 3,
      perPage: 1,
      timer: null,
      intervalMs: 5000,
      get maxIndex() {
        return Math.max(0, this.count - this.perPage);
      },
      get slideCount() {
        return this.maxIndex + 1;
      },
      get trackStyle() {
        if (this.perPage === 2) {
          return (
            "transform: translateX(calc(-" +
            this.active +
            " * (50% + 0.75rem)))"
          );
        }
        return "transform: translateX(-" + this.active * 100 + "%)";
      },
      updatePerPage: function () {
        this.perPage = window.matchMedia("(min-width: 1024px)").matches
          ? 2
          : 1;
        if (this.active > this.maxIndex) {
          this.active = this.maxIndex;
        }
      },
      init: function () {
        var self = this;
        this.updatePerPage();
        window.addEventListener("resize", function () {
          self.updatePerPage();
        });
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }
        this.resume();
      },
      resume: function () {
        var self = this;
        this.pause();
        this.timer = window.setInterval(function () {
          self.active = (self.active + 1) % (self.maxIndex + 1);
        }, this.intervalMs);
      },
      pause: function () {
        if (this.timer) {
          window.clearInterval(this.timer);
          this.timer = null;
        }
      },
      goTo: function (index) {
        this.active = Math.min(index, this.maxIndex);
        this.pause();
        this.resume();
      },
    };
  };

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(loadFooter, 100);
    initScrollReveals();
  });
})();
