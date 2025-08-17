param(
  [string]$Repo = ".",
  [switch]$Prod
)
$ErrorActionPreference = "Stop"

if (-not (Test-Path $Repo)) { Write-Error "Нет папки $Repo"; exit 1 }
Set-Location $Repo

$port = 3000
$baseUrl = "http://localhost:$port"

function Run([string]$cmd) {
  Write-Host ">>> $cmd" -ForegroundColor Cyan
  iex $cmd
}

$hasPnpm = (Get-Command pnpm -ErrorAction SilentlyContinue) -ne $null

if ($hasPnpm) {
  if (Test-Path "pnpm-lock.yaml") { Run "pnpm install" } else { Run "pnpm install --shamefully-hoist" }
  if ($Prod) {
    $env:NODE_ENV = "production"
    Run "pnpm build"
    Start-Process $baseUrl
    Run "pnpm start"
  } else {
    Start-Process $baseUrl
    Run "pnpm dev"
  }
} else {
  if (Test-Path "package-lock.json") { Run "npm ci" } else { Run "npm install" }
  if ($Prod) {
    $env:NODE_ENV = "production"
    Run "npm run build"
    Start-Process $baseUrl
    Run "npm start"
  } else {
    Start-Process $baseUrl
    Run "npm run dev"
  }
}
