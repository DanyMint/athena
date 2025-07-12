#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

# Copy .env.sample to .env
Copy-Item .env.sample .env

# Define variables
$SOURCE_ENV_FILE = ".env"
$VARIABLE_NAME = "VITE_BACKEND_API_URL"
$SUB_DIR = "frontend"
$TARGET_ENV_FILE = "$SUB_DIR\.env"

# Extract variable value from .env file
$VARIABLE_VALUE = Get-Content $SOURCE_ENV_FILE |
    Where-Object { $_ -match "^$VARIABLE_NAME=" } |
    ForEach-Object { $_.Split('=', 2)[1] }

if (-not $VARIABLE_VALUE) {
    Write-Host "Error: Variable '$VARIABLE_NAME' not in '$SOURCE_ENV_FILE'." -ForegroundColor Red
    exit 1
} else {
    # Create frontend directory if it doesn't exist
    if (-not (Test-Path $SUB_DIR)) {
        New-Item -ItemType Directory -Path $SUB_DIR | Out-Null
    }

    # Write the variable to target .env file
    "$VARIABLE_NAME=`"$VARIABLE_VALUE`"" | Out-File -FilePath $TARGET_ENV_FILE -Encoding utf8
    Write-Host "Successfully created $TARGET_ENV_FILE with $VARIABLE_NAME" -ForegroundColor Green
}

# Run docker compose
Write-Host "Starting Docker Compose..." -ForegroundColor Yellow
docker compose --env-file .env up --build -d
