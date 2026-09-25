import type { Question } from "../types";

export const reversionQuestions: Question[] = [
  {
    id: "rev-b01", eraId: "reversion", difficulty: "beginner", theme: "復帰の日",
    prompt: "沖縄が日本に復帰した日はいつでしょう？",
    choices: ["1971年6月17日", "1972年5月15日", "1975年7月20日", "1978年7月30日"], correctIndex: 1,
    explanation: "1972年5月15日です。返還協定の調印、海洋博の開幕、交通方法の変更とは別の出来事です。",
    sourceIds: ["archives-reversion-road"], relatedPlaceIds: [],
  },
  {
    id: "rev-b02", eraId: "reversion", difficulty: "beginner", theme: "県政の開始",
    prompt: "復帰に伴い、地方自治法に基づく地方公共団体として新たな歩みを始めたのはどれでしょう？",
    choices: ["沖縄群島政府", "琉球列島米国民政府", "沖縄民政府", "沖縄県"], correctIndex: 3,
    explanation: "沖縄県として県政が始まりました。1879年の県設置と、戦後の米国統治を経た1972年の復帰を区別しましょう。",
    sourceIds: ["archives-reversion-road"], relatedPlaceIds: [],
  },
  {
    id: "rev-b03", eraId: "reversion", difficulty: "beginner", theme: "行政主席から知事へ",
    prompt: "復帰の日、行政主席から沖縄県知事となった人物は誰でしょう？",
    choices: ["屋良朝苗", "松岡政保", "平良幸市", "西銘順治"], correctIndex: 0,
    explanation: "屋良朝苗です。本人の日誌にも、主席から県知事となったことが記されています。",
    sourceIds: ["archives-reversion-ceremony"], relatedPlaceIds: [],
  },
  {
    id: "rev-b04", eraId: "reversion", difficulty: "beginner", theme: "通貨の切替",
    prompt: "1972年の復帰時、沖縄の通貨はどのように切り替わったでしょう？",
    choices: ["B円から日本円へ", "日本円から米ドルへ", "米ドルから日本円へ", "B円から米ドルへ"], correctIndex: 2,
    explanation: "復帰時は米ドルから日本円への切替です。B円から米ドルへの切替は1958年でした。",
    sourceIds: ["archives-reversion-road", "archives-postwar-events"], relatedPlaceIds: [],
  },
  {
    id: "rev-b05", eraId: "reversion", difficulty: "beginner", theme: "交換レート",
    prompt: "復帰時の通貨交換で決められた、1米ドル当たりの交換レートはいくらでしょう？",
    choices: ["120円", "305円", "360円", "308円"], correctIndex: 1,
    explanation: "交換レートは1ドル＝305円でした。旧来の360円という水準とは異なり、差損補償なども課題になりました。これは当時の交換条件です。",
    sourceIds: ["archives-reversion-road"], relatedPlaceIds: [],
  },
  {
    id: "rev-b06", eraId: "reversion", difficulty: "beginner", theme: "議会の移行",
    prompt: "復帰時、琉球政府の立法院議員は何の議員とみなされたでしょう？",
    choices: ["衆議院議員", "参議院議員", "那覇市議会議員", "沖縄県議会議員"], correctIndex: 3,
    explanation: "県議会議員とみなされました。復帰当日にも県議会が開かれ、県政に必要な予算や条例を扱いました。",
    sourceIds: ["archives-reversion-road"], relatedPlaceIds: [],
  },
  {
    id: "rev-b07", eraId: "reversion", difficulty: "beginner", theme: "すぐには変わらなかった交通",
    prompt: "復帰直後の1972年、沖縄の車両の通行方向はどうなっていたでしょう？",
    choices: ["右側通行が続いていた", "復帰当日から左側通行だった", "本島だけ左側通行になった", "昼は左側、夜は右側通行だった"], correctIndex: 0,
    explanation: "車両の右側通行は復帰後も続きました。左側通行への変更は1978年7月30日の「730」です。制度の切替日は一律ではありません。",
    sourceIds: ["archives-730"], relatedPlaceIds: [],
  },
  {
    id: "rev-b08", eraId: "reversion", difficulty: "beginner", theme: "本土との往来",
    prompt: "復帰後、本土から沖縄を訪れる人の手続きに起きた変化はどれでしょう？",
    choices: ["米国民政府への申請窓口が東京に移った", "立法院発行の許可証が必要になった", "従来の沖縄への入域手続きがなくなった", "米ドルの所持が入域の条件になった"], correctIndex: 2,
    explanation: "入域手続きや日本円の持出し制限がなくなりました。移動条件の変化は、観光客の増加を考える手がかりでもあります。",
    sourceIds: ["archives-tourism-history"], relatedPlaceIds: [],
  },
  {
    id: "rev-b09", eraId: "reversion", difficulty: "beginner", theme: "復帰記念事業",
    prompt: "1975年、日本復帰の記念事業として沖縄で開催された博覧会はどれでしょう？",
    choices: ["日本万国博覧会（大阪万博）", "沖縄国際海洋博覧会", "国際科学技術博覧会（つくば科学万博）", "国際花と緑の博覧会（花の万博）"], correctIndex: 1,
    explanation: "沖縄国際海洋博覧会です。交通網や観光の整備にも関わり、次の時代「海洋博と観光・振興」につながります。",
    sourceIds: ["archives-tourism-history"], relatedPlaceIds: [],
  },
  {
    id: "rev-b10", eraId: "reversion", difficulty: "beginner", theme: "復帰後も残った課題",
    prompt: "1972年の復帰と沖縄の米軍基地の関係として正しいのはどれでしょう？",
    choices: ["施政権返還と同時に基地はすべて返還された", "基地の存続中は日本復帰が延期された", "基地は琉球政府が引き続き統治する地域になった", "日本に復帰しても米軍基地は残った"], correctIndex: 3,
    explanation: "施政権の返還と、基地の解消は同じことではありません。屋良知事も復帰式典で、残された問題に言及しました。",
    sourceIds: ["archives-reversion-ceremony"], relatedPlaceIds: [],
  },
];
