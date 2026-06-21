// 今日黄历 · 数据与推算
// 整合八字干支 / 五行 / 生肖 / 灵签 / 解梦 / 紫微流日 / 奇门方位 / 彭祖百忌 / 二十八宿 / 建除十二神
// 注：部分历法推算为简化算法，仅供娱乐参考，非专业命理排盘。

import {
  tianGan,
  diZhi,
  tianGanWuXing,
  diZhiWuXing,
  shengXiao,
  getYearPillar,
  getMonthPillar,
  getDayPillar,
} from "./bazi-utils";
import { lots, type Lot } from "./lots-data";
import { dreamData } from "./dream-data";

// ---------- 基础常量 ----------

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// 二十八宿（东方青龙起，逆序轮转）
export const xiu28 = [
  "角", "亢", "氐", "房", "心", "尾", "箕",
  "斗", "牛", "女", "虚", "危", "室", "壁",
  "奎", "娄", "胃", "昴", "毕", "觜", "参",
  "井", "鬼", "柳", "星", "张", "翼", "轸",
] as const;

// 建除十二神
export const jianChu12 = ["建", "除", "满", "平", "定", "执", "破", "危", "成", "收", "开", "闭"] as const;

// 十二值位吉凶（建除体系简化版）
const jianChuLuck: Record<string, "吉" | "凶" | "中"> = {
  建: "中", 除: "吉", 满: "吉", 平: "中", 定: "吉", 执: "中",
  破: "凶", 危: "凶", 成: "吉", 收: "中", 开: "吉", 闭: "中",
};

// 冲煞：日支所冲之地支 + 煞方
const chongMap: Record<string, string> = {
  子: "午马", 丑: "未羊", 寅: "申猴", 卯: "酉鸡",
  辰: "戌狗", 巳: "亥猪", 午: "子鼠", 未: "丑牛",
  申: "寅虎", 酉: "卯兔", 戌: "辰龙", 亥: "巳蛇",
};

// 煞方：申子辰日煞南，寅午戌日煞北，亥卯未日煞西，巳酉丑日煞东
const shaFang: Record<string, string> = {
  子: "南", 申: "南", 辰: "南",
  午: "北", 寅: "北", 戌: "北",
  卯: "西", 亥: "西", 未: "西",
  酉: "东", 巳: "东", 丑: "东",
};

// 彭祖百忌（按天干地支）
const pengZuGan: Record<string, string> = {
  甲: "甲不开仓，财物耗散",
  乙: "乙不栽植，千株不长",
  丙: "丙不修灶，必见灾殃",
  丁: "丁不剃头，头必生疮",
  戊: "戊不受田，田主不祥",
  己: "己不破券，二比并亡",
  庚: "庚不经络，织机虚张",
  辛: "辛不合酱，主人不尝",
  壬: "壬不汲水，更难提防",
  癸: "癸不词讼，理弱敌强",
};
const pengZuZhi: Record<string, string> = {
  子: "子不问卜，自惹祸殃",
  丑: "丑不冠带，主不还乡",
  寅: "寅不祭祀，神鬼不尝",
  卯: "卯不穿井，水泉不香",
  辰: "辰不哭泣，必主重丧",
  巳: "巳不远行，财物伏藏",
  午: "午不苫盖，屋主更张",
  未: "未不服药，毒气入肠",
  申: "申不安床，鬼祟入房",
  酉: "酉不会客，醉坐颠狂",
  戌: "戌不吃犬，作怪上床",
  亥: "亥不嫁娶，不利新郎",
};

// 胎神占方（按日干支，简化取每日一组）
const taiShenList = [
  "占门碓 外东南", "占厨灶 炉外正南", "占门炉 外西北", "占碓磨 外正南",
  "占门厕 外正北", "占房床 炉外西北", "占门床 外正南", "占碓磨 外正南",
  "占门炉 外东北", "占房床 外正北", "占门厕 外东南", "占厨灶 外正东",
];

