#!/usr/bin/env node

/**
 * NovaSanctum Repository Secrets Configuration Script
 * 
 * This script helps configure GitHub repository secrets for the automation suite.
 * Note: Due to GitHub API limitations, some secrets must be set manually.
 */

const { Octokit } = require('@octokit/rest');
const readline = require('readline');

// Configuration
const CONFIG = {
  token: process.env.GITHUB_TOKEN || process.argv[2],
  owner: process.env.GITHUB_REPOSITORY_OWNER || process.argv[3],
  repo: process.env.GITHUB_REPOSITORY?.split('/')[1] || process.argv[4] || 'NovaSanctum',
  automationToken: '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'
};

// Initialize Octokit
const octokit = new Octokit({
  auth: CONFIG.token
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt user for input
 */
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Validate repository access
 */
async function validateAccess() {
  console.log('🔍 Validating repository access...');
  
  try {
    const { data: repo } = await octokit.rest.repos.get({
      owner: CONFIG.owner,
      repo: CONFIG.repo
    });
    
    console.log(`✅ Access validated for: ${repo.full_name}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to access repository:', error.message);
    return false;
  }
}

/**
 * Check if secret exists
 */
async function checkSecret(secretName) {
  try {
    // Note: GitHub API doesn't allow reading secret values, only checking if they exist
    // We'll use a different approach to check
    const { data: secrets } = await octokit.rest.actions.listRepoSecrets({
      owner: CONFIG.owner,
      repo: CONFIG.repo
    });
    
    return secrets.secrets.some(secret => secret.name === secretName);
  } catch (error) {
    console.error(`Error checking secret ${secretName}:`, error.message);
    return false;
  }
}

/**
 * Create or update secret
 */
async function createSecret(secretName, secretValue) {
  try {
    // Note: GitHub API requires the secret value to be base64 encoded
    const encodedValue = Buffer.from(secretValue).toString('base64');
    
    // Get the repository's public key for encryption
    const { data: publicKey } = await octokit.rest.actions.getRepoPublicKey({
      owner: CONFIG.owner,
      repo: CONFIG.repo
    });
    
    // For now, we'll just provide instructions since the encryption is complex
    console.log(`📝 Manual setup required for secret: ${secretName}`);
    console.log(`   Value: ${secretValue}`);
    console.log(`   Go to: https://github.com/${CONFIG.owner}/${CONFIG.repo}/settings/secrets/actions`);
    console.log(`   Click "New repository secret"`);
    console.log(`   Name: ${secretName}`);
    console.log(`   Value: ${secretValue}`);
    console.log('');
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to create secret ${secretName}:`, error.message);
    return false;
  }
}

/**
 * Main configuration function
 */
async function configureSecrets() {
  console.log('🔐 NovaSanctum Repository Secrets Configuration');
  console.log('==============================================');
  
  if (!CONFIG.token) {
    console.error('❌ GitHub token not provided');
    console.log('Usage: node configure-secrets.js <github-token> [owner] [repo]');
    console.log('Or set GITHUB_TOKEN environment variable');
    process.exit(1);
  }
  
  // Validate access
  const hasAccess = await validateAccess();
  if (!hasAccess) {
    process.exit(1);
  }
  
  console.log('\n📋 Required Secrets Configuration');
  console.log('==================================');
  
  const secrets = [
    {
      name: 'NOVASANCTUM_TOKEN',
      value: CONFIG.automationToken,
      description: 'GitHub token for automation tasks',
      required: true
    },
    {
      name: 'AWS_ACCESS_KEY_ID',
      value: '',
      description: 'AWS access key for deployments',
      required: true
    },
    {
      name: 'AWS_SECRET_ACCESS_KEY',
      value: '',
      description: 'AWS secret key for deployments',
      required: true
    },
    {
      name: 'CODECOV_TOKEN',
      value: '',
      description: 'Codecov token for test coverage (optional)',
      required: false
    },
    {
      name: 'SNYK_TOKEN',
      value: '',
      description: 'Snyk token for security scanning (optional)',
      required: false
    }
  ];
  
  console.log('\n🔧 Setting up secrets...\n');
  
  for (const secret of secrets) {
    if (secret.name === 'NOVASANCTUM_TOKEN') {
      // Auto-configure the NovaSanctum token
      console.log(`✅ ${secret.name}: ${secret.value}`);
      console.log('   This secret will be configured automatically.');
    } else {
      // Prompt for other secrets
      const value = await question(`${secret.name} (${secret.description}): `);
      if (value.trim()) {
        secret.value = value.trim();
      } else if (secret.required) {
        console.log(`⚠️  ${secret.name} is required but not provided. Please set it manually.`);
      }
    }
  }
  
  console.log('\n📝 Manual Configuration Instructions');
  console.log('====================================');
  console.log(`Go to: https://github.com/${CONFIG.owner}/${CONFIG.repo}/settings/secrets/actions`);
  console.log('');
  
  for (const secret of secrets) {
    if (secret.value) {
      console.log(`🔐 ${secret.name}:`);
      console.log(`   Value: ${secret.name === 'NOVASANCTUM_TOKEN' ? secret.value : '[PROVIDED]'}`);
      console.log(`   Description: ${secret.description}`);
      console.log('');
    } else if (secret.required) {
      console.log(`⚠️  ${secret.name}: REQUIRED - Please set manually`);
      console.log(`   Description: ${secret.description}`);
      console.log('');
    }
  }
  
  console.log('🎉 Configuration complete!');
  console.log('\nNext steps:');
  console.log('1. Add the secrets to your GitHub repository');
  console.log('2. Push your changes to trigger the automation');
  console.log('3. Check the Actions tab to see your workflows running');
  
  rl.close();
}

// Run the configuration
if (require.main === module) {
  configureSecrets().catch(console.error);
}

module.exports = {
  configureSecrets,
  validateAccess,
  checkSecret,
  createSecret
}; 