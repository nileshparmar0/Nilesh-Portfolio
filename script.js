// ===================================
// STREAMLINED PORTFOLIO JAVASCRIPT
// ===================================

// Global variables
let scene, camera, renderer;
let particles = [];
let matrixRainCanvas, matrixRainCtx;
let cursorTrailCanvas, cursorTrailCtx;
let cursorTrailPoints = [];
let voiceRecognition;
let audioContext;
let achievements = {
    firstVisit: false,
    scrolledHalf: false,
    clickedProject: false,
    usedVoice: false,
    foundEasterEgg: false,
    viewedAllSections: false
};
let visitedSections = new Set();
let magneticElements = [];

// ===================================
// INITIALIZATION
// ===================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting initialization...');
    initializePortfolio();
});

async function initializePortfolio() {
    console.log('%c🚀 INITIALIZING PORTFOLIO...', 'font-size: 20px; color: #00d4ff; font-weight: bold;');
    
    const loader = document.getElementById('loader');
    
    try {
        // Initialize all systems
        await initThreeJS();
        initMatrixRain();
        initCursorTrail();
        initSoundSystem();
        initVoiceCommands();
        initMagneticElements();
        initTimelineNavigator();
        initScrollAnimations();
        initAchievementSystem();
        initChatbot();
        initParticleSystem();
        initLetterAnimations();
        
        // Fade out loader
        setTimeout(() => {
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 500);
            }
            
            // Trigger first achievement
            triggerAchievement('firstVisit', '🎉 Welcome Explorer!', 'You discovered Nilesh\'s portfolio!');
            
            // Start animations
            startAllAnimations();
            
            // Play welcome sound
            playSound('welcome');
        }, 2000);
    } catch (error) {
        console.error('Initialization error:', error);
        if (loader) {
            loader.classList.add('fade-out');
        }
        startAllAnimations();
    }
}

// ===================================
// THREE.JS 3D HERO SECTION
// ===================================
async function initThreeJS() {
    return new Promise((resolve) => {
        const container = document.getElementById('hero-3d-canvas');
        if (!container || typeof THREE === 'undefined') {
            console.log('Three.js not available or container not found');
            resolve();
            return;
        }
        
        try {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x000000, 0.0008);
            
            // Camera
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / 400, 0.1, 1000);
            camera.position.z = 500;
            
            // Renderer
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, 400);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);
            
            // Lights
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            // Create particle field
            const particleGeometry = new THREE.BufferGeometry();
            const particleCount = 1000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 1000;
                positions[i + 1] = (Math.random() - 0.5) * 1000;
                positions[i + 2] = (Math.random() - 0.5) * 1000;
                
                colors[i] = Math.random() * 0.5 + 0.5;
                colors[i + 1] = Math.random() * 0.5 + 0.5;
                colors[i + 2] = 1;
            }
            
            particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            const particleMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particleSystem);
            particles.push(particleSystem);
            
            // Create floating geometric shapes
            const geometries = [
                new THREE.TetrahedronGeometry(30, 0),
                new THREE.OctahedronGeometry(25, 0),
                new THREE.IcosahedronGeometry(20, 0),
                new THREE.DodecahedronGeometry(25, 0)
            ];
            
            geometries.forEach((geo, i) => {
                const material = new THREE.MeshPhongMaterial({
                    color: [0x00d4ff, 0xff6b35, 0x7c3aed, 0x10b981][i],
                    emissive: [0x00d4ff, 0xff6b35, 0x7c3aed, 0x10b981][i],
                    emissiveIntensity: 0.2,
                    shininess: 100,
                    specular: 0x111111,
                    wireframe: Math.random() > 0.5
                });
                
                const mesh = new THREE.Mesh(geo, material);
                mesh.position.set(
                    (Math.random() - 0.5) * 400,
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 300
                );
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                scene.add(mesh);
                particles.push(mesh);
            });
            
            // Mouse interaction
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth / 2) / 100;
                mouseY = (e.clientY - window.innerHeight / 2) / 100;
            });
            
            // Animation loop
            function animate3D() {
                requestAnimationFrame(animate3D);
                
                // Rotate particles
                particles.forEach((particle, i) => {
                    if (particle.geometry && particle.geometry.type === 'BufferGeometry') {
                        particle.rotation.y += 0.001;
                        particle.rotation.x += 0.0005;
                    } else if (particle.geometry) {
                        particle.rotation.x += 0.01 * (i + 1) * 0.3;
                        particle.rotation.y += 0.02 * (i + 1) * 0.3;
                        particle.position.y = Math.sin(Date.now() * 0.001 + i) * 10;
                    }
                });
                
                // Camera follow mouse
                camera.position.x += (mouseX - camera.position.x) * 0.05;
                camera.position.y += (-mouseY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                
                renderer.render(scene, camera);
            }
            
            animate3D();
            
            // Resize handler
            window.addEventListener('resize', () => {
                if (camera && renderer && container) {
                    camera.aspect = container.clientWidth / 400;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, 400);
                }
            });
            
            console.log('Three.js initialized successfully');
        } catch (error) {
            console.error('Three.js initialization error:', error);
        }
        
        resolve();
    });
}

