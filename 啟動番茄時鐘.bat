@echo off
REM Serene Pomodoro 啟動器 / Launcher
echo ====================================
echo   Serene Pomodoro Timer
echo   啟動中... Starting...
echo ====================================
echo.

REM 檢查是否已安裝 Node.js / Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] 未找到 Node.js，請先安裝 Node.js
    echo [ERROR] Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

REM 切換到應用目錄 / Change to app directory
cd /d "%~dp0"

REM 檢查是否需要安裝依賴 / Check if dependencies need to be installed
if not exist "node_modules" (
    echo [提示] 首次運行，正在安裝依賴...
    echo [INFO] First run, installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [錯誤] 依賴安裝失敗
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM 啟動開發伺服器 / Start dev server
echo.
echo [提示] 正在啟動番茄時鐘應用...
echo [INFO] Starting Pomodoro Timer app...
echo.
echo 應用將在瀏覽器中自動開啟 http://localhost:5173/
echo The app will open automatically in your browser at http://localhost:5173/
echo.
echo 按 Ctrl+C 可停止應用
echo Press Ctrl+C to stop the app
echo.

REM 啟動並自動開啟瀏覽器 / Start and auto-open browser
start http://localhost:5173/
npm run dev

pause
