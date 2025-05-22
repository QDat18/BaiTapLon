document.addEventListener('DOMContentLoaded', () => {
  // Update cart count
  updateCartCount();
  
  // Get product name from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productName = decodeURIComponent(urlParams.get('product'));

  if (!productName) {
    window.location.href = 'tainghe.html';
    return;
  }

  // Fetch product data
  fetchProductData(productName);

  // Zoom image functionality
  document.querySelector('.main-image-container')?.addEventListener('click', () => {
    const mainImage = document.getElementById('mainImage');
    showImageModal(mainImage.src, mainImage.alt);
  });

  // Add to cart and buy now buttons
  document.querySelector('.btn-add-to-cart')?.addEventListener('click', addToCart);
  document.querySelector('.btn-buy-now')?.addEventListener('click', buyNow);
  document.querySelector('#compareButton')?.addEventListener('click', showCompareModal);

  // Floating cart button
  document.querySelector('.fab')?.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
  
  // Back to top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Review rating system
  const ratingStars = document.querySelectorAll('.rating-input i');
  ratingStars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const rating = this.dataset.rating;
      highlightStars(rating);
    });
    
    star.addEventListener('mouseout', function() {
      const rating = document.getElementById('reviewRating').value;
      highlightStars(rating);
    });
    
    star.addEventListener('click', function() {
      const rating = this.dataset.rating;
      document.getElementById('reviewRating').value = rating;
      highlightStars(rating);
    });
  });
  
  // Review form submission
  document.getElementById('reviewForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rating = document.getElementById('reviewRating').value;
    const title = document.getElementById('reviewTitle').value;
    const comment = document.getElementById('reviewComment').value;
    
    if (rating == 0) {
      showToast('Vui lòng chọn số sao đánh giá', 'danger');
      return;
    }
    
    if (title.trim() === '') {
      showToast('Vui lòng nhập tiêu đề đánh giá', 'danger');
      return;
    }
    
    if (comment.trim() === '') {
      showToast('Vui lòng nhập nội dung đánh giá', 'danger');
      return;
    }
    
    // Here you would normally send the review to a server
    // For demo purposes, we'll just show a success message and clear the form
    showToast('Đánh giá của bạn đã được gửi thành công!', 'success');
    
    // Reset form
    document.getElementById('reviewRating').value = 0;
    document.getElementById('reviewTitle').value = '';
    document.getElementById('reviewComment').value = '';
    highlightStars(0);
  });
  
  // Load more reviews button
  document.getElementById('loadMoreReviews')?.addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Đang tải...';
    setTimeout(() => {
      // Simulate loading more reviews
      const reviewsList = document.getElementById('reviewsList');
      for (let i = 0; i < 3; i++) {
        const review = createRandomReview();
        reviewsList.appendChild(review);
      }
      this.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Xem thêm đánh giá';
    }, 1000);
  });
  
  // Display recently viewed products
  displayRecentlyViewed();
  
  // Initialize dropdown menu functionality
  document.getElementById('dropdownBtn')?.addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      dropdownMenu.style.display = 'none';
      this.setAttribute('aria-expanded', 'false');
    } else {
      dropdownMenu.style.display = 'block';
      this.setAttribute('aria-expanded', 'true');
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (dropdownBtn && dropdownMenu && !dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = 'none';
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Toggle sidebar menu
  document.querySelector('.toggle-btn')?.addEventListener('click', function() {
    const sidebarMenu = document.getElementById('sidebar-menu');
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      sidebarMenu.style.right = '-300px';
      this.setAttribute('aria-expanded', 'false');
    } else {
      sidebarMenu.style.right = '0';
      this.setAttribute('aria-expanded', 'true');
    }
  });
  
  // Close sidebar menu
  document.querySelector('.close-btn')?.addEventListener('click', function() {
    const sidebarMenu = document.getElementById('sidebar-menu');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    sidebarMenu.style.right = '-300px';
    toggleBtn.setAttribute('aria-expanded', 'false');
  });
  
  // Check if user is logged in
  checkLoginStatus();
});

