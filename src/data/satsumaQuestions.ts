import type { Question } from '../types';

export const satsumaQuestions: Question[] = [
  {
    id: 'satsuma-b01', eraId: 'satsuma-era', difficulty: 'beginner', theme: '薩摩の侵攻',
    prompt: '薩摩の島津氏が琉球に侵攻し、王国の対外関係が大きく変わったのは何年でしょう？',
    choices: ['1592年', '1609年', '1634年', '1650年'], correctIndex: 1,
    explanation: '侵攻は1609年です。1592年は豊臣秀吉の朝鮮出兵、1634年は琉球使節の江戸上りが始まった年、1650年は琉球の正史『中山世鑑』が成立した年に当たります。近い時代の出来事を区別しましょう。',
    sourceIds: ['okinawa-library-chronology'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b02', eraId: 'satsuma-era', difficulty: 'beginner', theme: '王国と薩摩',
    prompt: '1609年の侵攻を行った薩摩の大名家はどれでしょう？',
    choices: ['対馬の宗氏', '平戸の松浦氏', '佐賀の鍋島氏', '薩摩の島津氏'], correctIndex: 3,
    explanation: '侵攻を行ったのは島津氏です。選択肢はいずれも九州やその周辺で対外交流と関わりを持った大名家ですが、琉球への侵攻を担った家と混同しないことが大切です。',
    sourceIds: ['okinawa-library-chronology'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b03', eraId: 'satsuma-era', difficulty: 'beginner', theme: '侵攻後の外交',
    prompt: '薩摩侵攻後の琉球王国の立場として、適切なのはどれでしょう？',
    choices: ['薩摩の支配を受けながら、中国との冊封関係も続けた', '薩摩の支配を受け、中国との冊封関係を直ちに終えた', '中国の冊封関係を続け、薩摩との政治関係を解消した', '中国との冊封関係を終え、幕府が国王を冊封する制度に移った'], correctIndex: 0,
    explanation: '侵攻後も王国の体制と中国との冊封関係は続きました。一方で薩摩の実質的な支配も受け、日本の幕藩体制に組み込まれました。中国か日本かの一方だけでは説明できない関係です。',
    sourceIds: ['bunka-ryukyu-dance'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b04', eraId: 'satsuma-era', difficulty: 'beginner', theme: '江戸上り',
    prompt: '徳川将軍の代替わりを祝うために琉球から派遣された使節を、何と呼ぶでしょう？',
    choices: ['謝恩使', '進貢使', '慶賀使', '冊封使'], correctIndex: 2,
    explanation: '将軍の代替わりを祝うのは慶賀使です。琉球国王の代替わりに派遣された謝恩使と区別します。冊封使は中国皇帝が琉球に派遣する使者で、向かう方向も役割も異なります。',
    sourceIds: ['bunka-ryukyu-dance', 'nt-kumiodori'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b05', eraId: 'satsuma-era', difficulty: 'beginner', theme: '冊封と芸能',
    prompt: '1719年に初演された組踊は、主に誰をもてなすために創作されたでしょう？',
    choices: ['江戸幕府からの巡見使', '中国皇帝からの冊封使', '薩摩からの在番奉行', '琉球から江戸へ向かう慶賀使'], correctIndex: 1,
    explanation: '組踊は冊封使を歓待するため、首里王府の命により創作されました。1719年、尚敬王の冊封儀礼に際して初演されています。外交儀礼と宮廷芸能が結びついていたことが分かります。',
    sourceIds: ['nt-kumiodori'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b06', eraId: 'satsuma-era', difficulty: 'beginner', theme: '組踊の創始者',
    prompt: '踊奉行として組踊を創始した人物は誰でしょう？',
    choices: ['玉城朝薫', '平敷屋朝敏', '蔡温', '羽地朝秀'], correctIndex: 0,
    explanation: '組踊の創始者は玉城朝薫です。琉球の芸能や故事を土台に、薩摩や江戸で見聞した能・歌舞伎、中国戯曲などから着想を得ました。外からの文化をそのまま移すのではなく、独自の芸能を生み出しています。',
    sourceIds: ['nt-kumiodori'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b07', eraId: 'satsuma-era', difficulty: 'beginner', theme: '外交と庭園',
    prompt: '1799年に造営され、翌年には冊封使の接待にも使われた王家の別邸はどこでしょう？',
    choices: ['玉陵', '園比屋武御嶽', '御茶屋御殿（東苑）', '識名園（南苑）'], correctIndex: 3,
    explanation: '識名園です。御茶屋御殿も王家の別邸ですが、1677年に首里の東側に造られた東苑です。識名園は首里城の南にある南苑で、王家の保養と外国使臣の接待に使われました。',
    sourceIds: ['naha-shikinaen'], relatedPlaceIds: ['shikinaen'],
  },
  {
    id: 'satsuma-b08', eraId: 'satsuma-era', difficulty: 'beginner', theme: '明治政府との関係',
    prompt: '1872年、明治政府が琉球国王・尚泰を藩王として設けたのはどれでしょう？',
    choices: ['鹿児島県', '沖縄県', '琉球藩', '琉球政府'], correctIndex: 2,
    explanation: '1872年に設けられたのは琉球藩です。沖縄県の設置は1879年で、両者には7年の隔たりがあります。王国から県への変化は、一度の制度変更で完了したわけではありません。',
    sourceIds: ['okinawa-library-chronology', 'archives-1879'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b09', eraId: 'satsuma-era', difficulty: 'beginner', theme: '王国末期の人物',
    prompt: '琉球王国最後の国王で、明治政府により琉球藩王とされた人物は誰でしょう？',
    choices: ['尚泰', '尚寧', '尚敬', '尚育'], correctIndex: 0,
    explanation: '最後の国王は尚泰です。尚寧は1609年の侵攻時の国王、尚敬は1719年の組踊初演時の国王、尚育は尚泰の前の国王です。同じ尚氏の国王でも、生きた時代が異なります。',
    sourceIds: ['okinawa-library-chronology', 'archives-1879', 'nt-kumiodori'], relatedPlaceIds: ['shuri-castle'],
  },
  {
    id: 'satsuma-b10', eraId: 'satsuma-era', difficulty: 'beginner', theme: '時代の順序',
    prompt: '次の出来事を古い順に並べたものはどれでしょう？',
    choices: ['組踊の初演 → 薩摩侵攻 → 琉球藩設置 → 沖縄県設置', '薩摩侵攻 → 組踊の初演 → 琉球藩設置 → 沖縄県設置', '薩摩侵攻 → 琉球藩設置 → 組踊の初演 → 沖縄県設置', '薩摩侵攻 → 組踊の初演 → 沖縄県設置 → 琉球藩設置'], correctIndex: 1,
    explanation: '1609年の薩摩侵攻、1719年の組踊初演、1872年の琉球藩設置、1879年の沖縄県設置という順序です。侵攻後も約260年にわたり王国の制度と文化が続いたことを、年表で確かめましょう。',
    sourceIds: ['okinawa-library-chronology', 'nt-kumiodori', 'archives-1879'], relatedPlaceIds: ['shuri-castle'],
  },
];
