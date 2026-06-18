// 起名字库数据 V2（含笔画、拼音、字义、典故）
// 根据五行和性别推荐合适的名字

export interface NameChar {
  char: string;
  meaning: string;
  wuXing: string;
  strokes: number;
  pinyin: string;
  tone: number;
}

export interface NameSuggestionV2 {
  name: string;
  fullName: string;
  meaning: string;
  wuXing: string;
  strokes: { c1: number; c2: number; total: number };
  pinyin: string;
  rhythm: string;
  source: string;
  isFree: boolean;
}

export const nameCharsByElementV2: Record<string, NameChar[]> = {
  "木": [
    { char: "林", meaning: "草木丛生，繁盛茂密", wuXing: "木", strokes: 8, pinyin: "lin", tone: 2 },
    { char: "森", meaning: "树木众多，繁盛兴旺", wuXing: "木", strokes: 12, pinyin: "sen", tone: 1 },
    { char: "梓", meaning: "良木，喻故乡、人才", wuXing: "木", strokes: 11, pinyin: "zi", tone: 3 },
    { char: "桐", meaning: "梧桐，高洁祥瑞", wuXing: "木", strokes: 10, pinyin: "tong", tone: 2 },
    { char: "楠", meaning: "楠木，珍贵坚贞", wuXing: "木", strokes: 13, pinyin: "nan", tone: 2 },
    { char: "柏", meaning: "柏树，四季常青", wuXing: "木", strokes: 9, pinyin: "bai", tone: 2 },
    { char: "楷", meaning: "楷模，法度正直", wuXing: "木", strokes: 13, pinyin: "kai", tone: 3 },
    { char: "栩", meaning: "生动传神，栩栩如生", wuXing: "木", strokes: 10, pinyin: "xu", tone: 3 },
    { char: "槿", meaning: "木槿花，朝开暮落", wuXing: "木", strokes: 14, pinyin: "jin", tone: 3 },
    { char: "萱", meaning: "忘忧草，母爱象征", wuXing: "木", strokes: 12, pinyin: "xuan", tone: 1 },
    { char: "芷", meaning: "白芷，香草清雅", wuXing: "木", strokes: 7, pinyin: "zhi", tone: 3 },
    { char: "芮", meaning: "初生草木，柔韧", wuXing: "木", strokes: 7, pinyin: "rui", tone: 4 },
    { char: "薇", meaning: "蔷薇，坚强美丽", wuXing: "木", strokes: 16, pinyin: "wei", tone: 1 },
    { char: "枫", meaning: "枫叶，飘逸诗意", wuXing: "木", strokes: 8, pinyin: "feng", tone: 1 },
    { char: "茗", meaning: "茶之雅称，清雅", wuXing: "木", strokes: 9, pinyin: "ming", tone: 2 },
  ],
  "火": [
    { char: "炎", meaning: "光明炽盛，热情", wuXing: "火", strokes: 8, pinyin: "yan", tone: 2 },
    { char: "焱", meaning: "火光闪耀，光华", wuXing: "火", strokes: 12, pinyin: "yan", tone: 4 },
    { char: "烨", meaning: "光辉灿烂，明亮", wuXing: "火", strokes: 10, pinyin: "ye", tone: 4 },
    { char: "灿", meaning: "光彩耀眼，鲜明", wuXing: "火", strokes: 17, pinyin: "can", tone: 4 },
    { char: "炜", meaning: "光明鲜明，炜烨", wuXing: "火", strokes: 13, pinyin: "wei", tone: 3 },
    { char: "熠", meaning: "光耀闪烁，熠熠", wuXing: "火", strokes: 15, pinyin: "yi", tone: 4 },
    { char: "熙", meaning: "光明兴盛，和乐", wuXing: "火", strokes: 14, pinyin: "xi", tone: 1 },
    { char: "煜", meaning: "照耀，光亮璀璨", wuXing: "火", strokes: 13, pinyin: "yu", tone: 4 },
    { char: "晖", meaning: "阳光光辉，春晖", wuXing: "火", strokes: 13, pinyin: "hui", tone: 1 },
    { char: "昭", meaning: "光明美好，昭昭", wuXing: "火", strokes: 9, pinyin: "zhao", tone: 1 },
    { char: "彤", meaning: "红色，热情端庄", wuXing: "火", strokes: 7, pinyin: "tong", tone: 2 },
    { char: "曦", meaning: "晨曦，朝阳温暖", wuXing: "火", strokes: 20, pinyin: "xi", tone: 1 },
    { char: "暖", meaning: "温暖，和煦亲切", wuXing: "火", strokes: 13, pinyin: "nuan", tone: 3 },
    { char: "宁", meaning: "安宁祥和，宁静", wuXing: "火", strokes: 14, pinyin: "ning", tone: 2 },
    { char: "晟", meaning: "光明旺盛，兴盛", wuXing: "火", strokes: 11, pinyin: "sheng", tone: 4 },
  ],
  "土": [
    { char: "坤", meaning: "大地厚德，坤厚载物", wuXing: "土", strokes: 8, pinyin: "kun", tone: 1 },
    { char: "坦", meaning: "平坦宽厚，坦荡", wuXing: "土", strokes: 8, pinyin: "tan", tone: 3 },
    { char: "培", meaning: "培育滋养，栽植", wuXing: "土", strokes: 11, pinyin: "pei", tone: 2 },
    { char: "墨", meaning: "文墨深厚，学问", wuXing: "土", strokes: 15, pinyin: "mo", tone: 4 },
    { char: "城", meaning: "城池坚固，安稳", wuXing: "土", strokes: 10, pinyin: "cheng", tone: 2 },
    { char: "轩", meaning: "气宇轩昂，高远", wuXing: "土", strokes: 10, pinyin: "xuan", tone: 1 },
    { char: "宇", meaning: "宇宙广阔，气度", wuXing: "土", strokes: 6, pinyin: "yu", tone: 3 },
    { char: "安", meaning: "平安安定，安稳", wuXing: "土", strokes: 6, pinyin: "an", tone: 1 },
    { char: "韵", meaning: "韵律和谐，雅致", wuXing: "土", strokes: 19, pinyin: "yun", tone: 4 },
    { char: "怡", meaning: "愉悦和乐，怡然", wuXing: "土", strokes: 9, pinyin: "yi", tone: 2 },
    { char: "岚", meaning: "山间云雾，缥缈", wuXing: "土", strokes: 12, pinyin: "lan", tone: 2 },
    { char: "婉", meaning: "温婉柔美，婉约", wuXing: "土", strokes: 11, pinyin: "wan", tone: 3 },
    { char: "容", meaning: "从容包容，大度", wuXing: "土", strokes: 10, pinyin: "rong", tone: 2 },
    { char: "恩", meaning: "恩惠，感恩", wuXing: "土", strokes: 10, pinyin: "en", tone: 1 },
    { char: "惟", meaning: "思考，唯一", wuXing: "土", strokes: 12, pinyin: "wei", tone: 2 },
  ],
  "金": [
    { char: "鑫", meaning: "财富兴盛，多金", wuXing: "金", strokes: 24, pinyin: "xin", tone: 1 },
    { char: "铭", meaning: "铭记不忘，铭刻", wuXing: "金", strokes: 14, pinyin: "ming", tone: 2 },
    { char: "锦", meaning: "锦绣前程，美好", wuXing: "金", strokes: 16, pinyin: "jin", tone: 3 },
    { char: "钰", meaning: "珍宝美玉，坚硬", wuXing: "金", strokes: 13, pinyin: "yu", tone: 4 },
    { char: "锐", meaning: "锐意进取，锋芒", wuXing: "金", strokes: 15, pinyin: "rui", tone: 4 },
    { char: "铮", meaning: "铁骨铮铮，刚正", wuXing: "金", strokes: 16, pinyin: "zheng", tone: 1 },
    { char: "钧", meaning: "重量权威，雷霆", wuXing: "金", strokes: 12, pinyin: "jun", tone: 1 },
    { char: "瑞", meaning: "祥瑞吉兆，吉祥", wuXing: "金", strokes: 14, pinyin: "rui", tone: 4 },
    { char: "诗", meaning: "诗意美好，文雅", wuXing: "金", strokes: 13, pinyin: "shi", tone: 1 },
    { char: "悦", meaning: "喜悦快乐，欢愉", wuXing: "金", strokes: 11, pinyin: "yue", tone: 4 },
    { char: "舒", meaning: "舒畅从容，舒展", wuXing: "金", strokes: 12, pinyin: "shu", tone: 1 },
    { char: "珊", meaning: "珊瑚珍宝，玲珑", wuXing: "金", strokes: 10, pinyin: "shan", tone: 1 },
    { char: "宸", meaning: "帝王居所，尊贵", wuXing: "金", strokes: 10, pinyin: "chen", tone: 2 },
    { char: "诚", meaning: "诚实诚信，真诚", wuXing: "金", strokes: 14, pinyin: "cheng", tone: 2 },
    { char: "睿", meaning: "睿智通达，明智", wuXing: "金", strokes: 14, pinyin: "rui", tone: 4 },
  ],
  "水": [
    { char: "淼", meaning: "水势浩大，广阔", wuXing: "水", strokes: 12, pinyin: "miao", tone: 3 },
    { char: "涵", meaning: "涵养深厚，包容", wuXing: "水", strokes: 12, pinyin: "han", tone: 2 },
    { char: "泽", meaning: "恩泽润泽，福泽", wuXing: "水", strokes: 17, pinyin: "ze", tone: 2 },
    { char: "润", meaning: "润泽温和，细腻", wuXing: "水", strokes: 16, pinyin: "run", tone: 4 },
    { char: "瀚", meaning: "浩瀚广大，博学", wuXing: "水", strokes: 20, pinyin: "han", tone: 4 },
    { char: "澜", meaning: "波澜壮阔，气势", wuXing: "水", strokes: 21, pinyin: "lan", tone: 2 },
    { char: "澄", meaning: "清澈明净，澄澈", wuXing: "水", strokes: 16, pinyin: "cheng", tone: 2 },
    { char: "渊", meaning: "学识渊博，深邃", wuXing: "水", strokes: 12, pinyin: "yuan", tone: 1 },
    { char: "沛", meaning: "充沛旺盛，精力", wuXing: "水", strokes: 8, pinyin: "pei", tone: 4 },
    { char: "溪", meaning: "溪流清雅，灵动", wuXing: "水", strokes: 14, pinyin: "xi", tone: 1 },
    { char: "洛", meaning: "洛水女神，柔美", wuXing: "水", strokes: 10, pinyin: "luo", tone: 4 },
    { char: "洁", meaning: "纯洁高雅，洁净", wuXing: "水", strokes: 16, pinyin: "jie", tone: 2 },
    { char: "沐", meaning: "沐浴恩泽，润泽", wuXing: "水", strokes: 8, pinyin: "mu", tone: 4 },
    { char: "汐", meaning: "夜潮之水，柔顺", wuXing: "水", strokes: 7, pinyin: "xi", tone: 1 },
    { char: "漪", meaning: "水波涟漪，温柔", wuXing: "水", strokes: 14, pinyin: "yi", tone: 1 },
  ],
};

