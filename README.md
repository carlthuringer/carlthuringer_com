# Carlthuringer Com
Website production engine for DAT

## SETUP
* NVM: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
* NPM: `npm install`
* DAT: `npm install -g dat`

## Development
* Build: `npm run build`
* Publish: `dat share dist`
  Wait a few seconds for hashbase to pick up the new files.

## Key management
* Get Key: `dat keys export dist`
* Set Key: `dat keys import`