// 吉神宜趋候选
const jiShenPool = [
  "天德", "月德", "天恩", "天愿", "三合", "六合", "母仓",
  "时阳", "生气", "益后", "青龙", "明堂", "金匮", "玉堂",
  "司命", "福德", "相日", "吉期", "圣心", "四相", "五合",
];

// 凶神宜忌候选
const xiongShenPool = [
  "劫煞", "灾煞", "月煞", "月刑", "月厌", "四废", "五虚",
  "五离", "天贼", "死神", "地囊", "九空", "大煞", "往亡",
  "血支", "天火", "五离", "河魁", "死神", "游祸",
];

// 宜/忌活动池（每项可关联到对应玄学功能页）
interface YiPool {
  text: string;
  link?: string; // 关联功能页
}
const yiPool: YiPool[] = [
  { text: "祈福", link: "/pray" },
  { text: "求嗣", link: "/pray" },
  { text: "求签", link: "/lingqian" },
  { text: "出行", },
  { text: "嫁娶", },
  { text: "开市", },
  { text: "交易", },
  { text: "立券", },
  { text: "纳财", },
  { text: "祭祀", link: "/pray" },
  { text: "起名", link: "/bazi" },
  { text: "冠笄", },
  { text: "入宅", },
  { text: "移徙", },
  { text: "安床", },
  { text: "裁衣", },
  { text: "经络", },
  { text: "酝酿", },
  { text: "捕捉", },
  { text: "畋猎", },
  { text: "解除", },
  { text: "求医", },
  { text: "破屋", },
  { text: "坏垣", },
  { text: "余事勿取", },
];
const jiPool: YiPool[] = [
  { text: "开光", },
  { text: "安葬", },
  { text: "破土", },
  { text: "动土", },
  { text: "修造", },
  { text: "上梁", },
  { text: "嫁娶", },
  { text: "出行", },
  { text: "移徙", },
  { text: "入宅", },
  { text: "作灶", },
  { text: "开市", },
  { text: "交易", },
  { text: "纳财", },
  { text: "求医", },
  { text: "针灸", },
  { text: "栽种", },
  { text: "词讼", },
  { text: "出火", },
  { text: "伐木", },
];

// 紫微流日提示（按日干）
const ziweiHintByGan: Record<string, string> = {
  甲: "紫微流日逢天机，思维敏捷宜谋划，文思泉涌利读书考学。",
  乙: "紫微流日逢太阴，偏财暗动宜守成，静心冥想得贵人和。",
  丙: "紫微流日逢太阳，光明正大宜进取，广结善缘名声显。",
  丁: "紫微流日逢天同，福禄随身宜享乐，闲适养神增福报。",
  戊: "紫微流日逢天府，库藏充盈宜纳财，稳重行事得长利。",
  己: "紫微流日逢武曲，刚毅果决宜决断，破旧立新有作为。",
  庚: "紫微流日逢七杀，变动之中藏机遇，勇往直前忌犹豫。",
  辛: "紫微流日逢廉贞，桃花带煞宜守礼，情感之事须慎言。",
  壬: "紫微流日逢破军，动荡开创新局面，远行变动多吉利。",
  癸: "紫微流日逢贪狼，欲望起伏宜节制，修心养性得真机。",
};

// 奇门吉方（按日干定生门方位）
const qimenByGan: Record<string, string> = {
  甲: "东北（生门）", 乙: "正东（生门）", 丙: "东南（生门）",
  丁: "正南（生门）", 戊: "中宫（生门）", 己: "西南（生门）",
  庚: "正西（生门）", 辛: "西北（生门）", 壬: "正北（生门）",
  癸: "东北（开门）",
};

