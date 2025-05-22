/**
 * Hệ thống giỏ hàng nâng cao - Anh Em Rọt Store
 * Version: 2.0
 */

// Khởi tạo biến toàn cục
let cartSystem = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  coupon: null,
  total: 0,
  productDiscount: 0
};

/**
 * Tải và hiển thị giỏ hàng
 */
function loadCart() {
  const cartContainer = document.getElementById('cart-items-container');
  if (!cartContainer) return;
  
  // Clear existing items
  cartContainer.innerHTML = '';
  
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Lưu vào biến toàn cục
  cartSystem.items = cart;
  
  // Update cart count display
  updateCartBadge();
  
  if (cart.length === 0) {
    // Display empty cart message
    cartContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
        <h4>Giỏ hàng của bạn đang trống</h4>
        <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục.</p>
        <a href="product.html" class="btn btn-outline-primary mt-3">
          <i class="fas fa-arrow-left me-2"></i> Tiếp tục mua sắm
        </a>
      </div>
      
      <!-- Sản phẩm đề xuất -->
      <div class="mt-5">
        <h5 class="text-center mb-4">Có thể bạn quan tâm</h5>
        <div class="row" id="suggested-products">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Load suggested products
    loadSuggestedProducts();
    
    // Hide checkout button if cart is empty
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Giỏ hàng trống';
    }
    
    // Hide cart action buttons
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) clearCartBtn.style.display = 'none';
    
    return;
  }
  
  // Enable checkout button if cart has items
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Tiến hành thanh toán';
  }
  
  // Show cart action buttons
  const clearCartBtn = document.getElementById('clearCart');
  if (clearCartBtn) clearCartBtn.style.display = 'block';
  
  // Hiển thị loading spinner
  cartContainer.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2">Đang tải thông tin giỏ hàng...</p>
    </div>
  `;
  
  // Load product data to use for cart
  fetch('data/product.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      // Flatten all products from all categories for easier lookup
      const allProducts = data.categories.flatMap(category => category.products);
      
      // Clear loading spinner
      cartContainer.innerHTML = '';
      
      // Initialize product discount
      let totalProductDiscount = 0;
      
      // Render each cart item
      cart.forEach((item, index) => {
        // Find product by id
        const product = allProducts.find(p => p.id === item.productId);
        
        if (!product) {
          console.error(`Product with id ${item.productId} not found!`);
          return;
        }
        
        // Get variant information
        const variant = product.variants[item.variantIndex] || product.variants[0];
        if (!variant) {
          console.error(`Variant not found for product ${product.name}!`);
          return;
        }
        
        // Create cart item element
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item d-flex align-items-center py-3 border-bottom animate__animated animate__fadeIn';
        cartItemEl.dataset.index = index;
        
        // Xử lý thông tin biến thể (capacity, type, color)
        const variantInfo = variant.capacity || variant.type || '';
        const variantColor = variant.colors ? (item.colorIndex !== undefined ? variant.colors[item.colorIndex] : variant.colors[0]) : '';
        const variantText = [variantInfo, variantColor].filter(Boolean).join(', ');
        
        // Fix: Xử lý giá đúng cách khi có giá khuyến mãi
        const priceToShow = variant.salePrice || variant.price;
        const originalPrice = variant.salePrice ? variant.price : null;
        const subtotal = (priceToShow * (item.quantity || 1));
        
        // Calculate product discount
        if (originalPrice) {
          const itemDiscount = (originalPrice - priceToShow) * (item.quantity || 1);
          totalProductDiscount += itemDiscount;
        }
        
        cartItemEl.innerHTML = `
          <div class="cart-item-image me-3">
            <img src="${product.imageUrl}" alt="${product.name}" class="img-fluid" style="width: 80px; height: 80px; object-fit: contain;">
          </div>
          <div class="cart-item-details flex-grow-1">
            <h5 class="cart-item-title mb-1">${product.name}</h5>
            <p class="cart-item-variant text-muted mb-1">${variantText}</p>
            <div class="cart-item-price">
              <span class="text-danger fw-bold">${priceToShow.toLocaleString('vi-VN')}₫</span>
              ${originalPrice ? `<span class="text-muted text-decoration-line-through ms-2">${originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
              ${originalPrice ? `<span class="text-success ms-2">-${Math.round((originalPrice - priceToShow) / originalPrice * 100)}%</span>` : ''}
            </div>
          </div>
          <div class="cart-item-quantity d-flex align-items-center px-2">
            <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="decrease">-</button>
            <input type="text" class="form-control mx-2 text-center quantity-input" value="${item.quantity || 1}" 
              min="1" max="${variant.stock || 99}" data-product-id="${product.id}" data-variant-index="${item.variantIndex}">
            <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="increase">+</button>
          </div>
          <div class="cart-item-subtotal text-end fw-bold mx-4" style="width: 120px;">
            ${subtotal.toLocaleString('vi-VN')}₫
          </div>
          <div class="cart-item-remove ms-3">
            <button class="btn btn-sm btn-outline-danger remove-item-btn" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        
        cartContainer.appendChild(cartItemEl);
      });
      
      // Lưu tổng tiết kiệm từ khuyến mãi sản phẩm
      cartSystem.productDiscount = totalProductDiscount;
      
      // Add event listeners for quantity buttons and remove buttons
      setupCartItemEvents();
      
      // Update cart totals
      updateCartTotals();
    })
    .catch(err => {
      console.error('Error loading product data:', err);
      cartContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i> Có lỗi xảy ra khi tải dữ liệu giỏ hàng. Vui lòng thử lại sau.
          <button class="btn btn-sm btn-outline-danger ms-3 retry-btn">Thử lại</button>
        </div>
      `;
      
      // Thêm sự kiện cho nút thử lại
      const retryBtn = cartContainer.querySelector('.retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', loadCart);
      }
    });
}

