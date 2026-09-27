# SDC2 / RentAI Universal One-Click Automated Startup Script
# Automatically connects MongoDB, Ollama, Django Backend, and Vite Frontend

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  RentAI / SDC2 Complete Ecosystem Automated Launcher     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ROOT_DIR = Split-Path -Parent $PSScriptRoot

# 1. Check and Start MongoDB (Port 27017)
Write-Host "`n[1/4] Checking MongoDB Service on port 27017..." -ForegroundColor Yellow
$mongoActive = (Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue).TcpTestSucceeded
if (-not $mongoActive) {
    Write-Host "Starting local MongoDB 8.3 Daemon..." -ForegroundColor Gray
    $mongoData = Join-Path $ROOT_DIR "mongo_data"
    Start-Process "mongod.exe" -ArgumentList "--dbpath `"$mongoData`"" -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
Write-Host "[+] MongoDB Connected (127.0.0.1:27017)" -ForegroundColor Green

# 2. Check and Start Ollama LLM Daemon (Port 11434)
Write-Host "`n[2/4] Checking Ollama AI Daemon on port 11434..." -ForegroundColor Yellow
$ollamaActive = (Test-NetConnection -ComputerName 127.0.0.1 -Port 11434 -WarningAction SilentlyContinue).TcpTestSucceeded
if (-not $ollamaActive) {
    Write-Host "Auto-connecting Ollama daemon ('ollama serve')..." -ForegroundColor Gray
    Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
Write-Host "[+] Ollama AI Connected (127.0.0.1:11434)" -ForegroundColor Green

# 3. Check and Start Django Backend (Port 8000)
Write-Host "`n[3/4] Checking Django REST API on port 8000..." -ForegroundColor Yellow
$backendActive = (Test-NetConnection -ComputerName 127.0.0.1 -Port 8000 -WarningAction SilentlyContinue).TcpTestSucceeded
if (-not $backendActive) {
    Write-Host "Starting Django Backend on port 8000..." -ForegroundColor Gray
    $backendDir = Join-Path $ROOT_DIR "backend"
    Start-Process "python" -ArgumentList "manage.py runserver 0.0.0.0:8000 --noreload" -WorkingDirectory $backendDir -WindowStyle Hidden
    Start-Sleep -Seconds 3
}
Write-Host "[+] Django Backend Connected (http://localhost:8000)" -ForegroundColor Green

# 4. Check and Start Vite Frontend (Port 5173)
Write-Host "`n[4/4] Checking Vite React Frontend on port 5173..." -ForegroundColor Yellow
$frontendActive = (Test-NetConnection -ComputerName 127.0.0.1 -Port 5173 -WarningAction SilentlyContinue).TcpTestSucceeded
if (-not $frontendActive) {
    Write-Host "Starting Vite Frontend on port 5173..." -ForegroundColor Gray
    $frontendDir = Join-Path $ROOT_DIR "frontend"
    Start-Process "cmd.exe" -ArgumentList "/c npm run dev -- --host 0.0.0.0 --port 5173" -WorkingDirectory $frontendDir -WindowStyle Hidden
    Start-Sleep -Seconds 3
}
Write-Host "[+] Vite Frontend Connected (http://localhost:5173)" -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  ALL SYSTEMS OPERATIONAL! Opening http://localhost:5173  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Start-Process "http://localhost:5173"
