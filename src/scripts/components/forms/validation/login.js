import $ from "jquery";
import 'jquery-validation';
$.noConflict();
import { initCustomValidationMethods } from "./validator-methods";
import { validateUserRoleRequest } from '../utils/index.js';

/**
 * Validates the login form using jQuery Validator plugin.
 * Initializes custom validation methods for email address and password.
 * Prevents default form submission behavior and handles form submission asynchronously.
 * Displays appropriate error messages for invalid input fields.
 */
export const loginFormValidation = () => {
    initCustomValidationMethods();
    const form = $('#customer_login');
    const submit = form.find('#login-submit');

    // Prevent default submission on click and handle submission manually
    submit.on('click', function (event) {
        event.preventDefault();
        form.trigger('submit');
    });

    // Initialize form validation using jQuery Validator
    form.validate({
        onkeyup: false, // Disable validation on keyup
        onfocusout: false,
        errorElement: 'p', // Use <p> element for error message
        errorPlacement: function (error, element) {
            console.log('errorPlacement', error, element);
            error.appendTo(element.closest('.field').find('.error-message-wrapper'));
        },
        rules: {
            'customer[email]': {
                required: true,
                isValidEmailAddress: true
            },
            'customer[password]': {
                required: true
            }
        },
        messages: {
            'customer[email]': {
                required: 'Please enter your email address.',
                isValidEmailAddress: 'Please enter a valid email address.',
            },
            'customer[password]': {
                required: 'Please enter your password.'
            }
        },
        submitHandler: async function (form, event) {
            event.preventDefault();
            const emailAddress = form.querySelector('#CustomerEmail').value;
            validateUserRoleRequest(window.shop_mac_api_login_url, window.shop_mac_api_key, emailAddress)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                throw err
            })
            .finally(
                form.submit()
            );
        },
    });
};