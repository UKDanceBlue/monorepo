FROM mcr.microsoft.com/devcontainers/javascript-node:22

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends chromium
# RUN curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok

RUN curl -sSLfo ./zrok-install.bash https://get.openziti.io/install.bash && chmod +x ./zrok-install.bash && sudo ./zrok-install.bash zrok

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"

COPY --chown=node:node ./.bashrc /home/node/.bashrc
COPY --chown=node:node ./git-prompt.sh /home/node/.git-prompt.sh

# Enable corepack
RUN corepack enable
