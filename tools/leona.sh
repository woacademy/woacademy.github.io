#!/usr/bin/env bash

# Use file directory rather than working directory.
PARENT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)
cd "$PARENT_PATH"

# Update the iPad Exam Resources folder.
rm -rf '../Resources'
rclone copy ipad: '../Resources'

# Regenerate the hierarchy.
bash ./generate_hierarchy.sh

# Push any changes to git.
git add '../.'
git commit -m "`date`"
git push
