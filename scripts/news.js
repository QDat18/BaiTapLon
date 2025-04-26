document.addEventListener("DOMContentLoaded", function () {
    fetch('./data/news.json')
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById('news-list');

            if (data.length === 0) {
                newsList.innerHTML = '<p class="text-center text-muted">Không có tin tức nào vào lúc này.</p>';
                return;
            }

            data.forEach(news => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';

                col.innerHTML = `
                    <a href="news_detail.html?id=${news.id}" class="text-decoration-none text-dark">
                        <div class="card news-card h-100">
                            <img src="${news.image}" class="card-img-top" alt="${news.title}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title news-title">${news.title}</h5>
                                <p class="card-text text-truncate">${news.description}</p>
                                <p class="text-muted small mt-auto">${news.startDate}</p>
                            </div>
                        </div>
                    </a>
                `;

                newsList.appendChild(col);
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải tin tức:', error);
            document.getElementById('news-list').innerHTML = '<p class="text-danger text-center">Không thể tải dữ liệu tin tức.</p>';
        });
});
