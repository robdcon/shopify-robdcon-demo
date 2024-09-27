import { togglePasswordVisibility } from '../components/forms/utils';
import { loginFormValidation } from '../components/forms/validation/login.js';

/**
 * Initializes the login page by setting up event listeners and functionality for various elements.
 * - Retrieves the password field, toggle password button, reset password link, recover email field, cancel forgot password link, and email input field.
 * - Calls the loginFormValidation function to validate the login form.
 * - Calls the togglePasswordVisibility function to toggle password visibility.
 * - Sets up event listeners for resetting password focus and canceling forgot password focus.
 */
const initLoginPage = () => {
    console.log('Init Login');
    const form = document.querySelector('#customer_login');
    console.log(form);
    const togglePassword = document.querySelector(".toggle-password");
    const resetPasswordLink = document.getElementById("RecoverPassword");
    const recoverEmailField = document.getElementById("RecoverEmail");
    const cancelForgotPassword = document.getElementById("HideRecoverPasswordLink");
    const emailInput = document.getElementById("CustomerEmail");
    const heading = form.querySelector('h1');
    
    loginFormValidation();
    togglePasswordVisibility(togglePassword);
    handleLinkClickFocus(resetPasswordLink, recoverEmailField);
    handleLinkClickFocus(cancelForgotPassword, emailInput);
}

/**
 * Handles the focus behavior when a link is clicked.
 * 
 * @param {Element} link - The link element that triggers the focus behavior.
 * @param {Element} field - The field element to be focused after a delay.
 * @returns {void}
 */
function handleLinkClickFocus(link, field) {
    link.addEventListener("click", function() {
        setTimeout(() => {
            field.focus();
        }, 100);
    });
}

initLoginPage();