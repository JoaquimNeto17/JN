(() => {
  'use strict';

  const gsap = window.gsap;
  if (!gsap) return;

  const hasScrollTrigger = !!window.ScrollTrigger;
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* =========================================================
     BARRA DE PROGRESSO
     ========================================================= */
  const progress = document.getElementById('scroll-progress');

  if (progress && hasScrollTrigger) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.25
      }
    });
  } else if (progress) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };

    document.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];

    /* =========================================================
       ENTRADA DA PÁGINA
       Mais perceptível, sem ficar exagerada.
       ========================================================= */
    const introTimeline = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    introTimeline
      .from('header', {
        y: -24,
        opacity: 0,
        duration: 0.72,
        clearProps: 'transform,opacity'
      })
      .from('.intro .eyebrow', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        clearProps: 'transform,opacity'
      }, '-=0.30')
      .from('.intro h1 > span', {
        y: 46,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
        clearProps: 'transform,opacity'
      }, '-=0.34')
      .from('.intro-bottom', {
        y: 24,
        opacity: 0,
        duration: 0.68,
        clearProps: 'transform,opacity'
      }, '-=0.52')
      .from(['.project-cta', '.work-link'], {
        y: 18,
        opacity: 0,
        duration: 0.58,
        stagger: 0.10,
        clearProps: 'transform,opacity'
      }, '-=0.38')
      .from('.networks', {
        y: 34,
        opacity: 0,
        duration: 0.72,
        clearProps: 'transform,opacity'
      }, '-=0.34')
      .from('.contact', {
        x: 44,
        y: 12,
        scale: 0.975,
        opacity: 0,
        duration: 0.9,
        clearProps: 'transform,opacity'
      }, '-=0.74')
      .from([
        '.contact .section-label',
        '.contact h2',
        '.contact .section-copy',
        '.whatsapp-message-box'
      ], {
        y: 20,
        opacity: 0,
        duration: 0.58,
        stagger: 0.09,
        clearProps: 'transform,opacity'
      }, '-=0.50');

    /* Linha âmbar do card de contato */
    const contactAccent = document.querySelector('.contact');
    if (contactAccent) {
      gsap.fromTo(
        contactAccent,
        { '--contact-accent-scale': 0 },
        {
          '--contact-accent-scale': 1,
          duration: 0.9,
          delay: 0.35,
          ease: 'power3.out'
        }
      );
    }

    /* =========================================================
       REVELAÇÕES AO ROLAR
       ========================================================= */
    if (hasScrollTrigger) {
      gsap.from('.projects-heading .section-label', {
        x: -28,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.projects-heading',
          start: 'top 86%',
          toggleActions: 'play none none none'
        }
      });

      gsap.from('.projects-heading h2', {
        y: 38,
        opacity: 0,
        duration: 0.82,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.projects-heading',
          start: 'top 84%',
          toggleActions: 'play none none none'
        }
      });

      gsap.from('.projects-heading > p', {
        y: 24,
        opacity: 0,
        duration: 0.72,
        delay: 0.10,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.projects-heading',
          start: 'top 84%',
          toggleActions: 'play none none none'
        }
      });

      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          y: 64,
          scale: 0.965,
          opacity: 0,
          duration: 0.88,
          delay: (index % 3) * 0.10,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        });

        const mediaElement = card.querySelector('.project-media img');
        if (mediaElement) {
          gsap.from(mediaElement, {
            scale: 1.08,
            duration: 1.15,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          });
        }

        const body = card.querySelector('.project-body');
        if (body) {
          gsap.from(body.children, {
            y: 18,
            opacity: 0,
            duration: 0.55,
            stagger: 0.07,
            delay: 0.16 + (index % 3) * 0.06,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          });
        }
      });

      gsap.from('.projects-outro', {
        y: 34,
        opacity: 0,
        duration: 0.76,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.projects-outro',
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });

      gsap.from('footer', {
        y: 24,
        opacity: 0,
        duration: 0.68,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 96%',
          toggleActions: 'play none none none'
        }
      });
    }

    /* =========================================================
       MICROINTERAÇÕES
       ========================================================= */
    document.querySelectorAll('.social, .project-cta, .work-link, .whatsapp-send').forEach(element => {
      const arrow =
        element.querySelector('.social-end') ||
        element.querySelector(':scope > span:last-child');

      if (!arrow) return;

      const enter = () => {
        gsap.to(arrow, {
          x: 5,
          y: -4,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: true
        });
      };

      const leave = () => {
        gsap.to(arrow, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true
        });
      };

      element.addEventListener('pointerenter', enter);
      element.addEventListener('pointerleave', leave);
      element.addEventListener('focus', enter);
      element.addEventListener('blur', leave);

      cleanups.push(() => {
        element.removeEventListener('pointerenter', enter);
        element.removeEventListener('pointerleave', leave);
        element.removeEventListener('focus', enter);
        element.removeEventListener('blur', leave);
        gsap.set(arrow, { clearProps: 'transform' });
      });
    });

    /* Cards levantam um pouco mais no hover sem alterar o layout */
    document.querySelectorAll('.project-card').forEach(card => {
      const enter = () => gsap.to(card, {
        y: -7,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: true
      });

      const leave = () => gsap.to(card, {
        y: 0,
        duration: 0.32,
        ease: 'power2.out',
        overwrite: true
      });

      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointerleave', leave);

      cleanups.push(() => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointerleave', leave);
        gsap.set(card, { clearProps: 'transform' });
      });
    });

    /* Feedback mais visível ao copiar o e-mail */
    const copyButton = document.getElementById('copy-email');
    if (copyButton) {
      const pulse = () => {
        gsap.fromTo(
          copyButton,
          { scale: 1 },
          {
            scale: 1.16,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          }
        );
      };

      copyButton.addEventListener('click', pulse);
      cleanups.push(() => copyButton.removeEventListener('click', pulse));
    }

    /* Pulso leve quando o botão do WhatsApp é habilitado */
    const message = document.getElementById('whatsapp-message');
    const whatsappButton = document.getElementById('whatsapp-send');

    if (message && whatsappButton) {
      let wasDisabled = whatsappButton.disabled;

      const observeButtonState = () => {
        const isDisabled = whatsappButton.disabled;

        if (wasDisabled && !isDisabled) {
          gsap.fromTo(
            whatsappButton,
            { scale: 0.985 },
            {
              scale: 1,
              duration: 0.34,
              ease: 'back.out(2)',
              clearProps: 'transform'
            }
          );
        }

        wasDisabled = isDisabled;
      };

      message.addEventListener('input', observeButtonState);
      cleanups.push(() => message.removeEventListener('input', observeButtonState));
    }

    return () => {
      cleanups.forEach(clean => clean());
    };
  });

  window.addEventListener('pagehide', () => media.revert(), { once: true });
})();
