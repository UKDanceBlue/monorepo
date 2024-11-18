#!/bin/bash
#cSpell:disable

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
      zrok enable $zrokToken -d $zrokName
      echo $zrokName > .devcontainer/.zrokname

      echo "Just ignore the below error messages and logs"
      
      zrok release "${zrokName}metro"
      zrok release "${zrokName}server"
      zrok release "${zrokName}portal"
      zrok reserve public 8081 --unique-name "${zrokName}metro"
      zrok reserve public 8000 --unique-name "${zrokName}server"
      zrok reserve public 5173 --unique-name "${zrokName}portal"

      sudo bash -c "echo 'ZROK_NAME=${zrokName}' >> /etc/environment"
    else
      echo "Invalid Zrok tunnel name provided, skipping Zrok setup"
    fi
  fi
fi