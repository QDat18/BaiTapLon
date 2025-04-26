// Lưu trữ giỏ hàng trong localStorage
class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Thêm sản phẩm vào giỏ hàng
    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
    }

    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Cập nhật số lượng
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    // Lưu giỏ hàng vào localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Cập nhật giao diện giỏ hàng
    updateCartUI() {
        renderCartItems();
        updateCartSummary();
    }

    // Tính tổng số sản phẩm (cho badge)
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Khởi tạo giỏ hàng
const cartSystem = new CartSystem();

// Hàm render giỏ hàng
function renderCartItems() {
    const cartList = document.getElementById('cart-list');
    
    if (!cartList) return;
    
    if (cartSystem.cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng của bạn đang trống</p>
                <a href="products.html" class="empty-cart-btn">
                    <i class="fas fa-arrow-left"></i> Tiếp tục mua sắm
                </a>
            </div>
        `;
        return;
    }
    
    let html = '';
    cartSystem.cart.forEach(item => {
        html += `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-model">${item.model}</div>
                </div>
            </div>
            <div class="cart-item-price">${formatPrice(item.price)}đ</div>
            <div class="quantity-control">
                <button class="quantity-btn decrease">-</button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                <button class="quantity-btn increase">+</button>
            </div>
            <div class="item-total">${formatPrice(item.price * item.quantity)}đ</div>
            <div class="remove-item">
                <i class="fas fa-trash-alt"></i>
            </div>
        </div>`;
    });
    
    cartList.innerHTML = html;
}

// Hàm cập nhật tổng giỏ hàng
function updateCartSummary() {
    const subtotal = cartSystem.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0; // Có thể tính toán giảm giá ở đây
    const total = subtotal - discount;
    
    // Cập nhật UI
    if (document.querySelector('.summary-row:nth-child(2) span:last-child')) {
        document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `${formatPrice(subtotal)}đ`;
        document.querySelector('.summary-total span:last-child').textContent = `${formatPrice(total)}đ`;
    }
    
    // Cập nhật badge số lượng
    updateCartBadge();
}

// Hàm cập nhật badge trên icon giỏ hàng
function updateCartBadge() {
    const totalItems = cartSystem.getTotalItems();
    const badge = document.querySelector('.cart-badge');
    
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Hàm định dạng giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Khởi tạo giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartSummary();
    
    // Xử lý sự kiện quantity
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('decrease') || e.target.classList.contains('increase')) {
            const input = e.target.closest('.quantity-control').querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (e.target.classList.contains('increase')) {
                value += 1;
            } else {
                value = value > 1 ? value - 1 : 1;
            }
            
            input.value = value;
            const itemId = e.target.closest('.cart-item').dataset.id;
            cartSystem.updateQuantity(itemId, value);
        }
        
        if (e.target.closest('.remove-item')) {
            const itemId = e.target.closest('.cart-item').dataset.id;
            cartSystem.removeItem(itemId);
        }
    });
    
    // Xử lý thay đổi input số lượng
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const value = parseInt(e.target.value) || 1;
            e.target.value = value; // Đảm bảo không nhỏ hơn 1
            const itemId = e.target.closest('.cart-item').dataset.id;
            cartSystem.updateQuantity(itemId, value);
        }
    });
});