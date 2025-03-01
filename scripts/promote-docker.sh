#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <from-branch> <to-branch>"
  exit 1
fi

FROM_BRANCH=$1
TO_BRANCH=$2

echo ⏬ Pulling images
docker image pull ghcr.io/ukdanceblue/app-server:$FROM_BRANCH
docker image pull ghcr.io/ukdanceblue/app-server:$TO_BRANCH

# Check if the two images are the same already
DIFFERENT=$(docker image inspect ghcr.io/ukdanceblue/app-server:$FROM_BRANCH --format='{{.Id}}' | grep $(docker image inspect ghcr.io/ukdanceblue/app-server:$TO_BRANCH --format='{{.Id}}') || true)

if [ -z "$DIFFERENT" ]; then
  echo ⏭️ Promoting image $FROM_BRANCH to $TO_BRANCH
  docker image tag ghcr.io/ukdanceblue/app-server:$FROM_BRANCH ghcr.io/ukdanceblue/app-server:$TO_BRANCH
  
  docker image ls ghcr.io/ukdanceblue/app-server

  echo ⏫ Pushing tagged image $TO_BRANCH
  docker image push --all-tags ghcr.io/ukdanceblue/app-server

  echo ✅ Promoted image $FROM_BRANCH to $TO_BRANCH
else
  echo ☑️ "No new image to promote"
fi
