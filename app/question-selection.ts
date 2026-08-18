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

  const seenFocus = new Set(bank.filter(question => seen.has(question.id)).map(question => question.focus));
  const picked = categories.flatMap(category => {
    const needed = TEST_BLUEPRINT[category];
    const candidates = shuffle(
      bank.filter(question => question.category === category && !seen.has(question.id)),
      random,
    );
    const selected: Question[] = [];
    const selectedFocus = new Set<string>();
    const groups = new Map<string, Question[]>();

    for (const question of candidates) {
      const group = groups.get(question.focus) ?? [];
      group.push(question);
      groups.set(question.focus, group);
    }

    const freshGroups = shuffle(
      [...groups.entries()].filter(([focus]) => !seenFocus.has(focus)),
      random,
    );
    for (const [focus, questions] of freshGroups) {
      if (selected.length === needed) break;
      selected.push(shuffle(questions, random)[0]);
      selectedFocus.add(focus);
    }

    const balancedGroups = [...groups.entries()]
      .filter(([focus]) => !selectedFocus.has(focus))
      .map(entry => ({ entry, tieBreak: random() }))
      .sort((left, right) => right.entry[1].length - left.entry[1].length || left.tieBreak - right.tieBreak);
    for (const { entry: [focus, questions] } of balancedGroups) {
      if (selected.length === needed) break;
      selected.push(shuffle(questions, random)[0]);
      selectedFocus.add(focus);
    }

    for (const question of candidates) {
      if (selected.length === needed) break;
      if (!selected.includes(question)) selected.push(question);
    }

    return selected;
  });

  return {
    questions: shuffle(picked, random),
    seenIds: [...seenIds, ...picked.map(question => question.id)],
    resetCycle,
  };
}
