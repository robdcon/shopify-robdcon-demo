'use strict';

/**
 * Function that creates an accordion behavior for a given button element.
 * 
 * @param {Element} buttonEl - The button element that triggers the accordion behavior.
 * @returns {Object} An object containing functions to open and close the accordion panel.
 */
const accordion = (buttonEl) => {
    const controlsId = buttonEl.getAttribute('aria-controls');
    const contentEl = document.getElementById(controlsId);
    const sectionId = buttonEl.closest('.accordion').id;

    if (!contentEl) {
        console.error('Content element not found');
        return;
    }
    let open = buttonEl.getAttribute('aria-expanded') === 'true';
    let isToggling = false;

    const toggle = (panelOpen) => {
        if (panelOpen === open || isToggling) {
            return;
        }
        isToggling = true;
        open = panelOpen;
        buttonEl.setAttribute('aria-expanded', `${open}`);
        contentEl.toggleAttribute('hidden', !open);
        setTimeout(() => {
            isToggling = false;
            checkSectionAccordionStates(sectionId);
        }, 300); // Debounce time in milliseconds
    }

    const openPanel = () => {
        toggle(true);
    }

    const closePanel = () => {
        toggle(false);
    }

    const isOpen = () => {
        return open;
    }

    buttonEl.addEventListener('click', () => {
        toggle(!open);
    });

    return {
        openPanel,
        closePanel,
        isOpen
    };
}

/**
 * Updates the state of the accordion sections based on the provided section ID.
 * 
 * @param {string} sectionId - The ID of the section containing the accordion elements.
 * @returns {void}
 */
const checkSectionAccordionStates = (sectionId) => {
    const accordions = window.accordions[sectionId];
    const toggleButton = document.querySelector(`[aria-controls='${sectionId}']`);

    if (!toggleButton) {
        console.error('Toggle button element not found');
        return;
    }

    const toggleButtonTextEl = toggleButton.querySelector('.button-text');

    try {
        const isExpanded = Object.values(accordions).some(accordion => accordion.isOpen());

        toggleButton.setAttribute('aria-expanded', isExpanded);
        const toggleButtonText = isExpanded ? 'Close all sections' : 'Open all sections';
        if (toggleButtonTextEl) {
            toggleButtonTextEl.innerText = toggleButtonText;
        }
        toggleButton.setAttribute('aria-label', toggleButtonText);
    } catch (error) {
        console.error('Error in checkSectionAccordionStates:', error);
    }
}

/**
 * Initializes multiple accordion sections on a page.
 * 
 * @param {NodeList} accordions - The list of accordion sections to initialize
 * @returns {void}
 */
const initAccordions = (accordions) => {
    accordions.forEach((accordionSection) => {
        let sectionId = accordionSection.id;
        let accordions = accordionSection.querySelectorAll('.accordion-trigger');
        window.accordions[sectionId] = {};
        accordions.forEach(accordionEl => {
            let accordionId = accordionEl.id;
            window.accordions[sectionId][accordionId] = accordion(accordionEl);
        })
    });
}

/**
 * Handles toggling the accordion panels based on the button state.
 * 
 * @param {Element} button - The button element triggering the toggle action.
 * @param {boolean} open - The state indicating whether to open or close the panels.
 */
const handleToggle = (button, open) => {
    try {
        const sectionId = button.getAttribute('aria-controls');
        const accordions = window.accordions[sectionId];

        const togglePanel = open ? 'openPanel' : 'closePanel';
        Object.entries(accordions).forEach(([key, accordion]) => {
            accordion[togglePanel]();
        });

        button.setAttribute('aria-expanded', `${open}`);
        const buttonText = open ? 'Close all sections' : 'Open all sections';
        const buttonTextEl = button.querySelector('.button-text');
        if (buttonTextEl) {
            buttonTextEl.innerText = buttonText;
        }
        button.setAttribute('aria-label', buttonText);
    } catch (error) {
        console.error('Error in handleToggle:', error);
    }
}

/**
 * Initializes the toggle functionality for a list of elements.
 * 
 * @param {NodeList} toggles - The list of elements to be toggled
 */
const initToggleAll = (toggles) => {
    toggles.forEach(toggle => {
        let button = toggle.querySelector('button');

        if (button) {
            const handleClick = () => {
                let isOpen = button.getAttribute('aria-expanded') === 'true';
                handleToggle(button, !isOpen);
            };

            let debounceTimeout;
            button.addEventListener('click', () => {
                if (debounceTimeout) {
                    clearTimeout(debounceTimeout);
                }
                debounceTimeout = setTimeout(handleClick, 300); // Debounce time in milliseconds
            });
        }
    });
}

const accordions = document.querySelectorAll('.accordion');
const toggles = document.querySelectorAll('.toggle-all-sections');

window.accordions = {}
initAccordions(accordions);
initToggleAll(toggles);

export default accordion;