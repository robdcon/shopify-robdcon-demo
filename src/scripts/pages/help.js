import accordion from '../components/accordion'

const accordions = document.querySelectorAll('.accordion h3');

accordions.forEach((accordionEl) => {
    accordion(accordionEl);
});