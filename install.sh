#!/bin/bash
set -e
cp .env.sample .env

SOURCE_ENV_FILE=".env"
VARIABLE_NAME="VITE_BACKEND_API_URL"
SUB_DIR="frontend"
TARGET_ENV_FILE="$SUB_DIR/.env"

VARIABLE_VALUE=$(grep "^${VARIABLE_NAME}=" "$SOURCE_ENV_FILE" | cut -d '=' -f 2-)

if [ -z "$VARIABLE_VALUE" ]; then
  echo "Error: Variable '$VARIABLE_NAME' not in '$SOURCE_ENV_FILE'."
  exit 1
else
  echo "$VARIABLE_NAME=\"$VARIABLE_VALUE\"" > $TARGET_ENV_FILE
fi

sudo docker compose --env-file .env up --build -d
