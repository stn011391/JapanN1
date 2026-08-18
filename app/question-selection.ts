import type { Category, Question } from "./questions";

export const TEST_BLUEPRINT: Record<Category, number> = {
  "單字・漢字": 8,
  "文法": 6,
  "閱讀": 6,
};

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function selectUnseenTest(
  bank: Question[],
  storedSeenIds: number[],
  random: () => number = Math.random,
) {
  const bankIds = new Set(bank.map(question => question.id));
  let seenIds = [...new Set(storedSeenIds.filter(id => bankIds.has(id)))];
  const seen = new Set(seenIds);
  const categories = Object.keys(TEST_BLUEPRINT) as Category[];
  const canComplete = categories.every(category => (
    bank.filter(question => question.category === category && !seen.has(question.id)).length >= TEST_BLUEPRINT[category]
  ));

  const resetCycle = !canComplete;
  if (resetCycle) {
    seenIds = [];
    seen.clear();
  }

  const picked = categories.flatMap(category => shuffle(
    bank.filter(question => question.category === category && !seen.has(question.id)),
    random,
  ).slice(0, TEST_BLUEPRINT[category]));

  return {
    questions: shuffle(picked, random),
    seenIds: [...seenIds, ...picked.map(question => question.id)],
    resetCycle,
  };
}
