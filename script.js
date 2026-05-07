/* =========================================================
   Sarath Peringayi Suresh portfolio — interactivity
   ========================================================= */

(() => {
    const ACCENT = '#00e5ff';
    const ACCENT_2 = '#00ffa3';
    const ACCENT_3 = '#ff5cad';
    const ACCENT_4 = '#ffb648';
    const TEXT_MUTED = '#8893b8';
    const BORDER = '#1e2742';

    /* ---------- Live Stockholm clock ---------- */
    const clockEl = document.getElementById('local-time');
    const updateClock = () => {
        if (!clockEl) return;
        try {
            const fmt = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/Stockholm',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
            clockEl.textContent = fmt.format(new Date());
        } catch (_) {
            const d = new Date();
            clockEl.textContent =
                String(d.getHours()).padStart(2, '0') + ':' +
                String(d.getMinutes()).padStart(2, '0');
        }
    };
    updateClock();
    setInterval(updateClock, 30 * 1000);

    /* ---------- Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Counter animation ---------- */
    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const value = Math.round(target * ease(t));
            el.textContent = value + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
    };

    const counters = document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        animateCounter(e.target);
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.4 }
        );
        counters.forEach((c) => io.observe(c));
    } else {
        counters.forEach(animateCounter);
    }

    /* ---------- Mobile drawer ---------- */
    const navToggle = document.querySelector('.nav-toggle');
    const backdrop = document.querySelector('.drawer-backdrop');
    const openDrawer = () => {
        document.body.classList.add('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.removeAttribute('hidden');
    };
    const closeDrawer = () => {
        document.body.classList.remove('nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    };
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) closeDrawer();
            else openDrawer();
        });
    }
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    /* ---------- Scrollspy for nav ---------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = Array.from(document.querySelectorAll('main .section'));
    const setActive = (id) => {
        navLinks.forEach((l) =>
            l.classList.toggle('active', l.dataset.section === id)
        );
    };
    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );
        sections.forEach((s) => spy.observe(s));
    }
    navLinks.forEach((l) =>
        l.addEventListener('click', (ev) => {
            const id = l.getAttribute('href').replace('#', '');
            const t = document.getElementById(id);
            if (t) {
                ev.preventDefault();
                t.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActive(id);
            }
            if (document.body.classList.contains('nav-open')) closeDrawer();
        })
    );

    /* ---------- Charts (wait for Chart.js) ---------- */
    const initCharts = () => {
        if (typeof Chart === 'undefined') {
            return setTimeout(initCharts, 80);
        }

        Chart.defaults.color = TEXT_MUTED;
        Chart.defaults.borderColor = BORDER;
        Chart.defaults.font.family =
            "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

        /* ----- Sparklines ----- */
        const sparkData = [
            { id: 'spark-1', color: ACCENT,
              data: [12, 18, 14, 22, 30, 28, 40, 55, 60, 70, 72, 75], down: true },
            { id: 'spark-2', color: ACCENT_2,
              data: [4, 8, 14, 20, 26, 30, 34, 38, 42, 46, 52, 60] },
            { id: 'spark-3', color: ACCENT_3,
              data: [2, 4, 5, 7, 9, 12, 14, 16, 17, 19, 20, 22] },
            { id: 'spark-4', color: ACCENT_4,
              data: [1, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5] },
        ];

        sparkData.forEach((s) => {
            const el = document.getElementById(s.id);
            if (!el) return;
            const ctx = el.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, 60);
            grad.addColorStop(0, s.color + '55');
            grad.addColorStop(1, s.color + '00');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: s.data.map((_, i) => i),
                    datasets: [
                        {
                            data: s.data,
                            borderColor: s.color,
                            backgroundColor: grad,
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false },
                    },
                    elements: { line: { borderJoinStyle: 'round' } },
                    animation: { duration: 1200, easing: 'easeOutCubic' },
                },
            });
        });

        /* ----- Radar (skills) ----- */
        const radarEl = document.getElementById('radarChart');
        if (radarEl) {
            new Chart(radarEl.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: [
                        'Python / SQL',
                        'ML & Modeling',
                        'Data Engineering',
                        'BI & Viz',
                        'Experimentation',
                        'Product Analytics',
                    ],
                    datasets: [
                        {
                            label: 'Proficiency',
                            data: [95, 82, 88, 90, 78, 85],
                            borderColor: ACCENT,
                            backgroundColor: 'rgba(0, 229, 255, 0.28)',
                            borderWidth: 2.5,
                            pointBackgroundColor: ACCENT,
                            pointBorderColor: '#07090f',
                            pointHoverRadius: 6,
                            pointRadius: 4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(30, 39, 66, 0.8)' },
                            grid: { color: 'rgba(30, 39, 66, 0.6)' },
                            min: 0,
                            max: 100,
                            ticks: {
                                display: false,
                                stepSize: 20,
                            },
                            pointLabels: {
                                color: '#c9d0e8',
                                font: { size: 11, weight: '500' },
                            },
                        },
                    },
                    animation: { duration: 1400, easing: 'easeOutQuart' },
                },
            });
        }

        /* ----- Bar (stack usage last 12 months) ----- */
        const barEl = document.getElementById('barChart');
        if (barEl) {
            const ctx = barEl.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, 280);
            grad.addColorStop(0, ACCENT);
            grad.addColorStop(1, 'rgba(0, 229, 255, 0.2)');
            const grad2 = ctx.createLinearGradient(0, 0, 0, 280);
            grad2.addColorStop(0, ACCENT_2);
            grad2.addColorStop(1, 'rgba(0, 255, 163, 0.15)');

            const isNarrow = () => window.innerWidth < 700;

            const barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Python', 'SQL', 'dbt', 'scikit-learn', 'Metabase', 'PostHog', 'pandas', 'Tableau'],
                    datasets: [
                        {
                            label: 'Daily',
                            data: [95, 92, 80, 70, 78, 65, 88, 45],
                            backgroundColor: grad,
                            borderRadius: 6,
                            borderSkipped: false,
                            barPercentage: 0.65,
                            categoryPercentage: 0.7,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f1424',
                            borderColor: BORDER,
                            borderWidth: 1,
                            padding: 10,
                            titleColor: '#fff',
                            bodyColor: TEXT_MUTED,
                            displayColors: false,
                            callbacks: {
                                label: (ctx) => ' usage · ' + ctx.parsed.y + '%',
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: TEXT_MUTED,
                                font: { size: 10 },
                                maxRotation: isNarrow() ? 60 : 0,
                                minRotation: isNarrow() ? 45 : 0,
                                autoSkip: false,
                            },
                            border: { color: BORDER },
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(30, 39, 66, 0.5)' },
                            ticks: {
                                color: TEXT_MUTED,
                                font: { size: 10 },
                                callback: (v) => v + '%',
                            },
                            border: { display: false },
                        },
                    },
                    animation: { duration: 1300, easing: 'easeOutCubic' },
                },
            });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const xTicks = barChart.options.scales.x.ticks;
                    xTicks.maxRotation = isNarrow() ? 60 : 0;
                    xTicks.minRotation = isNarrow() ? 45 : 0;
                    barChart.update();
                }, 150);
            });
        }
    };

    initCharts();
})();
