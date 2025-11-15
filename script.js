// ===================================
// ENHANCED PORTFOLIO JAVASCRIPT
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initActiveNavigation();
    initBackToTop();
    initSectionAnimations();
});

// ===================================
// SMOOTH SCROLLING
// ===================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ===================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = '';
            const href = link.getAttribute('href').substring(1);
            
            if (href === current) {
                link.style.color = 'var(--primary-color)';
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// ===================================
// BACK TO TOP BUTTON
// ===================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// SMOOTH SECTION ANIMATIONS
// ===================================
function initSectionAnimations() {
    const sections = document.querySelectorAll('.fade-in-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🚀 Welcome to Nilesh Parmar\'s Portfolio!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%c💼 Looking for a talented Software Engineer? Let\'s connect!', 'color: #6b7280; font-size: 12px;');
console.log('%c📧 Email: nilesh097parmar@gmail.com', 'color: #059669; font-size: 12px;');
console.log('%c✨ Portfolio Features: Smooth Animations | Visual Skills | Quick Stats', 'color: #667eea; font-size: 10px;');