/**
 * Thiết lập sự kiện cho các phần tử trong giỏ hàng
 */
function setupCartItemEvents() {
  // Quantity change buttons
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const cartItem = this.closest('.cart-item');
      const index = parseInt(cartItem.dataset.index);
      const quantityInput = cartItem.querySelector('.quantity-input');
      const currentValue = parseInt(quantityInput.value);
      const action = this.dataset.action;
      
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      if (action === 'decrease' && currentValue > 1) {
        quantityInput.value = currentValue - 1;
        cart[index].quantity = currentValue - 1;
        
        // Animate quantity change
        cartItem.classList.add('animate__pulse');
        setTimeout(() => cartItem.classList.remove('animate__pulse'), 500);
      } else if (action === 'increase') {
        const maxQuantity = parseInt(quantityInput.getAttribute('max') || 99);
        if (currentValue < maxQuantity) {
          quantityInput.value = currentValue + 1;
          cart[index].quantity = currentValue + 1;
          
          // Animate quantity change
          cartItem.classList.add('animate__pulse');
          setTimeout(() => cartItem.classList.remove('animate__pulse'), 500);
        } else {
          // Hiển thị thông báo khi vượt số lượng tối đa
          showCustomToast('Số lượng tối đa', `Chỉ còn ${maxQuantity} sản phẩm trong kho`, 'warning');
          return;
        }
      }
      
      // Update cart in localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Cập nhật cartSystem
      cartSystem.items = cart;
      
      // Update subtotal for this item
      updateItemSubtotal(cartItem, cart[index]);
      
      // Update cart totals
      updateCartTotals();
      
      // Kích hoạt sự kiện cập nhật giỏ hàng
      triggerCartUpdate();
    });
  });
  
  // Direct quantity input
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      const cartItem = this.closest('.cart-item');
      const index = parseInt(cartItem.dataset.index);
      let newValue = parseInt(this.value);
      const minValue = parseInt(this.getAttribute('min') || 1);
      const maxValue = parseInt(this.getAttribute('max') || 99);
      
      // Validate input
      if (isNaN(newValue) || newValue < minValue) {
        newValue = minValue;
      } else if (newValue > maxValue) {
        newValue = maxValue;
        showCustomToast('Số lượng giới hạn', `Đã điều chỉnh về số lượng tối đa (${maxValue})`, 'warning');
      }
      
      // Update input value
      this.value = newValue;
      
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart[index].quantity = newValue;
      
      // Update cart in localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Cập nhật cartSystem
      cartSystem.items = cart;
      
      // Update subtotal for this item
      updateItemSubtotal(cartItem, cart[index]);
      
      // Update cart totals
      updateCartTotals();
      
      // Kích hoạt sự kiện cập nhật giỏ hàng
      triggerCartUpdate();
    });
  });
  
  // Remove item buttons
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      
      // Get product name for confirmation
      const productName = this.closest('.cart-item').querySelector('.cart-item-title').textContent;
      
      // Create and show confirmation modal instead of native confirm
      showConfirmModal(
        'Xóa sản phẩm',
        `Bạn có chắc muốn xóa sản phẩm "${productName}" khỏi giỏ hàng?`,
        () => {
          // Add animation before removing
          const cartItem = this.closest('.cart-item');
          cartItem.classList.add('animate__fadeOutRight');
          
          setTimeout(() => {
            // Get cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Remove item from cart
            cart.splice(index, 1);
            
            // Update cart in localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Cập nhật cartSystem
            cartSystem.items = cart;
            
            // Reload cart to reflect changes
            loadCart();
            
            // Show removal confirmation
            showCustomToast('Đã xóa sản phẩm', 'Sản phẩm đã được xóa khỏi giỏ hàng của bạn', 'success');
            
            // Kích hoạt sự kiện cập nhật giỏ hàng
            triggerCartUpdate();
          }, 300);
        }
      );
    });
  });
}

