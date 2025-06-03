const categories = ['iphone', 'mac', 'ipad', 'applewatch', 'airpod', 'phukien'];

// Đọc file product.json
fetch('data/product.json')
    .then(response => response.json())
    .then(data => {
        categories.forEach(categoryId => {
            const container = document.getElementById(categoryId);
            const prevBtn = document.getElementById(`prev-${categoryId}`);
            const nextBtn = document.getElementById(`next-${categoryId}`);

            const category = data.categories.find(cat => cat.id === categoryId);
            if (!category || !container) return;

            // Thêm sản phẩm
            category.products.forEach(product => {
                const configKeys = Object.keys(product.configurations || {});
                const firstConfig = configKeys[0];
                let priceInfo, image;

                if (firstConfig) {
                    const colorKeys = Object.keys(product.configurations[firstConfig]);
                    const firstColor = colorKeys[0];
                    priceInfo = product.configurations[firstConfig][firstColor];
                    image = product.images[firstConfig][firstColor] || product.defaultImage;
                } else {
                    priceInfo = {
                        price: product.price,
                        originalPrice: product.originalPrice,
                        discount: product.discount
                    };
                    image = product.images?.Standard ? product.images.Standard[Object.keys(product.images.Standard)[0]] : product.defaultImage;
                }

                container.innerHTML += `
                    <div class="product-card">
                        <img src="${image}" alt="${product.name}">
                        <div class="discount">${priceInfo.discount}%</div>
                        <h3>${product.name}</h3>
                        <p>
                            <span class="price">${priceInfo.price.toLocaleString()} đ</span>
                            <span class="original-price">${priceInfo.originalPrice.toLocaleString()} đ</span>
                        </p>
                    </div>
                `;
            });

            // Điều hướng carousel
            let scrollPosition = 0;
            const cardWidth = 220; // Chiều rộng thẻ + margin
            const maxScroll = container.scrollWidth - container.clientWidth;

            nextBtn.addEventListener('click', () => {
                if (scrollPosition < maxScroll) {
                    scrollPosition += cardWidth;
                    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                    prevBtn.disabled = false;
                    if (scrollPosition >= maxScroll) nextBtn.disabled = true;
                }
            });

            prevBtn.addEventListener('click', () => {
                if (scrollPosition > 0) {
                    scrollPosition -= cardWidth;
                    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                    nextBtn.disabled = false;
                    if (scrollPosition === 0) prevBtn.disabled = true;
                }
            });
        });
    })
    .catch(error => console.error('Lỗi khi tải JSON:', error));