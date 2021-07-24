#!/usr/bin/env bash
npm install @types/react
echo "Starting to deploy 'web', bootstrapping..."
yarn bootstrap
echo "Preparing 'common'..."
cd packages/common || exit
yarn prepare
cd ../web || exit
echo "Prestarting 'web'..."
yarn prestart
echo "Building 'web'..."
# TODO: fix linting errors!
CI=false && yarn build && yarn export
echo "#done"
