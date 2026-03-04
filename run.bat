@echo off
cd /d "%~dp0"
title Natural Premium - Website

echo ========================================
echo   Natural Premium - تشغيل الموقع
echo ========================================
echo.

if not exist "node_modules" (
    echo [1/4] تثبيت الحزم...
    call npm install
    echo.
) else (
    echo [1/4] الحزم مثبتة
)

echo [2/4] تجهيز قاعدة البيانات...
call npx prisma generate
call npx prisma db push --accept-data-loss 2>nul
echo.

echo [3/4] تشغيل الموقع...
echo.
echo    افتح المتصفح على:  http://localhost:3000
echo.
echo ========================================
echo.

call npm run dev

echo.
echo انتهى التشغيل. اضغط اي زر للخروج...
pause >nul
