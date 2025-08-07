/* --- ФІНАЛЬНИЙ JAVASCRIPT ДЛЯ САЙТУ ARCH BUD CITY (Версія з усіма функціями) --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- УНІВЕРСАЛЬНА АНІМАЦІЯ ПОЯВИ ЕЛЕМЕНТІВ ПРИ ПРОКРУТЦІ ---
    try {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.service-block, .section-title, h2, .feature-item, .showcase-grid img, .achievement-block, .gallery-item, .category-description');
        animatedElements.forEach(element => scrollObserver.observe(element));
    } catch (e) {
        console.error("Помилка в ініціалізації анімації при прокрутці:", e);
    }

    // --- СЛАЙДЕР НА ГОЛОВНІЙ СТОРІНЦІ (HERO SLIDER) ---
    try {
        const swiperContainer = document.querySelector('.hero-slider .swiper');
        if (swiperContainer) {
            const showcaseSwiper = new Swiper(swiperContainer, {
                loop: true,
                slidesPerView: 1,
                speed: 800,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 'auto',
                        speed: 5000,
                        autoplay: {
                            delay: 0,
                        },
                    }
                }
            });
        }
    } catch (e) {
        console.error("Помилка в ініціалізації слайдера:", e);
    }

    // --- ЛІЧИЛЬНИК ДОСЯГНЕНЬ ---
    try {
        const achievementsSection = document.querySelector('#achievements');
        if (achievementsSection) {
            let animationStarted = false;
            const counters = document.querySelectorAll('.counter');
            const startCounter = (counter) => {
                const target = +counter.getAttribute('data-target');
                let current = 0;
                const increment = target / 100;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            };
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animationStarted) {
                        counters.forEach(startCounter);
                        animationStarted = true;
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counterObserver.observe(achievementsSection);
        }
    } catch (e) {
        console.error("Помилка в ініціалізації лічильника:", e);
    }

    // --- ЛОГІКА ДЛЯ СТОРІНКИ ГАЛЕРЕЇ ---
    try {
        const galleryPage = document.querySelector('.gallery');
        if (galleryPage) {
            const showcaseContainer = document.querySelector('.category-showcase');
            const filterContainer = document.querySelector('.gallery-filters');
            const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
            const descriptionItems = document.querySelectorAll('.category-description');
            const loadMoreBtn = document.getElementById('load-more-btn');
            const galleryGrid = document.querySelector('.gallery-grid');
            
            const itemsToShow = 6;
            let currentlyShown = 0;
            let currentFilter = 'all';

            const applyFilterAndLoad = () => {
                const filteredItems = currentFilter === 'all' 
                    ? allGalleryItems 
                    : allGalleryItems.filter(item => item.dataset.category === currentFilter);

                allGalleryItems.forEach(item => item.style.display = 'none');
                
                currentlyShown = itemsToShow;
                const itemsToDisplay = filteredItems.slice(0, currentlyShown);
                itemsToDisplay.forEach(item => item.style.display = 'block');

                if (loadMoreBtn) {
                    if (filteredItems.length > currentlyShown) {
                        loadMoreBtn.style.display = 'inline-block';
                    } else {
                        loadMoreBtn.style.display = 'none';
                    }
                }
            };

            if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            filterContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            
            // Застосовуємо фільтр і скидаємо лічильник завантажених фото
            applyFilterAndLoad();

            // Показуємо/ховаємо блок опису
            if (showcaseContainer) {
                if (currentFilter === 'all') {
                    showcaseContainer.style.display = 'none';
                } else {
                    showcaseContainer.style.display = 'block';
                    descriptionItems.forEach(desc => {
                        desc.classList.toggle('active', desc.getAttribute('data-category') === currentFilter);
                    });
                }
            }
        }
    });
}

            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => {
                    const filteredItems = currentFilter === 'all' 
                        ? allGalleryItems 
                        : allGalleryItems.filter(item => item.dataset.category === currentFilter);
                    
                    const nextItems = filteredItems.slice(currentlyShown, currentlyShown + itemsToShow);
                    nextItems.forEach(item => item.style.display = 'block');
                    currentlyShown += itemsToShow;

                    if (currentlyShown >= filteredItems.length) {
                        loadMoreBtn.style.display = 'none';
                    }
                });
            }

            // Лайтбокс
if (galleryGrid) { // Перевіряємо, чи існує сітка, перш ніж додавати логіку
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    document.body.appendChild(lightbox);
    const lightboxImage = document.createElement('img');
    lightbox.appendChild(lightboxImage);
    const closeButton = document.createElement('span');
    closeButton.classList.add('lightbox-close');
    closeButton.innerHTML = '&times;';
    lightbox.appendChild(closeButton);

    galleryGrid.addEventListener('click', e => {
        e.preventDefault();
        const link = e.target.closest('.gallery-item');
        if (link && link.style.display !== 'none') {
            lightboxImage.setAttribute('src', link.getAttribute('href'));
            lightbox.classList.add('visible');
        }
    });

    const closeLightbox = () => lightbox.classList.remove('visible');
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });
}

            // Ініціалізуємо початковий вигляд
            if (showcaseContainer) {
                showcaseContainer.style.display = 'none';
            }
            applyFilterAndLoad();
        }
    } catch (e) {
        console.error("Помилка в ініціалізації галереї:", e);
    }
});
// --- ЛОГІКА ДЛЯ МОБІЛЬНОГО "БУРГЕР-МЕНЮ" (ФІНАЛЬНА ВЕРСІЯ) ---
try {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navCloseBtn = document.querySelector('.nav-close-btn');

    if (hamburgerBtn && navMenu && navCloseBtn) {
        
        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
        };

        const closeMenu = () => {
            hamburgerBtn.classList.remove('is-active');
            navMenu.classList.remove('is-active');
        };

        // Відкриття/закриття меню по кліку на бургер
        hamburgerBtn.addEventListener('click', toggleMenu);

        // Закриття меню по кліку на хрестик
        navCloseBtn.addEventListener('click', closeMenu);

        // Закриття меню по кліку на будь-яке посилання
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
} catch (e) {
    console.error("Помилка в ініціалізації бургер-меню:", e);
}
