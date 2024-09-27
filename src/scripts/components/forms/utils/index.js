
/**
 * Function to toggle the visibility of a password input field when clicking on an eye icon.
 * If using keyboard, the target is the button, so change target to child 'i' element.
 * 
 * @param {HTMLInputElement} passwordInput - The password input field element to toggle visibility for.
 * @param {HTMLElement} togglePassword - The eye icon element that toggles the password visibility.
 * @returns {void}
 */
export const togglePasswordVisibility = (togglePassword) => {
    const passwordWrapper = togglePassword.closest('.password-wrapper');
    const passwordInput = passwordWrapper.querySelector('[type="password"]');
    const handleTogglePassword = (event) => {
        const el = event.target.tagName === "SPAN" ? event.target.querySelector("i") : event.target;

        // Set the new type of the password input field
        passwordInput.type = (passwordInput.type === "password") ? "text" : "password";

        let iconClass = passwordInput.type === "password" ? 'mm-icon mm-visible' : 'mm-icon mm-invisible';

        // Set class of icon
        el.className = iconClass;
        
        // If the password input field is now visible, announce it to screen readers
        if (passwordInput.type === "text") {
            passwordInput.setAttribute("aria-label", "Password is visible");
            el.parentElement.setAttribute('aria-label', 'Hide Password');
        } else {
            passwordInput.removeAttribute("aria-label");
            el.parentElement.setAttribute('aria-label', 'Show Password');
        }

        // Set focus on the password input field for better accessibility
        passwordInput.focus();

    }
    // Add a click event listener to the eye icon
    togglePassword.addEventListener("click", (event) => {
        handleTogglePassword(event)
    });
    togglePassword.addEventListener("keypress", (event) => {
        if(event.key === 'Enter' || event.key === ' ') {
            handleTogglePassword(event)
        }
    });
}

/**
 * Serialize the form data into a JSON string.
 * 
 * @param {HTMLFormElement} form - The form element to serialize.
 * @returns {string} - A JSON string representing the form data.
 */
export const serializeForm = (form) => {
    let formData = {};
    const formElements = form.elements;
    for (const element of formElements) {
        if (element.type !== "submit") {
            //For radio inputs, only add value if it's checked
            if (element.type === "radio") {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else {
                formData[element.name] = element.value;
            }
        }
    }

    return JSON.stringify(formData);
}

/**
 * Sends a POST request to the specified URL with the provided form data.
 * 
 * @param {string} url - The URL to send the POST request to.
 * @param {FormData} formData - The data to be sent in the request body.
 * @returns {Promise<Response>} A Promise that resolves to the Response object representing the result of the POST request.
 * @throws {Error} If an error occurs during the POST request.
 */
export const post = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Adds a hidden input field to a form with the specified redirect URL.
 * 
 * @param {HTMLFormElement} form - The form element to which the input field will be added.
 * @param {string} redirectUrl - The URL to which the form will redirect upon submission.
 */
export const addRedirectInput = (form, redirectUrl) => {
    const redirectBackToCart = localStorage.getItem('redirectBackToCart');
    if (redirectBackToCart === 'true') {
        redirectUrl = '/cart'; // Set redirect path to the cart page
        localStorage.removeItem('redirectBackToCart'); // remove setting once input has been added
    }
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'return_to';
    input.value = redirectUrl;
    form.appendChild(input);
}
/**
 * Sends a POST request to a specified URL with custom headers including an API key, user type, and email.
 * Logs the response or any errors to the console.
 * 
 * @param {string} url - The endpoint to which the POST request is sent.
 * @param {string} key - The API key for authentication.
 * @param {string} email - The email of the user.
 * @param {string} type - The type of the user.
 */
export const validateUserRoleRequest = (url, key, email, type="") => {
    const headers = new Headers();
    headers.append("x-functions-key", key);
    headers.append("userType", type);
    headers.append("email", email);

    const data = JSON.stringify({ 'emailAddress': email, 'userType': type })

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: data,
    };

    return fetch(url, requestOptions);
}

/**
 * Sets focus on the element and scrolls to it with a specified offset. 
 * The offset is for situations where a header element may obscure the element to scroll into view. 
 * If this does not exist, you can supply ) or leave blank;
 * Usage: setFocusAndScrollToElement.call([element to scroll to], [number of pixels to offset by])
 * @param {number} offset - The offset value to adjust the scroll position.
 * @returns {void}
 */
export function setFocusAndScrollToElement(offset) {
    const offsetPixels = offset || 0;
    const element = this;
    try {
        window.scrollTo(0, element.offsetTop - offsetPixels);
        element.focus();
    }
    catch(err) {
        console.error('Could not scroll or focus to element.', err);
    }
}

/**
 * Updates the accessibility attributes of an element to associate it with an error message element.
 * 
 * @param {HTMLElement} error - The error message element to be associated with the element.
 * @param {HTMLElement} element - The element to update accessibility attributes for.
 */
export function handleAssistiveTechnologyMessaging(error, element) {
    const elLabel = element.id;
    const errorLabel = `${elLabel}-error`;
    $(error).attr('id', errorLabel);
    $(element).attr('aria-describedby', errorLabel);
}


/**
 * Toggles the visibility of a loader element on the webpage.
 * @param {boolean} isVisible - Determines whether the loader should be displayed (true) or hidden (false).
 */
export const showLoader = (isVisible) => {
    const loader = document.querySelector('.loader');
    loader.style.display = isVisible ? 'block' : 'none';
};

/**
 * Creates an error message element with the specified custom message.
 * 
 * @param {string} customMessage - The custom message to be displayed in the error message element.
 * @returns {HTMLElement} - The error message element created with the custom message.
 */
export const createErrorMessage = (customMessage) => {
    const el = document.createElement('p');
    el.className = "error";
    const textNode = document.createTextNode(customMessage);
    el.append(textNode);
    return el;
}

/**
 * Updates the display of validation messages for an email input field based on its validity.
 * @param {boolean} isValid - A boolean indicating whether the email is valid.
 * @param {HTMLElement} element - The DOM element representing the email input field.
 */
export const handleEmailInput = (isValid, element) => {
    console.log('Email is valid:', isValid);
    const field = element.parentElement;

    const errorMessage = createErrorMessage(`This email address is not valid. ${element.dataset.message}`);
    const emailHelp = field.querySelector('.js-email-help-text');
    const emailError = field.querySelector('.error-message-wrapper');
    emailError.firstChild && emailError.removeChild(emailError.firstChild); // Remove message if there is one already present

    if (emailHelp && emailError) {
        if (!isValid) {
            emailError.append(errorMessage);
            emailHelp.style.display = 'none';
            handleAssistiveTechnologyMessaging(errorMessage, element)
        } else {
            while (emailError.firstChild) {
                emailError.removeChild(emailError.firstChild);
            }
            emailHelp.style.display = 'block';
        }
    }
}



