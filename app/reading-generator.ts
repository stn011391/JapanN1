import type { Level, Question } from "./questions";

type ChoiceSpec = {
  prompt: string;
  correct: string;
  distractors: string[];
  explanation: string;
};

const PEOPLE = [
  "田中", "山田", "佐藤", "鈴木", "高橋", "伊藤", "渡辺", "中村", "小林", "加藤",
  "吉田", "山本", "松本", "井上", "木村", "林", "清水", "山口", "森", "池田",
  "橋本", "阿部", "石川", "前田", "藤田",
];
const DAYS = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日", "来週の月曜日", "来週の水曜日", "来週の金曜日"];
const TIMES = ["八時", "八時半", "九時", "九時半", "十時", "十時半", "十一時", "十三時", "十四時", "十五時", "十六時", "十七時"];
const PLACES = ["駅前", "図書館", "市民会館", "中央公園", "学校", "会社の会議室", "文化センター", "体育館", "市役所", "博物館", "交流館", "オンライン会議室"];
const ACTIVITIES = ["映画を見る", "日本語を勉強する", "買い物をする", "昼ご飯を食べる", "写真展を見る", "公園を散歩する", "本を借りる", "料理を作る", "音楽会を聞く", "スポーツをする", "祭りに参加する", "美術館を見学する"];
const EVENTS = ["料理教室", "健康診断", "防災訓練", "日本語講座", "工場見学", "地域交流会", "写真展", "就職説明会", "読書会", "環境セミナー", "文化祭", "ボランティア研修"];
const PREPARATIONS = [
  { item: "傘", reason: "雨が 降りそうです" },
  { item: "飲み物", reason: "長い時間 歩きます" },
  { item: "ノート", reason: "大切な 説明を 聞きます" },
  { item: "身分証明書", reason: "入口で 本人確認が あります" },
  { item: "運動靴", reason: "体育館で 運動します" },
  { item: "昼ご飯", reason: "近くに 店が ありません" },
  { item: "筆記用具", reason: "最後に 短い テストが あります" },
  { item: "タオル", reason: "外で 作業を します" },
  { item: "申込書", reason: "受付で 手続きが 必要です" },
  { item: "上着", reason: "会場は 少し 寒いです" },
  { item: "カメラ", reason: "写真を 撮っても いいです" },
  { item: "室内用の靴", reason: "会場では 外の靴を 脱ぎます" },
];
const METHODS = ["専用サイト", "電話", "受付窓口", "メール", "市のアプリ", "郵送"];
const TARGETS = ["市内に住む人", "十八歳以上の人", "学生", "子育て中の家庭", "六十五歳以上の人", "地域で働く人"];
const BENEFITS = ["参加費が半額になる", "専門家に相談できる", "教材を無料で借りられる", "施設を優先予約できる", "交通費の一部が支給される", "修了証を受け取れる"];
const POLICY_GOALS = ["地域の交流を増やす", "健康づくりを支援する", "食品ロスを減らす", "公共交通の利用を促す", "空き家を活用する", "災害への備えを強める"];

const N1_TOPICS = [
  { topic: "働き方の効率化", tendency: "短時間で測れる成果だけが重視される", risk: "長期的な工夫や人材育成が後回しになる", proposal: "数値と質的な評価を組み合わせること", extreme: "一つの指標だけで結論を出すこと" },
  { topic: "地域交通の再編", tendency: "利用者数の多い路線だけが重視される", risk: "少数の住民に必要な移動手段が失われる", proposal: "地域ごとの生活事情も含めて判断すること", extreme: "採算だけを基準に廃止すること" },
  { topic: "学校教育のデジタル化", tendency: "端末を導入した数が成果として扱われる", risk: "学び方そのものの改善が見えにくくなる", proposal: "授業の目的に応じて道具を選ぶこと", extreme: "すべての授業を同じ方法に変えること" },
  { topic: "都市の緑化", tendency: "植えた木の本数だけが注目される", risk: "維持管理や生態系への効果が軽視される", proposal: "長期的に育つ環境まで設計すること", extreme: "短期的な見栄えだけを優先すること" },
  { topic: "研究成果の評価", tendency: "論文数のような比較しやすい数字が重視される", risk: "挑戦的で時間のかかる研究が避けられる", proposal: "研究過程と社会的意義も検討すること", extreme: "数字の順位だけで価値を決めること" },
  { topic: "観光地の活性化", tendency: "来訪者数を増やすことだけが目標になる", risk: "住民の生活や地域文化が損なわれる", proposal: "観光客と住民の双方に利益がある形を探ること", extreme: "有名な企画をそのまま導入すること" },
  { topic: "医療情報の共有", tendency: "情報を集める範囲が広いほど良いと考えられる", risk: "本人の理解やプライバシーが置き去りになる", proposal: "目的と利用範囲を明確にして合意を得ること", extreme: "利便性を理由に無制限に共有すること" },
  { topic: "災害対策", tendency: "大規模な設備の整備だけが注目される", risk: "日常的な訓練や住民同士の連携が弱くなる", proposal: "設備と地域の運用を一体で考えること", extreme: "設備があれば十分だとみなすこと" },
  { topic: "文化財の保存", tendency: "建物を元の形に戻すことだけが重視される", risk: "地域で受け継がれてきた使い方が失われる", proposal: "形と地域の記憶の両方を残すこと", extreme: "外観だけを保存して満足すること" },
  { topic: "人工知能の導入", tendency: "処理速度や削減時間だけが評価される", risk: "判断の根拠や責任の所在が曖昧になる", proposal: "人が確認できる仕組みを同時に整えること", extreme: "判断をすべて機械に任せること" },
];

