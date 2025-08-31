document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATIONS ---
    const TOTAL_GALLERY_IMAGES = 43;

    // --- ELEMENT SELECTIONS ---
    const root = document.documentElement;
    const header = document.querySelector('.header');
    const motionToggle = document.getElementById('motion-toggle');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const galleryTrack = document.getElementById('gallery-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentYearSpan = document.getElementById('current-year');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox__close');
    const serviceCards = document.querySelectorAll('.service-card-link');
    const sections = document.querySelectorAll('.section');
    const textRevealElements = document.querySelectorAll('.text-reveal');

    // --- HEADER SCROLL EFFECT --- //
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);

    // --- ACCESSIBILITY & SETTINGS --- //
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = localStorage.getItem('reduceMotion') === 'true' || motionQuery.matches;

    const applyMotionPreference = () => {
        root.classList.toggle('reduce-motion', reduceMotion);
        motionToggle.setAttribute('aria-pressed', String(reduceMotion));
    };

    motionToggle.addEventListener('click', () => {
        reduceMotion = !reduceMotion;
        localStorage.setItem('reduceMotion', String(reduceMotion));
        applyMotionPreference();
    });

    const FONT_STEP = 1;
    const MIN_FONT_SIZE = 16;
    const MAX_FONT_SIZE = 22;
    let currentFontSize = parseInt(localStorage.getItem('fontSize')) || 18;

    const applyFontSize = () => {
        root.style.setProperty('--base-font-size', `${currentFontSize}px`);
        localStorage.setItem('fontSize', String(currentFontSize));
    };

    fontIncreaseBtn.addEventListener('click', () => {
        if (currentFontSize < MAX_FONT_SIZE) {
            currentFontSize += FONT_STEP;
            applyFontSize();
        }
    });

    fontDecreaseBtn.addEventListener('click', () => {
        if (currentFontSize > MIN_FONT_SIZE) {
            currentFontSize -= FONT_STEP;
            applyFontSize();
        }
    });

    // --- GALLERY & LIGHTBOX --- //
    let currentIndex = 0;
    let slides = [];

    const createGallery = () => {
        if (!galleryTrack) return;
        galleryTrack.innerHTML = '';
        for (let i = 1; i <= TOTAL_GALLERY_IMAGES; i++) {
            if (i === 12) continue; // Omitir si falta
            const slide = document.createElement('div');
            slide.className = 'gallery__slide';
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-label', `Imagen ${i} de ${TOTAL_GALLERY_IMAGES}`);
            
            let rawFileName = `Publi (${i}).png`;
            if (i === 43) {
                rawFileName = `Publi (${i}).jpg`;
            }
            const encodedFileName = encodeURIComponent(rawFileName).replace(/\(/g, '%28').replace(/\)/g, '%29');

            const img = document.createElement('img');
            img.src = encodedFileName;
            img.alt = `Trabajo de peluquería ${i}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.width = 400;
            img.height = 400;

            slide.appendChild(img);
            galleryTrack.appendChild(slide);

            slide.addEventListener('click', () => openLightbox(img.src, img.alt));
        }
        slides = Array.from(galleryTrack.children);
    };

    const updateCarousel = () => {
        if (!galleryTrack || slides.length === 0) return;
        const slideWidth = slides[0].getBoundingClientRect().width;
        galleryTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    const showNext = () => {
        const slidesPerView = Math.round(galleryTrack.parentElement.offsetWidth / slides[0].offsetWidth);
        currentIndex = (currentIndex < slides.length - slidesPerView) ? currentIndex + 1 : 0;
        updateCarousel();
    };

    const showPrev = () => {
        const slidesPerView = Math.round(galleryTrack.parentElement.offsetWidth / slides[0].offsetWidth);
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - slidesPerView;
        updateCarousel();
    };

    const openLightbox = (src, alt) => {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('is-visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    };

    if (galleryTrack) {
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        window.addEventListener('resize', updateCarousel);
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) closeLightbox();
        });
    }

    // --- INTERSECTION OBSERVERS FOR ANIMATIONS --- //
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const typingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeEffect(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    textRevealElements.forEach(el => {
        typingObserver.observe(el);
    });

    const serviceCardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Asignar el delay para la animación secuencial
                entry.target.style.setProperty('--delay', `${index * 100}ms`);
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        serviceCardObserver.observe(card);
    });

    function typeEffect(element) {
        const text = element.getAttribute('data-text');
        element.innerHTML = '';
        let i = 0;
        const cursor = document.createElement('span');
        cursor.classList.add('cursor');
        element.appendChild(cursor);

        const typing = setInterval(() => {
            if (i < text.length) {
                cursor.insertAdjacentText('beforebegin', text.charAt(i));
                i++;
            } else {
                clearInterval(typing);
                setTimeout(() => cursor.remove(), 1000);
            }
        }, 50);
    }

    // --- INITIALIZATION --- //
    const init = () => {
        if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
        applyMotionPreference();
        applyFontSize();
        createGallery();
        if (slides.length > 0) updateCarousel();

        // Store original text and clear the elements for the typing animation
        textRevealElements.forEach(el => {
            el.setAttribute('data-text', el.textContent);
            el.textContent = '';
        });
    };

    init();
});
