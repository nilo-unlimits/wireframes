// Clean Unlimits App - Main JavaScript

// Zero State Toggle
let isZeroState = false;

// Header and Navigation Scroll Behavior
function initializeScrollBehavior() {
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (!mainContent || !header || !bottomNav) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 10;
    
    mainContent.addEventListener('scroll', function() {
        const scrollTop = mainContent.scrollTop;
        const scrollDelta = Math.abs(scrollTop - lastScrollTop);
        
        if (scrollDelta < scrollThreshold) return;
        
        const floatingAI = document.getElementById('floatingAI');
        const currentPage = document.querySelector('.page.active')?.id;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide header and nav
            header.classList.add('hidden');
            bottomNav.classList.add('hidden');
            
            // Show floating FS on explore/dreams/challenges/meditation when menu is hidden
            if (floatingAI && (currentPage === 'explore' || currentPage === 'dreams' || currentPage === 'challenges' || currentPage === 'meditation')) {
                floatingAI.classList.add('visible');
            }
        } else {
            // Scrolling up - show header and nav
            header.classList.remove('hidden');
            bottomNav.classList.remove('hidden');
            
            // Hide floating FS when menu is visible
            if (floatingAI) {
                floatingAI.classList.remove('visible');
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Page content loader
async function loadPageContent(pageId) {
    try {
        let fileName = `pages/${pageId}.html`;
        
        // Check if we should load zero state version for supported pages
        if (isZeroState && ['explore', 'dreams', 'challenges', 'meditation'].includes(pageId)) {
            const zeroStateFile = `pages/${pageId}-zero-state.html`;
            // Try to load zero state version, fallback to regular if not found
            try {
                const zeroStateResponse = await fetch(zeroStateFile);
                if (zeroStateResponse.ok) {
                    fileName = zeroStateFile;
                }
            } catch (e) {
                // Fall back to regular file
            }
        }
        
        const response = await fetch(fileName);
        if (response.ok) {
            const content = await response.text();
            const pageElement = document.getElementById(pageId);
            if (pageElement) {
                pageElement.innerHTML = content;
                
                // Re-initialize lucide icons for the new content
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        }
    } catch (error) {
        console.error(`Error loading page ${pageId}:`, error);
        // Create fallback content
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            pageElement.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageId.charAt(0).toUpperCase() + pageId.slice(1)}</h1>
                    <p class="page-subtitle">This page is under construction.</p>
                </div>
            `;
        }
    }
}

// Component loader function
async function loadComponent(componentName, containerId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (response.ok) {
            const content = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = content;
            }
        }
    } catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
    }
}

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Simple showPage function
function enhancedShowPage(pageId) {
    console.log('Loading page:', pageId);
    
    // Hide/show footer and header based on page type
    const footer = document.querySelector('.bottom-nav');
    const header = document.querySelector('.header');
    const innerPages = ['learn-more', 'manage-account', 'credits', 'future-self', 'dream-report', 'dream-browse', 'dream-management', 'challenge-gallery', 'challenge-browse', 'challenge-management', 'dream-scuba-diver', 'dream-achieve', 'challenge-water-daily', 'challenge-water-flow', 'resources', 'module-detail', 'start-challenge'];
    
    if (footer) {
        if (innerPages.includes(pageId)) {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'block';
        }
    }
    
    if (header) {
        if (innerPages.includes(pageId)) {
            header.style.display = 'none';
        } else {
            header.style.display = 'block';
        }
    }
    
    // Update header icon selected states
    const activityIcon = document.querySelector('.activity-icon');
    const notificationIcon = document.querySelector('.notification-icon');
    const bookmarkIcon = document.querySelector('.bookmark-icon');
    const tasksButton = document.querySelector('.tasks-button');
    
    if (activityIcon) {
        if (pageId === 'activity-feed') {
            activityIcon.classList.add('selected');
        } else {
            activityIcon.classList.remove('selected');
        }
    }
    
    if (notificationIcon) {
        if (pageId === 'notifications') {
            notificationIcon.classList.add('selected');
        } else {
            notificationIcon.classList.remove('selected');
        }
    }
    
    if (bookmarkIcon) {
        if (pageId === 'saved') {
            bookmarkIcon.classList.add('selected');
        } else {
            bookmarkIcon.classList.remove('selected');
        }
    }
    
    if (tasksButton) {
        if (pageId === 'tasks') {
            tasksButton.classList.add('selected');
        } else {
            tasksButton.classList.remove('selected');
        }
    }
    
    // Load content if page is empty (for inner pages and special pages like activity-feed, notifications)
    const pageElement = document.getElementById(pageId);
    const specialPages = ['activity-feed', 'notifications', 'saved', 'tasks'];
    if (pageElement && !pageElement.innerHTML.trim() && (innerPages.includes(pageId) || specialPages.includes(pageId))) {
        loadPageContent(pageId).then(() => {
            // Load breadcrumb for inner pages only (not special pages)
            if (innerPages.includes(pageId) && pageId === 'learn-more') {
                loadComponent('breadcrumb', 'breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (innerPages.includes(pageId) && pageId === 'manage-account') {
                loadComponent('breadcrumb', 'account-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (innerPages.includes(pageId) && pageId === 'credits') {
                loadComponent('breadcrumb', 'credits-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (innerPages.includes(pageId) && pageId === 'future-self') {
                loadComponent('breadcrumb', 'future-self-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (innerPages.includes(pageId) && pageId === 'tasks') {
                loadComponent('breadcrumb', 'tasks-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (innerPages.includes(pageId) && pageId === 'dream-report') {
                loadComponent('breadcrumb', 'dream-report-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                    // Initialize carousel when dream report page loads
                    setTimeout(initAutoMessageCarousel, 100);
                });
            } else if (pageId === 'dream-browse') {
                loadComponent('breadcrumb', 'dream-browse-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'dream-management') {
                loadComponent('breadcrumb', 'dream-management-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'challenge-gallery') {
                loadComponent('breadcrumb', 'challenge-gallery-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                    // Initialize Challenge Gallery with Browse tab active
                    setTimeout(() => {
                        switchChallengeTab('browse');
                    }, 100);
                });
            } else if (pageId === 'challenge-browse') {
                loadComponent('breadcrumb', 'challenge-browse-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'challenge-management') {
                loadComponent('breadcrumb', 'challenge-management-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                    // Initialize Challenge Management with Active tab active
                    setTimeout(() => {
                        switchChallengeManagementTab('active');
                    }, 100);
                });
            } else if (pageId === 'dream-scuba-diver') {
                loadComponent('breadcrumb', 'dream-scuba-diver-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'dream-achieve') {
                loadComponent('breadcrumb', 'dream-achieve-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'challenge-water-daily') {
                loadComponent('breadcrumb', 'challenge-water-daily-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'challenge-water-flow') {
                loadComponent('breadcrumb', 'challenge-water-flow-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'resources') {
                loadComponent('breadcrumb', 'resources-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'module-detail') {
                loadComponent('breadcrumb', 'module-detail-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            }
        });
    } else {
        // Initialize icons for already loaded pages
        initializeLucideIcons();
        
        // Set breadcrumb title for already loaded pages
        updateBreadcrumbTitle(pageId);
        
        // Handle dream-report page specifically 
        if (pageId === 'dream-report') {
            setTimeout(() => {
                updateBreadcrumbTitle(pageId);
                initAutoMessageCarousel();
            }, 100);
        }
        
        // Handle dream-achieve page pill initialization
        if (pageId === 'dream-achieve') {
            setTimeout(() => {
                initializeAchievePills();
            }, 100);
        }
    }
    
    // Show/hide challenge sticky buttons (only on challenge-water-flow Progress tab)
    const challengeButtons = document.getElementById('challenge-sticky-buttons');
    if (challengeButtons) {
        if (pageId === 'challenge-water-flow') {
            // Check if Progress tab is active, default to showing buttons
            const progressTab = document.querySelector('[data-tab="progress"]');
            if (progressTab && progressTab.classList.contains('active')) {
                challengeButtons.style.display = 'block';
            } else {
                challengeButtons.style.display = 'block'; // Show by default when entering page
            }
        } else {
            challengeButtons.style.display = 'none';
        }
    }
    
    // Call the basic showPage function
    basicShowPage(pageId);
}

// Rename the original function
function basicShowPage(pageId) {
    console.log(`showPage called with: ${pageId}`);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    console.log(`Found ${pages.length} pages`);
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the corresponding nav item
    const activeNavItem = document.querySelector(`.nav-item[onclick*="${pageId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    console.log(`Navigated to page: ${pageId}`);
}

// Set the global showPage to the enhanced version
window.showPage = enhancedShowPage;

// Analytics and Popover Functions
function showCategoryAnalytics(category) {
    console.log(`Showing analytics for ${category} category`);
    
    // Category-specific data with unique insights
    const categoryData = {
        work: {
            title: 'Your Work Dreams',
            insight: "You browsed 12 work dreams this week, most viewed on Tuesday mornings",
            manifested: 8,
            achieved: 4,
            progress: 67
        },
        play: {
            title: 'Your Play Dreams',
            insight: "Adventure dreams were your top choice, with 3 new ones explored this week",
            manifested: 3,
            achieved: 2,
            progress: 75
        },
        love: {
            title: 'Your Love Dreams',
            insight: "This month you searched love dreams 47 times, most on weekend mornings",
            manifested: 5,
            achieved: 3,
            progress: 82
        },
        self: {
            title: 'Your Self Dreams',
            insight: "Personal growth dreams peaked on Sunday evenings - your reflection time",
            manifested: 2,
            achieved: 1,
            progress: 30
        }
    };
    
    const data = categoryData[category] || categoryData.work;
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'analytics-backdrop';
    backdrop.onclick = () => hideAnalytics();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'analytics-overlay';
    overlay.innerHTML = `
        <div class="analytics-content">
            <div class="analytics-header">
                <div class="analytics-title">${data.title}</div>
                <button class="analytics-close" onclick="hideAnalytics()">×</button>
            </div>
            
            <div class="analytics-body">
                <!-- Spotify Wrapped Style Insight -->
                <div class="wrapped-insight">
                    <div class="insight-text">${data.insight}</div>
                </div>
                
                <!-- Manifested/Achieved Stats -->
                <div class="achievement-stats">
                    <div class="achievement-box">
                        <div class="achievement-label">Manifested</div>
                        <div class="achievement-value">${data.manifested}</div>
                    </div>
                    <div class="achievement-box">
                        <div class="achievement-label">Achieved</div>
                        <div class="achievement-value">${data.achieved}</div>
                    </div>
                </div>
                
                <!-- Single Fuel Bar -->
                <div class="fuel-section">
                    <div class="fuel-label">Overall Progress</div>
                    <div class="fuel-bar-container">
                        <div class="fuel-bar">
                            <div class="fuel-fill" style="width: ${data.progress}%"></div>
                        </div>
                        <div class="fuel-percentage">${data.progress}%</div>
                    </div>
                </div>
                
                <!-- Dream Button -->
                <div class="dream-cta">
                    <button class="dream-btn" onclick="hideAnalytics(); showPage('dreams');">Dream</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(overlay);
    
    // Show with animation
    requestAnimationFrame(() => {
        backdrop.classList.add('show');
        overlay.classList.add('show');
    });
}

function showDayTasksPopover(day) {
    console.log(`Showing tasks for ${day}`);
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'analytics-backdrop';
    backdrop.onclick = () => hideAnalytics();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'analytics-overlay';
    overlay.innerHTML = `
        <div class="analytics-content">
            <div class="analytics-header">
                <div class="analytics-title">${day.charAt(0).toUpperCase() + day.slice(1)} Tasks</div>
                <button class="analytics-close" onclick="hideAnalytics()">×</button>
            </div>
            <div class="analytics-body">
                <div class="task-list">
                    <div class="task-item completed">
                        <input type="checkbox" class="task-checkbox" checked disabled>
                        <div class="task-content">
                            <div class="task-name">Morning meditation</div>
                            <div class="task-category">Mindfulness</div>
                        </div>
                    </div>
                    <div class="task-item completed">
                        <input type="checkbox" class="task-checkbox" checked disabled>
                        <div class="task-content">
                            <div class="task-name">Review photography portfolio</div>
                            <div class="task-category">Creative</div>
                        </div>
                    </div>
                    <div class="task-item">
                        <input type="checkbox" class="task-checkbox" disabled>
                        <div class="task-content">
                            <div class="task-name">Plan weekend goals</div>
                            <div class="task-category">Planning</div>
                        </div>
                    </div>
                    <div class="task-item">
                        <input type="checkbox" class="task-checkbox" disabled>
                        <div class="task-content">
                            <div class="task-name">Call future self</div>
                            <div class="task-category">Reflection</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(overlay);
    
    // Show with animation
    requestAnimationFrame(() => {
        backdrop.classList.add('show');
        overlay.classList.add('show');
    });
}

function hideAnalytics() {
    const overlay = document.querySelector('.analytics-overlay');
    const backdrop = document.querySelector('.analytics-backdrop');
    
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
    if (backdrop) {
        backdrop.classList.remove('show');
        setTimeout(() => backdrop.remove(), 300);
    }
}

// Legacy function name for compatibility
function closeAnalyticsOverlay() {
    hideAnalytics();
}

// DOM Content Loaded Event Handler
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load header, footer, and burger menu components first
        await loadComponent('header', 'header-container');
        await loadComponent('footer', 'footer-container');
        await loadComponent('burger-menu', 'burger-menu-container');
        
        // Initialize scroll behavior
        initializeScrollBehavior();
        
        // Load and show explore page by default
        await loadPageContent('explore');
        enhancedShowPage('explore');
        
        // Preload dreams and challenges pages
        await loadPageContent('dreams');
        await loadPageContent('challenges');
        await loadPageContent('meditation');
        await loadPageContent('notifications');
        await loadPageContent('tasks');
        await loadPageContent('activity-feed');
        await loadPageContent('dream-browse');
        await loadPageContent('dream-management');
        await loadPageContent('challenge-gallery');
        await loadPageContent('challenge-browse');
        await loadPageContent('challenge-management');
        await loadPageContent('dream-detail');
        await loadPageContent('dream-achieve');
        await loadPageContent('future-self');
        await loadPageContent('resources');
        await loadPageContent('saved');
        await loadPageContent('start-challenge');
        
        // Load breadcrumb for future-self since it's preloaded
        await loadComponent('breadcrumb', 'future-self-breadcrumb-container');
        updateBreadcrumbTitle('future-self');
        
        // Load breadcrumb for resources since it's preloaded
        await loadComponent('breadcrumb', 'resources-breadcrumb-container');
        updateBreadcrumbTitle('resources');
        
        // Load breadcrumb for dream-browse since it's preloaded
        await loadComponent('breadcrumb', 'dream-browse-breadcrumb-container');
        updateBreadcrumbTitle('dream-browse');
        
        // Load breadcrumb for start-challenge since it's preloaded
        await loadComponent('breadcrumb', 'start-challenge-breadcrumb-container');
        updateBreadcrumbTitle('start-challenge');
        
        // Load breadcrumb for dream-management since it's preloaded
        await loadComponent('breadcrumb', 'dream-management-breadcrumb-container');
        updateBreadcrumbTitle('dream-management');
        
        // Load breadcrumb for challenge-gallery since it's preloaded
        await loadComponent('breadcrumb', 'challenge-gallery-breadcrumb-container');
        updateBreadcrumbTitle('challenge-gallery');
        
        // Load breadcrumb for challenge-browse since it's preloaded
        await loadComponent('breadcrumb', 'challenge-browse-breadcrumb-container');
        updateBreadcrumbTitle('challenge-browse');
        
        // Load breadcrumb for challenge-management since it's preloaded
        await loadComponent('breadcrumb', 'challenge-management-breadcrumb-container');
        updateBreadcrumbTitle('challenge-management');
        
        // Load breadcrumb for dream-achieve since it's preloaded
        await loadComponent('breadcrumb', 'dream-achieve-breadcrumb-container');
        updateBreadcrumbTitle('dream-achieve');
        
        // Initialize dream-achieve pills since it's preloaded
        initializeAchievePills();
        
    } catch (error) {
        console.error('Error loading app content:', error);
    }
    
    // Initialize Lucide icons
    initializeLucideIcons();
    
    // Set up event delegation for dream report button
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.tell-me-more-btn')) {
            e.preventDefault();
            showPage('dream-report');
        }
    });
    
    console.log('Clean Unlimits app loaded successfully');
});

