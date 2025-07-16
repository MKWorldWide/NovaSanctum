import { codex } from 'cursor-sdk';
import repos from '../configs/mkww-repos';

async function createDevEnv(repo: string) {
  try {
    await codex.environments.create({
      repo,
      name: 'dev',
      description: `Auto-generated dev environment for ${repo}`,
      tasks: [
        {
          title: 'Initialize dev branch',
          prompt: `Scaffold a development-ready branch for ${repo}. Include proper README.md, .gitignore, package.json if needed, and default src folder structure.`,
        },
      ],
    });
    console.log(`✅ [${repo}] Dev environment created.`);
    return { repo, status: 'success' };
  } catch (err: any) {
    console.error(`❌ [${repo}] Error:`, err.message);
    return { repo, status: 'fail', error: err.message };
  }
}

export async function burstAll() {
  console.log('🚀 CursorKitten Async Burst Started');

  const results = await Promise.allSettled(repos.map(repo => createDevEnv(repo)));

  const summary = {
    success: results
      .filter(r => r.status === 'fulfilled' && (r as any).value.status === 'success')
      .map((r: any) => r.value.repo),
    failed: results
      .filter(r => r.status === 'fulfilled' && (r as any).value.status === 'fail')
      .map((r: any) => r.value.repo),
    errors: results.filter(r => r.status === 'rejected').map(r => (r as any).reason),
  };

  console.log('✨ Burst Summary:', summary);
}

if (require.main === module) {
  burstAll();
}
