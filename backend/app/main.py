"""
Browser Screenshot Pro - Backend API
FastAPI + Selenium for advanced browser automation
"""

import os
import uuid
import base64
from datetime import datetime
from typing import Optional, List
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.safari.options import Options as SafariOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Browser Screenshot Pro API",
    description="Advanced browser automation and screenshot API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create screenshots directory
SCREENSHOTS_DIR = Path("screenshots")
SCREENSHOTS_DIR.mkdir(exist_ok=True)

# In-memory storage for screenshot history
screenshot_history: List[dict] = []

# Default settings
default_settings = {
    "browser": "chrome",
    "window_width": 1920,
    "window_height": 1080,
    "full_page": True,
    "delay": 0,
    "dark_mode": False,
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "headless": True,
    "javascript_enabled": True,
    "images_enabled": True,
    "block_ads": False,
}

# Current settings
current_settings = default_settings.copy()


# Pydantic models
class ScreenshotRequest(BaseModel):
    url: str = Field(..., description="URL to capture")
    browser: Optional[str] = Field("chrome", description="Browser to use (chrome, firefox, edge, safari)")
    window_width: Optional[int] = Field(1920, description="Window width")
    window_height: Optional[int] = Field(1080, description="Window height")
    full_page: Optional[bool] = Field(True, description="Capture full page")
    delay: Optional[int] = Field(0, description="Delay before capture (seconds)")
    dark_mode: Optional[bool] = Field(False, description="Enable dark mode")
    selector: Optional[str] = Field(None, description="CSS selector to capture specific element")
    custom_name: Optional[str] = Field(None, description="Custom filename")


class SettingsRequest(BaseModel):
    browser: Optional[str] = None
    window_width: Optional[int] = None
    window_height: Optional[int] = None
    full_page: Optional[bool] = None
    delay: Optional[int] = None
    dark_mode: Optional[bool] = None
    user_agent: Optional[str] = None
    headless: Optional[bool] = None
    javascript_enabled: Optional[bool] = None
    images_enabled: Optional[bool] = None
    block_ads: Optional[bool] = None


class ScreenshotResponse(BaseModel):
    id: str
    url: str
    filename: str
    filepath: str
    browser: str
    width: int
    height: int
    full_page: bool
    timestamp: str
    file_size: int


class SettingsResponse(BaseModel):
    settings: dict


class BrowserInfo(BaseModel):
    name: str
    version: str
    available: bool


def get_driver(browser: str, settings: dict):
    """Initialize WebDriver based on browser type and settings"""
    
    if browser.lower() == "chrome":
        options = ChromeOptions()
        if settings.get("headless", True):
            options.add_argument("--headless=new")
        options.add_argument(f"--window-size={settings['window_width']},{settings['window_height']}")
        options.add_argument(f"--user-agent={settings['user_agent']}")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-web-security")
        options.add_argument("--disable-features=IsolateOrigins,site-per-process")
        
        if settings.get("dark_mode", False):
            options.add_argument("--force-dark-mode")
            options.add_argument("--enable-features=WebUIDarkMode")
        
        if not settings.get("images_enabled", True):
            prefs = {"profile.managed_default_content_settings.images": 2}
            options.add_experimental_option("prefs", prefs)
        
        if settings.get("block_ads", False):
            options.add_argument("--disable-extensions-except=./adblock")
        
        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    
    elif browser.lower() == "firefox":
        options = FirefoxOptions()
        if settings.get("headless", True):
            options.add_argument("--headless")
        options.add_argument(f"--width={settings['window_width']}")
        options.add_argument(f"--height={settings['window_height']}")
        
        profile = webdriver.FirefoxProfile()
        profile.set_preference("general.useragent.override", settings['user_agent'])
        
        if not settings.get("images_enabled", True):
            profile.set_preference("permissions.default.image", 2)
        
        if settings.get("dark_mode", False):
            profile.set_preference("ui.systemUsesDarkTheme", 1)
        
        options.profile = profile
        service = FirefoxService(GeckoDriverManager().install())
        driver = webdriver.Firefox(service=service, options=options)
    
    elif browser.lower() == "edge":
        options = EdgeOptions()
        if settings.get("headless", True):
            options.add_argument("--headless=new")
        options.add_argument(f"--window-size={settings['window_width']},{settings['window_height']}")
        options.add_argument(f"--user-agent={settings['user_agent']}")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        
        service = EdgeService(EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=service, options=options)
    
    elif browser.lower() == "safari":
        options = SafariOptions()
        driver = webdriver.Safari(options=options)
        driver.set_window_size(settings['window_width'], settings['window_height'])
    
    else:
        raise ValueError(f"Unsupported browser: {browser}")
    
    return driver


