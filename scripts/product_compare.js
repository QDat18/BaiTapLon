/**
 * Product Comparison Module - Anh Em Rọt Store
 * Handles product comparison functionality
 */

// Store for products to compare
const ProductCompare = {
  // Maximum products to compare
  maxProducts: 4,
  
  // Initialize comparison module
  init: function() {
    this.loadCompareList();
    this.renderCompareIndicator();
    this.bindEvents();
  },
  
  // Get products from localStorage
  getCompareList: function() {
    return JSON.parse(localStorage.getItem('compareProducts')) || [];
  },
  
  // Save products to localStorage
  saveCompareList: function(list) {
    localStorage.setItem('compareProducts', JSON.stringify(list));
  },
  
  // Load comparison list from localStorage
  loadCompareList: function() {
    const compareList = this.getCompareList();
    // Update the UI with the current compare list
    this.updateCompareUI(compareList);
  },
  
  // Toggle product in comparison list
  toggleProduct: function(productId, productName, productImage, productPrice) {
    let compareList = this.getCompareList();
    const existingIndex = compareList.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
      // Remove from list
      compareList.splice(existingIndex, 1);
      this.saveCompareList(compareList);
      this.showToast(`${productName} đã được xóa khỏi danh sách so sánh`, 'info');
    } else {
      // Check if we've reached the max number of products
      if (compareList.length >= this.maxProducts) {
        this.showToast(`Chỉ có thể so sánh tối đa ${this.maxProducts} sản phẩm. Vui lòng xóa bớt sản phẩm.`, 'warning');
        return;
      }
      
      // Add to list
      compareList.push({
        id: productId,
        name: productName,
        image: productImage,
        price: productPrice
      });
      
      this.saveCompareList(compareList);
      this.showToast(`${productName} đã được thêm vào danh sách so sánh`, 'success');
    }
    
    // Update UI
    this.updateCompareUI(compareList);
  },
  
  // Update comparison UI elements
  updateCompareUI: function(compareList) {
    // Update compare count
    const compareCount = document.getElementById('compareCount');
    if (compareCount) {
      compareCount.textContent = compareList.length;
    }
    
    // Update compare buttons on product cards
    document.querySelectorAll('.compare-btn').forEach(btn => {
      const productId = btn.getAttribute('data-product-id');
      if (compareList.some(item => item.id === productId)) {
        btn.classList.add('active');
        btn.querySelector('i').classList.remove('fa-plus');
        btn.querySelector('i').classList.add('fa-check');
      } else {
        btn.classList.remove('active');
        btn.querySelector('i').classList.remove('fa-check');
        btn.querySelector('i').classList.add('fa-plus');
      }
    });
    
    // Show/hide compare bar based on items count
    const compareBar = document.getElementById('compareBar');
    if (compareBar) {
      if (compareList.length > 0) {
        compareBar.classList.add('visible');
      } else {
        compareBar.classList.remove('visible');
      }
    }
    
    // Update compare items in the bar
    this.renderCompareItems(compareList);
  },
  
  // Render compare items in the comparison bar
  renderCompareItems: function(compareList) {
    const compareItems = document.getElementById('compareItems');
    if (!compareItems) return;
    
    compareItems.innerHTML = '';
    
    compareList.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'compare-item';
      itemEl.innerHTML = `
        <div class="compare-item-image">
          <img src="${item.image}" alt="${item.name}">
          <button class="remove-compare-item" data-product-id="${item.id}">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="compare-item-name">${item.name}</div>
      `;
      compareItems.appendChild(itemEl);
      
      // Add event listener to remove button
      itemEl.querySelector('.remove-compare-item').addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeCompareItem(item.id, item.name);
      });
    });
    
    // Add placeholder items
    const placeholdersToAdd = this.maxProducts - compareList.length;
    for (let i = 0; i < placeholdersToAdd; i++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'compare-item compare-placeholder';
      placeholder.innerHTML = `
        <div class="compare-item-image placeholder-image">
          <i class="fas fa-plus-circle"></i>
        </div>
        <div class="compare-item-name">Thêm sản phẩm</div>
      `;
      compareItems.appendChild(placeholder);
    }
  },
  
  // Remove a product from comparison
  removeCompareItem: function(productId, productName) {
    let compareList = this.getCompareList();
    compareList = compareList.filter(item => item.id !== productId);
    this.saveCompareList(compareList);
    this.updateCompareUI(compareList);
    this.showToast(`${productName} đã được xóa khỏi danh sách so sánh`, 'info');
  },
  
  // Clear all products from comparison
  clearCompareList: function() {
    this.saveCompareList([]);
    this.updateCompareUI([]);
    this.showToast('Đã xóa tất cả sản phẩm khỏi danh sách so sánh', 'info');
  },
  
  // Go to comparison page
  goToComparePage: function() {
    const compareList = this.getCompareList();
    if (compareList.length < 2) {
      this.showToast('Vui lòng chọn ít nhất 2 sản phẩm để so sánh', 'warning');
      return;
    }
    
    window.location.href = 'compare.html';
  },
  
  // Render compare indicator
  renderCompareIndicator: function() {
    if (document.getElementById('compareBar')) return;
    
    // Create compare bar
    const compareBar = document.createElement('div');
    compareBar.id = 'compareBar';
    compareBar.className = 'compare-bar';
    compareBar.innerHTML = `
      <div class="container">
        <div class="compare-bar-content">
          <div class="compare-bar-title">
            <i class="fas fa-balance-scale me-2"></i>
            So sánh (<span id="compareCount">0</span>)
          </div>
          <div class="compare-items" id="compareItems"></div>
          <div class="compare-actions">
            <button id="clearCompareBtn" class="btn btn-sm btn-outline-light">
              <i class="fas fa-trash me-2"></i>Xóa tất cả
            </button>
            <button id="goCompareBtn" class="btn btn-sm btn-light">
              <i class="fas fa-balance-scale me-2"></i>So sánh ngay
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(compareBar);
    
    // Handle clear and compare buttons
    document.getElementById('clearCompareBtn').addEventListener('click', () => this.clearCompareList());
    document.getElementById('goCompareBtn').addEventListener('click', () => this.goToComparePage());
    
    // Initialize compare items
    this.renderCompareItems(this.getCompareList());
  },
  
  // Add compare button to product card
  addCompareButton: function(productCard, productId, productName, productImage, productPrice) {
    const compareBtn = document.createElement('div');
    compareBtn.className = 'compare-btn';
    compareBtn.setAttribute('data-product-id', productId);
    compareBtn.innerHTML = '<i class="fas fa-plus"></i>';
    compareBtn.title = 'Thêm vào so sánh';
    
    // Check if product is already in compare list
    const compareList = this.getCompareList();
    if (compareList.some(item => item.id === productId)) {
      compareBtn.classList.add('active');
      compareBtn.querySelector('i').classList.remove('fa-plus');
      compareBtn.querySelector('i').classList.add('fa-check');
    }
    
    // Add click handler
    compareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleProduct(productId, productName, productImage, productPrice);
    });
    
    // Add to product card
    productCard.querySelector('.product-image-container').appendChild(compareBtn);
  },
  
  // Add compare button to product detail page
  addCompareButtonToDetail: function(productId, productName, productImage, productPrice) {
    const actionBtns = document.querySelector('.action-buttons');
    if (!actionBtns) return;
    
    // Create the compare button
    const compareBtn = document.createElement('button');
    compareBtn.className = 'btn-compare';
    compareBtn.setAttribute('data-product-id', productId);
    
    // Check if product is already in compare list
    const compareList = this.getCompareList();
    const isInCompare = compareList.some(item => item.id === productId);
    
    compareBtn.innerHTML = isInCompare 
      ? '<i class="fas fa-check"></i> Đã thêm vào so sánh' 
      : '<i class="fas fa-balance-scale"></i> Thêm vào so sánh';
    
    if (isInCompare) {
      compareBtn.classList.add('active');
    }
    
    // Add click handler
    compareBtn.addEventListener('click', () => {
      this.toggleProduct(productId, productName, productImage, productPrice);
      
      // Update button text and style
      const isNowInCompare = this.getCompareList().some(item => item.id === productId);
      compareBtn.innerHTML = isNowInCompare 
        ? '<i class="fas fa-check"></i> Đã thêm vào so sánh' 
        : '<i class="fas fa-balance-scale"></i> Thêm vào so sánh';
      
      if (isNowInCompare) {
        compareBtn.classList.add('active');
      } else {
        compareBtn.classList.remove('active');
      }
    });
    
    // Add to product detail page
    actionBtns.appendChild(compareBtn);
  },
  
  // Bind events
  bindEvents: function() {
    // Add compare buttons to all product cards on page load
    document.querySelectorAll('.product-card').forEach(card => {
      const productId = card.getAttribute('data-product-id');
      const productName = card.querySelector('.product-title').textContent;
      const productImage = card.querySelector('.product-image').src;
      const productPrice = card.querySelector('.product-price').textContent.trim();
      
      this.addCompareButton(card, productId, productName, productImage, productPrice);
    });
  },
  
  // Show toast notification
  showToast: function(message, type = 'success') {
    // Use the existing showToast function if available
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
      return;
    }
    
    // Otherwise create our own toast
    const toastHTML = `
      <div class="toast-notification">
        <div class="toast show align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} border-0" role="alert">
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    setTimeout(() => {
      const toast = document.querySelector('.toast-notification .toast');
      if (toast) {
        toast.classList.remove('show');
        setTimeout(() => document.querySelector('.toast-notification')?.remove(), 300);
      }
    }, 3000);
  }
};

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
  ProductCompare.init();
});