// ===================================
// MATRIX RAIN EFFECT
// ===================================
function initMatrixRain() {
    matrixRainCanvas = document.getElementById('matrix-rain');
    if (!matrixRainCanvas) {
        console.log('Matrix rain canvas not found');
        return;
    }
    
    matrixRainCtx = matrixRainCanvas.getContext('2d');
    
    // Set canvas size
    function resizeMatrix() {
        matrixRainCanvas.width = window.innerWidth;
        matrixRainCanvas.height = window.innerHeight;
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    
    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = matrixRainCanvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * -100);
    }
    
    // Draw matrix rain
    function drawMatrix() {
        matrixRainCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        matrixRainCtx.fillRect(0, 0, matrixRainCanvas.width, matrixRainCanvas.height);
        
        matrixRainCtx.fillStyle = '#00d4ff';
        matrixRainCtx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            matrixRainCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrixRainCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
    console.log('Matrix rain initialized');
}

// ===================================
// CURSOR TRAIL EFFECT
// ===================================
function initCursorTrail() {
    cursorTrailCanvas = document.getElementById('cursor-trail');
    if (!cursorTrailCanvas) {
        console.log('Cursor trail canvas not found');
        return;
    }
    
    cursorTrailCtx = cursorTrailCanvas.getContext('2d');
    
    // Set canvas size
    function resizeTrail() {
        cursorTrailCanvas.width = window.innerWidth;
        cursorTrailCanvas.height = window.innerHeight;
    }
    resizeTrail();
    window.addEventListener('resize', resizeTrail);
    
    let mousePos = { x: 0, y: 0 };
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        
        // Add new trail point
        cursorTrailPoints.push({
            x: mousePos.x,
            y: mousePos.y,
            life: 1.0,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 2
        });
        
        // Limit trail points
        if (cursorTrailPoints.length > 50) {
            cursorTrailPoints.shift();
        }
    });
    
    // Animate trail
    function animateTrail() {
        requestAnimationFrame(animateTrail);
        
        cursorTrailCtx.clearRect(0, 0, cursorTrailCanvas.width, cursorTrailCanvas.height);
        
        cursorTrailPoints.forEach((point, index) => {
            point.life -= 0.02;
            point.x += point.vx;
            point.y += point.vy;
            
            if (point.life <= 0) {
                cursorTrailPoints.splice(index, 1);
                return;
            }
            
            cursorTrailCtx.save();
            cursorTrailCtx.globalAlpha = point.life;
            cursorTrailCtx.fillStyle = '#00d4ff';
            cursorTrailCtx.shadowColor = '#00d4ff';
            cursorTrailCtx.shadowBlur = 10;
            
            cursorTrailCtx.beginPath();
            cursorTrailCtx.arc(point.x, point.y, point.size * point.life, 0, Math.PI * 2);
            cursorTrailCtx.fill();
            
            cursorTrailCtx.restore();
        });
    }
    
    animateTrail();
    console.log('Cursor trail initialized');
}

// ===================================
// SOUND SYSTEM
// ===================================
function initSoundSystem() {
    // Create audio context on first user interaction
    const initAudio = () => {
        if (!audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            console.log('Audio context created');
        }
    };
    
    // Initialize on first click
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    
    // Define sound effects
    const sounds = {
        hover: { frequency: 800, duration: 50 },
        click: { frequency: 600, duration: 100 },
        achievement: { frequency: 1200, duration: 200 },
        welcome: { frequency: 440, duration: 500 },
        success: { frequency: 880, duration: 300 }
    };
    
    // Create sound function
    window.playSound = function(type) {
        if (!audioContext || !sounds[type]) return;
        
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = sounds[type].frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sounds[type].duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sounds[type].duration / 1000);
        } catch (error) {
            console.log('Sound playback error:', error);
        }
    };
    
    // Add sound to interactive elements
    setTimeout(() => {
        document.querySelectorAll('a, button, .nav-link, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => playSound('hover'));
            element.addEventListener('click', () => playSound('click'));
        });
    }, 1000);
    
    console.log('Sound system initialized');
}

