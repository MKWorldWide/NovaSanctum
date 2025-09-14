#!/usr/bin/env node

/**
 * NovaSanctum GitHub Automation Setup Script
 * 
 * This script helps set up GitHub automation for the NovaSanctum project.
 * It configures repository secrets, labels, and automation settings.
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  token: process.env.GITHUB_TOKEN || process.argv[2],
  owner: process.env.GITHUB_REPOSITORY_OWNER || 'your-username',
  repo: process.env.GITHUB_REPOSITORY?.split('/')[1] || 'NovaSanctum',
  automationToken: process.env.NOVASANCTUM_TOKEN || '[REDACTED]'
};

// Initialize Octokit
const octokit = new Octokit({
  auth: CONFIG.token
});

// Labels configuration
const LABELS = [
  // Size labels
  { name: 'size: XS', color: '7c1158', description: 'Extra small changes (< 10 lines)' },
  { name: 'size: S', color: '5319e7', description: 'Small changes (10-50 lines)' },
  { name: 'size: M', color: 'fbca04', description: 'Medium changes (50-250 lines)' },
  { name: 'size: L', color: 'fef2c0', description: 'Large changes (250-1000 lines)' },
  { name: 'size: XL', color: 'd93f0b', description: 'Extra large changes (> 1000 lines)' },
  
  // Priority labels
  { name: 'priority: low', color: '0e8a16', description: 'Low priority' },
  { name: 'priority: medium', color: 'fbca04', description: 'Medium priority' },
  { name: 'priority: high', color: 'd93f0b', description: 'High priority' },
  { name: 'priority: critical', color: 'b60205', description: 'Critical priority' },
  
  // Type labels
  { name: 'bug', color: 'd73a4a', description: 'Something isn\'t working' },
  { name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
  { name: 'documentation', color: '0075ca', description: 'Improvements or additions to documentation' },
  { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
  { name: 'help wanted', color: '008672', description: 'Extra attention is needed' },
  
  // Component labels
  { name: 'component', color: '1d76db', description: 'UI component changes' },
  { name: 'service', color: '0e8a16', description: 'Service layer changes' },
  { name: 'types', color: '5319e7', description: 'TypeScript type changes' },
  { name: 'testing', color: 'fbca04', description: 'Test-related changes' },
  
  // Automation labels
  { name: 'automation', color: 'd4c5f9', description: 'Automated changes' },
  { name: 'dependencies', color: '0366d6', description: 'Dependency updates' },
  { name: 'security', color: 'b60205', description: 'Security-related changes' },
  { name: 'urgent', color: 'b60205', description: 'Urgent changes' },
  { name: 'ready-to-merge', color: '0e8a16', description: 'Ready for merge' },
  { name: 'aws-amplify', color: 'ff9900', description: 'AWS Amplify changes' },
  { name: 'github-actions', color: '2088ff', description: 'GitHub Actions changes' },
  { name: 'docker', color: '2496ed', description: 'Docker-related changes' },
  { name: 'python', color: '3776ab', description: 'Python-related changes' }
];

/**
 * Create or update repository labels
 */
async function setupLabels() {
  console.log('🔧 Setting up repository labels...');
  
  for (const label of LABELS) {
    try {
      await octokit.rest.issues.createLabel({
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        name: label.name,
        color: label.color,
        description: label.description
      });
      console.log(`✅ Created label: ${label.name}`);
    } catch (error) {
      if (error.status === 422) {
        // Label already exists, update it
        try {
          await octokit.rest.issues.updateLabel({
            owner: CONFIG.owner,
            repo: CONFIG.repo,
            name: label.name,
            color: label.color,
            description: label.description
          });
          console.log(`🔄 Updated label: ${label.name}`);
        } catch (updateError) {
          console.error(`❌ Failed to update label ${label.name}:`, updateError.message);
        }
      } else {
        console.error(`❌ Failed to create label ${label.name}:`, error.message);
      }
    }
  }
}

/**
 * Create repository secrets (requires manual setup in GitHub UI)
 */
function setupSecrets() {
  console.log('\n🔐 Repository Secrets Setup');
  console.log('================================');
  console.log('Please manually add these secrets in your GitHub repository:');
  console.log('Settings > Secrets and variables > Actions');
  console.log('');
  console.log('Required secrets:');
  console.log(`- NOVASANCTUM_TOKEN: ${CONFIG.automationToken}`);
  console.log('- AWS_ACCESS_KEY_ID: Your AWS access key');
  console.log('- AWS_SECRET_ACCESS_KEY: Your AWS secret key');
  console.log('- CODECOV_TOKEN: Your Codecov token (optional)');
  console.log('- SNYK_TOKEN: Your Snyk token (optional)');
  console.log('');
  console.log('Note: The NOVASANCTUM_TOKEN is already provided in this script.');
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
    console.log(`   Description: ${repo.description || 'No description'}`);
    console.log(`   Visibility: ${repo.visibility}`);
    console.log(`   Default branch: ${repo.default_branch}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to access repository:', error.message);
    console.log('Please check:');
    console.log('1. Your GitHub token has the correct permissions');
    console.log('2. The repository name and owner are correct');
    console.log('3. You have access to the repository');
    return false;
  }
}

/**
 * Check workflow files
 */
function checkWorkflows() {
  console.log('\n📋 Checking workflow files...');
  
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  const expectedWorkflows = [
    'automation-setup.yml',
    'pr-automation.yml',
    'dependabot-automation.yml',
    'ci.yml'
  ];
  
  if (!fs.existsSync(workflowsDir)) {
    console.error('❌ .github/workflows directory not found');
    return false;
  }
  
  const existingWorkflows = fs.readdirSync(workflowsDir);
  
  for (const workflow of expectedWorkflows) {
    if (existingWorkflows.includes(workflow)) {
      console.log(`✅ Found workflow: ${workflow}`);
    } else {
      console.log(`⚠️  Missing workflow: ${workflow}`);
    }
  }
  
  return true;
}

/**
 * Main setup function
 */
async function main() {
  console.log('🚀 NovaSanctum GitHub Automation Setup');
  console.log('=====================================');
  
  if (!CONFIG.token) {
    console.error('❌ GitHub token not provided');
    console.log('Usage: node setup-github-automation.js <github-token>');
    console.log('Or set GITHUB_TOKEN environment variable');
    process.exit(1);
  }
  
  // Validate access
  const hasAccess = await validateAccess();
  if (!hasAccess) {
    process.exit(1);
  }
  
  // Setup labels
  await setupLabels();
  
  // Setup secrets instructions
  setupSecrets();
  
  // Check workflows
  checkWorkflows();
  
  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Add the required secrets to your GitHub repository');
  console.log('2. Push your changes to trigger the automation');
  console.log('3. Check the Actions tab to see your workflows running');
  console.log('4. Configure branch protection rules if needed');
}

// Run the setup
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  setupLabels,
  setupSecrets,
  validateAccess,
  checkWorkflows
}; 
