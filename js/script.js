function switchLanguage(lang) {
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Update all elements with data attributes
    document.querySelectorAll('[data-nl]').forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = element.dataset[lang];
        } else {
            element.textContent = element.dataset[lang];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const menuLinks = document.querySelectorAll('.side-nav a');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        sideMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sideMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!sideMenu.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            sideMenu.classList.remove('active');
        }
    });
}); 