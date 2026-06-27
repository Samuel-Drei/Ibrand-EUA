$(document).ready(function () {
  $('.owl-cases').owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    navText: [
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ],
    responsive: {
      0:   { items: 1 },
      768: { items: 2 },
      991: { items: 3 }
    }
  });
});
