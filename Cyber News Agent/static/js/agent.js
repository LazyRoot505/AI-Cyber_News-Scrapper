// DOM Elements
const questionTitle = document.getElementById('questionTitle');
const questionCategory = document.getElementById('questionCategory');
const questionSeverity = document.getElementById('questionSeverity');
const questionDate = document.getElementById('questionDate');
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
const questionTags = document.getElementById('questionTags');
const responseSections = document.getElementById('responseSections');
const threatGraph = document.getElementById('threatGraph');
const mitigationSteps = document.getElementById('mitigationSteps');
const relatedQuestions = document.getElementById('relatedQuestions');

// Cybersecurity response templates
const responseTemplates = {
    overview: {
        title: 'Overview',
        content: (topic) => `This comprehensive analysis addresses critical aspects of ${topic}, examining current threats, vulnerabilities, and best practices for mitigation.`
    },
    threatLandscape: {
        title: 'Threat Landscape',
        content: (topic) => `The current threat landscape for ${topic} involves sophisticated attack vectors, including emerging technologies and evolving adversary tactics.`
    },
    impactAnalysis: {
        title: 'Impact Analysis',
        content: (topic) => `The potential impact of ${topic}-related incidents can be severe, affecting multiple aspects of organizational security and operations.`
    },
    mitigation: {
        title: 'Mitigation Strategies',
        content: (topic) => `Effective ${topic} mitigation requires a multi-layered approach combining technical controls, policies, and user awareness.`
    }
};

// Load and display question details
function loadQuestionDetails() {
    const questionData = JSON.parse(sessionStorage.getItem('currentQuestion'));
    if (!questionData) {
        window.location.href = '/search';
        return;
    }

    // Prevent default navigation
    window.history.pushState({}, '', `/agent?id=${questionData.id}`);
    
    // Generate and display analysis
    const analysis = generateAnalysis(questionData.title);
    displayAnalysis(analysis);
    
    // Update confidence score
    updateConfidenceScore(85); // Example score
}

// Handle browser back/forward
window.onpopstate = function(event) {
    const currentPath = window.location.pathname;
    if (currentPath === '/search') {
        window.location.href = '/search';
    }
};

// Update confidence score ring
function updateConfidenceScore(score) {
    const circle = document.querySelector('.score-progress');
    const scoreValue = document.querySelector('.confidence-score .score-value');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    scoreValue.textContent = `${score}%`;
}

// Enhanced analysis generation with more detailed content
function generateAnalysis(question) {
    const topic = extractTopic(question);
    return {
        title: question,
        category: determineCategoryFromQuestion(question),
        severity: calculateQuestionSeverity(question),
        riskLevel: Math.floor(Math.random() * 40) + 60, // Generate risk level between 60-100
        impactScores: generateImpactScores(),
        responses: generateDetailedResponses(topic),
        mitigationSteps: generateMitigationSteps(topic),
        relatedQuestions: generateRelatedQuestions(topic)
    };
}

// Extract main topic from question
function extractTopic(question) {
    const commonTopics = [
        'Network Security', 'Malware', 'Incident Response', 'Cloud Security',
        'Web Security', 'IoT', 'Cryptography', 'Social Engineering'
    ];
    
    return commonTopics.find(topic => question.includes(topic)) || 'Cybersecurity';
}

// Determine category based on question content
function determineCategoryFromQuestion(question) {
    const categories = {
        'attack': 'Attack Vectors',
        'prevent': 'Prevention',
        'detect': 'Detection',
        'respond': 'Response',
        'implement': 'Implementation',
        'best practice': 'Best Practices'
    };

    return Object.entries(categories)
        .find(([key]) => question.toLowerCase().includes(key))?.[1] 
        || 'General Security';
}

// Calculate severity based on question keywords
function calculateQuestionSeverity(question) {
    const highSeverityKeywords = ['critical', 'breach', 'attack', 'vulnerability'];
    const mediumSeverityKeywords = ['risk', 'threat', 'security'];
    
    if (highSeverityKeywords.some(keyword => question.toLowerCase().includes(keyword))) {
        return 'high';
    } else if (mediumSeverityKeywords.some(keyword => question.toLowerCase().includes(keyword))) {
        return 'medium';
    }
    return 'low';
}

// Generate impact scores for different areas
function generateImpactScores() {
    return {
        confidentiality: Math.floor(Math.random() * 40) + 60,
        integrity: Math.floor(Math.random() * 40) + 60,
        availability: Math.floor(Math.random() * 40) + 60,
        financial: Math.floor(Math.random() * 40) + 60
    };
}

// Generate detailed responses for each section
function generateDetailedResponses(topic) {
    const responses = Object.entries(responseTemplates).map(([key, template]) => {
        let detailedContent = template.content(topic);
        // Add more contextual details based on the topic
        detailedContent += `\n\nKey Considerations:\n`;
        detailedContent += `• Recent developments in ${topic}\n`;
        detailedContent += `• Industry best practices for ${topic}\n`;
        detailedContent += `• Common challenges in implementing ${topic} solutions\n`;
        detailedContent += `• Future trends and emerging technologies in ${topic}`;
        
        return {
            title: template.title,
            content: detailedContent
        };
    });

    return responses;
}

