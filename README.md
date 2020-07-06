# App-Config-Loader [![Build Status](https://travis-ci.com/digifi-io/app-config-loader.svg?token=1owHdFhQpzdjTsye6Ykz&branch=master)](https://travis-ci.com/digifi-io/app-config-loader) [![Coverage Status](https://coveralls.io/repos/github/digifi-io/app-config-loader/badge.svg?branch=master&t=5DBAAg)](https://coveralls.io/github/digifi-io/app-config-loader?branch=master)
Takes db config from either the Azure Key Vault or .env file and returns app configuration for the periodic app.

Required secrets (.env variables) are:
* CloudProvider (AWS or Azure)
* ProjectName (string)
* Environment (string)
* MongoUrl (string)
* MongoReplicasetName (string)
* MongoServerKeepAlive (0 or 1)
* MongoConnectTimeout (milliseconds)
* MongoSocketTimeout (milliseconds)


## Getting Started

To begin using the app-config-loader, install the module by running the following command:

```
$ npm install @digifi/app-config-loader --save
```

## Usage

After installing the app-config-loader, require the module at the top of files where you would like to use it.

```
const appConfigLoader = require('@digifi/app-config-loader');
const appConfig = appConfigLoader.appConfig();
```

Other secrets can be retrived using

```
const someSecret = appConfigLoader.getSecret('SomeSecret');
```
#### Example Config
```
Example .env

CloudProvider=AWS
ProjectName=Test App Config
Environment=development
MongoUrl=mongodb://localhost:27017/config_db
MongoReplicasetName=SOME-shard-0
MongoServerKeepAlive=1
MongoConnectTimeout=30000
MongoSocketTimeout=30000
```