// Plan selection functionality for subscribe page
function selectPlan(planType) {
    const options = document.querySelectorAll('.subscription-option');
    options.forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('.radio-button');
        radio.classList.remove('active');
    });
    
    const selectedOption = document.querySelector(`[data-plan="${planType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        const radio = selectedOption.querySelector('.radio-button');
        radio.classList.add('active');
    }
}

// Initialize plan selection when subscribe page loads
function initializeSubscriptionOptions() {
    const options = document.querySelectorAll('.subscription-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');
            selectPlan(planType);
        });
    });
}

// Breadcrumb navigation functions
function navigateBack() {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        const pageId = currentPage.id;
        // Route to appropriate parent page
        if (pageId === 'dream-achieve') {
            showPage('dream-scuba-diver');
        } else if (pageId === 'challenge-water-flow') {
            showPage('challenge-water-daily');
        } else if (pageId === 'dream-browse' || pageId === 'dream-management' || pageId === 'dream-scuba-diver') {
            showPage('dreams');
        } else if (pageId === 'challenge-browse' || pageId === 'challenge-management' || pageId === 'challenge-water-daily') {
            showPage('challenges');
        } else if (pageId === 'module-detail') {
            showPage('resources');
        } else {
            showPage('explore'); // Default for other pages
        }
    } else {
        showPage('explore');
    }
}

function navigateClose() {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        const pageId = currentPage.id;
        // Route to appropriate parent page
        if (pageId === 'dream-achieve') {
            showPage('dreams'); // Close goes directly to Dreams landing page
        } else if (pageId === 'challenge-water-flow') {
            showPage('challenges'); // Close goes directly to Challenges landing page
        } else if (pageId === 'dream-browse' || pageId === 'dream-management' || pageId === 'dream-scuba-diver') {
            showPage('dreams');
        } else if (pageId === 'challenge-browse' || pageId === 'challenge-management' || pageId === 'challenge-water-daily') {
            showPage('challenges');
        } else {
            showPage('explore'); // Default for other pages
        }
    } else {
        showPage('explore');
    }
}

// New Breadcrumb System
const BREADCRUMB_TITLES = {
    'tasks': 'MY TASKS',
    'future-self': 'FUTURE SELF',
    'credits': 'DREAM CREDITS',
    'manage-account': 'MANAGE ACCOUNT',
    'learn-more': 'SUBSCRIPTION',
    'dream-report': 'DREAM REPORT',
    'dream-browse': 'BROWSE DREAMS',
    'dream-management': 'MY DREAMS',
    'challenge-gallery': 'CHALLENGE GALLERY',
    'challenge-browse': 'BROWSE CHALLENGES',
    'challenge-management': 'MY CHALLENGES',
    'dream-scuba-diver': 'START DREAMING',
    'dream-achieve': 'ACHIEVE',
    'challenge-water-daily': 'START CHALLENGING',
    'challenge-water-flow': 'CHALLENGE',
    'resources': 'MY RESOURCES',
    'module-detail': 'MODULE DETAILS',
    'saved': 'SAVED',
    'start-challenge': 'START CHALLENGE',
    'activity-feed': 'ACTIVITY FEED'
};

function updateBreadcrumbTitle(pageId) {
    const title = BREADCRUMB_TITLES[pageId];
    if (!title) return;
    
    // Wait a bit for DOM to be ready, then update all possible breadcrumb elements
    setTimeout(() => {
        // Try multiple selectors to find breadcrumb title element
        const selectors = [
            '#breadcrumb-title',
            '.breadcrumb-title',
            '[id*="breadcrumb"] .breadcrumb-title',
            '.breadcrumb-header .breadcrumb-title'
        ];
        
        let updated = false;
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.textContent = title;
                    updated = true;
                }
            });
        });
        
        console.log(`Breadcrumb update for ${pageId}: ${updated ? 'SUCCESS' : 'FAILED'} - Title: ${title}`);
    }, 50);
    
    // Also try immediately
    const immediateElement = document.querySelector('#breadcrumb-title, .breadcrumb-title');
    if (immediateElement) {
        immediateElement.textContent = title;
    }
}

// Profile picture editing function
function editProfilePicture() {
    alert('Profile picture editing functionality would be implemented here');
}

// Subscription toggle functions
function showSubscriptionView() {
    const subscriptionContent = document.getElementById('subscription-content');
    const subscribedContent = document.getElementById('subscribed-content');
    const heroBanner = document.querySelector('.hero-banner');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    if (subscriptionContent && subscribedContent) {
        subscriptionContent.style.display = 'block';
        subscribedContent.style.display = 'none';
        if (heroBanner) heroBanner.style.display = 'block';
        
        toggleBtns.forEach(btn => btn.classList.remove('active'));
        toggleBtns[0].classList.add('active');
    }
}

function showSubscribedView() {
    const subscriptionContent = document.getElementById('subscription-content');
    const subscribedContent = document.getElementById('subscribed-content');
    const heroBanner = document.querySelector('.hero-banner');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    if (subscriptionContent && subscribedContent) {
        subscriptionContent.style.display = 'none';
        subscribedContent.style.display = 'block';
        if (heroBanner) heroBanner.style.display = 'none';
        
        toggleBtns.forEach(btn => btn.classList.remove('active'));
        toggleBtns[1].classList.add('active');
    }
}

// Burger Menu Functions
function openBurgerMenu() {
    const menu = document.getElementById('burger-menu');
    const backdrop = document.getElementById('burger-backdrop');
    
    if (menu && backdrop) {
        menu.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBurgerMenu() {
    const menu = document.getElementById('burger-menu');
    const backdrop = document.getElementById('burger-backdrop');
    
    if (menu && backdrop) {
        menu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Export functions for global access
window.selectPlan = selectPlan;
window.initializeSubscriptionOptions = initializeSubscriptionOptions;
window.navigateBack = navigateBack;
window.navigateClose = navigateClose;
window.openBurgerMenu = openBurgerMenu;
window.closeBurgerMenu = closeBurgerMenu;
window.editProfilePicture = editProfilePicture;
window.showSubscriptionView = showSubscriptionView;
window.showSubscribedView = showSubscribedView;

// Future Self Chat Functions
function launchFutureSelf() {
    console.log('Launching Future Self...');
    showPage('future-self');
}

function sendMessage() {
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    input.value = '';
    autoResizeTextarea(input);
    
    // Simulate Future Self response after a delay
    setTimeout(() => {
        addFutureSelfResponse(message);
    }, 1500);
}

function addUserMessage(text) {
    const chatContainer = document.querySelector('#chat-messages');
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `
        <div>
            <div class="message-text">${text}</div>
            <div class="message-timestamp">${timestamp}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addFutureSelfResponse(userMessage) {
    const chatContainer = document.querySelector('#chat-messages');
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Generate contextual responses based on user input
    const responses = [
        "I see you're thinking about this deeply. That curiosity you feel right now? It's the same spark that leads to our biggest breakthroughs.",
        "The path you're on might feel uncertain, but I can tell you that every step matters. Trust the process.",
        "You're asking the right questions. That willingness to explore and grow is exactly what shapes our future.",
        "I remember when we first started questioning this. It's beautiful to see you taking these steps now.",
        "The version of you that emerges from this journey will thank you for asking these questions today."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message future-self-message';
    messageDiv.innerHTML = `
        <div>
            <div class="message-text">${response}</div>
            <div class="message-timestamp">${timestamp}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    // Enable/disable send button based on content
    const sendBtn = document.querySelector('.chat-send-btn') || document.querySelector('.chat-send-btn-rounded');
    const hasContent = textarea.value.trim().length > 0;
    if (sendBtn) {
        sendBtn.disabled = !hasContent;
    }
}

// Export Future Self functions
window.launchFutureSelf = launchFutureSelf;
window.sendMessage = sendMessage;
window.handleChatKeydown = handleChatKeydown;
window.autoResizeTextarea = autoResizeTextarea;

// Tasks Page Functions
function filterTasks() {
    const searchTerm = document.querySelector('.task-search').value.toLowerCase();
    const tasks = document.querySelectorAll('.task-item-detailed');
    
    tasks.forEach(task => {
        const taskName = task.querySelector('.task-name').textContent.toLowerCase();
        const dreamTitle = task.querySelector('.dream-title').textContent.toLowerCase();
        
        if (taskName.includes(searchTerm) || dreamTitle.includes(searchTerm)) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    });
}

function filterByDate(dateFilter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${dateFilter}"]`).classList.add('active');
    
    // Filter tasks
    const tasks = document.querySelectorAll('.task-item-detailed');
    
    tasks.forEach(task => {
        const taskDate = task.getAttribute('data-date');
        
        if (dateFilter === 'all' || taskDate === dateFilter) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    });
}

// Export tasks functions
window.filterTasks = filterTasks;
window.filterByDate = filterByDate;

// Date Filter Functions
function toggleDateFilter() {
    const menu = document.getElementById('date-filter-menu');
    menu.classList.toggle('active');
}

function selectPeriod(period) {
    document.getElementById('selected-period').textContent = period;
    document.getElementById('date-filter-menu').classList.remove('active');
    document.getElementById('custom-date-panel')?.classList.remove('active');
}

function selectCustomDate() {
    document.getElementById('date-filter-menu').classList.remove('active');
    document.getElementById('custom-date-panel')?.classList.add('active');
}

function applyCustomDate() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        document.getElementById('selected-period').textContent = `${start} - ${end}`;
        document.getElementById('custom-date-panel').classList.remove('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.date-filter-container')) {
        document.getElementById('date-filter-menu')?.classList.remove('active');
        document.getElementById('custom-date-panel')?.classList.remove('active');
    }
});

