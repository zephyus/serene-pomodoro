@echo off
REM 創建番茄時鐘快捷方式並設定圖示 / Create Pomodoro Shortcut with Icon
echo ====================================
echo   創建桌面快捷方式
echo   Creating Desktop Shortcut
echo ====================================
echo.

cd /d "%~dp0"

REM 設定路徑 / Set paths
set BAT_PATH=%~dp0啟動番茄時鐘.bat
set ICON_PATH=%~dp0pomodoro-icon.ico
set SHORTCUT_PATH=%USERPROFILE%\Desktop\番茄時鐘.lnk

REM 檢查圖示檔案 / Check icon file
if not exist "%ICON_PATH%" (
    echo [警告] 找不到圖示檔案: pomodoro-icon.ico
    echo [WARNING] Icon file not found: pomodoro-icon.ico
    echo.
    echo 請確保 pomodoro-icon.ico 在相同目錄下
    echo Please ensure pomodoro-icon.ico is in the same directory
    echo.
    pause
    exit /b 1
)

REM 使用 PowerShell 創建快捷方式 / Create shortcut using PowerShell
echo 正在創建快捷方式... / Creating shortcut...
powershell -Command "$WS = New-Object -ComObject WScript.Shell; $SC = $WS.CreateShortcut('%SHORTCUT_PATH%'); $SC.TargetPath = '%BAT_PATH%'; $SC.IconLocation = '%ICON_PATH%'; $SC.WorkingDirectory = '%~dp0'; $SC.Description = 'Serene Pomodoro Timer - 番茄時鐘'; $SC.Save()"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [成功] 快捷方式已創建在桌面！
    echo [SUCCESS] Shortcut created on Desktop!
    echo.
    echo 快捷方式名稱: 番茄時鐘.lnk
    echo Shortcut name: 番茄時鐘.lnk
    echo.
    echo ✨ 你現在可以：
    echo    1. 雙擊桌面上的「番茄時鐘」啟動應用
    echo    2. 右鍵點擊 -^> 「釘選到工作列」將它固定在工作列
    echo.
    echo ✨ You can now:
    echo    1. Double-click "番茄時鐘" on Desktop to launch
    echo    2. Right-click -^> "Pin to taskbar" to pin it
    echo.
) else (
    echo.
    echo [錯誤] 創建快捷方式失敗
    echo [ERROR] Failed to create shortcut
    echo.
)

pause
