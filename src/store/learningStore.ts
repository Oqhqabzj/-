export type Feedback = { utterance: string; intent: string | null; feedback: 'up' | 'down'; lang: string };

export const learningStore: Feedback[] = [];

export async function submitFeedbackBatch(endpoint = '/feedback') {
  if (learningStore.length === 0) return;
  try {
    const batch = learningStore.splice(0, learningStore.length);
    // POST to your backend for storage / model training
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(batch) });
  } catch (e) {
    console.error('Failed to submit feedback', e);
  }
}
