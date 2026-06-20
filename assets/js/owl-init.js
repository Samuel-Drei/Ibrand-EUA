$(document).ready(function () {
  $('.owl-cases').owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      0:   { items: 1 },
      768: { items: 2 },
      991: { items: 3 }
    }
  });
});
