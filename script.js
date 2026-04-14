// ===================================
// PORTFOLIO JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initParticles();
    initHeroSpotlight();
    initTypingEffect();
    initCountUpStats();
    initCardTilt();
    initStaggeredCards();
    initSmoothScrolling();
    initActiveNavigation();
    initBackToTop();
    initSectionAnimations();
});

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
// STAGGERED CARD ANIMATIONS
// ===================================
function initStaggeredCards() {
    // Project cards — opacity only (transform reserved for 3D tilt)
    document.querySelectorAll('.project-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 110}ms`;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { card.classList.add('animate-in'); obs.disconnect(); }
        }, { threshold: 0.08 });
        obs.observe(card);
    });

    // Everything else — opacity + translateY
    ['.experience-item', '.skill-category', '.education-item', '.contact-item'].forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.style.transitionDelay = `${i * 90}ms`;
            const obs = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) { el.classList.add('animate-in'); obs.disconnect(); }
            }, { threshold: 0.1 });
            obs.observe(el);
        });
    });
}

// ===================================
// CANVAS PARTICLE SYSTEM
// ===================================
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COLORS = ['96,165,250', '167,139,250', '34,211,238'];
    const COUNT  = 90;
    const DIST   = 130;

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.init(); }
        init() {
            this.x     = Math.random() * canvas.width;
            this.y     = Math.random() * canvas.height;
            this.vx    = (Math.random() - 0.5) * 0.35;
            this.vy    = (Math.random() - 0.5) * 0.35;
            this.r     = Math.random() * 1.4 + 0.4;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.35 + 0.08;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: COUNT }, () => new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(96,165,250,${0.15 * (1 - dist / DIST)})`;
                    ctx.lineWidth   = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    let rafId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        rafId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else animate();
    });
}

// ===================================
// MOUSE SPOTLIGHT
// ===================================
function initHeroSpotlight() {
    const header    = document.querySelector('header');
    const spotlight = document.querySelector('.spotlight');
    if (!header || !spotlight) return;

    header.addEventListener('mousemove', (e) => {
        const r = header.getBoundingClientRect();
        spotlight.style.setProperty('--mx', ((e.clientX - r.left)  / r.width  * 100).toFixed(1) + '%');
        spotlight.style.setProperty('--my', ((e.clientY - r.top)   / r.height * 100).toFixed(1) + '%');
    });
}

// ===================================
// 3D CARD TILT
// ===================================
function initCardTilt() {
    const MAX = 8;

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'border-color 0.3s, background 0.3s, box-shadow 0.3s';
        });

        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x  = (e.clientX - left) / width  - 0.5;
            const y  = (e.clientY - top)  / height - 0.5;
            const rX = (-y * MAX * 2).toFixed(2);
            const rY = ( x * MAX * 2).toFixed(2);
            card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-7px) scale(1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'border-color 0.3s, background 0.3s, box-shadow 0.3s, transform 0.5s cubic-bezier(0.23,1,0.32,1)';
            card.style.transform  = '';
        });
    });
}

// ===================================
// TYPING EFFECT
// ===================================
function initTypingEffect() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Software Engineer',
        'Distributed Systems Engineer',
        'Full-Stack Developer',
        'Cloud & Backend Specialist',
    ];

    let pi = 0, ci = 0, deleting = false;

    function tick() {
        const cur = phrases[pi];
        el.textContent = deleting ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
        deleting ? ci-- : ci++;

        if (!deleting && ci === cur.length) {
            deleting = true;
            setTimeout(tick, 2000);
            return;
        }
        if (deleting && ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            setTimeout(tick, 400);
            return;
        }
        setTimeout(tick, deleting ? 38 : 68);
    }
    tick();
}

// ===================================
// COUNT-UP STATS
// ===================================
function initCountUpStats() {
    const els = document.querySelectorAll('.stat-number[data-target]');
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
// SMOOTH SCROLLING
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
// ACTIVE NAV
// ===================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('nav a[href^="#"]');

    function update() {
        let cur = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 220) cur = s.getAttribute('id');
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

// ===================================
// BACK TO TOP
// ===================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===================================
// SECTION ANIMATIONS
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
console.log('%c👋 Hey recruiter!', 'color: #3b82f6; font-size: 20px; font-weight: 800;');
console.log('%c🚀 Nilesh Parmar — Software Engineer', 'color: #a78bfa; font-size: 14px; font-weight: 600;');
console.log('%c📧 nilesh097parmar@gmail.com', 'color: #34d399; font-size: 12px;');
console.log('%c✨ Canvas particles, 3D tilt, aurora blobs, conic avatar — pure HTML/CSS/JS.', 'color: #64748b; font-size: 11px;');
