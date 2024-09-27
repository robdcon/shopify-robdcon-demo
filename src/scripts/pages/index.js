console.log('macmillan.js loaded');
import initKeyboardFocus from '../common/accessibility';

// Selecting necessary elements
const regionDropdownElm = document.querySelector('.js-region select');
const budgetCodeDropdown = document.querySelector('.js-budget-code-dropdown');
const budgetCodeDropdownWrapper = document.querySelector('.js-budget-code-dropdown-wrapper');
const budgetCodeInputWrapper = document.querySelector('.js-budget-code-input-wrapper');
const budgetCodeInput = document.querySelector('.js-budget-code-input');
const requester = document.querySelector('.js-requester');
const supporterCategory = document.querySelector('.js-supporterCategory');
const reasonTextArea = document.getElementById("reason");
const characterCounterMsg = document.querySelector(".js-character-counter");
const fundraisingTypeRadioElm = document.querySelectorAll('.js-fundraising-type input[type="radio"]');
const loginButton = document.querySelector('.js-login-to-checkout');
const fundraisingType = document.querySelector('.js-fundraising-type');
const otherFundraisingType = document.querySelector('.js-other-fundraising-type');
const signForm = document.querySelector('#customer_login');

/**
 * Helper Functions
 */
/**
 * Debounce function to limit the frequency of function calls.
 * @param {Function} func - The function to be debounced.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Handles the response from the fetch call.
 * @param {Response} response - The response from the fetch call.
 * @returns {Promise} - A promise resolving with the JSON data.
 */