export const nameSourcesV2: Record<string, string[]> = {
  "诗经": [
    "《诗经·周南》：「窈窕淑女，君子好逑」——喻品貌美好的女子",
    "《诗经·大雅》：「明哲保身，以保其身」——喻明智通达",
    "《诗经·卫风》：「如切如磋，如琢如磨」——喻精益求精",
    "《诗经·小雅》：「高山仰止，景行行止」——喻品德崇高",
    "《诗经·秦风》：「言念君子，温其如玉」——喻温润如玉",
  ],
  "楚辞": [
    "《楚辞·离骚》：「路漫漫其修远兮，吾将上下而求索」——喻追求不息",
    "《楚辞·九歌》：「袅袅兮秋风，洞庭波兮木叶下」——喻诗意盎然",
    "《楚辞·九章》：「余处幽篁兮终不见天」——喻幽雅隐逸",
    "《楚辞·远游》：「悲时俗之迫阨兮，愿轻举而远游」——喻志在远方",
  ],
  "唐诗宋词": [
    "李白《行路难》：「长风破浪会有时，直挂云帆济沧海」——喻志向远大",
    "杜甫《望岳》：「会当凌绝顶，一览众山小」——喻胸怀壮志",
    "王维《终南别业》：「行到水穷处，坐看云起时」——喻随性洒脱",
    "苏轼《水调歌头》：「但愿人长久，千里共婵娟」——喻美好祝愿",
    "辛弃疾《青玉案》：「众里寻他千百度，蓦然回首」——喻执着追求",
  ],
  "论语·大学": [
    "《论语·学而》：「学而时习之，不亦说乎」——喻勤学不倦",
    "《论语·述而》：「三人行，必有我师焉」——喻虚心好学",
    "《大学》：「大学之道，在明明德」——喻光明正大",
    "《中庸》：「博学之，审问之，慎思之」——喻求知精神",
    "《孟子》：「穷则独善其身，达则兼善天下」——喻进退有度",
  ],
};

