export interface LessonStep {
  number: string;
  period: string;
  title: string;
  body: string;
}

export interface EraLesson {
  brief: string;
  timelineTitle: string;
  steps: LessonStep[];
}

export const lessons: Record<string, EraLesson> = {
  "kingdom-trade": {
    brief:
      "分かれていた島々が一つの王国にまとまり、海を渡る交易で栄えた時代です。人物や年号だけでなく、王権のしくみ、交易の背景、そしてそれを伝える史料の性格まで、一本の流れでつかみましょう。",
    timelineTitle: "三山から王国へ、そして大交易の海へ",
    steps: [
      {
        number: "01",
        period: "〜1429",
        title: "三山時代",
        body: "北山・中山・南山に分かれた按司たちが、各地のグスクを拠点に競い合いました。今帰仁城などのグスクがその時代を伝えます。",
      },
      {
        number: "02",
        period: "1429",
        title: "三山統一",
        body: "尚巴志が三山を統一し、首里城を中心とする琉球王国が成立したと伝えられます。統一の経緯は後代の正史に基づく点にも注意します。",
      },
      {
        number: "03",
        period: "15–16世紀",
        title: "大交易時代",
        body: "進貢貿易を軸に、中国・日本・朝鮮・東南アジアを結ぶ中継貿易で栄えました。久米村の人々が外交・航海を支え、万国津梁の鐘がその気概を伝えます。",
      },
      {
        number: "04",
        period: "1470–1609",
        title: "王権の確立と転機",
        body: "第二尚氏の尚円・尚真が中央集権と文化を整えました。1609年の薩摩侵攻で、王国は次の時代へと向かいます。",
      },
    ],
  },
  "prefecture-war": {
    brief:
      "まずは、制度の変化と人々の暮らしを一本の流れでつかみましょう。読み終えたら、問いの深さを選んでクイズへ進めます。",
    timelineTitle: "王国から県へ、そして戦場へ",
    steps: [
      {
        number: "01",
        period: "〜1872",
        title: "琉球王国",
        body: "中国・日本・東南アジアと交流を重ねた王国の時代。首里城を中心に政治と外交が営まれました。",
      },
      {
        number: "02",
        period: "1872–1879",
        title: "琉球藩",
        body: "明治政府が琉球藩を設置。王国から日本の近代国家へ組み込まれる過程が始まります。",
      },
      {
        number: "03",
        period: "1879–1945",
        title: "沖縄県",
        body: "琉球藩が廃止され沖縄県に。社会の近代化が進む一方、戦時体制が強まりました。",
      },
      {
        number: "04",
        period: "1944–1945",
        title: "戦争と記憶",
        body: "対馬丸などの学童疎開、島田叡や大田實らの戦時行政、沖縄戦を複数の資料から考えます。",
      },
    ],
  },
};

export const lessonFor = (eraId: string): EraLesson | undefined => lessons[eraId];