const handleResponse = (response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

/**
 * Parses the JSON data.
 * @param {Object} data - The JSON data to parse.
 * @returns {Object} - The parsed regions data.
 */
const parseJSON = (data) => {
    const regions = data.regions;
    return regions;
};

/**
 * Converts the text entered into an input field to uppercase.
 * @param {string} inputElementId - The ID of the input element to apply the conversion to.
 */
const convertToUpperCase = (inputElementId) => {
    // Get the input element
    const inputElement = document.getElementById(inputElementId);

    // Add event listener to input element
    inputElement.addEventListener("input", (event) => {
        // Convert the entered text to uppercase
        const inputValue = event.target.value.toUpperCase();

        // Update the input value with the uppercase text
        event.target.value = inputValue;
    });
}

/**
 * Convert floating point integer to 2 decimal places
 * @param {number} amount - The amount to convert
 * @returns {number} - The amount rounded to the nearest 2 decimal places
 */
const convertToTwoDecimalPlaces = (amount) => {
    let convertedAmount = parseFloat(amount).toFixed(2);
    return convertedAmount;
}
/**
 * Truncates a floating-point number to a specified number of decimal places.
 *
 * @param {number} float - The floating-point number to be truncated.
 * @param {number} maxDecimalPlaces - The maximum number of decimal places to keep.
 * @returns {string} - The formatted string representation of the value as an amount.
 */
const formatAmount = (float, maxDecimalPlaces) => {
    let parts = float.split('.');
    let pounds = parseInt(parts[0], 10).toString();
    let pence = parts[1].slice(0, maxDecimalPlaces);
    let amount = parseFloat(`${pounds}.${pence}`);
    return amount;
}

/**
 * Add event listener to amount fields to handle invalid amounts
 * Both change and blur events need to be targeted to override default behaviour
 * which strips the zero before the decimal point 
 */
const handleAmountField = () => {
    const amountFields = document.querySelectorAll('.amount-input');
    amountFields?.forEach(field => {
        ['change', 'blur'].forEach(event => {
            field.addEventListener(event, (e) => {
                let val = e.target.value;
                if(val.indexOf('.') === -1) {
                    return parseInt(val, 10).toString();
                }
                let convertedVal = formatAmount(val, 2);
                e.target.value = convertedVal;
            })
        })
    })
}


/**
 * Initializes the cart page by setting event listeners and handling form elements.
 */
const initializeCartPage = () => {
    if (regionDropdownElm) {
        // Add debounced event listener for 'change' event
        regionDropdownElm.addEventListener('change', debounce(function (e) {
            const regionDropdownValue = e.target.value;
            // Show/hide radio options for allowed Region code(s)
            handleDisplayRadioOptions(regionDropdownValue);
            // Show/hide budget code dropdown or input box
            handleDisplayBudgetCode(regionDropdownValue);
            // Clear misc budget code input
            budgetCodeInput && (budgetCodeInput.value = "");
        }, 300)); // Adjust debounce delay as needed

        // Fetch region and budget data and populate dropdowns
        fetchDataAndPopulateDropdowns(budgetJsonUrl);

        // Handle budget code formatting 
        convertToUpperCase("budgetCodeInput");
    }

    // If fundraising type radio options are available on page, then only run handleFundraisingTypeChange function
    if (fundraisingTypeRadioElm) {
        handleFundraisingTypeChange(fundraisingTypeRadioElm);
    }

    // If login to checkout button is available on page, then only run handleLoginButtonClick function
    if (loginButton) {
        loginButton.addEventListener('click', handleLoginButtonClick);
    }

    handleAmountField();
};


/**
 * Handles the display of budget code elements based on the region dropdown value.
 * @param {string} regionDropdownValue - The value of the region dropdown.
 */
const handleDisplayBudgetCode = (regionDropdownValue) => {
    // Check if region is 'Miscellaneous' or empty
    if (regionDropdownValue === 'Miscellaneous') {
        // If region is 'Miscellaneous', hide budget code dropdown and show input box
        budgetCodeDropdownWrapper.style.display = 'none'; // Hide budget code dropdown
        budgetCodeInputWrapper.style.display = 'block';   // Show budget code input box
    } else if (regionDropdownValue === '') {
        // If region is empty, hide both budget code dropdown and input box
        budgetCodeDropdownWrapper.style.display = 'none'; // Hide budget code dropdown
        budgetCodeInputWrapper.style.display = 'none';    // Hide budget code input box
    } else {
        // Otherwise, show budget code dropdown and hide input box
        budgetCodeDropdownWrapper.style.display = 'block'; // Show budget code dropdown
        budgetCodeInputWrapper.style.display = 'none';    // Hide budget code input box
    }
};

/**
 * Handles the display of radio options based on the region dropdown value.
 * @param {string} regionDropdownValue - The value of the region dropdown.
 */
const handleDisplayRadioOptions = (regionDropdownValue) => {
    // Define regions that have dependent form elements
    const regionsToDisplayRadioOptions = ['Fundraising Support Centre'];

    if (regionsToDisplayRadioOptions.includes(regionDropdownValue)) {
        // If region requires radio options, show them
        requester.style.display = 'block';
        supporterCategory.style.display = 'block';
    } else {
        // Otherwise, hide the radio options
        requester.style.display = 'none';
        supporterCategory.style.display = 'none';

        // Remove 'checked' attribute if any radio option is selected
        const radioOptions = document.querySelectorAll('input[type="radio"]');
        radioOptions.forEach(option => {
            if (option.checked) {
                option.checked = false;
            }
        });
    }
};


/**
 * Populates the budget code dropdown with options.
 * @param {Array} budgetCodes - An array of budget codes.
 */
const populateBudgetCodeDropdown = (budgetCodes) => {
    // Get the budget code dropdown element
    const budgetCodeDropdown = document.getElementById('budgetCode');

    // Clear existing options
    budgetCodeDropdown.innerHTML = '';

    // Create and append options for each budget code
    budgetCodes.forEach(code => {
        const option = document.createElement('option');
        option.textContent = code;
        option.value = code;
        budgetCodeDropdown.appendChild(option);
    });
};


/**
 * Populates the region dropdown with options and sets up event listener for change.
 * @param {Array} regions - An array of region objects.
 */
const populateDropdowns = (regions) => {
    // Preprocess regions data into a map for faster lookup
    // Initialize an empty object to store region mappings
    const regionMap = {};
    // Iterate through each region in the 'regions' array
    regions.forEach(region => {
        // Check if the budget code of the region is an array
        // If it is, assign the array to the region name in the regionMap
        // If it's not, convert it to an array and assign it to the region name in the regionMap
        regionMap[region.name] = region.budgetCode instanceof Array ? region.budgetCode : [region.budgetCode];
    });
    
    // Get the region dropdown element
    const regionDropdown = document.getElementById('region');

    // Loop through the regions array and create an option element for each region
    regions.forEach(region => {
        const option = document.createElement('option');
        option.textContent = region.name;
        option.value = region.name;
        regionDropdown.appendChild(option);
    });

    // Add event listener to region dropdown with debounce applied
    regionDropdown.addEventListener('change', debounce(function () {
        // Get the selected region value using `this.value`
        const selectedRegion = this.value;

        // Get the budget codes for the selected region from the preprocessed map
        const selectedBudgetCodes = regionMap[selectedRegion] || [];

        // Populate budget code dropdown with selected budget codes
        populateBudgetCodeDropdown(selectedBudgetCodes);
    }, 300)); // Adjust debounce delay as needed
};


/**
 * Renders an error message by appending it to a paragraph tag inside a form element in the DOM.
 * @param {string} errorMessage - The error message to be rendered.
 */
const renderError = (errorMessage, domElementForError) => {
    // Find the form tag in the DOM
    const formElement = document.querySelector(domElementForError);

    // Create a new paragraph element
    const errorParagraph = document.createElement('p');

    // Add the 'error' class to the paragraph element
    errorParagraph.classList.add('error');

    // Set the error message as the text content of the paragraph
    errorParagraph.textContent = errorMessage;

    // Insert the paragraph before the first child of the form (at the start)
    formElement.insertBefore(errorParagraph, formElement.firstChild);
};

/**
 * Handles errors by logging them to the console.
 * @param {Error} error - The error object.
 */
const handleError = (error) => {
    console.error('Error fetching data:', error);
};


/**
 * Fetches data from the specified URL and populates dropdowns based on the response.
 * @param {string} url - The URL to fetch data from.
 */
const fetchDataAndPopulateDropdowns = (url) => {
    // Fetch data from the specified URL:
    fetch(url)
        .then(handleResponse)
        .then(parseJSON)
        .then(populateDropdowns)
        .catch((error) => {
            // Handle errors gracefully:
            handleError(error);
            // Render a user-friendly error message:
            renderError(`Sorry, we can't load region and budget code data right now. Please try again later.`, '.js-region');
        });
};

/**
 * Character Counter
 * @param {object} inputElement - Input element for which counter should work
 * @param {object} characterCounterElement - Char counter element to be updated 
 * @param {number} maxNumOfChars - Maximum number of character allowed, default is 256
 */
const countCharacters = (inputElement, characterCounterElement, maxNumOfChars = 256) => {
    // Calculate the number of characters entered into the input element
    const numOfEnteredChars = inputElement.value.length;
    // Calculate the number of characters left
    const counter = numOfEnteredChars;
    // Display this number in the span tag
    characterCounterElement.textContent = `${counter} / ${maxNumOfChars}`;
    characterCounterElement.setAttribute('aria-label', `${counter} characters remaining`);
};

const handleCharacterCounter = (reasonTextArea, characterCounterMsg) => {
    // Character Counter for Reason Input
    if (reasonTextArea) {
        // Display remaining text count on page load 
        countCharacters(reasonTextArea, characterCounterMsg);

        // Display remaining character count while typing
        reasonTextArea.addEventListener("input", (e) => {
            countCharacters(reasonTextArea, characterCounterMsg);
        });
    }

}

// If reason text area is available on page, then only run handleCharacterCounter function
if (reasonTextArea) {
    // Apply character counter on reason input
    handleCharacterCounter(reasonTextArea, characterCounterMsg);
}

/**
 * Handles the change event for the fundraising type radio buttons.
 * @param {NodeList} fundraisingTypeRadioElm - The NodeList of fundraising type radio buttons.
 */
const handleFundraisingTypeChange = (fundraisingTypeRadioElm) => {
    // Iterates through each fundraising type radio button
    fundraisingTypeRadioElm.forEach(function (radio) {
        // Adds an event listener for the change event on each radio button
        radio.addEventListener('change', function () {
            // Checks the value of the selected radio button
            if (this.value === 'Other') {
                // Displays the other fundraising type element
                otherFundraisingType.style.display = 'block';
            } else {
                // Hides the other fundraising type element
                otherFundraisingType.style.display = 'none';
            }
        });
    });
};


/**
 * Handles the click event for the login button.
 */
const handleLoginButtonClick = () => {
    // Function logic for handling login button click
    localStorage.setItem('redirectBackToCart', 'true');
};

/**
 * Initializes the cart page by setting event listeners and handling form elements.
 */
const initializeCustomerEntryPage = () => {
    // If create customer account or customer login account form elements are available on page, then only run handlePurposeChange function
    if (signForm) {
        handleLoginRegistrationForm(signForm);
    }

};

/**
 * Handles the login/registration form.
 * @param {HTMLElement} form - The login/registration form element.
 */
const handleLoginRegistrationForm = (form) => {
    // Function logic for handling login/registration form
    // Default redirect path
    let redirectPath = '/';

    // Check if the user clicked login on the cart page and update the redirect path accordingly
    const redirectBackToCart = localStorage.getItem('redirectBackToCart');
    if (redirectBackToCart === 'true') {
        redirectPath = '/cart'; // Set redirect path to the cart page
    }

    // Add a hidden input for the return_to parameter in the login/registration form
    const redirectHiddenInput = document.createElement('input');
    redirectHiddenInput.setAttribute('name', 'return_to');
    redirectHiddenInput.setAttribute('type', 'hidden');
    redirectHiddenInput.value = redirectPath;
    form.appendChild(redirectHiddenInput);

    // Remove the flag from localStorage if the redirect path is set to '/cart'
    if (window.location.pathname === '/cart' && redirectPath === '/cart') {
        localStorage.removeItem('redirectBackToCart');
    }
};


// Conditional loading for performance optimization:
// 1. Cart Page (/cart): Initializes cart-related code.
// 2. Customer Entry Pages: Initializes user registration and login code.
//    - Registration (/account/register)
//    - Login (/account/login)
if (window.location.pathname === '/cart') {
    document.addEventListener('DOMContentLoaded', initializeCartPage);
}

if (window.location.pathname === '/account/register' || window.location.pathname === '/account/login') {
    document.addEventListener('DOMContentLoaded', initializeCustomerEntryPage);
}

const handleBurgerMenuToggle = () => {
    const menuButton = document.querySelector('.burger-container');
    menuButton.addEventListener('click', toggleIconClass)
}

const toggleIconClass = (event) => {
    const button = event.currentTarget;
    const icon = button.querySelector('.mm-icon');
    if(button.ariaExpanded === "false") {
        button.setAttribute('aria-label', 'Close menu');
        icon.className = "mm-icon mm-icon-cross";
    } else {
        button.setAttribute('aria-label', 'Open menu');
        icon.className = "mm-icon mm-icon-hamburgermenu";
    }
}

handleBurgerMenuToggle();
initKeyboardFocus();

