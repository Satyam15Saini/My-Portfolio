class PortfolioWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupParticles();
        this.setupParallax();
        this.setupPortfolioFilters();
        this.setupTestimonialsSlider();
        this.setupSkillAnimations();
        this.setupContactForm();
        this.setupScrollProgress();
        this.setupTypingAnimation();
        this.setupFloatingCards();
    }

    // Preloader with Progress Animation
    setupPreloader() {
        const preloader = document.querySelector('.preloader');
        const progressBar = document.querySelector('.preloader-bar');
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    document.body.style.overflow = 'visible';
                    this.startRevealAnimations();
                }, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 100);
    }

    // Enhanced Navigation with Fixed Smooth Scrolling
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburger = document.querySelector('.nav-hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const sections = document.querySelectorAll('section[id]');

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Fixed smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset to account for fixed navbar
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Active nav link on scroll with proper offset calculation
        const updateActiveNavLink = () => {
            const scrollPos = window.scrollY + navbar.offsetHeight + 50;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', this.throttle(updateActiveNavLink, 100));
    }

    // Scroll-triggered Animations with Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseInt(delay));
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-up').forEach(el => {
            observer.observe(el);
        });
    }

    // Particle Background Effect with New Colors
    setupParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const particlesContainer = document.getElementById('particles');
        
        if (!particlesContainer) return;

        particlesContainer.appendChild(canvas);
        
        let particles = [];
        const numParticles = 50;
        const colors = [
            'rgba(13, 148, 136, 0.6)',    // Primary teal
            'rgba(234, 88, 12, 0.6)',     // Secondary orange
            'rgba(124, 58, 237, 0.6)',    // Accent purple
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            // Draw connections with new colors
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(other => {
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(13, 148, 136, ${0.15 - distance / 1000})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        };

        resizeCanvas();
        createParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }

    // Parallax Effects
    setupParallax() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            floatingCards.forEach(card => {
                const depth = card.dataset.depth;
                const yPos = -(scrolled * depth);
                card.style.transform = `translateY(${yPos}px)`;
            });
        });

        // Mouse parallax for hero section
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            floatingCards.forEach(card => {
                const depth = card.dataset.depth;
                const x = (mouseX - 0.5) * 20 * depth;
                const y = (mouseY - 0.5) * 20 * depth;
                card.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
    }

    // Portfolio Filtering System & Click Handlers
    setupPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.dataset.filter;

                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectCards.forEach(card => {
                    card.style.transform = 'scale(0.8)';
                    card.style.opacity = '0';

                    setTimeout(() => {
                        if (filterValue === 'all' || card.dataset.category.includes(filterValue)) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.transform = 'scale(1)';
                                card.style.opacity = '1';
                            }, 10);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });

        // Project card interactions - Open Link
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetUrl = card.dataset.url;
                if(targetUrl && targetUrl !== '#') {
                    window.open(targetUrl, '_blank');
                }
            });
        });
    }

    // Testimonials Slider
    setupTestimonialsSlider() {
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        let currentSlide = 0;

        if(testimonials.length === 0) return;

        const showSlide = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-advance slider
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Enhanced Skill Badge Animations
    setupSkillAnimations() {
        const skillBadges = document.querySelectorAll('.skill-badge');
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const badge = entry.target;
                    
                    // Add staggered animation delay
                    const badges = Array.from(badge.parentElement.children);
                    const index = badges.indexOf(badge);
                    
                    setTimeout(() => {
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0) scale(1)';
                        
                        // Add a subtle bounce effect
                        badge.style.animation = 'badgeAppear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    }, index * 100);
                    
                    skillsObserver.unobserve(entry.target);
                }
            });
        });

        // Set initial state and observe
        skillBadges.forEach(badge => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px) scale(0.8)';
            badge.style.transition = 'all 0.6s ease-out';
            skillsObserver.observe(badge);
        });

        // Add hover effects
        skillBadges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Enhanced Contact Form with Floating Labels
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('.form-input');

        // Floating label effects
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            const errors = this.validateForm(data);
            
            if (errors.length > 0) {
                this.showFormMessage(errors.join('<br>'), 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                this.showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Remove focused classes
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            }, 2000);
        });
    }

    // Form Validation
    validateForm(data) {
        const errors = [];
        
        if (!data.name?.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email?.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject?.trim()) {
            errors.push('Subject is required');
        }
        
        if (!data.message?.trim()) {
            errors.push('Message is required');
        }
        
        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFormMessage(message, type) {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const existingMessage = form.querySelector('.form-message');
        
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.innerHTML = message;
        
        messageDiv.style.cssText = `
            padding: 1rem 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            font-size: 0.9rem;
            animation: slideDown 0.3s ease-out;
            ${type === 'error' ? 
                'background: rgba(234, 88, 12, 0.2); color: #fed7aa; border: 1px solid rgba(234, 88, 12, 0.3);' : 
                'background: rgba(13, 148, 136, 0.2); color: #5eead4; border: 1px solid rgba(13, 148, 136, 0.3);'
            }
        `;
        
        form.insertBefore(messageDiv, form.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideUp 0.3s ease-out forwards';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        const progressBar = document.querySelector('.progress-bar');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            if (progressBar) {
                progressBar.style.width = `${scrollPercent}%`;
            }
        }, 50));
    }

    // Enhanced Typing Animation
    setupTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const text = "Building scalable solutions with clean, efficient code";
        let index = 0;
        
        typingElement.textContent = '';
        
        const typeText = () => {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 50);
            } else {
                // Stop blinking cursor after typing is complete
                setTimeout(() => {
                    const cursor = document.querySelector('.cursor-blink');
                    if (cursor) cursor.style.display = 'none';
                }, 2000);
            }
        };
        
        setTimeout(typeText, 1000);
    }

    // Floating Cards Animation
    setupFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach((card, index) => {
            // Random floating animation
            const randomDelay = Math.random() * 2000;
            const randomDuration = 3000 + Math.random() * 2000;
            
            card.style.animation = `float ${randomDuration}ms ease-in-out infinite`;
            card.style.animationDelay = `${randomDelay}ms`;
            
            // Mouse interaction
            card.addEventListener('mouseenter', () => {
                card.style.transform += ' scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = card.style.transform.replace(' scale(1.1)', '');
            });
        });
    }

    // Start reveal animations after preloader
    startRevealAnimations() {
        const heroElements = document.querySelectorAll('.hero .reveal-up');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('revealed');
            }, index * 200);
        });
    }

    // Throttle utility method
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations for skill badges and form messages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes badgeAppear {
            0% { 
                opacity: 0; 
                transform: translateY(20px) scale(0.8); 
            }
            50% { 
                transform: translateY(-5px) scale(1.1); 
            }
            100% { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        .form-input:focus + .form-label,
        .form-input:not(:placeholder-shown) + .form-label {
            top: 0.3rem !important;
            font-size: 0.8rem !important;
            color: var(--color-primary) !important;
        }
        
        .skill-badge {
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        .skill-category:hover .skill-badge {
            transform: translateY(-2px);
        }
        
        .skill-category:hover .skill-badge:nth-child(even) {
            animation-delay: 0.1s;
        }
        
        .skill-category:hover .skill-badge:nth-child(odd) {
            animation-delay: 0.05s;
        }
        
        /* Enhanced SS Logo hover effects */
        .ss-logo {
            position: relative;
            overflow: hidden;
        }
        
        .ss-logo::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.3s ease;
        }
        
        .ss-logo:hover::after {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // Initialize the portfolio
    new PortfolioWebsite();

    // Add smooth reveal animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease-out';
    });

    // Show sections progressively
    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 1000);
});

