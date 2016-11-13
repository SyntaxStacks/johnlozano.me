#!/bin/bash
git checkout dev
git branch -D master
git checkout --orphan master
git clone git@github.com:SyntaxStacks/hugo-theme-casper.git themes/casper
hugo -b http://syntaxstacks.github.io -d /tmp/jdist
git rm -rf *
cp -r /tmp/jdist/* .
echo "www.johnlozano.me" > CNAME
rm -rf /tmp/jdist
git add .
git commit -m'Github Pages'
git push origin master -f
git checkout dev
