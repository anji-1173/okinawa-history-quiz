import SourceLinks from "./SourceLinks";

export default function BowfinComparison() {
  return (
    <section className="comparison-section" aria-labelledby="comparison-title">
      <div className="section-heading section-heading--light">
        <span className="eyebrow">ONE VESSEL, TWO CONTEXTS</span>
        <h2 id="comparison-title">一隻の潜水艦を、二つの資料館から見る</h2>
        <p>
          「日本とハワイはこう考える」と一般化せず、二つの施設が何を使命とし、同じ出来事の何を前面に出しているかを比べます。
        </p>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card--hawaii">
          <span className="comparison-card__location">PEARL HARBOR, HAWAIʻI</span>
          <h3>Pacific Fleet Submarine Museum</h3>
          <p className="comparison-card__lead">米海軍潜水艦部隊の歴史・技術・乗員</p>
          <ul>
            <li>Bowfinを1945年時の姿へ復元した保存艦</li>
            <li>「Pearl Harbor Avenger」と9回の成功した哨戒</li>
            <li>第6哨戒を撃沈量・作戦・表彰の単位で記録</li>
            <li>National Historic Landmarkとして公開</li>
          </ul>
          <SourceLinks sourceIds={["bowfin-main", "bowfin-about", "bowfin-patrol-6", "nps-nhl"]} />
        </article>

        <div className="comparison-bridge" aria-hidden="true">
          <span>比較する</span>
          <svg viewBox="0 0 96 32" role="img">
            <path d="M5 16h86M16 5 5 16l11 11M80 5l11 11-11 11" />
          </svg>
        </div>

        <article className="comparison-card comparison-card--okinawa">
          <span className="comparison-card__location">WAKASA, OKINAWA</span>
          <h3>対馬丸記念館</h3>
          <p className="comparison-card__lead">学童疎開・民間被害・生存者と遺族の記憶</p>
          <ul>
            <li>那覇港で乗船を待った子どもたちの経験</li>
            <li>追跡、撃沈、漂流、救助の経過</li>
            <li>犠牲者を氏名判明者数として慎重に記載</li>
            <li>事件後の箝口令と記憶の継承</li>
          </ul>
          <SourceLinks sourceIds={["tsushima-memorial", "archives-tsushima"]} />
        </article>
      </div>

      <div className="comparison-question">
        <span>問い</span>
        <p>
          作戦記録の「撃沈トン数」と、記念館の「氏名判明者数」。同じ事件を表す二つの数字は、誰を主語にしているでしょう？
        </p>
      </div>
    </section>
  );
}
