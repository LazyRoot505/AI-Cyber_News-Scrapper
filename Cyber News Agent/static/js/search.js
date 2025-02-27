// DOM Elements
const searchInput = document.getElementById('searchQuery');
const searchBtn = document.getElementById('searchBtn');
const questionsContainer = document.getElementById('questionsContainer');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('.theme-text');

// Theme handling
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme === 'dark');
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeUI(!isDark);
}

function updateThemeUI(isDark) {
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

// Theme event listener
themeToggle.addEventListener('click', toggleTheme);


// Cybersecurity topics for question generation
const topics = [
    'Network Security',
    'Malware Analysis',
    'Incident Response',
    'Penetration Testing',
    'Cloud Security',
    'Web Security',
    'Mobile Security',
    'IoT Security',
    'Cryptography',
    'Social Engineering',
    'Threat Intelligence',
    'Security Operations',
    'Application Security',
    'Data Privacy',
    'Zero Trust'
];

// Question templates for generating diverse questions
const questionTemplates = [
    'What are the best practices for {topic}?',
    'How to prevent {topic} related attacks?',
    'What are common vulnerabilities in {topic}?',
    'Explain the impact of recent {topic} breaches',
    'How to implement {topic} in enterprise environments?',
    'What tools are recommended for {topic}?',
    'What are emerging threats in {topic}?',
    'How to detect and respond to {topic} incidents?',
    'What are compliance requirements for {topic}?',
    'Compare different approaches to {topic}',
    'What is the future of {topic}?',
    'How does AI impact {topic}?',
    'Analyze recent trends in {topic}',
    'What are industry standards for {topic}?',
    'How to audit and assess {topic}?'
];

// Generate a random question
function generateQuestion() {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    const question = template.replace('{topic}', topic);
    
    const tags = [
        topic,
        ['Security', 'Risk', 'Protection', 'Analysis', 'Defense'][Math.floor(Math.random() * 5)],
        ['Best Practices', 'Implementation', 'Strategy', 'Framework', 'Tools'][Math.floor(Math.random() * 5)]
    ];

    const severity = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
    const views = Math.floor(Math.random() * 1000);
    const answers = Math.floor(Math.random() * 20);
    const date = new Date(Date.now() - Math.floor(Math.random() * 604800000)); // Random date within last week

    return {
        id: Math.random().toString(36).substr(2, 9),
        title: question,
        category: topic,
        severity,
        views,
        answers,
        date,
        tags
    };
}

// Create question card HTML
function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.onclick = () => navigateToAgent(question.id, question.title);
    
    card.innerHTML = `
        <div class="question-header">
            <span class="category"><i class="fas fa-shield-alt"></i> ${question.category}</span>
            <span class="date">${timeAgo(question.date)}</span>
        </div>
        <h3 class="question-title">${question.title}</h3>
        <div class="question-meta">
            <span class="severity ${question.severity}">${question.severity.charAt(0).toUpperCase() + question.severity.slice(1)} Priority</span>
            <span class="views"><i class="fas fa-eye"></i> ${question.views}</span>
            <span class="answers"><i class="fas fa-comments"></i> ${question.answers}</span>
        </div>
        <div class="tags">
            ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    return card;
}

// Generate initial questions
function generateInitialQuestions() {
    questionsContainer.innerHTML = ''; // Clear existing questions
    const numberOfQuestions = 50; // Generate 50 questions as requested
    
    for (let i = 0; i < numberOfQuestions; i++) {
        const question = generateQuestion();
        const card = createQuestionCard(question);
        questionsContainer.appendChild(card);
    }
}

// Time ago formatter
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
    
    return Math.floor(seconds) + ' second' + (seconds === 1 ? '' : 's') + ' ago';
}

// Navigate to agent page
function navigateToAgent(questionId, questionTitle) {
    // Store question details in sessionStorage for the agent page
    sessionStorage.setItem('currentQuestion', JSON.stringify({
        id: questionId,
        title: questionTitle
    }));
    window.location.href = `/agent?id=${questionId}`;
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Regenerate questions with filter
        generateInitialQuestions();
    });
});

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const questions = document.querySelectorAll('.question-card');
    
    questions.forEach(card => {
        const title = card.querySelector('.question-title').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(query) || 
            tags.some(tag => tag.includes(query));
        
        card.style.display = matches ? 'block' : 'none';
    });
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    generateInitialQuestions();
});

// Refresh questions on page reload
window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('currentQuestion');
});