function updateCartCount() {
  const cartBadge = document.getElementById('cartBadge');
  const cartCount = document.getElementById('cart-count');
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  
  if (cartBadge) cartBadge.textContent = itemCount;
  if (cartCount) cartCount.textContent = itemCount;
}

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = localStorage.getItem('user');
  
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');
  const navbarUser = document.getElementById('navbarUser');
  
  if (isLoggedIn && user) {
    // User is logged in
    if (loginButton) loginButton.style.display = 'none';
    if (registerButton) registerButton.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'inline-block';
    if (navbarUser) {
      navbarUser.style.display = 'inline-block';
      navbarUser.textContent = `Xin chào, ${user}`;
    }
    
    // Add logout event listener
    logoutButton?.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.reload();
    });
  } else {
    // User is not logged in
    if (loginButton) loginButton.style.display = 'inline-block';
    if (registerButton) registerButton.style.display = 'inline-block';
    if (logoutButton) logoutButton.style.display = 'none';
    if (navbarUser) navbarUser.style.display = 'none';
  }
}

function fetchProductData(productName) {
  fetch('data/product.json')
    .then(res => {
      if (!res.ok) throw new Error('Không thể tải dữ liệu sản phẩm');
      return res.json();
    })
    .then(data => {
      let product;
      data.categories.forEach(category => {
        const found = category.products.find(p => p.name === productName);
        if (found) product = found;
      });

      if (!product) throw new Error('Không tìm thấy sản phẩm');

      const transformedProduct = {
        id: product.id,
        name: product.name,
        description: product.description || 'Không có mô tả',
        isNew: new Date(product.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        price: Math.min(...product.variants.map(v => v.price)),
        originalPrice: product.variants[0].originalPrice || null,
        soldCount: Math.floor(Math.random() * 1000) + 500,
        rating: 4.5,
        reviewCount: 128,
        colors: [],
        variantOptions: product.variants.map(v => ({
          label: v.version || 'Mặc định',
          price: v.price,
          originalPrice: v.originalPrice || null
        })),
        specs: {
          'Thông số chung': {
            'Loại tai nghe': product.specs?.find(s => s.includes('loại') || s.includes('type')) || 'Không xác định',
            'Thời lượng pin': product.specs?.find(s => s.includes('pin') || s.includes('battery')) || 'Không xác định',
            'Kết nối': product.specs?.find(s => s.includes('kết nối') || s.includes('connect')) || 'Không xác định',
            'Tính năng': product.specs?.find(s => s.includes('tính năng') || s.includes('features')) || 'Không xác định',
            'Ngày ra mắt': product.releaseDate
          }
        },
        highlights: product.specs?.map((spec, index) => ({
          title: spec.includes('pin') ? 'Thời lượng pin' : 
                spec.includes('kết nối') ? 'Kết nối' : 
                spec.includes('loại') ? 'Loại tai nghe' : 
                spec.includes('tính năng') ? 'Tính năng' : `Điểm nổi bật ${index + 1}`,
          description: spec,
          icon: spec.includes('pin') ? 'battery-full' : 
                spec.includes('kết nối') ? 'wifi' : 
                spec.includes('loại') ? 'headphones' : 
                spec.includes('tính năng') ? 'star' : 'music'
        })) || [],
        promotions: [
          'Giảm thêm 5% khi mua cùng phụ kiện',
          'Miễn phí vận chuyển toàn quốc',
          'Bảo hành 12 tháng chính hãng',
          'Đổi mới trong 30 ngày nếu có lỗi từ nhà sản xuất',
          'Tư vấn kỹ thuật miễn phí trọn đời sản phẩm'
        ]
      };

      product.variants.forEach(variant => {
        variant.colors.forEach(color => {
          if (!transformedProduct.colors.some(c => c.name === color)) {
            transformedProduct.colors.push({
              name: color,
              imageUrl: product.imageUrl,
              thumbnails: [product.imageUrl]
            });
          }
        });
      });

      if (product.variants.length === 1 && !product.variants[0].version) {
        document.getElementById('variantOptionsSection').style.display = 'none';
      }

      displayProduct(transformedProduct);
      renderRecommendedProducts(product.id);
      
      // Add to recently viewed
      addToRecentlyViewed({
        id: product.id,
        name: product.name,
        image: product.imageUrl,
        price: transformedProduct.price,
        url: window.location.href
      });
      
      // Store current product for comparison
      window.currentProduct = {
        id: product.id,
        name: product.name,
        image: product.imageUrl,
        price: transformedProduct.price,
        specs: transformedProduct.specs
      };
      
      // Load compare products
      loadCompareProducts(product.id);
    })
    .catch(err => {
      console.error('Lỗi khi tải sản phẩm:', err);
      showErrorModal();
    });
}

function displayProduct(product) {
  document.title = `${product.name} | Anh Em Rọt Store`;
  document.getElementById('productTitle').textContent = product.id;
  document.getElementById('productBreadcrumb').textContent = product.name;
  document.getElementById('productSubtitle').textContent = product.description;

  document.getElementById('productPrice').textContent = `${product.price.toLocaleString('vi-VN')}₫`;
  if (product.originalPrice && product.originalPrice > product.price) {
    document.getElementById('productOldPrice').classList.remove('d-none');
    document.getElementById('productOldPrice').textContent = `${product.originalPrice.toLocaleString('vi-VN')}₫`;
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
    document.getElementById('productDiscount').classList.remove('d-none');
    document.getElementById('productDiscount').textContent = `-${discountPercent}%`;
  }

  document.getElementById('soldCount').textContent = `Đã bán ${product.soldCount >= 1000 ? (product.soldCount / 1000).toFixed(1) + 'k' : product.soldCount}`;

  const mainImage = document.getElementById('mainImage');
  const thumbnailContainer = document.getElementById('thumbnailContainer');
  if (product.colors.length > 0) {
    const firstColor = product.colors[0];
    mainImage.src = firstColor.imageUrl;
    mainImage.alt = `${product.name} - ${firstColor.name}`;
    displayThumbnails(firstColor.thumbnails, product.name);
  } else {
    mainImage.src = product.imageUrl || '/assets/placeholder.jpg';
    mainImage.alt = product.name;
    displayThumbnails([product.imageUrl || '/assets/placeholder.jpg'], product.name);
  }

  const colorOptions = document.getElementById('colorOptions');
  colorOptions.innerHTML = '';
  product.colors.forEach((color, index) => {
    const col = document.createElement('div');
    col.className = 'col-6 col-sm-4 col-md-3';
    const colorOption = document.createElement('div');
    colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
    colorOption.innerHTML = `
      <img src="${color.imageUrl}" alt="${color.name}" class="color-option-image">
      <div class="color-name">${color.name}</div>
    `;
    colorOption.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
      colorOption.classList.add('active');
      mainImage.src = color.imageUrl;
      mainImage.alt = `${product.name} - ${color.name}`;
      displayThumbnails(color.thumbnails, product.name);
      mainImage.style.opacity = 0;
      setTimeout(() => { mainImage.style.opacity = 1; }, 200);
    });
    col.appendChild(colorOption);
    colorOptions.appendChild(col);
  });

  const variantOptions = document.getElementById('variantOptions');
  variantOptions.innerHTML = '';
  product.variantOptions.forEach((option, index) => {
    const variantOption = document.createElement('div');
    variantOption.className = `variant-option ${index === 0 ? 'active' : ''}`;
    variantOption.setAttribute('data-variant', option.label);
    variantOption.textContent = option.label;
    if (index > 0) {
      const priceDiff = option.price - product.variantOptions[0].price;
      if (priceDiff > 0) variantOption.innerHTML += ` <span class="price-difference">+${priceDiff.toLocaleString('vi-VN')}₫</span>`;
    }
    variantOption.addEventListener('click', () => {
      document.querySelectorAll('.variant-option').forEach(s => s.classList.remove('active'));
      variantOption.classList.add('active');
      document.getElementById('productPrice').textContent = `${option.price.toLocaleString('vi-VN')}₫`;
      if (option.originalPrice && option.originalPrice > option.price) {
        document.getElementById('productOldPrice').classList.remove('d-none');
        document.getElementById('productOldPrice').textContent = `${option.originalPrice.toLocaleString('vi-VN')}₫`;
        const discountPercent = Math.round((1 - option.price / option.originalPrice) * 100);
        document.getElementById('productDiscount').classList.remove('d-none');
        document.getElementById('productDiscount').textContent = `-${discountPercent}%`;
      } else {
        document.getElementById('productOldPrice').classList.add('d-none');
        document.getElementById('productDiscount').classList.add('d-none');
      }
    });
    variantOptions.appendChild(variantOption);
  });

  const productSpecs = document.getElementById('productSpecs');
  productSpecs.innerHTML = '';
  for (const [group, specs] of Object.entries(product.specs)) {
    const specGroup = document.createElement('div');
    specGroup.className = 'spec-group';
    specGroup.innerHTML = `<h5 class="spec-group-title">${group}</h5>`;
    for (const [key, value] of Object.entries(specs)) {
      const specItem = document.createElement('div');
      specItem.className = 'spec-item';
      specItem.innerHTML = `<div class="spec-label">${key}</div><div class="spec-value">${value}</div>`;
      specGroup.appendChild(specItem);
    }
    productSpecs.appendChild(specGroup);
  }

  const productHighlights = document.getElementById('productHighlights');
  productHighlights.innerHTML = '';
  product.highlights.forEach(highlight => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    const highlightItem = document.createElement('div');
    highlightItem.className = 'highlight-item';
    highlightItem.innerHTML = `
      <div class="highlight-icon"><i class="fas fa-${highlight.icon}"></i></div>
      <div class="highlight-content"><h5>${highlight.title}</h5><p>${highlight.description}</p></div>
    `;
    col.appendChild(highlightItem);
    productHighlights.appendChild(col);
  });

  if (product.isNew) document.getElementById('productBadge').classList.remove('d-none');
  setupSocialShare(product.name, window.location.href, product.description);
  
  // Display promotions
  const promotionsList = document.getElementById('promotionsList');
  promotionsList.innerHTML = '';
  product.promotions.forEach(promotion => {
    const promotionItem = document.createElement('div');
    promotionItem.className = 'promotion-item';
    promotionItem.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${promotion}</span>
    `;
    promotionsList.appendChild(promotionItem);
  });
}

function renderRecommendedProducts(currentProductId) {
  fetch('data/product.json')
    .then(res => {
      if (!res.ok) throw new Error('Không thể tải dữ liệu gợi ý');
      return res.json();
    })
    .then(data => {
      const slider = document.getElementById('recommendationSlider');
      slider.innerHTML = '';

      const taingheCategory = data.categories.find(cat => cat.name === 'Tai Nghe');
      if (taingheCategory) {
        taingheCategory.products.filter(p => p.id !== currentProductId).slice(0, 4).forEach(product => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.innerHTML = `
            <div class="card h-100">
              <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h6 class="card-title">${product.name}</h6>
                <p class="card-text text-danger">${Math.min(...product.variants.map(v => v.price)).toLocaleString('vi-VN')}₫</p>
                <a href="tainghe_detail.html?product=${encodeURIComponent(product.name)}" class="btn btn-outline-primary btn-sm">Xem chi tiết</a>
              </div>
            </div>
          `;
          slider.appendChild(slide);
        });

        new Swiper(".mySwiper", {
          slidesPerView: 2,
          spaceBetween: 20,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          breakpoints: {
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
          }
        });
      } else {
        slider.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x mb-3 text-danger"></i>
            <p class="text-danger">Không thể tải sản phẩm gợi ý</p>
          </div>
        `;
      }
    })
    .catch(err => console.error("Lỗi khi load sản phẩm gợi ý:", err));
}

