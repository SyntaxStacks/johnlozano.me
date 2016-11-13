#!/bin/bash
git checkout master
git branch -D gh-pages
git checkout --orphan gh-pages
git clone git@github.com:SyntaxStacks/hugo-theme-casper.git themes/casper
hugo -b http://syntaxstacks.github.io -d /tmp/jdist
git rm -rf *
cp -r /tmp/jdist/* .
rm -rf /tmp/jdist
git add .
git commit -m'Github Pages'
git push origin gh-pages -f
git checkout master
