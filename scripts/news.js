// Dữ liệu tin tức
let newsData = [];
let filteredNews = [];
let currentPage = 1;
const newsPerPage = 6;

// Màu sắc thương hiệu Anh Em Rọt
const primaryColor = '#0066cc'; // Màu xanh lam đậm
const hoverColor = '#0052a3'; // Màu xanh lam đậm hơn khi hover

// Tải dữ liệu tin tức từ JSON
async function loadNewsData() {
    try {
        const response = await fetch('data/news.json');
        const data = await response.json();
        newsData = [...data];
        
        // Thêm dữ liệu tin tức giả để có đủ mẫu hiển thị
        addMockNews();
        
        // Hiển thị tất cả tin tức
        filteredNews = [...newsData];
        displayNews(currentPage);
        setupPagination();
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu tin tức:', error);
        document.getElementById('news-list').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
            </div>
        `;
    }
}

// Thêm dữ liệu tin tức giả để demo
function addMockNews() {
    const mockNews = [
        {
            id: "news03",
            title: "Samsung ra mắt Galaxy Z Fold 6 tại thị trường Việt Nam",
            description: "Galaxy Z Fold 6 với thiết kế mỏng hơn và bản lề được cải tiến đã chính thức có mặt tại Việt Nam.",
            image: "assets/news/galaxyzfold6.jpg",
            startDate: "15/04/2025",
            details: "Samsung Việt Nam đã chính thức ra mắt Galaxy Z Fold 6 với nhiều cải tiến về thiết kế và hiệu năng...",
            category: "samsung"
        },
        {
            id: "news04",
            title: "Xiaomi giới thiệu dòng sản phẩm mới tại sự kiện Anh Em Rọt",
            description: "Sự kiện ra mắt sản phẩm mới của Xiaomi với nhiều thiết bị thông minh và smartphone cao cấp.",
            image: "assets/news/xiaomievent.jpg",
            startDate: "12/04/2025",
            details: "Xiaomi vừa tổ chức sự kiện giới thiệu dòng sản phẩm mới tại TP.HCM với sự hiện diện của Anh Em Rọt...",
            category: "xiaomi"
        },
        {
            id: "news05",
            title: "Anh Em Rọt khai trương cửa hàng mới tại Hà Nội",
            description: "Cửa hàng Anh Em Rọt thứ 10 đã chính thức khai trương tại Quận Cầu Giấy, Hà Nội.",
            image: "assets/news/store_opening.jpg",
            startDate: "10/04/2025",
            details: "Anh Em Rọt vừa khai trương cửa hàng thứ 10 tại Hà Nội với nhiều chương trình khuyến mãi hấp dẫn...",
            category: "events"
        },
        {
            id: "news06",
            title: "Trải nghiệm sạc nhanh 200W trên smartphone cao cấp",
            description: "Anh Em Rọt đưa ra đánh giá về công nghệ sạc nhanh 200W mới nhất trên các dòng điện thoại cao cấp.",
            image: "assets/news/fastcharging.jpg",
            startDate: "08/04/2025",
            details: "Công nghệ sạc nhanh đang phát triển mạnh mẽ với khả năng sạc đầy pin chỉ trong vòng 10 phút...",
            category: "technology"
        },
        {
            id: "news07",
            title: "Apple phát hành iOS 18 với nhiều tính năng AI mới",
            description: "Bản cập nhật iOS 18 tập trung vào các tính năng trí tuệ nhân tạo và trải nghiệm người dùng.",
            image: "assets/news/ios18.jpg",
            startDate: "05/04/2025",
            details: "Apple vừa phát hành iOS 18 với nhiều tính năng AI mới như trợ lý ảo thông minh hơn, tối ưu pin...",
            category: "apple"
        },
        {
            id: "news08",
            title: "Sự kiện Anh Em Rọt Tech Day 2025 sắp diễn ra",
            description: "Sự kiện công nghệ lớn nhất năm của Anh Em Rọt sẽ diễn ra vào tháng 5 với nhiều hoạt động hấp dẫn.",
            image: "assets/news/techday.jpg",
            startDate: "01/04/2025",
            details: "Anh Em Rọt Tech Day 2025 sẽ diễn ra vào ngày 15/5/2025 tại Trung tâm Hội nghị Quốc gia với sự tham gia của nhiều thương hiệu lớn...",
            category: "events"
        }
    ];
    
    // Thêm danh mục vào tin tức hiện có từ JSON
    if (newsData && newsData.length > 0) {
        newsData[0].category = "apple";
        if (newsData.length > 1) {
            newsData[1].category = "apple";
        }
    }
    
    // Kết hợp dữ liệu từ JSON với dữ liệu giả
    newsData = [...newsData, ...mockNews];
}

// Hiển thị tin tức dựa trên trang hiện tại
function displayNews(page) {
    const start = (page - 1) * newsPerPage;
    const end = start + newsPerPage;
    const paginatedNews = filteredNews.slice(start, end);
    
    const newsListEl = document.getElementById('news-list');
    
    // Hiển thị thông báo nếu không có tin tức
    if (filteredNews.length === 0) {
        document.getElementById('no-results').classList.remove('d-none');
        newsListEl.innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    document.getElementById('no-results').classList.add('d-none');
    
    // Tạo HTML cho các mục tin tức
    let newsHTML = '';
    
    paginatedNews.forEach((item, index) => {
        newsHTML += `
            <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="news-card card h-100" onclick="goToNewsDetail('${item.id}')">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="news-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <div class="news-date">
                            <i class="far fa-calendar-alt"></i>
                            <span>${item.startDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    newsListEl.innerHTML = newsHTML;
}

// Thiết lập phân trang
function setupPagination() {
    const totalPages = Math.ceil(filteredNews.length / newsPerPage);
    const paginationEl = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    paginationEl.innerHTML = paginationHTML;
}

// Đổi trang
function changePage(page) {
    if (page < 1 || page > Math.ceil(filteredNews.length / newsPerPage)) {
        return;
    }
    
    currentPage = page;
    displayNews(currentPage);
    setupPagination();
    
    // Cuộn lên đầu phần tin tức
    document.getElementById('news-list').scrollIntoView({ behavior: 'smooth' });
}

// Lọc tin tức theo danh mục
function filterByCategory(category) {
    // Cập nhật trạng thái active của các nút danh mục
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    document.querySelector(`.category-pill[data-category="${category}"]`).classList.add('active');
    
    // Lọc tin tức
    if (category === 'all') {
        filteredNews = [...newsData];
    } else {
        filteredNews = newsData.filter(item => item.category === category);
    }
    
    // Hiển thị kết quả
    currentPage = 1;
    displayNews(currentPage);
    setupPagination();
}

// Tìm kiếm tin tức
function searchNews() {
    const searchTerm = document.getElementById('news-search').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Nếu không có từ khóa, hiển thị tất cả tin tức theo danh mục đang chọn
        const activeCategory = document.querySelector('.category-pill.active').getAttribute('data-category');
        filterByCategory(activeCategory);
        return;
    }
    
    // Lọc tin tức theo từ khóa
    filteredNews = newsData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
    );
    
    // Hiển thị kết quả
    currentPage = 1;
    displayNews(currentPage);
    setupPagination();
}

// Chuyển đến trang chi tiết tin tức
function goToNewsDetail(id) {
    window.location.href = `news_detail.html?id=${id}`;
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu tin tức
    loadNewsData();
    
    // Thiết lập sự kiện cho nút tìm kiếm
    document.getElementById('search-button').addEventListener('click', searchNews);
    
    // Thiết lập sự kiện tìm kiếm khi nhấn Enter
    document.getElementById('news-search').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchNews();
        }
    });
    
    // Thiết lập sự kiện cho các nút danh mục
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
});