function displayThumbnails(thumbnails, productName) {
  const thumbnailContainer = document.getElementById('thumbnailContainer');
  thumbnailContainer.innerHTML = '';
  thumbnails.forEach((img, index) => {
    const thumbnail = document.createElement('img');
    thumbnail.src = img;
    thumbnail.alt = `${productName} - Ảnh ${index + 1}`;
    thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
    thumbnail.addEventListener('click', () => {
      document.getElementById('mainImage').src = img;
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      thumbnail.classList.add('active');
      document.getElementById('mainImage').style.opacity = 0;
      setTimeout(() => { document.getElementById('mainImage').style.opacity = 1; }, 200);
    });
    thumbnailContainer.appendChild(thumbnail);
  });
}

function showImageModal(imageSrc, imageAlt) {
  const modalHTML = `
    <div class="modal fade image-modal" id="imageModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-0">
            <img src="${imageSrc}" alt="${imageAlt}" class="img-fluid">
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));
  modal.show();
  document.getElementById('imageModal').addEventListener('hidden.bs.modal', () => modal._element.remove());
}

function addToCart() {
  const btn = document.querySelector('.btn-add-to-cart');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
  btn.disabled = true;

  const selectedColor = document.querySelector('.color-option.active .color-name')?.textContent || 'Mặc định';
  const selectedVariant = document.querySelector('.variant-option.active')?.textContent.split(' ')[0] || 'Mặc định';
  const productName = document.getElementById('productTitle').textContent;
  const productPrice = document.getElementById('productPrice').textContent.replace(/[^\d]/g, '');
  const productImage = document.getElementById('mainImage').src;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === productName && item.color === selectedColor && item.variant === selectedVariant);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ 
    name: productName, 
    color: selectedColor, 
    variant: selectedVariant, 
    price: parseInt(productPrice), 
    image: productImage, 
    quantity: 1 
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  setTimeout(() => {
    showToast('Sản phẩm đã được thêm vào giỏ hàng', 'success');
    btn.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';
    btn.disabled = false;
  }, 1000);
}

function buyNow() {
  const selectedColor = document.querySelector('.color-option.active .color-name')?.textContent || 'Mặc định';
  const selectedVariant = document.querySelector('.variant-option.active')?.textContent.split(' ')[0] || 'Mặc định';
  const productName = document.getElementById('productTitle').textContent;
  const productPrice = document.getElementById('productPrice').textContent.replace(/[^\d]/g, '');
  const productImage = document.getElementById('mainImage').src;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === productName && item.color === selectedColor && item.variant === selectedVariant);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ 
    name: productName, 
    color: selectedColor, 
    variant: selectedVariant, 
    price: parseInt(productPrice), 
    image: productImage, 
    quantity: 1 
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('checkoutCart', JSON.stringify([{ 
    name: productName, 
    color: selectedColor, 
    variant: selectedVariant, 
    price: parseInt(productPrice), 
    image: productImage, 
    quantity: 1 
  }]));
  
  window.location.href = 'checkout.html';
}

function addToRecentlyViewed(product) {
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  
  // Check if product already exists in recently viewed
  const existingIndex = recentlyViewed.findIndex(item => item.id === product.id);
  if (existingIndex !== -1) {
    // Remove it to add it to the beginning
    recentlyViewed.splice(existingIndex, 1);
  }
  
  // Add to the beginning of the array
  recentlyViewed.unshift(product);
  
  // Limit to 4 items
  const limitedRecentlyViewed = recentlyViewed.slice(0, 4);
  
  localStorage.setItem('recentlyViewed', JSON.stringify(limitedRecentlyViewed));
}

function displayRecentlyViewed() {
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  const recentlyViewedContainer = document.getElementById('recentlyViewedItems');
  
  if (!recentlyViewedContainer) return;
  
  if (recentlyViewed.length <= 1) {
    // Hide the container if there are no other recently viewed products
    document.getElementById('recentlyViewedSidebar').style.display = 'none';
    return;
  }
  
  recentlyViewedContainer.innerHTML = '';
  
  // Skip the current product (which should be the first one in the array)
  recentlyViewed.slice(1).forEach(product => {
    const item = document.createElement('div');
    item.className = 'recently-viewed-item';
    item.innerHTML = `
      <a href="${product.url}" class="recently-viewed-link">
        <div class="recently-viewed-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="recently-viewed-info">
          <div class="recently-viewed-name">${product.name}</div>
          <div class="recently-viewed-price">${product.price.toLocaleString('vi-VN')}₫</div>
        </div>
      </a>
    `;
    recentlyViewedContainer.appendChild(item);
  });
}

function setupSocialShare(productName, url, description) {
  // Facebook
  document.getElementById('shareFacebook')?.addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  });
  
  // Twitter
  document.getElementById('shareTwitter')?.addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`, '_blank');
  });
  
  // Pinterest
  document.getElementById('sharePinterest')?.addEventListener('click', () => {
    const image = document.getElementById('mainImage').src;
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(productName)}`, '_blank');
  });
  
  // Email
  document.getElementById('shareEmail')?.addEventListener('click', () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`Xem sản phẩm: ${productName}`)}&body=${encodeURIComponent(`Xem sản phẩm ${productName} tại: ${url}`)}`;
  });
}

