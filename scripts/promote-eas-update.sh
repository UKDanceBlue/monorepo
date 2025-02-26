#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <from-branch> <to-branch>"
  exit 1
fi

pushd packages/mobile

FROM_BRANCH=$1
TO_BRANCH=$2

echo 🔃 Getting EAS Update Metadata


FROM_GROUP_ID_JSON=$(npx eas-cli update:list --limit=1 --branch=$FROM_BRANCH --non-interactive --json)
FROM_GROUP_ID=$(echo $FROM_GROUP_ID_JSON | jq .currentPage[0].group -r)

FROM_GROUP_COMMIT_JSON=$(npx eas-cli update:view --json $FROM_GROUP_ID)
FROM_GROUP_COMMIT=$(echo $FROM_GROUP_COMMIT_JSON | jq .[0].gitCommitHash -r)

FROM_GROUP_ID_JSON=$(npx eas-cli update:list --limit=1 --branch=$TO_BRANCH --non-interactive --json)
TO_GROUP_ID=$(echo $FROM_GROUP_ID_JSON | jq .currentPage[0].group -r)

FROM_GROUP_COMMIT_JSON=$(npx eas-cli update:view --json $TO_GROUP_ID)
TO_GROUP_COMMIT=$(echo $FROM_GROUP_COMMIT_JSON | jq .[0].gitCommitHash -r)

if [ "$FROM_GROUP_COMMIT" != "$TO_GROUP_COMMIT" ]; then
  echo ⏭️ Promoting EAS Update $FROM_GROUP_ID to $TO_BRANCH
  
  npx eas-cli update:republish --group=$FROM_GROUP_ID --destination-branch=$TO_BRANCH --non-interactive --message="Promote $FROM_BRANCH to $TO_BRANCH"

  echo ✅ Promoted EAS Update $FROM_GROUP_ID to $TO_BRANCH
else
  echo ☑️ "No eas update to promote"
fi

popd