function otherValues<T>(values: T[], index: number, count = 3) {
  return Array.from({ length: count }, (_, offset) => values[(index + offset + 1) % values.length]);
}

function rotateOptions(correct: string, distractors: string[], seed: number) {
  const values = [correct, ...distractors.filter(value => value !== correct)];
  const unique = [...new Set(values)].slice(0, 4);
  const fallback = ["記載されていません", "後日決めます", "参加者が自由に選びます", "当日に変更します"];
  for (const value of fallback) {
    if (unique.length === 4) break;
    if (!unique.includes(value)) unique.push(value);
  }
  const shift = seed % unique.length;
  return {
    options: unique.map((_, index) => unique[(index + shift) % unique.length]),
    correct: (unique.length - shift) % unique.length,
  };
}

function createQuestions(level: Level, scenarioIndex: number, passage: string, specs: ChoiceSpec[]): Question[] {
  return specs.map((spec, questionIndex) => {
    const rotated = rotateOptions(spec.correct, spec.distractors, scenarioIndex + questionIndex);
    return {
      id: 701 + scenarioIndex * 6 + questionIndex,
      focus: `reading:${level}:${scenarioIndex}:${questionIndex}`,
      category: "閱讀",
      instruction: level === "N5" || level === "N4" ? "文章を 読んで、答えてください。" : "文章を読んで、答えてください。",
      passage,
      prompt: spec.prompt,
      options: rotated.options,
      correct: rotated.correct,
      explanation: spec.explanation,
    };
  });
}

function n5Scenario(index: number): Question[] {
  const person = PEOPLE[index % PEOPLE.length];
  const sender = PEOPLE[(index + 9) % PEOPLE.length];
  const day = DAYS[index % DAYS.length];
  const place = PLACES[index % 6];
  const activity = ACTIVITIES[index % ACTIVITIES.length];
  const meet = TIMES[(index * 2) % TIMES.length];
  const start = TIMES[(index * 2 + 2) % TIMES.length];
  const prep = PREPARATIONS[index % PREPARATIONS.length];
  const passage = `${person}さんへ\n${day}、${place}で ${activity} 予定です。${meet}に 入口で 会いましょう。${activity}のは ${start}からです。${prep.reason}から、${prep.item}を 持ってきてください。\n${sender}`;
  return createQuestions("N5", index, passage, [
    { prompt: `${person}さんは 何を しますか。`, correct: activity, distractors: otherValues(ACTIVITIES, index), explanation: `第一句寫明預定「${activity}」。` },
    { prompt: `二人は 何時に 会いますか。`, correct: meet, distractors: [start, TIMES[(index + 5) % TIMES.length], TIMES[(index + 7) % TIMES.length]], explanation: `文章寫「${meet}に入口で会いましょう」。` },
    { prompt: `予定は 何時からですか。`, correct: start, distractors: [meet, TIMES[(index + 6) % TIMES.length], TIMES[(index + 8) % TIMES.length]], explanation: `活動開始時間是 ${start}。` },
    { prompt: `二人は どこで 会いますか。`, correct: `${place}の入口`, distractors: otherValues(PLACES, index).map(value => `${value}の入口`), explanation: `集合地點是 ${place}的入口。` },
    { prompt: `${person}さんは 何を 持っていきますか。`, correct: prep.item, distractors: otherValues(PREPARATIONS, index).map(item => item.item), explanation: `文末要求攜帶「${prep.item}」。` },
    { prompt: `どうして ${prep.item}が 必要ですか。`, correct: prep.reason, distractors: otherValues(PREPARATIONS, index).map(item => item.reason), explanation: `原因是「${prep.reason}」。` },
  ]);
}

