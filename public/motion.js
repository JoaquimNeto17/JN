(() => {
  const gsap = window.gsap;
  if (!gsap) return; // All content is visible and usable without animation.
  const hasScrollTrigger = !!window.ScrollTrigger;
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Barra de progresso de rolagem: puramente ligada ao scroll do usuário,
  // então roda mesmo com "prefers-reduced-motion" (não é autoplay).
  const progress = document.getElementById('scroll-progress');
  if (progress && hasScrollTrigger) {
    gsap.to(progress, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .3 }
    });
  } else if (progress) {
    // Sem o plugin ScrollTrigger disponível: atualiza a largura manualmente.
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from(['.intro', '.contact', '.networks'], {
      y: 24, opacity: 0, duration: .75, stagger: .1,
      ease: 'power3.out', clearProps: 'transform,opacity'
    });
    gsap.from('.intro h1', { y: 14, duration: 1, ease: 'power3.out', clearProps: 'transform' });

    // Revelações ao rolar: cabeçalho da seção de projetos e cada card,
    // um a um, ao entrarem na tela.
    if (hasScrollTrigger) {
      gsap.from('.projects-heading', {
        y: 22, opacity: 0, duration: .7, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.projects-heading', start: 'top 85%' }
      });
      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          y: 34, opacity: 0, duration: .7, delay: (index % 3) * .08, ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        });
      });
      gsap.from('.projects-outro', {
        y: 16, opacity: 0, duration: .6, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.projects-outro', start: 'top 92%' }
      });
    }

    const cleanups = [];
    document.querySelectorAll('.social, .submit, .project-cta').forEach(element => {
      const arrow = element.querySelector('.social-end') || element.lastElementChild;
      const enter = () => gsap.to(arrow, { x: 3, y: -3, duration: .25, overwrite: true });
      const leave = () => gsap.to(arrow, { x: 0, y: 0, duration: .3, overwrite: true });
      element.addEventListener('pointerenter', enter);
      element.addEventListener('pointerleave', leave);
      element.addEventListener('focus', enter);
      element.addEventListener('blur', leave);
      cleanups.push(() => { element.removeEventListener('pointerenter', enter); element.removeEventListener('pointerleave', leave); element.removeEventListener('focus', enter); element.removeEventListener('blur', leave); gsap.set(arrow, {clearProps:'transform'}); });
    });

    // Cards de projeto: leve escala no link "Ver projeto" ao passar o mouse.
    document.querySelectorAll('.project-card').forEach(card => {
      const link = card.querySelector('.project-body > a');
      if (!link) return;
      const enter = () => gsap.to(link, { paddingLeft: 4, duration: .25, overwrite: true });
      const leave = () => gsap.to(link, { paddingLeft: 0, duration: .3, overwrite: true });
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointerleave', leave);
      cleanups.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave); gsap.set(link, {clearProps:'paddingLeft'}); });
    });

    // Botão de copiar e-mail: pequeno pulso de confirmação ao copiar.
    const copyButton = document.getElementById('copy-email');
    if (copyButton) {
      const pulse = () => gsap.fromTo(copyButton, { scale: 1 }, { scale: 1.12, duration: .15, yoyo: true, repeat: 1, ease: 'power1.inOut' });
      copyButton.addEventListener('click', pulse);
      cleanups.push(() => copyButton.removeEventListener('click', pulse));
    }

    return () => cleanups.forEach(clean => clean());
  });
  window.addEventListener('pagehide', () => media.revert(), { once: true });
})();