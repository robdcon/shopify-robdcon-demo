document.addEventListener("DOMContentLoaded", function() {
    // Select the product description div with the 'digital-only' class
    const productDescriptionElement = document.querySelector('.product-description.digital-only');

    if (productDescriptionElement) {
        // Get all anchor tags inside the product description
        const anchorElements = productDescriptionElement.querySelectorAll('a');

        // Filter anchors that contain the word 'download'
        const downloadAnchors = Array.from(anchorElements).filter(anchor => 
            anchor.textContent.toLowerCase().includes('download')
        );

        // Check if there are any download-related anchor tags
        if (downloadAnchors.length > 0) {
            // Loop through the filtered anchors
            downloadAnchors.forEach((anchor, index) => {
                // Add the 'btn' class to every download-related anchor
                anchor.classList.add('btn');

                // Add 'btn-primary' to the first download-related anchor, 'btn-secondary' to the rest
                if (index === 0) {
                    anchor.classList.add('btn-primary');
                } else {
                    anchor.classList.add('btn-secondary');
                }
            });
        }
    }
});
