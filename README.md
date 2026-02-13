# 🌐 Browser Screenshot Pro

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white" alt="Selenium">
</p>

<p align="center">
  <b>🚀 Advanced Browser Automation & Screenshot Platform</b><br>
  Modern, responsive, and feature-rich screenshot capture tool with dark/light mode support
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#api">API</a>
</p>

---

## ✨ Features

### 🎨 Frontend (TypeScript + React)
- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **🌓 Dark/Light Mode** - Automatic theme detection with manual toggle
- **📊 Dashboard** - Intuitive screenshot capture interface
- **📜 History** - Complete screenshot history with search and filter
- **📈 Statistics** - Visual analytics and performance metrics
- **⚙️ Settings** - Comprehensive browser configuration
- **🔍 Preview** - Real-time screenshot preview before download
- **📱 Responsive** - Works perfectly on desktop, tablet, and mobile

### 🐍 Backend (Python + FastAPI)
- **⚡ FastAPI** - High-performance async API framework
- **🌐 Selenium** - Multi-browser support (Chrome, Firefox, Edge, Safari)
- **📸 Advanced Capture** - Full-page, viewport, or element-specific screenshots
- **⚙️ Configurable** - Extensive browser settings and options
- **📁 File Management** - Automatic screenshot organization
- **🔒 Secure** - CORS enabled, input validation
- **📚 API Documentation** - Auto-generated Swagger/OpenAPI docs

### 🚀 DevOps
- **🐳 Docker** - Complete containerization with multi-stage builds
- **⚙️ GitHub Actions** - Automated testing, building, and deployment
- **☁️ Multi-Platform Deploy** - Support for VPS, Railway, Heroku, Vercel
- **🔔 Notifications** - Discord and email deployment notifications

---

## 🎯 Demo

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Dashboard+Preview)

### Settings
![Settings](https://via.placeholder.com/800x400/10b981/ffffff?text=Settings+Preview)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x400/1f2937/ffffff?text=Dark+Mode+Preview)

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- Python 3.11+
- Chrome/Firefox/Edge browser
- Docker (optional)

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/browser-screenshot-pro.git
cd browser-screenshot-pro

# 2. Setup Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Setup Frontend
cd ../app
npm install

# 4. Start Development Servers
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd app
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t browser-screenshot-pro .
docker run -p 8000:8000 -p 80:80 browser-screenshot-pro
```

---

## 🚀 Usage

### Web Interface

1. **Open Dashboard** - Visit `http://localhost:5173`
2. **Enter URL** - Type the website URL to capture
3. **Configure Settings** - Select browser, size, and options
4. **Capture** - Click "Capture Screenshot" button
5. **Download** - Preview and download your screenshot

### API Endpoints

#### Capture Screenshot
```bash
curl -X POST "http://localhost:8000/api/screenshot" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "browser": "chrome",
    "window_width": 1920,
    "window_height": 1080,
    "full_page": true
  }'
```

#### Get Settings
```bash
curl "http://localhost:8000/api/settings"
```

#### Update Settings
```bash
curl -X POST "http://localhost:8000/api/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "browser": "firefox",
    "dark_mode": true
  }'
```

#### Get History
```bash
curl "http://localhost:8000/api/history?limit=10"
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in `app/` directory:

```env
# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Browser Screenshot Pro
VITE_APP_VERSION=2.0.0
```

### Browser Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `browser` | Browser to use (chrome, firefox, edge, safari) | chrome |
| `window_width` | Browser window width | 1920 |
| `window_height` | Browser window height | 1080 |
| `full_page` | Capture full page or viewport | true |
| `delay` | Wait time before capture (seconds) | 0 |
| `dark_mode` | Force dark mode | false |
| `headless` | Run browser headless | true |
| `javascript_enabled` | Enable JavaScript | true |
| `images_enabled` | Load images | true |
| `block_ads` | Block advertisements | false |

---

## 🚀 Deployment

### GitHub Actions Auto-Deploy

This project includes a complete GitHub Actions workflow for automatic deployment:

#### Supported Platforms

1. **VPS/Server** (via SSH)
2. **Railway** (via CLI)
3. **Heroku** (via API)
4. **Vercel** (for frontend)

#### Required Secrets

Go to `Settings > Secrets and variables > Actions` and add:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `SSH_HOST` | Server IP address | VPS |
| `SSH_USERNAME` | SSH username | VPS |
| `SSH_PRIVATE_KEY` | SSH private key | VPS |
| `SSH_PORT` | SSH port (default: 22) | VPS |
| `DEPLOY_PATH` | Deployment directory | VPS |
| `RAILWAY_TOKEN` | Railway API token | Railway |
| `HEROKU_API_KEY` | Heroku API key | Heroku |
| `HEROKU_APP_NAME` | Heroku app name | Heroku |
| `HEROKU_EMAIL` | Heroku account email | Heroku |
| `VERCEL_TOKEN` | Vercel token | Vercel |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel |
| `DISCORD_WEBHOOK` | Discord webhook URL | Notifications |
| `SMTP_SERVER` | SMTP server | Email notifications |
| `NOTIFICATION_EMAIL` | Notification recipient | Email notifications |

#### Deploy on Push

Simply push to `main` or `master` branch:

```bash
git add .
git commit -m "🚀 Deploy new features"
git push origin main
```

GitHub Actions will automatically:
1. ✅ Run tests
2. 🏗️ Build frontend
3. 🐳 Build Docker image
4. 🚀 Deploy to configured platforms
5. 📢 Send notifications

---

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/api/screenshot` | Capture screenshot (sync) |
| POST | `/api/screenshot/async` | Capture screenshot (async) |
| GET | `/api/screenshot/{id}/status` | Get screenshot status |
| GET | `/api/screenshot/{id}/download` | Download screenshot |
| GET | `/api/screenshot/{id}/preview` | Preview screenshot (base64) |
| GET | `/api/history` | Get screenshot history |
| DELETE | `/api/history/{id}` | Delete screenshot |
| GET | `/api/settings` | Get settings |
| POST | `/api/settings` | Update settings |
| POST | `/api/settings/reset` | Reset settings |
| GET | `/api/browsers` | Get available browsers |
| GET | `/api/stats` | Get statistics |

### Interactive Docs

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 🛠️ Development

### Project Structure

```
browser-screenshot-pro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── app/                        # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # API client
│   │   ├── sections/           # Page sections
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Main app
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # Backend (Python + FastAPI)
│   ├── app/
│   │   └── main.py             # FastAPI application
│   └── requirements.txt
├── screenshots/                # Screenshot storage
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose config
├── nginx.conf                  # Nginx configuration
└── README.md                   # This file
```

### Adding New Features

1. **Frontend Components**
   ```bash
   cd app/src/components
   # Create new component
   ```

2. **API Endpoints**
   ```bash
   cd backend/app
   # Edit main.py to add endpoints
   ```

3. **Tests**
   ```bash
   # Frontend tests
   cd app && npm test
   
   # Backend tests
   cd backend && pytest
   ```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [Selenium](https://www.selenium.dev/) - Browser automation
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</p>

<p align="center">
  ⭐ Star this repo if you find it helpful!
</p>