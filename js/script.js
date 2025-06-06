// Language switching functionality
function switchLanguage(lang) {
    // Highlight the active flag button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    const langSwitcher = document.querySelector('.lang-switcher');
    langSwitcher.setAttribute('data-lang', lang);

    // Update side menu items
    document.querySelectorAll('.side-nav a').forEach(link => {
        const nlText = link.getAttribute('data-nl');
        const viText = link.getAttribute('data-vi');
        if (nlText && viText) {
            link.textContent = lang === 'nl' ? nlText : viText;
        }
    });
    // Update top nav items
    document.querySelectorAll('.nav-links a').forEach(link => {
        const nlText = link.getAttribute('data-nl');
        const viText = link.getAttribute('data-vi');
        if (nlText && viText) {
            link.textContent = lang === 'nl' ? nlText : viText;
        }
    });

    // Update content if there's a content section
    const contentSection = document.querySelector('.content-section');
    if (contentSection && contentSection.style.display !== 'none') {
        const contentKey = contentSection.getAttribute('data-content');
        if (contentKey) {
            loadContent(contentKey, lang);
        }
    }
}

// Load content from JSON file
async function loadContent(contentKey, lang = 'nl') {
    try {
        // Special handling for Van Hanh Pagode
        if (contentKey === 'vanhanh') {
            document.querySelector('.hero').style.display = 'none';
            document.querySelector('.video-section').style.display = 'block';
            document.querySelector('.content-section').style.display = 'none';
            window.scrollTo(0, 0);
            return;
        }

        // Show loading state
        const contentSection = document.querySelector('.content-section');
        contentSection.innerHTML = '<div class="loading">Loading...</div>';
        contentSection.style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.video-section').style.display = 'none';

        const response = await fetch(`/data/${contentKey}.json`);
        if (!response.ok) throw new Error('Failed to load content');
        
        const data = await response.json();
        const content = data.content[lang];
        contentSection.setAttribute('data-content', contentKey);

        // Helper to render a section only if it has content
        function renderSection(section) {
            if (!section) return '';
            const hasTitle = section.title && section.title.trim() !== '';
            const hasDesc = section.description && section.description.trim() !== '';
            const hasItems = Array.isArray(section.items) && section.items.length > 0;
            if (!hasTitle && !hasDesc && !hasItems) return '';
            return `
                <section>
                    ${hasTitle ? `<h2>${section.title}</h2>` : ''}
                    ${hasDesc ? `<p>${section.description}</p>` : ''}
                    ${hasItems ? `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
                </section>
            `;
        }

        contentSection.innerHTML = `
            <h1>${data.title[lang]}</h1>
            ${renderSection(content.objectives)}
            ${renderSection(content.activities)}
            ${renderSection(content.membership)}
            ${renderSection(content.contact)}
        `;

        // Scroll to top
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error loading content:', error);
        const contentSection = document.querySelector('.content-section');
        if (contentSection) {
            contentSection.innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    }
}

function setupMenuEventListeners() {
    // Set initial language
    const langSwitcher = document.querySelector('.lang-switcher');
    const initialLang = langSwitcher ? (langSwitcher.getAttribute('data-lang') || 'nl') : 'nl';
    switchLanguage(initialLang);

    // Language switcher flag buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            switchLanguage(newLang);
        });
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const mainContainer = document.querySelector('.main-container');
    const overlay = document.querySelector('.overlay');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (sideMenu) sideMenu.classList.toggle('active');
            if (mainContainer) mainContainer.classList.toggle('menu-open');
            hamburger.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
    }

    // Handle menu link clicks
    if (sideMenu) {
        sideMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const contentKey = link.getAttribute('data-content');
                if (contentKey) {
                    const currentLang = document.querySelector('.lang-switcher').getAttribute('data-lang');
                    loadContent(contentKey, currentLang);
                }
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    if (hamburger) hamburger.classList.remove('active');
                    sideMenu.classList.remove('active');
                    if (mainContainer) mainContainer.classList.remove('menu-open');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });
    }

    // Close menu when clicking outside
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (sideMenu) sideMenu.classList.remove('active');
            if (mainContainer) mainContainer.classList.remove('menu-open');
            overlay.classList.remove('active');
        });
    }

    // Handle top nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const nlText = link.getAttribute('data-nl');
            const viText = link.getAttribute('data-vi');
            const contentKey = link.getAttribute('data-content');
            // Home link
            if ((nlText && nlText.toLowerCase() === 'home') || (viText && viText.toLowerCase() === 'trang chủ')) {
                // Go to root
                window.location.href = '/';
                return;
            } else if (contentKey) {
                e.preventDefault();
                const currentLang = document.querySelector('.lang-switcher').getAttribute('data-lang');
                loadContent(contentKey, currentLang);
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.renderMenusPromise.then(setupMenuEventListeners);
    });
} else {
    window.renderMenusPromise.then(setupMenuEventListeners);
} 