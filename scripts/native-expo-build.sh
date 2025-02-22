#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <platform> <build-profile>"
  exit 1
fi

pushd packages/mobile

PLATFORM=$1
BUILD_PROFILE=$2


echo 🔃 Getting Expo Fingerpint

FINGERPRINT=$(yarn fingerprint fingerprint:generate | jq -r .hash)

echo ➡️ Expo Fingerprint: $FINGERPRINT

echo 🔃 Getting EAS Build Metadata
BUILD_COUNT=$(yarn dlx --quiet eas-cli build:list --json --status=finished --non-interactive --limit=1 --build-profile=$BUILD_PROFILE --platform=$PLATFORM --fingerprint-hash=$FINGERPRINT  | jq '. | length')


echo ➡️ Existing Build Count: $BUILD_COUNT

# If there is no build, we need to build it

if [ $BUILD_COUNT -eq 0 ]; then
  echo 🔃 Building Expo App

  yarn dlx eas-cli build --platform=$PLATFORM --profile=$BUILD_PROFILE --non-interactive --local --output=eas-build

  echo ✅ Expo App Built
fi
