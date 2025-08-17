@echo off
setlocal enabledelayedexpansion

:: === НАСТРОЙКИ ===
set REPO_DIR=C:\Work\ai-site\github\ai-site-web-main\ai-site-web-main
set GITHUB_USERNAME=petrovav024026-cyber
set REPO_NAME=ai-site-web

:: === ПЕРЕХОД В ПАПКУ РЕПО ===
cd /d "%REPO_DIR%"
if errorlevel 1 (
    echo [ERROR] Не удалось перейти в папку %REPO_DIR%
    pause
    exit /b
)

:: === ВВОД ТОКЕНА ===
set /p GITHUB_TOKEN=Введите GitHub Token: 

:: === ВВОД СООБЩЕНИЯ КОММИТА ===
set /p COMMIT_MESSAGE=Комментарий к коммиту: 

:: === GIT ADD ===
echo [INFO] Добавление файлов...
git add .

:: === GIT COMMIT ===
echo [INFO] Создание коммита...
git commit -m "!COMMIT_MESSAGE!"

:: === GIT PUSH ===
echo [INFO] Отправка на GitHub...
git push https://%GITHUB_USERNAME%:!GITHUB_TOKEN!@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git main

pause
