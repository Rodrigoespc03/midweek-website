// ============================================
// MIDWEEK - Optimized JavaScript
// ============================================

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentLanguage = 'es';
let currentSlide = 0;
let currentGallery = [];
let currentPhotoIndex = 0;
let isTransitioning = false;
let carouselInterval = null;
let touchStartX = 0;
let touchEndX = 0;
let ticking = false;

// Photo Galleries Configuration
const photoGalleries = {
    'foro-indie-rocks': [
        'Carrusel menu/Midweek_Foro_IndieRocks-14 .jpg',
        'Carrusel menu/busch indierocks.jpg',
        'Carrusel menu/cherryriverindierocks.jpg',
        'eventos/foro-indie-rocks/indierocks 1.jpg',
        'eventos/foro-indie-rocks/indierocks 2.jpg'
    ],
    'opening-act-balu': [
        'eventos/opening-act-balu/Opening act balubrigada1.jpg',
        'eventos/opening-act-balu/Opening balu brigada 2.jpg'
    ],
    'pepsi-callejon': [
        'eventos/pepsi-callejon/66823228-b380-4296-824a-e94a0e937f01.jpg',
        'eventos/pepsi-callejon/WhatsApp Image 2025-11-04 at 12.31.38.jpeg'
    ],
    'artemis': [
        'eventos/artemis/LCDR&R-1.jpg',
        'eventos/artemis/LCDR&R 2.jpg'
    ]
};

// ============================================
// NAVIGATION & SMOOTH SCROLLING
// ============================================
function initSmoothScrolling() {
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
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const handleNavbarScroll = debounce(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    }, 10);
    
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Use requestAnimationFrame for better performance
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback) => setTimeout(callback, 16);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    if (entry.target.classList.contains('about-text')) {
                        entry.target.classList.add('slide-in-left');
                    } else if (entry.target.classList.contains('about-images')) {
                        entry.target.classList.add('slide-in-right');
                    } else if (entry.target.classList.contains('timeline-item')) {
                        entry.target.classList.add('fade-in');
                        entry.target.style.animationDelay = `${index * 0.2}s`;
                    } else if (entry.target.classList.contains('tour-item')) {
                        entry.target.classList.add('scale-in');
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    } else {
                        entry.target.classList.add('fade-in');
                    }
                });
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.timeline-item, .tour-item, .about-text, .about-images, .contact-info, .social-links, .section-title');
    animateElements.forEach(el => observer.observe(el));
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallax() {
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        const heroOverlay = document.querySelector('.hero-overlay');
        if (heroOverlay) {
            heroOverlay.style.transform = `translateY(${scrolled * -0.3}px)`;
        }
        
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        carouselSlides.forEach((slide, index) => {
            slide.style.transform = `translateY(${scrolled * (-0.1 - index * 0.05)}px)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxTick, { passive: true });
}

// ============================================
// HERO CAROUSEL
// ============================================
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Progressive image loading for carousel
    function loadCarouselImage(slide, index) {
        const bgUrl = slide.dataset.bg;
        if (bgUrl && !slide.style.backgroundImage) {
            const img = new Image();
            img.onload = () => {
                slide.style.backgroundImage = `url('${bgUrl}')`;
                slide.classList.add('loaded');
            };
            img.src = bgUrl;
        }
    }
    
    // Load first 2 images immediately, rest progressively
    slides.forEach((slide, index) => {
        if (index < 2) {
            loadCarouselImage(slide, index);
        } else {
            // Load next images when previous ones are visible
            setTimeout(() => {
                loadCarouselImage(slide, index);
            }, index * 1000);
        }
    });
    
    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Preload next slide image
        const nextIndex = (index + 1) % totalSlides;
        loadCarouselImage(slides[nextIndex], nextIndex);
        
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        
        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Touch events for mobile swipe
    const carousel = document.querySelector('.hero-background');
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }, { passive: true });
    }
    
    // Auto-advance carousel
    const isMobile = window.innerWidth <= 768;
    carouselInterval = setInterval(nextSlide, isMobile ? 6000 : 4000);
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    // Use native loading="lazy" if supported, otherwise use Image object
                    if ('loading' in HTMLImageElement.prototype) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    } else {
                        const newImg = new Image();
                        newImg.onload = () => {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                        };
                        newImg.onerror = () => {
                            img.classList.remove('lazy');
                        };
                        newImg.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '100px 0px', // Load earlier for smoother experience
        threshold: 0.01
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// LANGUAGE TOGGLE
// ============================================
function initLanguageToggle() {
    const savedLanguage = localStorage.getItem('midweek-language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    function updateLanguage() {
        document.querySelectorAll('[data-es][data-en]').forEach(element => {
            const text = element.getAttribute(`data-${currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });
    }
    
    function updateLanguageButton() {
        const button = document.getElementById('languageBtn');
        if (button) {
            button.textContent = currentLanguage === 'es' ? 'EN' : 'ES';
        }
    }
    
    function toggleLanguage() {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        updateLanguage();
        updateLanguageButton();
        localStorage.setItem('midweek-language', currentLanguage);
    }
    
    updateLanguage();
    updateLanguageButton();
    
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        languageBtn.addEventListener('click', toggleLanguage);
    }
}

