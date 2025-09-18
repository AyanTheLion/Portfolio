document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectPage = card.getAttribute('data-project') + '.html';
            window.location.href = projectPage;
        });
    });

    // Optional: Add subtle mouse movement parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        projectCards.forEach(card => {
            const xOffset = (mouseX - 0.5) * 20;
            const yOffset = (mouseY - 0.5) * 20;

            card.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1)`;
        });
    });
});