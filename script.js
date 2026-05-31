/* ==========================================================================
   ATLAS AI - INTERACCIONES, PARTÍCULAS Y ANIMACIONES PREMIUM
   ========================================================================== */

(function () {
  'use strict';

  // ─── CONTROL DE REDUCED MOTION (ACCESIBILIDAD) ───
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Reduced Motion detectado: Animaciones desactivadas.');
    return;
  }

  // ─── PARTÍCULAS DE FONDO CONSTELACIÓN LENTA (bg-canvas) ───
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let W, H, particles = [];
    const ORANGE = 'rgba(249, 115, 22, '; // Naranja base de Atlas AI
    let animationFrameId;

    function resize() {
      W = bgCanvas.width = window.innerWidth;
      H = bgCanvas.height = window.innerHeight;
    }

    function BgParticle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      // Movimiento ultra sutil
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.r = Math.random() * 1.3 + 0.4;
      this.pulse = Math.random() * Math.PI * 2;
      this.alpha = 0;
      this.brightSeed = Math.random();
    }

    BgParticle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.008;
      
      const base = 0.08 + this.brightSeed * 0.08;
      this.alpha = base + Math.sin(this.pulse) * 0.04;

      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    };

    function init() {
      resize();
      particles = [];
      const count = Math.min(80, Math.floor((W * H) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new BgParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const len = particles.length;

      // Líneas de conexión entre partículas
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = ORANGE + (1 - dist / 140) * 0.08 + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dibujar partículas
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = ORANGE + p.alpha + ')';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      resize();
    }, { passive: true });

    init();
    draw();
  }

  // ─── CONSTELACIÓN ACTIVA E INTERACTIVA EN EL HERO (hero-canvas) ───
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const ORANGE = 'rgba(249, 115, 22, '; // Naranja base Atlas AI
    const GOLD = 'rgba(251, 191, 36, ';    // Amarillo Oro
    let animationFrameId;

    function resize() {
      const container = heroCanvas.parentElement;
      W = heroCanvas.width = container.offsetWidth;
      H = heroCanvas.height = container.offsetHeight;
    }

    function HeroParticle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r = Math.random() * 2.4 + 0.8;
      this.alpha = Math.random() * 0.45 + 0.25;
      this.pulse = Math.random() * Math.PI * 2;
      this.glowing = Math.random() < 0.25;
    }

    HeroParticle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.024;
      this.alpha = 0.3 + Math.sin(this.pulse) * 0.2;

      // Límites físicos
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    };

    function init() {
      resize();
      particles = [];
      const count = Math.min(140, Math.floor((W * H) / 8000));
      for (let i = 0; i < count; i++) {
        particles.push(new HeroParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const len = particles.length;

      // Conexión entre partículas individuales
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = ORANGE + opacity + ')';
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Constelación interactiva con el ratón
      if (mouse.active) {
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.55;
            ctx.beginPath();
            ctx.strokeStyle = GOLD + opacity + ')';
            ctx.lineWidth = 0.85;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Dibujar partículas y resplandor
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.update();

        if (p.glowing) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 3, 0, Math.PI * 2);
          ctx.fillStyle = ORANGE + (p.alpha * 0.15) + ')';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = ORANGE + p.alpha + ')';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    // Capturar coordenadas del cursor relativas al canvas
    document.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    window.addEventListener('resize', () => {
      resize();
    }, { passive: true });

    init();
    draw();
  }

  // ─── HALO DE SEGUIMIENTO SUAVE DEL MOUSE (cursor-aura) ───
  const aura = document.getElementById('cursor-aura');
  if (aura && !window.matchMedia('(pointer: coarse)').matches) {
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let active = false;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!active) {
        active = true;
        curX = targetX;
        curY = targetY;
        aura.classList.add('active');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      active = false;
      aura.classList.remove('active');
    });

    function updateAura() {
      // Interpolación lineal con factor de fricción suave
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      
      aura.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(updateAura);
    }
    
    updateAura();
  }

  // ─── NAVBAR SCROLL EFFECT MEDIANTE INTERSECTION OBSERVER (SIN EVENTO SCROLL) ───
  const nav = document.getElementById('main-nav');
  const heroSection = document.querySelector('.hero');
  
  if (nav && heroSection) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Si el Hero es visible en más del 90%, no aplicamos sombra/blur a la nav
        if (entry.isIntersecting && entry.intersectionRatio > 0.90) {
          nav.classList.remove('scrolled');
        } else {
          nav.classList.add('scrolled');
        }
      });
    }, {
      threshold: [0.90, 0.95, 1.0]
    });

    navObserver.observe(heroSection);
  }

  // ─── REVELADO EN SCROLL CON INTERSECTION OBSERVER (ELEGANCIA) ───
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Dejar de observar una vez revelado
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ─── INTERACCIÓN DE BRILLO INTERNO EN TARJETAS GLASS ───
  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

})();