/**
 * Cập nhật tổng tiền của một mục giỏ hàng
 */
function updateItemSubtotal(cartItemEl, cartItem) {
  if (!cartItemEl || !cartItem) return;
  
  // Find the product data
  fetch('data/product.json')
    .then(res => res.json())
    .then(data => {
      const allProducts = data.categories.flatMap(category => category.products);
      const product = allProducts.find(p => p.id === cartItem.productId);
      
      if (product) {
        const variant = product.variants[cartItem.variantIndex] || product.variants[0];
        const priceToUse = variant.salePrice || variant.price;
        const subtotal = priceToUse * cartItem.quantity;
        
        // Update subtotal display
        const subtotalEl = cartItemEl.querySelector('.cart-item-subtotal');
        if (subtotalEl) {
          subtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')}₫`;
        }
      }
    });
}

/**
 * Cập nhật tổng tiền giỏ hàng
 */
function updateCartTotals() {
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const shippingFeeEl = document.getElementById('shipping-fee');
  const productDiscountEl = document.getElementById('product-discount');
  const couponDiscountEl = document.getElementById('coupon-discount');
  const totalSavingEl = document.getElementById('total-saving');
  const totalSavingContainerEl = document.getElementById('total-saving-container');
  
  if (!cartSubtotalEl || !cartTotalEl) return;
  
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    if (cartSubtotalEl) cartSubtotalEl.textContent = '0₫';
    if (cartTotalEl) cartTotalEl.textContent = '0₫';
    if (productDiscountEl) productDiscountEl.textContent = '0₫';
    if (couponDiscountEl) couponDiscountEl.textContent = '0₫';
    if (totalSavingEl) totalSavingEl.textContent = '0₫';
    if (totalSavingContainerEl) totalSavingContainerEl.style.display = 'none';
    return;
  }
  
  // Load product data to calculate totals
  fetch('data/product.json')
    .then(res => res.json())
    .then(data => {
      const allProducts = data.categories.flatMap(category => category.products);
      
      // Calculate subtotal and product discount
      let subtotal = 0;
      let productDiscount = 0;
      
      cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.productId);
        if (product) {
          const variant = product.variants[item.variantIndex] || product.variants[0];
          const price = variant.salePrice || variant.price;
          const originalPrice = variant.salePrice ? variant.price : price;
          
          subtotal += price * (item.quantity || 1);
          
          // Calculate discount if there's a sale price
          if (variant.salePrice) {
            productDiscount += (originalPrice - variant.salePrice) * (item.quantity || 1);
          }
        }
      });
      
      // Update cartSystem
      cartSystem.subtotal = subtotal;
      cartSystem.productDiscount = productDiscount;
      
      // Calculate shipping fee (miễn phí ship cho đơn hàng trên 500.000₫)
      const shippingFee = subtotal >= 500000 ? 0 : 30000;
      cartSystem.shipping = shippingFee;
      
      // Update shipping fee display
      if (shippingFeeEl) {
        shippingFeeEl.textContent = shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`;
      }
      
      // Update subtotal display
      if (cartSubtotalEl) {
        cartSubtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')}₫`;
      }
      
      // Update product discount display
      if (productDiscountEl) {
        productDiscountEl.textContent = productDiscount > 0 ? 
          `-${productDiscount.toLocaleString('vi-VN')}₫` : '0₫';
      }
      
      // Get coupon discount
      let couponDiscount = 0;
      
      // Apply coupon if available
      applyCouponIfAvailable();
      
      // Get updated coupon discount
      couponDiscount = cartSystem.discount;
      
      // Update coupon discount display
      if (couponDiscountEl) {
        couponDiscountEl.textContent = couponDiscount > 0 ? 
          `-${couponDiscount.toLocaleString('vi-VN')}₫` : '0₫';
      }
      
      // Calculate total savings
      const totalSaving = productDiscount + couponDiscount;
      
      // Update total saving display
      if (totalSavingEl) {
        totalSavingEl.textContent = `${totalSaving.toLocaleString('vi-VN')}₫`;
      }
      
      // Show/hide total saving container
      if (totalSavingContainerEl) {
        totalSavingContainerEl.style.display = totalSaving > 0 ? 'flex' : 'none';
      }
      
      // Calculate and update final total
      const finalTotal = subtotal + shippingFee - couponDiscount;
      cartSystem.total = finalTotal;
      
      if (cartTotalEl) {
        cartTotalEl.textContent = `${finalTotal.toLocaleString('vi-VN')}₫`;
      }
      
      // Update active coupon display
      updateActiveCouponDisplay();
    })
    .catch(err => {
      console.error('Error calculating cart totals:', err);
    });
}

