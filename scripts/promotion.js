$(document).ready(function () {
    fetch('./data/promotion.json')
        .then(response => response.json())
        .then(data => {
            const promotionList = $('#promotion-list');
            data.forEach(promotion => {
                promotionList.append(`
                    <div class="col-md-4 mb-4">
                        <div class="card promotion-card h-100">
                            <a href="promotion_detail.html?id=${promotion.id}">
                                <img src="${promotion.image}" class="card-img-top" alt="${promotion.title}">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="promotion_detail.html?id=${promotion.id}" class="text-decoration-none">${promotion.title}</a>
                                </h5>
                                <p class="card-text">${promotion.description}</p>
                                <p class="text-muted">${promotion.startDate}</p>
                            </div>
                        </div>
                    </div>
                `);
            });
        })
        .catch(error => console.error('Lỗi khi tải khuyến mãi:', error));
});
