(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('.hero-slide'));
        const dots = Array.from(hero.querySelectorAll('.hero-dot'));
        let current = 0;

        function showSlide(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide((current + 1) % slides.length);
            }, 5600);
        }
    }

    const filterInputs = document.querySelectorAll('[data-filter-input]');

    filterInputs.forEach(function (input) {
        const scopeSelector = input.getAttribute('data-filter-scope');
        const scope = scopeSelector ? document.querySelector(scopeSelector) : document;
        const cards = scope ? Array.from(scope.querySelectorAll('[data-card]')) : [];

        input.addEventListener('input', function () {
            const value = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                const text = (card.getAttribute('data-text') || '').toLowerCase();
                card.style.display = text.indexOf(value) >= 0 ? '' : 'none';
            });
        });
    });

    const typeSelect = document.querySelector('[data-type-filter]');
    const yearSelect = document.querySelector('[data-year-filter]');
    const filterList = document.querySelector('[data-filter-list]');

    function applySelectFilters() {
        if (!filterList) {
            return;
        }

        const typeValue = typeSelect ? typeSelect.value : '';
        const yearValue = yearSelect ? yearSelect.value : '';
        const cards = Array.from(filterList.querySelectorAll('[data-card]'));

        cards.forEach(function (card) {
            const typeMatch = !typeValue || card.getAttribute('data-type') === typeValue;
            const yearMatch = !yearValue || card.getAttribute('data-year') === yearValue;
            card.style.display = typeMatch && yearMatch ? '' : 'none';
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', applySelectFilters);
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', applySelectFilters);
    }

    const searchRoot = document.getElementById('searchResults');

    if (searchRoot && window.SEARCH_MOVIES) {
        const params = new URLSearchParams(window.location.search);
        const input = document.getElementById('searchInput');
        const query = (params.get('q') || '').trim();

        if (input) {
            input.value = query;
        }

        function cardTemplate(item) {
            return [
                '<a class="movie-card" href="' + item.link + '" data-card data-text="' + escapeHtml(item.title + ' ' + item.tags + ' ' + item.region + ' ' + item.type) + '">',
                '<div class="poster-frame"><img src="' + item.poster + '" alt="' + escapeHtml(item.title) + '" loading="lazy"><div class="poster-badges"><span class="small-pill cyan">' + escapeHtml(item.category) + '</span><span class="small-pill">' + escapeHtml(item.year) + '</span></div></div>',
                '<div class="card-body"><h2>' + escapeHtml(item.title) + '</h2><p>' + escapeHtml(item.oneLine) + '</p><div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div></div>',
                '</a>'
            ].join('');
        }

        function escapeHtml(value) {
            return String(value).replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            });
        }

        const lowered = query.toLowerCase();
        const results = lowered
            ? window.SEARCH_MOVIES.filter(function (item) {
                return (item.title + ' ' + item.tags + ' ' + item.region + ' ' + item.type + ' ' + item.year).toLowerCase().indexOf(lowered) >= 0;
            }).slice(0, 120)
            : window.SEARCH_MOVIES.slice(0, 60);

        searchRoot.innerHTML = results.length
            ? results.map(cardTemplate).join('')
            : '<div class="empty-note">未找到匹配内容，可换一个片名、地区、类型或年份再试。</div>';
    }
})();
