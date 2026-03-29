// Mobile Menu Toggle
function initLuxuryBackground() {
    const canvas = document.getElementById('luxury-bg');
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const state = {
        width: 0,
        height: 0,
        dpr: 1,
        dustParticles: [],
        glowParticles: [],
        nebulas: [],
        pointer: { x: 0, y: 0, targetX: 0, targetY: 0, active: false },
        animationId: null,
        running: true,
    };

    const MAX_DPR = 2;

    const createParticle = (isGlow = false) => {
        const width = state.width;
        const height = state.height;

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (isGlow ? 0.03 : 0.08),
            vy: (Math.random() - 0.5) * (isGlow ? 0.03 : 0.08),
            radius: isGlow ? 1.4 + Math.random() * 2.8 : 0.4 + Math.random() * 1.6,
            alpha: isGlow ? 0.45 + Math.random() * 0.5 : 0.22 + Math.random() * 0.58,
            twinkleSpeed: 0.0015 + Math.random() * 0.004,
            twinkleOffset: Math.random() * Math.PI * 2,
            drift: 0.0005 + Math.random() * 0.0015,
        };
    };

    const createNebula = () => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        radius: Math.min(state.width, state.height) * (0.18 + Math.random() * 0.2),
        alpha: 0.05 + Math.random() * 0.08,
        speedX: (Math.random() - 0.5) * 0.03,
        speedY: (Math.random() - 0.5) * 0.03,
    });

    const setupCanvas = () => {
        state.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        state.width = window.innerWidth;
        state.height = window.innerHeight;

        canvas.width = Math.floor(state.width * state.dpr);
        canvas.height = Math.floor(state.height * state.dpr);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;

        context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

        const area = state.width * state.height;
        const dustCount = Math.max(90, Math.min(260, Math.floor(area / 8500)));
        const glowCount = Math.max(14, Math.min(42, Math.floor(area / 50000)));
        const nebulaCount = Math.max(2, Math.min(5, Math.floor(area / 350000)));

        state.dustParticles = Array.from({ length: dustCount }, () => createParticle(false));
        state.glowParticles = Array.from({ length: glowCount }, () => createParticle(true));
        state.nebulas = Array.from({ length: nebulaCount }, createNebula);
        state.pointer.x = state.width * 0.5;
        state.pointer.y = state.height * 0.45;
        state.pointer.targetX = state.pointer.x;
        state.pointer.targetY = state.pointer.y;
    };

    const wrapParticle = (particle) => {
        if (particle.x < -40) particle.x = state.width + 40;
        if (particle.x > state.width + 40) particle.x = -40;
        if (particle.y < -40) particle.y = state.height + 40;
        if (particle.y > state.height + 40) particle.y = -40;
    };

    const drawNebulas = () => {
        state.nebulas.forEach((nebula) => {
            nebula.x += nebula.speedX;
            nebula.y += nebula.speedY;

            if (nebula.x < -nebula.radius) nebula.x = state.width + nebula.radius;
            if (nebula.x > state.width + nebula.radius) nebula.x = -nebula.radius;
            if (nebula.y < -nebula.radius) nebula.y = state.height + nebula.radius;
            if (nebula.y > state.height + nebula.radius) nebula.y = -nebula.radius;

            const gradient = context.createRadialGradient(
                nebula.x,
                nebula.y,
                0,
                nebula.x,
                nebula.y,
                nebula.radius
            );

            gradient.addColorStop(0, `rgba(255, 210, 120, ${nebula.alpha})`);
            gradient.addColorStop(1, 'rgba(255, 180, 70, 0)');

            context.fillStyle = gradient;
            context.beginPath();
            context.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            context.fill();
        });
    };

    const drawParticleGroup = (particles, time, isGlow = false) => {
        particles.forEach((particle) => {
            particle.x += particle.vx + Math.sin(time * particle.drift) * 0.03;
            particle.y += particle.vy + Math.cos(time * particle.drift) * 0.03;

            if (isGlow) {
                const dxPointer = state.pointer.x - particle.x;
                const dyPointer = state.pointer.y - particle.y;
                const distanceSq = dxPointer * dxPointer + dyPointer * dyPointer;
                const influenceRadiusSq = 260 * 260;

                if (distanceSq < influenceRadiusSq) {
                    const pull = (1 - distanceSq / influenceRadiusSq) * 0.016;
                    particle.x += dxPointer * pull;
                    particle.y += dyPointer * pull;
                }
            }

            wrapParticle(particle);

            const twinkle = 0.72 + 0.28 * Math.sin(time * particle.twinkleSpeed + particle.twinkleOffset);
            const alpha = particle.alpha * twinkle;

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

            if (isGlow) {
                context.shadowBlur = 22;
                context.shadowColor = 'rgba(255, 210, 120, 0.95)';
                context.fillStyle = `rgba(255, 218, 135, ${alpha})`;
            } else {
                context.shadowBlur = 0;
                context.fillStyle = `rgba(240, 190, 95, ${alpha})`;
            }

            context.fill();
        });
    };

    const render = (timestamp) => {
        if (!state.running) return;

        const time = timestamp || performance.now();
        context.clearRect(0, 0, state.width, state.height);

        state.pointer.x += (state.pointer.targetX - state.pointer.x) * 0.05;
        state.pointer.y += (state.pointer.targetY - state.pointer.y) * 0.05;

        const centerX = state.width * 0.5;
        const centerY = state.height * 0.45;
        const pulse = 0.12 + 0.05 * (0.5 + 0.5 * Math.sin(time * 0.00045));
        const centerGradient = context.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            Math.max(state.width, state.height) * 0.65
        );
        centerGradient.addColorStop(0, `rgba(255, 208, 118, ${pulse})`);
        centerGradient.addColorStop(0.45, 'rgba(255, 185, 80, 0.05)');
        centerGradient.addColorStop(1, 'rgba(8, 8, 8, 0)');

        context.fillStyle = centerGradient;
        context.fillRect(0, 0, state.width, state.height);

        const pointerGlow = context.createRadialGradient(
            state.pointer.x,
            state.pointer.y,
            0,
            state.pointer.x,
            state.pointer.y,
            state.pointer.active ? 230 : 160
        );
        pointerGlow.addColorStop(0, state.pointer.active ? 'rgba(255, 219, 138, 0.2)' : 'rgba(255, 205, 110, 0.11)');
        pointerGlow.addColorStop(1, 'rgba(255, 180, 70, 0)');
        context.fillStyle = pointerGlow;
        context.fillRect(0, 0, state.width, state.height);

        drawNebulas();

        context.globalCompositeOperation = 'screen';
        drawParticleGroup(state.dustParticles, time, false);
        drawParticleGroup(state.glowParticles, time, true);
        context.globalCompositeOperation = 'source-over';
        context.shadowBlur = 0;

        state.animationId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
        state.running = !document.hidden;
        if (state.running) {
            cancelAnimationFrame(state.animationId);
            state.animationId = requestAnimationFrame(render);
        } else {
            cancelAnimationFrame(state.animationId);
        }
    };

    const updatePointerTarget = (clientX, clientY, active) => {
        state.pointer.targetX = Math.max(0, Math.min(state.width, clientX));
        state.pointer.targetY = Math.max(0, Math.min(state.height, clientY));
        state.pointer.active = active;
    };

    const handlePointerMove = (event) => {
        updatePointerTarget(event.clientX, event.clientY, true);
    };

    const handlePointerLeave = () => {
        updatePointerTarget(state.width * 0.5, state.height * 0.45, false);
    };

    const handleTouchMove = (event) => {
        if (!event.touches || !event.touches.length) return;
        const touch = event.touches[0];
        updatePointerTarget(touch.clientX, touch.clientY, true);
    };

    const handleTouchEnd = () => {
        updatePointerTarget(state.width * 0.5, state.height * 0.45, false);
    };

    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupCanvas();
        }, 150);
    };

    setupCanvas();
    state.animationId = requestAnimationFrame(render);

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
}

