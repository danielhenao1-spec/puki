@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo No se encontro Node.js.
  echo Instala Node.js 18 o superior desde https://nodejs.org/
  echo o consulta el archivo README.md para usar otra alternativa.
  echo.
  pause
  exit /b 1
)

node servidor.mjs --open
pause
