const dotenv = require('dotenv');

const { ManagedIdentityCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

dotenv.config();

function init() {
  if (process.env.AzureKeyVaultName) {
    return initAzureVault();
  }

  return secretName => process.env[secretName];
}

function initAzureVault() {
  const azureVaultUrl = `https://${process.env.AzureKeyVaultName}.vault.azure.net`;
  const azureCredential = new ManagedIdentityCredential();

  const azureVaultClient = new SecretClient(azureVaultUrl, azureCredential);

  return async (secretName) => {
    const secret = await azureVaultClient.getSecret(secretName);

    return secret && secret.value;
  }
}

module.exports = {
  init,
};
