$(document).ready(function () {
  const slideInterval = 2000; // Thời gian chuyển slide
  const $carouselTimer = $('#carousel-timer');

  function animateTimer(duration = slideInterval) {
    $carouselTimer.stop().css('width', '0%').animate({ width: '100%' }, duration - 200, 'swing');
  }

  $.getJSON('data/banner.json', function (data) {
    let indicatorsHTML = '', slidesHTML = '';

    data.banners.forEach((banner, index) => {
      indicatorsHTML += `<li data-target="#bannerCarousel" data-slide-to="${index}" ${index === 0 ? 'class="active"' : ''}></li>`;
      slidesHTML += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${banner.imageUrl}" alt="${banner.alt || 'Banner'}" class="d-block w-100" loading="lazy">
          ${banner.caption ? `
            <div class="carousel-caption d-none d-md-block">
              <h5>${banner.caption.title || ''}</h5>
              <p>${banner.caption.description || ''}</p>
            </div>` : ''}
        </div>`;
    });

    $('#carousel-indicators').html(indicatorsHTML);
    $('#carousel-inner').html(slidesHTML);

    // Không thêm .carousel-fade để dùng hiệu ứng slide mặc định
    $('#bannerCarousel').removeClass('carousel-fade'); 

    // Khởi động carousel
    $('#bannerCarousel').carousel({
      interval: slideInterval,
      pause: 'hover',
      ride: 'carousel'
    });

    // Khởi động thanh thời gian
    animateTimer();

    $('#bannerCarousel').on('slide.bs.carousel', function () {
      animateTimer();
    });

    $('#bannerCarousel').on('mouseenter', () => {
      $carouselTimer.stop();
    });

    $('#bannerCarousel').on('mouseleave', () => {
      const widthPercent = parseFloat($carouselTimer.css('width')) / $carouselTimer.parent().width();
      const remainingTime = (1 - widthPercent) * slideInterval;
      animateTimer(remainingTime);
    });

  }).fail(function (jqxhr, textStatus, error) {
    console.error("Error loading banner.json:", textStatus, error);
    $('#carousel-inner').html('<div class="alert alert-danger">Không thể tải ảnh banner.</div>');
  });
});
