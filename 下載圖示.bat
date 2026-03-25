@echo off
REM 下載番茄圖示 / Download Pomodoro Icon
echo ====================================
echo   下載番茄時鐘圖示
echo   Downloading Pomodoro Icon
echo ====================================
echo.

cd /d "%~dp0"

echo 正在下載圖示... / Downloading icon...
echo.

REM 使用 PowerShell 下載免費的番茄圖示
powershell -Command "& { Invoke-WebRequest -Uri 'https://cdn-icons-png.flaticon.com/512/2515/2515268.png' -OutFile 'pomodoro-icon.png' -ErrorAction SilentlyContinue }"

if exist "pomodoro-icon.png" (
    echo [成功] 圖示已下載！
    echo [SUCCESS] Icon downloaded!
    echo.
    echo 檔案位置: pomodoro-icon.png
    echo File location: pomodoro-icon.png
    echo.
    echo ⚠️  下一步：需要將 PNG 轉換為 ICO 格式
    echo ⚠️  Next step: Need to convert PNG to ICO format
    echo.
    echo 請訪問以下網站進行轉換：
    echo Please visit one of these sites to convert:
    echo.
    echo   1. https://convertio.co/png-ico/
    echo   2. https://www.icoconverter.com/
    echo   3. https://cloudconvert.com/png-to-ico
    echo.
    echo 轉換後，儲存為 pomodoro-icon.ico
    echo After converting, save as pomodoro-icon.ico
    echo.
) else (
    echo [失敗] 下載失敗，請手動下載圖示
    echo [FAILED] Download failed, please download icon manually
    echo.
    echo 你可以：
    echo You can:
    echo   1. 從 https://www.flaticon.com/ 搜尋 "pomodoro" 或 "tomato"
    echo   2. 下載喜歡的圖示
    echo   3. 轉換為 .ico 格式
    echo   4. 命名為 pomodoro-icon.ico
    echo.
)

pause
