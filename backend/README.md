# Browser Screenshot Pro - Backend

FastAPI + Selenium backend for advanced browser screenshot capabilities.

## 🚀 Quick Start

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Configuration

Environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |

## 📡 API Endpoints

### Health Check
```
GET /
```

### Take Screenshot
```
POST /api/screenshot
Content-Type: application/json

{
  "url": "https://example.com",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "full_page": false,
  "delay": 0,
  "user_agent": "...",
  "dark_mode": false,
  "format": "png",
  "quality": 90,
  "hide_elements": [".cookie-banner"],
  "wait_for_selector": ".main-content"
}
```

### Get Settings
```
GET /api/settings
```

### Update Settings
```
POST /api/settings
Content-Type: application/json

{
  "default_viewport_width": 1920,
  "default_viewport_height": 1080,
  "default_delay": 0,
  "default_format": "png",
  "default_quality": 90,
  "headless": true,
  "disable_images": false,
  "disable_js": false,
  "user_agent": "...",
  "language": "en-US",
  "timezone": "UTC"
}
```

### Get History
```
GET /api/history?limit=50
```

### Clear History
```
DELETE /api/history
```

### Get User Agents
```
GET /api/user-agents
```

### Get Viewport Presets
```
GET /api/viewport-presets
```

## 🐳 Docker

```bash
# Build image
docker build -t screenshot-backend .

# Run container
docker run -p 8000:8000 screenshot-backend
```

## 📝 Notes

- Chrome/Chromium browser must be installed
- For headless servers, install Chrome dependencies
- Selenium WebDriver will be automatically managed by `webdriver-manager`
