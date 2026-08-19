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

function normalizeContent(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function questionSignature(question: Question) {
  return [
    question.category,
    normalizeContent(question.prompt),
    normalizeContent(question.passage ?? ""),
    normalizeContent(question.options[question.correct] ?? ""),
  ].join("|");
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
  let seenSignatures = new Set(
    bank.filter(question => seen.has(question.id)).map(questionSignature),
  );
  const canComplete = categories.every(category => (
    new Set(
      bank
        .filter(question => question.category === category && !seen.has(question.id) && !seenSignatures.has(questionSignature(question)))
        .map(questionSignature),
    ).size >= TEST_BLUEPRINT[category]
  ));

  const resetCycle = !canComplete;
  if (resetCycle) {
    seenIds = [];
    seen.clear();
    seenSignatures = new Set();
  }

  const seenFocus = new Set(bank.filter(question => seen.has(question.id)).map(question => question.focus));
  const picked = categories.flatMap(category => {
    const needed = TEST_BLUEPRINT[category];
    const candidates = shuffle(
      bank.filter(question => question.category === category && !seen.has(question.id) && !seenSignatures.has(questionSignature(question))),
      random,
    );
    const selected: Question[] = [];
    const selectedFocus = new Set<string>();
    const selectedSignatures = new Set<string>();
    const groups = new Map<string, Question[]>();

    for (const question of candidates) {
      const signature = questionSignature(question);
      if (selectedSignatures.has(signature)) continue;
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
      const question = shuffle(questions, random)[0];
      selected.push(question);
      selectedFocus.add(focus);
      selectedSignatures.add(questionSignature(question));
    }

    const balancedGroups = [...groups.entries()]
      .filter(([focus]) => !selectedFocus.has(focus))
      .map(entry => ({ entry, tieBreak: random() }))
      .sort((left, right) => right.entry[1].length - left.entry[1].length || left.tieBreak - right.tieBreak);
    for (const { entry: [focus, questions] } of balancedGroups) {
      if (selected.length === needed) break;
      const question = shuffle(questions, random)[0];
      if (selectedSignatures.has(questionSignature(question))) continue;
      selected.push(question);
      selectedFocus.add(focus);
      selectedSignatures.add(questionSignature(question));
    }

    for (const question of candidates) {
      if (selected.length === needed) break;
      const signature = questionSignature(question);
      if (!selected.includes(question) && !selectedSignatures.has(signature)) {
        selected.push(question);
        selectedSignatures.add(signature);
      }
    }

    return selected;
  });

  return {
    questions: shuffle(picked, random),
    seenIds: [...seenIds, ...picked.map(question => question.id)],
    resetCycle,
  };
}
