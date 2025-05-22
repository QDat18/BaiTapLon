// Biến toàn cục cho hệ thống popup
const PopupSystem = {
  shown: {}, // Theo dõi popup đã hiển thị
  activePopup: null, // Popup hiện đang hiển thị
  queue: [], // Hàng đợi các popup sẽ hiển thị
  initialized: false,
  allowPopups: true, // Cho phép hiển thị popup
  timeouts: {}, // Lưu các timeout
  bodyScrollPos: 0,
};

/**
 * Khởi tạo hệ thống popup
 */
function initializePopupSystem() {
  if (PopupSystem.initialized) return;

  // Thêm overlay vào trang
  const overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.classList.add('popup-overlay');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideActivePopup();
    }
  });
  document.body.appendChild(overlay);

  // Thêm container popup
  const container = document.createElement('div');
  container.id = 'popup-container';
  container.classList.add('popup-container');
  document.body.appendChild(container);

  // Kiểm tra cookies để biết người dùng đã xem popup chưa
  const visitedBefore = getCookie('visited') === 'true';
  const lastPopupShown = getCookie('lastPopupShown');
  const now = new Date().getTime();

  // Đăng ký các popup
  createWelcomePopup();
  createDealPopup();
  createPromotionPopup();

  // Hẹn giờ hiển thị popup
  if (!visitedBefore) {
    // Lần đầu tiên truy cập: hiển thị welcome popup ngay lập tức
    setTimeout(() => showPopup('welcome'), 1000);
    setCookie('visited', 'true', 30); // 30 ngày
    setCookie('lastPopupShown', now, 30);
  } else if (lastPopupShown && (now - lastPopupShown) > 24 * 60 * 60 * 1000) {
    // Đã hơn 1 ngày kể từ lần popup cuối: hiển thị promotion
    setTimeout(() => showPopup('promotion'), 3000);
    setCookie('lastPopupShown', now, 30);
  } else {
    // Lần sau truy cập: hiển thị deal popup sau khi lướt một lúc
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (!scrollTriggered && window.scrollY > 300) {
        scrollTriggered = true;
        setTimeout(() => showPopup('deal'), 2000);
      }
    });
  }

  // Đánh dấu đã khởi tạo
  PopupSystem.initialized = true;
  
  // Lắng nghe phím Escape để đóng popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideActivePopup();
    }
  });
}

