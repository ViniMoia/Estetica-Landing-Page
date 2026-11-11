/**
 * KELLEN SANTOS - ESTÉTICA AVANÇADA
 * Interactive Engine & Microinteractions
 * Design System V15 Architecture
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initial Nav & Hero Entrance
    setTimeout(() => {
        const header = document.querySelector('header');
        if (header) header.classList.add('loaded');

        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) heroTitle.classList.add('reveal-active');
    }, 120);

    // 2. Scroll Reveal Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Activate inner text-reveal wrappers if present
                const textWrappers = entry.target.querySelectorAll('.text-reveal-wrapper');
                if (textWrappers.length > 0) {
                    entry.target.classList.add('reveal-active');
                }
                
                // If it's a counter, trigger counting
                if (entry.target.classList.contains('counter-box')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Also observe headers with text-reveal-wrapper
    document.querySelectorAll('h1, h2, h3').forEach(el => {
        if (el.querySelector('.text-reveal-wrapper') && !el.classList.contains('reveal')) {
            el.classList.add('reveal');
            revealObserver.observe(el);
        }
    });

    // 3. Dynamic Flashlight Cursor Zone (Design System V15 Feature)
    const flashlightZones = document.querySelectorAll('.flashlight-zone');
    flashlightZones.forEach(zone => {
        zone.addEventListener('mousemove', (e) => {
            const rect = zone.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            zone.style.setProperty('--mouse-x', `${x}px`);
            zone.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Also track global mouse for subtle ambient movement
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--global-mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--global-mouse-y', `${e.clientY}px`);
    });

    // 4. Counter Animation for Metrics
    function animateCounter(el) {
        const targetNumber = parseInt(el.dataset.target, 10);
        if (isNaN(targetNumber) || el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const numberDisplay = el.querySelector('.counter-number');
        if (!numberDisplay) return;

        const duration = 2000;
        const startTime = performance.now();
        const startNumber = 0;

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startNumber + (targetNumber - startNumber) * easeProgress);

            numberDisplay.textContent = current.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                numberDisplay.textContent = targetNumber.toLocaleString('pt-BR');
            }
        }

        requestAnimationFrame(updateCount);
    }

    // 5. Treatment Category Filter Tabs
    const filterButtons = document.querySelectorAll('.tab-filter-btn');
    const treatmentCards = document.querySelectorAll('.treatment-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            treatmentCards.forEach(card => {
                if (category === 'all' || card.dataset.category.includes(category)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 40);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 6. Interactive Protocol Quiz ("Descubra Seu Protocolo Ideal")
    const quizOptions = document.querySelectorAll('.quiz-option-btn');
    const quizResultBox = document.getElementById('quiz-result-box');
    const quizProtocolTitle = document.getElementById('quiz-protocol-title');
    const quizProtocolDesc = document.getElementById('quiz-protocol-desc');
    const quizProtocolBullets = document.getElementById('quiz-protocol-bullets');
    const quizProtocolCTA = document.getElementById('quiz-protocol-cta');

    const protocolsDatabase = {
        'facial_antiaging': {
            title: 'Protocolo Glow & Arquitetura Facial',
            description: 'Combinação refinada de Toxina Botulínica preventiva com Bioestimulador de Colágeno (Radiesse/Sculptra) para restauração do viço, firmeza estrutural e contorno harmônico sem volumização artificial.',
            bullets: [
                'Suavização de linhas de expressão e rugas dinâmicas',
                'Estímulo biológico profundo de colágeno tipo I e III',
                'Recuperação da densidade dérmica com efeito lifting natural',
                'Avaliação com mapeamento fotográfico e simetria computadorizada'
            ],
            msg: 'Olá, Dra. Kellen Santos! Fiz o teste no site e meu foco é Rejuvenescimento Facial. Gostaria de agendar uma avaliação para o Protocolo Glow & Arquitetura Facial.'
        },
        'contorno_mandibular': {
            title: 'Protocolo Harmonia & Definição Mandibular',
            description: 'Redefinição dos ângulos faciais com Ácido Hialurônico de alta viscoelasticidade e possível Lipo Enzimática de Papada, destacando a elegância do perfil e sustentação do terço inferior.',
            bullets: [
                'Projeção milimétrica de queixo e ângulo mandibular',
                'Redução de gordura submentoniana (papada)',
                'Harmonização de perfil com precisão anatômica',
                'Procedimento seguro, seguro e com retorno imediato à rotina'
            ],
            msg: 'Olá, Dra. Kellen Santos! Gostaria de agendar uma avaliação para o Protocolo Harmonia & Definição Mandibular.'
        },
        'depilacao_laser': {
            title: 'Protocolo Laser Velvet Touch (Depilação Definitiva)',
            description: 'Tecnologia de laser padrão ouro com resfriamento térmico criogênico na ponteira. Destruição seletiva do folículo com máxima proteção dérmica, sem manchas e com total conforto.',
            bullets: [
                'Ponteira ultra refrigerada (-5°C) para sessão praticamente indolor',
                'Eliminação definitiva de pelos encravados e foliculite',
                'Eficaz e seguro em todas as tonalidades de pele',
                'Pele incrivelmente sedosa e uniforme desde as primeiras sessões'
            ],
            msg: 'Olá, equipe Kellen Santos! Quero agendar uma sessão/avaliação para a Depilação a Laser Velvet Touch em Ananindeua.'
        },
        'qualidade_pele': {
            title: 'Protocolo Hidro-Infusão & Renovação Cutânea',
            description: 'Limpeza de pele profunda personalizada associada a hidrosucção, peelings químicos e infusão de ativos antioxidantes para uma pele radiante, purificada e sem poros dilatados.',
            bullets: [
                'Extração cuidadosa e indolor de impurezas profundas',
                'Desobstrução e refinamento imediato dos poros',
                'Hidratação dérmica intensa com ácido hialurônico e vitaminas',
                'Luminosidade instantânea ideal para eventos e manutenção periódica'
            ],
            msg: 'Olá! Fiz o quiz no site da Kellen Santos e gostaria de agendar o Protocolo de Hidro-Infusão & Renovação Cutânea.'
        },
        'corporal_firmeza': {
            title: 'Protocolo Sculpt & Remodelamento Corporal',
            description: 'Tratamento sinérgico contra flacidez corporal, celulite e gordura localizada com bioestimulação injetável e drenagem modeladora exclusiva.',
            bullets: [
                'Firmeza acentuada em glúteos, abdômen, coxas e braços',
                'Melhora visível da qualidade cutânea e aspecto casca de laranja',
                'Estímulo contínuo de colágeno por até 24 meses',
                'Protocolo 100% desenhado para o seu biotipo'
            ],
            msg: 'Olá! Gostaria de uma avaliação para o Protocolo Sculpt & Remodelamento Corporal na clínica Kellen Santos.'
        }
    };

    quizOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            quizOptions.forEach(o => o.classList.remove('active', 'border-[#E5C158]', 'bg-[#E5C158]/10'));
            opt.classList.add('active', 'border-[#E5C158]', 'bg-[#E5C158]/10');

            const key = opt.dataset.quizKey;
            const protocol = protocolsDatabase[key];

            if (protocol && quizResultBox) {
                quizResultBox.style.opacity = '0';
                quizResultBox.style.transform = 'translateY(15px)';

                setTimeout(() => {
                    quizProtocolTitle.textContent = protocol.title;
                    quizProtocolDesc.textContent = protocol.description;

                    quizProtocolBullets.innerHTML = protocol.bullets
                        .map(b => `<li class="flex items-start gap-3 text-sm text-stone-300">
                            <iconify-icon icon="solar:check-circle-bold" class="text-lg text-[#E5C158] mt-0.5 flex-shrink-0"></iconify-icon>
                            <span>${b}</span>
                        </li>`)
                        .join('');

                    quizProtocolCTA.href = `https://wa.me/559181450800?text=${encodeURIComponent(protocol.msg)}`;
                    
                    quizResultBox.classList.remove('hidden');
                    setTimeout(() => {
                        quizResultBox.style.opacity = '1';
                        quizResultBox.style.transform = 'translateY(0)';
                    }, 50);
                }, 250);
            }
        });
    });

    // 7. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items for single-accordion behavior
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 8. VIP Appointment Form to WhatsApp
    const bookingForm = document.getElementById('vip-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name')?.value.trim() || '';
            const phone = document.getElementById('form-phone')?.value.trim() || '';
            const procedure = document.getElementById('form-procedure')?.value || 'Avaliação Geral';
            const period = document.getElementById('form-period')?.value || 'Qualquer horário';
            const notes = document.getElementById('form-notes')?.value.trim() || '';

            let message = `*SOLICITAÇÃO DE AGENDAMENTO VIP - KELLEN SANTOS*\n\n`;
            message += `👤 *Nome:* ${name}\n`;
            message += `📱 *WhatsApp:* ${phone}\n`;
            message += `✨ *Procedimento de Interesse:* ${procedure}\n`;
            message += `⏰ *Período de Preferência:* ${period}\n`;
            if (notes) {
                message += `📝 *Observações:* ${notes}\n`;
            }
            message += `\n_Enviado através da Landing Page Oficial_`;

            const whatsappUrl = `https://wa.me/559181450800?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // 9. Mobile Menu Drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu(open) {
        if (!mobileDrawer) return;
        if (open) {
            mobileDrawer.classList.remove('pointer-events-none', 'opacity-0');
            mobileDrawer.classList.add('pointer-events-auto', 'opacity-100');
            document.body.style.overflow = 'hidden';
        } else {
            mobileDrawer.classList.add('pointer-events-none', 'opacity-0');
            mobileDrawer.classList.remove('pointer-events-auto', 'opacity-100');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
    }
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
    }
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // 10. Smooth Parallax Effect for Images
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.parallax-img').forEach(img => {
            const speed = parseFloat(img.dataset.speed || 0.04);
            if (scrolled < window.innerHeight * 2) {
                img.style.transform = `scale(1.03) translateY(${scrolled * speed}px)`;
            }
        });
    }, { passive: true });

    // 11. Sticky Header Background Blur on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('py-3', 'shadow-2xl');
            header.classList.remove('py-5');
        } else {
            header.classList.add('py-5');
            header.classList.remove('py-3', 'shadow-2xl');
        }
    }, { passive: true });

    // 12. Floating WhatsApp button: exibição estrita após a 2ª dobra
    const floatingWhatsApp = document.querySelector('.whatsapp-floating');
    if (floatingWhatsApp) {
        const sobreSection = document.getElementById('sobre');
        const handleWhatsAppVisibility = () => {
            // 1ª dobra: Hero (100vh). 2ª dobra: Marquee + Métricas.
            // A partir da entrada na 3ª seção (#sobre) ou ultrapassando 1.4x a altura da viewport:
            const scrollThreshold = window.innerHeight * 1.4;
            let isAfterSecondFold = window.scrollY > scrollThreshold;

            if (sobreSection) {
                const rect = sobreSection.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.85) {
                    isAfterSecondFold = true;
                }
            }

            if (isAfterSecondFold) {
                floatingWhatsApp.classList.add('visible');
            } else {
                floatingWhatsApp.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleWhatsAppVisibility, { passive: true });
        handleWhatsAppVisibility();
    }

});

