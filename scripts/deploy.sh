#!/bin/bash

yarn build
git add -A
git commit -m "new build"
git push
