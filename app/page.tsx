"use client";

import { useEffect, useMemo, useState } from "react";
import { LEVEL_CONFIG, LEVELS, QUESTION_BANKS, type Category, type Level, type Question } from "./questions";

type Response = { id: number; selected: number; correct: boolean };
type Phase = "home" | "quiz" | "result";

const categoryCards = [
  { kanji: "語", label: "單字・漢字", meta: "8 題", tone: "coral" },
  { kanji: "文", label: "文法", meta: "6 題", tone: "gold" },
  { kanji: "読", label: "閱讀", meta: "6 題", tone: "blue" },
];

function MarkedText({ text }: { text: string }) {
  return <>{text.split(/(\[\[.*?\]\])/g).map((part, i) => part.startsWith("[[") ? <u key={i}>{part.slice(2, -2)}</u> : <span key={i}>{part}</span>)}</>;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("home");
  const [level, setLevel] = useState<Level>("N3");
  const [queue, setQueue] = useState<Question[]>(QUESTION_BANKS.N3);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [remaining, setRemaining] = useState(LEVEL_CONFIG.N3.minutes * 60);
  const [best, setBest] = useState<number | null>(null);
  const [attemptMode, setAttemptMode] = useState<"full" | "retry">("full");

  const bank = QUESTION_BANKS[level];
  const config = LEVEL_CONFIG[level];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(`jlpt-best-${level}`);
      setBest(saved === null ? null : Number(saved));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [level]);

  useEffect(() => {
    if (phase !== "quiz") return;
    const timer = window.setInterval(() => setRemaining(value => {
      const next = Math.max(0, value - 1);
      if (next === 0) window.queueMicrotask(() => setPhase("result"));
      return next;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const current = queue[index];
  const score = responses.filter(item => item.correct).length;
  const percent = Math.round((score / queue.length) * 100) || 0;
  const mistakes = useMemo(
    () => queue.filter(question => !responses.find(response => response.id === question.id)?.correct),
    [queue, responses],
  );

  useEffect(() => {
    if (phase !== "result" || attemptMode !== "full") return;
    if (best === null || percent > best) {
      window.queueMicrotask(() => {
        setBest(percent);
        window.localStorage.setItem(`jlpt-best-${level}`, String(percent));
      });
    }
  }, [phase, attemptMode, percent, best, level]);

  function chooseLevel(nextLevel: Level) {
    setLevel(nextLevel);
    setQueue(QUESTION_BANKS[nextLevel]);
    setSelected(null);
  }

  function beginTest(items: Question[] = bank, mode: "full" | "retry" = "full") {
    setQueue(items);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setResponses([]);
    setAttemptMode(mode);
    setRemaining(Math.max(5 * 60, Math.round(config.minutes * 60 * items.length / bank.length)));
    setPhase("quiz");
    window.scrollTo(0, 0);
  }

  function checkAnswer() {
    if (selected === null || revealed) return;
    setResponses(old => [...old, { id: current.id, selected, correct: selected === current.correct }]);
    setRevealed(true);
  }

  function nextQuestion() {
    if (index === queue.length - 1) {
      setPhase("result");
      window.scrollTo(0, 0);
      return;
    }
    setIndex(value => value + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (phase === "quiz") {
    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");
    const progress = ((index + (revealed ? 1 : 0)) / queue.length) * 100;

    return (
      <main className="quiz-shell">
        <header className="quiz-topbar">
          <button className="brand brand-button" onClick={() => setPhase("home")} aria-label="退出測驗並回到首頁">
            <span className="brand-mark">{level}</span><span><b>日本語挑戦</b><small>JLPT PRACTICE</small></span>
          </button>
          <div className="quiz-status">
            <span className="quiz-level">{level}・{config.name}</span>
            <span className="timer" aria-label={`剩餘時間 ${minutes} 分 ${seconds} 秒`}><i>◷</i> {minutes}:{seconds}</span>
            <button className="exit-button" onClick={() => setPhase("home")}>退出測驗</button>
          </div>
        </header>

        <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

        <section className="quiz-stage">
          <aside className="question-rail">
            <span className="rail-label">QUESTION</span>
            <b>{String(index + 1).padStart(2, "0")}</b><small>/ {String(queue.length).padStart(2, "0")}</small>
            <div className="rail-category">{current.category}</div>
            <p>{current.category === "閱讀" ? "先抓主張與轉折，再回題目找依據。" : "看清楚語境，再選最自然的答案。"}</p>
          </aside>

          <div className={`exam-card ${current.passage ? "has-passage" : ""}`}>
            <div className="exam-heading">
              <span>{current.category}</span><b>{level}・第 {current.id} 題</b>
            </div>
            <p className="exam-instruction">{current.instruction}</p>
            {current.passage && <div className="reading-passage">{current.passage.split("\n").map((line, i) => <p key={i}>{line}</p>)}</div>}
            <h1 className="exam-prompt"><MarkedText text={current.prompt} /></h1>
            <div className="exam-options" role="radiogroup" aria-label="答案選項">
              {current.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const isCorrect = revealed && optionIndex === current.correct;
                const isWrong = revealed && isSelected && optionIndex !== current.correct;
                return (
                  <button key={option} role="radio" aria-checked={isSelected} disabled={revealed}
                    className={`${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                    onClick={() => setSelected(optionIndex)}>
                    <span>{String.fromCharCode(65 + optionIndex)}</span><b>{option}</b>{isCorrect && <i>✓</i>}{isWrong && <i>×</i>}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className={`explanation ${selected === current.correct ? "is-correct" : "is-wrong"}`} role="status">
                <span>{selected === current.correct ? "正解" : "要複習"}</span><p>{current.explanation}</p>
              </div>
            )}

            <footer className="exam-footer">
              <span>{revealed ? `目前答對 ${score} 題` : "選擇後再確認答案"}</span>
              {!revealed ? <button className="next-button" disabled={selected === null} onClick={checkAnswer}>確認答案 <i>→</i></button>
                : <button className="next-button" onClick={nextQuestion}>{index === queue.length - 1 ? "查看成績" : "下一題"} <i>→</i></button>}
            </footer>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "result") {
    const resultTitle = percent >= 85 ? "很接近實戰水準！" : percent >= 70 ? "已進入合格練習圈" : percent >= 50 ? "基礎有了，再補幾個弱點" : "先把核心基礎穩住";
    const resultText = percent >= 70 ? `你的 ${level} 能力已經相當完整。接下來針對低分項目複習，離目標會更近。` : `這份 ${level} 結果就是複習地圖。先從正確率最低的題型開始，再回來挑戰。`;

    return (
      <main className="result-shell">
        <header className="quiz-topbar result-topbar">
          <button className="brand brand-button" onClick={() => setPhase("home")}><span className="brand-mark">{level}</span><span><b>日本語挑戦</b><small>JLPT PRACTICE</small></span></button>
          <span className="result-date">{level} 実力診断レポート</span>
        </header>
        <section className="result-wrap">
          <div className="result-summary">
            <div className="score-seal">
              <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" pathLength="100" /><circle className="score-progress" cx="60" cy="60" r="52" pathLength="100" style={{ strokeDasharray: `${percent} 100` }} /></svg>
              <span><b>{percent}</b><small>POINT</small></span>
            </div>
            <div>
              <span className="report-kicker">YOUR {level} REPORT</span><h1>{resultTitle}</h1><p>{resultText}</p>
              <div className="score-facts"><span><small>答對</small><b>{score} / {queue.length}</b></span><span><small>未答／答錯</small><b>{mistakes.length}</b></span><span><small>練習目標</small><b>70%</b></span></div>
            </div>
          </div>

          <div className="result-grid">
            <section className="breakdown-card">
              <div className="card-title"><span>01</span><h2>題型表現</h2></div>
              {(["單字・漢字", "文法", "閱讀"] as Category[]).map(category => {
                const total = queue.filter(question => question.category === category).length;
                const right = responses.filter(response => response.correct && queue.find(question => question.id === response.id)?.category === category).length;
                const value = total ? Math.round(right / total * 100) : 0;
                return <div className="skill-row" key={category}><div><b>{category}</b><span>{right}/{total} 題</span></div><div className="skill-track"><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></div>;
              })}
              <p className="result-note">※ 70% 是本站設定的練習目標，並非 JLPT 官方換算分數。</p>
            </section>

            <section className="review-card">
              <div className="card-title"><span>02</span><h2>優先複習</h2></div>
              {mistakes.length === 0 ? <div className="perfect-box"><b>満点！</b><p>全部答對了，太厲害了。</p></div> : (
                <div className="review-list">
                  {mistakes.slice(0, 4).map(question => <div key={question.id}><span>{question.category}</span><p><b>第 {question.id} 題</b>　{question.prompt.replaceAll("[[", "").replaceAll("]]", "")}</p><small>正解：{question.options[question.correct]}</small></div>)}
                  {mistakes.length > 4 && <p className="more-mistakes">還有 {mistakes.length - 4} 題，點「只練錯題」立即複習。</p>}
                </div>
              )}
            </section>
          </div>

          <div className="result-actions">
            <button className="secondary-button" onClick={() => setPhase("home")}>切換難度</button>
            {mistakes.length > 0 && <button className="secondary-button" onClick={() => beginTest(mistakes, "retry")}>只練錯題</button>}
            <button className="primary-button result-primary" onClick={() => beginTest()}>再測一次 <span>→</span></button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到首頁"><span className="brand-mark">{level}</span><span><b>日本語挑戦</b><small>JLPT PRACTICE</small></span></a>
        <div className="topbar-side">{best !== null && <span className="best-score">{level} 最佳 <b>{best}</b></span>}<div className="level-pill"><span /> 目標：JLPT N3</div></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>LEVEL</span> N3 是推薦目標，也可以從基礎開始。</div>
          <h1>選對難度，<br /><em>一步一步達成 N3。</em></h1>
          <p className="hero-lead">從 N5 到 N1 自由選擇。每級 20 道精選題，涵蓋單字漢字、文法與閱讀，答完立即看見強項與弱點。</p>

          <div className="level-selector" aria-label="選擇 JLPT 難度">
            <div className="level-selector-title"><b>選擇難度</b><span>{config.description}</span></div>
            <div className="level-options">
              {LEVELS.map(item => <button key={item} className={level === item ? "active" : ""} aria-pressed={level === item} onClick={() => chooseLevel(item)}>{item === "N3" && <small>推薦</small>}<b>{item}</b><span>{LEVEL_CONFIG[item].name}</span></button>)}
            </div>
          </div>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => beginTest()}>開始 {level} 測驗 <span>→</span></button>
            <span className="time-note"><b>約 {config.minutes} 分鐘</b><small>公開使用・不需登入</small></span>
          </div>
          <div className="trust-row"><span><i>✓</i> N5～N1</span><span><i>✓</i> 即時解析</span><span><i>✓</i> 分級成績</span></div>
        </div>

        <div className="test-ticket" aria-label={`${level} 測驗資訊卡`}>
          <div className="ticket-edge">日本語能力試験</div>
          <div className="ticket-body">
            <div className="ticket-top"><span>{config.name}模擬練習券</span><b>{level}</b></div>
            <div className="ticket-title">日本語<br />実力診断</div><div className="ticket-focus">{config.focus}</div>
            <div className="ticket-grid"><span><small>問題数</small><b>20</b></span><span><small>目安時間</small><b>{config.minutes}<sup>分</sup></b></span><span><small>練習目標</small><b>70<sup>%</sup></b></span></div>
            <div className="barcode" aria-hidden="true"><span>|||| || | ||| | | ||||</span><small>{level}-2026-READY</small></div>
          </div><div className="stamp">目標<br />N3</div>
        </div>
      </section>

      <section className="overview" aria-label="測驗範圍">
        <div className="section-heading"><div><span>{level} TEST MAP</span><h2>{level} 會測什麼？</h2></div><p>題目依照 {level} 對應能力設計，<br />從詞彙理解到情境應用。</p></div>
        <div className="category-grid">{categoryCards.map((item, cardIndex) => <article className={`category-card ${item.tone}`} key={item.kanji}><span className="category-index">0{cardIndex + 1}</span><div className="kanji-orb">{item.kanji}</div><div><h3>{item.label}</h3><p>{item.meta}・{level} 對應範圍</p></div></article>)}</div>
        <div className="overview-cta"><span>現在選擇：<b>{level}・{config.name}</b></span><button onClick={() => beginTest()}>進入 20 題模擬測驗 →</button></div>
      </section>
    </main>
  );
}
