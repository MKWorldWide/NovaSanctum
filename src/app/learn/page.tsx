'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  clearSavedByoKey,
  hasSavedByoKey,
  loadEncryptedByoKey,
  saveEncryptedByoKey,
} from '@/services/learning/keyVault';

type LearnerProfile = {
  profileId: string;
  audience: 'adult-self-learner' | 'student' | 'workforce';
  goals: string[];
  telemetryOptIn: boolean;
  privacyAcknowledged: boolean;
  preferences: {
    sessionMinutes: number;
    readingDepth: 'light' | 'standard' | 'deep';
    explanationStyle: 'short' | 'detailed' | 'example-first';
    confidenceLevel: number;
    accessibility: string[];
  };
};

type AdaptiveBlueprint = {
  blueprintId: string;
  subject: string;
  level: string;
  chunkMode: 'micro' | 'standard' | 'deep';
  targetMinutes: number;
  difficultyLevel: 'supportive' | 'balanced' | 'challenging';
  modules: Array<{
    moduleId: string;
    title: string;
    nextLessonReason: string;
    chunks: Array<{
      chunkId: string;
      title: string;
      targetMinutes: number;
      adaptationReason: string;
    }>;
  }>;
};

type GeneratedLesson = {
  lessonId: string;
  moduleId: string;
  title: string;
  bodyMarkdown: string;
  quizDraft: Array<{ prompt: string; answerType: 'short' | 'mcq' | 'numeric' }>;
  sourceMap: Array<{ section: string; resourceIds: string[] }>;
  citations: string[];
  modeUsed: string;
  whyThisLesson: string;
  fallbackReason?: string;
};

const defaultGoals = [
  'Build and sustain a practical monthly budget',
  'Understand credit scores and healthy utilization',
];

const PROFILE_KEY = 'novasanctum.profileId';

