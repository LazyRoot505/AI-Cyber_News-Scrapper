# CyberNews Hub - Real-time Threat Intelligence Dashboard

A modern, real-time cybersecurity news and threat intelligence dashboard built with Flask and modern web technologies.

## Features

### 1. Real-time Intelligence Feed
- Live updates with auto-refresh functionality
- Priority-based content organization
- Advanced threat level monitoring
- Interactive statistics and metrics

### 2. Modern UI Components
- Advanced glassmorphism design
- Smooth animations and transitions
- Responsive layout for all devices
- Dark/light theme support

### 3. Smart Content Organization
- Category-based filtering
- Priority-based sorting
- Impact score visualization
- Advanced search functionality

### 4. Advanced Features
- Real-time threat level assessment
- Dynamic content updates
- Trust score system
- Interactive data visualization
- Advanced filtering and sorting

## Technical Stack

### Backend
- Flask (Python web framework)
- Flask-CORS for cross-origin support
- Dynamic news generation system
- Real-time statistics calculation

### Frontend
- Modern HTML5/CSS3
- Vanilla JavaScript with modern features
- CSS Grid/Flexbox for layouts
- CSS Custom Properties for theming
- Modern animations and transitions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cybernews-hub.git
cd cybernews-hub
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

5. Visit http://127.0.0.1:5000 in your browser

## Configuration

The application uses a configuration file (`database/news.json`) for:
- News feed sources
- Priority settings
- Update intervals
- Threat level thresholds

## API Endpoints

### News Endpoints
- `GET /api/news` - Get all news articles
- `GET /api/news/overview` - Get overview of latest news
- `GET /api/news/critical` - Get critical alerts
- `GET /api/news/trending` - Get trending articles
- `GET /api/news/bookmarked` - Get bookmarked articles
- `GET /api/news/category/<category>` - Get category-specific news

### Statistics Endpoints
- `GET /api/news/stats` - Get overall statistics
- `GET /api/threat-level` - Get current threat level assessment

## Features in Detail

### 1. Intelligent News Generation
- Dynamic content generation based on real-world patterns
- Smart priority assessment system
- Impact score calculation
- Trend analysis

### 2. Advanced UI Features
- Smooth transitions and animations
- Real-time updates with visual indicators
- Advanced search with filters
- Interactive data visualization
- Responsive design for all screen sizes

### 3. Content Management
- Category-based organization
- Priority-based sorting
- Smart filtering system
- Bookmark functionality
- Read/unread tracking

### 4. Performance Optimizations
- Efficient data updates
- Smart caching system
- Optimized animations
- Minimal network requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Icons by Font Awesome
- Fonts by Google Fonts
- UI inspiration from modern cybersecurity dashboards
