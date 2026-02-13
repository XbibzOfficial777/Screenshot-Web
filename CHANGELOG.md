# Changelog

All notable changes to Browser Screenshot Pro will be documented in this file.

## [1.0.0] - 2024-02-13

### 🎉 Initial Release

#### Features

- **Dashboard**
  - URL input with recent URLs history
  - Viewport presets (Desktop, Tablet, Mobile)
  - Custom viewport dimensions
  - Full page capture option
  - Delay control for lazy-loaded content
  - Image format selection (PNG, JPEG, WebP)
  - Quality control
  - Dark mode emulation
  - Advanced settings (User Agent, element hiding, wait for selector)
  - Real-time preview with download

- **Settings**
  - Default screenshot settings
  - Browser language and timezone
  - Privacy settings (headless, disable images, disable JS)
  - User Agent customization
  - Geolocation override
  - Tabbed interface (General, Viewport, Privacy, Advanced)

- **History**
  - Screenshot history tracking
  - Search and filter
  - Statistics dashboard
  - Item details dialog
  - Clear history option

- **Theme**
  - Dark/Light/System mode toggle
  - Automatic system preference detection
  - Persistent theme selection

- **Backend API**
  - FastAPI with Selenium WebDriver
  - Screenshot capture endpoint
  - Settings management
  - History tracking
  - User Agent presets
  - Viewport presets

- **Deployment**
  - GitHub Actions CI/CD
  - Automatic deployment to GitHub Pages
  - Docker support

#### Tech Stack

- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Python + FastAPI + Selenium
- Deployment: GitHub Actions + GitHub Pages

---

## Versioning Format

This project follows [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- MAJOR: Incompatible API changes
- MINOR: Backwards-compatible functionality additions
- PATCH: Backwards-compatible bug fixes
