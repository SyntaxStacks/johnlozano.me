#!/bin/bash
hugo -d /tmp/jdist
git checkout master
git branch -D gh-pages
git checkout --orphan gh-pages
git rm -r *
cp /tmp/jdist/public/* .
rm -rf /tmp/jdist
git add .
git commit -m'Github Pages'
git push origin gh-pages -f
