document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Home Split-Screen Hover Logic
    // ==========================================
    const splitWrapper = document.getElementById('split-wrapper');
    if (splitWrapper) {
        const panels = document.querySelectorAll('.category-panel');

        splitWrapper.addEventListener('mouseleave', () => {
            panels.forEach(p => {
                p.classList.remove('is-active');
                p.classList.remove('is-dimmed');
            });
        });

        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                if (window.innerWidth > 900) {
                    panels.forEach(p => {
                        if (p === panel) {
                            p.classList.add('is-active');
                            p.classList.remove('is-dimmed');
                        } else {
                            p.classList.add('is-dimmed');
                            p.classList.remove('is-active');
                        }
                    });
                }
            });
        });
    }

    // ==========================================
    // Before/After Slider Logic (Landing Pages)
    // ==========================================
    const sliderContainer = document.querySelector('.ba-slider-container');
    if (sliderContainer) {
        const beforeImage = document.querySelector('.ba-before');
        const sliderHandle = document.querySelector('.ba-slider-handle');
        let isSliding = false;

        const moveSlider = (xPosition) => {
            const rect = sliderContainer.getBoundingClientRect();
            let position = ((xPosition - rect.left) / rect.width) * 100;
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            beforeImage.style.width = position + '%';
            sliderHandle.style.left = position + '%';
        };

        const startSliding = (e) => {
            isSliding = true;
            moveSlider(e.type.includes('mouse') ? e.pageX : e.touches[0].clientX);
        };

        const stopSliding = () => { isSliding = false; };

        sliderContainer.addEventListener('mousedown', startSliding);
        sliderContainer.addEventListener('touchstart', startSliding, {passive: true});

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            moveSlider(e.pageX);
        });
        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            moveSlider(e.touches[0].clientX);
        }, {passive: true});

        window.addEventListener('mouseup', stopSliding);
        window.addEventListener('touchend', stopSliding);
    }

    // ==========================================
    // Orçamento — Envio via WhatsApp
    // ==========================================
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const catInput = document.getElementById('quoteCategory');
            const categoria = catInput ? catInput.value : 'Não especificada';
            const nome = document.getElementById('quoteName').value.trim();
            const telefone = document.getElementById('quotePhone').value.trim();
            const servico = document.getElementById('quoteDescription').value.trim();

            // Validação dos campos obrigatórios
            if (!nome) {
                alert('Por favor, informe seu nome.');
                document.getElementById('quoteName').focus();
                return;
            }
            if (!telefone) {
                alert('Por favor, informe seu telefone ou WhatsApp.');
                document.getElementById('quotePhone').focus();
                return;
            }
            if (!servico) {
                alert('Por favor, descreva brevemente o serviço necessário.');
                document.getElementById('quoteDescription').focus();
                return;
            }

            // Número oficial da Bonito’s Car
            const phone = '5511984325295';

            // Montagem da mensagem
            const msg = [
                'Olá, vim pelo site da Bonito’s Car e gostaria de solicitar um orçamento.',
                '',
                'Categoria: ' + categoria,
                'Nome: ' + nome,
                'Telefone/WhatsApp: ' + telefone,
                'Descrição do serviço: ' + servico
            ].join('\n');

            // Redirecionamento direto — compatível com mobile, sem bloqueio de popup
            window.location.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
        });

        // Atualizar hidden input quando o radio de categoria muda
        const catRadios = quoteForm.querySelectorAll('input[name="categoria"]');
        const catHidden = document.getElementById('quoteCategory');
        if (catRadios.length && catHidden) {
            catRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    catHidden.value = radio.value;
                });
            });
        }
    }

    // ==========================================
    // Lazy Load Background Images
    // ==========================================
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    if ('IntersectionObserver' in window) {
        let lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let lazyBackground = entry.target;
                    let bgUrl = lazyBackground.getAttribute('data-bg');
                    
                    // Se for mobile, checar se existe versão mobile nas mídias
                    if (window.innerWidth <= 900) {
                        /* 
                        if (lazyBackground.classList.contains('ba-after')) {
                            bgUrl = './assets/leves_after-mobile.webp';
                        } else if (lazyBackground.classList.contains('ba-before')) {
                            bgUrl = './assets/leves_before-mobile.webp';
                        } else */ if (lazyBackground.classList.contains('comparison-img')) {
                            let mobileBg = lazyBackground.getAttribute('data-bg-mobile');
                            if (mobileBg) {
                                bgUrl = mobileBg;
                            } else if (bgUrl && bgUrl.includes('-desktop.webp')) {
                                bgUrl = bgUrl.replace('-desktop.webp', '-mobile.webp');
                            }
                        }
                    }
                    
                    lazyBackground.style.backgroundImage = 'url(' + bgUrl + ')';
                    lazyBackgroundObserver.unobserve(lazyBackground);
                }
            });
        }, { rootMargin: "200px" });

        lazyBackgrounds.forEach((lazyBackground) => {
            lazyBackgroundObserver.observe(lazyBackground);
        });
    } else {
        // Fallback
        lazyBackgrounds.forEach((lazyBackground) => {
            lazyBackground.style.backgroundImage = 'url(' + lazyBackground.getAttribute('data-bg') + ')';
        });
    }

});
