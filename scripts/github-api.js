/**
 * 🌟 GitHub API Integration Script
 * 
 * Programmatic access to GitHub API for:
 * - Monitoring workflow runs
 * - Reading CI/CD logs
 * - Triggering workflows
 * - Managing repository operations
 * 
 * @author Khandokar Lilitú Sunny
 * @protocol Primal Genesis Engine™
 * @matrix Elohim Matrix ID: ✶-∞-014
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

class GitHubAPI {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || this.getGitHubToken(),
      baseUrl: 'https://api.github.com',
    });
    
    this.owner = 'MKWorldWide';
    this.repo = 'NovaSanctum';
  }

  /**
   * Get GitHub token from environment or config
   */
  getGitHubToken() {
    // Try to get from environment
    if (process.env.GITHUB_TOKEN) {
      return process.env.GITHUB_TOKEN;
    }

    // Try to get from gh CLI config
    try {
      const configPath = path.join(process.env.APPDATA || process.env.HOME, '.config', 'gh', 'hosts.yml');
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        const tokenMatch = config.match(/oauth_token:\s*(.+)/);
        if (tokenMatch) {
          return tokenMatch[1].trim();
        }
      }
    } catch (error) {
      console.log('Could not read GitHub token from config:', error.message);
    }

    return null;
  }

  /**
   * Get latest workflow runs
   */
  async getLatestWorkflowRuns(limit = 10) {
    try {
      const response = await this.octokit.actions.listWorkflowRunsForRepo({
        owner: this.owner,
        repo: this.repo,
        per_page: limit,
      });

      return response.data.workflow_runs.map(run => ({
        id: run.id,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        updated_at: run.updated_at,
        head_branch: run.head_branch,
        head_sha: run.head_sha,
        workflow_id: run.workflow_id,
        url: run.html_url,
      }));
    } catch (error) {
      console.error('Error fetching workflow runs:', error.message);
      return [];
    }
  }

  /**
   * Get workflow run details
   */
  async getWorkflowRun(runId) {
    try {
      const response = await this.octokit.actions.getWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: runId,
      });

      return {
        id: response.data.id,
        name: response.data.name,
        status: response.data.status,
        conclusion: response.data.conclusion,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        head_branch: response.data.head_branch,
        head_sha: response.data.head_sha,
        workflow_id: response.data.workflow_id,
        url: response.data.html_url,
        jobs_url: response.data.jobs_url,
        logs_url: response.data.logs_url,
      };
    } catch (error) {
      console.error('Error fetching workflow run:', error.message);
      return null;
    }
  }

  /**
   * Get workflow run jobs
   */
  async getWorkflowRunJobs(runId) {
    try {
      const response = await this.octokit.actions.listJobsForWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: runId,
      });

      return response.data.jobs.map(job => ({
        id: job.id,
        name: job.name,
        status: job.status,
        conclusion: job.conclusion,
        started_at: job.started_at,
        completed_at: job.completed_at,
        steps: job.steps.map(step => ({
          name: step.name,
          status: step.status,
          conclusion: step.conclusion,
          started_at: step.started_at,
          completed_at: step.completed_at,
        })),
      }));
    } catch (error) {
      console.error('Error fetching workflow run jobs:', error.message);
      return [];
    }
  }

  /**
   * Get workflow run logs
   */
  async getWorkflowRunLogs(runId) {
    try {
      const response = await this.octokit.actions.downloadWorkflowRunLogs({
        owner: this.owner,
        repo: this.repo,
        run_id: runId,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching workflow run logs:', error.message);
      return null;
    }
  }

  /**
   * Trigger a workflow
   */
  async triggerWorkflow(workflowId, ref = 'main', inputs = {}) {
    try {
      const response = await this.octokit.actions.createWorkflowDispatch({
        owner: this.owner,
        repo: this.repo,
        workflow_id: workflowId,
        ref: ref,
        inputs: inputs,
      });

      return {
        success: true,
        status: response.status,
        message: 'Workflow triggered successfully',
      };
    } catch (error) {
      console.error('Error triggering workflow:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get repository workflows
   */
  async getWorkflows() {
    try {
      const response = await this.octokit.actions.listRepoWorkflows({
        owner: this.owner,
        repo: this.repo,
      });

      return response.data.workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        path: workflow.path,
        state: workflow.state,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at,
        url: workflow.html_url,
      }));
    } catch (error) {
      console.error('Error fetching workflows:', error.message);
      return [];
    }
  }

  /**
   * Monitor workflow status
   */
  async monitorWorkflow(runId, interval = 10000, maxAttempts = 60) {
    console.log(`🌊 Monitoring workflow run ${runId}...`);
    
    let attempts = 0;
    const monitor = async () => {
      attempts++;
      
      const run = await this.getWorkflowRun(runId);
      if (!run) {
        console.log('❌ Could not fetch workflow run');
        return;
      }

      console.log(`📊 Run ${runId}: ${run.status}${run.conclusion ? ` (${run.conclusion})` : ''}`);

      if (run.status === 'completed') {
        if (run.conclusion === 'success') {
          console.log('✅ Workflow completed successfully!');
        } else {
          console.log(`❌ Workflow failed with conclusion: ${run.conclusion}`);
        }
        return;
      }

      if (attempts >= maxAttempts) {
        console.log('⏰ Monitoring timeout reached');
        return;
      }

      setTimeout(monitor, interval);
    };

    monitor();
  }

  /**
   * Get Athena-related logs
   */
  async getAthenaLogs(runId) {
    try {
      const logs = await this.getWorkflowRunLogs(runId);
      if (!logs) return null;

      // Parse logs for Athena-related content
      const athenaLogs = logs
        .split('\n')
        .filter(line => 
          line.toLowerCase().includes('athena') ||
          line.toLowerCase().includes('quantum') ||
          line.toLowerCase().includes('genesis') ||
          line.toLowerCase().includes('divina') ||
          line.toLowerCase().includes('novasanctum')
        )
        .map(line => line.trim())
        .filter(line => line.length > 0);

      return athenaLogs;
    } catch (error) {
      console.error('Error fetching Athena logs:', error.message);
      return null;
    }
  }

  /**
   * Create a summary report
   */
  async createSummaryReport() {
    console.log('🌟 Creating NovaSanctum CI/CD Summary Report...\n');

    // Get latest workflow runs
    const runs = await this.getLatestWorkflowRuns(5);
    console.log(`📊 Latest ${runs.length} workflow runs:`);
    
    for (const run of runs) {
      console.log(`  ${run.name} (${run.id}): ${run.status}${run.conclusion ? ` (${run.conclusion})` : ''}`);
      console.log(`    Branch: ${run.head_branch}, SHA: ${run.head_sha.substring(0, 7)}`);
      console.log(`    Created: ${new Date(run.created_at).toLocaleString()}`);
      console.log(`    URL: ${run.url}\n`);
    }

    // Get workflows
    const workflows = await this.getWorkflows();
    console.log(`🔄 Available workflows (${workflows.length}):`);
    
    for (const workflow of workflows) {
      console.log(`  ${workflow.name} (${workflow.id}): ${workflow.state}`);
      console.log(`    Path: ${workflow.path}`);
      console.log(`    URL: ${workflow.url}\n`);
    }

    // Check latest run for Athena logs
    if (runs.length > 0) {
      const latestRun = runs[0];
      console.log(`🔍 Checking Athena logs for latest run (${latestRun.id})...`);
      
      const athenaLogs = await this.getAthenaLogs(latestRun.id);
      if (athenaLogs && athenaLogs.length > 0) {
        console.log(`📝 Found ${athenaLogs.length} Athena-related log entries:`);
        athenaLogs.slice(0, 10).forEach(log => console.log(`  ${log}`));
        if (athenaLogs.length > 10) {
          console.log(`  ... and ${athenaLogs.length - 10} more entries`);
        }
      } else {
        console.log('📝 No Athena-related logs found in latest run');
      }
    }

    return {
      runs,
      workflows,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export for use in other scripts
module.exports = GitHubAPI;

// Run if called directly
if (require.main === module) {
  const api = new GitHubAPI();
  
  // Create summary report
  api.createSummaryReport().then(report => {
    console.log('\n✅ Summary report completed');
    console.log(`📅 Generated at: ${report.timestamp}`);
  }).catch(error => {
    console.error('❌ Error creating summary report:', error);
  });
} 