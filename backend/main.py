"""
Browser Screenshot Pro - Backend API
FastAPI + Selenium for advanced browser screenshot capabilities
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, Literal
from datetime import datetime
import os
import json
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import uvicorn

app = FastAPI(
    title="Browser Screenshot Pro API",
    description="Advanced browser screenshot API with Selenium",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class ScreenshotRequest(BaseModel):
    url: HttpUrl
    viewport_width: int = 1920
    viewport_height: int = 1080
    full_page: bool = False
    delay: int = 0
    user_agent: Optional[str] = None
    dark_mode: bool = False
    format: Literal["png", "jpeg", "webp"] = "png"
    quality: int = 90
    hide_elements: Optional[list[str]] = None
    wait_for_selector: Optional[str] = None

class BrowserSettings(BaseModel):
    default_viewport_width: int = 1920
    default_viewport_height: int = 1080
    default_delay: int = 0
    default_format: Literal["png", "jpeg", "webp"] = "png"
    default_quality: int = 90
    headless: bool = True
    disable_images: bool = False
    disable_js: bool = False
    user_agent: Optional[str] = None
    language: str = "en-US"
    timezone: str = "UTC"
    geolocation: Optional[dict] = None

class ScreenshotResponse(BaseModel):
    success: bool
    image_base64: Optional[str] = None
    filename: Optional[str] = None
    timestamp: datetime
    url: str
    message: str
    metadata: Optional[dict] = None

# In-memory storage for settings
settings_store = BrowserSettings()
screenshot_history = []

def get_chrome_driver(config: BrowserSettings):
    """Initialize Chrome driver with custom settings"""
    chrome_options = Options()
    
    if config.headless:
        chrome_options.add_argument("--headless=new")
    
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument(f"--window-size={config.default_viewport_width},{config.default_viewport_height}")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    if config.disable_images:
        chrome_prefs = {"profile.default_content_settings": {"images": 2}}
        chrome_options.experimental_options["prefs"] = chrome_prefs
    
    if config.user_agent:
        chrome_options.add_argument(f"--user-agent={config.user_agent}")
    
    chrome_options.add_argument(f"--lang={config.language}")
    
    # Initialize driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Execute CDP commands to prevent detection
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
        'source': '''
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        '''
    })
    
    return driver

@app.get("/")
async def root():
    return {
        "message": "Browser Screenshot Pro API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "screenshot": "/api/screenshot",
            "settings": "/api/settings",
            "history": "/api/history"
        }
    }

@app.post("/api/screenshot", response_model=ScreenshotResponse)
async def take_screenshot(request: ScreenshotRequest):
    """Take a screenshot of a webpage"""
    driver = None
    try:
        # Create temporary config from request
        temp_config = BrowserSettings(
            default_viewport_width=request.viewport_width,
            default_viewport_height=request.viewport_height,
            default_delay=request.delay,
            default_format=request.format,
            default_quality=request.quality,
            user_agent=request.user_agent or settings_store.user_agent
        )
        
        driver = get_chrome_driver(temp_config)
        
        # Navigate to URL
        driver.get(str(request.url))
        
        # Wait for specific element if specified
        if request.wait_for_selector:
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, request.wait_for_selector))
                )
            except:
                pass
        
        # Apply delay
        if request.delay > 0:
            import time
            time.sleep(request.delay)
        
        # Hide elements if specified
        if request.hide_elements:
            for selector in request.hide_elements:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        driver.execute_script("arguments[0].style.display='none'", element)
                except:
                    pass
        
        # Enable dark mode if requested
        if request.dark_mode:
            driver.execute_cdp_cmd('Emulation.setAutoDarkModeOverride', {'enabled': True})
        
        # Take screenshot
        if request.full_page:
            # Get full page dimensions
            total_width = driver.execute_script("return document.body.scrollWidth")
            total_height = driver.execute_script("return document.body.scrollHeight")
            driver.set_window_size(total_width, total_height)
            screenshot = driver.get_screenshot_as_png()
        else:
            screenshot = driver.get_screenshot_as_png()
        
        # Convert to base64
        image_base64 = base64.b64encode(screenshot).decode('utf-8')
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        domain = str(request.url).split('/')[2].replace('.', '_')
        filename = f"screenshot_{domain}_{timestamp}.{request.format}"
        
        # Store in history
        screenshot_history.append({
            "filename": filename,
            "url": str(request.url),
            "timestamp": datetime.now().isoformat(),
            "viewport": f"{request.viewport_width}x{request.viewport_height}",
            "full_page": request.full_page
        })
        
        return ScreenshotResponse(
            success=True,
            image_base64=image_base64,
            filename=filename,
            timestamp=datetime.now(),
            url=str(request.url),
            message="Screenshot captured successfully",
            metadata={
                "viewport": f"{request.viewport_width}x{request.viewport_height}",
                "full_page": request.full_page,
                "format": request.format,
                "size_bytes": len(screenshot)
            }
        )
        
    except Exception as e:
        return ScreenshotResponse(
            success=False,
            timestamp=datetime.now(),
            url=str(request.url),
            message=f"Error: {str(e)}"
        )
    finally:
        if driver:
            driver.quit()

@app.get("/api/settings")
async def get_settings():
    """Get current browser settings"""
    return settings_store

@app.post("/api/settings")
async def update_settings(settings: BrowserSettings):
    """Update browser settings"""
    global settings_store
    settings_store = settings
    return {"success": True, "message": "Settings updated", "settings": settings_store}

@app.get("/api/history")
async def get_history(limit: int = 50):
    """Get screenshot history"""
    return {
        "history": screenshot_history[-limit:],
        "total": len(screenshot_history)
    }

@app.delete("/api/history")
async def clear_history():
    """Clear screenshot history"""
    global screenshot_history
    screenshot_history = []
    return {"success": True, "message": "History cleared"}

@app.get("/api/user-agents")
async def get_user_agents():
    """Get list of common user agents"""
    return {
        "user_agents": [
            {"name": "Chrome (Windows)", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
            {"name": "Chrome (Mac)", "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
            {"name": "Firefox (Windows)", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"},
            {"name": "Safari (Mac)", "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15"},
            {"name": "Edge (Windows)", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"},
            {"name": "Mobile iPhone", "value": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1"},
            {"name": "Mobile Android", "value": "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"}
        ]
    }

@app.get("/api/viewport-presets")
async def get_viewport_presets():
    """Get common viewport presets"""
    return {
        "presets": [
            {"name": "Desktop HD", "width": 1920, "height": 1080},
            {"name": "Desktop", "width": 1366, "height": 768},
            {"name": "Laptop", "width": 1440, "height": 900},
            {"name": "Tablet (Landscape)", "width": 1024, "height": 768},
            {"name": "Tablet (Portrait)", "width": 768, "height": 1024},
            {"name": "Mobile Large", "width": 414, "height": 896},
            {"name": "Mobile Medium", "width": 375, "height": 812},
            {"name": "Mobile Small", "width": 320, "height": 568}
        ]
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
