(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initHeader() {
        var header = document.querySelector("[data-site-header]");
        var toggle = document.querySelector("[data-mobile-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        function syncHeader() {
            if (!header) {
                return;
            }
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        }

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        syncHeader();
        window.addEventListener("scroll", syncHeader, { passive: true });
    }

    function initHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot, current) {
            dot.addEventListener("click", function () {
                show(current);
                start();
            });
        });

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function uniqueValues(cards, attribute) {
        var values = [];
        cards.forEach(function (card) {
            var value = card.getAttribute(attribute);
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        return values.sort(function (left, right) {
            if (/^\d+$/.test(left) && /^\d+$/.test(right)) {
                return Number(right) - Number(left);
            }
            return left.localeCompare(right, "zh-Hans-CN");
        });
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var scope = panel.parentElement || document;
            var container = document.querySelector("[data-card-container]") || scope.querySelector("[data-card-container]");
            if (!container) {
                return;
            }

            var cards = Array.prototype.slice.call(container.querySelectorAll(".movie-card"));
            var keyword = panel.querySelector("[data-filter-keyword]");
            var region = panel.querySelector("[data-filter-region]");
            var year = panel.querySelector("[data-filter-year]");
            var category = panel.querySelector("[data-filter-category]");
            var empty = panel.querySelector("[data-filter-empty]");

            fillSelect(region, uniqueValues(cards, "data-region"));
            fillSelect(year, uniqueValues(cards, "data-year"));

            function apply() {
                var q = keyword ? keyword.value.trim().toLowerCase() : "";
                var regionValue = region ? region.value : "";
                var yearValue = year ? year.value : "";
                var categoryValue = category ? category.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-type"),
                        card.textContent
                    ].join(" ").toLowerCase();

                    var matches = true;
                    if (q && haystack.indexOf(q) === -1) {
                        matches = false;
                    }
                    if (regionValue && card.getAttribute("data-region") !== regionValue) {
                        matches = false;
                    }
                    if (yearValue && card.getAttribute("data-year") !== yearValue) {
                        matches = false;
                    }
                    if (categoryValue && card.textContent.indexOf(categoryValue) === -1) {
                        matches = false;
                    }

                    card.style.display = matches ? "" : "none";
                    if (matches) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [keyword, region, year, category].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            apply();
        });
    }

    ready(function () {
        initHeader();
        initHero();
        initFilters();
    });
}());
