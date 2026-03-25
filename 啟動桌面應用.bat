@echo off
REM Electron 桌面應用啟動器 / Electron Desktop App Launcher
echo ====================================
echo   Serene Pomodoro - Desktop Mode
echo   Electron 桌面應用
echo ====================================
echo.

REM 切換到應用目錄
cd /d "%~dp0"

REM 檢查 node_modules
if not exist "node_modules" (
    echo [提示] 首次運行，正在安裝依賴...
    echo [INFO] First run, installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [錯誤] 依賴安裝失敗
        pause
        exit /b 1
    )
)

REM 啟動 Electron 開發模式
echo.
echo [提示] 正在啟動 Electron 桌面應用...
echo [INFO] Starting Electron desktop app...
echo.
echo 應用將在獨立視窗中開啟
echo The app will open in a standalone window
echo.
echo 按 Ctrl+C 可停止應用
echo Press Ctrl+C to stop the app
echo.

npm run electron:dev

pause
