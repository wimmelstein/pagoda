console.log("menus.js loaded");
function runMenusWhenReady() {
    async function renderMenus() {
        // Render left (side) menu
        const sideNavUl = document.querySelector('.side-nav ul');
        if (sideNavUl) {
            const leftMenuRes = await fetch('/data/left-menu.json');
            const leftMenu = await leftMenuRes.json();
            console.log('Left menu loaded:', leftMenu);
            sideNavUl.innerHTML = leftMenu.map(item =>
                `<li><a href=\"#\" data-nl=\"${item['data-nl']}\" data-vi=\"${item['data-vi']}\" data-content=\"${item['data-content']}\">${item['data-nl']}</a></li>`
            ).join('');
        } else {
            console.warn('No .side-nav ul found');
        }
        // Render top (nav) menu
        const navLinksUl = document.querySelector('.nav-links');
        if (navLinksUl) {
            const topMenuRes = await fetch('/data/top-menu.json');
            const topMenu = await topMenuRes.json();
            console.log('Top menu loaded:', topMenu);
            navLinksUl.innerHTML = topMenu.map(item => {
                const attrs = [
                    `href=\"${item.href || '#'}\"`,
                    `data-nl=\"${item['data-nl']}\"`,
                    `data-vi=\"${item['data-vi']}\"`
                ];
                if (item['data-content']) attrs.push(`data-content=\"${item['data-content']}\"`);
                return `<li><a ${attrs.join(' ')}>${item['data-nl']}</a></li>`;
            }).join('');
        } else {
            console.warn('No .nav-links found');
        }
    }
    window.renderMenusPromise = renderMenus();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runMenusWhenReady);
} else {
    runMenusWhenReady();
} 