from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import json
import os
import time

app = Flask(__name__)
CORS(app)

# Load configuration
def load_config():
    with open('database/news.json', 'r') as f:
        return json.load(f)

CONFIG = load_config()

# Data storage
class NewsStorage:
    def __init__(self):
        self.data = {
            "overview": [],
            "critical": [],
            "trending": [],
            "bookmarked": [],
            "categories": {
                "malware": [],
                "vulnerabilities": [],
                "data_privacy": [],
                "network_security": [],
                "cybersecurity": [],
                "technology": []
            },
            "stats": {
                "total": 0,
                "critical": 0,
                "trending": 0,
                "bookmarked": 0,
                "last_update": None
            },
            "threat_level": {
                "level": "LOW",
                "score": 0,
                "active_threats": 0,
                "trend": "stable"
            }
        }
        self.last_generated = datetime.now()
        self.initialize_data()

    def initialize_data(self):
        """Generate initial dataset"""
        for _ in range(20):
            self.generate_new_content()

    def update_content(self):
        """Check and update content based on intervals"""
        current_time = datetime.now()
        if (current_time - self.last_generated).seconds > CONFIG["update_intervals"]["medium"]:
            self.generate_new_content()
            self.last_generated = current_time
            return True
        return False

    def calculate_impact_score(self, keywords):
        """Calculate impact score based on keywords and priority"""
        base_score = random.randint(30, 100)
        keyword_bonus = sum(5 for kw in keywords if any(k in kw.lower() for k in CONFIG["priorities"]["critical"]["keywords"]))
        return min(100, base_score + keyword_bonus)

    def generate_new_content(self):
        """Generate new article with realistic content"""
        feeds = CONFIG["feeds"]
        source = random.choice(feeds)
        category = source["category"]
        
        titles = [
            f"Critical Zero-Day Vulnerability Discovered in {random.choice(['Windows', 'Linux', 'macOS', 'Android'])}",
            f"New {random.choice(['Ransomware', 'Malware', 'Spyware'])} Strain Targets Enterprise Networks",
            f"Major Data Breach Exposes {random.randint(1, 10)} Million Records",
            f"Advanced Persistent Threat Group Targets {random.choice(['Financial', 'Healthcare', 'Government'])} Sector",
            f"Critical Infrastructure Security Alert: {random.choice(['Energy', 'Water', 'Transportation'])} Sector at Risk"
        ]
        
        title = random.choice(titles)
        priority = self.determine_priority(title)
        impact_score = self.calculate_impact_score([title])
        
        new_article = {
            "id": int(time.time() * 1000),
            "title": title,
            "summary": f"Important security update regarding {category}. This incident requires immediate attention and assessment...",
            "content": "Detailed technical analysis and mitigation strategies...",
            "category": category,
            "priority": priority,
            "date": datetime.now().isoformat(),
            "source": {
                "name": source["name"],
                "url": source["url"],
                "icon": f"https://icon.horse/icon/{source['url'].split('/')[2]}",
                "trust_score": source["trust_score"]
            },
            "trust_score": source["trust_score"],  # Add trust_score at top level for easy access
            "tags": self.generate_tags(category, priority),
            "impact_score": impact_score,
            "status": self.determine_status(priority),
            "bookmarked": False,
            "trending": impact_score > 75,
            "views": random.randint(100, 1000),
            "metrics": {
                "affected_systems": random.randint(1000, 100000),
                "patch_available": random.choice([True, False]),
                "exploited_in_wild": random.choice([True, False])
            }
        }

        # Add to collections
        self.data["overview"].insert(0, new_article)
        self.data["categories"][category].insert(0, new_article)
        
        if priority in ["critical", "high"]:
            self.data["critical"].insert(0, new_article)
        if new_article["trending"]:
            self.data["trending"].insert(0, new_article)

        # Update stats
        self.update_stats()
        return new_article

    def determine_priority(self, text):
        """Determine priority based on keywords"""
        text = text.lower()
        for priority, config in CONFIG["priorities"].items():
            if any(kw in text for kw in config["keywords"]):
                return priority
        return "low"

    def determine_status(self, priority):
        """Determine status based on priority"""
        if priority in ["critical", "high"]:
            return random.choice(["active", "investigating"])
        return random.choice(["investigating", "resolved"])

    def generate_tags(self, category, priority):
        """Generate relevant tags"""
        base_tags = [category, priority]
        additional_tags = [
            "zero-day", "malware", "ransomware", "data breach", 
            "network security", "vulnerability", "threat actor", 
            "exploit", "patch", "security update"
        ]
        return base_tags + random.sample(additional_tags, random.randint(1, 3))

    def update_stats(self):
        """Update overall statistics"""
        active_threats = sum(1 for a in self.data["overview"] if a["status"] == "active")
        critical_count = len(self.data["critical"])
        
        # Determine threat level
        if critical_count > 10 or active_threats > 15:
            level = "HIGH"
            score = random.randint(80, 100)
        elif critical_count > 5 or active_threats > 8:
            level = "MEDIUM"
            score = random.randint(50, 79)
        else:
            level = "LOW"
            score = random.randint(20, 49)

        self.data["threat_level"] = {
            "level": level,
            "score": score,
            "active_threats": active_threats,
            "trend": "increasing" if active_threats > self.data["threat_level"]["active_threats"] else "decreasing",
            "last_updated": datetime.now().isoformat()
        }

        self.data["stats"] = {
            "total": len(self.data["overview"]),
            "critical": critical_count,
            "trending": len(self.data["trending"]),
            "bookmarked": len(self.data["bookmarked"]),
            "categories": {
                cat: len(articles) for cat, articles in self.data["categories"].items()
            },
            "last_update": datetime.now().isoformat()
        }

