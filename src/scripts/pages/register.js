import { togglePasswordVisibility, addRedirectInput } from '../components/forms/utils';
import { registerFormValidation } from '../components/forms/validation/register';

/**
 * Initializes the cart page by setting event listeners and handling form elements.
*/
const initializeCustomerEntryPage = () => {
    console.log('Registration Page Init')
    const roleOptions = document.querySelectorAll('[name="customer[role]"]');
    const togglePassword = document.querySelectorAll(".toggle-password");
    const roleOptionsLegend = document.querySelector('#customer_role');
    roleOptionsLegend.setAttribute('tabindex', '1');
    roleOptionsLegend.focus();
    roleOptionsLegend.addEventListener('blur', (e) => {
        e.target.removeAttribute('tabindex');
    })
    setTimeout(() => {checkRoleOption(roleOptions)},100); // If the user navigates to the page and the option is preselected, handle the display of the form questions and email help text
    handleRoleOptionSelection(roleOptions);
    togglePassword.forEach(toggle => {
        togglePasswordVisibility(toggle);
    })
    registerFormValidation(); // Custom JQuery validate form validation
};

/**
 * Handles the selection of a role option by adding event listeners to each role option input element.
 * When a role option is changed, this function calls setCustomerTags, displayFormQuestions, and handleEmailHelpText functions.
 * 
 * @param {NodeList} roleOptions - The list of role option input elements to add event listeners to
 */
function handleRoleOptionSelection(roleOptions) {
    roleOptions.forEach(input => {
        input.addEventListener('change', (e) => {
            setCustomerTags(e.target.value);
            displayFormQuestions();
            handleEmailHelpText(e.target);
            resetFormValidation();
        })
    })
}

/**
 * Sets the value of the customer tags input field based on the selected value.
 * 
 * @param {string} value - The value to set for the customer tags input field.
 * @returns {void}
 */
function setCustomerTags(value) {
    const customerTags = document.querySelector('[name="customer[tags]"]');
    customerTags.value = `chosenUserType=${value}`;
}

/**
 * Displays the form questions by removing the 'sr-only' class from the question wrapper element.
 */
function displayFormQuestions() {
    const questionWrapper = document.querySelector('.js-question-wrapper');
    questionWrapper.classList.remove('sr-only');
}

/**
 * Updates the email help text based on the selected role option.
 * 
 * @param {HTMLElement} roleOption - The role option element triggering the update.
 * @returns {void}
 */
function handleEmailHelpText(roleOption) {
    let role = roleOption.value;
    let message = roleOption.dataset.message;
    const emailInput = document.querySelector('#CustomerEmail');
    const emailHelpText = document.querySelector('.js-email-help-text');
    const errorElement = emailInput.closest('.field').querySelector('.error-message-wrapper .error');
    errorElement && (errorElement.style.display = 'none');
    emailInput.dataset.role = role;
    emailInput.dataset.message = message;
    if (message !== '') {
        emailHelpText.innerText = message;
        emailHelpText.style.display = 'block';
    } else {
        emailHelpText.style.display = 'none';
    }
}

/**
 * Check the role options to display form questions and handle email help text for the selected role.
 * Handles display of the questions in the case that a role option is already checked.
 * @param {NodeList} roleOptions - The list of role options checkboxes to be checked.
 * @returns {boolean} - Returns true if at least one role option is checked, otherwise false.
 */
function checkRoleOption(roleOptions) {
    let checked = false;
    roleOptions.forEach(input => {
        if (input.checked) {
            displayFormQuestions();
            handleEmailHelpText(input);
        }
    })
    return checked;
}

/**
 * Resets the validation state of a form with the ID 'CustomerEmail' using jQuery validation.
 */
function resetFormValidation() {

    const form = document.querySelector('#create_customer');
    const validator = $(form).validate();
    validator.resetForm();
    Array.from(document.querySelectorAll(".error-message-wrapper")).forEach(errorWrapper => {
        if(!errorWrapper.firstChild) return;
        while(errorWrapper.firstChild) {
            errorWrapper.removeChild(errorWrapper.firstChild);
        }
    })
}

initializeCustomerEntryPage();





