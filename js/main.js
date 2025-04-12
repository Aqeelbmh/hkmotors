// Navigation Toggle with smooth animation
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// Smooth Scrolling with enhanced animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    });
});

// Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Handle scroll progress
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Enhanced Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Keep observing to maintain animations
                observer.observe(entry.target);
            } else {
                // Remove visible class when out of view
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections and animated elements
    document.querySelectorAll('.section, .hero, .about, .brands, .blog, .contact').forEach(element => {
        observer.observe(element);
    });

    // Enhanced Scroll Animation Handler
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.section, .hero, .about, .brands, .blog, .contact');
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;

        elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const elementBottom = elementTop + elementHeight;

            // Check if element is in viewport
            if (elementTop < (windowHeight + scrollPosition) && elementBottom > scrollPosition) {
                element.classList.add('visible');
                // Add animation classes based on scroll direction
                if (scrollPosition > lastScrollPosition) {
                    element.classList.add('scroll-down');
                    element.classList.remove('scroll-up');
                } else {
                    element.classList.add('scroll-up');
                    element.classList.remove('scroll-down');
                }
            } else {
                element.classList.remove('visible');
            }
        });

        lastScrollPosition = scrollPosition;
    }

    let lastScrollPosition = 0;
    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Initial check

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });

    // Keep animations running during scroll
    function keepAnimationsRunning() {
        const animatedElements = document.querySelectorAll('.navbar, .logo img, .footer-logo img, .social-icons a');
        animatedElements.forEach(element => {
            if (element.style.animationPlayState === 'paused') {
                element.style.animationPlayState = 'running';
            }
        });
        requestAnimationFrame(keepAnimationsRunning);
    }
    keepAnimationsRunning();
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    document.body.appendChild(successMessage);

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        
        // Create FormData object
        const formData = new FormData(contactForm);
        
        // Submit to Formspree
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Success
                successMessage.textContent = 'Message sent successfully!';
                successMessage.style.backgroundColor = '#4CAF50';
                contactForm.reset();
            } else {
                // Error
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            successMessage.textContent = 'Error sending message. Please try again.';
            successMessage.style.backgroundColor = '#ff4444';
        })
        .finally(() => {
            // Show message
            successMessage.classList.add('show');
            
            // Reset button
            submitBtn.disabled = false;
            btnText.textContent = originalText;
            
            // Hide message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        });
    });

    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
}

// Input validation function
function validateInput(input) {
    const value = input.value.trim();
    
    if (!value) {
        setError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && !isValidEmail(value)) {
        setError(input, 'Please enter a valid email');
        return false;
    }
    
    if (input.id === 'phone' && !isValidPhone(value)) {
        setError(input, 'Please enter a valid phone number');
        return false;
    }
    
    removeError(input);
    return true;
}

// Helper functions for validation
function setError(input, message) {
    input.classList.add('error');
    const formGroup = input.closest('.form-group');
    let errorDiv = formGroup.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

function removeError(input) {
    input.classList.remove('error');
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        formGroup.removeChild(errorDiv);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s+()-]{10,}$/.test(phone);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Phone number validation
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Allow only numbers and common phone number characters
        e.target.value = e.target.value.replace(/[^\d+\-() ]/g, '');
    });
}

// Form field validation
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '#2ecc71';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '#0066cc';
    });
});

// Scroll Event Handling for Persistent Animations
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle scroll events
    function handleScroll() {
        // Get all animated elements
        const animatedElements = document.querySelectorAll('.navbar, .logo img, .footer-logo img, .social-icons a');
        
        // Check if elements are in viewport
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            // Ensure animations continue regardless of scroll position
            if (element.classList.contains('navbar')) {
                element.style.animationPlayState = 'running';
            } else if (element.classList.contains('logo')) {
                element.querySelector('img').style.animationPlayState = 'running';
            } else if (element.classList.contains('footer-logo')) {
                element.querySelector('img').style.animationPlayState = 'running';
            } else if (element.classList.contains('social-icons')) {
                element.querySelectorAll('a').forEach(icon => {
                    icon.style.animationPlayState = 'running';
                });
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    // Use requestAnimationFrame for smooth animations
    function animate() {
        handleScroll();
        requestAnimationFrame(animate);
    }
    
    // Start animation loop
    requestAnimationFrame(animate);
});

// Modern JavaScript Features and Optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    const sections = document.querySelectorAll('.section, .hero, .about, .brands, .blog, .contact');
    const contactForm = document.querySelector('.contact-form');
    const successMessage = document.querySelector('.success-message');
    const scrollProgress = document.querySelector('.scroll-progress');

    // Handle scroll events with debounce
    let lastScroll = 0;
    let ticking = false;

    function updateScroll() {
        const currentScroll = window.pageYOffset;

        // Update navbar background on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update scroll progress
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (currentScroll / scrollHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Handle scroll direction
        const scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
        lastScroll = currentScroll;

        // Update section visibility with Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add(`scroll-${scrollDirection}`);
                } else {
                    entry.target.classList.remove(`scroll-${scrollDirection}`);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });

    // Handle mobile navigation
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const formData = new FormData(contactForm);

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const response = await fetch('https://formspree.io/f/xkgjybrk', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    successMessage.classList.add('show');
                    contactForm.reset();

                    // Hide success message after 3 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was a problem submitting the form. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
    }

    // Lazy load images with Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Add scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
}); 