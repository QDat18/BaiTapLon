// Dữ liệu tin tức
let newsData = [];

// Tải dữ liệu tin tức từ JSON
async function loadNewsData() {
    try {
        const response = await fetch('data/news.json');
        const data = await response.json();
        newsData = [...data];
        
        // Thêm dữ liệu tin tức giả
        addMockNews();
        
        // Hiển thị chi tiết tin tức
        displayNewsDetail();
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu tin tức:', error);
        document.getElementById('news-detail').innerHTML = `
            <div class="text-center">
                <p class="text-danger">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
                <a href="news.html" class="btn btn-primary">Quay lại trang tin tức</a>
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
            details: `<p>Samsung Việt Nam đã chính thức ra mắt Galaxy Z Fold 6 với nhiều cải tiến về thiết kế và hiệu năng. Sản phẩm được giới thiệu tại sự kiện Galaxy Unpacked diễn ra tại TP.HCM vào ngày 15/04/2025.</p>
                     <p>Galaxy Z Fold 6 có thiết kế mỏng hơn 12% so với thế hệ trước, với độ dày chỉ 5.6mm khi mở ra. Bản lề mới được cải tiến với cơ chế "Flex Hinge" giúp thiết bị có thể đứng vững ở nhiều góc độ khác nhau, đồng thời giảm thiểu nếp gấp trên màn hình.</p>
                     <p>Về cấu hình, Galaxy Z Fold 6 được trang bị chip Snapdragon 8 Gen 3 for Galaxy, RAM 16GB và bộ nhớ trong lên đến 1TB. Camera chính 200MP với công nghệ chụp ảnh mới, camera góc siêu rộng 50MP và camera tele 50MP với zoom quang học 3x.</p>
                     <p>Galaxy Z Fold 6 có giá khởi điểm từ 45.990.000 đồng tại Việt Nam. Khách hàng đặt trước tại Anh Em Rọt sẽ nhận được nhiều ưu đãi hấp dẫn như: giảm giá trực tiếp 5 triệu đồng, trả góp 0%, bảo hành màn hình 2 năm và nhiều quà tặng khác.</p>`,
            category: "samsung"
        },
        {
            id: "news04",
            title: "Xiaomi giới thiệu dòng sản phẩm mới tại sự kiện Anh Em Rọt",
            description: "Sự kiện ra mắt sản phẩm mới của Xiaomi với nhiều thiết bị thông minh và smartphone cao cấp.",
            image: "assets/news/xiaomievent.jpg",
            startDate: "12/04/2025",
            details: `<p>Xiaomi vừa tổ chức sự kiện giới thiệu dòng sản phẩm mới tại TP.HCM với sự hiện diện của Anh Em Rọt. Sự kiện đã thu hút hơn 500 khách mời tham dự.</p>
                     <p>Trong sự kiện, Xiaomi đã giới thiệu loạt sản phẩm mới bao gồm: Xiaomi 15, Xiaomi 15 Pro, Xiaomi Pad 6 Pro, và loạt thiết bị thông minh cho ngôi nhà thông minh.</p>
                     <p>Xiaomi 15 và 15 Pro được trang bị chip Snapdragon 8 Gen 3, màn hình AMOLED 144Hz với độ sáng lên đến 3000 nits, và hệ thống camera hợp tác với Leica.</p>
                     <p>Anh Em Rọt là đối tác bán lẻ chính thức của Xiaomi tại Việt Nam và sẽ bắt đầu nhận đặt trước các sản phẩm mới từ ngày 20/04/2025. Khách hàng đặt trước sẽ nhận được ưu đãi giảm giá lên đến 3 triệu đồng cùng nhiều quà tặng hấp dẫn.</p>`,
            category: "xiaomi"
        },
        {
            id: "news05",
            title: "Anh Em Rọt khai trương cửa hàng mới tại Hà Nội",
            description: "Cửa hàng Anh Em Rọt thứ 10 đã chính thức khai trương tại Quận Cầu Giấy, Hà Nội.",
            image: "assets/news/store_opening.jpg",
            startDate: "10/04/2025",
            details: `<p>Anh Em Rọt vừa khai trương cửa hàng thứ 10 tại Hà Nội, đánh dấu cột mốc quan trọng trong chiến lược mở rộng hệ thống bán lẻ trên toàn quốc.</p>
                     <p>Cửa hàng mới tọa lạc tại số 123 Xuân Thủy, Quận Cầu Giấy, Hà Nội với diện tích hơn 300m2, được thiết kế theo concept hiện đại với không gian trải nghiệm rộng rãi cho khách hàng.</p>
                     <p>Tại đây, khách hàng có thể trải nghiệm và mua sắm các sản phẩm công nghệ mới nhất từ các thương hiệu như Apple, Samsung, Xiaomi, OPPO và nhiều thương hiệu nổi tiếng khác.</p>
                     <p>Nhân dịp khai trương, Anh Em Rọt đã tổ chức nhiều chương trình khuyến mãi hấp dẫn như giảm giá lên đến 50% cho một số sản phẩm, tặng phiếu mua hàng và phụ kiện cho 100 khách hàng đầu tiên.</p>
                     <p>Buổi lễ khai trương đã thu hút hơn 500 khách hàng tham dự với nhiều hoạt động thú vị như trải nghiệm sản phẩm, mini game với nhiều giải thưởng hấp dẫn.</p>`,
            category: "events"
        },
        {
            id: "news06",
            title: "Trải nghiệm sạc nhanh 200W trên smartphone cao cấp",
            description: "Anh Em Rọt đưa ra đánh giá về công nghệ sạc nhanh 200W mới nhất trên các dòng điện thoại cao cấp.",
            image: "assets/news/fastcharging.jpg",
            startDate: "08/04/2025",
            details: `<p>Công nghệ sạc nhanh đang phát triển mạnh mẽ với khả năng sạc đầy pin chỉ trong vòng 10 phút. Anh Em Rọt vừa thực hiện bài đánh giá chi tiết về công nghệ sạc nhanh 200W mới nhất trên các dòng smartphone cao cấp.</p>
                     <p>Trong bài đánh giá, chúng tôi đã thử nghiệm công nghệ sạc nhanh 200W trên các mẫu điện thoại cao cấp như Xiaomi 15 Ultra, OPPO Find X8 Pro và Realme GT Neo 6. Kết quả cho thấy, Xiaomi 15 Ultra với pin 5000mAh có thể sạc từ 0% lên 100% chỉ trong 9 phút 12 giây.</p>
                     <p>Tuy nhiên, công nghệ sạc nhanh cũng đặt ra những lo ngại về độ bền của pin. Sau 6 tháng sử dụng, dung lượng pin trên các thiết bị sử dụng sạc nhanh 200W giảm khoảng 8-10%, cao hơn so với mức 5-7% của các thiết bị sử dụng sạc chậm hơn.</p>
                     <p>Anh Em Rọt khuyến nghị người dùng nên cân nhắc giữa sự tiện lợi của sạc nhanh và độ bền của pin. Với người dùng thường xuyên di chuyển, công nghệ sạc nhanh là một lựa chọn tuyệt vời. Tuy nhiên, để kéo dài tuổi thọ pin, người dùng nên hạn chế sạc nhanh thường xuyên và nên sạc ở mức 20-80% thay vì 0-100%.</p>`,
            category: "technology"
        },
        {
            id: "news07",
            title: "Apple phát hành iOS 18 với nhiều tính năng AI mới",
            description: "Bản cập nhật iOS 18 tập trung vào các tính năng trí tuệ nhân tạo và trải nghiệm người dùng.",
            image: "assets/news/ios18.jpg",
            startDate: "05/04/2025",
            details: `<p>Apple vừa phát hành iOS 18 với nhiều tính năng AI mới như trợ lý ảo thông minh hơn, tối ưu pin và nhiều cải tiến về giao diện người dùng.</p>
                     <p>Tính năng nổi bật nhất của iOS 18 là "Apple Intelligence" - hệ thống AI tích hợp sâu vào hệ điều hành, cho phép Siri thông minh hơn với khả năng hiểu ngữ cảnh và thực hiện các tác vụ phức tạp hơn.</p>
                     <p>iOS 18 cũng mang đến giao diện người dùng mới với khả năng tùy biến cao hơn, cho phép người dùng thay đổi vị trí các biểu tượng ứng dụng trên màn hình chính, thêm widget tùy chỉnh và nhiều tùy chọn màu sắc hơn.</p>
                     <p>Về hiệu suất, iOS 18 được tối ưu để tiết kiệm pin hơn với chế độ "Ultra Power Saving" mới, giúp kéo dài thời lượng pin lên đến 40% trong trường hợp khẩn cấp.</p>
                     <p>iOS 18 hiện đã có sẵn cho tất cả người dùng iPhone 12 trở lên. Người dùng có thể cập nhật thông qua Settings > General > Software Update. Anh Em Rọt khuyến nghị người dùng nên sao lưu dữ liệu trước khi cập nhật để tránh mất dữ liệu.</p>`,
            category: "apple"
        },
        {
            id: "news08",
            title: "Sự kiện Anh Em Rọt Tech Day 2025 sắp diễn ra",
            description: "Sự kiện công nghệ lớn nhất năm của Anh Em Rọt sẽ diễn ra vào tháng 5 với nhiều hoạt động hấp dẫn.",
            image: "assets/news/techday.jpg",
            startDate: "01/04/2025",
            details: `<p>Anh Em Rọt Tech Day 2025 sẽ diễn ra vào ngày 15/5/2025 tại Trung tâm Hội nghị Quốc gia với sự tham gia của nhiều thương hiệu lớn trong lĩnh vực công nghệ.</p>
                     <p>Sự kiện năm nay sẽ có quy mô lớn hơn với hơn 50 gian hàng trải nghiệm từ các thương hiệu như Apple, Samsung, Xiaomi, OPPO, Huawei và nhiều thương hiệu khác. Khách tham dự có thể trải nghiệm những sản phẩm mới nhất, tham gia các workshop công nghệ và có cơ hội mua sắm với nhiều ưu đãi độc quyền.</p>
                     <p>Điểm nhấn của sự kiện là khu vực "Future Tech" với các công nghệ tiên tiến như AR/VR, AI, Smart Home và nhiều công nghệ đột phá khác. Khách tham dự có thể trải nghiệm và tìm hiểu về những xu hướng công nghệ mới nhất.</p>
                     <p>Anh Em Rọt Tech Day 2025 dự kiến sẽ đón tiếp hơn 10.000 khách tham dự trong 3 ngày diễn ra sự kiện. Vé tham dự sự kiện sẽ được mở bán từ ngày 20/4/2025 với giá 100.000 đồng/người. Khách hàng thân thiết của Anh Em Rọt sẽ được tặng vé miễn phí.</p>`,
            category: "events"
        }
    ];
    
    // Thêm chi tiết tin tức cho dữ liệu JSON ban đầu
    if (newsData && newsData.length > 0) {
        // Thêm danh mục vào tin tức hiện có từ JSON
        newsData[0].category = "apple";
        newsData[0].details = `<p>iPhone 15 đã chính thức có mặt tại các cửa hàng Anh Em Rọt trên toàn quốc. Sự kiện ra mắt diễn ra đồng thời tại 10 cửa hàng với sự tham gia của hàng nghìn khách hàng.</p>
                              <p>iPhone 15 năm nay có nhiều cải tiến đáng chú ý về camera với cảm biến chính 48MP, khả năng zoom quang học 5x trên bản Pro Max, và chế độ chụp ảnh chân dung thế hệ mới với khả năng xóa phông tự nhiên hơn.</p>
                              <p>Về hiệu năng, iPhone 15 được trang bị chip A17 Pro mới nhất của Apple, mang đến hiệu suất vượt trội so với thế hệ trước, đặc biệt trong các tác vụ đòi hỏi xử lý đồ họa như chơi game hay chỉnh sửa video.</p>
                              <p>Pin là một trong những điểm cải tiến lớn nhất trên iPhone 15 với thời lượng sử dụng tăng lên 20% so với iPhone 14, đồng thời hỗ trợ sạc nhanh 45W giúp sạc từ 0% lên 50% chỉ trong 30 phút.</p>
                              <p>Anh Em Rọt đang có nhiều ưu đãi hấp dẫn cho khách hàng đặt mua iPhone 15 như: giảm giá trực tiếp 3 triệu đồng, trả góp 0%, tặng AppleCare+ và nhiều phụ kiện chính hãng.</p>`;
        
        if (newsData.length > 1) {
            newsData[1].category = "apple";
            newsData[1].details = `<p>Apple phát hành bản cập nhật phần mềm mới giúp nâng cấp tính năng thể thao và theo dõi sức khỏe cho Apple Watch Ultra. Bản cập nhật này mang đến nhiều tính năng mới được thiết kế riêng cho người dùng ưa vận động và các vận động viên chuyên nghiệp.</p>
                                  <p>Với bản cập nhật mới, Apple Watch Ultra có thể theo dõi nhịp tim chính xác hơn với công nghệ cảm biến thế hệ mới. GPS cũng được cải tiến để hoạt động tốt hơn trong các môi trường khó khăn như trong rừng rậm hay giữa các tòa nhà cao tầng.</p>
                                  <p>Tính năng mới đáng chú ý là "Ultra Training" - một chế độ tập luyện nâng cao cho phép người dùng tạo các bài tập cá nhân hóa dựa trên dữ liệu sức khỏe và mục tiêu tập luyện. Tính năng này đi kèm với các chỉ số phân tích chuyên sâu giúp người dùng tối ưu hóa hiệu quả tập luyện.</p>
                                  <p>Anh Em Rọt hiện đang có chương trình hỗ trợ khách hàng cập nhật miễn phí và hướng dẫn sử dụng các tính năng mới trên Apple Watch Ultra tại tất cả các cửa hàng trên toàn quốc.</p>`;
        }
    }
    
    // Kết hợp dữ liệu từ JSON với dữ liệu giả
    newsData = [...newsData, ...mockNews];
}

// Lấy tham số từ URL
function getParameterFromUrl(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

// Hiển thị chi tiết tin tức
function displayNewsDetail() {
    const newsId = getParameterFromUrl('id');
    
    if (!newsId) {
        // Nếu không có ID, hiển thị thông báo lỗi
        document.getElementById('news-detail').innerHTML = `
            <div class="text-center">
                <p class="text-danger">Không tìm thấy tin tức.</p>
                <a href="news.html" class="btn btn-primary">Quay lại trang tin tức</a>
            </div>
        `;
        return;
    }
    
    // Tìm tin tức theo ID
    const newsItem = newsData.find(item => item.id === newsId);
    
    if (!newsItem) {
        // Nếu không tìm thấy tin tức, hiển thị thông báo lỗi
        document.getElementById('news-detail').innerHTML = `
            <div class="text-center">
                <p class="text-danger">Không tìm thấy tin tức với ID: ${newsId}</p>
                <a href="news.html" class="btn btn-primary">Quay lại trang tin tức</a>
            </div>
        `;
        return;
    }
    
    // Cập nhật tiêu đề trang
    document.title = `${newsItem.title} | Anh Em Rọt`;
    
    // Hiển thị chi tiết tin tức
    document.getElementById('news-detail').innerHTML = `
        <div class="row">
            <div class="col-md-10 mx-auto">
                <a href="news.html" class="btn btn-outline-primary mb-4">
                    <i class="fas fa-arrow-left"></i> Quay lại tin tức
                </a>
                
                <h1 class="mb-4">${newsItem.title}</h1>
                
                <div class="d-flex align-items-center mb-4">
                    <span class="text-muted me-3">
                        <i class="far fa-calendar-alt me-1"></i> ${newsItem.startDate}
                    </span>
                    <span class="badge bg-primary">${newsItem.category || 'Tin tức'}</span>
                </div>
                
                <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image mb-4">
                
                <div class="news-content mb-5">
                    ${newsItem.details}
                </div>
                
                <hr class="my-5">
                
                <div class="row">
                    <div class="col-md-6">
                        <h4>Chia sẻ</h4>
                        <div class="d-flex mt-2">
                            <a href="#" class="me-2 btn btn-outline-primary btn-sm">
                                <i class="fab fa-facebook-f"></i> Facebook
                            </a>
                            <a href="#" class="me-2 btn btn-outline-info btn-sm">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                            <a href="#" class="btn btn-outline-success btn-sm">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6 text-md-end mt-4 mt-md-0">
                        <a href="news.html" class="btn btn-primary">
                            Xem thêm tin tức <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
                
                <hr class="my-5">
                
                <h4 class="mb-4">Tin tức liên quan</h4>
                <div class="row" id="related-news">
                    <!-- Tin tức liên quan sẽ được thêm vào đây bằng JavaScript -->
                </div>
            </div>
        </div>
    `;
    
    // Hiển thị tin tức liên quan
    displayRelatedNews(newsItem);
}

// Hiển thị tin tức liên quan
function displayRelatedNews(currentNews) {
    // Lọc tin tức cùng danh mục, loại bỏ tin tức hiện tại
    let relatedNews = newsData.filter(item => 
        item.category === currentNews.category && 
        item.id !== currentNews.id
    );
    
    // Nếu không đủ 3 tin tức cùng danh mục, bổ sung thêm tin tức khác
    if (relatedNews.length < 3) {
        const otherNews = newsData.filter(item => 
            item.category !== currentNews.category && 
            item.id !== currentNews.id
        );
        
        // Trộn ngẫu nhiên và lấy đủ số lượng cần thiết
        otherNews.sort(() => 0.5 - Math.random());
        relatedNews = [...relatedNews, ...otherNews.slice(0, 3 - relatedNews.length)];
    }
    
    // Giới hạn chỉ hiển thị 3 tin tức liên quan
    relatedNews = relatedNews.slice(0, 3);
    
    // Tạo HTML cho tin tức liên quan
    let relatedNewsHTML = '';
    
    relatedNews.forEach(item => {
        relatedNewsHTML += `
            <div class="col-md-4 mb-4">
                <div class="card news-card h-100" onclick="location.href='news_detail.html?id=${item.id}'">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}" style="height: 180px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="news-title">${item.title}</h5>
                        <div class="news-date mt-2">
                            <i class="far fa-calendar-alt"></i>
                            <span>${item.startDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('related-news').innerHTML = relatedNewsHTML;
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu tin tức
    loadNewsData();
});