// ============================================
// PHOTO GALLERY MODAL
// ============================================
// Preload cache for images
const imagePreloadCache = new Map();

function preloadImage(src) {
    if (imagePreloadCache.has(src)) {
        return Promise.resolve(imagePreloadCache.get(src));
    }
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imagePreloadCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

function initPhotoGallery() {
    // Preload images on hover over "Ver fotos" button
    document.querySelectorAll('.timeline-view-photos').forEach(btn => {
        const timelineItem = btn.closest('.timeline-item');
        const eventId = timelineItem?.getAttribute('data-event');
        
        if (eventId && photoGalleries[eventId]) {
            let hoverTimeout;
            
            btn.addEventListener('mouseenter', () => {
                // Preload first image immediately
                const photos = photoGalleries[eventId];
                if (photos && photos.length > 0) {
                    preloadImage(photos[0]).catch(() => {});
                    
                    // Preload rest after a short delay
                    hoverTimeout = setTimeout(() => {
                        photos.slice(1, 3).forEach(src => {
                            preloadImage(src).catch(() => {});
                        });
                    }, 300);
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        }
    });
    
    function openPhotoGallery(eventId) {
        const photos = photoGalleries[eventId];
        if (!photos || photos.length === 0) {
            // Photos coming soon - silently return
            return;
        }
        
        currentGallery = photos;
        currentPhotoIndex = 0;
        isTransitioning = false;
        
        const modal = document.getElementById('photoModal');
        const carousel = document.getElementById('photoCarousel');
        
        if (!modal || !carousel) return;
        
        carousel.innerHTML = '';
        
        // Show loading state
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'photo-loading';
        loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
        carousel.appendChild(loadingIndicator);
        
        // Load first image immediately (should be preloaded)
        const firstImg = document.createElement('img');
        firstImg.alt = 'Foto 1';
        firstImg.classList.add('active');
        
        preloadImage(photos[0])
            .then(() => {
                firstImg.src = photos[0];
                loadingIndicator.remove();
                carousel.appendChild(firstImg);
            })
            .catch(() => {
                firstImg.src = photos[0];
                loadingIndicator.remove();
                carousel.appendChild(firstImg);
            });
        
        // Load remaining images progressively
        photos.slice(1).forEach((src, index) => {
            const img = document.createElement('img');
            img.alt = `Foto ${index + 2}`;
            img.loading = 'lazy';
            carousel.appendChild(img);
            
            // Load next images in background
            setTimeout(() => {
                preloadImage(src)
                    .then(() => {
                        img.src = src;
                    })
                    .catch(() => {
                        img.src = src;
                    });
            }, (index + 1) * 200);
        });
        
        updatePhotoCounter();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closePhotoGallery() {
        const modal = document.getElementById('photoModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            currentGallery = [];
            currentPhotoIndex = 0;
        }
    }
    
    function showPhoto(index) {
        if (isTransitioning || !currentGallery.length) return;
        
        isTransitioning = true;
        const images = document.querySelectorAll('#photoCarousel img');
        
        // Preload next image before showing
        const nextIndex = (index + 1) % currentGallery.length;
        if (currentGallery[nextIndex]) {
            preloadImage(currentGallery[nextIndex]).catch(() => {});
        }
        
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        
        updatePhotoCounter();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }
    
    function nextPhoto() {
        if (isTransitioning || !currentGallery.length) return;
        currentPhotoIndex = (currentPhotoIndex + 1) % currentGallery.length;
        showPhoto(currentPhotoIndex);
    }
    
    function prevPhoto() {
        if (isTransitioning || !currentGallery.length) return;
        currentPhotoIndex = (currentPhotoIndex - 1 + currentGallery.length) % currentGallery.length;
        showPhoto(currentPhotoIndex);
    }
    
    function updatePhotoCounter() {
        const counter = document.getElementById('photoCounter');
        if (counter && currentGallery.length > 0) {
            counter.textContent = `${currentPhotoIndex + 1} / ${currentGallery.length}`;
        }
    }
    
    // Timeline event clicks
    document.querySelectorAll('.timeline-item').forEach(item => {
        const eventId = item.getAttribute('data-event');
        const viewBtn = item.querySelector('.timeline-view-photos');
        
        if (viewBtn && eventId) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPhotoGallery(eventId);
            });
        }
    });
    
    // Modal controls
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const modal = document.getElementById('photoModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePhotoGallery);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePhotoGallery();
            }
        });
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPhoto();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextPhoto();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closePhotoGallery();
        }
    });
    
    // Touch gestures for mobile
    if (modal) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextPhoto();
                } else {
                    prevPhoto();
                }
            }
        }, { passive: true });
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    const handleScroll = debounce(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ed220d, #00a1fe, #005a00);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    const updateProgress = debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, 10);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
}

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
    });
    
    // Fallback: Hide loading screen after 3 seconds regardless
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 3000);
}

