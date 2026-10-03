(() => {
  'use strict';

  const byId = id => document.getElementById(id);

  /* Ano do rodapé */
  const year = byId('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Copiar e-mail */
  const copyButton = byId('copy-email');
  const copyStatus = byId('copy-status');
  const emailLink = document.querySelector('.email-card a[href^="mailto:"]');

  if (copyButton && emailLink) {
    const email = emailLink.getAttribute('href').replace(/^mailto:/i, '');

    copyButton.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const temp = document.createElement('textarea');
          temp.value = email;
          temp.setAttribute('readonly', '');
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          temp.remove();
        }

        if (copyStatus) copyStatus.textContent = 'E-mail copiado.';
      } catch {
        if (copyStatus) copyStatus.textContent = 'Não foi possível copiar automaticamente.';
      }

      window.setTimeout(() => {
        if (copyStatus) copyStatus.textContent = '';
      }, 2200);
    });
  }

  /* =======================================================
     CONTATO: UMA ÚNICA ROTA -> WHATSAPP
     ======================================================= */
  const whatsappMessage = byId('whatsapp-message');
  const whatsappSend = byId('whatsapp-send');
  const counter = byId('counter');

  const phone = '5515996817066';

  const countWords = value => {
    const clean = value.trim();
    return clean ? clean.split(/\s+/u).length : 0;
  };

  const updateWhatsAppState = () => {
    if (!whatsappMessage || !whatsappSend || !counter) return;

    const text = whatsappMessage.value;
    const chars = text.length;
    const words = countWords(text);
    const max = Number(whatsappMessage.maxLength) || 1000;

    counter.textContent =
      `${words} ${words === 1 ? 'palavra' : 'palavras'} • ${chars} / ${max} caracteres`;

    counter.classList.toggle('is-near-limit', chars >= max * 0.85 && chars < max);
    counter.classList.toggle('is-at-limit', chars >= max);

    whatsappSend.disabled = text.trim().length < 3;
  };

  if (whatsappMessage && whatsappSend && counter) {
    whatsappMessage.addEventListener('input', updateWhatsAppState);

    whatsappMessage.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !whatsappSend.disabled) {
        whatsappSend.click();
      }
    });

    whatsappSend.addEventListener('click', () => {
      const text = whatsappMessage.value.trim();
      if (text.length < 3) {
        whatsappMessage.focus();
        return;
      }

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    updateWhatsAppState();
  }

})();
