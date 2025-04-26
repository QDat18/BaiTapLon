document.addEventListener('DOMContentLoaded', function () {
    // ===================== NAVBAR =====================
    fetch('components/navbar.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        // Sửa phần kiểm tra đăng nhập
        try {
            const accounts = localStorage.getItem('accounts');
            if (accounts) {
                const parsedAccounts = JSON.parse(accounts);

                // Kiểm tra thêm nếu có dữ liệu hợp lệ
                if (parsedAccounts && parsedAccounts.length > 0 && parsedAccounts[0].username) {
                    $('#registerButton').hide();
                    $('#loginButton').hide();
                    $('#logoutButton').show();
                    $('#navbarUser').show().text(parsedAccounts[0].username);
                } else {
                    // Nếu dữ liệu không hợp lệ thì xóa và hiển thị nút đăng nhập
                    localStorage.removeItem('accounts');
                    showLoginButtons();
                }
            } else {
                showLoginButtons();
            }
        } catch (e) {
            console.error("Lỗi khi kiểm tra đăng nhập:", e);
            showLoginButtons();
        }

        $('#logoutButton').click(function (e) {
            e.preventDefault();
            localStorage.removeItem('accounts');
            alert('Bạn đã đăng xuất!');
            location.reload();
        });
    });

    // Hàm hiển thị nút đăng nhập/đăng ký
    function showLoginButtons() {
        $('#registerButton').show();
        $('#loginButton').show();
        $('#logoutButton').hide();
        $('#navbarUser').hide();
    }

    // ===================== FOOTER =====================
    fetch('components/footer.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // ===================== KHUYẾN MÃI =====================
    fetch('data/promotions.json')
        .then(res => res.json())
        .then(promotions => {
            const container = document.getElementById('promotion-container');
            promotions.forEach(promo => {
                const card = document.createElement('div');
                card.className = 'promotion-card';
                card.innerHTML = `
                    <img src="${promo.image}" alt="${promo.title}" />
                    <h3>${promo.title}</h3>
                    <p>${promo.description}</p>`;
                container.appendChild(card);
            });
        });

    // ===================== TIN TỨC (nếu có) =====================
    fetch('data/news.json')
        .then(res => res.json())
        .then(newsList => {
            const container = document.getElementById('news-container');
            newsList.forEach(news => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <img src="${news.image}" alt="${news.title}" />
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                    <a href="news_detail.html?id=${news.id}">Xem thêm</a>`;
                container.appendChild(card);
            });
        });
});


document.body.addEventListener('click', function(e) {
    if (e.target.closest('.toggle-btn')) {
      const menuRight = e.target.closest('.menu-right');
      if (menuRight) {
        menuRight.classList.add('active');
        document.querySelector('.top-nav')?.classList.add('blur'); // mờ top-nav
      }
    }
  
    if (e.target.closest('.close-btn')) {
      const menuRight = e.target.closest('.menu-right');
      if (menuRight) {
        menuRight.classList.remove('active');
        document.querySelector('.top-nav')?.classList.remove('blur'); // bỏ mờ
      }
    }
  });
  
  // Xử lý overlay và ESC
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('overlay')) {
      document.querySelector('.menu-right')?.classList.remove('active');
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelector('.menu-right')?.classList.remove('active');
    }
  });