function showCompareModal() {
  const modal = new bootstrap.Modal(document.getElementById('compareModal'));
  
  // Show the current product info
  const currentProductInfo = document.getElementById('currentProductInfo');
  currentProductInfo.innerHTML = `
    <img src="${window.currentProduct.image}" alt="${window.currentProduct.name}" class="img-fluid mb-2" style="max-height: 150px;">
    <h6>${window.currentProduct.name}</h6>
    <p class="text-danger">${window.currentProduct.price.toLocaleString('vi-VN')}₫</p>
  `;
  
  modal.show();
}

function loadCompareProducts(currentProductId) {
  fetch('data/product.json')
    .then(res => res.json())
    .then(data => {
      const taingheCategory = data.categories.find(cat => cat.name === 'Tai Nghe');
      if (!taingheCategory) return;
      
      const otherProducts = taingheCategory.products.filter(p => p.id !== currentProductId);
      const productSelect = document.getElementById('productToCompare');
      
      otherProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        option.dataset.image = product.imageUrl;
        option.dataset.price = Math.min(...product.variants.map(v => v.price));
        productSelect.appendChild(option);
      });
      
      productSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const compareProductInfo = document.getElementById('compareProductInfo');
        
        if (this.value === '') {
          compareProductInfo.innerHTML = `<p class="text-muted">Vui lòng chọn sản phẩm để so sánh</p>`;
          document.getElementById('compareTableContainer').style.display = 'none';
          return;
        }
        
        const productId = this.value;
        const productName = selectedOption.textContent;
        const productImage = selectedOption.dataset.image;
        const productPrice = parseInt(selectedOption.dataset.price);
        
        compareProductInfo.innerHTML = `
          <img src="${productImage}" alt="${productName}" class="img-fluid mb-2" style="max-height: 150px;">
          <h6>${productName}</h6>
          <p class="text-danger">${productPrice.toLocaleString('vi-VN')}₫</p>
        `;
        
        // Show the comparison table
        const compareTableContainer = document.getElementById('compareTableContainer');
        compareTableContainer.style.display = 'block';
        
        // Set product names in the comparison table
        document.getElementById('product1Name').textContent = window.currentProduct.name;
        document.getElementById('product2Name').textContent = productName;
        
        // Generate comparison data
        generateComparisonTable(window.currentProduct, {
          id: productId,
          name: productName,
          image: productImage,
          price: productPrice
        });
      });
    });
}

