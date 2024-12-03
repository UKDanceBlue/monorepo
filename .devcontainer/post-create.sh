#!/bin/bash
#cSpell:disable

# echo "!!! ATTENTION !!!"
# echo "DO NOT CLOSE THIS TERMINAL WINDOW UNTIL THE SETUP IS COMPLETE"
# echo "!!! ATTENTION !!!"
# echo ""

# sleep 1

# corepack use yarn@*
# pushd packages/portal
# corepack use yarn@*
# popd
# pushd packages/mobile
# corepack use yarn@*
# popd
# pushd packages/server
# corepack use yarn@*
# popd
# pushd packages/common
# corepack use yarn@*
# popd

# yarn install

zrok config set apiEndpoint https://tunnel.danceblue.org

echo "DanceBlue Dev Container automatic setup complete!"
echo "To enable Zrok, go to https://tunnel.danceblue.org and log in with your Zrok account."
echo "Once logged in, open the 'Detail' tab and copy your Token, then paste it here"

read -p "Zrok Token: " zrokToken

if [ -z "$zrokToken" ]; then
  echo "No Zrok Token provided, skipping Zrok setup"
else
  read -p "Name for this computer: " computerName
  # Set zrokName to computerName with all non-alphanumeric characters removed and converted to lowercase
  zrokName=$(echo $computerName | tr -dc 'a-zA-Z0-9' | tr '[:upper:]' '[:lower:]')
  if [ -z "$zrokName" ]; then
    echo "No Zrok tunnel name provided, skipping Zrok setup"
  else
    if [[ "$zrokName" =~ ^[a-z0-9]+$ ]]; then
      zrok disable
      zrok enable $zrokToken -d "${computerName}"

      echo "Just ignore the below error messages and logs"
      
      zrok release "${zrokName}server"
      zrok reserve public 8000 --unique-name "${zrokName}server"

      sudo bash -c "echo 'export ZROK_NAME=\"${zrokName}\"' >> ~node/.bashrc"
      sudo bash -c "echo 'export EXPO_PUBLIC_API_BASE_URL=\"https://${zrokName}server.tunnel.danceblue.org\"' >> ~node/.bashrc"
    else
      echo "Invalid Zrok tunnel name provided, skipping Zrok setup"
    fi
  fi
fi