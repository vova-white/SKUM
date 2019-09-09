// Uncomment to enable Bootstrap tooltips
// https://getbootstrap.com/docs/4.0/components/tooltips/#example-enable-tooltips-everywhere
// $(function () { $('[data-toggle="tooltip"]').tooltip(); });

// Uncomment to enable Bootstrap popovers
// https://getbootstrap.com/docs/4.0/components/popovers/#example-enable-popovers-everywhere
// $(function () { $('[data-toggle="popover"]').popover(); });

// ScrollReveal
const slideDefaults = {
  duration: 800,
  distance: '50%'
};
const slideUp = {
  ...slideDefaults,
  origin: 'bottom'
};

const slideRight = {
  ...slideDefaults,
  origin: 'left'
};

const slideLeft = {
  ...slideDefaults,
  origin: 'right'
};

const zoom = {
  ...slideDefaults,
  distance: '0%',
  scale: 0.85
};

const delay50 = {
  delay: 50
};

const delay100 = {
  delay: 100
};

const delay150 = {
  delay: 150
};

const delay200 = {
  delay: 200
};

ScrollReveal().reveal('.slide-up', slideUp);
ScrollReveal().reveal('.slide-up-50', { ...slideUp, ...delay50 });
ScrollReveal().reveal('.slide-up-100', { ...slideUp, ...delay100 });
ScrollReveal().reveal('.slide-up-150', { ...slideUp, ...delay150 });
ScrollReveal().reveal('.slide-up-200', { ...slideUp, ...delay200 });
ScrollReveal().reveal('.slide-up-interval', { ...slideUp, interval: 75 });
ScrollReveal().reveal('.slide-up-zoom', { ...slideUp, scale: 0.85 });

ScrollReveal().reveal('.slide-right', slideRight);
ScrollReveal().reveal('.slide-right-interval', { ...slideRight, interval: 75 });
ScrollReveal().reveal('.slide-right-50', { ...slideRight, ...delay50 });
ScrollReveal().reveal('.slide-right-100', { ...slideRight, ...delay100 });
ScrollReveal().reveal('.slide-left', slideLeft);
ScrollReveal().reveal('.slide-left-interval', { ...slideLeft, interval: 75 });
ScrollReveal().reveal('.slide-left-50', { ...slideLeft, ...delay50 });
ScrollReveal().reveal('.slide-left-100', { ...slideLeft, ...delay100 });

ScrollReveal().reveal('.slide-zoom', zoom);
ScrollReveal().reveal('.slide-zoom-interval', { ...zoom, interval: 75 });

(function($) {
  $(document).ready(function() {
    if (jQuery().flexslider) {
      $('.flexslider').flexslider({
        animation: 'slide',
        directionNav: false,
        start: function(slider) {
          setSliderCaption(slider);
          $('.slider__caption').removeClass('invisible');
        },
        before: function() {
          $('.slider__caption-inner').removeClass('--is_active');
        },
        after: function(slider) {
          setSliderCaption(slider);
        }
      });
      function setSliderCaption(slider) {
        const captionContainer = $('.slider__caption');
        const captionInner = $('.slider__caption-inner');
        const caption = slider.find('.flex-active-slide').data('caption');

        if (caption) {
          if (captionContainer.hasClass('d-none')) {
            captionContainer.removeClass('d-none');
          }
          captionInner.html(caption).addClass('--is_active');
        } else {
          captionContainer.addClass('d-none');
        }
      }
    }
  });
})(jQuery);
