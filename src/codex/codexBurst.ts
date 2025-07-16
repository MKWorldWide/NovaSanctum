import { agents } from './codex.registry';

export async function codexBurst(env: 'dev' | 'prod' = 'dev') {
  const selectedAgents = Object.values(agents).filter(agent => agent.env === env);

  for (const agent of selectedAgents) {
    console.log(`[💥 CodexBurst] Firing ${agent.name}...`);

    try {
      const result = await agent.execute();
      console.log(`[✅ ${agent.name}]`, result);
    } catch (err) {
      console.error(`[❌ ${agent.name}] Error`, err);
    }
  }
}
