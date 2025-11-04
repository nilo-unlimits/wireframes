// Clean Unlimits App - Main JavaScript


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
        const response = await fetch(`pages/${pageId}.html`);
        if (response.ok) {
            const content = await response.text();
            const pageElement = document.getElementById(pageId);
            if (pageElement) {
                pageElement.innerHTML = content;
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
    const innerPages = ['learn-more', 'manage-account', 'credits', 'future-self', 'tasks', 'dream-report', 'dream-gallery'];
    
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
    
    // Load content if page is empty (only for inner pages that aren't preloaded)
    const pageElement = document.getElementById(pageId);
    if (pageElement && !pageElement.innerHTML.trim() && innerPages.includes(pageId)) {
        loadPageContent(pageId).then(() => {
            // Load breadcrumb for inner pages
            if (pageId === 'learn-more') {
                loadComponent('breadcrumb', 'breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'manage-account') {
                loadComponent('breadcrumb', 'account-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'credits') {
                loadComponent('breadcrumb', 'credits-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'future-self') {
                loadComponent('breadcrumb', 'future-self-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'tasks') {
                loadComponent('breadcrumb', 'tasks-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'dream-report') {
                loadComponent('breadcrumb', 'dream-report-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                    // Initialize carousel when dream report page loads
                    setTimeout(initAutoMessageCarousel, 100);
                });
            } else if (pageId === 'dream-gallery') {
                loadComponent('breadcrumb', 'dream-gallery-breadcrumb-container').then(() => {
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
        await loadPageContent('dream-gallery');
        await loadPageContent('dream-detail');
        await loadPageContent('future-self');
        
        // Load breadcrumb for future-self since it's preloaded
        await loadComponent('breadcrumb', 'future-self-breadcrumb-container');
        updateBreadcrumbTitle('future-self');
        
        // Load breadcrumb for dream-gallery since it's preloaded
        await loadComponent('breadcrumb', 'dream-gallery-breadcrumb-container');
        updateBreadcrumbTitle('dream-gallery');
        
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
    showPage('explore'); // Go back to home page
}

function navigateClose() {
    showPage('explore'); // Close to home page
}

// New Breadcrumb System
const BREADCRUMB_TITLES = {
    'tasks': 'MY TASKS',
    'future-self': 'FUTURE SELF',
    'credits': 'DREAM CREDITS',
    'manage-account': 'MANAGE ACCOUNT',
    'learn-more': 'SUBSCRIPTION',
    'dream-report': 'DREAM REPORT',
    'dream-gallery': 'DREAM GALLERY'
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
    // Placeholder for bookmark functionality
    console.log('Opening bookmarks...');
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