# Initialize storage
news_storage = NewsStorage()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/news')
def get_all_news():
    news_storage.update_content()
    page = request.args.get('page', 1, type=int)
    chunk_size = 50
    start_idx = (page - 1) * chunk_size
    end_idx = start_idx + chunk_size
    total_articles = len(news_storage.data["overview"])
    total_pages = (total_articles + chunk_size - 1) // chunk_size
    
    return jsonify({
        "articles": news_storage.data["overview"][start_idx:end_idx],
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_articles": total_articles,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    })

@app.route('/api/news/overview')
def get_overview():
    return jsonify(news_storage.data["overview"])

@app.route('/api/news/critical')
def get_critical_news():
    return jsonify(news_storage.data["critical"])

@app.route('/api/news/trending')
def get_trending_news():
    return jsonify(news_storage.data["trending"])

@app.route('/api/news/bookmarked')
def get_bookmarked_news():
    return jsonify(news_storage.data["bookmarked"])

@app.route('/api/news/category/<category>')
def get_category_news(category):
    if category in news_storage.data["categories"]:
        page = request.args.get('page', 1, type=int)
        chunk_size = 50
        articles = news_storage.data["categories"][category]
        start_idx = (page - 1) * chunk_size
        end_idx = start_idx + chunk_size
        total_articles = len(articles)
        total_pages = (total_articles + chunk_size - 1) // chunk_size
        
        return jsonify({
            "articles": articles[start_idx:end_idx],
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_articles": total_articles,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        })
    return jsonify({"articles": [], "pagination": {"current_page": 1, "total_pages": 0, "total_articles": 0, "has_next": False, "has_prev": False}})

@app.route('/api/news/stats')
def get_news_stats():
    news_storage.update_stats()
    return jsonify(news_storage.data["stats"])

@app.route('/api/threat-level')
def get_threat_level():
    if news_storage.update_content():
        news_storage.update_stats()
    return jsonify(news_storage.data["threat_level"])

@app.route('/search')
def search_page():
    """Render search page"""
    return render_template('search.html')

@app.route('/agent')
def agent_page():
    """Render agent page"""
    return render_template('agent.html')

@app.route('/article/<int:article_id>')
def article_detail(article_id):
    """Render article detail page"""
    return render_template('article_detail.html')

@app.route('/api/article/<int:article_id>')
def get_article(article_id):
    """Get article data by ID"""
    # Search for article in all collections
    for article in news_storage.data["overview"]:
        if article["id"] == article_id:
            # Generate extended content for article detail view
            article_data = article.copy()
            article_data["content"] = f"""
            Detailed analysis of the {article['title']} incident. This is an expanded version of the article
            that includes comprehensive technical details, impact assessment, and mitigation strategies.
            
            Technical Details:
            - Systems affected: {article['metrics']['affected_systems']}
            - Exploit status: {'Actively exploited' if article['metrics']['exploited_in_wild'] else 'Not exploited'}
            - Patch status: {'Available' if article['metrics']['patch_available'] else 'Pending'}
            
            Impact Assessment:
            - Severity level: {article['priority'].upper()}
            - Impact score: {article['impact_score']}/100
            - Current status: {article['status'].upper()}
            
            Key Points:
            1. Immediate threat assessment and classification
            2. Technical vulnerability analysis
            3. Affected systems and potential impact
            4. Recommended mitigation strategies
            5. Long-term security implications
            
            Mitigation Steps:
            1. Implement immediate security patches if available
            2. Monitor systems for suspicious activity
            3. Update security protocols and policies
            4. Conduct thorough system audits
            5. Enhance monitoring and detection capabilities
            """
            return jsonify(article_data)
    
    return jsonify({"error": "Article not found"}), 404

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
