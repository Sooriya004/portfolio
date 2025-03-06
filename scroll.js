document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('[data-scroll]');

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementBottom = el.getBoundingClientRect().bottom;
        return (
            elementTop <= ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100)) &&
            elementBottom >= 0
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scroll-reveal');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 90)) {
                displayScrollElement(el);
            }
        });
    };

    // Add scroll event listener with throttling
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScrollAnimation();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Initial check for elements in view
    setTimeout(handleScrollAnimation, 100);
}));