import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const temporaryDirectory = await mkdtemp(join(tmpdir(), "jlpt-question-bank-"));

try {
  const questionsBundle = join(temporaryDirectory, "questions.mjs");
  const selectionBundle = join(temporaryDirectory, "question-selection.mjs");
  const esbuild = join(process.cwd(), "node_modules", ".bin", "esbuild");

  execFileSync(esbuild, ["app/questions.ts", "--bundle", "--platform=node", "--format=esm", `--outfile=${questionsBundle}`]);
  execFileSync(esbuild, ["app/question-selection.ts", "--bundle", "--platform=node", "--format=esm", `--outfile=${selectionBundle}`]);

  const { LEVELS, QUESTION_BANKS } = await import(pathToFileURL(questionsBundle));
  const { questionSignature, selectUnseenTest, TEST_BLUEPRINT } = await import(pathToFileURL(selectionBundle));

  let randomState = 20260819;
  const random = () => {
    randomState = (randomState * 1664525 + 1013904223) >>> 0;
    return randomState / 0x100000000;
  };

  for (const level of LEVELS) {
    const bank = QUESTION_BANKS[level];
    assert.equal(bank.length, 1000, `${level} should contain 1,000 questions`);
    assert.equal(new Set(bank.map(question => question.id)).size, 1000, `${level} IDs should be unique`);
    assert.equal(new Set(bank.map(questionSignature)).size, 1000, `${level} content signatures should be unique`);

    for (const [category, expected] of Object.entries({ "單字・漢字": 400, "文法": 300, "閱讀": 300 })) {
      assert.equal(bank.filter(question => question.category === category).length, expected, `${level} ${category} count`);
    }

    let seenIds = [];
    const seenSignatures = new Set();
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const selection = selectUnseenTest(bank, seenIds, random);
      assert.equal(selection.resetCycle, false, `${level} should not reset before all 50 tests`);
      assert.equal(selection.questions.length, 20, `${level} test ${attempt + 1} should contain 20 questions`);

      for (const [category, expected] of Object.entries(TEST_BLUEPRINT)) {
        assert.equal(selection.questions.filter(question => question.category === category).length, expected, `${level} test ${attempt + 1} ${category} count`);
      }

      for (const question of selection.questions) {
        const signature = questionSignature(question);
        assert.equal(seenSignatures.has(signature), false, `${level} repeated content in test ${attempt + 1}`);
        seenSignatures.add(signature);
      }
      seenIds = selection.seenIds;
    }

    assert.equal(seenIds.length, 1000, `${level} should complete its full cycle`);
    assert.equal(seenSignatures.size, 1000, `${level} should show 1,000 unique content signatures`);

    const nextCycle = selectUnseenTest(bank, seenIds, random);
    assert.equal(nextCycle.resetCycle, true, `${level} should reset after 1,000 questions`);
    assert.equal(nextCycle.seenIds.length, 20, `${level} new cycle should start with 20 questions`);
  }

  console.log("Validated 5,000 unique questions and 50 non-repeating tests per JLPT level.");
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
