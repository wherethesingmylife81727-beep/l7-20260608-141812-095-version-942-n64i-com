(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var heroSlides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === heroIndex);
    });

    heroDots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === heroIndex);
    });
  }

  heroDots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showHeroSlide(dotIndex);
    });
  });

  if (heroSlides.length > 1) {
    window.setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5200);
  }

  var redirectForms = Array.prototype.slice.call(document.querySelectorAll("[data-site-search-form]"));

  redirectForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[type='search']");
      var value = input ? input.value.trim() : "";
      var target = "./search.html";

      if (value) {
        target += "?q=" + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  });

  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search]"));
  var searchInput = document.getElementById("siteSearch");
  var yearFilter = document.getElementById("yearFilter");
  var typeFilter = document.getElementById("typeFilter");
  var regionFilter = document.getElementById("regionFilter");
  var clearButton = document.querySelector("[data-clear-search]");
  var noResults = document.querySelector("[data-no-results]");

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(searchInput && searchInput.value);
    var year = yearFilter ? yearFilter.value : "";
    var type = typeFilter ? typeFilter.value : "";
    var region = regionFilter ? regionFilter.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      var yearOk = !year || card.getAttribute("data-year") === year;
      var typeOk = !type || card.getAttribute("data-type") === type;
      var regionOk = !region || card.getAttribute("data-region") === region;
      var keywordOk = !keyword || text.indexOf(keyword) !== -1;
      var show = yearOk && typeOk && regionOk && keywordOk;

      card.style.display = show ? "" : "none";

      if (show) {
        visible += 1;
      }
    });

    if (noResults) {
      noResults.classList.toggle("is-visible", visible === 0);
    }
  }

  if (searchInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
      searchInput.value = query;
    }

    searchInput.addEventListener("input", applyFilters);
  }

  [yearFilter, typeFilter, regionFilter].forEach(function (control) {
    if (control) {
      control.addEventListener("change", applyFilters);
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (searchInput) {
        searchInput.value = "";
      }

      [yearFilter, typeFilter, regionFilter].forEach(function (control) {
        if (control) {
          control.value = "";
        }
      });

      applyFilters();
    });
  }

  applyFilters();
})();
