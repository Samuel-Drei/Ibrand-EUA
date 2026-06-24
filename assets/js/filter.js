document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const list = document.getElementById('post-list');
  const emptyMsg = document.getElementById('filter-empty');
  if (!buttons.length || !list) return;
  const items = Array.from(list.children);

  function applyFilter(filtro) {
    let visibleCount = 0;
    items.forEach((item) => {
      const match = !filtro || (item.dataset.filtro || '').split(' ').includes(filtro);
      if (match) {
        visibleCount++;
        item.style.display = '';
        item.classList.add('item-hidden');
        item.classList.remove('item-visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.classList.add('item-visible');
            item.classList.remove('item-hidden');
          });
        });
      } else {
        item.style.display = 'none';
      }
    });
    if (emptyMsg) emptyMsg.style.display = visibleCount ? 'none' : 'block';
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      buttons.forEach((b) => b.classList.remove('active'));
      if (isActive) {
        applyFilter(null);
      } else {
        btn.classList.add('active');
        applyFilter(btn.dataset.filtro);
      }
    });
  });
});