function generateComparisonTable(product1, product2) {
  fetch('data/product.json')
    .then(res => res.json())
    .then(data => {
      const product1Data = data.categories
        .flatMap(cat => cat.products)
        .find(p => p.id === product1.id);
        
      const product2Data = data.categories
        .flatMap(cat => cat.products)
        .find(p => p.id === product2.id);
        
      if (!product1Data || !product2Data) {
        console.error('Không tìm thấy dữ liệu sản phẩm');
        return;
      }
      
      const compareTableBody = document.getElementById('compareTableBody');
      compareTableBody.innerHTML = '';
      
      // Compare price
      const row1 = document.createElement('tr');
      row1.innerHTML = `
        <td><strong>Giá</strong></td>
        <td>${product1.price.toLocaleString('vi-VN')}₫</td>
        <td>${product2.price.toLocaleString('vi-VN')}₫</td>
      `;
      compareTableBody.appendChild(row1);
      
      // Compare colors
      const colors1 = product1Data.variants.flatMap(v => v.colors);
      const colors2 = product2Data.variants.flatMap(v => v.colors);
      
      const row2 = document.createElement('tr');
      row2.innerHTML = `
        <td><strong>Màu sắc</strong></td>
        <td>${Array.from(new Set(colors1)).join(', ') || 'Không có thông tin'}</td>
        <td>${Array.from(new Set(colors2)).join(', ') || 'Không có thông tin'}</td>
      `;
      compareTableBody.appendChild(row2);
      
      // Compare specs
      if (product1Data.specs && product2Data.specs) {
        const allSpecs = [...new Set([...product1Data.specs, ...product2Data.specs])];
        
        allSpecs.forEach(spec => {
          const specName = spec.split(':')[0] || spec;
          
          const hasSpec1 = product1Data.specs.some(s => s.includes(specName));
          const hasSpec2 = product2Data.specs.some(s => s.includes(specName));
          
          const spec1Value = hasSpec1 
            ? product1Data.specs.find(s => s.includes(specName))
            : 'Không có thông tin';
            
          const spec2Value = hasSpec2 
            ? product2Data.specs.find(s => s.includes(specName))
            : 'Không có thông tin';
          
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${specName}</strong></td>
            <td>${spec1Value}</td>
            <td>${spec2Value}</td>
          `;
          compareTableBody.appendChild(row);
        });
      }
    })
    .catch(err => console.error('Lỗi khi tạo bảng so sánh:', err));
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  
  const toastHTML = `
    <div class="toast show bg-${type === 'success' ? 'success' : 'danger'} text-white" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-${type === 'success' ? 'success' : 'danger'} text-white">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        <strong class="me-auto">${type === 'success' ? 'Thành công' : 'Thông báo'}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
  const toastElement = toastContainer.querySelector('.toast:last-child');
  const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
  
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

function showErrorModal() {
  const modalHTML = `
    <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Lỗi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.</p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="window.location.reload()">
              <i class="fas fa-sync-alt me-2"></i>Tải lại
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('errorModal'));
  modal.show();
  document.getElementById('errorModal').addEventListener('hidden.bs.modal', () => window.location.href = 'tainghe.html');
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.rating-input i');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.className = 'fas fa-star';
    } else {
      star.className = 'far fa-star';
    }
  });
}

function createRandomReview() {
  const names = ['Nguyễn Thị D', 'Trần Văn E', 'Lê Thị F', 'Phạm Văn G', 'Hoàng Thị H'];
  const titles = [
    'Âm thanh chất lượng cao',
    'Pin trâu, dùng cả ngày không hết',
    'Kết nối ổn định, không bị ngắt',
    'Đáng tiền, rất hài lòng',
    'Thiết kế đẹp, đeo thoải mái'
  ];
  const comments = [
    'Sản phẩm rất tốt, âm thanh trong trẻo, bass sâu và cân bằng.',
    'Tôi đã dùng được 2 tuần, pin trâu hơn mong đợi. Sạc 1 lần dùng được 2-3 ngày.',
    'Kết nối Bluetooth ổn định, không bị ngắt quãng khi di chuyển. Tầm kết nối khoảng 10m.',
    'So với mức giá thì chất lượng rất tốt. Đề xuất cho ai đang tìm tai nghe chất lượng.',
    'Thiết kế gọn nhẹ, đeo lâu không đau tai. Nút điều khiển nhạy và dễ sử dụng.'
  ];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomComment = comments[Math.floor(Math.random() * comments.length)];
  const randomRating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
  
  const today = new Date();
  const randomDay = Math.floor(Math.random() * 30) + 1;
  const reviewDate = new Date(today);
  reviewDate.setDate(today.getDate() - randomDay);
  
  const formattedDate = `${reviewDate.getDate().toString().padStart(2, '0')}/${(reviewDate.getMonth() + 1).toString().padStart(2, '0')}/${reviewDate.getFullYear()}`;
  
  const reviewItem = document.createElement('div');
  reviewItem.className = 'review-item';
  reviewItem.innerHTML = `
    <div class="review-header">
      <div class="review-author">${randomName}</div>
      <div class="review-date">${formattedDate}</div>
    </div>
    <div class="review-rating">
      ${Array(5).fill().map((_, i) => i < randomRating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>').join('')}
    </div>
    <div class="review-title">${randomTitle}</div>
    <div class="review-comment">
      <p>${randomComment}</p>
    </div>
  `;
  
  return reviewItem;
}