// Handle window resize
window.addEventListener('resize', ((func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
})(() => {
    // Recalculate positions and sizes if needed
    if (window.innerWidth <= 768) {
        // Mobile-specific optimizations
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            card.style.display = 'none';
        });
    } else {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            card.style.display = 'flex';
        });
    }
}, 250));

// Optimize performance for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Disable expensive animations on mobile
    const style = document.createElement('style');
    style.textContent = `
        .touch-device .floating-card,
        .touch-device .particles-bg {
            display: none !important;
        }
        
        .touch-device .project-card:hover {
            transform: none !important;
        }
        
        .touch-device * {
            transition-duration: 0.1s !important;
            animation-duration: 0.1s !important;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced Easter egg with new colors - Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiPattern.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        // Easter egg activated - rainbow effect with new color scheme
        const originalFilter = document.body.style.filter;
        document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
        
        // Add sparkle effect with new colors
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, #0d9488, #ea580c, #7c3aed);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkle 2s ease-out forwards;
            `;
            sparkleContainer.appendChild(sparkle);
        }
        
        document.body.appendChild(sparkleContainer);
        
        // Add sparkle animation
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent = `
            @keyframes sparkle {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(sparkleStyle);
        
        setTimeout(() => {
            document.body.style.filter = originalFilter;
            sparkleContainer.remove();
            sparkleStyle.remove();
        }, 3000);
        
        konamiCode = [];
    }
});

// Add SS Logo animation enhancement
document.addEventListener('DOMContentLoaded', () => {
    const ssLogos = document.querySelectorAll('.ss-logo');
    
    ssLogos.forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                left: 50%;
                top: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            logo.style.position = 'relative';
            logo.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});