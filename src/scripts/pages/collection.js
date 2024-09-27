import Select from '../components/dropdown/index.js';

/**
 * Retrieves the filter tags from the DOM elements with the class 'filter-tag'.
 * 
 * @returns {Array} An array containing the values of the checked filter tags.
 */
function getFilterTags() {
    const tags = Array.from(document.querySelectorAll('.filter-tag')).reduce((acc, curr) => {
        if (curr.checked) {
            acc.push(curr.value);
        }
        return acc;
    }, []);
    return tags;
}

/**
 * Generates a URL based on the provided tags and the current Shopify collection handle.
 * 
 * @param {Array} tags - An array of tags to be included in the URL.
 * @returns {string} The formatted URL containing the collection handle and tags.
 */
function formatFilterURL(tags) {
    const collection = window.shopify_current_collection.handle;
    const url = window.location.origin + `/collections/${collection}/${tags.join('+')}`;
    return url;
}

function transformTag(tag) {
    return tag.toLowerCase().replaceAll(' ', '-');
}

/**
 * Updates the checked status and availability of filter tags based on the provided tags and available tags.
 * 
 * @param {Array} tags - An array of tags to be checked.
 * @param {Array} availableTags - An array of available tags to compare against.
 */

function updateCheckedTags(tags, availableTags) {
    const tagSet = new Set(tags);
    const tagList = new Set(availableTags.map(transformTag));
    document.querySelectorAll('.filter-tag').forEach(checkbox => {
        let hasTag = tagSet.has(checkbox.value);
        let tagAvailable = tagList.has(checkbox.value) || tagList.has(checkbox.value.replaceAll('-', ' '));
        if (hasTag) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        checkbox.disabled = !tagAvailable ? true : false;
    })
}

/**
 * Updates the results based on the selected filter tags.
 * Retrieves the filter tags, formats the filter URL, and redirects the location to the new URL.
 * Also updates the checked tags based on the selected filter tags.
 */
function updateResults() {
    const tags = getFilterTags();
    const url = formatFilterURL(tags);
    location.assign(url);
    updateCheckedTags(tags);
}

/**
 * Retrieves the current filters from the URL path.
 * Splits the window location pathname by '/' and extracts the filters from the last segment separated by '+'.
 * 
 * @returns {Array} An array containing the current filters extracted from the URL.
 */
function getCurrentFilters() {
    const path = window.location.pathname.split('/');
    const tags = path[path.length - 1].split('+');
    return tags;
}

/**
 * Updates the location to navigate to a specific collection based on the selected option.
 * 
 * @param {HTMLElement} option - The selected option element containing the dataset with the collection value.
 */
function handleCollectionChange(option) {
    const collection = option.dataset.optionValue;
    const origin = window.location.origin;
    location.href = `${origin}/collections/${collection}`;
}

/**
 * Clears all selected filter tags by removing the 'checked' attribute.
 * Generates a URL based on the provided current collection handle and assigns the location to the new URL.
 * 
 * @param {string} currentCollection - The handle of the current collection to generate the URL.
 */
function clearResults(currentCollection) {
    Array.from(document.querySelectorAll('.filter-tag')).forEach((checkbox) => {
        checkbox.removeAttribute('checked');
    });
    const url = window.location.origin + `/collections/${currentCollection}`;
    location.assign(url);
}

function displayMessage(message, element) {
    if (element) {
        element.innerHTML = `<p class="customer-notification">${message}</p>`;
    }
}

(function () {
    // Get the number of products on the current page to display for assistive technologies
    const productsCount = document.querySelector('#product-count-wrapper');
    setTimeout(() => {
        if(productsCount) {
            productsCount.innerHTML = `<span class="sr-only">Showing ${window.shopify_pagination.page_size} products on page ${window.shopify_pagination.current_page} of ${window.shopify_pagination.pages}</span>`;
        }
    }, 500);
    // Provide message for page with no items
    const collectionContainerSelector = document.querySelector('.collection-list-view') ? '.products-list' : '.collection__products-grid';
    const collectionContainer = document.querySelector(collectionContainerSelector)
    if (window.shopify_pagination.page_size === 0 && collectionContainer) {
        const message = window.shopify_no_items_available_message;
        displayMessage(message, collectionContainer);
    }

    // Get detail for seeting up custom collection select
    const availableTags = window.shopify_available_tags;
    const collections = Array.from(document.querySelectorAll('.collection-link'));
    const currentCollection = window.shopify_current_collection;
    const collectionNames = collections.map(opt => {
        return opt.dataset.collectionHandle;
    })

    // Apply custom dropdown to coolection select
    const customSelect = document.querySelector('.js-select')
    const customDropdown = new Select(customSelect, collectionNames, currentCollection.title, handleCollectionChange);

    // Get the current filter tags, set te corresponding checkboxes as checked and add event listeners for next selection
    const currentFilters = getCurrentFilters();
    updateCheckedTags(currentFilters, availableTags);
    Array.from(document.querySelectorAll('.filter-tag')).forEach(checkbox => checkbox.addEventListener('change', updateResults));

    // Remove all filters by unchecking all checkboxes
    document.querySelector('#clear-filters')?.addEventListener('click', () => {
        clearResults(currentCollection.handle)
    });
})();

