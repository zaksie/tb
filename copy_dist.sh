#!/bin/bash

gcloud storage cp --recursive dist/tb/browser/** gs://battle-squire &

rm -rf ../chest-counter-backend-poc/public/
mkdir -p ../chest-counter-backend-poc/public/
cp -rf dist/tb/browser/** ../chest-counter-backend-poc/public/

rm -rf ../chest-counter-backend-poc/dist/public/
mkdir -p ../chest-counter-backend-poc/dist/public/
cp -rf dist/tb/browser/** ../chest-counter-backend-poc/dist/public/


cd ../chest-counter-backend-poc
git add --all
