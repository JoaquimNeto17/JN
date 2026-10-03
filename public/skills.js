(() => {
  const track = document.getElementById('skills-track');
  const toggle = document.getElementById('skills-toggle');
  if (!track || !toggle) return;

  const original = track.querySelector('.skills-set');
  if (!original) return;

  // A segunda sequência fecha o ciclo visual; leitores de tela recebem só a primeira.
  const repeat = original.cloneNode(true);
  repeat.setAttribute('aria-hidden', 'true');
  repeat.inert = true;
  track.append(repeat);
  track.classList.add('is-ready');
  toggle.hidden = false;

  toggle.addEventListener('click', () => {
    const paused = track.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Retomar carrossel de tecnologias' : 'Pausar carrossel de tecnologias');
    toggle.innerHTML = paused ? 'Retomar <span aria-hidden="true">▶</span>' : 'Pausar <span aria-hidden="true">Ⅱ</span>';
  });

  document.addEventListener('visibilitychange', () => {
    track.classList.toggle('is-page-hidden', document.hidden);
  });
})();
