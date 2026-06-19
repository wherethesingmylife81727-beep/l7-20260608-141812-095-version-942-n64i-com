(function () {
  var button = document.querySelector('[data-menu-button]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (button && panel) {
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-off');
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-hero-thumb]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function setHero(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    thumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle('is-active', thumbIndex === current);
    });
  }

  function beginHero() {
    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(function () {
      setHero(current + 1);
    }, 5200);
  }

  if (slides.length) {
    setHero(0);
    beginHero();

    if (prev) {
      prev.addEventListener('click', function () {
        setHero(current - 1);
        beginHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setHero(current + 1);
        beginHero();
      });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () {
        setHero(index);
        beginHero();
      });
    });
  }

  var filterRoot = document.querySelector('[data-filter-root]');

  if (filterRoot) {
    var keywordInput = filterRoot.querySelector('[data-filter-keyword]');
    var regionSelect = filterRoot.querySelector('[data-filter-region]');
    var yearSelect = filterRoot.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-card]'));
    var empty = filterRoot.querySelector('[data-empty]');

    function applyFilter() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var region = regionSelect ? regionSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okRegion = !region || cardRegion.indexOf(region) !== -1;
        var okYear = !year || cardYear === year;
        var show = okKeyword && okRegion && okYear;

        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [keywordInput, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  }
})();
