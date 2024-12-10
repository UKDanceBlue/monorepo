#!/bin/bash
if [ -z "$ZROK_NAME" ]; then
  echo "ZROK_NAME is not set, aborting Zrok tunnel startup"
  exit 1
fi

exec zrok share reserved "${ZROK_NAME}server" --headless
