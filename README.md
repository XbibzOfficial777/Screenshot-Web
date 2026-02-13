# 🌐 Browser Screenshot Pro

A modern, powerful browser screenshot application built with **React + TypeScript + Tailwind CSS** frontend and **Python FastAPI + Selenium** backend. Deploy automatically to **GitHub Pages** with **GitHub Actions**!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **Dark/Light Theme** - Automatic theme detection with manual toggle
- **Dashboard** - Intuitive screenshot capture interface
- **Settings** - Comprehensive browser configuration
- **History** - Track and manage past screenshots
- **Real-time Preview** - Instant screenshot preview with download
- **Mobile Responsive** - Works seamlessly on all devices

### ⚙️ Backend
- **Selenium WebDriver** - Advanced browser automation
- **FastAPI** - High-performance Python web framework
- **Custom Viewport** - Set any screen resolution
- **Full Page Capture** - Capture entire scrollable pages
- **User Agent Spoofing** - Mimic different browsers/devices
- **Element Hiding** - Remove unwanted elements (cookies, ads, popups)
- **Dark Mode Emulation** - Force dark mode on websites
- **Delay Control** - Wait for lazy-loaded content

### 🚀 Deployment
- **GitHub Actions** - Automated CI/CD pipeline
- **GitHub Pages** - Free static site hosting
- **One-Click Deploy** - Just push to main branch!

## 📸 Screenshots

*Coming soon...*

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Chrome/Chromium browser

### 1. Fork & Clone

```bash
# Fork this repository on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/browser-screenshot-pro.git
cd browser-screenshot-pro
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📁 Project Structure

```
browser-screenshot-pro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── backend/
│   ├── main.py                 # FastAPI application
│   └── requirements.txt        # Python dependencies
├── src/
│   ├── components/             # React components
│   │   ├── Navigation.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/               # React contexts
│   │   └── ThemeContext.tsx
│   ├── sections/               # Page sections
│   │   ├── Dashboard.tsx
│   │   ├── Settings.tsx
│   │   └── History.tsx
│   ├── services/               # API services
│   │   └── api.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🌐 Deployment to GitHub Pages

### 1. Enable GitHub Pages

1. Go to **Settings** → **Pages** in your GitHub repository
2. Set **Source** to "GitHub Actions"

### 2. Configure Repository

Make sure your repository settings allow GitHub Actions:

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select "Read and write permissions"

### 3. Push to Deploy

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

GitHub Actions will automatically:
- ✅ Build the React application
- ✅ Deploy to GitHub Pages
- 🚀 Your site will be live at `https://YOUR_USERNAME.github.io/browser-screenshot-pro/`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `PORT` | Backend server port | `8000` |

### Browser Settings

Configure default browser behavior in the **Settings** page:

- **Viewport** - Default screen resolution
- **Delay** - Wait time before capture
- **Format** - PNG, JPEG, or WebP
- **Quality** - Image compression level
- **User Agent** - Browser identification
- **Language** - Browser language
- **Timezone** - Browser timezone
- **Headless Mode** - Run without visible window
- **Disable Images** - Block image loading
- **Disable JavaScript** - Disable JS execution

## 🔧 Advanced Usage

### Custom Viewport Presets

Quick-select common device resolutions:

| Device | Width | Height |
|--------|-------|--------|
| Desktop HD | 1920 | 1080 |
| Desktop | 1366 | 768 |
| Laptop | 1440 | 900 |
| Tablet (Landscape) | 1024 | 768 |
| Tablet (Portrait) | 768 | 1024 |
| Mobile Large | 414 | 896 |
| Mobile Medium | 375 | 812 |
| Mobile Small | 320 | 568 |

### Hide Elements

Remove unwanted elements using CSS selectors:

```
.cookie-banner, .ads, #popup, .newsletter
```

### Wait For Element

Wait for specific elements to load before capturing:

```
.main-content, #loaded, [data-loaded="true"]
```

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/api/screenshot` | POST | Capture screenshot |
| `/api/settings` | GET | Get settings |
| `/api/settings` | POST | Update settings |
| `/api/history` | GET | Get history |
| `/api/history` | DELETE | Clear history |
| `/api/user-agents` | GET | List user agents |
| `/api/viewport-presets` | GET | List viewport presets |

### Screenshot Request

```json
{
  "url": "https://example.com",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "full_page": false,
  "delay": 2,
  "user_agent": "Mozilla/5.0...",
  "dark_mode": false,
  "format": "png",
  "quality": 90,
  "hide_elements": [".cookie-banner"],
  "wait_for_selector": ".main-content"
}
```

## 🐳 Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

EXPOSE 8000

CMD ["python", "main.py"]
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [FastAPI](https://fastapi.tiangolo.com/) - Web framework
- [Selenium](https://www.selenium.dev/) - Browser automation

---

Made with ❤️ by [Your Name]

⭐ Star this repo if you find it helpful!
