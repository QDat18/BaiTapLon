document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const detailContainer = document.getElementById("promotion-detail");

    if (!id) {
        detailContainer.innerHTML = "<p class='text-danger'>Không tìm thấy ID khuyến mãi.</p>";
        return;
    }

    fetch('./data/promotion.json')
        .then(res => res.json())
        .then(data => {
            const item = data.find(p => p.id === id);

            if (!item) {
                detailContainer.innerHTML = "<p class='text-danger'>Khuyến mãi không tồn tại hoặc đã bị xoá.</p>";
                return;
            }

            detailContainer.innerHTML = `
                <h1 class="mb-3">${item.title}</h1>
                <p class="text-muted">${item.startDate}</p>
                <img src="${item.image}" alt="${item.title}" class="promotion-img my-4">
                <div class="promotion-content text-start">
                    <p>${item.details || item.description}</p>
                </div>
                <a href="promotion.html" class="btn btn-outline-primary mt-4">← Quay lại danh sách khuyến mãi</a>
            `;
        })
        .catch(err => {
            console.error('Lỗi khi tải chi tiết khuyến mãi:', err);
            detailContainer.innerHTML = "<p class='text-danger'>Lỗi khi tải dữ liệu khuyến mãi.</p>";
        });
});
