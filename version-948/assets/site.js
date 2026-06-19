(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";

        if (query) {
          event.preventDefault();
          window.location.href = "./search.html?q=" + encodeURIComponent(query);
        }
      });
    });

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var search = scope.querySelector("[data-filter-search]");
      var type = scope.querySelector("[data-filter-type]");
      var region = scope.querySelector("[data-filter-region]");
      var year = scope.querySelector("[data-filter-year]");
      var items = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]"));
      var empty = scope.querySelector("[data-empty-state]");

      function applyFilter() {
        var queryValue = normalize(search && search.value);
        var typeValue = normalize(type && type.value);
        var regionValue = normalize(region && region.value);
        var yearValue = normalize(year && year.value);
        var visible = 0;

        items.forEach(function (item) {
          var titleText = normalize(item.getAttribute("data-title"));
          var typeText = normalize(item.getAttribute("data-type"));
          var regionText = normalize(item.getAttribute("data-region"));
          var yearText = normalize(item.getAttribute("data-year"));
          var tagText = normalize(item.getAttribute("data-tags"));
          var bodyText = normalize(item.textContent);
          var queryMatch = !queryValue || titleText.indexOf(queryValue) !== -1 || tagText.indexOf(queryValue) !== -1 || bodyText.indexOf(queryValue) !== -1;
          var typeMatch = !typeValue || typeText.indexOf(typeValue) !== -1;
          var regionMatch = !regionValue || regionText.indexOf(regionValue) !== -1;
          var yearMatch = !yearValue || yearText.indexOf(yearValue) !== -1;
          var matched = queryMatch && typeMatch && regionMatch && yearMatch;

          item.hidden = !matched;

          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [search, type, region, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && search) {
        search.value = q;
      }
      applyFilter();
    });
  });
})();