// ===================================
// VOICE COMMANDS
// ===================================
function initVoiceCommands() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        console.log('Voice commands not supported');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceRecognition = new SpeechRecognition();
    
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = false;
    voiceRecognition.lang = 'en-US';
    
    voiceRecognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', command);
        
        // Process commands
        if (command.includes('about')) {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        } else if (command.includes('projects')) {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        } else if (command.includes('contact')) {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        } else if (command.includes('dark') || command.includes('light')) {
            document.getElementById('themeToggle')?.click();
        } else if (command.includes('top')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Achievement for using voice
        if (!achievements.usedVoice) {
            triggerAchievement('usedVoice', '🎤 Voice Master!', 'You used voice commands!');
        }
        
        playSound('success');
    };
    
    voiceRecognition.onerror = function(event) {
        console.log('Voice recognition error:', event.error);
    };
    
    // Activate on 'V' key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'v' || e.key === 'V') {
            try {
                voiceRecognition.start();
                console.log('Listening for voice commands...');
                
                // Show visual indicator
                const hint = document.querySelector('.voice-command-hint');
                if (hint) {
                    hint.style.background = 'rgba(16, 185, 129, 0.2)';
                    hint.innerHTML = '<i class="fas fa-microphone"></i><span>Listening...</span>';
                    
                    setTimeout(() => {
                        hint.style.background = 'rgba(124, 58, 237, 0.1)';
                        hint.innerHTML = '<i class="fas fa-microphone"></i><span>Press \'V\' for voice commands</span>';
                    }, 3000);
                }
            } catch (e) {
                console.log('Voice recognition error:', e);
            }
        }
    });
    
    console.log('Voice commands initialized');
}

// ===================================
// MAGNETIC ELEMENTS
// ===================================
function initMagneticElements() {
    magneticElements = document.querySelectorAll('.magnetic-element');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 0.3;
                element.style.transform = `translate(${x * force}px, ${y * force}px)`;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
    
    console.log('Magnetic elements initialized:', magneticElements.length);
}

// ===================================
// TIMELINE NAVIGATOR
// ===================================
function initTimelineNavigator() {
    const timeline = document.querySelector('.timeline-navigator');
    if (!timeline) return;
    
    const progress = timeline.querySelector('.timeline-progress');
    const markers = timeline.querySelectorAll('.timeline-marker');
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (progress) {
            progress.style.width = scrollPercentage + '%';
        }
    });
    
    // Marker click navigation
    markers.forEach((marker, index) => {
        marker.addEventListener('click', () => {
            const sections = ['header', 'about', 'experience', 'projects'];
            const targetSection = document.getElementById(sections[index]) || document.querySelector(sections[index]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                playSound('click');
            }
        });
        
        // Add hover effect
        marker.addEventListener('mouseenter', () => {
            marker.style.transform = 'scale(1.5)';
            marker.style.background = 'var(--primary-color)';
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.style.transform = 'scale(1)';
            marker.style.background = 'var(--bg-card)';
        });
    });
    
    console.log('Timeline navigator initialized');
}

