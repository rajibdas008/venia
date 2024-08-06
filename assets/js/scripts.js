document.addEventListener('DOMContentLoaded', async () => {
    let menProducts = [];
    let currentPage = 1;
    const productsPerPage = 10;
    let loadMoreButton = '';



    const sortProducts = (products, sortBy) => {
        switch (sortBy) {
            case 'price-asc':
                return products.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return products.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return products.sort((a, b) => a.title.localeCompare(b.title));
            case 'name-desc':
                return products.sort((a, b) => b.title.localeCompare(a.title));
            default:
                return products; // Default sorting or no sorting
        }
    };

    const sortSelect = document.querySelector('#sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            const sortBy = event.target.value;
            updateContent(null, sortBy);
        });
    }

    const getFilteredData = () => {
        const categories = Array.from(document.querySelectorAll('.men-filter input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        return menProducts.filter(product => {
            if (categories.length === 0) return true;
            return categories.includes(product.category);
        });
    };

    const searchInput = document.querySelector('#menSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            // searchProducts(query);
            console.log(query)
        });
    }

    const fetchProducts = async () => {
        const loader = document.querySelector('#loader');

        const loadMoreButton = document.querySelector('.load-more-products');

        const seeResultsProducts = document.querySelector('.see-results-products');

        if (loader) loader.classList.remove('hidden');

        if (loadMoreButton) loadMoreButton.classList.add('hidden');

        if (seeResultsProducts) seeResultsProducts.classList.add('hidden');

        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const allProducts = await response.json();
            menProducts = allProducts;
            console.log('Fetching men\'s clothing products:', menProducts);
            updateContent();
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            if (loader) loader.classList.add('hidden');

            if (loadMoreButton) loadMoreButton.classList.remove('hidden');

            if (seeResultsProducts) seeResultsProducts.classList.remove('hidden');
        }
    };
    const loadMoreProducts = async () => {
        console.log('Loading more products', currentPage)
        currentPage++;
        updateContent();
    };

    const updateContent = (searchQuery = '', sortBy = 'default') => {
        console.log('Updating', searchQuery, sortBy);
        const filteredProducts = getFilteredData();

        // Apply search filter
        const searchFilteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery)
        );

        // Apply sorting
        const sortedProducts = sortProducts(searchFilteredProducts, sortBy);

        // Clear the existing content
        const productsList = document.querySelector('.products-list');
        if (productsList) {
            productsList.innerHTML = '';
        }

        // Pagination logic
        const start = (currentPage - 1) * productsPerPage;
        const end = Math.min(start + productsPerPage, sortedProducts.length);
        const productsToShow = sortedProducts.slice(start, end);

        productsToShow.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-box');
            productDiv.innerHTML = `
            <div class="product-img-row">
                <img src="${product.image}" alt="${product.title}" class="product-img">
            </div>
            <div class="product-info">
                <div class="product-name">${product.title}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-heart">
                    <img src="./assets/images/heart.png" alt="Heart">
                </div>
            </div>
        `;
            productsList.appendChild(productDiv);
        });

        // Update result count
        const resultCount = document.querySelector('.result-count');
        if (resultCount) {
            resultCount.textContent = `Showing ${Math.min(currentPage * productsPerPage, sortedProducts.length)} products`;
        }

        // Handle "Load More" button visibility
        const loadMoreButton = document.querySelector('.load-more-products');
        if (loadMoreButton) {
            loadMoreButton.style.display = end >= sortedProducts.length ? 'none' : 'flex';
        }
    };


    // Handle drawer open and close
    const drawer = document.querySelector('#drawer');
    const drawerOpenButton = document.querySelector('#drawerOpen');
    const drawerCloseButton = document.querySelector('#drawerClose');

    if (drawerOpenButton) {
        drawerOpenButton.addEventListener('click', () => {
            if (window.innerWidth <= 320) {
                drawer.classList.add('open');
            }
        });
    }

    if (drawerCloseButton) {
        drawerCloseButton.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
    }

    await fetchProducts();
    loadMoreButton = document.querySelector('#load-more');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreProducts);
    }
});