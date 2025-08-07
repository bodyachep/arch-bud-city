// Чекаємо, поки весь HTML-документ завантажиться
document.addEventListener('DOMContentLoaded', () => {

    // Створюємо "спостерігача" за елементами
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Якщо елемент з'явився у видимій зоні
            if (entry.isIntersecting) {
                // Додаємо йому клас 'visible', щоб запустити анімацію
                entry.target.classList.add('visible');
                // Припиняємо спостерігати за ним, щоб анімація не повторювалась
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Анімація спрацює, коли видно хоча б 10% елемента
    });

    // Знаходимо всі елементи, які хочемо анімувати
    // Ви можете додати сюди інші селектори через кому, наприклад '.section h2'
    const animatedElements = document.querySelectorAll('.service-block, .section h2, .contact p');

    // Кажемо спостерігачу стежити за кожним з цих елементів
    animatedElements.forEach(element => {
        observer.observe(element);
    });

});
// --- ІНІЦІАЛІЗАЦІЯ СЛАЙДЕРА ПРОЄКТІВ (SWIPER.JS) ---
const showcaseSwiper = new Swiper('.swiper', {
    // --- Налаштування для мобільних пристроїв (за замовчуванням) ---
    loop: true,
    slidesPerView: 1,       // Показуємо 1 слайд на весь екран
    speed: 800,           // Швидкість перемикання - 0.8 секунди
    autoplay: {
        delay: 2000,          // Затримка між слайдами - 2 секунди
        disableOnInteraction: false,
    },

    // --- Налаштування для великих екранів (планшети та комп'ютери) ---
    breakpoints: {
        // Якщо ширина екрану 768px або більше
        768: {
            slidesPerView: 'auto', // Повертаємо автоматичну ширину
            speed: 5000,         // Повертаємо повільну швидкість для плавного руху
            autoplay: {
                delay: 0,            // Повертаємо безперервний рух
            },
        }
    }
});
/* --- ФІНАЛЬНИЙ JAVASCRIPT ДЛЯ САЙТУ ARCH BUD CITY --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- УНІВЕРСАЛЬНА АНІМАЦІЯ ПОЯВИ ЕЛЕМЕНТІВ ПРИ ПРОКРУТЦІ ---
    // Працює на всіх сторінках
    try {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.service-block, .section-title, .feature-item, .showcase-grid img, .achievement-block, .gallery-item');
        animatedElements.forEach(element => scrollObserver.observe(element));
    } catch (e) {
        console.error("Помилка в ініціалізації анімації при прокрутці:", e);
    }

    // --- СЛАЙДЕР НА ГОЛОВНІЙ СТОРІНЦІ (HERO SLIDER) ---
    // Активується тільки на index.html
    try {
        const swiperContainer = document.querySelector('.hero-slider .swiper');
        if (swiperContainer) {
            const showcaseSwiper = new Swiper(swiperContainer, {
                loop: true,
                slidesPerView: 1,
                speed: 800,
                autoplay: {
                    delay: 2000,
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
    // Активується тільки на index.html
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
    
    // --- ЛОГІКА ДЛЯ ГАЛЕРЕЇ (ФІЛЬТРИ + ЛАЙТБОКС) ---
    // Активується тільки на gallery.html
    try {
        // Фільтри
        const filterContainer = document.querySelector('.gallery-filters');
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    filterContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    const filterValue = e.target.getAttribute('data-filter');
                    galleryItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        }

        // Лайтбокс
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
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
                if (link) {
                    const imgSrc = link.getAttribute('href');
                    lightboxImage.setAttribute('src', imgSrc);
                    lightbox.classList.add('visible');
                }
            });

            const closeLightbox = () => lightbox.classList.remove('visible');
            closeButton.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });
        }
    } catch (e) {
        console.error("Помилка в ініціалізації галереї:", e);
    }
});
// --- ЛОГІКА ДЛЯ КНОПКИ "ЗАВАНТАЖИТИ ЩЕ" ---
    try {
        const loadMoreBtn = document.getElementById('load-more-btn');
        const galleryGrid = document.querySelector('.gallery-grid');

        if (loadMoreBtn && galleryGrid) {
            const allItems = Array.from(galleryGrid.getElementsByClassName('gallery-item'));
            const itemsToShow = 6; // Скільки фото показувати за раз
            let currentlyShown = itemsToShow;

            // Спочатку ховаємо всі елементи, крім першої порції
            allItems.forEach((item, index) => {
                if (index >= itemsToShow) {
                    item.classList.add('hidden');
                }
            });

            // Якщо спочатку фотографій менше або дорівнює порції, ховаємо кнопку
            if (allItems.length <= itemsToShow) {
                loadMoreBtn.classList.add('hidden');
            }

            loadMoreBtn.addEventListener('click', () => {
                const nextItems = allItems.slice(currentlyShown, currentlyShown + itemsToShow);
                nextItems.forEach(item => item.classList.remove('hidden'));
                
                currentlyShown += itemsToShow;

                // Ховаємо кнопку, якщо більше немає фото
                if (currentlyShown >= allItems.length) {
                    loadMoreBtn.classList.add('hidden');
                }
            });
        }
    } catch (e) {
        console.error("Помилка в ініціалізації кнопки 'Завантажити ще':", e);
    }
    