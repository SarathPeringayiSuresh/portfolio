/* Graphs and progressive enhancement; all portfolio content works without JavaScript. */
(() => {
    document.documentElement.classList.add('js');
    const clock = document.getElementById('local-time');
    const updateClock = () => {
        if (clock) clock.textContent = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit', hour12: false,
        }).format(new Date());
    };
    updateClock();
    setInterval(updateClock, 30000);
    document.getElementById('year').textContent = new Date().getFullYear();

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');
    const closeNav = () => {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
    };
    toggle.addEventListener('click', () => {
        const open = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeNav(); });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
            closeNav();
            toggle.focus();
        }
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.site-header')) closeNav();
    });
    const wideScreen = window.matchMedia('(min-width: 761px)');
    wideScreen.addEventListener('change', closeNav);

    const descriptions = [
        'Connect product, support, CRM and feedback data. Start with the source, not the assumption.',
        'Validate IDs, units and assumptions. Benchmark the system and measure uncertainty before trusting a result.',
        'Put findings in context. Ground AI output in source evidence and keep human review where it matters.',
        'Bring the result into everyday work: useful interfaces, clear recommendations and feedback that improves the system.',
    ];
    const engine = document.querySelector('.engine');
    const buttons = Array.from(document.querySelectorAll('.stage-button'));
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const selected = Number(button.dataset.stage);
            engine.dataset.selected = String(selected);
            buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
            engine.querySelectorAll('.flow-layer').forEach((layer) => {
                const level = Number(layer.dataset.layer);
                layer.classList.toggle('is-highlighted', level === selected || level === selected - 1);
            });
            document.getElementById('stage-description').textContent = descriptions[selected];
        });
    });
    if ('IntersectionObserver' in window) {
        const links = Array.from(nav.querySelectorAll('a'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((link) => {
                    const active = link.dataset.section === entry.target.id;
                    link.classList.toggle('active', active);
                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-10% 0px -65% 0px' });
        links.forEach((link) => {
            const section = document.getElementById(link.dataset.section);
            if (section) observer.observe(section);
        });
    }
})();
