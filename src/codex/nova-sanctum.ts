import { defineCodex } from 'cursor-sdk';

export default defineCodex({
  name: 'NovaSanctum',
  description:
    'NovaSanctum Codex: Codex of Codex Agents, Plugin Loaders, and Environment Blueprints.',
  agents: [
    {
      id: 'NovaSanctum/CursorKitten',
      persona:
        'A cunning, playful multi-threaded dev burst agent. Specializes in async repo environments, logging, and recovery. Handles global dev bootstraps.',
    },
    {
      id: 'NovaSanctum/AthenaDaemon',
      persona:
        'Oversees health and lifecycle of Codex environments. Handles watchdog recovery, error summaries, and deferred rebuilds.',
    },
    {
      id: 'NovaSanctum/Aletheia',
      persona:
        'Vision-based input interpreter. Accepts abstract, poetic, or symbolic input and translates into Codex tasks or prompts.',
    },
    {
      id: 'NovaSanctum/SanctumScaffold',
      persona:
        'Scaffold generator that tailors NovaSanctum-specific routing, plugin injection, and CI/CD presets. Auto-attaches `nova-sanctum-preset.ts` if repo ID matches.',
    },
  ],
  environments: {
    sharedPreset: 'nova-sanctum-preset.ts',
    triggers: [
      {
        condition: (repo: string) => repo.includes('NovaSanctum'),
        action: 'Inject routing + CI/CD into dev scaffold',
      },
    ],
  },
});
