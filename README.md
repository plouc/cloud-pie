# CLOUD-PIE

## Install

```sh
git clone git@github.com:plouc/cloud-pie.git
cd cloud-pie
npm install
```

## Fetch AWS data
```sh
node fetch.js
```

## Generate frontend assets

require `gulp` to be installed globally on your machine, if it's not already installed:
```sh
npm install -g gulp
```

generate:

```sh
gulp
```

## Serve generated content

you can now serve what's inside `/dist` directory, you can use `http-server` package:

```sh
npm install -g http-server
cd dist
http-server
```

you can now open your browser at `http://localhost:8080`.


