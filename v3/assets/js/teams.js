/**
 * Teams page — /our-team.html
 */
(function () {
  function loadFooter() {
    var container = document.getElementById("footer-container");
    if (!container) return;
    var url = typeof getVersionedUrl === "function" ? getVersionedUrl("/v3/components/footer.html") : "/v3/components/footer.html?v=" + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, "0") + String(new Date().getDate()).padStart(2, "0");
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

  window.teamsPage = function () {
    return {
      teamQuote: "Sustainability experts, technologists and designers united by one goal: making ESG data actionable",
      leadership: [
        {
          name: "Nagendra Siddoutam",
          role: "Founder",
          bio: "Naga founded ecoPRISM in 2022 to help organizations treat sustainability data with the same discipline they apply to financial reporting. With an Oxford MBA and more than 15 years building enterprise relationships across Europe, he works with leadership teams on software and advisory they can stand behind in the boardroom.",
          image: "/v3/assets/img/team/naga.webp",
          linkedin: "https://www.linkedin.com/in/siddoutam/",
        },
        {
          name: "Vishakha Goel",
          role: "Chief Executive Officer",
          bio: "Vishakha leads sustainability strategy and client delivery at ecoPRISM. She previously worked in EY's Climate Change and Sustainability Services on GHG accounting, CSRD, BRSR, and assurance-ready reporting, and holds an MBA in Sustainable Management from IIM Lucknow.",
          image: "/v3/assets/img/team/vishakha.webp",
          linkedin: "https://www.linkedin.com/in/vishakha-goel-31762742/",
        },
        {
          name: "Sudiendra Siddautam",
          role: "Chief Technology Officer",
          bio: "Sudhie leads the technology behind ecoPRISM's platform. With two decades building enterprise SaaS and AI systems at Amazon, Microsoft, and beyond, he focuses on architecture that remains reliable as reporting frameworks, data volumes, and audit expectations grow.",
          image: "/v3/assets/img/team/sudhie.webp",
          linkedin: "https://www.linkedin.com/in/sudhiesiddautam",
        },
      ],
      members: [
        { name: "Navaneeth Rajendran", role: "ESG Solution Specialist", image: "/assets/img/avatars/navaneeth.webp", linkedin: "https://www.linkedin.com/in/navaneeth-rajendran" },
        { name: "Valli Vinoth", role: "ESG Analyst", image: "/assets/img/avatars/val.webp", linkedin: "https://www.linkedin.com/in/valli-tirounavoucarassou-504055108/" },
        { name: "Faruk Gundagi", role: "Business Development", image: "/assets/img/avatars/faruk.webp", linkedin: "https://www.linkedin.com/in/faruk-gundagi-8681b2215/" },
        { name: "Vasini Singh", role: "Senior Product Designer", image: "/assets/img/avatars/vasini.webp", linkedin: "https://in.linkedin.com/in/vasini-singh-18a442205" },
        { name: "Pranjal Mathur", role: "Senior ESG Platform Developer", image: "/assets/img/avatars/t8.webp", linkedin: "https://in.linkedin.com/in/pranjal-mathur-217bbb61" },
        { name: "Neeraj Dandotiya", role: "Senior ESG Platform Developer", image: "/assets/img/avatars/t9.webp", linkedin: "https://in.linkedin.com/in/neeraj-dandotiya-14253460" },
        { name: "Sukruti Konhar", role: "ESG Platform Developer", image: "/assets/img/avatars/sukruti1.webp", linkedin: "https://www.linkedin.com/in/sukrutikonhar/" },
        { name: "Avan Gogineni", role: "ESG Platform Developer", image: "/assets/img/avatars/avan.webp", linkedin: "https://www.linkedin.com/in/avangogineni/" },
      ],
      membersTopRow() {
        return this.members.slice(0, 3);
      },
      memberVasini() {
        return this.members[3];
      },
      memberPranjal() {
        return this.members[4];
      },
      membersBottomRow() {
        return this.members.slice(5);
      },
      hasPhoto(member) {
        return Boolean(member.image);
      },
      hasLinkedin(member) {
        return Boolean(member.linkedin);
      },
    };
  };

  document.addEventListener("DOMContentLoaded", function () {
    loadFooter();
    initScrollReveals();
  });
})();
