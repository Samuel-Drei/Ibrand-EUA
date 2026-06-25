document.addEventListener('DOMContentLoaded', () => {
  // ── Mosaic scroll gallery ──
  (() => {
    const section = document.querySelector('.case-gallery');
    if (!section) return;
    const rowContainer = section.querySelector('.case-gallery-inner');
    const templateRow = section.querySelector('.case-gallery-template');
    const templateItems = templateRow.querySelectorAll('.case-gallery-media');

    const addRow = (rowNumber, startIndex) => {
      const row = document.createElement('div');
      row.className = 'case-gallery-row ' + (rowNumber % 2 === 0 ? 'case-gallery-row-even' : 'case-gallery-row-odd');
      rowContainer.appendChild(row);
      const minWidth = window.innerWidth * 2;
      let index = startIndex;
      while (row.offsetWidth < minWidth) {
        if (index >= templateItems.length) index = 0;
        row.appendChild(templateItems[index++].cloneNode(true));
      }
      return index;
    };

    const build = () => {
      Array.from(rowContainer.children).forEach(child => {
        if (child !== templateRow) rowContainer.removeChild(child);
      });
      const minHeight = window.innerHeight * 2;
      let rowNumber = 0;
      let index = 0;
      while (rowContainer.offsetHeight <= minHeight) {
        index = addRow(rowNumber++, index);
      }
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smoothed (lerped) progress: the displayed value eases toward the
    // scroll-derived target every frame, instead of snapping to it. This
    // caps the perceived speed during fast scrolls and keeps the rows
    // gliding for a few frames after the user stops scrolling.
    let targetProgress = 0;
    let currentProgress = 0;
    const damping = 0.07;
    const settleEpsilon = 0.05;

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight + rect.height;
      const raw = rect.bottom / viewportHeight;
      targetProgress = (1 - Math.min(Math.max(raw, 0), 1)) * 100;
    };

    let rafId = null;
    let inView = false;

    // Runs only while the gallery is in the viewport, and stops scheduling
    // new frames once the eased value has settled. Without this the loop
    // ran forever for the lifetime of the page, competing for the main
    // thread with every other scroll-driven animation and causing the
    // stutter/flicker reported on mobile.
    const tick = () => {
      if (!inView) {
        rafId = null;
        return;
      }
      if (reduceMotion) {
        currentProgress = 50;
        section.style.setProperty('--scroll-progress', currentProgress.toFixed(4) + '%');
        rafId = null;
        return;
      }
      computeTarget();
      currentProgress += (targetProgress - currentProgress) * damping;
      section.style.setProperty('--scroll-progress', currentProgress.toFixed(4) + '%');
      if (Math.abs(targetProgress - currentProgress) < settleEpsilon) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const ensureTicking = () => {
      if (inView && rafId === null) rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      if (inView) ensureTicking();
    });
    io.observe(section);

    build();
    window.addEventListener('resize', build, { passive: true });
    window.addEventListener('scroll', ensureTicking, { passive: true });
  })();

  // ── Related projects carousel ──
  (() => {
    const carousel = document.querySelector('.case-related-carousel');
    if (!carousel) return;
    const track = carousel.querySelector('.case-related-track');
    const prevBtn = carousel.querySelector('.case-related-prev');
    const nextBtn = carousel.querySelector('.case-related-next');
    if (!track || !track.children.length) return;

    const step = () => track.children[0].getBoundingClientRect().width + 24;
    const updateButtons = () => {
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    };
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons, { passive: true });
    updateButtons();
  })();

  // ── Generic vertical parallax drift ──
  (() => {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elementProgress = (el) => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top >= viewportHeight) return 1;
      if (rect.bottom <= 0) return -1;
      return -1 + 2 * (rect.bottom / (viewportHeight + rect.height));
    };

    let ticking = false;
    const run = () => {
      ticking = false;
      elements.forEach(el => {
        const movement = parseFloat(el.dataset.parallax) || 0;
        const adjusted = window.innerWidth < 768 ? movement / 2 : movement;
        const progress = elementProgress(el);
        el.style.transform = `translateY(${adjusted * progress}rem)`;
      });
    };
    const requestRun = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };

    run();
    window.addEventListener('scroll', requestRun, { passive: true });
    window.addEventListener('resize', requestRun, { passive: true });
  })();
});