initLuxuryBackground();

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
        image: 'assets/Desing Sombrancelha.jpeg',
        title: 'Design com Henna',
        description: 'Modelagem perfeita utilizando henna de alta qualidade. Resultado temporário ideal para quem deseja experimentar antes de procedimentos definitivos.'
    },
    {
        image: 'assets/Micropigmentaçao Labial Antes e Depois.jpeg',
        title: 'Micropigmentação Labial',
        description: 'Antes e Depois impressionante que mostra a transformação completa. Lábios com mais cor, definição e aparência jovem, sem necessidade de maquiagem diária.'
    },
    {
        image: 'assets/Micropigmentaçao de sombrancelha Hibrida Antes e Depois.jpeg',
        title: 'Micropigmentação Híbrida',
        description: 'Combinação da técnica fio a fio com sombreamento para um resultado preenchido, definido e harmonioso, mantendo a naturalidade.'
    },
    {
        image: 'assets/BBGLOW.jpeg',
        title: 'BB Glow',
        description: 'Pele iluminada, uniforme e radiante. Tratamento coreano que proporciona efeito de base natural, reduzindo imperfeições e promovendo luminosidade.'
    },
    {
        image: 'assets/Limpeza.jpeg',
        title: 'Limpeza de Pele com Argiloterapia',
        description: 'Protocolo de higienização profunda com ação terapêutica das argilas, promovendo equilíbrio da pele, redução da oleosidade e melhora da textura.'
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
        image: 'assets/Desing Sombrancelha Antes e Depois 2.jpeg',
        title: 'Design Transformador',
        description: 'Antes e Depois com harmonização completa das sobrancelhas, valorizando o olhar e destacando a simetria natural do rosto.'
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

const genericServiceModal = document.getElementById('genericServiceModal');
const genericServiceImage = document.getElementById('genericServiceImage');
const genericServiceTitle = document.getElementById('genericServiceTitle');
const genericServiceIntro = document.getElementById('genericServiceIntro');
const genericServiceBenefits = document.getElementById('genericServiceBenefits');

const genericServiceData = {
    'rejuvenescimento-facial': {
        image: 'assets/BBGLOW.jpeg',
        title: 'Rejuvenescimento Facial',
        intro: 'Protocolo focado em revitalização da pele, melhora da firmeza e redução de sinais do tempo com técnicas seguras e personalizadas para cada tipo de pele.',
        benefits: [
            'Melhora da firmeza e elasticidade',
            'Redução de linhas finas e aspecto cansado',
            'Pele mais viçosa e iluminada',
            'Estimula renovação celular e colágeno'
        ]
    },
    'delineado-olhos': {
        image: 'assets/Micropigmentaçao de sombrancelha Shadow Antes e Depois.jpeg',
        title: 'Micropigmentação Delineado de Olhos',
        intro: 'Procedimento de delineado permanente que valoriza o olhar com acabamento elegante e natural, ideal para quem busca praticidade no dia a dia.',
        benefits: [
            'Realce do olhar com efeito duradouro',
            'Mais praticidade na rotina de maquiagem',
            'Correção de pequenas assimetrias',
            'Resultado personalizado conforme o estilo da cliente'
        ]
    },
    'design-henna': {
        image: 'assets/Desing Sombrancelha.jpeg',
        title: 'Design com Henna',
        intro: 'Design estratégico das sobrancelhas com aplicação de henna para destacar o formato, preencher falhas e entregar resultado imediato.',
        benefits: [
            'Preenchimento visual das falhas',
            'Definição e harmonização do olhar',
            'Resultado imediato',
            'Excelente opção para testar formato'
        ]
    },
    'bbglow': {
        image: 'assets/BBGLOW.jpeg',
        title: 'BB Glow',
        intro: 'Tratamento coreano que promove efeito de pele uniforme e iluminada, reduzindo imperfeições e melhorando a aparência geral do rosto.',
        benefits: [
            'Melhora da luminosidade da pele',
            'Tom mais uniforme',
            'Redução visual de poros e manchas leves',
            'Efeito de pele saudável e bem cuidada'
        ]
    },
    'microagulhamento': {
        image: 'assets/Limpeza.jpeg',
        title: 'Microagulhamento',
        intro: 'Técnica que estimula colágeno através de microperfurações controladas, melhorando textura da pele e auxiliando em cicatrizes e sinais de envelhecimento.',
        benefits: [
            'Estimula produção natural de colágeno',
            'Melhora textura e firmeza da pele',
            'Auxilia na redução de cicatrizes de acne',
            'Potencializa absorção de ativos'
        ]
    },
    'peeling': {
        image: 'assets/WhatsApp Image 2026-02-06 at 11.49.29.jpeg',
        title: 'Peeling',
        intro: 'Procedimento de renovação celular que contribui para uma pele mais lisa, uniforme e com aparência rejuvenescida.',
        benefits: [
            'Renovação das camadas superficiais da pele',
            'Auxilia no clareamento de manchas',
            'Reduz oleosidade e melhora textura',
            'Pele mais macia e revitalizada'
        ]
    },
    'dermaplaning': {
        image: 'assets/WhatsApp Image 2026-02-06 at 11.49.29.jpeg',
        title: 'Dermaplaning',
        intro: 'Esfoliação avançada que remove células mortas e pelos finos da face, deixando a pele extremamente macia e com brilho saudável.',
        benefits: [
            'Remoção de células mortas e penugem facial',
            'Toque suave e acabamento uniforme',
            'Favorece aplicação de maquiagem',
            'Resultado imediato de pele radiante'
        ]
    }
};

function openGenericServiceModal(serviceKey) {
    const data = genericServiceData[serviceKey];
    if (!data || !genericServiceModal || !genericServiceImage || !genericServiceTitle || !genericServiceIntro || !genericServiceBenefits) return;

    genericServiceImage.src = data.image;
    genericServiceImage.alt = data.title;
    genericServiceTitle.textContent = data.title;
    genericServiceIntro.textContent = data.intro;

    genericServiceBenefits.innerHTML = '';
    data.benefits.forEach((benefit) => {
        const listItem = document.createElement('li');
        listItem.textContent = benefit;
        genericServiceBenefits.appendChild(listItem);
    });

    genericServiceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openServiceModal(serviceKey) {
    const serviceModal = serviceModals[serviceKey];
    if (!serviceModal) {
        openGenericServiceModal(serviceKey);
        return;
    }

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