export function analyzeRhythmV2(pinyins: { pinyin: string; tone: number }[]): string {
  const tones = pinyins.map(p => p.tone);
  const pingZe = tones.map(t => (t <= 2 ? "平" : "仄"));
  const description: string[] = [];

  if (tones[0] === tones[1]) {
    description.push("两字同声调，朗朗上口但略显平淡");
  } else {
    description.push("声调起伏有致，抑扬顿挫");
  }

  if (pingZe[0] === "平" && pingZe[1] === "仄") {
    description.push("平仄搭配得当，节奏感强");
  } else if (pingZe[0] === "仄" && pingZe[1] === "平") {
    description.push("仄起平收，收音清亮");
  } else if (pingZe[0] === "平" && pingZe[1] === "平") {
    description.push("双平声，柔和绵长");
  } else {
    description.push("双仄声，铿锵有力");
  }

  return description.join("；");
}

export function generateNameSuggestionsV2(
  surname: string,
  gender: string,
  missingElements: string[],
  weakElements: string[],
  secondChar: string = "",
  thirdChar: string = "",
): NameSuggestionV2[] {
  const suggestions: NameSuggestionV2[] = [];
  const targetElements = [...missingElements, ...weakElements].slice(0, 3);
  if (targetElements.length === 0) {
    targetElements.push("木", "水", "金");
  }

  const sourceKeys = Object.keys(nameSourcesV2);

  for (let i = 0; i < 16; i++) {
    const element = targetElements[i % targetElements.length] || "木";
    const chars = nameCharsByElementV2[element] || nameCharsByElementV2["木"];
    const c1 = chars[i % chars.length];
    const c2 = chars[(i + 7) % chars.length];
    const sourceKey = sourceKeys[i % sourceKeys.length];
    const sourceTexts = nameSourcesV2[sourceKey];

    const nameStr = c1.char + c2.char;
    const meaning = `${c1.meaning}；${c2.meaning}`;
    const pinyin = `${c1.pinyin}${c1.tone} ${c2.pinyin}${c2.tone}`;
    const strokes = { c1: c1.strokes, c2: c2.strokes, total: c1.strokes + c2.strokes };
    const rhythm = analyzeRhythmV2([
      { pinyin: c1.pinyin, tone: c1.tone },
      { pinyin: c2.pinyin, tone: c2.tone },
    ]);

    suggestions.push({
      name: nameStr,
      fullName: surname + nameStr,
      meaning,
      wuXing: `${c1.wuXing}+${c2.wuXing}`,
      strokes,
      pinyin,
      rhythm,
      source: sourceTexts[i % sourceTexts.length],
      isFree: i === 0,
    });
  }

  return suggestions;
}


// ===== 旧接口兼容（引用V2）=====
export interface NameSuggestion {
  name: string;
  meaning: string;
  wuXing: string;
  source: string;
}

export const nameCharsByElement = nameCharsByElementV2;
export const nameSources = nameSourcesV2;

export function generateNameSuggestions(
  surname: string,
  gender: string,
  missingElements: string[],
  weakElements: string[],
  secondChar: string = "",
  thirdChar: string = "",
): NameSuggestion[] {
  const v2 = generateNameSuggestionsV2(surname, gender, missingElements, weakElements, secondChar, thirdChar);
  return v2.map(s => ({
    name: s.name,
    meaning: s.meaning,
    wuXing: s.wuXing,
    source: s.source,
  }));
}