// Export date filter functions
window.toggleDateFilter = toggleDateFilter;
window.selectPeriod = selectPeriod;
window.selectCustomDate = selectCustomDate;
window.applyCustomDate = applyCustomDate;

// Format task due dates
function formatTaskDueDate(date) {
    const today = new Date();
    const taskDate = new Date(date);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Remove time for comparison
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    const tomorrowStr = tomorrow.toDateString();
    const taskStr = taskDate.toDateString();
    
    if (taskStr === todayStr) {
        return 'Today';
    } else if (taskStr === yesterdayStr) {
        return 'Yesterday';
    } else if (taskStr === tomorrowStr) {
        return 'Tomorrow';
    } else {
        // Format as "1 Jan"
        return taskDate.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short' 
        });
    }
}

window.formatTaskDueDate = formatTaskDueDate;

// Auto Message Carousel
function initAutoMessageCarousel() {
    const carousel = document.querySelector('.auto-message-carousel');
    if (!carousel) return;
    
    const messages = carousel.querySelectorAll('.auto-message');
    const dots = carousel.querySelectorAll('.dot');
    if (messages.length === 0) return;
    
    let currentIndex = 0;
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function showNextMessage() {
        // Add exit class to current message
        messages[currentIndex].classList.add('exit');
        messages[currentIndex].classList.remove('active');
        
        // Move to next message
        currentIndex = (currentIndex + 1) % messages.length;
        
        // After exit animation, show next message
        setTimeout(() => {
            // Remove exit class from all messages
            messages.forEach(msg => msg.classList.remove('exit'));
            
            // Show next message
            messages[currentIndex].classList.add('active');
            updateDots();
        }, 400);
    }
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index === currentIndex) return;
            
            messages[currentIndex].classList.add('exit');
            messages[currentIndex].classList.remove('active');
            
            currentIndex = index;
            
            setTimeout(() => {
                messages.forEach(msg => msg.classList.remove('exit'));
                messages[currentIndex].classList.add('active');
                updateDots();
            }, 400);
        });
    });
    
    // Start cycling after initial display
    setTimeout(() => {
        setInterval(showNextMessage, 4000); // 4 seconds per message
    }, 3000); // Start after 3 seconds
}

