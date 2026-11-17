/* =========================================================
   Sarath Peringayi Suresh portfolio — interactivity
   ========================================================= */

(() => {
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

})();
