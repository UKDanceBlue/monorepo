#!/bin/bash

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

zrok config set apiEndpoint https://zrok.tunnel.danceblue.org

echo "DanceBlue Dev Container automatic setup complete!"
echo "To enable Zrok, go to https://zrok.tunnel.danceblue.org and log in with your Zrok account."
echo "Once logged in, open the 'Detail' tab and copy your Token, then paste it here"

read -p "Zrok Token: " zrokToken

if [ -z "$zrokToken" ]; then
  echo "No Zrok Token provided, skipping Zrok setup"
else
  read -p "Name for Zrok tunnel (only lowercase letters): " zrokName
  if [ -z "$zrokName" ]; then
    echo "No Zrok tunnel name provided, skipping Zrok setup"
  else
    if [[ "$zrokName" =~ ^[a-z]+$ ]]; then
      zrok disable
      zrok enable $zrokToken -d $zrokName
      echo $zrokName > .zrokname

      echo "Just ignore the below error messages and logs"
      
      zrok release "${zrokName}metro"
      zrok release "${zrokName}server"
      zrok release "${zrokName}portal"
      zrok reserve public 8081 --unique-name "${zrokName}metro"
      zrok reserve public 8000 --unique-name "${zrokName}server"
      zrok reserve public 5173 --unique-name "${zrokName}portal"
    else
      echo "Invalid Zrok tunnel name provided, skipping Zrok setup"
    fi
  fi
fi