function n4Scenario(index: number): Question[] {
  const event = EVENTS[index % EVENTS.length];
  const day = DAYS[(index + 2) % DAYS.length];
  const oldTime = TIMES[(index * 2 + 1) % TIMES.length];
  const newTime = TIMES[(index * 2 + 3) % TIMES.length];
  const oldPlace = PLACES[(index + 1) % 10];
  const newPlace = PLACES[(index + 5) % 10];
  const prep = PREPARATIONS[(index + 3) % PREPARATIONS.length];
  const deadline = TIMES[(index * 2) % TIMES.length];
  const passage = `${event}のお知らせ\n${day}の${event}は、会場の都合により、開始時間が${oldTime}から${newTime}に変わりました。会場も${oldPlace}ではなく${newPlace}です。${prep.reason}ので、${prep.item}を用意してください。参加できない人は当日の${deadline}までに受付へ連絡してください。`;
  return createQuestions("N4", index, passage, [
    { prompt: `${event}は 何時に 始まりますか。`, correct: newTime, distractors: [oldTime, deadline, TIMES[(index + 8) % TIMES.length]], explanation: `開始時間已由 ${oldTime} 改為 ${newTime}。` },
    { prompt: `会場は どこですか。`, correct: newPlace, distractors: [oldPlace, PLACES[(index + 7) % PLACES.length], PLACES[(index + 9) % PLACES.length]], explanation: `新會場是「${newPlace}」。` },
    { prompt: `何が 変わりましたか。`, correct: "開始時間と会場", distractors: ["参加費だけ", "持ち物だけ", "開催日だけ"], explanation: "公告同時更改開始時間與會場。" },
    { prompt: `何を 用意しますか。`, correct: prep.item, distractors: otherValues(PREPARATIONS, index).map(item => item.item), explanation: `需準備「${prep.item}」。` },
    { prompt: `参加できない人は どうしますか。`, correct: `${deadline}までに受付へ連絡する`, distractors: ["何もしない", "次の日に会場へ行く", "友達にだけ伝える"], explanation: `無法參加者必須在 ${deadline} 前聯絡櫃檯。` },
    { prompt: `この お知らせの 内容に 合うものは どれですか。`, correct: `${day}に${newPlace}で行われる`, distractors: [`${day}に${oldPlace}で行われる`, "イベントは中止になった", "会場だけが変わった"], explanation: `活動仍在 ${day} 舉行，新地點是 ${newPlace}。` },
  ]);
}

function n3Scenario(index: number): Question[] {
  const person = PEOPLE[index % PEOPLE.length];
  const event = EVENTS[(index + 4) % EVENTS.length];
  const day = DAYS[(index + 4) % DAYS.length];
  const oldPlace = PLACES[(index + 2) % PLACES.length];
  const newPlace = PLACES[(index + 7) % PLACES.length];
  const start = TIMES[(index * 3 + 2) % TIMES.length];
  const deadline = TIMES[(index * 3) % TIMES.length];
  const method = METHODS[index % METHODS.length];
  const prep = PREPARATIONS[(index + 5) % PREPARATIONS.length];
  const passage = `${person}さんへ\n${day}の${event}について連絡します。参加者が予定より増えたため、会場を${oldPlace}から${newPlace}へ変更しました。開始は${start}ですが、資料確認のため${deadline}までに来てください。事前に${method}で出席を登録し、${prep.item}も持参してください。当日来られない場合は、後日録画を見ることができます。`;
  return createQuestions("N3", index, passage, [
    { prompt: `会場を 変更した 理由は 何ですか。`, correct: "参加者が予定より増えたから", distractors: ["建物を掃除するから", "開始時間が遅くなったから", "録画を中止したから"], explanation: "參加人數比預期多，因此更換會場。" },
    { prompt: `新しい 会場は どこですか。`, correct: newPlace, distractors: [oldPlace, PLACES[(index + 9) % PLACES.length], PLACES[(index + 10) % PLACES.length]], explanation: `會場由 ${oldPlace} 改到 ${newPlace}。` },
    { prompt: `参加者は 何時までに 来ますか。`, correct: deadline, distractors: [start, TIMES[(index + 6) % TIMES.length], TIMES[(index + 8) % TIMES.length]], explanation: `為了確認資料，必須在 ${deadline} 前抵達。` },
    { prompt: `出席は どうやって 登録しますか。`, correct: method, distractors: METHODS.slice((index + 1) % METHODS.length).concat(METHODS).slice(0, 3), explanation: `需事先透過「${method}」登記。` },
    { prompt: `当日 来られない人は どうしますか。`, correct: "後日録画を見る", distractors: ["別の会場へ行く", "資料を返す", "参加費を二度払う"], explanation: "當天無法到場者之後可以觀看錄影。" },
    { prompt: `${person}さんが 準備するものは 何ですか。`, correct: prep.item, distractors: otherValues(PREPARATIONS, index).map(item => item.item), explanation: `通知要求攜帶「${prep.item}」。` },
  ]);
}

