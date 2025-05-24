// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wrap emojis in sections with a span for animation
    document.querySelectorAll('h2').forEach(heading => {
        heading.innerHTML = heading.innerHTML.replace(/([\u{1F300}-\u{1F9FF}])/gu, '<emoji>$1</emoji>');
    });

    // Add smooth scrolling with a fun bounce effect
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                target.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    target.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });

    // Add typing animation to the header text
    const headerText = document.querySelector('header p');
    const originalText = headerText.textContent;
    headerText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < originalText.length) {
            headerText.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing animation when the header is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(headerText);

    // Add hover sound effect to buttons (subtle click sound)
    const buttons = document.querySelectorAll('.button');
    const clickSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAYZxhxzGAAAAAAAAAAAAAAAAAAAA//tQxAAB0pIBLgAAAgAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBmD0pIBLgAAAgAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxCmD0pIBLgAAAgAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            clickSound.currentTime = 0;
            clickSound.volume = 0.1;
            clickSound.play().catch(() => {}); // Ignore autoplay restrictions
        });
    });

    // Add scroll reveal animation for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
}); 