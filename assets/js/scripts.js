document.addEventListener('DOMContentLoaded', async () => {
    let menProducts = [];
    let currentPage = 1;
    const productsPerPage = 10;
    let loadMoreButton = '';
    const checkboxesEvent = document.querySelectorAll('.filterCheckbox');
    let searchQuery = '';
    let sortBy = 'default';

    // Function to initialize content
    const initialize = () => {
        currentPage = 1;
        const productsList = document.querySelector('.products-list');
        if (productsList) {
            productsList.innerHTML = '';
        }
    };

    // Function to fetch products
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
            updateContent();
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            if (loader) loader.classList.add('hidden');
            if (loadMoreButton) loadMoreButton.classList.remove('hidden');
            if (seeResultsProducts) seeResultsProducts.classList.remove('hidden');
        }
    };

    // Function to update content
    const updateContent = () => {
        const filteredProducts = getFilteredData();
        const searchFilteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery)
        );
        const sortedProducts = sortProducts(searchFilteredProducts, sortBy);

        const productsList = document.querySelector('.products-list');
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

    // Function to get filtered data
    const getFilteredData = () => {
        const categories = Array.from(document.querySelectorAll('.men-filter input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        return menProducts.filter(product => {
            if (categories.length === 0) return true;
            return categories.includes(product.category);
        });
    };

    const sortSelect = document.querySelector('#sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            sortBy = event.target.value;
            initialize();
            updateContent();
        });
    }

    // Function to sort products
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

    // Event listener for checkboxes
    checkboxesEvent.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            initialize();
            updateContent();
        });
    });

    // Open the filter modal
    document.querySelector('.mob-filter').addEventListener('click', function () {
        document.getElementById('filterModal').style.display = 'flex';
        document.getElementById('filterModal').style.alignItems = 'center';
    });

    // Close the filter modal
    document.getElementById('modalClose').addEventListener('click', function () {
        document.getElementById('filterModal').style.display = 'none';
    });

    // Open the sort modal
    document.querySelector('.mob-sort')?.addEventListener('click', function () {
        document.getElementById('sortModal').style.display = 'flex';
        document.getElementById('sortModal').style.alignItems = 'center';
    });

    // Close the sort modal
    document.getElementById('sortModalClose').addEventListener('click', function () {
        document.getElementById('sortModal').style.display = 'none';
    });

    // Handle the sort selection in the modal
    document.querySelectorAll('#sortModal input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function (event) {
            sortBy = event.target.value;
            initialize();
            updateContent();
        });
    });

    // Handle drawer open and close
    const drawer = document.querySelector('#drawer');
    const drawerOpenButton = document.querySelector('#drawerOpen');
    const drawerCloseButton = document.querySelector('#drawerClose');
    const overlay = document.querySelector('#overlay');
    const body = document.body;

    if (drawerOpenButton) {
        drawerOpenButton.addEventListener('click', () => {
            if (window.innerWidth <= 320) {
                drawer.classList.add('open');
                if (overlay) overlay.style.display = 'block';
                body.classList.add('no-scroll');
            }
        });
    }

    if (drawerCloseButton) {
        drawerCloseButton.addEventListener('click', () => {
            drawer.classList.remove('open');
            if (overlay) overlay.style.display = 'none';
            body.classList.remove('no-scroll');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', () => {
            drawer.classList.remove('open');
            overlay.style.display = 'none';
            body.classList.remove('no-scroll');
        });
    }

    const searchInput = document.querySelector('#menSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            searchQuery = event.target.value.toLowerCase();
            initialize();
            updateContent();
        });
    }
    const searchInputMobile = document.querySelector('#menSearchMobile');
    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', (event) => {
            searchQuery = event.target.value.toLowerCase();
            initialize();
            updateContent();
        });
    }


    // Handle load more button
    const loadMoreProducts = async () => {
        currentPage++;
        updateContent();
    };

    await fetchProducts();
    loadMoreButton = document.querySelector('#load-more');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreProducts);
    }
});