// Initialize auto carousel when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(initAutoMessageCarousel, 100);
});

window.initAutoMessageCarousel = initAutoMessageCarousel;

// ===============================================
// DREAM GALLERY FUNCTIONALITY
// ===============================================

// Tab switching functionality
function switchGalleryTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.gallery-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Show/hide sections
    document.querySelectorAll('.gallery-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${tabName}-section`).style.display = 'block';
    
    // Reset category filters when switching tabs
    resetCategoryFilters();
}

// Saved page tab switching functionality
function switchSavedCategory(categoryName) {
    // Show/hide sections
    document.querySelectorAll('.gallery-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(`${categoryName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// Search functionality for saved page
function filterSaved() {
    const searchInput = document.querySelector('#gallery-search input');
    const searchTerm = searchInput.value.toLowerCase();
    
    const activeSection = document.querySelector('.gallery-section:not([style*="display: none"])');
    if (!activeSection) return;
    
    // Filter all saved cards
    const allCards = activeSection.querySelectorAll('.suggested-dream-card');
    allCards.forEach(card => {
        const title = card.querySelector('.suggested-dream-title');
        if (title && title.textContent.toLowerCase().includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Category filtering functionality
function filterByCategory(category) {
    // Update active pill
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter cards in current visible section
    const activeSection = document.querySelector('.gallery-section:not([style*="display: none"])');
    if (!activeSection) return;
    
    // Filter all types of cards: gallery-dream-card, suggested-dream-card, and dream-card
    const allCards = activeSection.querySelectorAll('.gallery-dream-card, .suggested-dream-card, .dream-card');
    
    allCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Reset category filters
function resetCategoryFilters() {
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    document.querySelector('[data-category="all"]').classList.add('active');
    
    // Show all cards in all sections
    document.querySelectorAll('.gallery-dream-card, .suggested-dream-card, .dream-card').forEach(card => {
        card.style.display = 'block';
    });
}

// Search functionality
function openSearch() {
    const searchContainer = document.getElementById('gallery-search');
    searchContainer.style.display = 'block';
    searchContainer.querySelector('input').focus();
}

function closeSearch() {
    const searchContainer = document.getElementById('gallery-search');
    searchContainer.style.display = 'none';
    searchContainer.querySelector('input').value = '';
    // Reset filter to show all cards
    filterDreams();
}

function filterDreams() {
    const searchInput = document.querySelector('#gallery-search input');
    const searchTerm = searchInput.value.toLowerCase();
    
    const activeSection = document.querySelector('.gallery-section:not([style*="display: none"])');
    if (!activeSection) return;
    
    // Filter all cards (gallery-dream-card, suggested-dream-card, and dream-card)
    const allCards = activeSection.querySelectorAll('.gallery-dream-card, .suggested-dream-card, .dream-card');
    allCards.forEach(card => {
        const title = card.querySelector('.gallery-dream-title, .suggested-dream-title, .dream-title');
        if (title) {
            const titleText = title.textContent.toLowerCase();
            if (titleText.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Bookmark functionality
function openBookmarks() {
    // Navigate to saved page
    showPage('saved');
}

// Filter menu functionality
function openFilterMenu() {
    const modal = document.getElementById('filter-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeFilterMenu() {
    const modal = document.getElementById('filter-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function selectFilter(category) {
    // Update filter modal selection
    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
    
    // Apply the filter
    filterByCategory(category);
    
    // Close the modal
    closeFilterMenu();
}

// Add new dream functionality
function addNewDream() {
    // Placeholder for add new dream functionality
    console.log('Adding new dream...');
}

// Dream detail functionality
function showDreamDetail(dreamId) {
    // Placeholder for dream detail functionality
    console.log('Showing dream detail for:', dreamId);
}

// Make functions globally available
window.switchGalleryTab = switchGalleryTab;
window.switchSavedCategory = switchSavedCategory;

// Activity Feed Time Filtering
function filterFeedByTime(period) {
    const sections = document.querySelectorAll('.feed-time-section');
    
    sections.forEach(section => {
        const sectionPeriod = section.getAttribute('data-period');
        
        if (period === 'all-time') {
            section.style.display = 'block';
        } else if (period === 'today') {
            section.style.display = sectionPeriod === 'today' ? 'block' : 'none';
        } else if (period === 'this-week') {
            section.style.display = ['today', 'yesterday', 'this-week'].includes(sectionPeriod) ? 'block' : 'none';
        } else if (period === 'this-month') {
            section.style.display = 'block'; // Show all for this month
        }
    });
}

window.filterFeedByTime = filterFeedByTime;

// Tasks Time Filtering
function filterTasksByTime(period) {
    const tasks = document.querySelectorAll('.task-item-detailed');
    
    tasks.forEach(task => {
        const taskDate = task.getAttribute('data-date');
        
        if (period === 'all') {
            task.style.display = 'block';
        } else if (period === 'today') {
            task.style.display = taskDate === 'today' ? 'block' : 'none';
        } else if (period === 'tomorrow') {
            task.style.display = taskDate === 'tomorrow' ? 'block' : 'none';
        } else if (period === 'this-week') {
            task.style.display = ['today', 'tomorrow', 'week'].includes(taskDate) ? 'block' : 'none';
        } else if (period === 'this-month') {
            task.style.display = ['today', 'tomorrow', 'week', 'month'].includes(taskDate) ? 'block' : 'none';
        }
    });
}

window.filterTasksByTime = filterTasksByTime;

// Notifications Time Filtering
function filterNotificationsByTime(period) {
    const notifications = document.querySelectorAll('.notification-item');
    
    notifications.forEach(notification => {
        const timeText = notification.querySelector('.notification-time')?.textContent || '';
        
        if (period === 'all') {
            notification.style.display = 'block';
        } else if (period === 'today') {
            notification.style.display = (timeText.includes('minute') || timeText.includes('hour')) ? 'block' : 'none';
        } else if (period === 'this-week') {
            notification.style.display = (timeText.includes('minute') || timeText.includes('hour') || timeText.includes('Yesterday')) ? 'block' : 'none';
        } else if (period === 'this-month') {
            notification.style.display = 'block'; // Show all for this month
        }
    });
}

window.filterNotificationsByTime = filterNotificationsByTime;

// Mark notification as read
function markAsRead(notificationElement) {
    notificationElement.classList.remove('unread');
    notificationElement.classList.add('read');
}

window.markAsRead = markAsRead;
window.filterSaved = filterSaved;
window.filterByCategory = filterByCategory;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.filterDreams = filterDreams;
window.openBookmarks = openBookmarks;
window.openFilterMenu = openFilterMenu;
window.closeFilterMenu = closeFilterMenu;
window.selectFilter = selectFilter;
window.addNewDream = addNewDream;
window.showDreamDetail = showDreamDetail;

// Future Self Scenarios dropdown (internal - within app)
function toggleScenariosDropdown() {
    const dropdown = document.getElementById('scenarios-dropdown');
    const dropdownBtn = document.querySelector('.scenarios-dropdown');
    
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
        dropdownBtn.classList.add('active');
    } else {
        dropdown.style.display = 'none';
        dropdownBtn.classList.remove('active');
    }
}

// External Future Self Scenarios dropdown (browser interface)
function toggleExternalScenariosDropdown() {
    const dropdown = document.getElementById('external-scenarios-dropdown');
    const dropdownBtn = document.querySelector('.scenarios-dropdown-trigger');
    
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
        dropdownBtn.classList.add('active');
    } else {
        dropdown.style.display = 'none';
        dropdownBtn.classList.remove('active');
    }
}

function selectScenario(scenarioType) {
    // Update dropdown labels for both internal and external dropdowns
    const internalDropdownLabel = document.querySelector('.scenarios-dropdown .dropdown-label');
    const externalDropdownLabel = document.querySelector('.scenarios-dropdown-trigger .dropdown-label');
    const internalDropdown = document.getElementById('scenarios-dropdown');
    const externalDropdown = document.getElementById('external-scenarios-dropdown');
    const internalDropdownBtn = document.querySelector('.scenarios-dropdown');
    const externalDropdownBtn = document.querySelector('.scenarios-dropdown-trigger');
    
    // Update the dropdown label based on selected scenario
    const scenarioNames = {
        'uc1': 'UC 1',
        'uc2': 'UC 2', 
        'uc3': 'UC 3',
        'uc4': 'UC 4',
        'uc5': 'UC 5'
    };
    
    const selectedName = scenarioNames[scenarioType] || 'Future Self';
    
    if (internalDropdownLabel) {
        internalDropdownLabel.textContent = selectedName;
    }
    if (externalDropdownLabel) {
        externalDropdownLabel.textContent = selectedName;
    }
    
    // Close both dropdowns
    if (internalDropdown) {
        internalDropdown.style.display = 'none';
        if (internalDropdownBtn) internalDropdownBtn.classList.remove('active');
    }
    if (externalDropdown) {
        externalDropdown.style.display = 'none';
        if (externalDropdownBtn) externalDropdownBtn.classList.remove('active');
    }
    
    // Here we would navigate to the specific scenario page (to be built)
    console.log(`Selected scenario: ${scenarioType}`);
    // TODO: Navigate to scenario page when ready
    // showPage(`future-self-${scenarioType}`);
}

window.toggleScenariosDropdown = toggleScenariosDropdown;
window.toggleExternalScenariosDropdown = toggleExternalScenariosDropdown;
window.selectScenario = selectScenario;

// Dream Management Tab Switching (for dream-management page)
function switchManagementTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.gallery-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Hide all sections
    document.getElementById('active-management-section').style.display = 'none';
    document.getElementById('achieved-management-section').style.display = 'none';
    
    // Show selected section
    if (tabName === 'active') {
        document.getElementById('active-management-section').style.display = 'block';
    } else if (tabName === 'achieved') {
        document.getElementById('achieved-management-section').style.display = 'block';
    }
}

window.switchManagementTab = switchManagementTab;

// Challenge Management Tab Switching (for challenge-management page)
function switchChallengeManagementTab(tabName) {
    try {
        console.log('Switching to challenge management tab:', tabName);
        
        // Only operate if we're on the challenge-management page
        const challengeManagementPage = document.getElementById('challenge-management');
        if (!challengeManagementPage || !challengeManagementPage.classList.contains('active')) {
            console.log('Challenge management page not active');
            return;
        }
        
        // Update tab buttons - only in Challenge Management page
        const challengeManagementTabs = challengeManagementPage.querySelectorAll('.gallery-tab');
        challengeManagementTabs.forEach(tab => tab.classList.remove('active'));
        const targetTab = challengeManagementPage.querySelector(`[data-tab="${tabName}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab updated successfully');
        }
        
        // Hide all sections
        const activeSection = challengeManagementPage.querySelector('#active-management-section');
        const completedSection = challengeManagementPage.querySelector('#completed-management-section');
        
        if (activeSection) activeSection.style.display = 'none';
        if (completedSection) completedSection.style.display = 'none';
        
        // Show selected section
        if (tabName === 'active' && activeSection) {
            activeSection.style.display = 'block';
            console.log('Active section shown');
        } else if (tabName === 'completed' && completedSection) {
            completedSection.style.display = 'block';
            console.log('Completed section shown');
        }
    } catch (error) {
        console.error('Error in switchChallengeManagementTab:', error);
    }
}

window.switchChallengeManagementTab = switchChallengeManagementTab;

// ===============================================
// CHALLENGE GALLERY FUNCTIONALITY
// ===============================================

// Challenge tab switching functionality
function switchChallengeTab(tabName) {
    // Update tab buttons - only in Challenge Gallery
    const challengeGalleryTabs = document.querySelectorAll('#challenge-gallery .gallery-tab');
    if (challengeGalleryTabs.length > 0) {
        challengeGalleryTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        const targetTab = document.querySelector(`#challenge-gallery [data-tab="${tabName}"]`);
        if (targetTab) targetTab.classList.add('active');
    }
    
    // Show/hide sections - only in Challenge Gallery
    const challengeGallerySections = document.querySelectorAll('#challenge-gallery .gallery-section');
    if (challengeGallerySections.length > 0) {
        challengeGallerySections.forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.querySelector(`#challenge-gallery #${tabName}-section`);
        if (targetSection) targetSection.style.display = 'block';
    }
}

// Challenge type selection
function selectChallengeType(type) {
    try {
        // Update challenge type tab styling
        document.querySelectorAll('.challenge-type-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const targetTab = document.querySelector(`[data-type="${type}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Filter challenges based on selected type (could be used to show different challenge sets)
        console.log(`Selected challenge type: ${type}`);
    } catch (error) {
        console.error('Error in selectChallengeType:', error);
    }
}

// Filter challenges by category
function filterChallengesByCategory(category) {
    // Update filter pill styling
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter challenge cards
    const challengeCards = document.querySelectorAll('.suggested-dream-card, .dream-card');
    challengeCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Challenge search functionality  
function filterChallenges() {
    const searchInput = document.querySelector('#gallery-search input');
    const searchTerm = searchInput.value.toLowerCase();
    
    const activeSection = document.querySelector('.gallery-section:not([style*="display: none"])');
    if (!activeSection) return;
    
    // Filter all cards
    const allCards = activeSection.querySelectorAll('.suggested-dream-card, .dream-card');
    allCards.forEach(card => {
        const title = card.querySelector('.suggested-dream-title, .dream-title');
        if (title) {
            const titleText = title.textContent.toLowerCase();
            if (titleText.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Challenge detail functionality
function showChallengeDetail(challengeId) {
    try {
        console.log('Showing challenge detail for:', challengeId);
        // TODO: Implement challenge detail view
        alert(`Opening challenge: ${challengeId}`);
    } catch (error) {
        console.error('Error in showChallengeDetail:', error);
    }
}

// Zero State Toggle Functionality
function toggleZeroState() {
    isZeroState = !isZeroState;
    const toggleButton = document.querySelector('.external-zero-state-toggle');
    const icon = document.getElementById('zero-state-icon');
    
    // Update toggle button appearance
    if (isZeroState) {
        toggleButton.classList.add('active');
        icon.setAttribute('data-lucide', 'user-check');
    } else {
        toggleButton.classList.remove('active');
        icon.setAttribute('data-lucide', 'user-x');
    }
    
    // Refresh the current page to show/hide zero state
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        const pageId = currentPage.id;
        loadPageContent(pageId);
    }
    
    // Re-initialize lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
}


// Filter modal functions
function openFilterMenu() {
    try {
        const filterModal = document.getElementById('filter-modal');
        if (filterModal) {
            filterModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error opening filter menu:', error);
    }
}

function closeFilterMenu() {
    try {
        const filterModal = document.getElementById('filter-modal');
        if (filterModal) {
            filterModal.style.display = 'none';
        }
    } catch (error) {
        console.error('Error closing filter menu:', error);
    }
}

function selectFilter(filter) {
    try {
        // Update filter option styling
        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });
        const targetOption = document.querySelector(`[data-filter="${filter}"]`);
        if (targetOption) {
            targetOption.classList.add('active');
        }
        
        // Filter challenges/dreams based on selected filter
        if (filter === 'all') {
            // Show all items
            document.querySelectorAll('[data-category]').forEach(item => {
                item.style.display = 'block';
            });
        } else {
            // Show only items matching the filter
            document.querySelectorAll('[data-category]').forEach(item => {
                if (item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Close filter menu
        closeFilterMenu();
        
        console.log(`Filter applied: ${filter}`);
    } catch (error) {
        console.error('Error selecting filter:', error);
    }
}

// Tab switching functions for inner pages
function switchAchieveTab(tabName) {
    try {
        // Remove active class from all tabs
        document.querySelectorAll('.achieve-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Hide all content
        document.querySelectorAll('.achieve-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected content
        const selectedContent = document.querySelector(`#${tabName}-content`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
        
        console.log(`Switched to ${tabName} tab`);
    } catch (error) {
        console.error('Error switching achieve tab:', error);
    }
}

function switchChallengeFlowTab(tabName) {
    try {
        // Remove active class from all tabs
        document.querySelectorAll('.achieve-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Hide all content
        document.querySelectorAll('.achieve-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected content
        const selectedContent = document.querySelector(`#${tabName}-content`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
        
        // Show/hide challenge buttons based on tab
        const challengeButtons = document.getElementById('challenge-sticky-buttons');
        if (challengeButtons) {
            if (tabName === 'progress') {
                challengeButtons.style.display = 'block';
            } else {
                challengeButtons.style.display = 'none';
            }
        }
        
        console.log(`Switched to ${tabName} tab`);
    } catch (error) {
        console.error('Error switching challenge flow tab:', error);
    }
}

// Accordion toggle function
function toggleAccordion(sectionId) {
    try {
        const content = document.querySelector(`#${sectionId}-content`);
        const header = document.querySelector(`[onclick="toggleAccordion('${sectionId}')"]`);
        
        if (content && header) {
            content.classList.toggle('collapsed');
            header.classList.toggle('collapsed');
            
            console.log(`Toggled accordion: ${sectionId}`);
        }
    } catch (error) {
        console.error('Error toggling accordion:', error);
    }
}

// Resources tab switching function
function switchResourcesTab(tabName) {
    try {
        // Remove active class from all tabs
        document.querySelectorAll('.resources-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to selected tab
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Hide all content
        document.querySelectorAll('.resources-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected content
        const selectedContent = document.querySelector(`#${tabName}-content`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
        
        console.log(`Switched to ${tabName} resources tab`);
    } catch (error) {
        console.error('Error switching resources tab:', error);
    }
}

// Make functions globally available
window.switchChallengeTab = switchChallengeTab;
window.selectChallengeType = selectChallengeType;
window.filterChallengesByCategory = filterChallengesByCategory;
window.filterChallenges = filterChallenges;
window.showChallengeDetail = showChallengeDetail;
window.toggleZeroState = toggleZeroState;
window.openFilterMenu = openFilterMenu;
window.closeFilterMenu = closeFilterMenu;
window.selectFilter = selectFilter;
window.switchAchieveTab = switchAchieveTab;
window.switchChallengeFlowTab = switchChallengeFlowTab;
window.toggleAccordion = toggleAccordion;
window.switchResourcesTab = switchResourcesTab;

// Modules filter functions
function toggleModulesFilter() {
    const menu = document.getElementById('modules-filter-menu');
    const chevron = document.getElementById('dropdown-chevron');
    
    if (menu) {
        menu.classList.toggle('active');
        if (chevron) {
            chevron.style.transform = menu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
}

function selectModuleFilter(filter) {
    const selectedText = document.getElementById('selected-filter');
    const menu = document.getElementById('modules-filter-menu');
    const chevron = document.getElementById('dropdown-chevron');
    
    // Update selected text
    if (selectedText) {
        if (filter === 'all') {
            selectedText.textContent = 'All Modules';
        } else if (filter === 'free') {
            selectedText.textContent = 'Free Modules';
        } else if (filter === 'paid') {
            selectedText.textContent = 'Paid Modules';
        }
    }
    
    // Update active option
    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
    });
    
    let selectedOption;
    if (filter === 'all') {
        selectedOption = document.querySelector('.filter-option[onclick*="all"]');
    } else if (filter === 'free') {
        selectedOption = document.querySelector('.filter-option[onclick*="free"]');
    } else if (filter === 'paid') {
        selectedOption = document.querySelector('.filter-option[onclick*="paid"]');
    }
    
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
    
    // Close dropdown
    if (menu) {
        menu.classList.remove('active');
    }
    if (chevron) {
        chevron.style.transform = 'rotate(0deg)';
    }
    
    // Filter modules
    filterModulesByType(filter);
}

function filterModulesByType(type) {
    // Only filter module cards in the reprogram section
    const moduleCards = document.querySelectorAll('#reprogram-content .module-card');
    
    moduleCards.forEach(card => {
        // Check if card has locked class (paid) or free badge
        const isLocked = card.classList.contains('locked');
        const freeBadge = card.querySelector('.module-badge.free');
        const isFree = freeBadge !== null;
        
        if (type === 'all') {
            card.style.display = 'flex';
        } else if (type === 'free') {
            card.style.display = isFree ? 'flex' : 'none';
        } else if (type === 'paid') {
            card.style.display = isLocked ? 'flex' : 'none';
        }
    });
}

window.toggleModulesFilter = toggleModulesFilter;
window.selectModuleFilter = selectModuleFilter;
window.filterModulesByType = filterModulesByType;

// Bookmark toggle function
function toggleBookmark(button) {
    button.classList.toggle('bookmarked');
    
    // Optional: Add visual feedback
    if (button.classList.contains('bookmarked')) {
        // Could add analytics or save state here
        console.log('Article bookmarked');
    } else {
        console.log('Article bookmark removed');
    }
}

window.toggleBookmark = toggleBookmark;

// Module Detail Tab Switching
function switchModuleDetailTab(tabName) {
    // Update active tab
    const tabs = document.querySelectorAll('.module-detail-tab');
    const contents = document.querySelectorAll('.module-detail-content');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Show/hide content
    contents.forEach(content => {
        content.style.display = 'none';
        if (content.id === tabName + '-content') {
            content.style.display = 'block';
        }
    });
}

// Navigation to module detail page
function navigateToModule(moduleTitle) {
    enhancedShowPage('module-detail');
    
    // Update breadcrumb title to show module name
    setTimeout(() => {
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = moduleTitle || 'Module Details';
        }
    }, 100);
}

window.switchModuleDetailTab = switchModuleDetailTab;
window.navigateToModule = navigateToModule;

// Achieve Page Pill Switching
function switchAchievePill(pillName) {
    console.log('switchAchievePill called with:', pillName);
    
    try {
        // Update active pill
        const pills = document.querySelectorAll('.achieve-pill');
        console.log('Found pills:', pills.length);
        
        pills.forEach(pill => {
            pill.classList.remove('active');
        });
        
        // Find and activate the clicked pill by text content
        pills.forEach(pill => {
            if (pill.textContent.toLowerCase() === pillName.toLowerCase()) {
                pill.classList.add('active');
                console.log('Activated pill:', pill.textContent);
            }
        });
        
        // Show/hide content sections
        const sections = {
            'tasks': document.getElementById('tasks-section'),
            'mindset': document.getElementById('mindset-section'),
            'articles': document.getElementById('articles-section'),
            'videos': document.getElementById('videos-section')
        };
        
        console.log('Found sections:', Object.keys(sections).filter(key => sections[key]));
        
        // Hide all sections
        Object.values(sections).forEach(section => {
            if (section) {
                section.style.display = 'none';
                console.log('Hidden section:', section.id);
            }
        });
        
        // Show selected section
        if (sections[pillName]) {
            sections[pillName].style.display = 'block';
            console.log('Showing section:', pillName);
        } else {
            console.log('Section not found for:', pillName);
        }
        
    } catch (error) {
        console.error('Error in switchAchievePill:', error);
    }
}

// Initialize achieve pills functionality
function initializeAchievePills() {
    console.log('Initializing achieve pills...');
    
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
        const pills = document.querySelectorAll('.achieve-pill');
        console.log('Found pills to initialize:', pills.length);
        
        if (pills.length === 0) {
            console.log('No pills found, retrying in 500ms...');
            setTimeout(initializeAchievePills, 500);
            return;
        }
        
        pills.forEach((pill, index) => {
            // Remove any existing listeners
            pill.replaceWith(pill.cloneNode(true));
            const newPill = document.querySelectorAll('.achieve-pill')[index];
            
            newPill.addEventListener('click', function() {
                const pillText = this.textContent.toLowerCase();
                console.log('Pill clicked:', pillText);
                switchAchievePill(pillText);
            });
            console.log(`Initialized pill ${index}:`, newPill.textContent);
        });
    }, 100);
}

window.switchAchievePill = switchAchievePill;
window.initializeAchievePills = initializeAchievePills;
