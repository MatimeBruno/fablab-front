#!/usr/bin/env bash
# exit on error
set -o errexit

export REACT_APP_API_URL=$REACT_APP_API_URL

npm build
