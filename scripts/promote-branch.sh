#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <from-branch> <to-branch>"
  exit 1
fi

pushd packages/mobile

FROM_BRANCH=$1
TO_BRANCH=$2

FROM_GROUP_ID=$(npx eas-cli update:list --limit=1 --branch=$FROM_BRANCH --non-interactive --json 2>/dev/null | jq .currentPage[0].group -r)
FROM_GROUP_COMMIT=$(npx eas-cli update:view --json $FROM_GROUP_ID | jq .[0].gitCommitHash -r)

TO_GROUP_ID=$(npx eas-cli update:list --limit=1 --branch=$TO_BRANCH --non-interactive --json 2>/dev/null | jq .currentPage[0].group -r)
TO_GROUP_COMMIT=$(npx eas-cli update:view --json $TO_GROUP_ID | jq .[0].gitCommitHash -r)

if [ "$FROM_GROUP_COMMIT" != "$TO_GROUP_COMMIT" ]; then
  npx eas-cli update:republish --group=$GROUPID --destination-branch=$TO_BRANCH --non-interactive --message="Promote $FROM_BRANCH to $TO_BRANCH"
else
  echo "No eas update to promote"
fi


popd

docker image pull ghcr.io/ukdanceblue/app-server:$FROM_BRANCH
docker image pull ghcr.io/ukdanceblue/app-server:$TO_BRANCH

# Check if the two images are the same already
DIFFERENT=$(docker image inspect ghcr.io/ukdanceblue/app-server:$FROM_BRANCH --format='{{.Id}}' | grep $(docker image inspect ghcr.io/ukdanceblue/app-server:$TO_BRANCH --format='{{.Id}}') || true)

if [ -z "$DIFFERENT" ]; then
  docker image tag ghcr.io/ukdanceblue/app-server:$FROM_BRANCH ghcr.io/ukdanceblue/app-server:$TO_BRANCH

  docker image push ghcr.io/ukdanceblue/app-server:$TO_BRANCH
else
  echo "No new image to promote"
fi
