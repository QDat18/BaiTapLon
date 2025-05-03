
document.addEventListener("DOMContentLoaded", function () {
    loadPromotions();
    setTimeout(initSliders, 500);
});

function initSliders() {
    // Initialize promotion slider
    if (document.querySelector('.promotion-swiper')) {
        new Swiper('.promotion-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.promotion-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.promotion-swiper .swiper-button-next',
                prevEl: '.promotion-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // Initialize news slider
    if (document.querySelector('.news-swiper')) {
        new Swiper('.news-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.news-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.news-swiper .swiper-button-next',
                prevEl: '.news-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }
}

if (document.querySelector('.news-swiper')) {
    new Swiper('.news-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.news-swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.news-swiper .swiper-button-next',
            prevEl: '.news-swiper .swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });
}

function loadPromotions() {
    fetch('./data/promotion.json')
        .then(response => response.json())
        .then(data => {
            const promotionContainer = document.getElementById('promotion-container');
            
            // Clear existing content
            promotionContainer.innerHTML = '';
            
            // Create swiper wrapper
            const swiperWrapper = document.createElement('div');
            swiperWrapper.className = 'swiper-wrapper';
            
            // Display all promotions in the slider
            if (data.length === 0) {
                promotionContainer.innerHTML = '<p class="text-center text-muted">Không có khuyến mãi nào vào lúc này.</p>';
                return;
            }
            
            // Add swiper structure
            promotionContainer.classList.add('swiper', 'promotion-swiper');
            promotionContainer.appendChild(swiperWrapper);
            
            // Add navigation
            const prevBtn = document.createElement('div');
            prevBtn.className = 'swiper-button-prev';
            
            const nextBtn = document.createElement('div');
            nextBtn.className = 'swiper-button-next';
            
            const pagination = document.createElement('div');
            pagination.className = 'swiper-pagination';
            
            promotionContainer.appendChild(prevBtn);
            promotionContainer.appendChild(nextBtn);
            promotionContainer.appendChild(pagination);
            
            data.forEach(promotion => {
                const promotionCard = document.createElement('div');
                promotionCard.className = 'swiper-slide';
                
                promotionCard.innerHTML = `
                    <a href="promotion_detail.html?id=${promotion.id}" class="text-decoration-none">
                        <div class="card h-100">
                            <img src="${promotion.image}" class="card-img-top" alt="${promotion.title}">
                            <div class="card-body">
                                <h5 class="card-title">${promotion.title}</h5>
                                <p class="card-text">${promotion.description}</p>
                                <p class="text-muted small">${promotion.startDate}</p>
                            </div>
                        </div>
                    </a>
                `;
                
                swiperWrapper.appendChild(promotionCard);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải khuyến mãi:', error);
            document.getElementById('promotion-container').innerHTML = 
                '<p class="text-danger text-center">Không thể tải dữ liệu khuyến mãi.</p>';
        });
}


