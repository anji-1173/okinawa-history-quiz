import { lazy, Suspense, useEffect, useState, type CSSProperties, type ReactElement } from "react";
import QuizExperience from "./components/QuizExperience";
import { difficultyMeta, eras } from "./data/eras";
import { lessonFor } from "./data/lessons";
import { questions } from "./data/questions";
import { sources } from "./data/sources";
import { readResults } from "./lib/progress";
import type { Difficulty, QuizResult } from "./types";

type View = "home" | "journey" | "lesson" | "quiz" | "map" | "sources";

const difficulties = Object.keys(difficultyMeta) as Difficulty[];
const availableEras = eras.filter((era) => era.status === "available");
const firstAvailableEraId = availableEras[0]?.id ?? eras[0].id;
const flagshipEraId = "prefecture-war";
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

function OkinawaEmblem() {
  const waves: ReactElement[] = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const cx = col * 44 + (row % 2 ? 22 : 0) - 22;
      const cy = 336 + row * 18;
      [21, 14, 7].forEach((radius, i) => {
        waves.push(
          <path
            key={`${row}-${col}-${i}`}
            d={`M${cx - radius},${cy} A${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          />,
        );
      });
    }
  }
  const island =
    "M250,96 C270,124 296,156 308,200 C319,236 320,256 310,278 C298,306 288,322 270,340 " +
    "C258,352 249,356 243,347 C235,334 240,320 231,307 C221,292 205,297 197,282 C189,268 202,251 195,237 " +
    "C188,223 170,224 157,211 C145,199 150,187 167,184 C184,181 197,196 209,189 C221,182 214,158 221,138 " +
    "C227,120 236,106 250,96 Z";
  return (
    <svg className="hero__emblem" viewBox="0 0 440 520" aria-hidden="true">
      <defs>
        <radialGradient id="emblem-sea" cx="50%" cy="40%" r="66%">
          <stop offset="0%" stopColor="#f2ebdc" />
          <stop offset="100%" stopColor="#ddd3bf" />
        </radialGradient>
        <clipPath id="emblem-disc">
          <circle cx="220" cy="250" r="196" />
        </clipPath>
      </defs>
      <g clipPath="url(#emblem-disc)">
        <rect x="0" y="0" width="440" height="520" fill="url(#emblem-sea)" />
        <g className="hero__waves" fill="none" stroke="rgba(31,111,139,.32)" strokeWidth="1.3">
          {waves}
        </g>
        <path className="hero__island" d={island} />
        <path className="hero__coast" d={island} />
        <g className="hero__pins">
          <circle cx="250" cy="132" r="7" />
          <circle cx="268" cy="230" r="7" />
          <circle cx="234" cy="308" r="7" />
        </g>
      </g>
      <circle className="hero__ring hero__ring--faint" cx="220" cy="250" r="208" />
      <circle className="hero__ring" cx="220" cy="250" r="196" />
      <g className="hero__ticks">
        <line x1="220" y1="46" x2="220" y2="62" />
        <line x1="220" y1="438" x2="220" y2="454" />
        <line x1="16" y1="250" x2="32" y2="250" />
        <line x1="408" y1="250" x2="424" y2="250" />
      </g>
      <g className="hero__compass">
        <text x="220" y="40" textAnchor="middle">北</text>
      </g>
      <g className="hero__seal-mark">
        <circle cx="356" cy="392" r="30" />
        <text x="356" y="402" textAnchor="middle">琉</text>
      </g>
    </svg>
  );
}

export default function App() {
  const [view, setView] = useState<View>(() => {
    const hash = window.location.hash.replace("#", "");
    return hash === "journey" || hash === "map" || hash === "sources" ? hash : "home";
  });
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [activeEraId, setActiveEraId] = useState<string>(firstAvailableEraId);
  const [results, setResults] = useState<Partial<Record<Difficulty, QuizResult>>>(() => readResults());
  const [initialPlaceId, setInitialPlaceId] = useState<string | undefined>();

  const activeEra = eras.find((era) => era.id === activeEraId) ?? eras[0];
  const activeLesson = lessonFor(activeEraId);
  const publishedQuestions = questions.length;

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

  const startQuiz = (nextDifficulty: Difficulty, eraId: string = activeEraId) => {
    setActiveEraId(eraId);
    setDifficulty(nextDifficulty);
    setView("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openLesson = (eraId: string) => {
    setActiveEraId(eraId);
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
        {view === "sources" && <button className="header-return-quiz" type="button" onClick={() => startQuiz(difficulty)}>クイズへ戻る →</button>}
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
            <p>時代を選ぶと、その時代の初級・中級・上級コースへ進めます。公開中の時代から始められます。</p>
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
                    <button className="primary-button journey-card-button" type="button" onClick={() => openLesson(era.id)}>この時代の流れを見る →</button>
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
            <span className="eyebrow">ERA {String(activeEra.number).padStart(2, "0")} · LEARNING BRIEF</span>
            <h1>{activeEra.title}</h1>
            <p>{activeLesson?.brief ?? activeEra.summary}</p>
          </section>
          <section className="lesson-timeline" aria-labelledby="lesson-timeline-title">
            <div className="section-heading"><span className="eyebrow">A SHORT JOURNEY</span><h2 id="lesson-timeline-title">{activeLesson?.timelineTitle ?? "この時代の流れ"}</h2></div>
            <div className="lesson-steps">
              {(activeLesson?.steps ?? [{ number: "01", period: activeEra.years, title: activeEra.title, body: activeEra.summary }]).map((step) => (
                <article key={step.number}><span>{step.number}</span><small>{step.period}</small><h3>{step.title}</h3><p>{step.body}</p></article>
              ))}
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
                <div><strong>{publishedQuestions}</strong><span>問を公開</span></div>
                <div><strong>23</strong><span>の歴史地点</span></div>
              </div>
            </div>
            <div className="hero__visual" aria-hidden="true">
              <OkinawaEmblem />
            </div>
          </section>

          <section className="journey-section" id="journey" aria-labelledby="journey-title">
            <div className="section-heading">
              <span className="eyebrow">THE EIGHT ERAS</span>
              <h2 id="journey-title">八つの時代を、一本の物語に。</h2>
              <p>公開中の時代から挑戦できます。残る時代も同じ型で順次追加します。</p>
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
                    <button type="button" onClick={() => startQuiz(item, flagshipEraId)}>
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
          key={`${activeEraId}-${difficulty}`}
          eraId={activeEraId}
          eraTitle={activeEra.title}
          difficulty={difficulty}
          onExit={() => go("journey")}
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
              <h2 id="source-catalog-title">参照した資料</h2>
              <p>最終確認日は資料ごとに記録し、リンク先の更新に合わせて継続確認します。</p>
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
      </footer>
    </div>
  );
}

