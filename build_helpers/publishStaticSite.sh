#!/bin/bash
set -e

PROJECT_DIRECTORY="fixed-data-table-2"
SITE_DIRECTORY="$PROJECT_DIRECTORY-site"
GITHUB_REPO="git@github.com:schrodinger/fixed-data-table-2.git"
GH_PAGES_SITE="http://schrodinger.github.io/fixed-data-table-2/"

# Move to parent dir
cd ../

# Setup repo if doesnt exist
if [ ! -d "$SITE_DIRECTORY" ]; then
  read -p "No site repo setup, can I create it at \"$PWD/$SITE_DIRECTORY\"? [Y/n] " -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! $REPLY == "" ]]
  then
    echo "Exit by user"
    exit 1
  fi
  git clone "$GITHUB_REPO" "$SITE_DIRECTORY"
  cd "$SITE_DIRECTORY"
  git checkout origin/gh-pages
  git checkout -b gh-pages
  git push --set-upstream origin gh-pages
  cd ../
fi

cd "$PROJECT_DIRECTORY"
npm run site-build
if [ "$(uname)" == "Darwin" ]; then
  open __site__/index.html
else
  xdg-open __site__/index.html
fi
cd ../

echo
echo
read -p "Are you ready to publish? [Y/n] " -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ ! $REPLY == "" ]]
then
  echo "Exit by user"
  exit 1
fi

cd "$SITE_DIRECTORY"
git reset --hard
git checkout -- .
git clean -dfx
git fetch
git rebase
rm -Rf *
echo "$PWD"
cp -R ../$PROJECT_DIRECTORY/__site__/* .
git add --all
git commit -m "Update website"
git push
sleep 1
if [ "$(uname)" == "Darwin" ]; then
  open $GH_PAGES_SITE
else
  xdg-open $GH_PAGES_SITE
fi