// ===================================
// ACHIEVEMENT SYSTEM
// ===================================
function initAchievementSystem() {
    // Check localStorage for unlocked achievements
    try {
        const savedAchievements = localStorage.getItem('portfolioAchievements');
        if (savedAchievements) {
            Object.assign(achievements, JSON.parse(savedAchievements));
        }
    } catch (error) {
        console.log('Could not load saved achievements:', error);
    }
    
    // Track scroll achievement
    let hasScrolledHalf = false;
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage > 50 && !hasScrolledHalf && !achievements.scrolledHalf) {
            hasScrolledHalf = true;
            triggerAchievement('scrolledHalf', '📜 Explorer!', 'You\'ve scrolled through half the portfolio!');
        }
    });
    
    // Track section visits
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visitedSections.add(entry.target.id);
                
                if (visitedSections.size >= 4 && !achievements.viewedAllSections) {
                    triggerAchievement('viewedAllSections', '👁️ Completionist!', 'You\'ve viewed all major sections!');
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section').forEach(section => {
        if (section.id) {
            sectionObserver.observe(section);
        }
    });
    
    // Track project clicks
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!achievements.clickedProject) {
                triggerAchievement('clickedProject', '🚀 Project Explorer!', 'You checked out a project!');
            }
        });
    });
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            if (!achievements.foundEasterEgg) {
                triggerAchievement('foundEasterEgg', '🎮 Konami Master!', 'You found the secret code!');
                
                // Activate matrix rain at full opacity
                if (matrixRainCanvas) {
                    matrixRainCanvas.style.opacity = '0.3';
                    setTimeout(() => {
                        matrixRainCanvas.style.opacity = '0.05';
                    }, 5000);
                }
            }
        }
    });
    
    console.log('Achievement system initialized');
}

function triggerAchievement(id, title, description) {
    achievements[id] = true;
    
    // Save to localStorage
    try {
        localStorage.setItem('portfolioAchievements', JSON.stringify(achievements));
    } catch (error) {
        console.log('Could not save achievement:', error);
    }
    
    // Show popup
    const popup = document.getElementById('achievementPopup');
    if (popup) {
        const titleEl = popup.querySelector('.achievement-title');
        const descEl = popup.querySelector('.achievement-description');
        
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
        
        popup.classList.add('show');
        playSound('achievement');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 4000);
    }
    
    console.log(`🏆 Achievement Unlocked: ${title}`);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    function updateScrollProgress() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercentage + '%';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const bgAnimation = document.querySelector('.bg-animation');
        
        if (bgAnimation) {
            bgAnimation.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        // Parallax for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrolled / 600);
        }
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for children
                const children = entry.target.querySelectorAll('.fade-in-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animations
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Achievement value animations
    const achievementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target + '%';
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + '%';
                    }
                }, 30);
                
                achievementObserver.unobserve(element);
            }
        });
    });
    
    document.querySelectorAll('.achievement-value').forEach(value => {
        achievementObserver.observe(value);
    });
    
    console.log('Scroll animations initialized');
}

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===================================
// PARTICLE SYSTEM
// ===================================
function initParticleSystem() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        console.log('Particles container not found');
        return;
    }
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    console.log('Particle system initialized');
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size
    const sizes = ['small', '', 'large'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    if (randomSize) particle.classList.add(randomSize);
    
    // Random animation
    const animations = ['floating', 'diagonal'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    particle.classList.add(randomAnimation);
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container);
    });
}

// ===================================
// LETTER ANIMATIONS
// ===================================
function initLetterAnimations() {
    const letterElements = document.querySelectorAll('.letter-animate');
    
    letterElements.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effect
        letter.addEventListener('mouseenter', () => {
            letter.style.color = '#00d4ff';
            letter.style.transform = 'translateY(-10px) scale(1.2)';
            playSound('hover');
        });
        
        letter.addEventListener('mouseleave', () => {
            letter.style.color = '';
            letter.style.transform = '';
        });
    });
    
    console.log('Letter animations initialized');
}

