// recent-purchases.js - Hiển thị thông báo người mua gần đây

$(document).ready(function() {
    // Danh sách tên người dùng Việt Nam phổ biến
    const vietnameseNames = [
        "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", 
        "Hoàng Văn E", "Ngô Thị F", "Vũ Văn G", "Đặng Thị H",
        "Bùi Văn I", "Đỗ Thị K", "Hồ Văn L", "Nguyễn Thị M", 
        "Phan Văn N", "Trần Văn O", "Lê Thị P", "Võ Văn Q",
        "Mai Thị R", "Huỳnh Văn S", "Nguyễn Đức T", "Trần Minh U",
        "Lê Quốc V", "Phạm Hồng X", "Hoàng Thị Y", "Nguyễn Thành Z"
    ];
    
    // Danh sách địa điểm Việt Nam
    const locations = [
        "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", 
        "Cần Thơ", "Biên Hòa", "Nha Trang", "Huế", 
        "Buôn Ma Thuột", "Vinh", "Đà Lạt", "Quy Nhơn",
        "Thái Nguyên", "Vũng Tàu", "Long Xuyên", "Thanh Hóa",
        "Hải Dương", "Nam Định", "Rạch Giá", "Thủ Dầu Một"
    ];
    
    // Danh sách sản phẩm Apple
    const products = [
        { name: "iPhone 15 Pro", storage: ["128GB", "256GB", "512GB", "1TB"], colors: ["Titan Tự Nhiên", "Titan Trắng", "Titan Đen", "Titan Xanh"] },
        { name: "iPhone 15", storage: ["128GB", "256GB", "512GB"], colors: ["Đen", "Xanh Dương", "Xanh Lá", "Hồng", "Vàng"] },
        { name: "iPhone 14 Pro", storage: ["128GB", "256GB", "512GB", "1TB"], colors: ["Đen", "Bạc", "Vàng", "Tím Đậm"] },
        { name: "iPhone 14", storage: ["128GB", "256GB", "512GB"], colors: ["Đen", "Trắng", "Đỏ", "Xanh Dương", "Tím"] },
        { name: "MacBook Air M2", storage: ["256GB", "512GB", "1TB"], colors: ["Bạc", "Xám", "Đen", "Xanh"] },
        { name: "MacBook Pro M3", storage: ["512GB", "1TB", "2TB"], colors: ["Bạc", "Xám Không Gian"] },
        { name: "iPad Pro M2", storage: ["128GB", "256GB", "512GB", "1TB"], colors: ["Bạc", "Xám Không Gian"] },
        { name: "iPad Air", storage: ["64GB", "256GB"], colors: ["Xám Không Gian", "Xanh Dương", "Hồng", "Tím", "Xanh Lá"] },
        { name: "Apple Watch Series 9", storage: ["GPS", "GPS + Cellular"], colors: ["Bạc", "Đen", "Vàng"] },
        { name: "AirPods Pro 2", storage: [""], colors: ["Trắng"] }
    ];
    
    // Thời gian mua hàng
    const timeAgo = [
        "vừa mua", "1 phút trước", "2 phút trước", "5 phút trước", 
        "10 phút trước", "15 phút trước", "20 phút trước", "30 phút trước", 
        "1 giờ trước", "2 giờ trước", "3 giờ trước"
    ];
    
    // Tạo thông báo ngẫu nhiên
    function generateRandomNotification() {
        const randomName = vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomStorage = randomProduct.storage[Math.floor(Math.random() * randomProduct.storage.length)];
        const randomColor = randomProduct.colors[Math.floor(Math.random() * randomProduct.colors.length)];
        const randomTime = timeAgo[Math.floor(Math.random() * timeAgo.length)];
        
        // Thêm đuôi để hiển thị dung lượng và màu nếu có
        let productText = randomProduct.name;
        if (randomStorage !== "") {
            productText += " " + randomStorage;
        }
        if (randomColor !== "") {
            productText += " Màu " + randomColor;
        }
        
        return {
            name: randomName,
            location: randomLocation,
            product: productText,
            time: randomTime
        };
    }
    
    // Tạo HTML cho thông báo
    function createNotificationHtml(notification) {
        return `
            <div class="recent-purchase-notification">
                <div class="notification-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text">
                        <strong>${notification.name}</strong> ở <strong>${notification.location}</strong> 
                        <span class="notification-action">đã mua</span> 
                        <strong>${notification.product}</strong>
                    </p>
                    <p class="notification-time">${notification.time}</p>
                </div>
                <button class="notification-close">×</button>
            </div>
        `;
    }
    
    // Hiển thị thông báo
    function showNotification() {
        // Tạo nội dung thông báo
        const notification = generateRandomNotification();
        const notificationHtml = createNotificationHtml(notification);
        
        // Thêm thông báo vào DOM
        const $notification = $(notificationHtml).appendTo('body');
        
        // Hiệu ứng hiển thị
        $notification.hide().fadeIn(500);
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            $notification.fadeOut(500, function() {
                $(this).remove();
            });
        }, 5000);
        
        // Sự kiện đóng thông báo
        $notification.find('.notification-close').on('click', function() {
            $notification.fadeOut(300, function() {
                $(this).remove();
            });
        });
    }
    
    // Hiển thị thông báo đầu tiên sau 5 giây khi trang tải xong
    setTimeout(showNotification, 5000);
    
    // Hiển thị thông báo tiếp theo sau mỗi 20-60 giây
    function scheduleNextNotification() {
        // Thời gian ngẫu nhiên từ 20-60 giây
        const randomTime = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
        
        setTimeout(() => {
            showNotification();
            scheduleNextNotification(); // Lên lịch cho thông báo tiếp theo
        }, randomTime);
    }
    
    // Bắt đầu lên lịch cho thông báo
    scheduleNextNotification();
    
    // Thêm CSS cho thông báo
    const notificationCss = `
        .recent-purchase-notification {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 320px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 15px;
            display: flex;
            align-items: center;
            z-index: 9999;
            animation: slide-in 0.5s ease;
        }
        
        @keyframes slide-in {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            background-color: #e6f7ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .notification-icon i {
            color: #1890ff;
            font-size: 18px;
        }
        
        .notification-content {
            flex-grow: 1;
        }
        
        .notification-text {
            margin: 0;
            font-size: 13px;
            color: #333;
            line-height: 1.4;
        }
        
        .notification-action {
            color: #52c41a;
            font-weight: 500;
        }
        
        .notification-time {
            margin: 5px 0 0 0;
            font-size: 12px;
            color: #999;
        }
        
        .notification-close {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: none;
            border: none;
            color: #999;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            margin-left: 5px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
            color: #666;
        }
        
        @media (max-width: 576px) {
            .recent-purchase-notification {
                width: calc(100% - 40px);
                max-width: 320px;
            }
        }
    `;
    
    // Thêm CSS vào trang
    $('<style>').prop('type', 'text/css').html(notificationCss).appendTo('head');
    
    // Thêm tùy chọn để tắt thông báo
    if (localStorage.getItem('disableRecentPurchases') === 'true') {
        // Nếu người dùng đã tắt thông báo, không hiển thị nữa
        return;
    }
    
    // Tạo nút thiết lập
    const settingsButton = $(`
        <div class="notification-settings">
            <button class="notification-settings-toggle">
                <i class="fas fa-bell"></i>
            </button>
            <div class="notification-settings-panel" style="display: none;">
                <div class="settings-title">Thông báo mua hàng</div>
                <label class="settings-option">
                    <input type="checkbox" id="toggle-notifications" checked> Hiển thị thông báo
                </label>
                <div class="settings-info">
                    <i class="fas fa-info-circle"></i> Hiển thị hoạt động mua hàng gần đây
                </div>
            </div>
        </div>
    `).appendTo('body');
    
    // CSS cho nút thiết lập
    const settingsCss = `
        .notification-settings {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .notification-settings-toggle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #f0f0f0;
            border: none;
            color: #666;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
        }
        
        .notification-settings-toggle:hover {
            background-color: #e0e0e0;
        }
        
        .notification-settings-panel {
            position: absolute;
            bottom: 50px;
            right: 0;
            width: 250px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 15px;
        }
        
        .settings-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            font-size: 14px;
        }
        
        .settings-option {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
            cursor: pointer;
        }
        
        .settings-option input {
            margin-right: 8px;
        }
        
        .settings-info {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
            display: flex;
            align-items: center;
        }
        
        .settings-info i {
            margin-right: 5px;
        }
    `;
    
    // Thêm CSS cho thiết lập
    $('<style>').prop('type', 'text/css').html(settingsCss).appendTo('head');
    
    // Sự kiện hiển thị/ẩn panel thiết lập
    $('.notification-settings-toggle').on('click', function() {
        $('.notification-settings-panel').fadeToggle(200);
    });
    
    // Đóng panel khi click bên ngoài
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.notification-settings').length) {
            $('.notification-settings-panel').fadeOut(200);
        }
    });
    
    // Sự kiện bật/tắt thông báo
    $('#toggle-notifications').on('change', function() {
        if ($(this).is(':checked')) {
            localStorage.setItem('disableRecentPurchases', 'false');
            showNotification();
            scheduleNextNotification();
        } else {
            localStorage.setItem('disableRecentPurchases', 'true');
            $('.recent-purchase-notification').fadeOut(300, function() {
                $(this).remove();
            });
        }
    });
});