def take_screenshot_task(request: ScreenshotRequest, screenshot_id: str):
    """Background task to take screenshot"""
    driver = None
    try:
        # Merge request settings with current settings
        settings = current_settings.copy()
        settings.update({
            "browser": request.browser or settings["browser"],
            "window_width": request.window_width or settings["window_width"],
            "window_height": request.window_height or settings["window_height"],
            "full_page": request.full_page if request.full_page is not None else settings["full_page"],
            "delay": request.delay if request.delay is not None else settings["delay"],
            "dark_mode": request.dark_mode if request.dark_mode is not None else settings["dark_mode"],
        })
        
        # Initialize driver
        driver = get_driver(settings["browser"], settings)
        
        # Navigate to URL
        driver.get(request.url)
        
        # Wait for page to load
        delay = settings.get("delay", 0)
        if delay > 0:
            import time
            time.sleep(delay)
        else:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
        
        # Generate filename
        if request.custom_name:
            filename = f"{request.custom_name}.png"
        else:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            domain = request.url.replace("https://", "").replace("http://", "").split("/")[0]
            filename = f"{domain}_{timestamp}.png"
        
        filepath = SCREENSHOTS_DIR / filename
        
        # Take screenshot
        if request.selector:
            # Capture specific element
            element = driver.find_element(By.CSS_SELECTOR, request.selector)
            element.screenshot(str(filepath))
        elif settings["full_page"]:
            # Capture full page
            driver.save_screenshot(str(filepath))
        else:
            # Capture viewport only
            driver.save_screenshot(str(filepath))
        
        # Get file size
        file_size = filepath.stat().st_size
        
        # Create response data
        screenshot_data = {
            "id": screenshot_id,
            "url": request.url,
            "filename": filename,
            "filepath": str(filepath),
            "browser": settings["browser"],
            "width": settings["window_width"],
            "height": settings["window_height"],
            "full_page": settings["full_page"],
            "timestamp": datetime.now().isoformat(),
            "file_size": file_size,
            "status": "completed"
        }
        
        # Add to history
        screenshot_history.append(screenshot_data)
        
        return screenshot_data
    
    except Exception as e:
        error_data = {
            "id": screenshot_id,
            "url": request.url,
            "status": "failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        screenshot_history.append(error_data)
        return error_data
    
    finally:
        if driver:
            driver.quit()


# API Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Browser Screenshot Pro API",
        "version": "2.0.0",
        "docs": "/docs",
        "endpoints": {
            "screenshot": "/api/screenshot",
            "settings": "/api/settings",
            "history": "/api/history",
            "browsers": "/api/browsers"
        }
    }


@app.post("/api/screenshot", response_model=ScreenshotResponse)
async def create_screenshot(
    request: ScreenshotRequest,
    background_tasks: BackgroundTasks
):
    """Create a new screenshot"""
    screenshot_id = str(uuid.uuid4())
    
    # Run screenshot task in background
    result = take_screenshot_task(request, screenshot_id)
    
    if result.get("status") == "failed":
        raise HTTPException(status_code=500, detail=result.get("error"))
    
    return result


@app.post("/api/screenshot/async")
async def create_screenshot_async(
    request: ScreenshotRequest,
    background_tasks: BackgroundTasks
):
    """Create screenshot asynchronously"""
    screenshot_id = str(uuid.uuid4())
    
    # Add to history with pending status
    pending_data = {
        "id": screenshot_id,
        "url": request.url,
        "status": "pending",
        "timestamp": datetime.now().isoformat()
    }
    screenshot_history.append(pending_data)
    
    # Run in background
    background_tasks.add_task(take_screenshot_task, request, screenshot_id)
    
    return {
        "id": screenshot_id,
        "message": "Screenshot request queued",
        "status": "pending",
        "check_status": f"/api/screenshot/{screenshot_id}/status"
    }


@app.get("/api/screenshot/{screenshot_id}/status")
async def get_screenshot_status(screenshot_id: str):
    """Get screenshot status"""
    for screenshot in screenshot_history:
        if screenshot["id"] == screenshot_id:
            return screenshot
    raise HTTPException(status_code=404, detail="Screenshot not found")


@app.get("/api/screenshot/{screenshot_id}/download")
async def download_screenshot(screenshot_id: str):
    """Download screenshot file"""
    for screenshot in screenshot_history:
        if screenshot["id"] == screenshot_id:
            if screenshot.get("status") == "completed":
                filepath = screenshot["filepath"]
                if os.path.exists(filepath):
                    return FileResponse(
                        filepath,
                        media_type="image/png",
                        filename=screenshot["filename"]
                    )
            raise HTTPException(status_code=400, detail="Screenshot not ready or failed")
    raise HTTPException(status_code=404, detail="Screenshot not found")


