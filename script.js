// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.pageYOffset > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            const shouldShow = filterValue === 'all' || item.getAttribute('data-category') === filterValue;

            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Portfolio Modal
const modal = document.getElementById('portfolioModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.querySelector('#portfolioModal .modal-close');
const modalPrev = document.querySelector('#portfolioModal .modal-prev');
const modalNext = document.querySelector('#portfolioModal .modal-next');

const portfolioData = [
    {
        image: 'assets/portfolio-2.jpg',
        title: 'Design com Henna',
        description: 'Modelagem perfeita utilizando henna de alta qualidade. Resultado temporário ideal para quem deseja experimentar antes de procedimentos definitivos.'
    },
    {
        image: 'assets/Micropigmentaçao Labial Antes e Depois.jpeg',
        title: 'Micropigmentação Labial',
        description: 'Antes e Depois impressionante que mostra a transformação completa. Lábios com mais cor, definição e aparência jovem, sem necessidade de maquiagem diária.'
    },
    {
        image: 'assets/portfolio-4.jpg',
        title: 'Delineado Permanente',
        description: 'Olhar marcante e expressivo com delineado permanente. Resultado natural que valoriza o olhar sem exageros.'
    },
    {
        image: 'assets/portfolio-5.jpg',
        title: 'BB Glow',
        description: 'Pele iluminada, uniforme e radiante. Tratamento coreano que proporciona efeito de base natural, reduzindo imperfeições e promovendo luminosidade.'
    },
    {
        image: 'assets/portfolio-6.jpg',
        title: 'Microagulhamento',
        description: 'Rejuvenescimento facial com microagulhamento. Estímulo de colágeno para pele mais firme, redução de cicatrizes e melhora significativa da textura.'
    },
    {
        image: 'assets/Desing Sombrancelha.jpeg',
        title: 'Design de Sobrancelhas',
        description: 'Modelagem estratégica para harmonizar o rosto e realçar o olhar. Procedimento que respeita a anatomia natural da sobrancelha, deixando o resultado perfeito e natural.'
    },
    {
        image: 'assets/Desing Sombrancelha Antes e Depois.jpeg',
        title: 'Design com Transformação',
        description: 'Antes e Depois impressionante. Transformação completa das sobrancelhas, mostrando como um bom design pode realçar toda a beleza do rosto e do olhar da cliente.'
    },
    {
        image: 'assets/portfolio-8.jpg',
        title: 'Peeling Químico',
        description: 'Renovação celular profunda com peeling químico. Pele mais lisa, clara e rejuvenescida, com redução de manchas e sinais de idade.'
    },
    {
        image: 'assets/Micropigmentaçao de sombrancelha Fio a Fio Antes e Depois.jpeg',
        title: 'Micropigmentação Fio a Fio',
        description: 'Técnica fio a fio que simula o crescimento natural dos pelos. Resultado extremamente natural e realista, perfeito para quem quer um efeito discreto e elegante.'
    },
    {
        image: 'assets/Micropigmentaçao de sombrancelha Hibrida Antes e Depois.jpeg',
        title: 'Micropigmentação Híbrido',
        description: 'Combinação perfeita da técnica fio a fio com sombra. Resultado mais preenchido, volumoso e marcante, com aspecto natural. Muito procurado atualmente.'
    },
    {
        image: 'assets/Micropigmentaçao de sombrancelha Shadow Antes e Depois.jpeg',
        title: 'Micropigmentação Shadow',
        description: 'Efeito de sobrancelhas maquiadas com pó. Resultado bem preenchido, definido e durável. Ideal para pele oleosa e quem quer um resultado bem pigmentado.'
    }
];

let currentPortfolioIndex = 0;

function openPortfolioModal(index) {
    const data = portfolioData[index];
    if (!data || !modal || !modalImage || !modalTitle || !modalDescription) return;

    currentPortfolioIndex = index;
    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.portfolio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = Number(btn.getAttribute('data-index'));
        openPortfolioModal(index);
    });
});

if (modalClose) modalClose.addEventListener('click', closePortfolioModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePortfolioModal();
    });
}
if (modalPrev) {
    modalPrev.addEventListener('click', () => {
        currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioData.length) % portfolioData.length;
        openPortfolioModal(currentPortfolioIndex);
    });
}
if (modalNext) {
    modalNext.addEventListener('click', () => {
        currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioData.length;
        openPortfolioModal(currentPortfolioIndex);
    });
}

document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closePortfolioModal();
    if (e.key === 'ArrowLeft' && modalPrev) modalPrev.click();
    if (e.key === 'ArrowRight' && modalNext) modalNext.click();
});

// Testimonials Slider
const testimonialsSlider = document.querySelector('.testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const sliderDotsContainer = document.querySelector('.slider-dots');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;

function getCardsPerView() {
    return window.innerWidth > 968 ? 3 : 1;
}

function getTotalSlides() {
    if (!testimonialCards.length) return 0;
    return Math.ceil(testimonialCards.length / getCardsPerView());
}

function renderDots() {
    if (!sliderDotsContainer) return;
    sliderDotsContainer.innerHTML = '';

    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsContainer.appendChild(dot);
    }
}

