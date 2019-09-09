// Uncomment to enable Bootstrap tooltips
// https://getbootstrap.com/docs/4.0/components/tooltips/#example-enable-tooltips-everywhere
// $(function () { $('[data-toggle="tooltip"]').tooltip(); });

// Uncomment to enable Bootstrap popovers
// https://getbootstrap.com/docs/4.0/components/popovers/#example-enable-popovers-everywhere
// $(function () { $('[data-toggle="popover"]').popover(); });
$(document).ready(function() {
  $('.flexslider').flexslider({
    animation: 'slide',
    directionNav: false,
    start: function(slider){
      setSliderCaption(slider);
    },
    before: function(){
      $('.slider__caption-inner').removeClass('--is_active');
    },
    after: function(slider){
      setSliderCaption(slider);
    },
  });

  function setSliderCaption(slider) {
    const captionContainer = $('.slider__caption');
    const captionInner = $('.slider__caption-inner');
    const caption = slider.find('.flex-active-slide').data('caption');

    if ( caption ) {
      if ( captionContainer.hasClass('d-none') ) {
        captionContainer.removeClass('d-none');
      }
      captionInner.html(caption).addClass('--is_active');
    } else {
      captionContainer.addClass('d-none');
    }
   }
});