/**
 * Hiển thị mã giảm giá đã kích hoạt
 */
function updateActiveCouponDisplay() {
  const activeCouponsContainer = document.getElementById('activeCoupons');
  if (!activeCouponsContainer) return;
  
  const couponCode = localStorage.getItem('couponCode');
  const couponType = localStorage.getItem('couponType');
  const couponValue = localStorage.getItem('couponValue');
  
  if (!couponCode) {
    activeCouponsContainer.innerHTML = '';
    return;
  }
  
  let couponDescription = '';
  if (couponType === 'percent') {
    couponDescription = `Giảm ${couponValue}% giá trị đơn hàng`;
  } else if (couponType === 'fixed') {
    couponDescription = `Giảm ${parseInt(couponValue).toLocaleString('vi-VN')}₫`;
  } else if (couponType === 'shipping') {
    couponDescription = 'Miễn phí vận chuyển';
  }
  
  activeCouponsContainer.innerHTML = `
    <div class="active-coupon p-2 rounded animate__animated animate__fadeIn">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="badge bg-success me-2">
            <i class="fas fa-check-circle me-1"></i> Đã áp dụng
          </span>
          <strong>${couponCode}</strong> - ${couponDescription}
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger" id="removeCouponBtn">
          <i class="fas fa-times"></i> Xóa
        </button>
      </div>
    </div>
  `;
  
  // Add event listener for remove button
  document.getElementById('removeCouponBtn').addEventListener('click', removeCoupon);
}

/**
 * Áp dụng mã giảm giá nếu có
 */
function applyCouponIfAvailable() {
  const couponCode = localStorage.getItem('couponCode');
  const couponValue = localStorage.getItem('couponValue');
  const couponType = localStorage.getItem('couponType');
  
  if (!couponCode || !couponValue) {
    cartSystem.discount = 0;
    cartSystem.coupon = null;
    return;
  }
  
  // Lưu thông tin mã giảm giá vào cartSystem
  cartSystem.coupon = {
    code: couponCode,
    type: couponType,
    value: parseInt(couponValue)
  };
  
  // Tính giảm giá dựa vào loại mã
  let discount = 0;
  
  if (couponType === 'percent') {
    discount = Math.round(cartSystem.subtotal * parseInt(couponValue) / 100);
  } else if (couponType === 'fixed') {
    discount = parseInt(couponValue);
  } else if (couponType === 'shipping') {
    discount = cartSystem.shipping;
  }
  
  // Lưu giá trị giảm giá
  cartSystem.discount = discount;
}