// Generate mitigation steps
function generateMitigationSteps(topic) {
    const steps = [
        {
            title: 'Risk Assessment',
            content: `Conduct thorough risk assessment specific to ${topic} to identify vulnerabilities and threats.`
        },
        {
            title: 'Implementation',
            content: `Deploy appropriate security controls and mechanisms to address identified ${topic} risks.`
        },
        {
            title: 'Monitoring',
            content: `Establish continuous monitoring and detection capabilities for ${topic}-related threats.`
        },
        {
            title: 'Response Planning',
            content: `Develop and maintain incident response procedures specific to ${topic} incidents.`
        },
        {
            title: 'Review and Update',
            content: `Regularly review and update ${topic} security measures based on new threats and lessons learned.`
        }
    ];
    return steps;
}

// Generate related questions
function generateRelatedQuestions(topic) {
    const templates = [
        `How to implement ${topic} in large organizations?`,
        `What are the emerging threats in ${topic}?`,
        `Best practices for ${topic} monitoring?`,
        `How to train staff on ${topic}?`,
        `${topic} compliance requirements?`
    ];
    
    return templates.map(template => ({
        id: Math.random().toString(36).substr(2, 9),
        title: template,
        category: topic,
        severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
    }));
}

// Display analysis on the page
function displayAnalysis(analysis) {
    // Update basic info
    questionTitle.textContent = analysis.title;
    questionCategory.innerHTML = `<i class="fas fa-shield-alt"></i> ${analysis.category}`;
    questionSeverity.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${analysis.severity.toUpperCase()} Severity`;
    questionDate.innerHTML = `<i class="fas fa-clock"></i> Generated Now`;

    // Update risk meter
    updateRiskMeter(analysis.riskLevel);

    // Update impact scores
    displayImpactScores(analysis.impactScores);

    // Display detailed responses
    displayResponses(analysis.responses);

    // Create threat visualization
    createThreatVisualization(analysis);

    // Display mitigation steps
    displayMitigationSteps(analysis.mitigationSteps);

    // Display related questions
    displayRelatedQuestions(analysis.relatedQuestions);
}

// Update risk meter visualization
function updateRiskMeter(riskLevel) {
    const circle = document.querySelector('.progress-ring');
    const circumference = 2 * Math.PI * 45; // r=45 from SVG
    const offset = circumference - (riskLevel / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    
    const riskValue = document.querySelector('.risk-value');
    riskValue.textContent = `${riskLevel}%`;
    
    // Update color based on risk level
    if (riskLevel >= 80) {
        circle.style.stroke = 'var(--danger-color)';
    } else if (riskLevel >= 60) {
        circle.style.stroke = 'var(--warning-color)';
    } else {
        circle.style.stroke = 'var(--success-color)';
    }
}

// Display impact scores with bars
function displayImpactScores(scores) {
    const scoreContainer = document.querySelector('.score-bars');
    scoreContainer.innerHTML = '';
    
    Object.entries(scores).forEach(([key, value]) => {
        const bar = document.createElement('div');
        bar.className = 'score-bar';
        bar.innerHTML = `
            <div class="score-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div class="bar">
                <div class="fill" style="width: ${value}%"></div>
            </div>
            <div class="score-value">${value}%</div>
        `;
        scoreContainer.appendChild(bar);
    });
}

// Display detailed responses
function displayResponses(responses) {
    responseSections.innerHTML = responses.map(response => `
        <div class="response-section">
            <h3>${response.title}</h3>
            <p>${response.content}</p>
        </div>
    `).join('');
}

// Create threat visualization using Chart.js
function createThreatVisualization(analysis) {
    const ctx = document.createElement('canvas');
    threatGraph.appendChild(ctx);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Threat Level', 'Impact', 'Complexity', 'Prevalence', 'Detectability'],
            datasets: [{
                label: 'Threat Analysis',
                data: [
                    analysis.riskLevel,
                    Math.floor(Math.random() * 40) + 60,
                    Math.floor(Math.random() * 40) + 60,
                    Math.floor(Math.random() * 40) + 60,
                    Math.floor(Math.random() * 40) + 60
                ],
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: 'rgba(33, 150, 243, 1)',
                pointBackgroundColor: 'rgba(33, 150, 243, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(33, 150, 243, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Display mitigation steps
function displayMitigationSteps(steps) {
    mitigationSteps.innerHTML = steps.map((step, index) => `
        <div class="step-card">
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <h3>${step.title}</h3>
                <p>${step.content}</p>
            </div>
        </div>
    `).join('');
}

// Display related questions
function displayRelatedQuestions(questions) {
    const container = document.getElementById('relatedQuestions');
    container.innerHTML = questions.map(question => `
        <div class="related-card" onclick="window.location.href='/agent?id=${question.id}'">
            <h3>${question.title}</h3>
            <div class="meta">
                <span class="category">${question.category}</span>
                <span class="severity ${question.severity}">${question.severity.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadQuestionDetails);
