/**
 * CSRD Adoption page — /csrd-adoption.html
 */
(function () {
  function loadFooter() {
    var container = document.getElementById("footer-container");
    if (!container) return;
    var url =
      typeof getVersionedUrl === "function"
        ? getVersionedUrl("/v3/components/footer.html")
        : "/v3/components/footer.html?v=" + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, "0") + String(new Date().getDate()).padStart(2, "0");
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
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  window.caPlatformShowcase = function () {
    return {
      active: 0,
      slides: [
        "/assets/img/photos/csrd/reports.webp",
        "/assets/img/photos/csrd/dashboard.webp",
        "/assets/img/photos/csrd/targets.webp",
        "/assets/img/photos/csrd/ui-mockup.webp",
      ],
      timer: null,
      intervalMs: 5000,
      get count() {
        return this.slides.length;
      },
      prev: function () {
        this.active = (this.active - 1 + this.count) % this.count;
        this.restartAutoplay();
      },
      next: function () {
        this.active = (this.active + 1) % this.count;
        this.restartAutoplay();
      },
      goTo: function (i) {
        this.active = i;
        this.restartAutoplay();
      },
      restartAutoplay: function () {
        this.pause();
        this.resume();
      },
      resume: function () {
        var self = this;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        this.timer = setInterval(function () {
          self.active = (self.active + 1) % self.count;
        }, this.intervalMs);
      },
      pause: function () {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
      },
      init: function () {
        this.resume();
      },
    };
  };

  function initResourcesCarousel() {
    var track = document.getElementById("caad-resources-track");
    if (!track) return;

    function updateArrowStates() {
      var atStart = track.scrollLeft <= 0;
      var atEnd = Math.abs(track.scrollWidth - track.scrollLeft - track.clientWidth) < 1;

      document.querySelectorAll("[data-resources-prev]").forEach(function (btn) {
        btn.disabled = atStart;
      });
      document.querySelectorAll("[data-resources-next]").forEach(function (btn) {
        btn.disabled = atEnd;
      });
    }

    function scrollBy(direction) {
      var slide = track.querySelector(".caad-resource-slide");
      var gap = 16;
      var amount = slide ? slide.offsetWidth + gap : 320;
      track.scrollBy({ left: direction * amount, behavior: "smooth" });
      setTimeout(updateArrowStates, 300);
    }

    document.querySelectorAll("[data-resources-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        scrollBy(-1);
      });
    });
    document.querySelectorAll("[data-resources-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        scrollBy(1);
      });
    });

    track.addEventListener("scroll", updateArrowStates);
    updateArrowStates();
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadFooter();
    initScrollReveals();
    initResourcesCarousel();
  });
})();
