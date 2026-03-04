/**
 * scripts-portafolio.js
 * Portafolio – Angélica Vargas Zambrano
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. NAVBAR – cambio de estilo al hacer scroll + link activo
    ============================================================ */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateNavbar() {
        // Compactar navbar
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Resaltar link activo según sección visible
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const collapse = document.querySelector('#navbarNav');
            if (collapse && collapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    /* ============================================================
       2. CONTADORES ANIMADOS (hero stats)
    ============================================================ */
    function animateCounter(el, target, duration = 1800) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(start) + (el.dataset.suffix || '+');
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                const target = parseInt(entry.target.dataset.target, 10);
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    /* ============================================================
       3. BARRAS DE HABILIDADES
    ============================================================ */
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    bar.style.width = bar.dataset.width + '%';
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category-card').forEach(card => skillObserver.observe(card));

    /* ============================================================
       4. REVEAL ON SCROLL (elementos con clase .reveal)
    ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Pequeño delay escalonado por grupos
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ============================================================
       5. PARTÍCULAS ANIMADAS EN EL HÉROE
    ============================================================ */
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const count = 22;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.classList.add('particle');

            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 12 + 8;
            const delay = Math.random() * 6;
            const opacity = Math.random() * 0.4 + 0.1;

            Object.assign(dot.style, {
                position: 'absolute',
                borderRadius: '50%',
                width: size + 'px',
                height: size + 'px',
                left: x + '%',
                top: y + '%',
                background: i % 3 === 0 ? '#e94560' : i % 3 === 1 ? '#f5a623' : 'rgba(255,255,255,0.6)',
                opacity: opacity,
                animation: `float ${duration}s ease-in-out ${delay}s infinite`,
                pointerEvents: 'none',
            });

            particlesContainer.appendChild(dot);
        }
    }

    /* ============================================================
       6. FILTRO DE PROYECTOS
    ============================================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Estado activo del botón
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectItems.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;

                if (match) {
                    item.classList.remove('hidden');
                    // Re-animar entrada
                    const card = item.querySelector('.project-card');
                    if (card) {
                        card.style.animation = 'none';
                        card.offsetHeight; // reflow
                        card.style.animation = 'fadeInUp 0.45s ease both';
                    }
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ============================================================
       7. FORMULARIO DE CONTACTO (simulación envío)
    ============================================================ */
    const sendBtn = document.getElementById('send-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formSuccess = document.getElementById('form-success');
    const formContainer = document.getElementById('contact-form-container');

    const fields = {
        nombre:  document.getElementById('nombre'),
        email:   document.getElementById('email'),
        asunto:  document.getElementById('asunto'),
        mensaje: document.getElementById('mensaje'),
    };

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, msg) {
        clearError(input);
        input.style.borderColor = '#e94560';
        const span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = msg;
        Object.assign(span.style, {
            color: '#e94560',
            fontSize: '0.78rem',
            display: 'block',
            marginTop: '4px',
            fontWeight: '500',
        });
        input.parentElement.appendChild(span);
    }

    function clearError(input) {
        input.style.borderColor = '';
        const existing = input.parentElement.querySelector('.field-error');
        if (existing) existing.remove();
    }

    function validateForm() {
        let valid = true;

        if (!fields.nombre.value.trim()) {
            showError(fields.nombre, 'Por favor ingresa tu nombre.');
            valid = false;
        } else {
            clearError(fields.nombre);
        }

        if (!validateEmail(fields.email.value.trim())) {
            showError(fields.email, 'Ingresa un email válido.');
            valid = false;
        } else {
            clearError(fields.email);
        }

        if (!fields.asunto.value.trim()) {
            showError(fields.asunto, 'El asunto es requerido.');
            valid = false;
        } else {
            clearError(fields.asunto);
        }

        if (fields.mensaje.value.trim().length < 15) {
            showError(fields.mensaje, 'El mensaje debe tener al menos 15 caracteres.');
            valid = false;
        } else {
            clearError(fields.mensaje);
        }

        return valid;
    }

    // Limpiar error al escribir
    Object.values(fields).forEach(input => {
        if (input) input.addEventListener('input', () => clearError(input));
    });

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (!validateForm()) return;

            // Mostrar estado cargando
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            sendBtn.disabled = true;

            // Simular envío (1.8s)
            setTimeout(() => {
                if (formContainer) formContainer.style.display = 'none';
                if (formSuccess) formSuccess.style.display = 'block';
            }, 1800);
        });
    }

    /* ============================================================
       8. BOTÓN VOLVER ARRIBA
    ============================================================ */
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================================================
       9. SCROLL SUAVE PARA TODOS LOS LINKS INTERNOS
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ============================================================
       10. TYPING EFFECT en el subtítulo del héroe
    ============================================================ */
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        const roles = ['Científica de Datos', 'Machine Learning Engineer', 'Data Analyst', 'BI Developer'];
        let roleIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function typeLoop() {
            const current = roles[roleIdx];
            if (!deleting) {
                badge.textContent = current.slice(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeLoop, 2200);
                    return;
                }
            } else {
                badge.textContent = current.slice(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                }
            }
            setTimeout(typeLoop, deleting ? 60 : 90);
        }

        setTimeout(typeLoop, 1200);
    }

});