// ===================================
// CHATBOT IMPLEMENTATION
// ===================================
function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const closeBtn = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!toggle || !container) {
        console.log('Chatbot elements not found');
        return;
    }
    
    let chatOpen = false;
    let messageHistory = [];
    
    // Knowledge base
    const knowledgeBase = {
        experience: {
            keywords: ['experience', 'work', 'job', 'career', 'employment', 'position', 'role', 'working'],
            response: "Nilesh has 4+ years of professional experience:\n\n🏢 **Paras Industries** (Sep 2021 - Aug 2023)\nSoftware Engineer - Led cross-functional teams, achieved 40% higher user engagement.\n\n🏢 **NVIDIA** (Apr 2021 - Aug 2021)\nSoftware Engineer - Enhanced Python systems, implemented Redis caching.\n\n🏢 **Nimbeshwar** (Apr 2019 - Mar 2021)\nTechnology Consultant - Led technology evaluations, developed CI/CD pipelines."
        },
        skills: {
            keywords: ['skill', 'technology', 'tech', 'language', 'framework', 'tool', 'know', 'expertise', 'stack'],
            response: "Nilesh's technical expertise includes:\n\n💻 **Frontend:** React.js, JavaScript, TypeScript, HTML5/CSS3, Redux\n\n⚙️ **Backend:** Java Spring Boot, Node.js, Python Flask, Go, RESTful APIs\n\n🗄️ **Databases:** MySQL, PostgreSQL, MongoDB, Redis\n\n☁️ **Cloud & DevOps:** AWS, Docker, CI/CD, GitHub Actions"
        },
        projects: {
            keywords: ['project', 'portfolio', 'build', 'created', 'developed', 'github', 'work', 'application'],
            response: "Here are Nilesh's featured projects:\n\n🏋️ **Fitness Tracker App** - React 18 app with real-time visualizations\n\n👥 **Social Media Platform** - Full-featured platform with messaging\n\n🧠 **Academic Research Assistant** - Distributed system using Akka Actor Model\n\nView all on GitHub: github.com/nileshparmar0"
        },
        contact: {
            keywords: ['contact', 'email', 'phone', 'reach', 'connect', 'linkedin', 'github', 'hire', 'talk'],
            response: "📬 Let's connect!\n\n✉️ **Email:** parmar.nil@northeastern.edu\n📱 **Phone:** +1 (857) 379-4764\n💼 **LinkedIn:** linkedin.com/in/nilesh-parmar-/\n🔗 **GitHub:** github.com/nileshparmar0"
        },
        education: {
            keywords: ['education', 'study', 'degree', 'university', 'college', 'master', 'northeastern'],
            response: "🎓 **Education:**\n\nNilesh is currently pursuing his **Master's in Information Systems** at Northeastern University.\n\nHe combines academic excellence with 4+ years of industry experience."
        },
        achievements: {
            keywords: ['achievement', 'accomplish', 'success', 'result', 'impact', 'performance'],
            response: "🏆 **Key Achievements:**\n\n• Improved user engagement by **40%**\n• Increased system efficiency by **35%**\n• Reduced deployment time by **40%**\n• Achieved **90% code coverage**\n• Optimized response times by **45%**"
        }
    };
    
    // Open/close chat
    toggle.addEventListener('click', () => {
        chatOpen = !chatOpen;
        container.classList.toggle('active');
        
        // Send welcome message on first open
        if (chatOpen && messageHistory.length === 0) {
            setTimeout(() => {
                addMessage('bot', "👋 Hi! I'm Nilesh's portfolio assistant. I can tell you about his experience, skills, projects, and how to contact him. What would you like to know?");
            }, 500);
        }
        
        // Remove notification badge
        const notification = toggle.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'none';
        }
        
        playSound('click');
    });
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatOpen = false;
            container.classList.remove('active');
            playSound('click');
        });
    }
    
    // Add message to chat
    function addMessage(sender, text) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convert markdown-style bold to HTML
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\n/g, '<br>');
        
        contentDiv.innerHTML = text;
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Store in history
        messageHistory.push({ sender, text });
    }
    
    // Process user message
    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;
        
        // Score each knowledge base entry
        for (const [key, data] of Object.entries(knowledgeBase)) {
            let score = 0;
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword)) {
                    score += keyword.length;
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestMatch = data.response;
            }
        }
        
        // Return best match or default response
        if (bestMatch) {
            return bestMatch;
        }
        
        return "That's an interesting question! I can tell you about Nilesh's experience, skills, projects, or how to contact him. What would you like to know?";
    }
    
    // Send message
    window.sendMessage = function() {
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message
            addMessage('user', message);
            chatInput.value = '';
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
            chatMessages.appendChild(typingDiv);
            
            // Simulate processing time
            setTimeout(() => {
                const typing = document.getElementById('typing-indicator');
                if (typing) typing.remove();
                
                const response = processMessage(message);
                addMessage('bot', response);
                playSound('success');
            }, 1000 + Math.random() * 1000);
        }
    };
    
    // Handle enter key
    window.handleKeyPress = function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };
    
    // Send quick action message
    window.sendQuickMessage = function(message) {
        if (chatInput) {
            chatInput.value = message;
            sendMessage();
        }
    };
    
    console.log('Chatbot initialized');
}

