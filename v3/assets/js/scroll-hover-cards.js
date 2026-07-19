/**
 * Scroll-activated card highlights — homepage ESG Consulting & case study solution sections.
 * Usage: <div class="space-y-6" x-data="scrollHoverCards()">
 */
(function () {
  function scrollHoverCards() {
    return {
      activeCard: -1,
      cards: [],
      _scrollHandler: null,

      init() {
        this.cards = this.$el.querySelectorAll("[data-scroll-card]");
        if (!this.cards.length) {
          this.cards = this.$el.querySelectorAll(".rounded-lg.p-6");
        }
        this._scrollHandler = () => this.updateActiveCard();
        this.updateActiveCard();
        window.addEventListener("scroll", this._scrollHandler, { passive: true });
        window.addEventListener("resize", this._scrollHandler, { passive: true });
      },

      destroy() {
        if (this._scrollHandler) {
          window.removeEventListener("scroll", this._scrollHandler);
          window.removeEventListener("resize", this._scrollHandler);
        }
      },

      updateActiveCard() {
        const section = this.$el.closest("section");
        if (!section || !this.cards.length) return;

        const sectionRect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        const sectionTop = scrollTop + sectionRect.top;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        const viewportTop = scrollTop;
        const viewportBottom = scrollTop + windowHeight;

        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        const visibleHeight = visibleBottom - visibleTop;
        const minVisibleHeight = windowHeight * 0.3;

        if (visibleHeight >= minVisibleHeight) {
          const viewportCenter = scrollTop + windowHeight / 2;
          const scrollProgress = Math.max(0, Math.min(1, (viewportCenter - sectionTop) / sectionHeight));
          const cardCount = this.cards.length;
          const newActiveCard = Math.min(cardCount - 1, Math.max(0, Math.floor(scrollProgress * cardCount)));

          if (newActiveCard !== this.activeCard) {
            this.activeCard = newActiveCard;
          }
        } else if (this.activeCard !== -1) {
          this.activeCard = -1;
        }
      },
    };
  }

  window.scrollHoverCards = scrollHoverCards;

  document.addEventListener("alpine:init", function () {
    if (window.Alpine) {
      Alpine.data("scrollHoverCards", scrollHoverCards);
    }
  });
})();
