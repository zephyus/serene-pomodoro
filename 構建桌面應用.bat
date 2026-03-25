@echo off
REM 構建 Electron Windows 安裝程式 / Build Electron Windows Installer
echo ====================================
echo   構建 Windows 桌面應用
echo   Building Windows Desktop App
echo ====================================
echo.

cd /d "%~dp0"

echo [步驟 1/2] 構建 Web 應用...
echo [Step 1/2] Building web app...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [錯誤] Web 應用構建失敗
    echo [ERROR] Web app build failed
    pause
    exit /b 1
)

echo.
echo [步驟 2/2] 打包 Electron 應用...
echo [Step 2/2] Packaging Electron app...
call npm run electron:build:win

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   ✅ 構建成功！/ Build Successful!
    echo ====================================
    echo.
    echo 安裝程式位置 / Installer location:
    echo   release\Serene Pomodoro Setup 1.0.0.exe
    echo.
    echo 便攜版位置 / Portable version:
    echo   release\Serene Pomodoro 1.0.0.exe
    echo.
    echo 你現在可以：
    echo You can now:
    echo   1. 執行安裝程式安裝應用
    echo   2. 或直接執行便攜版
    echo.
) else (
    echo.
    echo [錯誤] Electron 打包失敗
    echo [ERROR] Electron packaging failed
)

pause
