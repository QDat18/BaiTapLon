document.addEventListener("DOMContentLoaded", function() {
    // Variables
    let allNews = [];
    const newsPerPage = 6;
    let currentPage = 1;
    let currentCategory = 'all';
    let searchTerm = '';
    
    // Elements
    const newsList = document.getElementById('news-list');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('news-search');
    const searchButton = document.getElementById('search-button');
    const categoryPills = document.querySelectorAll('.category-pill');
    const noResults = document.getElementById('no-results');
    
    // Fetch news data
    fetchNews();
    
    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    categoryPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            this.classList.add('active');
            // Filter by category
            currentCategory = this.getAttribute('data-category');
            currentPage = 1;
            filterAndDisplayNews();
        });
    });
    
    /**
     * Fetches news data from JSON file
     */
    function fetchNews() {
        fetch('data/news.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                allNews = data;
                // Create fake categories for demo
                allNews.forEach(news => {
                    // Extract category from title or assign random
                    if (news.title.toLowerCase().includes('apple')) {
                        news.category = 'apple';
                    } else if (news.title.toLowerCase().includes('samsung')) {
                        news.category = 'samsung';
                    } else if (news.title.toLowerCase().includes('xiaomi')) {
                        news.category = 'xiaomi';
                    } else {
                        news.category = 'events';
                    }
                });
                filterAndDisplayNews();
            })
            .catch(error => {
                console.error('Lỗi khi tải tin tức:', error);
                newsList.innerHTML = '<div class="col-12"><p class="text-danger text-center">Không thể tải dữ liệu tin tức. Vui lòng thử lại sau.</p></div>';
            });
    }
    
    /**
     * Filters news by category and search term, then displays
     */
    function filterAndDisplayNews() {
        // Filter by category
        let filteredNews = allNews;
        if (currentCategory !== 'all') {
            filteredNews = allNews.filter(news => news.category === currentCategory);
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredNews = filteredNews.filter(news => 
                news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                news.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Show/hide no results message
        if (filteredNews.length === 0) {
            newsList.innerHTML = '';
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
            
            // Pagination
            const totalPages = Math.ceil(filteredNews.length / newsPerPage);
            const startIndex = (currentPage - 1) * newsPerPage;
            const endIndex = startIndex + newsPerPage;
            const currentNews = filteredNews.slice(startIndex, endIndex);
            
            displayNews(currentNews);
            displayPagination(totalPages);
        }
    }
    
    /**
     * Displays news cards in the news list
     * @param {Array} newsArray - Array of news items to display
     */
    function displayNews(newsArray) {
        newsList.innerHTML = '';
        
        newsArray.forEach((news, index) => {
            const delay = index * 100;
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', delay);
            
            const categoryClass = getCategoryClass(news.category);
            
            col.innerHTML = `
                <a href="news_detail.html?id=${news.id}" class="text-decoration-none">
                    <div class="card news-card">
                        <div class="position-relative overflow-hidden">
                            <img src="${news.image}" class="card-img-top" alt="${news.title}">
                            <span class="position-absolute top-0 end-0 bg-${categoryClass} text-white m-2 px-2 py-1 rounded-pill small">
                                ${getCategoryName(news.category)}
                            </span>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title news-title">${news.title}</h5>
                            <p class="card-text">${news.description}</p>
                            <p class="news-date">
                                <i class="far fa-calendar-alt"></i> ${news.startDate}
                            </p>
                        </div>
                    </div>
                </a>
            `;
            
            newsList.appendChild(col);
        });
    }
    
    /**
     * Displays pagination based on number of pages
     * @param {Number} totalPages - Total number of pages
     */
    function displayPagination(totalPages) {
        pagination.innerHTML = '';
        
        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
        pagination.appendChild(prevLi);
        
        // Only show up to 5 page numbers
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLi.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                filterAndDisplayNews();
                // Scroll back to top
                window.scrollTo({top: newsList.offsetTop - 100, behavior: 'smooth'});
            });
            pagination.appendChild(pageLi);
        }
        
        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
        pagination.appendChild(nextLi);
        
        // Add event listeners to prev/next buttons
        if (currentPage > 1) {
            prevLi.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage--;
                filterAndDisplayNews();
                window.scrollTo({top: newsList.offsetTop - 100, behavior: 'smooth'});
            });
        }
        
        if (currentPage < totalPages) {
            nextLi.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage++;
                filterAndDisplayNews();
                window.scrollTo({top: newsList.offsetTop - 100, behavior: 'smooth'});
            });
        }
    }
    
    /**
     * Performs search based on input value
     */
    function performSearch() {
        searchTerm = searchInput.value.trim();
        currentPage = 1;
        filterAndDisplayNews();
    }
    
    /**
     * Gets Bootstrap color class based on category
     * @param {String} category - Category name
     * @return {String} - Bootstrap color class
     */
    function getCategoryClass(category) {
        switch(category) {
            case 'apple': return 'primary';
            case 'samsung': return 'success';
            case 'xiaomi': return 'warning';
            default: return 'info';
        }
    }
    
    /**
     * Gets display name for category
     * @param {String} category - Category slug
     * @return {String} - Display name
     */
    function getCategoryName(category) {
        switch(category) {
            case 'apple': return 'Apple';
            case 'samsung': return 'Samsung';
            case 'xiaomi': return 'Xiaomi';
            default: return 'Sự kiện';
        }
    }
});