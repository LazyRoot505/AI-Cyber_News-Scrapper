// Global state
let currentView = 'grid';
let currentCategory = 'overview';
let newsData = [];

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    loadContent();
    startAutoReload();
});

// Initialize UI elements
function initializeUI() {
    // Nav button click handlers
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            loadContent(currentCategory);
        });
    });

    // View toggle handlers
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            document.getElementById('newsGrid').className = `news-grid ${currentView}-view`;
        });
    });

    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchWrapper = document.querySelector('.search-wrapper');
    searchToggle.addEventListener('click', () => {
        searchWrapper.classList.toggle('active');
    });

    // Theme toggle
    initializeTheme();
}

// Load content from API
async function loadContent(category = 'overview') {
    showLoading(true);
    try {
        const [newsResponse, statsResponse, threatResponse] = await Promise.all([
            fetch(`/api/news/${category}`),
            fetch('/api/news/stats'),
            fetch('/api/threat-level')
        ]);

        const articles = await newsResponse.json();
        const stats = await statsResponse.json();
        const threat = await threatResponse.json();

        updateNewsGrid(articles);
        updateStats(stats);
        updateThreatLevel(threat);
        
    } catch (error) {
        console.error('Error loading content:', error);
        showError('Failed to load content. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Update news grid with articles
function updateNewsGrid(articles) {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = articles.map(article => createNewsCard(article)).join('');
    
    // Update article count
    document.getElementById('articleCount').textContent = `${articles.length} articles`;
    document.getElementById('lastUpdate').textContent = 'Just updated';
}

// Update statistics
function updateStats(stats) {
    document.getElementById('totalArticles').textContent = stats.total;
    document.getElementById('criticalAlerts').textContent = stats.critical;
    document.getElementById('trendingCount').textContent = stats.trending;
    document.getElementById('resolvedCount').textContent = stats.total - stats.critical;

    // Update badges
    document.querySelector('[data-category="critical"] .badge').textContent = stats.critical;
    document.querySelector('[data-category="trending"] .badge').textContent = stats.trending;
    document.querySelector('[data-category="bookmarked"] .badge').textContent = stats.bookmarked;
}

// Update threat level
function updateThreatLevel(threat) {
    const threatLevel = document.querySelector('.threat-level');
    const levelText = document.querySelector('.level-text');
    const levelScore = document.querySelector('.level-score');
    const chart = document.querySelector('.circular-chart path');

    threatLevel.dataset.level = threat.level.toLowerCase();
    levelText.textContent = threat.level;
    levelScore.textContent = threat.score;
    chart.style.strokeDasharray = `${threat.score}, 100`;

    document.getElementById('activeThreatCount').textContent = threat.active_threats;
}

// Show loading state
function showLoading(show) {
    const loader = document.getElementById('loadingState');
    loader.style.display = show ? 'grid' : 'none';
}

// Show error message
function showError(message) {
    // Implement error notification
    console.error(message);
}

// Refresh feed functionality
function refreshFeed() {
    const refreshBtn = document.querySelector('.btn-refresh');
    const refreshStatus = refreshBtn.querySelector('.refresh-status');
    
    // Visual feedback
    refreshBtn.classList.add('rotating');
    refreshStatus.textContent = 'Updating...';
    
    // Reload content
    loadContent(currentCategory).then(() => {
        refreshBtn.classList.remove('rotating');
        refreshStatus.textContent = 'Updated';
        
        // Show success state briefly
        refreshBtn.classList.add('success');
        setTimeout(() => refreshBtn.classList.remove('success'), 1500);
    }).catch(() => {
        refreshBtn.classList.remove('rotating');
        refreshStatus.textContent = 'Failed';
        
        // Show error state briefly
        refreshBtn.classList.add('error');
        setTimeout(() => refreshBtn.classList.remove('error'), 1500);
    });
}

// Auto reload content
function startAutoReload() {
    setInterval(() => {
        loadContent(currentCategory);
    }, 30000); // Reload every 30 seconds
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize theme
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(dark) {
        document.body.classList.toggle('dark-theme', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        themeToggle.querySelector('i').className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Initialize theme
    setTheme(localStorage.getItem('theme') === 'dark' || prefersDark.matches);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark-theme'));
    });
}
