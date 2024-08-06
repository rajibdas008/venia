document.addEventListener('DOMContentLoaded', async () => {
    let menProducts = [];
    let currentPage = 1;
    const productsPerPage = 10;
    let loadMoreButton = '';
    const checkboxesEvent =  document.querySelectorAll('.filterCheckbox');
    let searchQuery = '';
    let sortBy = 'default';

    checkboxesEvent.forEach(checkbox => {
        checkbox.addEventListener('change', function (event) {
          // Count checked checkboxes
        //   console.log(event.target.value)
        //   const selectedCheckboxValues = Array.from(checkboxesEvent).filter(cb => cb.checked).map((cb) =>cb.value);
        //   console.log(checkedCount);
        initialize();
        updateContent();
        });
        
      });

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
            sortBy = event.target.value;
            initialize();
            updateContent();
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
            searchQuery = event.target.value.toLowerCase();
            initialize();
            updateContent();
        });
    }

    const initialize = () => {
        // Clear the existing content
        currentPage = 1;
        const productsList = document.querySelector('.products-list');
        if (productsList) {
            productsList.innerHTML = '';
        }
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

    const updateContent = () => {
        
       
        console.log('Updating', searchQuery, sortBy);
        const filteredProducts = getFilteredData();

        // Apply search filter
        const searchFilteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery)
        );

        // Apply sorting
        const sortedProducts = sortProducts(searchFilteredProducts, sortBy);

        const productsList = document.querySelector('.products-list');
        // if (productsList) {
        //     productsList.innerHTML = '';
        // }

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