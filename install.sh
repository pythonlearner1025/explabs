#!/bin/bash

apt update && apt upgrade

curl -fsSL https://deb.nodesource.com/setup_18.x | bash

apt install -y nodejs

apt install npm

npm install