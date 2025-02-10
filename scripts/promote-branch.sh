#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <from-branch> <to-branch>"
  exit 1
fi

pushd packages/mobile

FROM_BRANCH=$1
TO_BRANCH=$2

echo Getting EAS Update Metadata

FROM_GROUP_ID_JSON=$(npx eas-cli update:list --limit=1 --branch=$FROM_BRANCH --non-interactive --json)
echo $FROM_GROUP_ID_JSON
FROM_GROUP_ID=$(echo $FROM_GROUP_ID_JSON | jq .currentPage[0].group -r)
echo From group id: $FROM_GROUP_ID
FROM_GROUP_COMMIT_JSON=$(npx eas-cli update:view --json $FROM_GROUP_ID)
echo $FROM_GROUP_COMMIT_JSON
FROM_GROUP_COMMIT=$(echo $FROM_GROUP_COMMIT_JSON | jq .[0].gitCommitHash -r)
echo From group commit: $FROM_GROUP_COMMIT

FROM_GROUP_ID_JSON=$(npx eas-cli update:list --limit=1 --branch=$TO_BRANCH --non-interactive --json)
echo $FROM_GROUP_ID_JSON
TO_GROUP_ID=$(echo $FROM_GROUP_ID_JSON | jq .currentPage[0].group -r)
echo To group id: $TO_GROUP_ID
FROM_GROUP_COMMIT_JSON=$(npx eas-cli update:view --json $TO_GROUP_ID)
echo $FROM_GROUP_COMMIT_JSON
TO_GROUP_COMMIT=$(echo $FROM_GROUP_COMMIT_JSON | jq .[0].gitCommitHash -r)
echo To group commit: $TO_GROUP_COMMIT

if [ "$FROM_GROUP_COMMIT" != "$TO_GROUP_COMMIT" ]; then
  echo Promoting EAS Update $FROM_GROUP_ID to $TO_BRANCH
  npx eas-cli update:republish --group=$FROM_GROUP_ID --destination-branch=$TO_BRANCH --non-interactive --message="Promote $FROM_BRANCH to $TO_BRANCH"
else
  echo "No eas update to promote"
fi

popd

echo Pulling images
docker image pull ghcr.io/ukdanceblue/app-server:$FROM_BRANCH
docker image pull ghcr.io/ukdanceblue/app-server:$TO_BRANCH

# Check if the two images are the same already
DIFFERENT=$(docker image inspect ghcr.io/ukdanceblue/app-server:$FROM_BRANCH --format='{{.Id}}' | grep $(docker image inspect ghcr.io/ukdanceblue/app-server:$TO_BRANCH --format='{{.Id}}') || true)

if [ -z "$DIFFERENT" ]; then
  echo Promoting image $FROM_BRANCH to $TO_BRANCH
  docker image tag ghcr.io/ukdanceblue/app-server:$FROM_BRANCH ghcr.io/ukdanceblue/app-server:$TO_BRANCH

  docker image push ghcr.io/ukdanceblue/app-server:$TO_BRANCH
else
  echo "No new image to promote"
fi
