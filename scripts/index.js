import {cart} from './cart.js';


$(window).on('load', function () {
    $('.andro_preloader').addClass('hidden');

    if (!checkCookie('newsletter_popup_viewed')) {
        setTimeout(function () {
            $("#androNewsletterPopup").modal('show');
        }, 3000);
    }

});



/* load news va load  */

/*-------------------------------------------------------------------------------
Aside Menu
-------------------------------------------------------------------------------*/
$(".aside-trigger-right").on('click', function () {
    var $el = $(".andro_aside-right")
    $el.toggleClass('open');
    if ($el.hasClass('open')) {
        setTimeout(function () {
            $el.find('.sidebar').fadeIn();
        }, 300);
    } else {
        $el.find('.sidebar').fadeOut();
    }
});

$(".aside-trigger-left").on('click', function () {
    $(".andro_aside-left").toggleClass('open');
});

$(".andro_aside .menu-item-has-children > a").on('click', function (e) {
    var submenu = $(this).next(".sub-menu");
    e.preventDefault();

    submenu.slideToggle(200);
});
$(document).ready(function () {
    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Load cart count
    function loadCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        $('#cart-count').text(count);
    }

    // Load products from JSON
    function loadProducts() {
        fetch('data/flashsale.json')
            .then(response => response.json())
            .then(products => {
                allProducts = products;
                renderFlashSaleProducts(products.filter(p => p.discount > 0).slice(0, 4));
                displayFeaturedProducts(products.slice(0, 5));
                renderCategories(products);
                renderPromotions(products.filter(p => p.discount > 0).slice(0, 4));
            })
            .catch(error => {
                console.error('Error loading products:', error);
                $('#featured-products').html(
                    '<p class="error-message">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>'
                );
            });
    }


    // Render flash sale products
    function renderFlashSaleProducts(products) {
        const container = $('#flashSaleProducts');
        
        container.html(products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-badge">Giảm ${product.discount}</div>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${product.price}</span>
                        <span class="old-price">${product.old_price}</span>
                    </div>
                    <div class="stock">🔥 ${product.stock}</div>
                    <button class="add-to-cart">Mua ngay</button>
                </div>
            </div>
        `).join(''));
    }

    function loadFlashSaleProducts() {
        fetch('data/flashsale.json')
            .then(response => response.json())
            .then(data => {
                if (data.products && data.products.length > 0) {
                    renderFlashSaleProducts(data.products);
                    updateFlashSaleTimer();
                } else {
                    showFlashSaleError('Không có sản phẩm flash sale nào.');
                }
            })
            .catch(error => {
                console.error('Error loading flash sale products:', error);
                showFlashSaleError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            });
    }
    
    function showFlashSaleError(message) {
        const container = $('#flashSaleProducts');
        container.html(`
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `);
    }

    // Display featured products
    function displayFeaturedProducts(products) {
        const container = $('#featured-products');
        
        if (products.length === 0) {
            container.html('<p style="padding: 20px; color: #999;">Không tìm thấy sản phẩm phù hợp.</p>');
            return;
        }

        container.html(products.map(product => `
            <div class="product-card" data-id="${product.id}">
                ${product.discount > 0 ? `<div class="product-badge">Giảm ${product.discount}%</div>` : ''}
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-specs">
                        ${product.specs.slice(0, 3).map(spec => `<span>${spec}</span>`).join('')}
                    </div>
                    <div class="product-price">
                        <span class="current-price">${(product.price * (1 - (product.discount || 0)/100)).toLocaleString('vi-VN')}₫</span>
                        ${product.discount > 0 ? `<span class="old-price">${product.price.toLocaleString('vi-VN')}₫</span>` : ''}
                    </div>
                    <button class="add-to-cart">Thêm vào giỏ</button>
                </div>
            </div>
        `).join(''));
    }

    // Render categories
    function renderCategories(products) {
        const categories = {};
        products.forEach(product => {
            const category = product.category || "Khác";
            if (!categories[category]) categories[category] = [];
            categories[category].push(product);
        });

        $('#category-container').html(Object.keys(categories).map(cat => `
            <div class="category-card" data-category="${cat}">
                <img src="${categories[cat][0].imageUrl}" alt="${cat}">
                <h3>${cat}</h3>
            </div>
        `).join(''));
    }

    // Render promotions
    function renderPromotions(products) {
        $('#promotion-container').html(products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-badge">Giảm ${product.discount}%</div>
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${(product.price * (1 - product.discount/100)).toLocaleString('vi-VN')}₫</span>
                        <span class="old-price">${product.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <button class="add-to-cart">Thêm vào giỏ</button>
                </div>
            </div>
        `).join(''));
    }

    // Add to cart function
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
    
        const existing = cart.find(item => item.id === productId);
    
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                price: product.price * (1 - (product.discount || 0) / 100),
                quantity: 1
            });
        }
    
        saveCart();
        showNotification(`${product.name} đã thêm vào giỏ hàng`);
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartCount();
    }
    
    // Show notifications
    function showNotification(message) {
        const notification = $('#notification');
        notification.text(message).addClass('show');
        setTimeout(() => notification.removeClass('show'), 3000);
    }

    // Search functionality
    function searchProducts(keyword) {
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(keyword) ||
            p.specs.some(spec => spec.toLowerCase().includes(keyword)) ||
            p.category.toLowerCase().includes(keyword)
        );
        displayFeaturedProducts(filtered.slice(0, 5));
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        document.addEventListener('searchCleared', function() {
            displayFeaturedProducts(allProducts.slice(0, 5));
        });

        $('#searchInput').on('input', function() {
            const keyword = $(this).val().toLowerCase();
            if (keyword.length > 0) {
                searchProducts(keyword);
            } else {
                displayFeaturedProducts(allProducts.slice(0, 5));
            }
        });

        // Category click
        $(document).on('click', '.category-card', function() {
            const category = $(this).data('category');
            const filtered = allProducts.filter(p => p.category === category);
            displayFeaturedProducts(filtered);
        });
    }

    // Search functionality
    document.getElementById('searchIcon').addEventListener('click', function() {
        const searchInput = document.getElementById('searchInput');
        searchInput.classList.add('active');
        searchInput.focus();
        document.getElementById('closeSearch').style.display = 'block';
        this.style.display = 'none';
    });

    document.getElementById('closeSearch').addEventListener('click', function() {
        const searchInput = document.getElementById('searchInput');
        searchInput.classList.remove('active');
        searchInput.value = '';
        this.style.display = 'none';
        document.getElementById('searchIcon').style.display = 'block';
        
        // Gửi sự kiện search cleared
        const event = new Event('searchCleared');
        document.dispatchEvent(event);
    });

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Categories loaded successfully');
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Slider functionality
        const track = document.getElementById('slider-track');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        const dotsContainer = document.getElementById('slider-dots');
        const slides = document.querySelectorAll('.product-card');
        
        // Variables
        let currentIndex = 0;
        let slidesToShow = 5; // Default for desktop
        
        // Calculate appropriate slides to show based on screen width
        function calculateSlidesToShow() {
            const windowWidth = window.innerWidth;
            if (windowWidth <= 480) {
                return 1; // Mobile
            } else if (windowWidth <= 768) {
                return 2; // Tablet
            } else if (windowWidth <= 1024) {
                return 3; // Small desktop
            } else {
                return 4; // Large desktop
            }
        }
        
        // Update slidesToShow on window resize
        window.addEventListener('resize', function() {
            slidesToShow = calculateSlidesToShow();
            updateSlider();
            updateDots();
        });
        
        // Set initial slidesToShow
        slidesToShow = calculateSlidesToShow();
        
        // Create dots
        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(slides.length / slidesToShow);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', function() {
                    currentIndex = i * slidesToShow;
                    updateSlider();
                    updateDots();
                });
                
                dotsContainer.appendChild(dot);
            }
        }
        
        // Update dots active state
        function updateDots() {
            const dots = document.querySelectorAll('.slider-dot');
            const activeDotIndex = Math.floor(currentIndex / slidesToShow);
            
            dots.forEach((dot, index) => {
                if (index === activeDotIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Update slider position
        function updateSlider() {
            const slideWidth = slides[0].offsetWidth + 20; // Width + margin
            const totalSlides = slides.length;
            
            // Prevent scrolling past the end
            if (currentIndex > totalSlides - slidesToShow) {
                currentIndex = totalSlides - slidesToShow;
            }
            
            // Prevent scrolling before the beginning
            if (currentIndex < 0) {
                currentIndex = 0;
            }
            
            // Move track
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            // Update arrows visibility
            prevBtn.style.opacity = currentIndex <= 0 ? '0.3' : '0.8';
            nextBtn.style.opacity = currentIndex >= totalSlides - slidesToShow ? '0.3' : '0.8';
        }
        
        // Add event listeners to buttons
        prevBtn.addEventListener('click', function() {
            currentIndex -= slidesToShow;
            updateSlider();
            updateDots();
        });
        
        nextBtn.addEventListener('click', function() {
            currentIndex += slidesToShow;
            updateSlider();
            updateDots();
        });
        
        // Initialize slider
        createDots();
        updateSlider();
        
        // Optional: Add auto-scrolling functionality
        let autoScrollInterval;
        
        function startAutoScroll() {
            autoScrollInterval = setInterval(function() {
                if (currentIndex < slides.length - slidesToShow) {
                    currentIndex += slidesToShow;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
                updateDots();
            }, 5000); // Auto-scroll every 5 seconds
        }
        
        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        
        // Start auto-scrolling
        startAutoScroll();
        
        // Stop auto-scrolling when user interacts with the slider
        track.addEventListener('mouseenter', stopAutoScroll);
        prevBtn.addEventListener('mouseenter', stopAutoScroll);
        nextBtn.addEventListener('mouseenter', stopAutoScroll);
        dotsContainer.addEventListener('mouseenter', stopAutoScroll);
        
        // Resume auto-scrolling when user leaves the slider
        track.addEventListener('mouseleave', startAutoScroll);
        prevBtn.addEventListener('mouseleave', startAutoScroll);
        nextBtn.addEventListener('mouseleave', startAutoScroll);
        dotsContainer.addEventListener('mouseleave', startAutoScroll);
    });
    // Initialize functions
    function init() {
        loadCartCount();
        loadProducts();
        loadFlashSaleProducts();
        setupEventListeners();
        setInterval(updateFlashSaleTimer, 1000);
    }
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.top-nav');
        if (window.scrollY > 50) {
            nav.classList.add('shrink');
        } else {
            nav.classList.remove('shrink');
        }
    });
    // Initialize everything
    init();

    // chatbot
    document.addEventListener("DOMContentLoaded", function() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotPopup = document.getElementById('chatbotPopup');
        const closePopup = document.getElementById('closePopup');
    
        chatbotToggle.addEventListener('click', function() {
            chatbotPopup.classList.toggle('hidden');
        });
    
        closePopup.addEventListener('click', function() {
            chatbotPopup.classList.add('hidden');
        });
    });
const apiKey = "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";

async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage("user", text);
    userInput.value = "";

    addMessage("bot", "Đang suy nghĩ...");

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: text }]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Không có phản hồi.";

        // Xóa tin nhắn "Đang suy nghĩ..."
        const botMessages = document.querySelectorAll(".bot");
        botMessages[botMessages.length - 1].remove();

        addMessage("bot", reply);
    } catch (error) {
        // Handle errors more gracefully
        addMessage("bot", "Lỗi khi gọi API. Vui lòng thử lại.");
        console.error("API error:", error);
    }
}

function addMessage(sender, text) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = text;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return message;
}

// Event listener for the send button
document.getElementById('sendBtn').addEventListener('click', sendMessage);

// You can also listen for the Enter key for convenience
document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
});