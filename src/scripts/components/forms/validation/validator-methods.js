/**
* Initializes custom validation methods for jQuery Validator.
* @returns {void}
*/
export const initCustomValidationMethods = () => {
   /**
     * Validates if the input value is a valid email address that matches the regexpression.
     * @param {string} value - The value to be validated.
     * @returns {boolean} - Returns true if the value contains no HTML, false otherwise.
     */
   $.validator.addMethod('isValidEmailAddress', function (value) {
       const isValidEmailAddress = !!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value));
       return isValidEmailAddress;
   });

   /**
     * Validates if the input value is at least 8 characters long.
     * @param {string} value - The value to be validated.
     * @param {HTMLElement} element - The element being validated.
     * @returns {boolean} - Returns true if the value contains no HTML, false otherwise.
     */
   $.validator.addMethod('isValidPassword', function (value, element) {
       return value.length >= 8;
   });

   /**
     * Validates if the input value matches the password field value.
     * @param {string} value - The value to be validated.
     * @param {HTMLElement} element - The element being validated.
     * @returns {boolean} - Returns true if the value contains no HTML, false otherwise.
     */
   $.validator.addMethod('isMatchingPassword', function (value, element) {
       const passwordField = document.querySelector('[name="customer[password]"]');
       const passwordVal = passwordField.value;
       return (value === passwordVal);
   });

    /**
     * Validates if the value contains no HTML.
     * @param {string} value - The value to be validated.
     * @param {HTMLElement} element - The element being validated.
     * @returns {boolean} - Returns true if the value contains no HTML, false otherwise.
     */
    $.validator.addMethod("noHTML", function (value, element) {
       return this.optional(element) || !/<\w+/.test(value);
   }, "Please use valid plain text only");

   /**
   * Validates if the value contains letters, numbers, and spaces but no special characters.
   * @param {string} value - The value to be validated.
   * @param {HTMLElement} element - The element being validated.
   * @returns {boolean} - Returns true if the value contains letters, numbers, and spaces only, false otherwise.
   */
   $.validator.addMethod("alphaNumericWithSpaces", function (value, element) {
       return this.optional(element) || /^[A-Za-z0-9\s]+$/.test(value);
   }, "Please enter a combination of letters, numbers, and spaces; special characters are not allowed");

   /**
    * Validates if the value contains a combination of numbers and letters, not just the number.
    * @param {string} value - The value to be validated.
    * @param {HTMLElement} element - The element being validated.
    * @returns {boolean} - Returns true if the value contains a combination of letters and numbers, false otherwise.
    */
   $.validator.addMethod("notNumbersOnly", function (value, element) {
       return this.optional(element) || !/^\d+$/.test(value);
   }, "Please enter a combination of letters and numbers, not numbers only");

   /**
    * Validates if the value contains only numbers and at most one dot and is non-negative.
    * @param {string} value - The value to be validated.
    * @param {HTMLElement} element - The element being validated.
    * @returns {boolean} - Returns true if the value is a valid positive number, false otherwise.
    */
   $.validator.addMethod("validateNonNegativeNumberWithDot", function (value, element) {
       return /^\d*(?:\.\d+)?$/.test(value) && parseFloat(value) >= 0;
   }, "Please enter only a valid positive number");

   /**
    * Validates and formats the fundraising amount.
    * @param {string} value - The value to be validated and formatted.
    * @param {HTMLElement} element - The element being validated.
    * @returns {boolean} - Returns true since this method is used for validation logic only.
    */
   $.validator.addMethod("validateAndFormatAmount", function (value, element) {
       // Remove leading zeros
       let updatedAmount = value.replace(/^0+(?!$)/, '');

       // If the amount contains a dot
       if (updatedAmount.includes('.')) {
           // Split the amount into integer and fractional parts
           let [integerPart, fractionalPart] = updatedAmount.split('.');

           if (fractionalPart.length > 2) {
               // Take only the first three digits after the dot
               fractionalPart = fractionalPart.slice(0, 3);

               // If the third digit is greater than or equal to 5, round up
               if (parseInt(fractionalPart.charAt(2), 10) >= 5) {
                   // Increment the last digit of the integerPart part by 1
                   if (fractionalPart >= 995) {
                       integerPart = parseInt(integerPart) + 1;
                       fractionalPart = 0;
                   } else { // Increment the last digit of the fractional part by 10
                       fractionalPart = parseInt(fractionalPart) + 10;
                   }
               }
               // Get two digits of fractionalPart
               fractionalPart = parseInt(fractionalPart.toString().substring(0, 2));
           }

           if (integerPart === '') {
               integerPart = '0';
           }

           // Reconstruct the updated amount with rounded fractional part
           updatedAmount = integerPart + '.' + fractionalPart;
       }

       // Update the value of the input field with the updated amount
       $(element).val(updatedAmount);

       // Return true since this method is used for validation logic only
       return true;
   });

   // Add custom method for validating budget code pattern
   $.validator.addMethod("customPattern", function (value, element) {
       const pattern = /^\d{6}\.[A-Z0-9]{7,11}\.[A-Z0-9]{10,11}$/;
       return this.optional(element) || pattern.test(value);
   }, "Please enter a valid format for example 'XXXXXX.XXXXXXX.XXXXXXXXXXX' i.e 123456.123ABCD.123ABCDEFGH");
}