export default function LearnPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [audience, setAudience] = useState<LearnerProfile['audience']>('adult-self-learner');
  const [telemetryOptIn, setTelemetryOptIn] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(20);
  const [readingDepth, setReadingDepth] = useState<'light' | 'standard' | 'deep'>('standard');
  const [explanationStyle, setExplanationStyle] = useState<'short' | 'detailed' | 'example-first'>(
    'example-first'
  );
  const [confidenceLevel, setConfidenceLevel] = useState(0.7);
  const [goalsText, setGoalsText] = useState(defaultGoals.join('\n'));

  const [subject, setSubject] = useState('Money Management & Credit Wisdom');
  const [level, setLevel] = useState<'middle-school' | 'high-school' | 'undergrad' | 'grad'>(
    'high-school'
  );
  const [planGoalsText, setPlanGoalsText] = useState(defaultGoals.join('\n'));
  const [adaptiveBlueprint, setAdaptiveBlueprint] = useState<AdaptiveBlueprint | null>(null);
  const [courseRunId, setCourseRunId] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useState<{
    dailyMinutes: number;
    sessionsPerWeek: number;
    estimatedWeeks: number;
  } | null>(null);
  const [byoApiKey, setByoApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(false);
  const [keyPassphrase, setKeyPassphrase] = useState('');
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [activeLesson, setActiveLesson] = useState<GeneratedLesson | null>(null);
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [submitConfidence, setSubmitConfidence] = useState(0.7);
  const [paceChoice, setPaceChoice] = useState<'slow down' | 'keep pace' | 'speed up'>('keep pace');
  const [explanationChoice, setExplanationChoice] = useState<
    'short' | 'detailed' | 'example-first'
  >('example-first');
  const [submitResult, setSubmitResult] = useState<{
    score: number;
    nextRecommendation?: { paceAction: string; explanationStyle: string; reason: string };
  } | null>(null);

  const parsedProfileGoals = useMemo(
    () =>
      goalsText
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean),
    [goalsText]
  );

  const parsedPlanGoals = useMemo(
    () =>
      planGoalsText
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean),
    [planGoalsText]
  );

  useEffect(() => {
    setHasSavedKey(hasSavedByoKey());
  }, []);

  useEffect(() => {
    const profileId = window.localStorage.getItem(PROFILE_KEY);
    if (!profileId) return;

    void (async () => {
      try {
        const response = await fetch(
          `/api/learner/profile?profileId=${encodeURIComponent(profileId)}`
        );
        if (!response.ok) return;
        const payload = (await response.json()) as { profile?: LearnerProfile };
        if (payload.profile) {
          setProfile(payload.profile);
          setMessage('Local profile loaded. Continue where you left off.');
        }
      } catch {
        setMessage('Could not load existing profile yet.');
      }
    })();
  }, []);

  async function createProfile(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const response = await fetch('/api/learner/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience,
          goals: parsedProfileGoals,
          telemetryOptIn,
          privacyAcknowledged: true,
          preferences: {
            sessionMinutes,
            readingDepth,
            explanationStyle,
            confidenceLevel,
            accessibility: [],
          },
        }),
      });

      const payload = (await response.json()) as { error?: string; profile?: LearnerProfile };
      if (!response.ok || !payload.profile) {
        throw new Error(payload.error || 'Failed to initialize learner profile.');
      }

      setProfile(payload.profile);
      window.localStorage.setItem(PROFILE_KEY, payload.profile.profileId);
      setMessage('Profile created. You can now build an adaptive course plan.');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Profile initialization failed.');
    } finally {
      setBusy(false);
    }
  }

  async function generatePlan(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;

    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/learning-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.profileId,
          subject,
          level,
          goals: parsedPlanGoals,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        courseRunId?: string;
        adaptiveBlueprint?: AdaptiveBlueprint;
        studyPlan?: { dailyMinutes: number; sessionsPerWeek: number; estimatedWeeks: number };
      };

      if (!response.ok || !payload.adaptiveBlueprint || !payload.studyPlan) {
        throw new Error(payload.error || 'Failed to generate adaptive learning plan.');
      }

      setAdaptiveBlueprint(payload.adaptiveBlueprint);
      setStudyPlan(payload.studyPlan);
      setCourseRunId(payload.courseRunId || null);
      setActiveLesson(null);
      setSubmitResult(null);
      setMessage(
        `Plan generated with ${payload.adaptiveBlueprint.chunkMode} chunks and ${payload.studyPlan.estimatedWeeks} week estimate.`
      );
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Could not generate learning plan.');
    } finally {
      setBusy(false);
    }
  }

  async function generateLesson(moduleId: string, chunkId: string) {
    if (!profile || !courseRunId) return;

    setBusy(true);
    setMessage('');
    setSubmitResult(null);
    try {
      const response = await fetch('/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.profileId,
          courseRunId,
          moduleId,
          chunkId,
          byoApiKey: byoApiKey.trim() || undefined,
          rememberOnDevice: false,
        }),
      });
      const payload = (await response.json()) as GeneratedLesson & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to generate lesson.');
      }

      setActiveLesson(payload);
      setActiveChunkId(chunkId);
      setQuizAnswers({});
      setMessage(
        payload.modeUsed === 'manual-fallback'
          ? `Lesson generated with manual fallback: ${payload.fallbackReason || 'model validation block'}`
          : `Lesson generated in ${payload.modeUsed} mode.`
      );
      if (rememberKey && byoApiKey.trim() && keyPassphrase.trim()) {
        await saveEncryptedByoKey(byoApiKey.trim(), keyPassphrase.trim());
        setHasSavedKey(true);
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Lesson generation failed.');
    } finally {
      setBusy(false);
    }
  }

  async function unlockSavedKey() {
    try {
      const key = await loadEncryptedByoKey(keyPassphrase.trim());
      setByoApiKey(key);
      setMessage('Saved API key unlocked for this session.');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Could not unlock saved key.');
    }
  }

  async function submitLesson() {
    if (!profile || !courseRunId || !activeLesson || !activeChunkId) return;
    setBusy(true);
    setMessage('');
    try {
      const answers = activeLesson.quizDraft.map((item, index) => ({
        prompt: item.prompt,
        answer: quizAnswers[index] || 'No answer provided',
      }));
      const response = await fetch('/api/lesson/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.profileId,
          courseRunId,
          moduleId: activeLesson.moduleId,
          lessonId: activeLesson.lessonId,
          chunkId: activeChunkId,
          answers,
          confidence: submitConfidence,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        score?: number;
        nextRecommendation?: { paceAction: string; explanationStyle: string; reason: string };
      };
      if (!response.ok || payload.score === undefined) {
        throw new Error(payload.error || 'Lesson submission failed.');
      }
      setSubmitResult({ score: payload.score, nextRecommendation: payload.nextRecommendation });
      setMessage('Lesson submitted. Adaptive recommendation updated.');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Could not submit lesson.');
    } finally {
      setBusy(false);
    }
  }

  async function exportData() {
    if (!profile) return;
    const response = await fetch('/api/privacy/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.profileId }),
    });
    const payload = (await response.json()) as { error?: string; data?: unknown };
    if (!response.ok || !payload.data) {
      setMessage(payload.error || 'Export failed.');
      return;
    }
    const content = JSON.stringify(payload.data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `novasanctum-profile-${profile.profileId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Profile data exported.');
  }

  async function resetHistory() {
    if (!profile) return;
    const response = await fetch('/api/privacy/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.profileId }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || 'Reset failed.');
      return;
    }
    setActiveLesson(null);
    setAdaptiveBlueprint(null);
    setStudyPlan(null);
    setCourseRunId(null);
    setMessage('Learning history reset. Profile preferences were kept.');
  }

  async function deleteProfile() {
    if (!profile) return;
    const response = await fetch('/api/privacy/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.profileId }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || 'Delete failed.');
      return;
    }
    window.localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
    setAdaptiveBlueprint(null);
    setStudyPlan(null);
    setCourseRunId(null);
    setActiveLesson(null);
    setSubmitResult(null);
    setMessage('Profile and learning history deleted.');
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="panel p-8">
        <h1 className="text-3xl">Adaptive Study Buddy Setup</h1>
        <p className="mt-3 text-sm text-slate-700">
          No login is required for this demo. Your profile is stored locally by default. Telemetry
          is optional, and NovaSanctum does not sell learner data.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          AI responses are assistive, citation-bound, and not a replacement for source materials.
        </p>
      </section>

      {!profile ? (
        <section className="panel mt-6 p-8">
          <h2 className="text-2xl">1) Create Your Learning Profile</h2>
          <form className="mt-4 space-y-4" onSubmit={event => void createProfile(event)}>
            <label className="block text-sm">
              Audience
              <select
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={audience}
                onChange={event =>
                  setAudience(event.target.value as 'adult-self-learner' | 'student' | 'workforce')
                }
              >
                <option value="adult-self-learner">adult-self-learner</option>
                <option value="student">student</option>
                <option value="workforce">workforce</option>
              </select>
            </label>

            <label className="block text-sm">
              Goals (one per line)
              <textarea
                className="mt-1 min-h-[90px] w-full rounded border border-slate-300 px-3 py-2"
                value={goalsText}
                onChange={event => setGoalsText(event.target.value)}
              />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="text-sm">
                Session minutes
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  type="number"
                  min={5}
                  max={90}
                  value={sessionMinutes}
                  onChange={event => setSessionMinutes(Number(event.target.value || 20))}
                />
              </label>
              <label className="text-sm">
                Reading depth
                <select
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  value={readingDepth}
                  onChange={event =>
                    setReadingDepth(event.target.value as 'light' | 'standard' | 'deep')
                  }
                >
                  <option value="light">light</option>
                  <option value="standard">standard</option>
                  <option value="deep">deep</option>
                </select>
              </label>
              <label className="text-sm">
                Explanation style
                <select
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  value={explanationStyle}
                  onChange={event =>
                    setExplanationStyle(
                      event.target.value as 'short' | 'detailed' | 'example-first'
                    )
                  }
                >
                  <option value="short">short</option>
                  <option value="detailed">detailed</option>
                  <option value="example-first">example-first</option>
                </select>
              </label>
            </div>

            <label className="block text-sm">
              Starting confidence ({confidenceLevel.toFixed(2)})
              <input
                className="mt-1 w-full"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={confidenceLevel}
                onChange={event => setConfidenceLevel(Number(event.target.value))}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={telemetryOptIn}
                onChange={event => setTelemetryOptIn(event.target.checked)}
              />
              Opt in to minimal product telemetry (quality metrics only).
            </label>

            <button
              disabled={busy}
              type="submit"
              className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              Quick Start (No Login)
            </button>
          </form>
        </section>
      ) : (
        <section className="panel mt-6 p-8">
          <h2 className="text-2xl">2) Generate Your Adaptive Plan</h2>
          <p className="mt-2 text-sm text-slate-700">
            Profile: <strong>{profile.profileId}</strong>. Pacing controls update automatically from
            your preferences and progress.
          </p>
          <form className="mt-4 space-y-4" onSubmit={event => void generatePlan(event)}>
            <label className="block text-sm">
              Subject
              <input
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={subject}
                onChange={event => setSubject(event.target.value)}
              />
            </label>
            <label className="block text-sm">
              Level
              <select
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                value={level}
                onChange={event =>
                  setLevel(
                    event.target.value as 'middle-school' | 'high-school' | 'undergrad' | 'grad'
                  )
                }
              >
                <option value="middle-school">middle-school</option>
                <option value="high-school">high-school</option>
                <option value="undergrad">undergrad</option>
                <option value="grad">grad</option>
              </select>
            </label>
            <label className="block text-sm">
              Outcomes (one per line)
              <textarea
                className="mt-1 min-h-[90px] w-full rounded border border-slate-300 px-3 py-2"
                value={planGoalsText}
                onChange={event => setPlanGoalsText(event.target.value)}
              />
            </label>
            <button
              disabled={busy}
              type="submit"
              className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              Build Adaptive Plan
            </button>
            <label className="block text-sm">
              Optional BYO API key (session only)
              <input
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                type="password"
                value={byoApiKey}
                onChange={event => setByoApiKey(event.target.value)}
                placeholder="sk-..."
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberKey}
                onChange={event => setRememberKey(event.target.checked)}
              />
              Encrypt and remember key on this device
            </label>
            <label className="block text-sm">
              Key passphrase (required to save/unlock)
              <input
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                type="password"
                value={keyPassphrase}
                onChange={event => setKeyPassphrase(event.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => void unlockSavedKey()}
                disabled={!hasSavedKey || !keyPassphrase.trim()}
                className="rounded border border-slate-300 bg-white px-2 py-1 disabled:opacity-50"
              >
                Unlock saved key
              </button>
              <button
                type="button"
                onClick={() => {
                  clearSavedByoKey();
                  setHasSavedKey(false);
                  setMessage('Saved key removed from this device.');
                }}
                className="rounded border border-red-300 bg-red-50 px-2 py-1 text-red-900"
              >
                Clear saved key
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              onClick={() => setPaceChoice('slow down')}
              className="rounded border border-slate-300 px-3 py-1"
            >
              slow down
            </button>
            <button
              type="button"
              onClick={() => setPaceChoice('keep pace')}
              className="rounded border border-slate-300 px-3 py-1"
            >
              keep pace
            </button>
            <button
              type="button"
              onClick={() => setPaceChoice('speed up')}
              className="rounded border border-slate-300 px-3 py-1"
            >
              speed up
            </button>
            <button
              type="button"
              onClick={() => setExplanationChoice('short')}
              className="rounded border border-slate-300 px-3 py-1"
            >
              short
            </button>
            <button
              type="button"
              onClick={() => setExplanationChoice('detailed')}
              className="rounded border border-slate-300 px-3 py-1"
            >
              detailed
            </button>
            <button
              type="button"
              onClick={() => setExplanationChoice('example-first')}
              className="rounded border border-slate-300 px-3 py-1"
            >
              example-first
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Preference controls chosen: {paceChoice}, {explanationChoice}.
          </p>
        </section>
      )}

      {message ? <p className="mt-5 text-sm text-slate-800">{message}</p> : null}

      {adaptiveBlueprint ? (
        <section className="panel mt-6 p-8">
          <h2 className="text-2xl">Plan Preview: {adaptiveBlueprint.subject}</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
            <span className="rounded bg-slate-100 px-2 py-1">
              Chunk mode: {adaptiveBlueprint.chunkMode}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1">
              Difficulty: {adaptiveBlueprint.difficultyLevel}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1">
              Target minutes: {adaptiveBlueprint.targetMinutes}
            </span>
            {studyPlan ? (
              <span className="rounded bg-slate-100 px-2 py-1">
                Study plan: {studyPlan.dailyMinutes}m/day, {studyPlan.sessionsPerWeek} sessions/week
              </span>
            ) : null}
          </div>

          <ul className="mt-4 space-y-3">
            {adaptiveBlueprint.modules.map(module => (
              <li key={module.moduleId} className="rounded border border-slate-200 p-4">
                <p className="font-semibold">{module.title}</p>
                <p className="text-xs text-slate-600">{module.nextLessonReason}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {module.chunks.map(chunk => (
                    <li key={chunk.chunkId} className="rounded bg-slate-50 px-2 py-2">
                      <p>
                        {chunk.title} ({chunk.targetMinutes} min) - {chunk.adaptationReason}
                      </p>
                      <button
                        type="button"
                        disabled={busy || !courseRunId}
                        onClick={() => void generateLesson(module.moduleId, chunk.chunkId)}
                        className="mt-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                      >
                        Generate Lesson Chunk
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activeLesson ? (
        <section className="panel mt-6 p-8">
          <h2 className="text-2xl">{activeLesson.title}</h2>
          <p className="mt-1 text-xs text-slate-600">
            Why this lesson: {activeLesson.whyThisLesson}
          </p>
          {activeLesson.fallbackReason ? (
            <p className="mt-1 text-xs text-amber-700">
              Fallback reason: {activeLesson.fallbackReason}
            </p>
          ) : null}

          <pre className="mt-4 max-h-[360px] overflow-auto rounded bg-slate-950 p-4 text-xs text-slate-100">
            {activeLesson.bodyMarkdown}
          </pre>

          <h3 className="mt-6 text-lg">Mastery Check</h3>
          <div className="mt-2 space-y-2">
            {activeLesson.quizDraft.map((quiz, index) => (
              <label key={`${quiz.prompt}-${index}`} className="block text-sm">
                {quiz.prompt}
                <textarea
                  className="mt-1 min-h-[70px] w-full rounded border border-slate-300 px-3 py-2"
                  value={quizAnswers[index] || ''}
                  onChange={event =>
                    setQuizAnswers(prev => ({
                      ...prev,
                      [index]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <label className="mt-4 block text-sm">
            Confidence ({submitConfidence.toFixed(2)})
            <input
              className="mt-1 w-full"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={submitConfidence}
              onChange={event => setSubmitConfidence(Number(event.target.value))}
            />
          </label>

          <button
            type="button"
            disabled={busy}
            onClick={() => void submitLesson()}
            className="mt-4 rounded bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
          >
            Submit Lesson
          </button>

          {submitResult ? (
            <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p>Score: {submitResult.score}%</p>
              {submitResult.nextRecommendation ? (
                <p>
                  Next recommendation: {submitResult.nextRecommendation.paceAction} /{' '}
                  {submitResult.nextRecommendation.explanationStyle} (
                  {submitResult.nextRecommendation.reason})
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {profile ? (
        <section className="panel mt-6 p-8">
          <h2 className="text-xl">Privacy Controls</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void exportData()}
              className="rounded border border-slate-300 bg-white px-3 py-1 text-sm"
            >
              Export Profile Data
            </button>
            <button
              type="button"
              onClick={() => void resetHistory()}
              className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-sm text-amber-900"
            >
              Reset Learning History
            </button>
            <button
              type="button"
              onClick={() => void deleteProfile()}
              className="rounded border border-red-300 bg-red-50 px-3 py-1 text-sm text-red-900"
            >
              Delete Profile
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