function n2Scenario(index: number): Question[] {
  const event = EVENTS[(index + 6) % EVENTS.length];
  const target = TARGETS[index % TARGETS.length];
  const goal = POLICY_GOALS[index % POLICY_GOALS.length];
  const benefit = BENEFITS[index % BENEFITS.length];
  const method = METHODS[(index + 2) % METHODS.length];
  const deadlineDay = DAYS[(index + 6) % DAYS.length];
  const place = PLACES[(index + 3) % PLACES.length];
  const passage = `市は、${goal}ことを目的に、新しい${event}支援制度を始める。対象は${target}で、登録すると${benefit}。希望者は${deadlineDay}までに${method}で申し込み、初回説明を${place}で受ける必要がある。申込者が定員を超えた場合、先着順ではなく、活動計画の内容を見て参加者を決定する。`;
  return createQuestions("N2", index, passage, [
    { prompt: `この 制度の 目的は 何ですか。`, correct: goal, distractors: otherValues(POLICY_GOALS, index), explanation: `制度的目的明記為「${goal}」。` },
    { prompt: `制度を 利用できるのは だれですか。`, correct: target, distractors: otherValues(TARGETS, index), explanation: `適用對象是「${target}」。` },
    { prompt: `登録すると どんな 利点が ありますか。`, correct: benefit, distractors: otherValues(BENEFITS, index), explanation: `登記後可獲得的好處是「${benefit}」。` },
    { prompt: `希望者は まず 何を しますか。`, correct: `${deadlineDay}までに${method}で申し込む`, distractors: ["直接活動を始める", "参加者を自分で選ぶ", "費用を二度支払う"], explanation: `首先須在 ${deadlineDay} 前透過 ${method} 申請。` },
    { prompt: `初回説明は どこで 受けますか。`, correct: place, distractors: otherValues(PLACES, index), explanation: `初次說明地點是「${place}」。` },
    { prompt: `定員を 超えた 場合、参加者は どう 決まりますか。`, correct: "活動計画の内容で決まる", distractors: ["先着順で決まる", "年齢だけで決まる", "抽選だけで決まる"], explanation: "超過名額時，會依活動計畫內容選定，而非先到先得。" },
  ]);
}

function n1Scenario(index: number): Question[] {
  const item = N1_TOPICS[index % N1_TOPICS.length];
  const cycle = Math.floor(index / N1_TOPICS.length) + 1;
  const passage = `第${cycle}回の調査では、${item.topic}が取り上げられた。この議論では、${item.tendency}傾向がある。しかし、その基準を唯一のものとすれば、${item.risk}おそれがある。指標は現実を捉えるための道具であって、現実そのものではない。したがって求められるのは、${item.proposal}であり、${item.extreme}ではない。`;
  const other = N1_TOPICS[(index + 3) % N1_TOPICS.length];
  return createQuestions("N1", index, passage, [
    { prompt: `この文章で 取り上げられている 主題は 何ですか。`, correct: item.topic, distractors: N1_TOPICS.slice((index + 1) % N1_TOPICS.length).concat(N1_TOPICS).slice(0, 3).map(value => value.topic), explanation: `主題是「${item.topic}」。` },
    { prompt: `筆者が 問題視している 傾向は 何ですか。`, correct: item.tendency, distractors: [other.tendency, other.proposal, item.proposal], explanation: `第二句指出「${item.tendency}」的傾向。` },
    { prompt: `一つの 基準だけを 用いると、何が 起こり得ますか。`, correct: item.risk, distractors: [other.risk, "すべての問題が直ちに解決する", "判断の必要がなくなる"], explanation: `文章警告可能造成「${item.risk}」。` },
    { prompt: `本文の「指標」に 対する 考え方は どれですか。`, correct: "現実を捉える道具だが、現実そのものではない", distractors: ["現実のすべてを完全に表す", "判断には一切使えない", "数が多ければ必ず正しい"], explanation: "作者認為指標是工具，但不能等同於現實本身。" },
    { prompt: `筆者が 必要だと 述べていることは 何ですか。`, correct: item.proposal, distractors: [item.extreme, other.proposal, "議論をやめること"], explanation: `末句主張需要「${item.proposal}」。` },
    { prompt: `筆者の 主張に 合わないものは どれですか。`, correct: item.extreme, distractors: [item.proposal, "指標の限界を意識すること", "複数の面から判断すること"], explanation: `作者否定的是「${item.extreme}」。` },
  ]);
}

export function buildGeneratedReadingBank(level: Level): Question[] {
  const builders: Record<Level, (index: number) => Question[]> = {
    N5: n5Scenario,
    N4: n4Scenario,
    N3: n3Scenario,
    N2: n2Scenario,
    N1: n1Scenario,
  };
  return Array.from({ length: 50 }, (_, index) => builders[level](index)).flat();
}