// ─── MENÚ MÓVIL (ABRIR / CERRAR) ───
function toggleMobileMenu() {
  const menu = document.getElementById('nav-mobile-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

const mobileToggleBtn = document.getElementById('mobile-toggle');
if (mobileToggleBtn) {
  mobileToggleBtn.addEventListener('click', toggleMobileMenu);
}

// ─── LÓGICA DEL FORMULARIO DE CONTACTO ───

// Validación y envío premium
function submitForm(event) {
  event.preventDefault();
  
  // 1. Honeypot check (silenciar spammer)
  const honeypot = document.getElementById('f-website');
  if (honeypot && honeypot.value) {
    console.log('Spambot detectado.');
    return;
  }

  // 2. Elementos de retroalimentación
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');
  const form = document.getElementById('contact-form');

  // 3. Reset de estados de error previos
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  const errors = form.querySelectorAll('.form-error-msg');
  inputs.forEach(el => el.classList.remove('error'));
  errors.forEach(el => el.classList.remove('show'));

  // 4. Validaciones mecánicas obligatorias
  let hasErrors = false;

  const fields = [
    { id: 'f-nombre', errId: 'err-nombre', validate: val => val.trim().length > 0 },
    { id: 'f-cargo', errId: 'err-cargo', validate: val => val.trim().length > 0 },
    { id: 'f-empresa', errId: 'err-empresa', validate: val => val.trim().length > 0 },
    { id: 'f-email', errId: 'err-email', validate: val => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val.trim()) },
    { id: 'f-negocio', errId: 'err-negocio', validate: val => val !== '' },
    { id: 'f-mensaje', errId: 'err-mensaje', validate: val => val.trim().length > 5 }
  ];

  fields.forEach(field => {
    const el = document.getElementById(field.id);
    const errEl = document.getElementById(field.errId);
    if (el && errEl) {
      const ok = field.validate(el.value);
      if (!ok) {
        el.classList.add('error');
        errEl.classList.add('show');
        hasErrors = true;
      }
    }
  });

  // Validar RGPD Checkbox
  const rgpd = document.getElementById('f-rgpd');
  const errRgpd = document.getElementById('err-rgpd');
  if (rgpd && !rgpd.checked) {
    errRgpd.classList.add('show');
    hasErrors = true;
  }

  if (hasErrors) {
    // Scroll suave al primer elemento de error
    const firstError = form.querySelector('.error, .form-error-msg.show');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // 5. Envío simulado interactivo de alta gama (Wow factor)
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Procesando Diagnóstico...';

  setTimeout(() => {
    // Simular éxito comercial
    status.className = 'form-status success';
    status.innerHTML = '<strong>✓ Solicitud Recibida Correctamente.</strong><br>Nuestros ingenieros operacionales analizarán tus flujos de trabajo. Nos pondremos en contacto contigo en menos de 24 horas laborables.';
    
    // Reset del formulario
    form.reset();
    
    btn.disabled = false;
    btn.textContent = originalText;

    // Scroll suave al mensaje de éxito
    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1600);
}
