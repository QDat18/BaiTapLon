document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMobileNav = document.querySelector('.close-mobile-nav');
    const searchIcon = document.querySelector('.search-icon');
    const searchInputContainer = document.querySelector('.search-input-container');
    const closeSearchBtn = document.querySelector('.close-search-btn');
    const mainHeader = document.querySelector('.main-header');
    const body = document.body;

    // Toggle mobile navigation
    hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        body.classList.toggle('no-scroll');
    });

    closeMobileNav.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        body.classList.remove('no-scroll');
    });

    // Toggle submenus in mobile nav
    document.querySelectorAll('.mobile-nav .has-submenu > a').forEach(menuItem => {
        menuItem.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = menuItem.nextElementSibling;
            const isOpen = submenu.classList.contains('open');

            document.querySelectorAll('.mobile-nav .submenu.open').forEach(otherSubmenu => {
                if (otherSubmenu !== submenu) {
                    otherSubmenu.classList.remove('open');
                    otherSubmenu.previousElementSibling.classList.remove('expanded');
                }
            });

            menuItem.classList.toggle('expanded', !isOpen);
            submenu.classList.toggle('open', !isOpen);
        });
    });

    // Toggle search box
    searchIcon.addEventListener('click', () => {
        searchInputContainer.classList.toggle('active');
        if (searchInputContainer.classList.contains('active')) {
            searchInputContainer.querySelector('.search-input').focus();
        }
    });

    closeSearchBtn.addEventListener('click', () => {
        searchInputContainer.classList.remove('active');
    });

    // Handle header scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
            body.classList.add('header-scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
            body.classList.remove('header-scrolled');
        }
    });

    // Close mobile nav or search on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileNav.classList.remove('open');
            body.classList.remove('no-scroll');
            searchInputContainer.classList.remove('active');
        }
    });
});


const translations = {
    vi: {
        twitter: 'Twitter',
        facebook: 'Facebook'
    },
    en: {
        twitter: 'Twitter',
        facebook: 'Facebook'
    }
};

// Ngôn ngữ hiện tại
let currentLanguage = 'vi';

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageOptions');
    dropdown.classList.toggle('show');
}

function changeLanguage(langCode, displayText) {
    // Update the displayed language
    document.querySelector('.current-lang').textContent = displayText;

    // Hide dropdown
    document.getElementById('languageOptions').classList.remove('show');

    // Update current language
    currentLanguage = langCode;

    // Translate all text elements
    translatePage(langCode);

    // Save language preference
    localStorage.setItem('selectedLanguage', langCode);

    console.log('Language changed to:', langCode);
}

function translatePage(langCode) {
    // Translate elements with data-lang attribute
    const elementsToTranslate = document.querySelectorAll('[data-lang]');

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[langCode] && translations[langCode][key]) {
            element.textContent = translations[langCode][key];
        }
    });
}

// Load saved language on page load
function loadSavedLanguage() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'vi';
    const displayText = savedLang === 'vi' ? 'VN' : 'EN';

    document.querySelector('.current-lang').textContent = displayText;
    currentLanguage = savedLang;
    translatePage(savedLang);
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.querySelector('.language-dropdown');
    if (!dropdown.contains(event.target)) {
        document.getElementById('languageOptions').classList.remove('show');
    }
});

// Load language when page loads
document.addEventListener('DOMContentLoaded', loadSavedLanguage);