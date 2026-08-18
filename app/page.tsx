"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "單字・漢字" | "文法" | "閱讀";
type Question = {
  id: number;
  category: Category;
  instruction: string;
  prompt: string;
  passage?: string;
  options: string[];
  correct: number;
  explanation: string;
};
type Response = { id: number; selected: number; correct: boolean };

const QUESTIONS: Question[] = [
  { id:1, category:"單字・漢字", instruction:"＿＿＿の ことばは どう 読みますか。", prompt:"毎朝、[[近く]]の 公園を 散歩します。", options:["ちかく","とおく","はやく","おそく"], correct:0, explanation:"「近く」讀作 ちかく，意思是「附近」。整句是：每天早上在附近的公園散步。" },
  { id:2, category:"單字・漢字", instruction:"＿＿＿の ことばは どう 読みますか。", prompt:"午後、銀行に [[用事]]が あります。", options:["ようし","よじ","ようじ","よし"], correct:2, explanation:"「用事（ようじ）」是事情、要辦的事。例：ちょっと用事があります＝我有點事。" },
  { id:3, category:"單字・漢字", instruction:"＿＿＿の ことばは どう 読みますか。", prompt:"旅行の [[準備]]は もう できました。", options:["じゅび","じゅんび","じゅうび","じゅんぴ"], correct:1, explanation:"「準備（じゅんび）」就是準備。整句是：旅行的準備已經完成了。" },
  { id:4, category:"單字・漢字", instruction:"＿＿＿の ことばと いちばん 近いものを 選んでください。", prompt:"時間が ないので、[[急いで]] ください。", options:["ゆっくりして","はやくして","しずかにして","きれいにして"], correct:1, explanation:"「急いで（いそいで）」是「趕快、急忙」；最接近 はやくして（快一點）。" },
  { id:5, category:"單字・漢字", instruction:"＿＿＿の ことばは どう 読みますか。", prompt:"京都で 家族に [[お土産]]を 買いました。", options:["おみやげ","おどさん","おつちさん","おとさん"], correct:0, explanation:"「お土産（おみやげ）」是伴手禮、紀念品。" },
  { id:6, category:"單字・漢字", instruction:"ひらがなの ことばを 漢字で どう 書きますか。", prompt:"母は [[びょういん]]で 働いています。", options:["病員","病院","秒院","病園"], correct:1, explanation:"「びょういん」寫作「病院」，意思是醫院。注意「院」的右邊是「完」。" },
  { id:7, category:"單字・漢字", instruction:"＿＿＿の ことばは どんな 意味ですか。", prompt:"試合に 負けて、[[残念]]でした。", options:["很可惜","很安心","很危險","很簡單"], correct:0, explanation:"「残念（ざんねん）」表示遺憾、可惜。比賽輸了，所以覺得很可惜。" },
  { id:8, category:"單字・漢字", instruction:"＿＿＿の ことばは どう 読みますか。", prompt:"外国の [[文化]]に 興味が あります。", options:["ぶんが","ぶんか","もんか","もんが"], correct:1, explanation:"「文化」讀作 ぶんか；「興味があります」是有興趣。" },
  { id:9, category:"文法", instruction:"（　）に 何を 入れますか。", prompt:"わたしは 日本へ（　）ことが あります。", options:["行った","行く","行って","行き"], correct:0, explanation:"「動詞た形＋ことがあります」表示曾經有過某種經驗：日本へ行ったことがあります＝我曾去過日本。" },
  { id:10, category:"文法", instruction:"（　）に 何を 入れますか。", prompt:"空が 暗いですね。雨が 降り（　）です。", options:["ながら","まで","そう","よう"], correct:2, explanation:"動詞ます形去掉「ます」＋そうです，表示看起來快要發生：降りそうです＝看起來要下雨。" },
  { id:11, category:"文法", instruction:"（　）に 何を 入れますか。", prompt:"音楽を（　）、宿題を します。", options:["聞きながら","聞いたら","聞くまで","聞いても"], correct:0, explanation:"「動詞ます形＋ながら」表示同時做兩件事：一邊聽音樂，一邊寫作業。" },
  { id:12, category:"文法", instruction:"（　）に 何を 入れますか。", prompt:"薬を 飲んで（　）、寝て ください。", options:["だけ","から","しか","ほど"], correct:1, explanation:"「動詞て形＋から」表示做完前項之後再做後項：吃藥之後請睡覺。" },
  { id:13, category:"文法", instruction:"（　）に 何を 入れますか。", prompt:"昨日は 雨だったので、（　）行きませんでした。", options:["どこかへ","どこにも","どこでも","どこまで"], correct:1, explanation:"疑問詞＋も＋否定表示全面否定。「どこにも行きませんでした」＝哪裡都沒去。" },
  { id:14, category:"文法", instruction:"（　）に 何を 入れますか。", prompt:"明日は 早く 起き（　）。", options:["てもいいです","たことがあります","なければなりません","ないでください"], correct:2, explanation:"「ない形去ない＋なければなりません」表示必須：起きなければなりません＝必須起床。" },
  { id:15, category:"閱讀", instruction:"お知らせを 読んで、答えてください。", passage:"図書館からのお知らせ\n8月20日（水）は 館内の 掃除のため、午後3時に 閉まります。いつもより 2時間 早いです。返す本は、入口の 右にある 箱に 入れてください。", prompt:"8月20日、図書館は どうして 早く 閉まりますか。", options:["本を 整理するから","掃除を するから","会議が あるから","新しい本が 来るから"], correct:1, explanation:"公告第一句寫「館内の掃除のため」，意思是因為要打掃館內，所以提早關門。" },
  { id:16, category:"閱讀", instruction:"お知らせを 読んで、答えてください。", passage:"図書館からのお知らせ\n8月20日（水）は 館内の 掃除のため、午後3時に 閉まります。いつもより 2時間 早いです。返す本は、入口の 右にある 箱に 入れてください。", prompt:"午後3時の あと、本を 返したい人は どうしますか。", options:["次の日に 来ます","職員に 渡します","入口の 右の 箱に 入れます","入口の 左に 置きます"], correct:2, explanation:"最後一句明確寫著：要歸還的書，請放進入口右邊的箱子。" },
  { id:17, category:"閱讀", instruction:"メモを 読んで、答えてください。", passage:"山田さんへ\n明日の 会議は 10時から 9時半に 変わりました。資料を 20部 コピーして、9時15分までに 会議室へ 持ってきてください。\n佐藤", prompt:"会議は 何時に 始まりますか。", options:["9時15分","9時30分","10時","10時30分"], correct:1, explanation:"原本 10 點的會議改為「9時半」，也就是上午 9:30 開始。" },
  { id:18, category:"閱讀", instruction:"メモを 読んで、答えてください。", passage:"山田さんへ\n明日の 会議は 10時から 9時半に 変わりました。資料を 20部 コピーして、9時15分までに 会議室へ 持ってきてください。\n佐藤", prompt:"山田さんは 9時15分までに 何を しますか。", options:["会議を 始めます","佐藤さんに 電話します","資料を 10部 作ります","資料を 20部 コピーして 会議室へ 持っていきます"], correct:3, explanation:"備忘錄要求山田把資料影印 20 份，並在 9:15 前拿到會議室。" },
  { id:19, category:"閱讀", instruction:"文章を 読んで、答えてください。", passage:"日曜日、妹と 新しい映画を 見に行く つもりです。映画は 午後2時からですが、人気が あるので、1時に 駅で 会います。昼ご飯は 駅前の パン屋で 買います。", prompt:"映画は 何時からですか。", options:["午後1時","午後1時半","午後2時","午後2時半"], correct:2, explanation:"「映画は午後2時から」表示電影下午 2 點開始；1 點是和妹妹碰面的時間。" },
  { id:20, category:"閱讀", instruction:"文章を 読んで、答えてください。", passage:"日曜日、妹と 新しい映画を 見に行く つもりです。映画は 午後2時からですが、人気が あるので、1時に 駅で 会います。昼ご飯は 駅前の パン屋で 買います。", prompt:"昼ご飯は どこで 買いますか。", options:["映画館","駅の 中の 店","駅前の パン屋","家の 近くの 店"], correct:2, explanation:"文章最後寫著「駅前のパン屋で買います」，所以是在車站前的麵包店買午餐。" },
];

