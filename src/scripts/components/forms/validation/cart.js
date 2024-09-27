import $ from "jquery";
import 'jquery-validation';
$.noConflict();
import { initCustomValidationMethods } from "./validator-methods";

export const cartFormRegistration = () => {
    initCustomValidationMethods();
    const form = $('.js-form-cart');

    /**
     * Capture keydown event to prevent unwanted submission of form without validating
     */
    form.on('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const validator = form.validate();
            const isValid = validator.form();
            if (isValid) {
                form.trigger('submit');
            }
        }
    })

    form.validate({
        onkeyup: false, // Disable validation on keyup
        onfocusout: function (element) {
            this.element(element);
        },
        errorElement: "p", // Use <p> element for error messages
        rules: {
            // Staff Form
            "attributes[Region]": "required", // Region field is required
            "attributes[Supporter_Category]": "required", // Supporter category field is required
            "attributes[Requester]": "required", // Requester field is required
            "attributes[Budget_Code]": "required", // Budget code field is required
            "attributes[Budget_Code_Misc]": {
                required: true,
                noHTML: true,
                customPattern: true,
                maxlength: 26
            }, // Budget code input field is required and doesn't accept HTML
            "attributes[Reason]": {
                required: true,
                noHTML: true,
                maxlength: 256
            }, // Reason field is required and doesn't accept HTML
            "agree": "required", // I accept to Terms & Conditions field is required
            // Public, Supporters, Health and Social care professionals Form
            "attributes[What_are_you_using_these_items_for]": "required", // What are you using these items for? field is required
            "attributes[What_event_are_you_raising_for]": "required", // What event are you raising for? field is required
            "attributes[Other_reason_for_event_are_you_raising_for]": {
                required: true,
                noHTML: true,
                maxlength: 100,
                alphaNumericWithSpaces: true,
                notNumbersOnly: true
            }, // Please specify field is required and doesn't accept HTML
            "attributes[What_is_your_fundraising_goal]": { // What is your fundraising goal? field is required and accepts numbers only
                required: true,
                // validFundraisingAmount: true,
                noHTML: true,
                validateAndFormatAmount: true,
                validateNonNegativeNumberWithDot: true
            }
        },
        messages: {
            // Staff Form
            "attributes[Region]": "Please select a region", // Error message for region field
            "attributes[Supporter_Category]": "Please select a supporter category", // Error message for supporter category field
            "attributes[Requester]": "Please select a requester category", // Error message for requester field
            "attributes[Budget_Code]": "Please select a budget code", // Error message for budget code field
            "attributes[Budget_Code_Misc]": {
                required: "Please enter your budget code",
                maxlength: "Please enter less than 50 characters"
            },
            "attributes[Reason]": {
                required: "Please enter the reason for your order"
            }, // Error messages for reason field
            "agree": "Please accept our terms and conditions before continuing", // Error message for Terms & Conditions field
            // Public, Supporters, Health and Social care professionals Form
            "attributes[What_are_you_using_these_items_for]": "Please select your answer", // Error message for What are you using these items for? field
            "attributes[What_event_are_you_raising_for]": "Please select your answer", // Error message for What event are you raising for? field
            "attributes[Other_reason_for_event_are_you_raising_for]": {
                required: "Please enter the event you are raising funds for",
                maxlength: "Please enter less than 100 characters"
            }, // Error message for Other reason for event are you raising for field
            "attributes[What_is_your_fundraising_goal]": { // Error message for What is your fundraising goal? field
                required: "Please enter the fundraising amount",
                validateNonNegativeNumberWithDot: "Please only enter numbers"
            }
        },
        errorPlacement: function (error, element) {
            // IF error element is radio then display the error message at last of the radio option 
            // OTHERWISE just display the error message as next element of error element.
            if (element.is(":radio")) {
                error.insertAfter(element.closest('.form-group').find('.form-check:last'));
            } else {
                error.appendTo(element.parent().closest('div'));
            }
        },
        invalidHandler: function (event, validator) {
            const id = validator.errorList[0].element.id;
            const label = document.querySelector(`[for=${id}]`);
            label.setAttribute('tabindex', 1);
            label.focus();
        },
        focusInvalid: false,
        submitHandler: function (form, event) {
            event.preventDefault();
            // Find all input elements with name attributes starting with "attributes"
            $(form).find("[name^='attributes']").each(function (i, el) {
                // Retrieve the current name attribute
                const currentName = $(this).attr("name");
                // Replace underscores with spaces in the attribute value
                const newName = currentName.replace(/_/g, " ");
                // Update the name attribute with the modified value
                $(this).attr("name", newName);
            });
            // Submit the form
            $(form).validate();
            form.submit();
        }
    });
}