/**
 * Áp dụng mã giảm giá mới
 */
function applyCoupon() {
  const couponInput = document.getElementById('couponCode');
  if (!couponInput || !couponInput.value.trim()) {
    showCustomToast('Lỗi', 'Vui lòng nhập mã giảm giá', 'error');
    return;
  }
  
  const couponCode = couponInput.value.trim().toUpperCase();
  
  // Kiểm tra nếu đã có mã giảm giá
  if (localStorage.getItem('couponCode')) {
    showConfirmModal(
      'Thay đổi mã giảm giá',
      'Bạn đã áp dụng một mã giảm giá. Bạn có muốn thay thế bằng mã mới không?',
      () => processCouponCode(couponCode)
    );
  } else {
    processCouponCode(couponCode);
  }
  
  // Xóa giá trị input
  couponInput.value = '';
}

/**
 * Xử lý mã giảm giá
 */
function processCouponCode(couponCode) {
  // Mô phỏng kiểm tra mã giảm giá
  // Trong thực tế, nên gửi request đến server để xác thực
  const validCoupons = {
    'WELCOME10': { type: 'percent', value: 10 },
    'SALE20': { type: 'percent', value: 20 },
    'SALE10': { type: 'percent', value: 10 },
    'FREESHIP': { type: 'shipping', value: 0 },
    'GIAMGIA50K': { type: 'fixed', value: 50000 }
  };
  
  if (validCoupons[couponCode]) {
    // Lưu thông tin mã giảm giá
    localStorage.setItem('couponCode', couponCode);
    localStorage.setItem('couponType', validCoupons[couponCode].type);
    localStorage.setItem('couponValue', validCoupons[couponCode].value);
    
    // Cập nhật giỏ hàng
    updateCartTotals();
    
    // Hiển thị thông báo thành công
    showCustomToast('Đã áp dụng mã giảm giá', `Mã ${couponCode} đã được áp dụng thành công!`, 'success');
    
    // Hiển thị hiệu ứng cho tổng tiền
    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) {
      cartTotalEl.classList.add('animate__animated', 'animate__bounceIn');
      setTimeout(() => {
        cartTotalEl.classList.remove('animate__animated', 'animate__bounceIn');
      }, 1000);
    }
  } else {
    // Hiển thị thông báo lỗi
    showCustomToast('Mã không hợp lệ', 'Mã giảm giá không tồn tại hoặc đã hết hạn', 'error');
  }
}

/**
 * Xóa mã giảm giá
 */
function removeCoupon() {
  // Hiệu ứng trước khi xóa
  const activeCoupon = document.querySelector('.active-coupon');
  if (activeCoupon) {
    activeCoupon.classList.remove('animate__fadeIn');
    activeCoupon.classList.add('animate__fadeOut');
    
    setTimeout(() => {
      // Xóa thông tin mã giảm giá
      localStorage.removeItem('couponCode');
      localStorage.removeItem('couponType');
      localStorage.removeItem('couponValue');
      
      // Cập nhật cartSystem
      cartSystem.coupon = null;
      cartSystem.discount = 0;
      
      // Cập nhật tổng tiền
      updateCartTotals();
      
      // Hiển thị thông báo
      showCustomToast('Đã xóa mã giảm giá', 'Mã giảm giá đã được xóa khỏi đơn hàng', 'info');
    }, 300);
  } else {
    // Xóa thông tin mã giảm giá ngay lập tức
    localStorage.removeItem('couponCode');
    localStorage.removeItem('couponType');
    localStorage.removeItem('couponValue');
    
    // Cập nhật cartSystem
    cartSystem.coupon = null;
    cartSystem.discount = 0;
    
    // Cập nhật tổng tiền
    updateCartTotals();
    
    // Hiển thị thông báo
    showCustomToast('Đã xóa mã giảm giá', 'Mã giảm giá đã được xóa khỏi đơn hàng', 'info');
  }
}