const categoryCards = [
  { kanji:"語", label:"單字・漢字", meta:"8 題", tone:"coral" },
  { kanji:"文", label:"文法", meta:"6 題", tone:"gold" },
  { kanji:"読", label:"閱讀", meta:"6 題", tone:"blue" },
];

function MarkedText({ text }: { text:string }) {
  return <>{text.split(/(\[\[.*?\]\])/g).map((part, i) => part.startsWith("[[") ? <u key={i}>{part.slice(2,-2)}</u> : <span key={i}>{part}</span>)}</>;
}

export default function Home() {
  const [phase, setPhase] = useState<"home"|"quiz"|"result">("home");
  const [queue, setQueue] = useState<Question[]>(QUESTIONS);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [revealed, setRevealed] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [remaining, setRemaining] = useState(25*60);
  const [best, setBest] = useState<number|null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("n4-best-score");
    if (saved !== null) setBest(Number(saved));
  }, []);

  useEffect(() => {
    if (phase !== "quiz") return;
    const timer = window.setInterval(() => setRemaining(value => Math.max(0, value-1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "quiz" && remaining === 0) setPhase("result");
  }, [remaining, phase]);

  const current = queue[index];
  const score = responses.filter(item => item.correct).length;
  const percent = Math.round((score / queue.length) * 100) || 0;
  const mistakes = useMemo(() => queue.filter(q => !responses.find(r => r.id===q.id)?.correct), [queue, responses]);

  useEffect(() => {
    if (phase !== "result" || queue.length !== QUESTIONS.length) return;
    if (best === null || percent > best) {
      setBest(percent);
      window.localStorage.setItem("n4-best-score", String(percent));
    }
  }, [phase, percent, queue.length, best]);

  function beginTest(items:Question[]=QUESTIONS) {
    setQueue(items);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setResponses([]);
    setRemaining(Math.max(5*60, Math.round(25*60*items.length/QUESTIONS.length)));
    setPhase("quiz");
    window.scrollTo(0,0);
  }

  function checkAnswer() {
    if (selected===null || revealed) return;
    setResponses(old => [...old, { id:current.id, selected, correct:selected===current.correct }]);
    setRevealed(true);
  }

  function nextQuestion() {
    if (index === queue.length-1) {
      setPhase("result");
      window.scrollTo(0,0);
      return;
    }
    setIndex(i => i+1);
    setSelected(null);
    setRevealed(false);
  }

  if (phase === "quiz") {
    const minutes = String(Math.floor(remaining/60)).padStart(2,"0");
    const seconds = String(remaining%60).padStart(2,"0");
    const progress = ((index + (revealed ? 1 : 0)) / queue.length) * 100;
    return (
      <main className="quiz-shell">
        <header className="quiz-topbar">
          <button className="brand brand-button" onClick={() => setPhase("home")} aria-label="退出測驗並回到首頁">
            <span className="brand-mark">N4</span><span><b>日本語挑戦</b><small>JLPT PRACTICE</small></span>
          </button>
          <div className="quiz-status">
            <span className="timer" aria-label={`剩餘時間 ${minutes} 分 ${seconds} 秒`}><i>◷</i> {minutes}:{seconds}</span>
            <button className="exit-button" onClick={() => setPhase("home")}>退出測驗</button>
          </div>
        </header>

        <div className="progress-track" aria-hidden="true"><span style={{width:`${progress}%`}} /></div>

        <section className="quiz-stage">
          <aside className="question-rail">
            <span className="rail-label">QUESTION</span>
            <b>{String(index+1).padStart(2,"0")}</b><small>/ {String(queue.length).padStart(2,"0")}</small>
            <div className="rail-category">{current.category}</div>
            <p>{current.category === "閱讀" ? "關鍵資訊先圈起來，再看選項。" : "看清楚題目，再選出最自然的答案。"}</p>
          </aside>

          <div className={`exam-card ${current.passage ? "has-passage" : ""}`}>
            <div className="exam-heading">
              <span>{current.category}</span><b>第 {current.id} 題</b>
            </div>
            <p className="exam-instruction">{current.instruction}</p>
            {current.passage && <div className="reading-passage">{current.passage.split("\n").map((line,i)=><p key={i}>{line}</p>)}</div>}
            <h1 className="exam-prompt"><MarkedText text={current.prompt} /></h1>
            <div className="exam-options" role="radiogroup" aria-label="答案選項">
              {current.options.map((option, optionIndex) => {
                const isSelected = selected===optionIndex;
                const isCorrect = revealed && optionIndex===current.correct;
                const isWrong = revealed && isSelected && optionIndex!==current.correct;
                return (
                  <button
                    key={option}
                    role="radio"
                    aria-checked={isSelected}
                    disabled={revealed}
                    className={`${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                    onClick={() => setSelected(optionIndex)}
                  >
                    <span>{String.fromCharCode(65+optionIndex)}</span><b>{option}</b>{isCorrect && <i>✓</i>}{isWrong && <i>×</i>}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className={`explanation ${selected===current.correct ? "is-correct" : "is-wrong"}`} role="status">
                <span>{selected===current.correct ? "正解" : "要複習"}</span>
                <p>{current.explanation}</p>
              </div>
            )}

            <footer className="exam-footer">
              <span>{revealed ? `目前答對 ${score} 題` : "選擇後再確認答案"}</span>
              {!revealed ? (
                <button className="next-button" disabled={selected===null} onClick={checkAnswer}>確認答案 <i>→</i></button>
              ) : (
                <button className="next-button" onClick={nextQuestion}>{index===queue.length-1 ? "查看成績" : "下一題"} <i>→</i></button>
              )}
            </footer>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "result") {
    const resultTitle = percent>=85 ? "很接近實戰水準！" : percent>=70 ? "已進入合格練習圈" : percent>=50 ? "基礎有了，再補幾個弱點" : "先把核心基礎穩住";
    const resultText = percent>=70 ? "你的 N4 基礎已經相當完整。接下來針對低分項目複習，成績會提升得更快。" : "不用急，這份結果就是最好的複習地圖。先從正確率最低的題型開始。";
    return (
      <main className="result-shell">
        <header className="quiz-topbar result-topbar">
          <button className="brand brand-button" onClick={() => setPhase("home")}><span className="brand-mark">N4</span><span><b>日本語挑戦</b><small>JLPT PRACTICE</small></span></button>
          <span className="result-date">実力診断レポート</span>
        </header>
        <section className="result-wrap">
          <div className="result-summary">
            <div className="score-seal">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" pathLength="100" />
                <circle className="score-progress" cx="60" cy="60" r="52" pathLength="100" style={{strokeDasharray:`${percent} 100`}} />
              </svg>
              <span><b>{percent}</b><small>POINT</small></span>
            </div>
            <div>
              <span className="report-kicker">YOUR N4 REPORT</span>
              <h1>{resultTitle}</h1>
              <p>{resultText}</p>
              <div className="score-facts"><span><small>答對</small><b>{score} / {queue.length}</b></span><span><small>未答／答錯</small><b>{mistakes.length}</b></span><span><small>練習目標</small><b>70%</b></span></div>
            </div>
          </div>

          <div className="result-grid">
            <section className="breakdown-card">
              <div className="card-title"><span>01</span><h2>題型表現</h2></div>
              {(["單字・漢字","文法","閱讀"] as Category[]).map(category => {
                const total=queue.filter(q=>q.category===category).length;
                const right=responses.filter(r=>r.correct && queue.find(q=>q.id===r.id)?.category===category).length;
                const value=total ? Math.round(right/total*100) : 0;
                return <div className="skill-row" key={category}><div><b>{category}</b><span>{right}/{total} 題</span></div><div className="skill-track"><i style={{width:`${value}%`}} /></div><strong>{value}%</strong></div>;
              })}
              <p className="result-note">※ 70% 是本站設定的練習目標，並非 JLPT 官方換算分數。</p>
            </section>

            <section className="review-card">
              <div className="card-title"><span>02</span><h2>優先複習</h2></div>
              {mistakes.length===0 ? <div className="perfect-box"><b>満点！</b><p>全部答對了，太厲害了。</p></div> : (
                <div className="review-list">
                  {mistakes.slice(0,4).map(q => <div key={q.id}><span>{q.category}</span><p><b>第 {q.id} 題</b>　{q.prompt.replaceAll("[[","").replaceAll("]]","")}</p><small>正解：{q.options[q.correct]}</small></div>)}
                  {mistakes.length>4 && <p className="more-mistakes">還有 {mistakes.length-4} 題，點「只練錯題」立即複習。</p>}
                </div>
              )}
            </section>
          </div>

          <div className="result-actions">
            <button className="secondary-button" onClick={() => setPhase("home")}>回到首頁</button>
            {mistakes.length>0 && <button className="secondary-button" onClick={() => beginTest(mistakes)}>只練錯題</button>}
            <button className="primary-button result-primary" onClick={() => beginTest()}>再測一次 <span>→</span></button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到首頁"><span className="brand-mark">N4</span><span><b>日本語挑戦</b><small>JLPT PRACTICE</small></span></a>
        <div className="topbar-side">{best!==null && <span className="best-score">個人最佳 <b>{best}</b></span>}<div className="level-pill"><span /> 目標：JLPT N4</div></div>
      </header>
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>きょう</span> 今日の一歩が、合格につながる。</div>
          <h1>準備好了嗎？<br /><em>測出你的 N4 實力。</em></h1>
          <p className="hero-lead">20 道精選題，涵蓋單字、漢字、文法與閱讀。每題都有中文解析，完成後立即看見你的強項與弱點。</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => beginTest()}>開始測驗 <span>→</span></button>
            <span className="time-note"><b>約 25 分鐘</b><small>不需註冊</small></span>
          </div>
          <div className="trust-row"><span><i>✓</i> N4 難度</span><span><i>✓</i> 即時解析</span><span><i>✓</i> 弱點分析</span></div>
        </div>
        <div className="test-ticket" aria-label="測驗資訊卡">
          <div className="ticket-edge">日本語能力試験</div>
          <div className="ticket-body">
            <div className="ticket-top"><span>模擬練習券</span><b>N4</b></div>
            <div className="ticket-title">日本語<br />実力診断</div>
            <div className="ticket-grid"><span><small>問題数</small><b>20</b></span><span><small>目安時間</small><b>25<sup>分</sup></b></span><span><small>練習目標</small><b>70<sup>%</sup></b></span></div>
            <div className="barcode" aria-hidden="true"><span>|||| || | ||| | | ||||</span><small>N4-2026-READY</small></div>
          </div><div className="stamp">合格<br />祈願</div>
        </div>
      </section>
      <section className="overview" aria-label="測驗範圍">
        <div className="section-heading"><div><span>TEST MAP</span><h2>這次會測什麼？</h2></div><p>題目依照 N4 常見能力範圍設計，<br />由基礎到情境應用。</p></div>
        <div className="category-grid">{categoryCards.map((item,index)=><article className={`category-card ${item.tone}`} key={item.kanji}><span className="category-index">0{index+1}</span><div className="kanji-orb">{item.kanji}</div><div><h3>{item.label}</h3><p>{item.meta}・N4 必考範圍</p></div></article>)}</div>
        <div className="overview-cta"><span>準備好了嗎？</span><button onClick={() => beginTest()}>進入 20 題模擬測驗 →</button></div>
      </section>
    </main>
  );
}
