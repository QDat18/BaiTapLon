document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const detailContainer = document.getElementById("news-detail");

    if (!id) {
        detailContainer.innerHTML = "<p class='text-danger'>Không tìm thấy ID bài viết.</p>";
        return;
    }

    fetch('./data/news.json')
        .then(res => res.json())
        .then(data => {
            const newsItem = data.find(item => item.id === id);

            if (!newsItem) {
                detailContainer.innerHTML = "<p class='text-danger'>Bài viết không tồn tại hoặc đã bị xoá.</p>";
                return;
            }

            detailContainer.innerHTML = `
                <h1 class="mb-4">${newsItem.title}</h1>
                <p class="text-muted">${newsItem.startDate}</p>
                <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image my-4">
                <div class="news-content text-start">
                    <p>${newsItem.details}</p>
                </div>
                <a href="news.html" class="btn btn-outline-primary mt-4">← Quay lại danh sách tin</a>
            `;
        })
        .catch(err => {
            console.error('Lỗi khi tải chi tiết:', err);
            detailContainer.innerHTML = "<p class='text-danger'>Lỗi khi tải dữ liệu bài viết.</p>";
        });
});