/**
 * Cập nhật số lượng hiển thị trên icon giỏ hàng
 */
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
  
  const cartBadgeElements = [
    document.getElementById('cart-badge'),
    document.getElementById('cart-count')
  ];
  
  cartBadgeElements.forEach(element => {
    if (element) {
      element.textContent = count;
      
      // Ẩn/hiện số lượng dựa vào count
      if (count > 0) {
        element.style.display = 'inline-block';
      } else {
        element.style.display = 'none';
      }
    }
  });
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function clearCart() {
  // Animation trước khi xóa
  const cartItems = document.querySelectorAll('.cart-item');
  cartItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate__animated', 'animate__fadeOutLeft');
    }, index * 100);
  });

  setTimeout(() => {
    // Xóa dữ liệu giỏ hàng
    localStorage.removeItem('cart');
    localStorage.removeItem('checkoutCart');
    localStorage.removeItem('couponCode');
    localStorage.removeItem('couponType');
    localStorage.removeItem('couponValue');
    
    // Cập nhật cartSystem
    cartSystem.items = [];
    cartSystem.subtotal = 0;
    cartSystem.discount = 0;
    cartSystem.coupon = null;
    cartSystem.productDiscount = 0;
    cartSystem.total = 0;
    
    // Tải lại giỏ hàng
    loadCart();
    
    // Kích hoạt sự kiện cập nhật giỏ hàng
    triggerCartUpdate();
    
    // Hiển thị thông báo
    showCustomToast('Đã xóa giỏ hàng', 'Tất cả sản phẩm đã được xóa khỏi giỏ hàng', 'info');
    
    // Đóng modal xác nhận nếu có
    const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmClearCart'));
    if (confirmModal) {
      confirmModal.hide();
    }
  }, cartItems.length * 100 + 300);
}

/**
 * Tiến hành thanh toán
 */
function proceedToCheckout() {
  if (cartSystem.items.length === 0) {
    showCustomToast('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán', 'warning');
    return;
  }
  
  // Lưu thông tin ghi chú đơn hàng nếu có
  const orderNotes = document.getElementById('orderNotes');
  if (orderNotes && orderNotes.value.trim()) {
    localStorage.setItem('orderNotes', orderNotes.value.trim());
  }
  
  // Lưu trạng thái giỏ hàng hiện tại
  localStorage.setItem('checkoutCart', JSON.stringify(cartSystem.items));
  
  // Hiển thị hiệu ứng loading
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Đang chuyển hướng...
    `;
  }
  
  // Chuyển hướng đến trang thanh toán
  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 800);
}

/**
 * Hiển thị modal xác nhận
 */
function showConfirmModal(title, message, callback) {
  // Kiểm tra nếu đã có modal sẵn trong DOM
  let modal = document.getElementById('dynamicConfirmModal');
  
  if (!modal) {
    // Tạo modal mới nếu chưa có
    const modalHTML = `
      <div class="modal fade" id="dynamicConfirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="dynamicConfirmTitle">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="dynamicConfirmBody">
              ${message}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" class="btn btn-primary" id="dynamicConfirmBtn">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('dynamicConfirmModal');
  } else {
    // Cập nhật nội dung modal nếu đã có
    document.getElementById('dynamicConfirmTitle').textContent = title;
    document.getElementById('dynamicConfirmBody').textContent = message;
  }
  
  // Khởi tạo modal Bootstrap
  const bsModal = new bootstrap.Modal(modal);
  
  // Xóa event listener cũ nếu có
  const confirmBtn = document.getElementById('dynamicConfirmBtn');
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  
  // Thêm event listener mới
  newConfirmBtn.addEventListener('click', function() {
    bsModal.hide();
    if (typeof callback === 'function') {
      callback();
    }
  });
  
  // Hiển thị modal
  bsModal.show();
}

/**
 * Hiển thị thông báo toast
 */
function showToast(title, message, type = 'info') {
  // Tạo container cho toast nếu chưa tồn tại
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Tạo ID duy nhất cho toast
  const toastId = 'toast-' + Date.now();
  
  // Chọn icon dựa vào loại thông báo
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  if (type === 'danger' || type === 'error') icon = 'exclamation-circle';
  
  // Chọn màu dựa vào loại thông báo
  let bgColor = 'primary';
  if (type === 'success') bgColor = 'success';
  if (type === 'warning') bgColor = 'warning';
  if (type === 'danger' || type === 'error') bgColor = 'danger';
  
  // Tạo HTML cho toast
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${bgColor} border-0 animate__animated animate__fadeInUp" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-${icon} me-2"></i>
          <strong>${title}</strong> ${message ? `- ${message}` : ''}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  
  // Thêm toast vào container
  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  
  // Khởi tạo và hiển thị toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
  toast.show();
  
  // Tự động xóa toast sau khi ẩn
  toastElement.addEventListener('hidden.bs.toast', function () {
    this.remove();
  });
}

