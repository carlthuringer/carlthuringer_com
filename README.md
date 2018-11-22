# Carlthuringer Com
Website production engine for DAT

## SETUP
* NVM: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
* Ruby: `brew install rbenv`
* Bundle: `gem install bundler && bundle install`
* Jekyll: `gem install jekyll`
* Dat: `npm install -g dat`

## First time Setup
* `mkdir -p dist`
* `dat init dist`

## Development
* Build: ` `
* Publish: `dat share dist`
  Wait a few seconds for hashbase to pick up the new files.

## Key management
In order to keep write access to the DAT you have to export the key and import it if you clone the source back to another 