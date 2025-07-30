// Configurações iniciais
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollReveal();
    initFormHandling();
    initPhoneMask();
    initSmoothScroll();
});

// Navegação móvel
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    if (!hamburger || !navMenu || !header) return;

    // Alternar menu mobile
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Acessibilidade: aria-expanded
        hamburger.setAttribute(
            'aria-expanded',
            hamburger.classList.contains('active') ? 'true' : 'false'
        );

        // Animação dos spans do hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fechar menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');

            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';

            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll do header
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Animações de scroll reveal
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.especialidade-card, .sobre-text, .sobre-image, .agendamento-info, .calendario-visual, .contato-form, .contato-info');
    
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });

    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Executar uma vez no carregamento
}

// Smooth scroll para navegação
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Máscara para telefone
function initPhoneMask() {
    const phoneInput = document.getElementById('telefone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
                value = value.replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3');
            }
            
            e.target.value = value;
        });

        // Permitir apenas números, backspace, delete e tab
        phoneInput.addEventListener('keypress', function(e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'];
            
            if (allowedKeys.indexOf(e.key) !== -1 ||
                (e.key >= '0' && e.key <= '9')) {
                return;
            }
            
            e.preventDefault();
        });
    }
}

// Manipulação do formulário
function initFormHandling() {
    const form = document.getElementById('contatoForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const mensagem = document.getElementById('mensagem').value;
            
            // Validação básica
            if (!nome || !email || !telefone || !mensagem) {
                showNotification('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Simulação de envio
            const submitButton = form.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
                form.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Validação de e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-family: 'Lato', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fechar notificação
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Funcionalidade do WhatsApp
function abrirWhatsApp() {
    const url = 'https://api.whatsapp.com/send/?phone=558195048421&text=Ol%C3%A1%21+Gostaria+de+agendar+uma+consulta+com+a+Psic%C3%B3loga+Steffani+Lima.&type=phone_number&app_absent=0';
    window.open(url, '_blank');
}

// Funcionalidade do Instagram
function abrirInstagram() {
    const instagram = 'https://www.instagram.com/psi.steffanilima?utm_source=qr&igsh=d3dlajlkbDQ0Mm02';
    window.open(instagram, '_blank');
}

// Funcionalidade do LinkedIn
function abrirLinkedin() {
    const linkedin = 'https://www.linkedin.com/in/steffani-lima-158b141a4/';
    window.open(linkedin, '_blank');
}

// Efeitos de hover melhorados
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de hover para cards
    const cards = document.querySelectorAll('.especialidade-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efeito parallax sutil no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-bg');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
});

// Lazy loading para imagens (se houver)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Função para destacar seção ativa na navegação
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Inicializar funcionalidades adicionais
document.addEventListener('DOMContentLoaded', function() {
    highlightActiveSection();
    initLazyLoading();
});

// Função para animar números (se necessário no futuro)
function animateNumbers() {
    const numbers = document.querySelectorAll('.animate-number');
    
    numbers.forEach(number => {
        const finalNumber = parseInt(number.dataset.number);
        const duration = 2000;
        const increment = finalNumber / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            number.textContent = Math.floor(current);
            
            if (current >= finalNumber) {
                number.textContent = finalNumber;
                clearInterval(timer);
            }
        }, 16);
    });
}

// Melhorias de performance
window.addEventListener('load', function() {
    // Preload de fontes críticas
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap';
    link.as = 'style';
    document.head.appendChild(link);
});

// Debug helper (remover em produção)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🧠 Site da Psicóloga Steffani Lima carregado com sucesso!');
    console.log('📱 WhatsApp configurado para:', '5500000000000');
    console.log('💡 Lembre-se de atualizar o número do WhatsApp na função abrirWhatsApp()');
}