/**
 * Hiển thị thông báo toast tùy chỉnh
 */
function showCustomToast(title, message = '', type = 'success') {
  // Kiểm tra nếu sử dụng jQuery
  if (typeof $ !== 'undefined') {
    const bgColor = type === 'success' ? '#28a745' : 
                    type === 'error' || type === 'danger' ? '#dc3545' : 
                    type === 'warning' ? '#ffc107' : '#17a2b8';
    const textColor = type === 'warning' ? '#212529' : '#fff';
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' || type === 'danger' ? 'fa-exclamation-circle' : 
                type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    const toast = $(`
      <div class="custom-toast animate__animated animate__fadeInUp">
        <i class="fas ${icon}"></i>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="close-toast">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).appendTo('body');
    
    toast.css({
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bgColor,
      color: textColor,
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '300px',
      maxWidth: '500px'
    }).hide().fadeIn();
    
    toast.find('.toast-title').css({
      fontWeight: 'bold'
    });
    
    toast.find('.toast-content').css({
      flex: 1
    });
    
    toast.find('.close-toast').css({
      background: 'transparent',
      border: 'none',
      color: textColor,
      opacity: 0.7,
      cursor: 'pointer'
    }).hover(
      function() { $(this).css('opacity', 1); },
      function() { $(this).css('opacity', 0.7); }
    );
    
    toast.find('.close-toast').on('click', function() {
      toast.fadeOut(function() {
        $(this).remove();
      });
    });
    
    setTimeout(() => toast.fadeOut(() => toast.remove()), 5000);
  } else {
    // Fallback to standard toast if jQuery is not available
    showToast(title, message, type);
  }
}

/**
 * Tải sản phẩm đề xuất
 */
function loadSuggestedProducts() {
  const suggestedContainer = document.getElementById('suggested-products');
  if (!suggestedContainer) return;
  
  fetch('data/product.json')
    .then(res => res.json())
    .then(data => {
      // Lấy tất cả sản phẩm từ các danh mục
      const allProducts = data.categories.flatMap(category => category.products);
      
      // Lấy 3 sản phẩm ngẫu nhiên
      const suggestedProducts = allProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      let html = '';
      
      // Tạo HTML cho sản phẩm đề xuất
      suggestedProducts.forEach(product => {
        const firstVariant = product.variants[0];
        const price = firstVariant.salePrice || firstVariant.price;
        const originalPrice = firstVariant.salePrice ? firstVariant.price : null;
        const discountPercent = originalPrice ? Math.round((originalPrice - price) / originalPrice * 100) : 0;
        
        html += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="card product-card h-100 animate__animated animate__fadeIn">
              ${discountPercent > 0 ? `<div class="product-badge">-${discountPercent}%</div>` : ''}
              <img src="${product.imageUrl}" alt="${product.name}" class="card-img-top p-3">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <div class="d-flex align-items-center mb-2">
                  <span class="text-danger fw-bold">${price.toLocaleString('vi-VN')}₫</span>
                  ${originalPrice ? `<span class="text-muted text-decoration-line-through ms-2">${originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
                </div>
                <button class="btn btn-primary w-100 add-to-cart-btn" data-product-id="${product.id}" data-variant-index="0">
                  <i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        `;
      });
      
      suggestedContainer.innerHTML = html;
      
      // Thêm sự kiện cho nút thêm vào giỏ
      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const productId = this.dataset.productId;
          const variantIndex = parseInt(this.dataset.variantIndex);
          
          // Tìm sản phẩm trong danh sách
          const product = allProducts.find(p => p.id === productId);
          
          if (product) {
            addToCart(product, variantIndex);
            
            // Animation cho nút
            this.innerHTML = '<i class="fas fa-check me-2"></i>Đã thêm';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            
            setTimeout(() => {
              this.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ';
              this.classList.remove('btn-success');
              this.classList.add('btn-primary');
            }, 2000);
          }
        });
      });
    })
    .catch(err => {
      console.error('Error loading suggested products:', err);
      if (suggestedContainer) {
        suggestedContainer.innerHTML = `
          <div class="col-12">
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-circle me-2"></i>
              Không thể tải sản phẩm đề xuất
            </div>
          </div>
        `;
      }
    });
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
function addToCart(product, variantIndex = 0, colorIndex = 0, quantity = 1) {
  // Lấy giỏ hàng hiện tại từ localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItemIndex = cart.findIndex(item => 
    item.productId === product.id && 
    item.variantIndex === variantIndex &&
    item.colorIndex === colorIndex
  );
  
  if (existingItemIndex > -1) {
    // Nếu sản phẩm đã tồn tại, tăng số lượng
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Nếu sản phẩm chưa tồn tại, thêm mới
    cart.push({
      productId: product.id,
      variantIndex: variantIndex,
      colorIndex: colorIndex,
      quantity: quantity
    });
  }
  
  // Lưu giỏ hàng vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Cập nhật cartSystem
  cartSystem.items = cart;
  
  // Hiển thị thông báo
  showCustomToast('Đã thêm vào giỏ hàng', product.name, 'success');
  
  // Tải lại giỏ hàng
  loadCart();
  
  // Kích hoạt sự kiện cập nhật giỏ hàng
  triggerCartUpdate();
}

/**
 * Kích hoạt sự kiện cập nhật giỏ hàng
 */
function triggerCartUpdate() {
  const event = new CustomEvent('cartUpdated', {
    detail: {
      count: cartSystem.items.length,
      total: cartSystem.total
    }
  });
  window.dispatchEvent(event);
}

/**
 * Khởi tạo chức năng cho nút áp dụng mã giảm giá
 */
function setupCouponButton() {
  const applyCouponBtn = document.getElementById('applyCoupon');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', applyCoupon);
  }
  
  // Hỗ trợ nhấn Enter để áp dụng mã
  const couponInput = document.getElementById('couponCode');
  if (couponInput) {
    couponInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCoupon();
      }
    });
  }
}

/**
 * Khởi tạo chức năng cho nút thanh toán
 */
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', proceedToCheckout);
  }
}

/**
 * Khởi tạo chức năng cho nút xóa giỏ hàng
 */
function setupClearCartButton() {
  const clearCartBtn = document.getElementById('clearCart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      // Hiển thị modal xác nhận
      const confirmModal = document.getElementById('confirmClearCart');
      if (confirmModal) {
        const bsModal = new bootstrap.Modal(confirmModal);
        bsModal.show();
      } else {
        // Nếu không có modal, hiển thị hộp thoại xác nhận
        showConfirmModal(
          'Xóa giỏ hàng',
          'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?',
          clearCart
        );
      }
    });
    
    // Thêm sự kiện cho nút xác nhận trong modal mặc định
    const confirmClearBtn = document.getElementById('confirmClear');
    if (confirmClearBtn) {
      confirmClearBtn.addEventListener('click', clearCart);
    }
  }
}

/**
 * Khởi tạo tất cả các chức năng
 */
function initCart() {
  // Tải giỏ hàng
  loadCart();
  
  // Khởi tạo các nút chức năng
  setupCouponButton();
  setupCheckoutButton();
  setupClearCartButton();
  
  // Khởi tạo cartSystem từ localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartSystem.items = cart;
  
  // Đặt cartSystem lên window để có thể sử dụng từ bên ngoài
  window.cartSystem = cartSystem;
  
  // Thêm hàm clearCart vào cartSystem
  cartSystem.clearCart = clearCart;
}

// Chạy hàm khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initCart);

// Thêm sự kiện lắng nghe cho các thay đổi trong giỏ hàng

// window.addEventListener('cartUpdated', function(e) {
//     const cartCount = e.detail.count;
//     const cartTotal = e.detail.total;
    
//     // Cập nhật số lượng giỏ hàng trên icon
//     updateCartBadge();
    
//     // Cập nhật tổng tiền giỏ hàng nếu cần
//     if (cartTotal > 0) {
//         document.getElementById('cart-total').textContent = `${cartTotal.toLocaleString('vi-VN')}₫`;
//     }
// });