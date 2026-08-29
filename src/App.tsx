import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react";
import QuizExperience from "./components/QuizExperience";
import { difficultyMeta, eras } from "./data/eras";
import { sources } from "./data/sources";
import { readResults } from "./lib/progress";
import type { Difficulty, QuizResult } from "./types";

type View = "home" | "journey" | "lesson" | "quiz" | "map" | "sources";

const difficulties = Object.keys(difficultyMeta) as Difficulty[];
const HistoryMap = lazy(() => import("./components/HistoryMap"));

function WaveMark() {
  return (
    <svg className="wave-mark" viewBox="0 0 54 40" aria-hidden="true">
      <path d="M2 20c7-8 13-8 20 0s13 8 20 0 10-8 10-8" />
      <path d="M2 31c7-8 13-8 20 0s13 8 20 0 10-8 10-8" />
      <circle cx="11" cy="7" r="4" />
    </svg>
  );
}

export default function App() {
  const [view, setView] = useState<View>(() => {
    const hash = window.location.hash.replace("#", "");
    return hash === "journey" || hash === "map" || hash === "sources" ? hash : "home";
  });
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [results, setResults] = useState<Partial<Record<Difficulty, QuizResult>>>(() => readResults());
  const [initialPlaceId, setInitialPlaceId] = useState<string | undefined>();

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "home" || hash === "journey" || hash === "map" || hash === "sources") setView(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const go = (nextView: Exclude<View, "quiz">) => {
    setView(nextView);
    setInitialPlaceId(undefined);
    window.location.hash = nextView;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startQuiz = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    setView("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openLesson = () => {
    setView("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMap = (placeId: string) => {
    setInitialPlaceId(placeId);
    setView("map");
    window.location.hash = "map";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completedCourses = difficulties.filter((item) => results[item]).length;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => go("home")} aria-label="ホームへ戻る">
          <WaveMark />
          <span>
            <strong>しまの記憶</strong>
            <small>沖縄歴史クイズ</small>
          </span>
        </button>
        <nav aria-label="メインメニュー">
          <button type="button" aria-current={view === "home" || view === "journey" ? "page" : undefined} onClick={() => go("journey")}>
            時代を学ぶ
          </button>
          <button type="button" aria-current={view === "map" ? "page" : undefined} onClick={() => go("map")}>
            歴史マップ
          </button>
          <button type="button" aria-current={view === "sources" ? "page" : undefined} onClick={() => go("sources")}>
            出典・方針
          </button>
        </nav>
        <button className="header-progress" type="button" onClick={() => go("home")}>
          <span>{completedCourses}</span> / 3 コース
        </button>
      </header>

      {view === "journey" && (
        <main id="main-content" className="journey-picker-page">
          <button className="text-button" type="button" onClick={() => go("home")}>← ホームへ戻る</button>
          <section className="journey-picker-intro">
            <span className="eyebrow">THE EIGHT ERAS</span>
            <h1>学びたい時代を選ぶ</h1>
            <p>時代を選ぶと、その時代の初級・中級・上級コースへ進めます。現在は第3時代を公開中です。</p>
          </section>
          <div className="era-picker-list">
            {eras.map((era) => (
              <article className={`era-picker-card ${era.status === "available" ? "era-picker-card--available" : ""}`} key={era.id}>
                <div className="era-card__number" style={{ borderColor: era.accent, color: era.accent }}>{String(era.number).padStart(2, "0")}</div>
                <div>
                  <span className="era-card__years">{era.years}</span>
                  <h2>{era.title}</h2>
                  <p>{era.summary}</p>
                  {era.status === "available" ? (
                    <button className="primary-button journey-card-button" type="button" onClick={openLesson}>この時代の流れを見る →</button>
                  ) : <span className="status-pill">準備中</span>}
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {view === "lesson" && (
        <main id="main-content" className="lesson-page">
          <button className="text-button" type="button" onClick={() => go("journey")}>← 時代を選び直す</button>
          <section className="lesson-hero">
            <span className="eyebrow">ERA 03 · LEARNING BRIEF</span>
            <h1>沖縄県の成立から沖縄戦</h1>
            <p>まずは、制度の変化と人々の暮らしを一本の流れでつかみましょう。読み終えたら、問いの深さを選んでクイズへ進めます。</p>
          </section>
          <section className="lesson-timeline" aria-labelledby="lesson-timeline-title">
            <div className="section-heading"><span className="eyebrow">A SHORT JOURNEY</span><h2 id="lesson-timeline-title">王国から県へ、そして戦場へ</h2></div>
            <div className="lesson-steps">
              <article><span>01</span><small>〜1872</small><h3>琉球王国</h3><p>中国・日本・東南アジアと交流を重ねた王国の時代。首里城を中心に政治と外交が営まれました。</p></article>
              <article><span>02</span><small>1872–1879</small><h3>琉球藩</h3><p>明治政府が琉球藩を設置。王国から日本の近代国家へ組み込まれる過程が始まります。</p></article>
              <article><span>03</span><small>1879–1945</small><h3>沖縄県</h3><p>琉球藩が廃止され沖縄県に。社会の近代化が進む一方、戦時体制が強まりました。</p></article>
              <article><span>04</span><small>1944–1945</small><h3>戦争と記憶</h3><p>対馬丸などの学童疎開、島田叡や大田實らの戦時行政、沖縄戦を複数の資料から考えます。</p></article>
            </div>
          </section>
          <section className="lesson-cta" aria-labelledby="lesson-cta-title">
            <span className="eyebrow">READY FOR A QUIZ?</span><h2 id="lesson-cta-title">問いの深さを選ぶ</h2><p>導入を踏まえて、あなたに合うコースから始めましょう。</p>
            <div className="difficulty-picker" aria-label="難易度">
              {difficulties.map((item) => <button key={item} type="button" onClick={() => startQuiz(item)}>{difficultyMeta[item].label}<span>{difficultyMeta[item].description}</span></button>)}
            </div>
          </section>
        </main>
      )}

      {view === "home" && (
        <main id="main-content">
          <section className="hero">
            <div className="hero__texture" aria-hidden="true" />
            <div className="hero__content">
              <span className="eyebrow">OKINAWA HISTORY, IN CONTEXT</span>
              <h1>
                島の記憶を、
                <em>問い</em>からたどる。
              </h1>
              <p>
                琉球王国から現代まで。年号を覚えるだけでなく、出来事の背景、人々の選択、場所に残る記憶をクイズと地図で結びます。
              </p>
              <div className="hero__actions">
                <button className="primary-button" type="button" onClick={() => go("journey")}>時代の旅を始める</button>
                <button className="ghost-button" type="button" onClick={() => go("map")}>
                  地図から探す
                </button>
              </div>
              <div className="hero__facts" aria-label="初版の収録内容">
                <div><strong>8</strong><span>つの時代</span></div>
                <div><strong>30</strong><span>問を先行公開</span></div>
                <div><strong>23</strong><span>の歴史地点</span></div>
              </div>
            </div>
            <div className="hero__visual" aria-hidden="true">
              <div className="island-shape">
                <span className="island-shape__pin island-shape__pin--1" />
                <span className="island-shape__pin island-shape__pin--2" />
                <span className="island-shape__pin island-shape__pin--3" />
                <span className="island-shape__pin island-shape__pin--4" />
              </div>
              <div className="hero__seal">LEARN<br />WITH<br />SOURCES</div>
            </div>
          </section>

          <section className="journey-section" id="journey" aria-labelledby="journey-title">
            <div className="section-heading">
              <span className="eyebrow">THE EIGHT ERAS</span>
              <h2 id="journey-title">八つの時代を、一本の物語に。</h2>
              <p>まず「沖縄県の成立から沖縄戦」の30問を公開。残る時代も同じ型で順次追加します。</p>
            </div>

            <div className="era-timeline">
              {eras.map((era) => (
                <article className={`era-card ${era.status === "available" ? "era-card--available" : ""}`} key={era.id}>
                  <div className="era-card__number" style={{ borderColor: era.accent, color: era.accent }}>
                    {String(era.number).padStart(2, "0")}
                  </div>
                  <div className="era-card__body">
                    <span className="era-card__years">{era.years}</span>
                    <h3>{era.title}</h3>
                    <p>{era.summary}</p>
                    {era.status === "available" ? (
                      <span className="status-pill status-pill--available">30問 公開中</span>
                    ) : (
                      <span className="status-pill">準備中</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="course-section" aria-labelledby="course-title">
            <div className="course-section__intro">
              <span className="eyebrow">NOW AVAILABLE</span>
              <h2 id="course-title">第3時代｜沖縄県の成立から沖縄戦</h2>
              <p>
                島田叡、大田實、対馬丸・和浦丸・暁空丸、USS Bowfinを含む30問。難易度ごとに問いの深さが変わります。
              </p>
              <button className="text-link" type="button" onClick={() => openMap("navy-underground-hq")}>
                この時代を地図で見る →
              </button>
            </div>

            <div className="course-grid">
              {difficulties.map((item, index) => {
                const meta = difficultyMeta[item];
                const result = results[item];
                return (
                  <article className="course-card" key={item} style={{ "--course-color": meta.color } as CSSProperties}>
                    <div className="course-card__topline">
                      <span>0{index + 1}</span>
                      {result ? <strong>最高 {result.score} / 10</strong> : <strong>約6分</strong>}
                    </div>
                    <h3>{meta.label}</h3>
                    <p>{meta.description}</p>
                    <span className="course-card__focus">{meta.focus}</span>
                    <button type="button" onClick={() => startQuiz(item)}>
                      {result ? "もう一度学ぶ" : "10問を始める"}<span aria-hidden="true">→</span>
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="map-teaser">
            <div className="map-teaser__line" aria-hidden="true" />
            <div>
              <span className="eyebrow">EXPLORE THE PLACES</span>
              <h2>グスクも、壕も、海の上の記憶も。</h2>
              <p>
                世界遺産9資産と戦争遺跡・慰霊施設をマーカーで整理。対馬丸の航路から真珠湾のBowfinへ、同じ出来事の異なる伝え方を比較できます。
              </p>
              <button className="primary-button" type="button" onClick={() => go("map")}>歴史マップを開く</button>
            </div>
            <div className="map-teaser__legend" aria-hidden="true">
              <span className="legend-dot legend-dot--heritage">城</span>
              <span className="legend-dot legend-dot--war">壕</span>
              <span className="legend-dot legend-dot--route">航</span>
              <span className="legend-dot legend-dot--museum">資</span>
            </div>
          </section>
        </main>
      )}

      {view === "quiz" && (
        <QuizExperience
          key={difficulty}
          difficulty={difficulty}
          onExit={() => go("home")}
          onOpenMap={openMap}
          onComplete={setResults}
        />
      )}

      {view === "map" && (
        <Suspense fallback={<main id="main-content" className="loading-page">歴史マップを読み込んでいます…</main>}>
          <HistoryMap initialPlaceId={initialPlaceId} />
        </Suspense>
      )}

      {view === "sources" && (
        <main id="main-content" className="sources-page">
          <section className="sources-intro">
            <span className="eyebrow">EDITORIAL POLICY</span>
            <h1>出典をたどれる学びに。</h1>
            <p>
              事実・解釈・当事者の立場を分け、すべての問題に公的資料または施設の公式資料を紐づけます。戦争や犠牲を、派手な演出や速さの競争にしません。
            </p>
            <div className="sources-intro__actions">
              <button className="primary-button" type="button" onClick={() => startQuiz(difficulty)}>クイズへ戻る →</button>
              <button className="text-button" type="button" onClick={() => go("journey")}>時代選択へ戻る</button>
            </div>
          </section>
          <section className="policy-grid" aria-label="編集方針">
            <article><span>01</span><h2>一問一義</h2><p>条件不足で複数正解になる問題を避け、解説で背景と限界を補います。</p></article>
            <article><span>02</span><h2>複数の立場</h2><p>行政・軍・住民・攻撃側・記憶施設の資料を、目的の違いとともに比較します。</p></article>
            <article><span>03</span><h2>安全と敬意</h2><p>立入禁止の壕へ誘導せず、慰霊地をスタンプやランキングの対象にしません。</p></article>
          </section>
          <section className="source-catalog" aria-labelledby="source-catalog-title">
            <div className="section-heading">
              <span className="eyebrow">SOURCE CATALOG</span>
              <h2 id="source-catalog-title">初版で参照した資料</h2>
              <p>最終確認日はいずれも2026年8月29日です。リンク先の更新に合わせて継続確認します。</p>
            </div>
            <div className="source-catalog__grid">
              {sources.map((source) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.organization}</span>
                  <strong>{source.title}</strong>
                  <small>資料を開く ↗</small>
                </a>
              ))}
            </div>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <div className="brand brand--footer"><WaveMark /><span><strong>しまの記憶</strong><small>沖縄歴史クイズ</small></span></div>
        <p>史実の訂正や資料の追加提案は、GitHubリポジトリで受け付けます。</p>
        <a href="https://github.com/anji-1173/okinawa-history-quiz" target="_blank" rel="noreferrer">GitHub ↗</a>
      </footer>
    </div>
  );
}

