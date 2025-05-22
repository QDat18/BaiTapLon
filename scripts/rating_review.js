/**
 * Rating & Review System - Anh Em Rọt Store
 * Handles product ratings and reviews functionality
 */

const RatingReview = {
  // Initialize rating and review system
  init: function() {
    // Check if we're on a product detail page
    if (!document.querySelector('.product-detail-container')) return;
    
    // Create and append reviews tab
    this.createReviewsTab();
    
    // Load reviews for the current product
    this.loadProductReviews();
    
    // Setup review form
    this.setupReviewForm();
    
    // Add rating summary to product
    this.addRatingSummary();
  },
  
  // Create reviews tab
  createReviewsTab: function() {
    const productTabs = document.getElementById('productTabs');
    const productTabsContent = document.getElementById('productTabsContent');
    
    if (!productTabs || !productTabsContent) return;
    
    // Add reviews tab button
    const reviewsTabButton = document.createElement('li');
    reviewsTabButton.className = 'nav-item';
    reviewsTabButton.setAttribute('role', 'presentation');
    reviewsTabButton.innerHTML = `
      <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
        <i class="fas fa-star me-2"></i>Đánh giá
      </button>
    `;
    
    productTabs.appendChild(reviewsTabButton);
    
    // Add reviews tab content
    const reviewsTabContent = document.createElement('div');
    reviewsTabContent.className = 'tab-pane fade';
    reviewsTabContent.id = 'reviews';
    reviewsTabContent.setAttribute('role', 'tabpanel');
    reviewsTabContent.innerHTML = `
      <div class="reviews-container">
        <div class="row">
          <div class="col-md-4">
            <div class="reviews-summary" id="reviewsSummary">
              <h4 class="summary-rating">4.5</h4>
              <div class="summary-stars">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
              </div>
              <div class="summary-count">Dựa trên 128 đánh giá</div>
              
              <div class="rating-bars mt-4">
                <div class="rating-bar-item">
                  <div class="rating-label">5 <i class="fas fa-star"></i></div>
                  <div class="rating-bar">
                    <div class="rating-bar-fill" style="width: 75%"></div>
                  </div>
                  <div class="rating-count">96</div>
                </div>
                <div class="rating-bar-item">
                  <div class="rating-label">4 <i class="fas fa-star"></i></div>
                  <div class="rating-bar">
                    <div class="rating-bar-fill" style="width: 15%"></div>
                  </div>
                  <div class="rating-count">19</div>
                </div>
                <div class="rating-bar-item">
                  <div class="rating-label">3 <i class="fas fa-star"></i></div>
                  <div class="rating-bar">
                    <div class="rating-bar-fill" style="width: 7%"></div>
                  </div>
                  <div class="rating-count">9</div>
                </div>
                <div class="rating-bar-item">
                  <div class="rating-label">2 <i class="fas fa-star"></i></div>
                  <div class="rating-bar">
                    <div class="rating-bar-fill" style="width: 2%"></div>
                  </div>
                  <div class="rating-count">3</div>
                </div>
                <div class="rating-bar-item">
                  <div class="rating-label">1 <i class="fas fa-star"></i></div>
                  <div class="rating-bar">
                    <div class="rating-bar-fill" style="width: 1%"></div>
                  </div>
                  <div class="rating-count">1</div>
                </div>
              </div>
              
              <button class="btn btn-primary mt-4" id="writeReviewBtn">
                <i class="fas fa-pencil-alt me-2"></i>Viết đánh giá
              </button>
            </div>
          </div>
          <div class="col-md-8">
            <div class="reviews-filter">
              <div class="filter-header">
                <h5 class="filter-title">128 đánh giá</h5>
                <div class="filter-actions">
                  <div class="filter-dropdown">
                    <select class="form-select form-select-sm" id="reviewsSort">
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="highest">Điểm cao nhất</option>
                      <option value="lowest">Điểm thấp nhất</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="filter-tags" id="filterTags">
                <button class="filter-tag active" data-filter="all">Tất cả</button>
                <button class="filter-tag" data-filter="5">5 sao</button>
                <button class="filter-tag" data-filter="4">4 sao</button>
                <button class="filter-tag" data-filter="3">3 sao</button>
                <button class="filter-tag" data-filter="2">2 sao</button>
                <button class="filter-tag" data-filter="1">1 sao</button>
                <button class="filter-tag" data-filter="has_photo">Có hình ảnh</button>
              </div>
            </div>
            
            <div class="reviews-list" id="reviewsList">
              <!-- Reviews will be loaded here -->
              <div class="text-center py-5 reviews-loading">
                <div class="spinner-border text-primary mb-3" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p>Đang tải đánh giá...</p>
              </div>
            </div>
            
            <div class="reviews-pagination" id="reviewsPagination">
              <!-- Pagination will be added here -->
            </div>
          </div>
        </div>
      </div>
      
      <!-- Review Form Modal -->
      <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Đánh giá sản phẩm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="reviewForm">
                <div class="mb-3">
                  <label class="form-label d-block">Đánh giá của bạn</label>
                  <div class="rating-input">
                    <i class="far fa-star" data-rating="1"></i>
                    <i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i>
                    <i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                  </div>
                  <input type="hidden" name="rating" id="ratingInput" value="0">
                </div>
                <div class="mb-3">
                  <label for="reviewTitle" class="form-label">Tiêu đề</label>
                  <input type="text" class="form-control" id="reviewTitle" name="title" placeholder="Tiêu đề đánh giá của bạn" required>
                </div>
                <div class="mb-3">
                  <label for="reviewContent" class="form-label">Nội dung đánh giá</label>
                  <textarea class="form-control" id="reviewContent" name="content" rows="4" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm" required></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tải lên hình ảnh (không bắt buộc)</label>
                  <div class="review-photos-container">
                    <div class="review-photo-upload">
                      <input type="file" id="reviewPhotos" name="photos" accept="image/*" multiple class="photo-input">
                      <div class="upload-placeholder">
                        <i class="fas fa-camera"></i>
                        <span>Thêm ảnh</span>
                      </div>
                    </div>
                    <div class="review-photos-preview" id="photosPreview"></div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="reviewName" class="form-label">Tên của bạn</label>
                  <input type="text" class="form-control" id="reviewName" name="name" placeholder="Tên người đánh giá" required>
                </div>
                <div class="mb-3">
                  <label for="reviewEmail" class="form-label">Email</label>
                  <input type="email" class="form-control" id="reviewEmail" name="email" placeholder="Email của bạn" required>
                  <div class="form-text">Email của bạn sẽ không được hiển thị công khai</div>
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="saveReviewInfo" name="saveInfo">
                  <label class="form-check-label" for="saveReviewInfo">
                    Lưu thông tin cho lần đánh giá sau
                  </label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" class="btn btn-primary" id="submitReviewBtn">Gửi đánh giá</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    productTabsContent.appendChild(reviewsTabContent);
  },
  
  // Load product reviews
  loadProductReviews: function() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = decodeURIComponent(urlParams.get('product') || '');
    
    // Normally, you would fetch reviews from a backend API here
    // For demo purposes, we'll create some sample reviews
    setTimeout(() => {
      reviewsList.innerHTML = ''; // Clear loading indicator
      
      // Sample reviews
      const reviews = this.getSampleReviews(productName);
      
      if (reviews.length === 0) {
        reviewsList.innerHTML = `
          <div class="no-reviews">
            <i class="far fa-star fa-3x text-muted mb-3"></i>
            <h5>Chưa có đánh giá</h5>
            <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            <button class="btn btn-primary" id="noReviewsWriteBtn">
              <i class="fas fa-pencil-alt me-2"></i>Viết đánh giá
            </button>
          </div>
        `;
        
        document.getElementById('noReviewsWriteBtn')?.addEventListener('click', () => {
          this.openReviewForm();
        });
      } else {
        reviews.forEach(review => {
          const reviewElement = this.createReviewElement(review);
          reviewsList.appendChild(reviewElement);
        });
        
        // Add pagination if needed
        if (reviews.length >= 5) {
          this.setupPagination(reviews.length);
        }
      }
      
      // Set up filter functionality
      this.setupFilters();
    }, 1500); // Simulate loading delay
  },
  
  // Get sample reviews
  getSampleReviews: function(productName) {
    const reviews = [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        date: '2025-02-15',
        rating: 5,
        title: 'Sản phẩm tuyệt vời',
        content: 'iPhone này đúng là một sản phẩm tuyệt vời. Tôi đã sử dụng được 2 tuần và rất hài lòng với hiệu năng. Camera chụp ảnh rất đẹp, pin dùng được cả ngày.',
        helpful: 24,
        verified: true,
        photos: [
          'https://picsum.photos/id/1/300/200',
          'https://picsum.photos/id/20/300/200'
        ]
      },
      {
        id: 2,
        name: 'Trần Thị B',
        date: '2025-02-10',
        rating: 4,
        title: 'Hài lòng với sản phẩm',
        content: 'Thiết kế đẹp, cầm vừa tay. Hiệu năng mạnh mẽ, chơi game không bị giật lag. Camera chụp ảnh rất tốt. Tuy nhiên pin hơi tụt nhanh khi chơi game nhiều.',
        helpful: 12,
        verified: true,
        photos: []
      },
      {
        id: 3,
        name: 'Phạm Văn C',
        date: '2025-02-05',
        rating: 5,
        title: 'Xứng đáng với giá tiền',
        content: 'Sau một thời gian dài sử dụng Android, tôi đã quyết định chuyển sang iPhone và không hối hận chút nào. Sản phẩm hoạt động mượt mà, camera chụp ảnh rất đẹp và chi tiết.',
        helpful: 8,
        verified: true,
        photos: [
          'https://picsum.photos/id/35/300/200'
        ]
      },
      {
        id: 4,
        name: 'Hoàng Thị D',
        date: '2025-01-30',
        rating: 3,
        title: 'Sản phẩm tạm ổn',
        content: 'Sản phẩm tạm ổn với mức giá này. Tuy nhiên thời lượng pin không được như kỳ vọng, mong Apple cải thiện ở các phiên bản sau.',
        helpful: 5,
        verified: false,
        photos: []
      },
      {
        id: 5,
        name: 'Lê Văn E',
        date: '2025-01-25',
        rating: 5,
        title: 'Nâng cấp đáng giá',
        content: 'Tôi đã nâng cấp từ iPhone cũ lên phiên bản này và thấy rất đáng tiền. Cải thiện đáng kể về hiệu năng và thời lượng pin. Camera chụp ảnh rất tốt trong điều kiện thiếu sáng.',
        helpful: 15,
        verified: true,
        photos: [
          'https://picsum.photos/id/42/300/200',
          'https://picsum.photos/id/48/300/200'
        ]
      }
    ];
    
    // Add product name to review titles
    return reviews.map(review => ({
      ...review,
      title: review.title + (review.title.includes(productName) ? '' : ` - ${productName}`)
    }));
  },
  
  // Create review element
  createReviewElement: function(review) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.setAttribute('data-rating', review.rating);
    reviewElement.setAttribute('data-has-photo', review.photos.length > 0 ? 'true' : 'false');
    
    // Format date
    const reviewDate = new Date(review.date);
    const formattedDate = reviewDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    reviewElement.innerHTML = `
      <div class="review-header">
        <div class="review-rating">
          ${this.generateStarRating(review.rating)}
        </div>
        <div class="review-verified ${review.verified ? '' : 'd-none'}">
          <i class="fas fa-check-circle"></i> Đã mua hàng
        </div>
      </div>
      <h5 class="review-title">${review.title}</h5>
      <div class="review-meta">
        <span class="review-author">${review.name}</span>
        <span class="review-date">${formattedDate}</span>
      </div>
      <div class="review-content">${review.content}</div>
      ${review.photos.length > 0 ? `
        <div class="review-photos">
          ${review.photos.map(photo => `
            <div class="review-photo">
              <img src="${photo}" alt="Review Photo" class="review-photo-img">
            </div>
          `).join('')}
        </div>
      ` : ''}
      <div class="review-actions">
        <button class="btn btn-sm btn-light review-helpful-btn" data-review-id="${review.id}">
          <i class="far fa-thumbs-up me-1"></i> Hữu ích (${review.helpful})
        </button>
        <button class="btn btn-sm btn-light review-report-btn" data-review-id="${review.id}">
          <i class="far fa-flag me-1"></i> Báo cáo
        </button>
      </div>
    `;
    
    // Add event listeners
    const helpfulBtn = reviewElement.querySelector('.review-helpful-btn');
    helpfulBtn?.addEventListener('click', () => {
      this.markReviewHelpful(review.id, helpfulBtn);
    });
    
    const reportBtn = reviewElement.querySelector('.review-report-btn');
    reportBtn?.addEventListener('click', () => {
      this.reportReview(review.id);
    });
    
    const reviewPhotos = reviewElement.querySelectorAll('.review-photo-img');
    reviewPhotos.forEach(photo => {
      photo.addEventListener('click', () => {
        this.showReviewPhotoModal(photo.src);
      });
    });
    
    return reviewElement;
  },
  
  // Generate star rating HTML
  generateStarRating: function(rating) {
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHTML += '<i class="fas fa-star"></i>';
      } else if (i - 0.5 <= rating) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHTML += '<i class="far fa-star"></i>';
      }
    }
    
    return starsHTML;
  },
  
  // Setup pagination
  setupPagination: function(totalReviews) {
    const paginationContainer = document.getElementById('reviewsPagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalReviews / 5);
    
    paginationContainer.innerHTML = `
      <nav aria-label="Phân trang đánh giá">
        <ul class="pagination">
          <li class="page-item disabled">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          ${Array.from({ length: totalPages }, (_, i) => `
            <li class="page-item ${i === 0 ? 'active' : ''}">
              <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
            </li>
          `).join('')}
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
    
    // Add event listeners to pagination
    const pageLinks = paginationContainer.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const page = link.getAttribute('data-page');
        if (page) {
          this.loadReviewPage(parseInt(page));
        } else if (link.getAttribute('aria-label') === 'Previous') {
          // Handle previous page
          const activePage = parseInt(paginationContainer.querySelector('.page-item.active .page-link').getAttribute('data-page'));
          if (activePage > 1) {
            this.loadReviewPage(activePage - 1);
          }
        } else if (link.getAttribute('aria-label') === 'Next') {
          // Handle next page
          const activePage = parseInt(paginationContainer.querySelector('.page-item.active .page-link').getAttribute('data-page'));
          if (activePage < totalPages) {
            this.loadReviewPage(activePage + 1);
          }
        }
      });
    });
  },
  
  // Load review page
  loadReviewPage: function(page) {
    // In a real implementation, this would fetch the specific page of reviews
    // For demo, just update the UI
    
    const paginationContainer = document.getElementById('reviewsPagination');
    if (!paginationContainer) return;
    
    // Update active page
    const pageItems = paginationContainer.querySelectorAll('.page-item');
    pageItems.forEach(item => {
      const link = item.querySelector('.page-link');
      if (link && link.getAttribute('data-page') === page.toString()) {
        item.classList.add('active');
      } else if (!link || link.getAttribute('data-page')) {
        item.classList.remove('active');
      }
    });
    
    // Update prev/next buttons
    const prevButton = paginationContainer.querySelector('.page-item:first-child');
    const nextButton = paginationContainer.querySelector('.page-item:last-child');
    
    if (page === 1) {
      prevButton.classList.add('disabled');
    } else {
      prevButton.classList.remove('disabled');
    }
    
    const totalPages = pageItems.length - 2; // Subtract prev and next buttons
    if (page === totalPages) {
      nextButton.classList.add('disabled');
    } else {
      nextButton.classList.remove('disabled');
    }
    
    // Scroll to top of reviews
    document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
  },
  
  // Setup review filters
  setupFilters: function() {
    const filterTags = document.querySelectorAll('#filterTags .filter-tag');
    if (!filterTags.length) return;
    
    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        // Update active tag
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        // Filter reviews
        const filter = tag.getAttribute('data-filter');
        this.filterReviews(filter);
      });
    });
    
    // Setup sort dropdown
    const sortSelect = document.getElementById('reviewsSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.sortReviews(sortSelect.value);
      });
    }
  },
  
  // Filter reviews
  filterReviews: function(filter) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    const reviews = reviewsList.querySelectorAll('.review-item');
    
    reviews.forEach(review => {
      if (filter === 'all') {
        review.style.display = 'block';
      } else if (filter === 'has_photo') {
        if (review.getAttribute('data-has-photo') === 'true') {
          review.style.display = 'block';
        } else {
          review.style.display = 'none';
        }
      } else {
        // Filter by star rating
        const rating = review.getAttribute('data-rating');
        if (rating === filter) {
          review.style.display = 'block';
        } else {
          review.style.display = 'none';
        }
      }
    });
    
    // Update filter title
    const filterTitle = document.querySelector('.filter-title');
    if (filterTitle) {
      const visibleReviews = reviewsList.querySelectorAll('.review-item[style="display: block"]').length;
      filterTitle.textContent = `${visibleReviews} đánh giá`;
    }
  },
  
  // Sort reviews
  sortReviews: function(sortBy) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    const reviews = Array.from(reviewsList.querySelectorAll('.review-item'));
    
    // Sort reviews based on criteria
    reviews.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.querySelector('.review-date').textContent);
        const dateB = new Date(b.querySelector('.review-date').textContent);
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        const dateA = new Date(a.querySelector('.review-date').textContent);
        const dateB = new Date(b.querySelector('.review-date').textContent);
        return dateA - dateB;
      } else if (sortBy === 'highest') {
        const ratingA = parseInt(a.getAttribute('data-rating'));
        const ratingB = parseInt(b.getAttribute('data-rating'));
        return ratingB - ratingA;
      } else if (sortBy === 'lowest') {
        const ratingA = parseInt(a.getAttribute('data-rating'));
        const ratingB = parseInt(b.getAttribute('data-rating'));
        return ratingA - ratingB;
      }
      return 0;
    });
    
    // Re-append sorted reviews
    reviews.forEach(review => {
      reviewsList.appendChild(review);
    });
  },
  
  // Mark review as helpful
  markReviewHelpful: function(reviewId, button) {
    // In a real implementation, this would send an API request
    // For demo, just update the UI
    
    // Check if already marked
    if (button.classList.contains('active')) return;
    
    // Mark as helpful
    button.classList.add('active');
    button.innerHTML = `<i class="fas fa-thumbs-up me-1"></i> Hữu ích (${parseInt(button.textContent.match(/\d+/)[0]) + 1})`;
    
    // Save to localStorage
    const helpfulReviews = JSON.parse(localStorage.getItem('helpfulReviews') || '[]');
    helpfulReviews.push(reviewId);
    localStorage.setItem('helpfulReviews', JSON.stringify(helpfulReviews));
  },
  
  // Report review
  reportReview: function(reviewId) {
    // In a real implementation, this would open a report form
    // For demo, just show a confirmation
    
    const reportModal = `
      <div class="modal fade" id="reportModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Báo cáo đánh giá</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Bạn muốn báo cáo đánh giá này vì lý do gì?</p>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reportReason1" value="inappropriate" checked>
                <label class="form-check-label" for="reportReason1">
                  Nội dung không phù hợp
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reportReason2" value="spam">
                <label class="form-check-label" for="reportReason2">
                  Spam hoặc quảng cáo
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="reportReason" id="reportReason3" value="fake">
                <label class="form-check-label" for="reportReason3">
                  Thông tin giả mạo
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" name="reportReason" id="reportReason4" value="other">
                <label class="form-check-label" for="reportReason4">
                  Lý do khác
                </label>
              </div>
              <div class="mb-3">
                <label for="reportComment" class="form-label">Chi tiết (không bắt buộc)</label>
                <textarea class="form-control" id="reportComment" rows="3" placeholder="Nhập chi tiết lý do báo cáo"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" class="btn btn-danger" id="submitReportBtn">Gửi báo cáo</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', reportModal);
    
    const modal = new bootstrap.Modal(document.getElementById('reportModal'));
    modal.show();
    
    document.getElementById('submitReportBtn').addEventListener('click', () => {
      // In a real implementation, this would send an API request
      modal.hide();
      
      // Show confirmation
      setTimeout(() => {
        alert('Cảm ơn bạn đã báo cáo đánh giá này. Chúng tôi sẽ xem xét nội dung và xử lý trong thời gian sớm nhất.');
      }, 500);
      
      // Clean up
      setTimeout(() => {
        document.getElementById('reportModal').remove();
      }, 1000);
    });
    
    document.getElementById('reportModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('reportModal').remove();
    });
  },
  
  // Show review photo modal
  showReviewPhotoModal: function(imageSrc) {
    const modalHTML = `
      <div class="modal fade" id="reviewPhotoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-body p-0">
              <button type="button" class="btn-close position-absolute end-0 top-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
              <img src="${imageSrc}" class="img-fluid review-photo-full" alt="Review Photo">
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('reviewPhotoModal'));
    modal.show();
    
    document.getElementById('reviewPhotoModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('reviewPhotoModal').remove();
    });
  },
  
  // Setup review form
  setupReviewForm: function() {
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    if (!writeReviewBtn) return;
    
    writeReviewBtn.addEventListener('click', () => {
      this.openReviewForm();
    });
    
    // Rating input
    const ratingInputStars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('ratingInput');
    
    ratingInputStars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        this.updateRatingStars(ratingInputStars, rating, 'hover');
      });
      
      star.addEventListener('mouseout', () => {
        const currentRating = parseInt(ratingInput.value);
        this.updateRatingStars(ratingInputStars, currentRating, 'selected');
      });
      
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        ratingInput.value = rating;
        this.updateRatingStars(ratingInputStars, rating, 'selected');
      });
    });
    
    // Photo upload
    const photoInput = document.getElementById('reviewPhotos');
    const photosPreview = document.getElementById('photosPreview');
    
    if (photoInput && photosPreview) {
      photoInput.addEventListener('change', () => {
        photosPreview.innerHTML = '';
        
        if (photoInput.files.length > 0) {
          Array.from(photoInput.files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              const photoPreview = document.createElement('div');
              photoPreview.className = 'review-photo-preview-item';
              photoPreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-photo-btn">
                  <i class="fas fa-times"></i>
                </button>
              `;
              
              photoPreview.querySelector('.remove-photo-btn').addEventListener('click', () => {
                photoPreview.remove();
                // Note: We can't directly modify the FileList, but in a real implementation,
                // you would track which files to include in the submission
              });
              
              photosPreview.appendChild(photoPreview);
            };
            
            reader.readAsDataURL(file);
          });
        }
      });
    }
    
    // Submit review
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener('click', () => {
        this.submitReview();
      });
    }
  },
  
  // Update rating stars
  updateRatingStars: function(stars, rating, state) {
    stars.forEach((star, index) => {
      const starRating = parseInt(star.getAttribute('data-rating'));
      
      star.className = starRating <= rating
        ? 'fas fa-star'
        : 'far fa-star';
      
      if (state === 'hover' && starRating <= rating) {
        star.classList.add('hover');
      } else {
        star.classList.remove('hover');
      }
    });
  },
  
  // Open review form
  openReviewForm: function() {
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    reviewModal.show();
    
    // Load saved info if available
    const savedInfo = JSON.parse(localStorage.getItem('reviewerInfo') || '{}');
    if (savedInfo.name) {
      document.getElementById('reviewName').value = savedInfo.name;
    }
    if (savedInfo.email) {
      document.getElementById('reviewEmail').value = savedInfo.email;
    }
    if (savedInfo.saveInfo) {
      document.getElementById('saveReviewInfo').checked = true;
    }
  },
  
  // Submit review
  submitReview: function() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;
    
    // Validate form
    const rating = document.getElementById('ratingInput').value;
    const title = document.getElementById('reviewTitle').value;
    const content = document.getElementById('reviewContent').value;
    const name = document.getElementById('reviewName').value;
    const email = document.getElementById('reviewEmail').value;
    
    if (rating === '0') {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!title || !content || !name || !email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    // Save reviewer info if requested
    if (document.getElementById('saveReviewInfo').checked) {
      localStorage.setItem('reviewerInfo', JSON.stringify({
        name,
        email,
        saveInfo: true
      }));
    } else {
      localStorage.removeItem('reviewerInfo');
    }
    
    // In a real implementation, this would submit to an API
    // For demo, just show success message and close modal
    
    // Hide modal
    const reviewModal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
    reviewModal.hide();
    
    // Show success message
    setTimeout(() => {
      const successAlert = document.createElement('div');
      successAlert.className = 'alert alert-success alert-dismissible fade show';
      successAlert.setAttribute('role', 'alert');
      successAlert.innerHTML = `
        <i class="fas fa-check-circle me-2"></i> Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ được hiển thị sau khi kiểm duyệt.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      
      const reviewsContainer = document.querySelector('.reviews-container');
      if (reviewsContainer) {
        reviewsContainer.prepend(successAlert);
        
        // Scroll to alert
        successAlert.scrollIntoView({ behavior: 'smooth' });
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          successAlert.classList.remove('show');
          setTimeout(() => successAlert.remove(), 150);
        }, 5000);
      }
    }, 500);
    
    // Reset form
    reviewForm.reset();
    document.querySelectorAll('.rating-input i').forEach(star => {
      star.className = 'far fa-star';
    });
    document.getElementById('ratingInput').value = '0';
    document.getElementById('photosPreview').innerHTML = '';
  },
  
  // Add rating summary to product
  addRatingSummary: function() {
    const productMeta = document.querySelector('.product-meta');
    if (!productMeta) return;
    
    // Add view reviews link
    const viewReviewsLink = document.createElement('a');
    viewReviewsLink.href = '#reviews';
    viewReviewsLink.className = 'view-reviews-link';
    viewReviewsLink.innerHTML = 'Xem tất cả đánh giá <i class="fas fa-angle-right"></i>';
    viewReviewsLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Show reviews tab
      const reviewsTab = document.getElementById('reviews-tab');
      if (reviewsTab) {
        reviewsTab.click();
      }
    });
    
    productMeta.appendChild(viewReviewsLink);
  }
};

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
  RatingReview.init();
});