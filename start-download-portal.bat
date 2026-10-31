@echo off
title Margdarshak Download Portal
echo ====================================================================
echo   MARGDARSHAK (मार्गदर्शक) — MOBILE DOWNLOAD PORTAL
echo ====================================================================
echo.
echo Detecting your Wi-Fi IPv4 Address...
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0.*0.0.0.0 ^| findstr /v "Default"') do (
    set LOCAL_IP=%%a
    goto :found_ip
)
:found_ip
if "%LOCAL_IP%"=="" set LOCAL_IP=127.0.0.1

echo.
echo ====================================================================
echo   Download Portal is live!
echo.
echo   1. On your PC:   http://localhost:8080/download.html
echo   2. On your Phone: http://%LOCAL_IP%:8080/download.html
echo.
echo   (Ensure your phone is connected to the same Wi-Fi network)
echo ====================================================================
echo.
start http://localhost:8080/download.html
python -m http.server 8080
pause
