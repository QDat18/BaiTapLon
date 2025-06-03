document.addEventListener("DOMContentLoaded", function () {
    loadPromotions();
    setupEventListeners(); // New function for event listeners
});

let allPromotions = []; // Stores all fetched promotions
let filteredPromotions = []; // Stores promotions after filtering/searching
const itemsPerPage = 8; // Number of promotions per page
let currentPage = 1; // Current page for pagination
let currentFilter = 'all'; // Stores the active filter type
let searchTerm = ''; // Stores the current search term

function initSliders() {
    const promotionSwiperElement = document.querySelector('.promotion-swiper');
    if (promotionSwiperElement) {
        new Swiper(promotionSwiperElement, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.promotion-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.promotion-swiper .swiper-button-next',
                prevEl: '.promotion-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }

    const newsSwiperElement = document.querySelector('.news-swiper');
    if (newsSwiperElement) {
        new Swiper(newsSwiperElement, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.news-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.news-swiper .swiper-button-next',
                prevEl: '.news-swiper .swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }
}

function loadPromotions() {
    fetch('data/promotion.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allPromotions = data; // Store all fetched data
            
            // Populate the Swiper Slider (unchanged, still uses allPromotions)
            const promotionSliderContainer = document.getElementById('promotion-container');
            const swiperWrapper = document.createElement('div');
            swiperWrapper.className = 'swiper-wrapper';
            promotionSliderContainer.innerHTML = ''; // Clear existing content
            promotionSliderContainer.classList.add('swiper', 'promotion-swiper');
            promotionSliderContainer.appendChild(swiperWrapper);
            
            const prevBtn = document.createElement('div');
            prevBtn.className = 'swiper-button-prev';
            const nextBtn = document.createElement('div');
            nextBtn.className = 'swiper-button-next';
            const pagination = document.createElement('div');
            pagination.className = 'swiper-pagination';
            
            promotionSliderContainer.appendChild(prevBtn);
            promotionSliderContainer.appendChild(nextBtn);
            promotionSliderContainer.appendChild(pagination);

            if (!allPromotions || allPromotions.length === 0) {
                promotionSliderContainer.innerHTML = '<p class="text-center text-muted">Không có khuyến mãi nào vào lúc này.</p>';
                document.getElementById('promotion-list').innerHTML = '<p class="col-12 text-center text-muted">Không có khuyến mãi nào vào lúc này.</p>';
                return;
            }

            allPromotions.forEach(promotion => {
                const sliderCard = document.createElement('div');
                sliderCard.className = 'swiper-slide';
                
                const sliderImageUrl = promotion.image && promotion.image !== "" ? promotion.image : 'assets/promotions/default-promo.jpg'; // Use 'image' property
                const sliderTitle = promotion.title || 'Ưu Đãi Mới'; // Use 'title' property
                const sliderDescription = promotion.description || 'Thông tin khuyến mãi đang cập nhật.'; // Use 'description' property
                const startDateFormatted = promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : 'N/A'; // Use 'startDate' property
                const endDateFormatted = promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : 'N/A'; // 'endDate' is missing in JSON


                sliderCard.innerHTML = `
                    <a href="${promotion.url || '#'}" class="text-decoration-none">
                        <div class="card h-100">
                            <img src="${sliderImageUrl}" class="card-img-top" alt="${sliderTitle}" onerror="this.onerror=null;this.src='assets/promotions/default-promo.jpg';">
                            <div class="card-body">
                                <h5 class="card-title">${sliderTitle}</h5>
                                <p class="card-text">${sliderDescription}</p>
                                <p class="text-muted small">Từ: ${startDateFormatted} - Đến: ${endDateFormatted}</p>
                            </div>
                        </div>
                    </a>
                `;
                swiperWrapper.appendChild(sliderCard);
            });

            // Initialize sliders after content is loaded
            initSliders();

            // Perform initial filter and display promotions
            filterAndSearchPromotions();
            
        })
        .catch(error => {
            console.error('Lỗi khi tải khuyến mãi:', error);
            document.getElementById('promotion-container').innerHTML = 
                '<p class="text-danger text-center">Không thể tải dữ liệu khuyến mãi. Vui lòng kiểm tra file promotion.json hoặc đường dẫn.</p>';
            document.getElementById('promotion-list').innerHTML = 
                '<p class="col-12 text-danger text-center">Không thể tải dữ liệu khuyến mãi. Vui lòng kiểm tra file promotion.json hoặc đường dẫn.</p>';
        });
}

// New function to handle filtering and searching
function filterAndSearchPromotions() {
    let tempPromotions = allPromotions;

    // Apply filter
    if (currentFilter !== 'all') {
        tempPromotions = tempPromotions.filter(promotion => {
            // Your promotion.json doesn't have a 'type' field.
            // You might need to add a 'type' property to your promotion.json data
            // or derive it from the title/description if possible.
            // For now, it will only filter if 'type' is present in your JSON.
            return promotion.type && promotion.type.toLowerCase() === currentFilter;
        });
    }

    // Apply search
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        tempPromotions = tempPromotions.filter(promotion => {
            const title = promotion.title ? promotion.title.toLowerCase() : ''; // Use 'title' property
            const description = promotion.description ? promotion.description.toLowerCase() : ''; // Use 'description' property
            const details = promotion.details ? promotion.details.toLowerCase() : ''; // Use 'details' property

            return title.includes(lowerCaseSearchTerm) ||
                   description.includes(lowerCaseSearchTerm) ||
                   details.includes(lowerCaseSearchTerm);
        });
    }

    filteredPromotions = tempPromotions; // Update the global filteredPromotions
    currentPage = 1; // Reset to first page when filter/search changes
    displayPromotions(currentPage); // Display the filtered/searched results
    setupPagination(filteredPromotions.length, itemsPerPage); // Setup pagination for filtered results
}


function displayPromotions(page) {
    currentPage = page;
    const promotionListBox = document.getElementById('promotion-list');
    promotionListBox.innerHTML = ''; // Clear current promotions

    const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index
    const endIndex = startIndex + itemsPerPage; // Calculate end index

    const promotionsToDisplay = filteredPromotions.slice(startIndex, endIndex); // Use filteredPromotions

    const noResultsElement = document.getElementById('no-results'); // Get no-results element
    if (promotionsToDisplay.length === 0) {
        if (noResultsElement) noResultsElement.classList.remove('d-none'); // Show no results
        return;
    } else {
        if (noResultsElement) noResultsElement.classList.add('d-none'); // Hide no results
    }

    promotionsToDisplay.forEach(promotion => {
        const promotionBox = document.createElement('div'); // Changed from <a> to <div>
        promotionBox.className = 'promotion-box';
        // Set data-type based on existing 'type' or default
        promotionBox.setAttribute('data-type', promotion.type ? promotion.type : 'general'); 
        
        // Add Bootstrap modal attributes
        promotionBox.setAttribute('data-bs-toggle', 'modal');
        promotionBox.setAttribute('data-bs-target', '#promotionModal');

        // Store promotion data in data attributes for the modal
        promotionBox.setAttribute('data-id', promotion.id || ''); // Use 'id' property
        promotionBox.setAttribute('data-title', promotion.title || ''); // Use 'title' property
        promotionBox.setAttribute('data-description', promotion.description || ''); // Use 'description' property
        promotionBox.setAttribute('data-start-date', promotion.startDate || ''); // Use 'startDate' property
        promotionBox.setAttribute('data-end-date', promotion.endDate || ''); // 'endDate' is missing in JSON
        promotionBox.setAttribute('data-promo-type', promotion.type || 'general'); // Default type if not present
        promotionBox.setAttribute('data-url', promotion.url || '#'); // 'url' is missing in JSON
        promotionBox.setAttribute('data-image-url', promotion.image || 'assets/promotions/default-promo.jpg'); // Use 'image' property
        promotionBox.setAttribute('data-details-html', promotion.details || ''); // Store the HTML details

        const boxImageUrl = promotion.image && promotion.image !== "" ? promotion.image : 'assets/promotions/default-promo.jpg'; // Use 'image' property
        const boxTitle = promotion.title || 'Ưu Đãi Mới'; // Use 'title' property
        const boxDescription = promotion.description || 'Thông tin khuyến mãi đang cập nhật.'; // Use 'description' property
        const boxStartDateFormatted = promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : 'N/A'; // Use 'startDate' property
        const boxEndDateFormatted = promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : 'N/A'; // Will be N/A if endDate is not in JSON
        const boxTypeDisplay = promotion.type ? promotion.type.replace('-', ' ').toUpperCase() : 'KHUYẾN MÃI'; // Will be KHUYẾN MÃI if type is not in JSON

        promotionBox.innerHTML = `
            <img src="${boxImageUrl}" class="promotion-box-image" alt="${boxTitle}" onerror="this.onerror=null;this.src='assets/promotions/default-promo.jpg';">
            <div class="promotion-box-content">
                <h5 class="promotion-box-title">${boxTitle}</h5>
                <p class="promotion-box-description">${boxDescription}</p>
                <p class="promotion-box-date">Thời gian: ${boxStartDateFormatted} - ${boxEndDateFormatted}</p>
            </div>
            <div class="promotion-box-footer">
                <span class="promotion-box-type">${boxTypeDisplay}</span>
                <span class="promotion-box-link">Xem chi tiết <i class="fas fa-external-link-alt"></i></span>
            </div>
        `;
        promotionListBox.appendChild(promotionBox);
    });
}

function setupPagination(totalItems, itemsPerPage) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

    if (totalPages <= 1) {
        return; // No pagination needed
    }

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`; // Disable if on first page
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            displayPromotions(currentPage - 1); // Go to previous page
            setupPagination(totalItems, itemsPerPage); // Re-render pagination
        }
    });
    paginationContainer.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`; // Set active class for current page
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', (e) => {
            e.preventDefault();
            displayPromotions(i); // Go to clicked page
            setupPagination(totalItems, itemsPerPage); // Re-render pagination
        });
        paginationContainer.appendChild(pageLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`; // Disable if on last page
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            displayPromotions(currentPage + 1); // Go to next page
            setupPagination(totalItems, itemsPerPage); // Re-render pagination
        }
    });
    paginationContainer.appendChild(nextLi);
}

// Add event listener for when the modal is about to be shown
const promotionModal = document.getElementById('promotionModal');
promotionModal.addEventListener('show.bs.modal', function (event) {
    // Get the button that triggered the modal
    const button = event.relatedTarget; 

    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-id'); // Get 'id' from data attribute
    const title = button.getAttribute('data-title'); // Get 'title' from data attribute
    const description = button.getAttribute('data-description'); // Get 'description' from data attribute
    const startDate = button.getAttribute('data-start-date'); // Get 'startDate' from data attribute
    const endDate = button.getAttribute('data-end-date'); // Get 'endDate' from data attribute
    const type = button.getAttribute('data-promo-type'); // Get 'promo-type' from data attribute
    const url = button.getAttribute('data-url'); // Get 'url' from data attribute
    const imageUrl = button.getAttribute('data-image-url'); // Get 'imageUrl' from data attribute
    const detailsHtml = button.getAttribute('data-details-html'); // Get 'details-html' from data attribute

    // Update the modal's content
    const modalTitle = promotionModal.querySelector('#modalTitle'); // Select modal title element
    const modalDesc = promotionModal.querySelector('#modalDesc'); // Select modal description element
    const modalDetails = promotionModal.querySelector('#modalDetails'); // Select modal details element
    const modalActionBtn = promotionModal.querySelector('#modalActionBtn'); // Select modal action button

    modalTitle.textContent = title; // Set modal title
    modalDesc.textContent = description; // Set modal description

    // Insert the HTML details directly into modalDetails
    modalDetails.innerHTML = detailsHtml;

    // Add general info and image (if available) below the details table
    const generalInfoDiv = document.createElement('div');
    generalInfoDiv.innerHTML = `
        <p class="mt-3"><strong>Loại ưu đãi:</strong> ${type ? type.replace('-', ' ').toUpperCase() : 'N/A'}</p>
        <p><strong>Thời gian:</strong> ${startDate ? new Date(startDate).toLocaleDateString() : 'N/A'} - ${endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}</p>
    `;
    modalDetails.appendChild(generalInfoDiv); // Append general info to modalDetails

    if (imageUrl && imageUrl !== 'assets/promotions/default-promo.jpg') {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = title;
        imgElement.className = 'img-fluid mt-3 mb-3';
        imgElement.style.maxHeight = '300px';
        imgElement.style.objectFit = 'contain';
        modalDetails.appendChild(imgElement); // Append image to modalDetails
    }


    // Update the action button's href
    if (url && url !== '#' && url !== 'undefined' && url !== null) {
        modalActionBtn.href = url;
        modalActionBtn.style.display = 'inline-block'; // Show button
    } else {
        modalActionBtn.style.display = 'none'; // Hide button if no valid URL
    }
});

// New function to setup all event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-item').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all filters
            document.querySelectorAll('.filter-item').forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked filter
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter'); // Update current filter
            filterAndSearchPromotions(); // Re-filter and display
        });
    });

    // Search input and button
    const searchInput = document.getElementById('search-promotions');
    const searchButton = document.getElementById('btn-search');

    if (searchInput && searchButton) {
        // Trigger search on button click
        searchButton.addEventListener('click', function() {
            searchTerm = searchInput.value.trim(); // Update search term
            filterAndSearchPromotions(); // Re-filter and display
        });

        // Trigger search on Enter key in input
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTerm = this.value.trim(); // Update search term
                filterAndSearchPromotions(); // Re-filter and display
            }
        });
    }
}