function updateSlider() {
    if (!testimonialsSlider || !testimonialCards.length) return;

    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 30;
    const offset = -(currentSlide * (cardWidth + gap) * getCardsPerView());
    testimonialsSlider.style.transform = `translateX(${offset}px)`;

    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    const total = getTotalSlides();
    if (!total) return;
    currentSlide = ((index % total) + total) % total;
    updateSlider();
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
}
if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
}
if (testimonialsSlider && testimonialCards.length) {
    renderDots();
    updateSlider();
    window.addEventListener('resize', () => {
        currentSlide = 0;
        renderDots();
        updateSlider();
    });
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
        contactForm.reset();
    });
}

// Back to Top
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Service Modals
const serviceModals = {
    'argiloterapia': document.getElementById('serviceModal'),
    'design-sombrancelha': document.getElementById('designSombrancelhaModal'),
    'micropigmentacao-sombrancelha': document.getElementById('micropigmentacaoModal'),
    'micropigmentacao-labial': document.getElementById('micropigmentacaoLabialModal')
};

function openServiceModal(serviceKey) {
    const serviceModal = serviceModals[serviceKey];
    if (!serviceModal) return;

    if (serviceKey === 'design-sombrancelha') {
        const images = serviceModal.querySelectorAll('.gallery-image');
        const indicators = serviceModal.querySelectorAll('.indicator');
        images.forEach((img, index) => {
            img.style.display = index === 0 ? 'block' : 'none';
        });
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
    }

    if (serviceKey === 'micropigmentacao-sombrancelha') {
        const images = serviceModal.querySelectorAll('.gallery-image');
        const indicators = serviceModal.querySelectorAll('.micropig-indicator');
        const techSections = serviceModal.querySelectorAll('.tech-section');
        images.forEach((img, index) => {
            img.style.display = index === 0 ? 'block' : 'none';
        });
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
        techSections.forEach((section, index) => {
            section.classList.toggle('active', index === 0);
        });
    }

    if (serviceKey === 'micropigmentacao-labial') {
        const images = serviceModal.querySelectorAll('.gallery-image');
        const indicators = serviceModal.querySelectorAll('.labial-indicator');
        images.forEach((img, index) => {
            img.style.display = index === 0 ? 'block' : 'none';
        });
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
    }

    serviceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAnyModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.service-detail-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const service = button.getAttribute('data-service');
        openServiceModal(service);
    });
});

document.querySelectorAll('.modal .modal-close').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        const parentModal = closeButton.closest('.modal');
        closeAnyModal(parentModal);
    });
});

document.querySelectorAll('.modal').forEach(modalElement => {
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeAnyModal(modalElement);
        }
    });
});

// Design Gallery
const designModal = document.getElementById('designSombrancelhaModal');
if (designModal) {
    const images = designModal.querySelectorAll('.gallery-image');
    const prev = designModal.querySelector('.gallery-prev');
    const next = designModal.querySelector('.gallery-next');
    const indicators = designModal.querySelectorAll('.indicator');
    let current = 0;

    const showImage = (index) => {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        current = index;
    };

    if (prev) prev.addEventListener('click', () => showImage((current - 1 + images.length) % images.length));
    if (next) next.addEventListener('click', () => showImage((current + 1) % images.length));
    indicators.forEach((dot, i) => dot.addEventListener('click', () => showImage(i)));
}

// Micropigmentação Gallery
const micropigModal = document.getElementById('micropigmentacaoModal');
if (micropigModal) {
    const images = micropigModal.querySelectorAll('.gallery-image');
    const prev = micropigModal.querySelector('.micropig-prev');
    const next = micropigModal.querySelector('.micropig-next');
    const indicators = micropigModal.querySelectorAll('.micropig-indicator');
    const techSections = micropigModal.querySelectorAll('.tech-section');
    let current = 0;

    const showMicropigImage = (index) => {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        techSections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        current = index;
    };

    if (prev) prev.addEventListener('click', () => showMicropigImage((current - 1 + images.length) % images.length));
    if (next) next.addEventListener('click', () => showMicropigImage((current + 1) % images.length));
    indicators.forEach((dot, i) => dot.addEventListener('click', () => showMicropigImage(i)));
}

// Micropigmentação Labial Gallery
const labialModal = document.getElementById('micropigmentacaoLabialModal');
if (labialModal) {
    const images = labialModal.querySelectorAll('.gallery-image');
    const prev = labialModal.querySelector('.labial-prev');
    const next = labialModal.querySelector('.labial-next');
    const indicators = labialModal.querySelectorAll('.labial-indicator');
    let current = 0;

    const showLabialImage = (index) => {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        current = index;
    };

    if (prev) prev.addEventListener('click', () => showLabialImage((current - 1 + images.length) % images.length));
    if (next) next.addEventListener('click', () => showLabialImage((current + 1) % images.length));
    indicators.forEach((dot, i) => dot.addEventListener('click', () => showLabialImage(i)));
}
