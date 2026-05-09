@echo off
setlocal enabledelayedexpansion

title Cloudflare Tunnel Auto-Config
echo Dang doc cau hinh tu file .env...

:: Kiểm tra file .env có tồn tại không
if not exist .env (
    echo [LOI] Khong tim thay file .env trong thu muc nay!
    pause
    exit /b
)

:: Tim dong chua WC_URL va cat lay gia tri sau dau bang (=)
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="WC_URL" (
        set TARGET_URL=%%b
    )
)

:: Kiem tra xem co lay duoc URL khong
if "!TARGET_URL!"=="" (
    echo [LOI] Khong tim thay bien WC_URL trong file .env!
    pause
    exit /b
)

echo ---------------------------------------------------------
echo Da tim thay URL: !TARGET_URL!
echo Dang khoi tao Cloudflare Tunnel...
echo ---------------------------------------------------------

:: Chay tunnel voi URL da doc duoc
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url !TARGET_URL!

pause