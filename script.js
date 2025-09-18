document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    // Card click → navigate to project page
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectPage = card.getAttribute('data-project') + '.html';
            window.location.href = projectPage;
        });
    });

    // Subtle parallax effect (works with hover)
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        projectCards.forEach(card => {
            const xOffset = mouseX * 10; // reduced so it’s subtle
            const yOffset = mouseY * 10;

            // Apply tilt effect instead of overriding hover scale
            card.style.transform = `translate(${xOffset}px, ${yOffset}px) rotateX(${yOffset}deg) rotateY(${xOffset}deg)`;
        });
    });

    // Reset transform when leaving window (prevents cards being stuck tilted)
    document.addEventListener('mouseleave', () => {
        projectCards.forEach(card => {
            card.style.transform = "translate(0, 0) rotateX(0) rotateY(0)";
        });
    });
});