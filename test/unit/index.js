'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const configLoaderConstructor = require('../../lib').constructor;
const secretsService = require('../../lib/secretsService');

describe('configLoader.js', function() {
  it('should fallback to default if no .env file exist', async function() {
    const configLoader = new configLoaderConstructor();
    const config = await configLoader.appConfig();

    expect(config.configuration.options.url).to.eql('mongodb://localhost:27017/config_db');
    expect(config.settings.name).to.eql('Sample App');
    expect(config.settings.application.environment).to.eql('production');
  });

  it('should use azure key vault if its name exist in .env', async function() {
    process.env.AzureKeyVaultName = 'SomeKeyVaultName';

    sinon.stub(secretsService, 'init').returns(fieldName => fieldName);

    const configLoader = new configLoaderConstructor();
    const config = await configLoader.appConfig();

    expect(config.configuration.options.url).to.eql('MongoUrl');
    expect(config.configuration.options.mongoose_options.replset.rs_name).to.eql('MongoReplicasetName');
    expect(config.settings.name).to.eql('ProjectName');
    expect(config.settings.application.environment).to.eql('Environment');
  });

  it('should use env file if no azure key vault name provided', async function() {
    process.env.ProjectName = 'Test App';
    process.env.Environment = 'development';
    process.env.MongoUrl = 'mongodb://mongoUrlExample.io:27017/config_db';
    process.env.MongoReplicasetName = 'rsNameExample';

    const configLoader = new configLoaderConstructor();
    const config = await configLoader.appConfig();

    expect(config.configuration.options.url).to.eql('mongodb://mongoUrlExample.io:27017/config_db');
    expect(config.configuration.options.mongoose_options.replset.rs_name).to.eql('rsNameExample');
    expect(config.settings.name).to.eql('Test App');
    expect(config.settings.application.environment).to.eql('development');
  });

  afterEach(() => {
    sinon.restore();

    delete process.env.AzureKeyVaultName;
    delete process.env.ProjectName;
    delete process.env.Environment;
    delete process.env.MongoUrl;
    delete process.env.MongoReplicasetName;
  });
});
