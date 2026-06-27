document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orcamento-form');
  if (!form) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDPu5eHW1-ydmMHzQrWYg5X1dlz0R4-UlA0ywsmIgj2_Oe1bcV2dX0h-PuCu1nrEI1/exec';

  const origemInput = form.querySelector('input[name="origem"]');
  if (origemInput) {
    origemInput.value = new URLSearchParams(window.location.search).get('origem') || '';
  }

  // The cookie banner is fixed to the bottom of the screen and several
  // fields scroll behind it on a long form — dismiss it on the first
  // interaction so it stops swallowing taps meant for the inputs.
  form.addEventListener('focusin', () => {
    const cookieBanner = document.querySelector('.cookies-container');
    const cookieSave = document.querySelector('.cookies-save');
    if (cookieBanner && getComputedStyle(cookieBanner).display !== 'none') {
      cookieSave?.click();
    }
  }, { once: true });

  const submitBtn = form.querySelector('input[type="submit"]');
  const spinner = form.querySelector('.submit-spinner');
  const feedback = form.querySelector('.orcamento-feedback');
  const honeypot = form.querySelector('input[name="site"]');

  const setLoading = (loading) => {
    submitBtn.classList.toggle('is-loading', loading);
    submitBtn.disabled = loading;
    if (spinner) spinner.classList.toggle('is-loading', loading);
  };

  const showFeedback = (message, isError) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle('is-error', !!isError);
    feedback.classList.add('is-visible');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: bots tend to fill every field, including this hidden one.
    if (honeypot && honeypot.value) return;

    setLoading(true);
    showFeedback('', false);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(form)),
      });
      form.reset();
      showFeedback('Recebemos sua solicitação! Em breve entraremos em contato.', false);
    } catch (err) {
      showFeedback('Não foi possível enviar agora. Verifique sua conexão e tente novamente.', true);
    } finally {
      setLoading(false);
    }
  });
});
