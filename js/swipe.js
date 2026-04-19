
// Tablet-First UI: Swipe to navigate tabs
document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.querySelector('.tabs, .nav-tabs'); // Also match common alternative tab containers if applicable
    if (!tabsContainer) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: true});

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const swipeThreshold = 50;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        // Only trigger swipe if horizontal movement is greater than vertical movement
        if (Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy)) {
            const tabs = Array.from(document.querySelectorAll('.tab-btn, .nav-btn'));
            if (tabs.length === 0) return;

            const activeIndex = tabs.findIndex(tab => tab.classList.contains('active'));
            if (activeIndex === -1) return;

            if (dx < 0 && activeIndex < tabs.length - 1) {
                // Swipe left -> next tab
                tabs[activeIndex + 1].click();
            } else if (dx > 0 && activeIndex > 0) {
                // Swipe right -> previous tab
                tabs[activeIndex - 1].click();
            }
        }
    }
});