// 财神方位（按日干）
const caiShenByGan: Record<string, string> = {
  甲乙: "东北", 丙丁: "正西", 戊己: "正北",
  庚辛: "正东", 壬癸: "正南",
};
// 喜神方位（按日干）
const xiShenByGan: Record<string, string> = {
  甲己: "东北", 乙庚: "西北", 丙辛: "西南",
  丁壬: "正南", 戊癸: "东南",
};
// 福神方位（按日干）
const fuShenByGan: Record<string, string> = {
  甲乙: "西南", 丙丁: "西北", 戊己: "正北",
  庚辛: "西南", 壬癸: "东南",
};

// ---------- 工具：日种子伪随机 ----------

// 以日期为种子生成稳定伪随机数，保证当日黄历不变、日日有变
function dateSeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return (y * 10000 + m * 100 + d) >>> 0;
}

// 伪随机生成器（mulberry32）
function makeRng(seed: number) {
  let a = seed || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

// 农历日期近似（仅展示用，非精确历法）
function lunarApprox(date: Date, yearGanZhi: string): string {
  // 以 2024-02-10（甲辰年正月初一）为基准，粗略推算农历月日
  const base = new Date(2024, 1, 10);
  const diffDays = Math.round((date.getTime() - base.getTime()) / 86400000);
  // 简化：每月按 29.5 日计
  const lunarMonthLen = 29.5;
  let month = 1;
  let day = diffDays + 1;
  while (day > lunarMonthLen) {
    day -= lunarMonthLen;
    month++;
  }
  month = ((month - 1) % 12) + 1;
  const monthName =
    ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"][month - 1];
  const dayFloor = Math.floor(day);
  const cnNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  const dayName =
    dayFloor <= 10
      ? `初${cnNum[Math.max(0, dayFloor - 1)]}`
      : dayFloor === 20
        ? "二十"
        : dayFloor < 20
          ? `初十`
          : dayFloor === 30
            ? "三十"
            : `廿${cnNum[dayFloor - 21] ?? "一"}`;
  return `${yearGanZhi}年 ${monthName}月${dayName}`;
}

// ---------- 黄历主结构 ----------

export interface HourLuck {
  name: string; // 时辰名
  zhi: string; // 地支
  range: string; // 时间段
  luck: "吉" | "中" | "凶";
  desc: string;
}

export interface YiItem {
  text: string;
  link?: string;
}

export interface HuangliInfo {
  date: Date;
  solarDate: string;
  lunarDate: string;
  weekDay: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  dayGan: string;
  dayZhi: string;
  shengXiao: string;
  wuXingDay: string; // 纳音五行（简化取日干五行）
  jianChu: string;
  jianChuLuck: "吉" | "凶" | "中";
  xiu: string; // 二十八宿
  chong: string; // 冲
  sha: string; // 煞方
  caiShen: string;
  xiShen: string;
  fuShen: string;
  taiShen: string;
  pengZu: string;
  jiShen: string[];
  xiongShen: string[];
  yi: YiItem[];
  ji: YiItem[];
  hours: HourLuck[];
  recommendedLot: Lot;
  dreamHint: { yi: string; ji: string };
  ziweiHint: string;
  qimenDirection: string;
  summary: string;
  luckLevel: "上上" | "上吉" | "中上" | "中平" | "中下";
}

// 十二时辰
const hourList = [
  { zhi: "子", range: "23:00-01:00", name: "子时" },
  { zhi: "丑", range: "01:00-03:00", name: "丑时" },
  { zhi: "寅", range: "03:00-05:00", name: "寅时" },
  { zhi: "卯", range: "05:00-07:00", name: "卯时" },
  { zhi: "辰", range: "07:00-09:00", name: "辰时" },
  { zhi: "巳", range: "09:00-11:00", name: "巳时" },
  { zhi: "午", range: "11:00-13:00", name: "午时" },
  { zhi: "未", range: "13:00-15:00", name: "未时" },
  { zhi: "申", range: "15:00-17:00", name: "申时" },
  { zhi: "酉", range: "17:00-19:00", name: "酉时" },
  { zhi: "戌", range: "19:00-21:00", name: "戌时" },
  { zhi: "亥", range: "21:00-23:00", name: "亥时" },
];

const hourDescPool = [
  "青龙得位，万事亨通", "明堂照耀，贵人扶持", "金匮纳财，进益之象",
  "天德吉时，宜谋大事", "玉堂清贵，文思泉涌", "司命守宅，家宅安宁",
  "白虎当值，谨慎言行", "天牢困厄，不宜妄动", "玄武暗昧，防小人口舌",
  "勾陈阻滞，事多拖延", "朱雀开口，慎防争讼", "截路空亡，宜静守",
];

// 时辰吉凶：以日干起时干，配建除值位推吉凶
function buildHours(dayGan: string, rng: () => number): HourLuck[] {
  const dayGanIdx = tianGan.indexOf(dayGan as (typeof tianGan)[number]);
  const startGanIdx = (dayGanIdx % 5) * 2; // 甲己日起甲子时
  return hourList.map((h, i) => {
    const ganIdx = (startGanIdx + i) % 10;
    const zhiIdx = i; // 子时为0
    const gan = tianGan[ganIdx];
    const zhi = diZhi[zhiIdx];
    // 用日干五行与时干五行的生克关系粗判
    const dayEl = tianGanWuXing[dayGan];
    const hourEl = tianGanWuXing[gan];
    let luck: "吉" | "中" | "凶";
    if (dayEl === hourEl) luck = "中";
    else if (
      (dayEl === "木" && hourEl === "水") ||
      (dayEl === "火" && hourEl === "木") ||
      (dayEl === "土" && hourEl === "火") ||
      (dayEl === "金" && hourEl === "土") ||
      (dayEl === "水" && hourEl === "金")
    )
      luck = "吉"; // 生我
    else if (
      (dayEl === "木" && hourEl === "金") ||
      (dayEl === "火" && hourEl === "水") ||
      (dayEl === "土" && hourEl === "木") ||
      (dayEl === "金" && hourEl === "火") ||
      (dayEl === "水" && hourEl === "土")
    )
      luck = "凶"; // 克我
    else luck = "中"; // 我生、我克
    return {
      name: h.name,
      zhi,
      range: h.range,
      luck,
      desc: hourDescPool[(ganIdx + zhiIdx + Math.floor(rng() * 12)) % hourDescPool.length],
    };
  });
}

// 推荐吉签：按日期种子从灵签中稳定选一签
function pickRecommendedLot(seed: number): Lot {
  const idx = seed % lots.length;
  return lots[idx];
}

// 今日宜梦/忌梦：从解梦库中按种子选吉梦与忌梦
function pickDreamHint(seed: number): { yi: string; ji: string } {
  const jiDreams = dreamData.filter(
    (d) => d.luck === "大吉" || d.luck === "吉"
  );
  const xiongDreams = dreamData.filter(
    (d) => d.luck === "小凶" || d.luck === "凶"
  );
  const yi = jiDreams.length ? jiDreams[seed % jiDreams.length].title : "梦见祥瑞";
  const ji = xiongDreams.length
    ? xiongDreams[seed % xiongDreams.length].title
    : "梦见凶象";
  return { yi, ji };
}

// ---------- 主函数：获取当日黄历 ----------

export function getHuangli(date: Date = new Date()): HuangliInfo {
  const seed = dateSeed(date);
  const rng = makeRng(seed);

  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const yearPillar = getYearPillar(y);
  const monthPillar = getMonthPillar(yearPillar.gan, m);
  const dayPillar = getDayPillar(y, m, d);

  const dayGan = dayPillar.gan;
  const dayZhi = dayPillar.zhi;
  const dayGanIdx = tianGan.indexOf(dayGan as (typeof tianGan)[number]);
  const dayZhiIdx = diZhi.indexOf(dayZhi as (typeof diZhi)[number]);

  // 二十八宿：以日序模28
  const xiu = xiu28[(dayZhiIdx + seed) % 28] ?? "角";

  // 建除十二神：以日支与月支关系起建
  const monthZhiIdx = diZhi.indexOf(monthPillar.zhi as (typeof diZhi)[number]);
  const jianIdx = ((dayZhiIdx - monthZhiIdx) % 12 + 12) % 12;
  const jianChu = jianChu12[jianIdx];
  const jcLuck = jianChuLuck[jianChu] ?? "中";

  // 冲煞
  const chong = chongMap[dayZhi] ?? "—";
  const sha = `${shaFang[dayZhi] ?? "中"}方`;

  // 方位（按日干双干分组）
  const ganGroup2 =
    dayGan === "甲" || dayGan === "乙"
      ? "甲乙"
      : dayGan === "丙" || dayGan === "丁"
        ? "丙丁"
        : dayGan === "戊" || dayGan === "己"
          ? "戊己"
          : dayGan === "庚" || dayGan === "辛"
            ? "庚辛"
            : "壬癸";
  const caiShen = caiShenByGan[ganGroup2] ?? "正中";
  // 喜神按干合对配：甲己/乙庚/丙辛/丁壬/戊癸（索引 i 与 i+5），小索引在前以匹配表键
  const partnerIdx = (dayGanIdx + 5) % 10;
  const firstIdx = Math.min(dayGanIdx, partnerIdx);
  const secondIdx = Math.max(dayGanIdx, partnerIdx);
  const xiKey = tianGan[firstIdx] + tianGan[secondIdx];
  const xiShen = xiShenByGan[xiKey] ?? "正中";
  const fuShen = fuShenByGan[ganGroup2] ?? "正中";

  // 胎神
  const taiShen = taiShenList[dayZhiIdx] ?? "占门碓 外东南";

  // 彭祖百忌
  const pengZu = `${pengZuGan[dayGan] ?? ""} · ${pengZuZhi[dayZhi] ?? ""}`;

  // 吉神/凶神
  const jiShen = pickN(jiShenPool, 4 + Math.floor(rng() * 2), rng);
  const xiongShen = pickN(xiongShenPool, 3 + Math.floor(rng() * 2), rng);

  // 宜/忌（根据建除吉凶调整数量）
  const yiCount = jcLuck === "吉" ? 5 : jcLuck === "中" ? 4 : 3;
  const jiCount = jcLuck === "凶" ? 5 : jcLuck === "中" ? 4 : 3;
  const yi = pickN(yiPool, yiCount, rng);
  const ji = pickN(jiPool, jiCount, rng);

  // 时辰吉凶
  const hours = buildHours(dayGan, rng);

  // 综合玄学
  const recommendedLot = pickRecommendedLot(seed);
  const dreamHint = pickDreamHint(seed);
  const ziweiHint = ziweiHintByGan[dayGan] ?? "紫微流日平和，宜守成修身。";
  const qimenDirection = qimenByGan[dayGan] ?? "东北（生门）";

  // 日五行
  const wuXingDay = tianGanWuXing[dayGan] ?? "土";

  // 总评与吉凶等级（传统黄历五等：上上/上吉/中上/中平/中下）
  const jiShenScore = jiShen.length - xiongShen.length;
  const jcScore = jcLuck === "吉" ? 2 : jcLuck === "凶" ? -2 : 0;
  const totalScore = jiShenScore + jcScore;
  let luckLevel: HuangliInfo["luckLevel"] = "中平";
  let summary = "";
  if (totalScore >= 5) {
    luckLevel = "上上";
    summary = "今日吉神汇聚、诸事皆宜，宜行善积德、祈福求签，把握良机。福报倍增。";
  } else if (totalScore >= 2) {
    luckLevel = "上吉";
    summary = "今日运势向好，宜进取谋事。可于吉时祈福、求签、行善，增福延寿。";
  } else if (totalScore >= 0) {
    luckLevel = "中上";
    summary = "今日平稳向好，宜守常道、择吉而动。诸事顺遂，可保平安。";
  } else if (totalScore >= -2) {
    luckLevel = "中平";
    summary = "今日吉凶参半，宜慎言行、缓谋事。择吉时而动，可免其扰。";
  } else {
    luckLevel = "中下";
    summary = "今日凶神偏多，宜静守家中、诵经祈福。忌兴造动土，诸事宜缓。";
  }

  const solarDate = `${y}年${m}月${d}日`;
  const yearGanZhi = `${yearPillar.gan}${yearPillar.zhi}`;
  const lunarDate = lunarApprox(date, yearGanZhi);
  const weekDay = `星期${weekDays[date.getDay()]}`;

  return {
    date,
    solarDate,
    lunarDate,
    weekDay,
    yearPillar: `${yearPillar.gan}${yearPillar.zhi}`,
    monthPillar: `${monthPillar.gan}${monthPillar.zhi}`,
    dayPillar: `${dayGan}${dayZhi}`,
    dayGan,
    dayZhi,
    shengXiao: shengXiao[((y - 4) % 12 + 12) % 12],
    wuXingDay,
    jianChu,
    jianChuLuck: jcLuck,
    xiu,
    chong,
    sha,
    caiShen,
    xiShen,
    fuShen,
    taiShen,
    pengZu,
    jiShen,
    xiongShen,
    yi,
    ji,
    hours,
    recommendedLot,
    dreamHint,
    ziweiHint,
    qimenDirection,
    summary,
    luckLevel,
  };
}

// 吉凶等级配色（与 dream 页风格一致）
export function getLuckLevelColor(level: HuangliInfo["luckLevel"]): string {
  switch (level) {
    case "上上":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "上吉":
      return "bg-gold/20 text-gold border-gold/30";
    case "中上":
      return "bg-amber-500/15 text-amber-300 border-amber-500/25";
    case "中平":
      return "bg-blue-500/15 text-blue-300 border-blue-500/25";
    case "中下":
      return "bg-gray-600/20 text-gray-300 border-gray-600/30";
    default:
      return "bg-gold/20 text-gold border-gold/30";
  }
}

export function getHourLuckColor(luck: HourLuck["luck"]): string {
  switch (luck) {
    case "吉":
      return "bg-gold/20 text-gold border-gold/30";
    case "中":
      return "bg-blue-500/15 text-blue-300 border-blue-500/25";
    case "凶":
      return "bg-gray-700/20 text-gray-400 border-gray-600/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
}

// ---------- 未来七日预览 ----------

export interface FutureDay {
  offset: number; // 距今日偏移天数（0=今日）
  date: Date;
  solarShort: string; // 如 6/21
  weekDay: string; // 如 星期日
  dayPillar: string;
  jianChu: string;
  xiu: string;
  luckLevel: HuangliInfo["luckLevel"];
  yiShort: string; // 宜摘要（前2项）
  jiShort: string; // 忌摘要（前2项）
  chong: string;
}

export function getFutureSevenDays(from: Date = new Date()): FutureDay[] {
  return getFutureDays(from, 7);
}

// 取若干日（含今日），用于网格展示
export function getFutureDays(from: Date = new Date(), count: number = 6): FutureDay[] {
  const base = new Date(from);
  base.setHours(0, 0, 0, 0);
  const out: FutureDay[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const full = getHuangli(d);
    out.push({
      offset: i,
      date: d,
      solarShort: `${d.getMonth() + 1}/${d.getDate()}`,
      weekDay: `星期${weekDays[d.getDay()]}`,
      dayPillar: full.dayPillar,
      jianChu: full.jianChu,
      xiu: full.xiu,
      luckLevel: full.luckLevel,
      yiShort: full.yi.slice(0, 2).map((y) => y.text).join("·") || "—",
      jiShort: full.ji.slice(0, 2).map((j) => j.text).join("·") || "—",
      chong: full.chong,
    });
  }
  return out;
}

export const luckLevelOrder: HuangliInfo["luckLevel"][] = [
  "上上",
  "上吉",
  "中上",
  "中平",
  "中下",
];
