import $ from "jquery";
import 'jquery-validation';
$.noConflict();
import { initCustomValidationMethods } from "./validator-methods";
import { setFocusAndScrollToElement, validateUserRoleRequest, handleAssistiveTechnologyMessaging, handleEmailInput, showLoader } from '../utils/index.js';


/**
 * Function to handle form validation for the registration form.
 * Initializes custom validation methods and sets up form validation using jQuery Validator.
 * Prevents form submission if validation fails and displays appropriate error messages.
 */
export const registerFormValidation = () => {
    
    initCustomValidationMethods();

    const form = $('#create_customer');
    const $submit = form.find('[type="submit"]');
    const emailInput = document.querySelector('#CustomerEmail')

    // Prevent normal submission on the click event to handle submission manually
    $submit.on('click', function (event) {
        event.preventDefault();
        const validator = form.validate();
        const isValid = validator.form();
        if (isValid) {
            form.trigger('submit');
        }
    });

    // Initialize form validation using jQuery Validator
    form.validate({
        onkeyup: false, // Disable validation on keyup
        onfocusout: async function (element) {
            let isValid = this.element(element);
            if (isValid && (element.dataset?.role === 'staff' || element.dataset?.role === 'professional')) {
                const type = document.querySelector("[name='customer[role]']:checked").value;
                showLoader(true);
                validateUserRoleRequest(window.shop_mac_api_register_url, window.shop_mac_api_key, element.value, type)
                    .then(res => res.json())
                    .then(res => {
                        const isValidEmail = ['true', true, 1].includes(res);
                        handleEmailInput(isValidEmail, element);
                    })
                    .catch(err => {
                        throw err;
                    })
                    .finally(() => {
                        showLoader(false);
                    });
            }
        },
        errorElement: "p", // Use <p> element for error messages
        rules: {
            'customer[role]': 'required',
            'customer[first_name]': 'required',
            'customer[last_name]': 'required',
            'customer[email]': {
                required: true,
                isValidEmailAddress: true

            },
            'customer[password]': {
                required: true,
                isValidPassword: true
            },
            'password_confirm': {
                required: true,
                isMatchingPassword: true
            }
        },
        messages: {
            'customer[role]': 'Please select a role.',
            'customer[first_name]': 'First name is required.',
            'customer[last_name]': 'Last name is required.',
            'customer[email]': {
                required: 'Please enter your email address.',
                isValidEmailAddress: 'Please enter a valid email address.'
            },
            'customer[password]': {
                required: 'Please enter a password.',
                isValidPassword: 'Password must be at least 8 characters long.'
            },
            'password_confirm': {
                required: 'Please confirm your password.',
                isMatchingPassword: 'Passwords do not match.'
            }
        },
        errorPlacement: function (error, element) {
            handleAssistiveTechnologyMessaging(error, element[0]);
            // IF error element is radio then display the error message at last of the radio option 
            // OTHERWISE just display the error message as next element of error element.
            if (element.is(":radio")) {
                error.appendTo(element.closest('.form-group').find('.error-message-wrapper'));
            } else if (element.attr('type') === 'email' && element.is('[name="customer[email]"]')) {
                error.appendTo(element.closest('.field').find('.error-message-wrapper'));
                element.closest('.field').find('.js-email-help-text').css('display', 'none');
            } else {
                element.closest('.field').find('.error-message-wrapper').empty();
                error.appendTo(element.closest('.field').find('.error-message-wrapper'));
            }
        },
        unhighlight: function (element) {
            $(element).removeAttr('aria-describedby');
            $(element).removeClass('error');
        },
        invalidHandler: function (event, validator) {
            const id = validator.errorList[0].element.id;
            const label = document.querySelector(`[for=${id}]`);
            label.setAttribute('tabindex', 1);
            label.focus();
        },
        focusInvalid: false,
        /**
         * Asynchronous function to handle form submission, validate user role request,
         * show loader, and handle email input based on the response.
         * 
         * @param {Element} form - The form element being submitted
         * @param {Event} event - The event object triggering the form submission
         */
        submitHandler: async function (form, event) {
            event.preventDefault();
            const type = document.querySelector("[name='customer[role]']:checked").value;
            if(type === "staff" || type === "professional") {
                showLoader(true);
                validateUserRoleRequest(window.shop_mac_api_register_url, window.shop_mac_api_key, emailInput.value, type)
                    .then(res => res.json())
                    .then(res => {
                        const isValidEmail = ['true', true, 1].includes(res);
                        handleEmailInput(isValidEmail, emailInput);
                        isValidEmail ? form.submit() : setFocusAndScrollToElement.call(emailInput, 200);
                    })
                    .catch(err => {
                        throw err;
                    })
                    .finally(() => {
                        showLoader(false);
                    });
            } else {
                form.submit();
            }
        }
    });
};