// ===================================
// TYPING EFFECT
// ===================================
function initTypingEffect() {
    const phrases = [
        'scalable web applications',
        'distributed systems',
        'AI-powered solutions',
        'cloud architectures',
        'user experiences',
        'high-performance APIs',
        'innovative products',
        'the future of tech'
    ];
    
    let currentPhrase = 0;
    const typedTextElement = document.getElementById('typedText');
    
    if (!typedTextElement) {
        console.log('Typed text element not found');
        return;
    }
    
    function typePhrase() {
        const phrase = phrases[currentPhrase];
        let i = 0;
        
        typedTextElement.textContent = '';
        
        function typeChar() {
            if (i < phrase.length) {
                typedTextElement.textContent += phrase[i];
                i++;
                setTimeout(typeChar, 100);
            } else {
                setTimeout(deletePhrase, 2000);
            }
        }
        
        function deletePhrase() {
            if (typedTextElement.textContent.length > 0) {
                typedTextElement.textContent = typedTextElement.textContent.slice(0, -1);
                setTimeout(deletePhrase, 50);
            } else {
                currentPhrase = (currentPhrase + 1) % phrases.length;
                setTimeout(typePhrase, 500);
            }
        }
        
        typeChar();
    }
    
    setTimeout(typePhrase, 1000);
    console.log('Typing effect initialized');
}

// ===================================
// START ALL ANIMATIONS
// ===================================
function startAllAnimations() {
    initTypingEffect();
    
    console.log('🎨 All animations started!');
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'light');
            } else {
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'dark');
            }
            
            playSound('click');
            
            // Add rotation animation
            themeToggle.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }
    
    // Check saved theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Mouse follower
    const follower = document.querySelector('.mouse-follower');
    const followerLabel = document.querySelector('.mouse-follower-label');
    
    if (follower && followerLabel) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            followerLabel.style.left = (mouseX + 20) + 'px';
            followerLabel.style.top = (mouseY - 10) + 'px';
        });
        
        setInterval(() => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.left = followerX - 20 + 'px';
            follower.style.top = followerY - 20 + 'px';
        }, 20);
        
        // Show label on hover
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .tech-item');
        interactiveElements.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                followerLabel.style.opacity = '1';
                follower.style.transform = 'scale(1.5)';
            });
            
            elem.addEventListener('mouseleave', () => {
                followerLabel.style.opacity = '0';
                follower.style.transform = 'scale(1)';
            });
        });
    }
    
    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Enhanced skill tags animation
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.skill-tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                    }, index * 50);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.skill-category').forEach(category => {
        const tags = category.querySelectorAll('.skill-tag');
        tags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px) scale(0.9)';
            tag.style.transition = 'all 0.3s ease';
        });
        skillObserver.observe(category);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'T' to toggle theme
        if (e.key === 't' || e.key === 'T') {
            if (!e.ctrlKey && !e.metaKey) {
                themeToggle?.click();
            }
        }
        
        // Press '1-4' to navigate sections
        const sectionMap = {
            '1': 'header',
            '2': 'about',
            '3': 'experience',
            '4': 'projects',
            '5': 'contact'
        };
        
        if (sectionMap[e.key] && !e.ctrlKey && !e.metaKey) {
            const section = document.getElementById(sectionMap[e.key]) || document.querySelector(sectionMap[e.key]);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// ===================================
// DEVELOPER CONSOLE EASTER EGG
// ===================================
console.log('%c🚀 PORTFOLIO LOADED!', 'font-size: 30px; color: #00d4ff; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; color: #ff6b35;');
console.log('%cYou found the console! Try the Konami code: ↑↑↓↓←→←→BA', 'font-size: 14px; color: #7c3aed;');
console.log('%c📧 Let\'s connect: parmar.nil@northeastern.edu', 'font-size: 12px; color: #10b981;');
console.log('%c🎮 Press "V" for voice commands!', 'font-size: 12px; color: #00d4ff;');
console.log('%c📢 Press 1-5 to navigate sections!', 'font-size: 12px; color: #ff6b35;');
console.log('%c🎨 Press "T" to toggle theme!', 'font-size: 12px; color: #7c3aed;');

// Export for debugging
window.portfolioDebug = {
    achievements,
    particles,
    triggerAchievement,
    playSound,
    version: '1.0.0 STREAMLINED',
    features: {
        threeJS: typeof THREE !== 'undefined',
        voiceCommands: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        localStorage: typeof Storage !== 'undefined',
        audioContext: typeof AudioContext !== 'undefined'
    }
};

console.log('Portfolio Debug Tools:', window.portfolioDebug);