@app.get("/api/screenshot/{screenshot_id}/preview")
async def preview_screenshot(screenshot_id: str):
    """Preview screenshot as base64"""
    for screenshot in screenshot_history:
        if screenshot["id"] == screenshot_id:
            if screenshot.get("status") == "completed":
                filepath = screenshot["filepath"]
                if os.path.exists(filepath):
                    with open(filepath, "rb") as f:
                        image_data = base64.b64encode(f.read()).decode()
                    return {
                        "id": screenshot_id,
                        "image": f"data:image/png;base64,{image_data}",
                        "filename": screenshot["filename"]
                    }
            raise HTTPException(status_code=400, detail="Screenshot not ready or failed")
    raise HTTPException(status_code=404, detail="Screenshot not found")


@app.get("/api/history")
async def get_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None, enum=["completed", "failed", "pending"])
):
    """Get screenshot history"""
    filtered_history = screenshot_history
    
    if status:
        filtered_history = [s for s in filtered_history if s.get("status") == status]
    
    # Sort by timestamp (newest first)
    sorted_history = sorted(
        filtered_history,
        key=lambda x: x.get("timestamp", ""),
        reverse=True
    )
    
    total = len(sorted_history)
    paginated = sorted_history[offset:offset + limit]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "screenshots": paginated
    }


@app.delete("/api/history/{screenshot_id}")
async def delete_screenshot(screenshot_id: str):
    """Delete a screenshot from history"""
    global screenshot_history
    
    for screenshot in screenshot_history:
        if screenshot["id"] == screenshot_id:
            # Delete file if exists
            filepath = screenshot.get("filepath")
            if filepath and os.path.exists(filepath):
                os.remove(filepath)
            
            # Remove from history
            screenshot_history = [s for s in screenshot_history if s["id"] != screenshot_id]
            
            return {"message": "Screenshot deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Screenshot not found")


@app.get("/api/settings", response_model=SettingsResponse)
async def get_settings():
    """Get current settings"""
    return {"settings": current_settings}


@app.post("/api/settings")
async def update_settings(request: SettingsRequest):
    """Update settings"""
    global current_settings
    
    update_data = request.dict(exclude_unset=True)
    current_settings.update(update_data)
    
    return {"settings": current_settings, "message": "Settings updated successfully"}


@app.post("/api/settings/reset")
async def reset_settings():
    """Reset settings to defaults"""
    global current_settings
    current_settings = default_settings.copy()
    return {"settings": current_settings, "message": "Settings reset to defaults"}


@app.get("/api/browsers")
async def get_available_browsers():
    """Get list of available browsers"""
    browsers = []
    
    # Check Chrome
    try:
        options = ChromeOptions()
        options.add_argument("--headless=new")
        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        version = driver.capabilities['browserVersion']
        driver.quit()
        browsers.append({"name": "chrome", "version": version, "available": True})
    except Exception as e:
        browsers.append({"name": "chrome", "version": "", "available": False, "error": str(e)})
    
    # Check Firefox
    try:
        options = FirefoxOptions()
        options.add_argument("--headless")
        service = FirefoxService(GeckoDriverManager().install())
        driver = webdriver.Firefox(service=service, options=options)
        version = driver.capabilities['browserVersion']
        driver.quit()
        browsers.append({"name": "firefox", "version": version, "available": True})
    except Exception as e:
        browsers.append({"name": "firefox", "version": "", "available": False, "error": str(e)})
    
    # Check Edge
    try:
        options = EdgeOptions()
        options.add_argument("--headless=new")
        service = EdgeService(EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=service, options=options)
        version = driver.capabilities['browserVersion']
        driver.quit()
        browsers.append({"name": "edge", "version": version, "available": True})
    except Exception as e:
        browsers.append({"name": "edge", "version": "", "available": False, "error": str(e)})
    
    return {"browsers": browsers}


@app.get("/api/stats")
async def get_stats():
    """Get screenshot statistics"""
    total = len(screenshot_history)
    completed = len([s for s in screenshot_history if s.get("status") == "completed"])
    failed = len([s for s in screenshot_history if s.get("status") == "failed"])
    pending = len([s for s in screenshot_history if s.get("status") == "pending"])
    
    # Calculate total file size
    total_size = sum(
        s.get("file_size", 0) 
        for s in screenshot_history 
        if s.get("status") == "completed"
    )
    
    # Get unique domains
    domains = set()
    for s in screenshot_history:
        if s.get("url"):
            domain = s["url"].replace("https://", "").replace("http://", "").split("/")[0]
            domains.add(domain)
    
    return {
        "total_screenshots": total,
        "completed": completed,
        "failed": failed,
        "pending": pending,
        "total_size_bytes": total_size,
        "total_size_mb": round(total_size / (1024 * 1024), 2),
        "unique_domains": len(domains),
        "domains": list(domains)[:10]  # Return first 10 domains
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)