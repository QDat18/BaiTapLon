document.addEventListener('DOMContentLoaded', function() {
  // Dữ liệu sản phẩm Flash Sale
  const flashSaleProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'iPhone',
      image: 'https://picsum.photos/300/300?random=1',
      price: '24.990.000₫',
      oldPrice: '29.990.000₫',
      discount: '-17%',
      stock: 'Còn 3 sản phẩm'
    },
    {
      id: 2,
      name: 'iPhone 15',
      category: 'iPhone',
      image: 'https://picsum.photos/300/300?random=2',
      price: '19.990.000₫',
      oldPrice: '22.990.000₫',
      discount: '-13%',
      stock: 'Còn 7 sản phẩm'
    },
    {
      id: 3,
      name: 'iPhone 14 Pro',
      category: 'iPhone',
      image: 'https://picsum.photos/300/300?random=3',
      price: '18.990.000₫',
      oldPrice: '22.990.000₫',
      discount: '-17%',
      stock: 'Còn 5 sản phẩm'
    },
    {
      id: 4,
      name: 'MacBook Air M3',
      category: 'Mac',
      image: 'https://picsum.photos/300/300?random=4',
      price: '27.990.000₫',
      oldPrice: '32.990.000₫',
      discount: '-15%',
      stock: 'Còn 8 sản phẩm'
    },
    {
      id: 5,
      name: 'MacBook Pro 14"',
      category: 'Mac',
      image: 'https://picsum.photos/300/300?random=5',
      price: '35.990.000₫',
      oldPrice: '42.990.000₫',
      discount: '-16%',
      stock: 'Còn 4 sản phẩm'
    },
    {
      id: 6,
      name: 'iPad Air M2',
      category: 'iPad',
      image: 'https://picsum.photos/300/300?random=6',
      price: '16.490.000₫',
      oldPrice: '19.990.000₫',
      discount: '-18%',
      stock: 'Còn 6 sản phẩm'
    },
    {
      id: 7,
      name: 'iPad Pro M4',
      category: 'iPad',
      image: 'https://picsum.photos/300/300?random=7',
      price: '22.990.000₫',
      oldPrice: '27.990.000₫',
      discount: '-18%',
      stock: 'Còn 2 sản phẩm'
    },
    {
      id: 8,
      name: 'AirPods Pro 2',
      category: 'Phụ kiện',
      image: 'https://picsum.photos/300/300?random=8',
      price: '5.490.000₫',
      oldPrice: '6.990.000₫',
      discount: '-21%',
      stock: 'Còn 10 sản phẩm'
    },
    {
      id: 9,
      name: 'Apple Watch Series 9',
      category: 'Watch',
      image: 'https://picsum.photos/300/300?random=9',
      price: '9.990.000₫',
      oldPrice: '11.990.000₫',
      discount: '-17%',
      stock: 'Còn 5 sản phẩm'
    },
    {
      id: 10,
      name: 'Apple Watch Ultra 2',
      category: 'Watch',
      image: 'https://picsum.photos/300/300?random=10',
      price: '20.990.000₫',
      oldPrice: '24.990.000₫',
      discount: '-16%',
      stock: 'Còn 3 sản phẩm'
    },
    {
      id: 11,
      name: 'AirPods Max',
      category: 'Phụ kiện',
      image: 'https://picsum.photos/300/300?random=11',
      price: '11.990.000₫',
      oldPrice: '13.990.000₫',
      discount: '-14%',
      stock: 'Còn 6 sản phẩm'
    },
    {
      id: 12,
      name: 'Apple TV 4K',
      category: 'Phụ kiện',
      image: 'https://picsum.photos/300/300?random=12',
      price: '4.290.000₫',
      oldPrice: '4.990.000₫',
      discount: '-14%',
      stock: 'Còn 8 sản phẩm'
    }
  ];

  // Biến để lưu trạng thái hiện tại
  let state = {
    currentCategory: 'all',
    currentPage: 1,
    productsPerPage: 8,
    totalPages: 1
  };

  // Cập nhật flashSaleSection
  setupFlashSaleSection();

  // Thiết lập đồng hồ đếm ngược
  setupCountdown();

  // Hàm thiết lập phần Flash Sale
  function setupFlashSaleSection() {
    const flashSaleSection = document.querySelector('.flash-sale-section');
    if (!flashSaleSection) return;

    // Cập nhật HTML cho section
    updateFlashSaleSectionHTML(flashSaleSection);

    // Khởi tạo sự kiện cho bộ lọc
    initCategoryFilters();

    // Khởi tạo sự kiện cho nút phân trang
    initPagination();

    // Render sản phẩm lần đầu
    renderProducts();
  }

  // Cập nhật HTML cho section Flash Sale
  function updateFlashSaleSectionHTML(section) {
    // Tạo HTML cho container
    const container = section.querySelector('.container');
    if (!container) return;

    // Cập nhật nội dung container
    container.innerHTML = `
      <h2 class="section-title text-white">Flash Sale - Giảm giá sốc</h2>
      
      <div class="flash-sale-timer text-center mb-4 text-white">
        <span>Kết thúc sau: </span>
        <span id="countdown">
          <span class="time-unit" id="hours">00</span>
          <span class="time-unit" id="minutes">00</span>
          <span class="time-unit" id="seconds">00</span>
        </span>
      </div>
      
      <div class="flash-sale-filter">
        <button class="category-filter active" data-category="all">Tất cả</button>
        <button class="category-filter" data-category="iPhone">iPhone</button>
        <button class="category-filter" data-category="iPad">iPad</button>
        <button class="category-filter" data-category="Mac">Mac</button>
        <button class="category-filter" data-category="Watch">Watch</button>
        <button class="category-filter" data-category="Phụ kiện">Phụ kiện</button>
      </div>
      
      <div class="flash-sale-products-container">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3" id="flash-sale-products">
          <!-- Sản phẩm sẽ được render ở đây -->
        </div>
        
        <div class="flash-sale-navigation">
          <button id="prev-page" aria-label="Trang trước">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="page-indicator">
            <span id="current-page">1</span>/<span id="total-pages">1</span>
          </div>
          <button id="next-page" aria-label="Trang sau">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  // Khởi tạo bộ lọc danh mục
  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Cập nhật trạng thái active
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Cập nhật state
        state.currentCategory = category;
        state.currentPage = 1;
        
        // Render lại sản phẩm
        renderProducts();
      });
    });
  }

  // Khởi tạo nút phân trang
  function initPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (!prevButton || !nextButton) return;
    
    prevButton.addEventListener('click', function() {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderProducts();
      }
    });
    
    nextButton.addEventListener('click', function() {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        renderProducts();
      }
    });
  }

  // Hàm render sản phẩm dựa trên bộ lọc và phân trang
  function renderProducts() {
    const container = document.getElementById('flash-sale-products');
    if (!container) return;
    
    // Lọc sản phẩm theo danh mục
    const filteredProducts = state.currentCategory === 'all'
      ? flashSaleProducts
      : flashSaleProducts.filter(product => product.category === state.currentCategory);
    
    // Tính toán phân trang
    state.totalPages = Math.ceil(filteredProducts.length / state.productsPerPage);
    
    // Cập nhật UI phân trang
    updatePaginationUI();
    
    // Hiển thị sản phẩm trang hiện tại
    const startIndex = (state.currentPage - 1) * state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Hiển thị trạng thái loading
    container.innerHTML = getLoadingSkeletons();
    
    // Giả lập loading để tạo UX mượt mà hơn
    setTimeout(() => {
      // Render sản phẩm
      if (currentPageProducts.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-white"><p>Không có sản phẩm nào trong danh mục này.</p></div>';
      } else {
        let productsHTML = '';
        
        currentPageProducts.forEach((product, index) => {
          productsHTML += `
            <div class="col">
              <div class="flash-sale-product" style="--product-index: ${index}">
                <span class="discount-badge">${product.discount}</span>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="flash-sale-product-content">
                  <h5>${product.name}</h5>
                  <p class="price">${product.price}</p>
                  <p class="old-price">${product.oldPrice}</p>
                  <p class="stock">${product.stock}</p>
                  <a href="#" class="btn">Mua ngay</a>
                </div>
              </div>
            </div>
          `;
        });
        
        container.innerHTML = productsHTML;
      }
    }, 300); // Giả lập thời gian loading 300ms
  }

  // Cập nhật UI phân trang
  function updatePaginationUI() {
    const currentPageElement = document.getElementById('current-page');
    const totalPagesElement = document.getElementById('total-pages');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (!currentPageElement || !totalPagesElement || !prevButton || !nextButton) return;
    
    currentPageElement.textContent = state.currentPage;
    totalPagesElement.textContent = state.totalPages;
    
    // Vô hiệu hóa/kích hoạt nút phân trang
    prevButton.disabled = state.currentPage <= 1;
    nextButton.disabled = state.currentPage >= state.totalPages;
  }

  // Tạo skeleton loading cho UX
  function getLoadingSkeletons() {
    let skeletons = '';
    for (let i = 0; i < state.productsPerPage; i++) {
      skeletons += `
        <div class="col">
          <div class="product-skeleton">
            <div class="product-skeleton-img"></div>
            <div class="product-skeleton-content">
              <div class="product-skeleton-line"></div>
              <div class="product-skeleton-line"></div>
              <div class="product-skeleton-line"></div>
              <div class="product-skeleton-line"></div>
            </div>
          </div>
        </div>
      `;
    }
    return skeletons;
  }

  // Thiết lập đồng hồ đếm ngược
  function setupCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // Thời gian còn lại: đặt cố định 3 giờ từ thời điểm load trang
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 3);
    
    function updateCountdown() {
      const now = new Date();
      const timeLeft = endTime - now;
      
      if (timeLeft <= 0) {
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        return;
      }
      
      // Tính giờ, phút, giây
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      // Cập nhật giao diện
      hoursElement.textContent = String(hours).padStart(2, '0');
      minutesElement.textContent = String(minutes).padStart(2, '0');
      secondsElement.textContent = String(seconds).padStart(2, '0');
      
      // Hiệu ứng nhấp nháy khi còn ít thời gian
      if (hours === 0 && minutes < 10) {
        hoursElement.parentElement.style.color = '#ff3b30';
      } else {
        hoursElement.parentElement.style.color = '#ffffff';
      }
      
      // Hiệu ứng nhấp nháy cho số giây
      if (seconds % 2 === 0) {
        secondsElement.style.opacity = '1';
      } else {
        secondsElement.style.opacity = '0.7';
      }
    }
    
    // Cập nhật ban đầu
    updateCountdown();
    
    // Cập nhật mỗi giây
    setInterval(updateCountdown, 1000);
  }
});