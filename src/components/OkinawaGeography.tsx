import coast from '../data/okinawaCoastline.json';

export default function OkinawaGeography() {
  return (
    <figure className="okinawa-geography">
      <svg viewBox="0 0 440 620" role="img" aria-labelledby="okinawa-map-title okinawa-map-desc">
        <title id="okinawa-map-title">沖縄本島と周辺離島・沖縄県全体図</title>
        <desc id="okinawa-map-desc">海岸線データを基に北を上に描画。上は沖縄本島・久米島・慶良間諸島などの拡大図、下は宮古・八重山・大東諸島を含む全体図。上下の縮尺は異なります。</desc>
        <rect x="8" y="8" width="424" height="600" rx="18" fill="#e9edef" stroke="#9da9af" />
        <g fill="#273e4a" fontFamily="sans-serif" fontSize="15">
          <text x="28" y="34" fontWeight="700">沖縄本島と周辺の島々</text>
          <text x="398" y="34">北 ↑</text>
        </g>
        <g fill="#8b9fa5" stroke="#344f5b" strokeWidth="0.75" fillRule="evenodd">
          {coast.main.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="#273e4a" fontFamily="sans-serif" fontSize="14">
          <text x="286" y="169">沖縄本島</text>
          <text x="93" y="117">伊平屋島・伊是名島</text>
          <text x="49" y="307">久米島</text>
          <text x="144" y="352">慶良間諸島</text>
          <text x="249" y="347">那覇</text>
        </g>
        <line x1="24" y1="390" x2="416" y2="390" stroke="#abb8bf" />
        <text x="28" y="414" fontFamily="sans-serif" fontSize="15" fontWeight="700" fill="#273e4a">沖縄県全体図</text>
        <g fill="#6c858e" stroke="#344f5b" strokeWidth="0.45" fillRule="evenodd">
          {coast.all.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="#273e4a" fontFamily="sans-serif" fontSize="13">
          <text x="48" y="482">尖閣諸島</text>
          <text x="45" y="593">八重山諸島</text>
          <text x="132" y="565">宮古諸島</text>
          <text x="225" y="460">沖縄諸島</text>
          <text x="339" y="540">大東諸島</text>
        </g>
      </svg>
      <figcaption>
        北が上／上下の図は縮尺が異なります。海岸線は縮尺に応じた簡略表示です。<br />
        <a href={coast.sourceUrl} target="_blank" rel="noreferrer">国土地理院「地球地図日本」</a>を加工（GeoJSON変換：<a href="https://github.com/dataofjapan/land" target="_blank" rel="noreferrer">dataofjapan</a>）。
      </figcaption>
    </figure>
  );
}