// ============================================
// LOAD DYNAMIC CONTENT FROM JSON (Netlify CMS)
// ============================================
async function loadTourDates() {
    try {
        const response = await fetch('data/tour/ciudad-mexico.json');
        if (!response.ok) return;
        
        const tourFiles = ['ciudad-mexico.json', 'guadalajara.json', 'monterrey.json'];
        const tourContainer = document.querySelector('.tour-dates');
        if (!tourContainer) return;
        
        tourContainer.innerHTML = '';
        
        for (const file of tourFiles) {
            try {
                const res = await fetch(`data/tour/${file}`);
                if (!res.ok) continue;
                const data = await res.json();
                
                const tourItem = document.createElement('div');
                tourItem.className = 'tour-item';
                tourItem.innerHTML = `
                    <div class="tour-date">
                        <span class="month">${data.month}</span>
                        <span class="day">${data.day}</span>
                    </div>
                    <div class="tour-info">
                        <h3>${data.city}</h3>
                        <p data-es="${data.venue_es}" data-en="${data.venue_en}">${data.venue_es}</p>
                    </div>
                    <div class="tour-status">
                        <span class="status-soon" data-es="${data.status}" data-en="${data.status}">${data.status}</span>
                    </div>
                `;
                tourContainer.appendChild(tourItem);
            } catch (e) {
                console.warn(`No se pudo cargar ${file}`);
            }
        }
        
        // Re-initialize animations for new elements
        initScrollAnimations();
    } catch (e) {
        console.warn('No se pudieron cargar las fechas de tour desde JSON');
    }
}

async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) return;
        
        const content = await response.json();
        
        // Update tagline
        const tagline = document.querySelector('.hero-tagline');
        if (tagline) {
            tagline.setAttribute('data-es', content.tagline_es);
            tagline.setAttribute('data-en', content.tagline_en);
            if (currentLanguage === 'es') {
                tagline.textContent = content.tagline_es;
            } else {
                tagline.textContent = content.tagline_en;
            }
        }
        
        // Update about description
        const aboutDesc = document.querySelector('.about-description');
        if (aboutDesc) {
            aboutDesc.setAttribute('data-es', content.about_es);
            aboutDesc.setAttribute('data-en', content.about_en);
            if (currentLanguage === 'es') {
                aboutDesc.textContent = content.about_es;
            } else {
                aboutDesc.textContent = content.about_en;
            }
        }
        
        // Update contact info
        if (content.contact) {
            const bookingEmail = document.querySelector('.contact-item p');
            if (bookingEmail && content.contact.booking_email) {
                bookingEmail.textContent = content.contact.booking_email;
            }
            
            // Update social links
            const socialLinks = document.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && content.contact) {
                    if (href.includes('spotify') && content.contact.spotify_link) {
                        link.setAttribute('href', content.contact.spotify_link);
                    } else if (href.includes('instagram') && content.contact.instagram_link) {
                        link.setAttribute('href', content.contact.instagram_link);
                    } else if (href.includes('youtube') && content.contact.youtube_link) {
                        link.setAttribute('href', content.contact.youtube_link);
                    } else if (href.includes('tiktok') && content.contact.tiktok_link) {
                        link.setAttribute('href', content.contact.tiktok_link);
                    }
                }
            });
            
            // Update Linktree button
            const linktreeBtn = document.querySelector('.btn-primary[href*="linktr"]');
            if (linktreeBtn && content.contact.linktree_link) {
                linktreeBtn.setAttribute('href', content.contact.linktree_link);
            }
        }
    } catch (e) {
        console.warn('No se pudo cargar el contenido desde JSON');
    }
}

// ============================================
// INITIALIZE ALL ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initHeroCarousel();
    initLazyLoading();
    initLanguageToggle();
    initPhotoGallery();
    initBackToTop();
    initScrollProgress();
    initLoadingScreen();
    
    // Load dynamic content from JSON (Netlify CMS)
    loadTourDates();
    loadContent();
});
