@echo off
title RentAI / SDC2 Complete Automated Startup
echo ==========================================================
echo   RentAI / SDC2 Complete Ecosystem Automated Launcher     
echo ==========================================================

REM Start Ollama in background if not running
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [OLLAMA] Auto-connecting Ollama LLM service...
    start /b "" ollama serve >nul 2>&1
    timeout /t 2 /nobreak >nul
) else (
    echo [OLLAMA] Ollama already active on port 11434.
)

REM Run PowerShell launcher for all services
powershell -ExecutionPolicy Bypass -File "%~dp0start_all.ps1"
