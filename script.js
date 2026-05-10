// ===================================
// PORTFOLIO JAVASCRIPT — BRUTALIST EDITION
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initScrollProgress();
    initSnow();
    initCursor();
    initHamburger();
    initCountUpStats();
    initStaggeredCards();
    initSmoothScrolling();
    initBackToTop();
    initSectionAnimations();
});

function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) {
        document.body.classList.add('hero-loaded');
        return;
    }
    const numEl  = loader.querySelector('.loader-num');
    const fillEl = loader.querySelector('.loader-fill');
    const DURATION = 1600;

    document.body.style.overflow = 'hidden';

    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / DURATION, 1);
        // Ease-out so the count slows toward 100
        const eased = 1 - Math.pow(1 - t, 2.2);
        const pct   = Math.floor(eased * 100);
        if (numEl)  numEl.textContent = String(pct).padStart(2, '0');
        if (fillEl) fillEl.style.width = (eased * 100) + '%';
        if (t < 1) {
            requestAnimationFrame(tick);
        } else {
            // Hold a beat at 100, then dissolve
            setTimeout(() => {
                loader.classList.add('done');
                document.body.style.overflow = '';
                // Kick off hero reveal slightly before loader fully fades
                document.body.classList.add('hero-loaded');
            }, 220);
            // Strip loader from DOM after the fade so it can't intercept events
            setTimeout(() => loader.remove(), 1200);
        }
    }
    requestAnimationFrame(tick);
}

// ===================================
// SCROLL PROGRESS BAR
// ===================================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / max * 100).toFixed(2) + '%';
    }, { passive: true });
}

// ===================================
// SNOW / DUST PARTICLES — fixed background
// ===================================
function initSnow() {
    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COUNT = 70;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Flake {
        constructor() { this.init(true); }
        init(initial) {
            this.x  = Math.random() * canvas.width;
            this.y  = initial ? Math.random() * canvas.height : -10;
            this.vx = (Math.random() - 0.5) * 0.18;
            this.vy = Math.random() * 0.35 + 0.08;
            this.r  = Math.random() * 1.4 + 0.3;
            this.a  = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y > canvas.height + 5 || this.x < -5 || this.x > canvas.width + 5) this.init(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.a})`;
            ctx.fill();
        }
    }

    const flakes = Array.from({ length: COUNT }, () => new Flake());

    let rafId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        flakes.forEach(f => { f.update(); f.draw(); });
        rafId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else animate();
    });
}

// ===================================
// CUSTOM CURSOR — smooth lerp follow
// ===================================
function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    if (window.matchMedia('(hover: none)').matches) {
        cursor.style.display = 'none';
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function tick() {
        curX += (mouseX - curX) * 0.18;
        curY += (mouseY - curY) * 0.18;
        cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
    }
    tick();

    // Hover scale on interactive elements (skip labeled ones — they get a pill instead)
    document.querySelectorAll('a, button, .skill-tag-inline, input, textarea').forEach(el => {
        if (el.hasAttribute('data-cursor') || el.closest('[data-cursor]')) return;
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Labeled cursor (pill with text) for elements with [data-cursor]
    const label = cursor.querySelector('.cursor-label');
    document.querySelectorAll('[data-cursor]').forEach(el => {
        const text = el.dataset.cursor;
        el.addEventListener('mouseenter', () => {
            cursor.classList.remove('hover');
            cursor.classList.add('has-label');
            if (label) label.textContent = text;
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('has-label');
            if (label) label.textContent = '';
        });
    });
}

// ===================================
// HAMBURGER MENU
// ===================================
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const panel = document.getElementById('menuPanel');
    if (!btn || !panel) return;

    function close() {
        btn.classList.remove('open');
        panel.classList.remove('open');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        const isOpen = btn.classList.toggle('open');
        panel.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ===================================
// COUNT-UP STATS
// ===================================
function initCountUpStats() {
    const els = document.querySelectorAll('[data-target]');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);

            const el     = entry.target;
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const steps  = 50;
            let   step   = 0;

            const timer = setInterval(() => {
                step++;
                el.textContent = Math.round(Math.min((target / steps) * step, target)) + suffix;
                if (step >= steps) clearInterval(timer);
            }, 1400 / steps);
        });
    }, { threshold: 0.5 });

    els.forEach(el => obs.observe(el));
}

// ===================================
// STAGGERED CARD ANIMATIONS
// ===================================
function initStaggeredCards() {
    ['.experience-item', '.skill-category', '.education-item', '.contact-item', '.project-card'].forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.style.transitionDelay = `${i * 80}ms`;
            const obs = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) { el.classList.add('animate-in'); obs.disconnect(); }
            }, { threshold: 0.1 });
            obs.observe(el);
        });
    });
}

// ===================================
// SMOOTH SCROLLING (anchor)
// ===================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
}

// ===================================
// BACK TO TOP
// ===================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===================================
// SECTION FADE-INS
// ===================================
function initSectionAnimations() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in-section').forEach(el => obs.observe(el));
}

// ===================================
// CONSOLE
// ===================================
console.log('%cNilesh Parmar — Software Engineer', 'color: #3df54d; font-size: 14px; font-weight: 700; letter-spacing: 0.1em;');
console.log('%cnilesh097parmar@gmail.com', 'color: #999; font-size: 11px;');