function createWelcomePopup() {
  const welcomePopup = document.createElement('div');
  welcomePopup.id = 'welcome-popup';
  welcomePopup.className = 'popup welcome-popup';
  welcomePopup.innerHTML = `
    <div class="popup-content">
      <button class="popup-close" data-popup="welcome">&times;</button>
      <div class="welcome-header">
        <div class="logo-container">
          <img src="assets/logo/logo.png" alt="Anh Em Rọt Store" class="welcome-logo">
        </div>
        <h2>Chào mừng đến với <span class="highlight">Anh Em Rọt Store</span></h2>
      </div>
      <div class="welcome-body">
        <p>Chúng tôi rất vui khi bạn ghé thăm! Đăng ký ngay để nhận:</p>
        <ul class="benefits-list">
          <li><i class="fas fa-check-circle"></i> Voucher giảm 100.000₫ cho đơn hàng đầu tiên</li>
          <li><i class="fas fa-check-circle"></i> Miễn phí vận chuyển toàn quốc</li>
          <li><i class="fas fa-check-circle"></i> Thông báo ưu đãi đặc biệt</li>
        </ul>
        <div class="subscribe-form">
          <input type="email" placeholder="Email của bạn" class="email-input">
          <button class="subscribe-btn">Đăng ký ngay</button>
        </div>
        <div class="no-thanks">
          <a href="#" class="close-popup" data-popup="welcome">Để sau</a>
        </div>
      </div>
    </div>
  `;
  document.getElementById('popup-container').appendChild(welcomePopup);

  // Thêm sự kiện cho các nút
  welcomePopup.querySelector('.popup-close').addEventListener('click', () => hidePopup('welcome'));
  welcomePopup.querySelector('.close-popup').addEventListener('click', (e) => {
    e.preventDefault();
    hidePopup('welcome');
  });
  welcomePopup.querySelector('.subscribe-btn').addEventListener('click', () => {
    const email = welcomePopup.querySelector('.email-input').value;
    if (email && email.includes('@')) {
      // Giả lập gửi email
      welcomePopup.querySelector('.welcome-body').innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle success-icon"></i>
          <h3>Đăng ký thành công!</h3>
          <p>Mã giảm giá của bạn: <strong>WELCOME100K</strong></p>
          <p>Vui lòng kiểm tra email để xác nhận.</p>
          <button class="close-success-btn">Đóng</button>
        </div>
      `;
      welcomePopup.querySelector('.close-success-btn').addEventListener('click', () => hidePopup('welcome'));
    } else {
      alert('Vui lòng nhập email hợp lệ');
    }
  });
}

/**
 * Tạo deal popup
 */
function createDealPopup() {
  const dealPopup = document.createElement('div');
  dealPopup.id = 'deal-popup';
  dealPopup.className = 'popup deal-popup';
  dealPopup.innerHTML = `
    <div class="popup-content deal-content">
      <button class="popup-close" data-popup="deal">&times;</button>
      <div class="deal-header">
        <div class="popup-date">DUY NHẤT 20.07</div>
        <h3 class="deal-title">DEAL LÀM ĐẸP</h3>
        <div class="deal-subtitle">MỘT CHẠM RINH TRIỆU QUÀ</div>
        <div class="deal-price">
          <span class="price-tag">100K</span>
        </div>
      </div>
      <div class="deal-products">
        <img src="assets/promotions/deal-products.png" alt="P&G Products" class="deal-products-img">
        <div class="deal-badge">
          <img src="assets/promotions/gift-badge.png" alt="Gift" class="gift-badge">
        </div>
      </div>
      <div class="deal-footer">
        <a href="promotion.html" class="deal-button">MUA NGAY</a>
      </div>
      <div class="deal-assistant">
        <img src="assets/promotions/assistant.png" alt="Assistant" class="assistant-img">
        <div class="discount-bubble">
          <div class="discount-text">Deal đẹp ngày 19/7 GIẢM ĐẾN 50%</div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('popup-container').appendChild(dealPopup);

  // Thêm sự kiện
  dealPopup.querySelector('.popup-close').addEventListener('click', () => hidePopup('deal'));
  dealPopup.querySelector('.deal-button').addEventListener('click', () => {
    hidePopup('deal');
    // Có thể thêm tracking analytics ở đây
  });
}

/**
 * Tạo promotion popup
 */
function createPromotionPopup() {
  const promotionPopup = document.createElement('div');
  promotionPopup.id = 'promotion-popup';
  promotionPopup.className = 'popup promotion-popup';
  promotionPopup.innerHTML = `
    <div class="popup-content promo-content">
      <button class="popup-close" data-popup="promotion">&times;</button>
      <div class="promo-header">
        <h3>ƯU ĐÃI ĐẶC BIỆT</h3>
      </div>
      <div class="promo-body">
        <div class="promo-image">
          <img src="assets/promotions/iphone-promo.png" alt="iPhone Promotion" class="promo-product-img">
        </div>
        <div class="promo-info">
          <div class="promo-title">iPhone 15 Pro Max</div>
          <div class="promo-price">
            <span class="current-price">25.990.000₫</span>
            <span class="old-price">29.990.000₫</span>
          </div>
          <div class="promo-benefits">
            <div class="benefit"><i class="fas fa-gift"></i> Tặng ốp lưng chính hãng</div>
            <div class="benefit"><i class="fas fa-truck"></i> Miễn phí vận chuyển</div>
            <div class="benefit"><i class="fas fa-shield-alt"></i> Bảo hành 24 tháng</div>
          </div>
          <div class="promo-countdown">
            <div class="countdown-label">Kết thúc sau:</div>
            <div class="countdown-timer" id="promo-countdown-timer">00:00:00</div>
          </div>
          <a href="product.html" class="promo-button">MUA NGAY</a>
        </div>
      </div>
    </div>
  `;
  document.getElementById('popup-container').appendChild(promotionPopup);

  // Thêm sự kiện
  promotionPopup.querySelector('.popup-close').addEventListener('click', () => hidePopup('promotion'));
  promotionPopup.querySelector('.promo-button').addEventListener('click', () => {
    hidePopup('promotion');
    // Có thể thêm tracking analytics ở đây
  });

  // Thiết lập countdown
  startPromotionCountdown();
}

/**
 * Bắt đầu đếm ngược cho popup promotion
 */
function startPromotionCountdown() {
  const countdownElement = document.getElementById('promo-countdown-timer');
  if (!countdownElement) return;

  // Đặt thời gian hết hạn (24 giờ từ thời điểm hiện tại)
  const now = new Date();
  const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  function updateCountdown() {
    const currentTime = new Date();
    const diff = expiry - currentTime;
    
    if (diff <= 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = "00:00:00";
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownElement.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
  
  // Lưu interval ID để có thể clear khi cần
  PopupSystem.timeouts['promotionCountdown'] = countdownInterval;
}

/**
 * Hiển thị popup theo ID
 */
function showPopup(popupId) {
  if (!PopupSystem.allowPopups || PopupSystem.shown[popupId]) return;
  
  if (PopupSystem.activePopup) {
    // Nếu đang có popup khác, đưa popup mới vào hàng đợi
    PopupSystem.queue.push(popupId);
    return;
  }
  
  const popupElement = document.getElementById(`${popupId}-popup`);
  const overlay = document.getElementById('popup-overlay');
  
  if (!popupElement || !overlay) return;
  
  // Lưu vị trí cuộn của trang
  PopupSystem.bodyScrollPos = window.scrollY;
  
  // Thêm class để ngăn cuộn trang
  document.body.classList.add('popup-open');
  document.body.style.top = `-${PopupSystem.bodyScrollPos}px`;
  
  // Hiển thị overlay và popup
  overlay.style.display = 'block';
  setTimeout(() => overlay.classList.add('active'), 10);
  
  popupElement.style.display = 'block';
  setTimeout(() => popupElement.classList.add('show'), 10);
  
  // Cập nhật trạng thái
  PopupSystem.activePopup = popupId;
  PopupSystem.shown[popupId] = true;
  
  // Animate elements trong popup
  animatePopupElements(popupElement);
}

/**
 * Thêm animation cho các phần tử trong popup
 */
function animatePopupElements(popupElement) {
  const elements = popupElement.querySelectorAll('.animate-in');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('animated');
    }, 200 * index);
  });
}

/**
 * Ẩn popup đang hiển thị
 */
function hideActivePopup() {
  if (!PopupSystem.activePopup) return;
  hidePopup(PopupSystem.activePopup);
}

/**
 * Ẩn popup theo ID
 */
function hidePopup(popupId) {
  const popupElement = document.getElementById(`${popupId}-popup`);
  const overlay = document.getElementById('popup-overlay');
  
  if (!popupElement || !overlay) return;
  
  // Thêm class ẩn
  popupElement.classList.remove('show');
  
  // Đợi animation hoàn thành rồi ẩn hoàn toàn
  setTimeout(() => {
    popupElement.style.display = 'none';
    
    // Nếu không còn popup nào trong hàng đợi, ẩn overlay
    if (PopupSystem.queue.length === 0) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.style.display = 'none';
        
        // Khôi phục cuộn trang
        document.body.classList.remove('popup-open');
        window.scrollTo(0, PopupSystem.bodyScrollPos);
        document.body.style.top = '';
      }, 300);
    }
    
    // Cập nhật trạng thái
    PopupSystem.activePopup = null;
    
    // Kiểm tra xem có popup tiếp theo không
    if (PopupSystem.queue.length > 0) {
      const nextPopup = PopupSystem.queue.shift();
      setTimeout(() => showPopup(nextPopup), 500);
    }
  }, 100);
}

/**
 * Đặt cookie
 */
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

/**
 * Lấy cookie
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
  // Đợi preloader hoàn thành rồi mới khởi tạo popup
  window.addEventListener("load", () => {
    setTimeout(() => {
      initializePopupSystem();
    }, 2000);
  });
});

// Export các hàm để sử dụng từ bên ngoài
window.PopupSystem = {
  show: showPopup,
  hide: hidePopup,
  hideActive: hideActivePopup
};