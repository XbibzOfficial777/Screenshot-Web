# 📁 Project Structure

```
browser-screenshot-pro/
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── deploy.yml              # GitHub Actions CI/CD workflow
│
├── 📂 app/                         # Frontend (React + TypeScript)
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/              # shadcn/ui components (40+)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── ... (40+ components)
│   │   │   │
│   │   │   └── Layout.tsx          # Main layout with sidebar
│   │   │
│   │   ├── 📂 hooks/
│   │   │   ├── useTheme.tsx        # Dark/Light mode hook
│   │   │   └── use-mobile.ts       # Mobile detection hook
│   │   │
│   │   ├── 📂 lib/
│   │   │   ├── api.ts              # API client
│   │   │   └── utils.ts            # Utility functions
│   │   │
│   │   ├── 📂 sections/
│   │   │   ├── Dashboard.tsx       # Main dashboard page
│   │   │   ├── Settings.tsx        # Settings page
│   │   │   ├── History.tsx         # Screenshot history page
│   │   │   └── Statistics.tsx      # Statistics page
│   │   │
│   │   ├── 📂 types/
│   │   │   └── index.ts            # TypeScript type definitions
│   │   │
│   │   ├── App.tsx                 # Main App component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── 📄 index.html               # HTML template
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 vite.config.ts           # Vite configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS config
│   ├── 📄 tsconfig.json            # TypeScript config
│   └── 📄 .env.example             # Environment variables example
│
├── 📂 backend/                     # Backend (Python + FastAPI)
│   ├── 📂 app/
│   │   ├── __init__.py
│   │   └── main.py                 # FastAPI application
│   │
│   ├── 📄 requirements.txt         # Python dependencies
│   └── 📄 package.json             # NPM scripts for backend
│
├── 📂 screenshots/                 # Screenshot storage
│   └── .gitkeep
│
├── 📄 Dockerfile                   # Multi-stage Docker build
├── 📄 docker-compose.yml           # Docker Compose configuration
├── 📄 nginx.conf                   # Nginx configuration
├── 📄 .gitignore                   # Git ignore rules
├── 📄 LICENSE                      # MIT License
├── 📄 README.md                    # Main documentation
└── 📄 PROJECT_STRUCTURE.md         # This file
```

## 🎯 Key Files Explained

### Frontend (`/app`)

| File | Description |
|------|-------------|
| `src/App.tsx` | Main React component with routing |
| `src/components/Layout.tsx` | Sidebar navigation layout |
| `src/hooks/useTheme.tsx` | Dark/Light mode provider |
| `src/lib/api.ts` | API client for backend communication |
| `src/sections/Dashboard.tsx` | Main screenshot capture interface |
| `src/sections/Settings.tsx` | Browser configuration settings |
| `src/sections/History.tsx` | Screenshot history management |
| `src/sections/Statistics.tsx` | Analytics and metrics |
| `src/types/index.ts` | TypeScript interfaces |

### Backend (`/backend`)

| File | Description |
|------|-------------|
| `app/main.py` | FastAPI application with all endpoints |
| `requirements.txt` | Python package dependencies |

### DevOps

| File | Description |
|------|-------------|
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD pipeline |
| `Dockerfile` | Multi-stage Docker build |
| `docker-compose.yml` | Container orchestration |
| `nginx.conf` | Nginx reverse proxy config |

## 🚀 Quick Navigation

- **Dashboard**: `/app/src/sections/Dashboard.tsx`
- **Settings**: `/app/src/sections/Settings.tsx`
- **History**: `/app/src/sections/History.tsx`
- **Statistics**: `/app/src/sections/Statistics.tsx`
- **API**: `/backend/app/main.py`
- **Theme**: `/app/src/hooks/useTheme.tsx`
- **API Client**: `/app/src/lib/api.ts`