// 八字计算工具函数
// 天干地支、五行等基础数据

export const tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const wuXing = ["木", "火", "土", "金", "水"] as const;
export const shengXiao = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"] as const;

// 天干五行映射
export const tianGanWuXing: Record<string, string> = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水",
};

// 地支五行映射
export const diZhiWuXing: Record<string, string> = {
  "子": "水", "丑": "土",
  "寅": "木", "卯": "木",
  "辰": "土", "巳": "火",
  "午": "火", "未": "土",
  "申": "金", "酉": "金",
  "戌": "土", "亥": "水",
};

// 地支生肖映射
export function getShengXiao(year: number): string {
  return shengXiao[(year - 4) % 12];
}

// 年柱天干地支
export function getYearPillar(year: number): { gan: string; zhi: string } {
  const ganIdx = (year - 4) % 10;
  const zhiIdx = (year - 4) % 12;
  return { gan: tianGan[ganIdx], zhi: diZhi[zhiIdx] };
}

// 月柱天干地支（简化计算）
export function getMonthPillar(yearGan: string, month: number): { gan: string; zhi: string } {
  // 月支固定：正月寅、二月卯...
  const monthZhiMap: Record<number, string> = {
    1: "丑", 2: "寅", 3: "卯", 4: "辰", 5: "巳", 6: "午",
    7: "未", 8: "申", 9: "酉", 10: "戌", 11: "亥", 12: "子",
  };
  const zhi = monthZhiMap[month] || "子";

  // 月天干根据年干推算
  const yearGanIdx = tianGan.indexOf(yearGan as typeof tianGan[number]);
  const startGanIdx = (yearGanIdx % 5) * 2; // 甲己年起丙寅
  const zhiIdx = diZhi.indexOf(zhi as typeof diZhi[number]);
  const gan = tianGan[(startGanIdx + zhiIdx) % 10];

  return { gan, zhi };
}

// 日柱天干地支（简化算法，仅作参考）
export function getDayPillar(year: number, month: number, day: number): { gan: string; zhi: string } {
  // 简化的日柱计算（从已知基准日推算）
  const base = new Date(2000, 0, 7); // 2000年1月7日 = 甲子日
  const target = new Date(year, month - 1, day);
  const diff = Math.floor((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
  const idx = ((diff % 60) + 60) % 60;
  return {
    gan: tianGan[idx % 10],
    zhi: diZhi[idx % 12],
  };
}

// 时柱天干地支
export function getHourPillar(dayGan: string, hour: number): { gan: string; zhi: string } {
  // 时辰对应地支
  const hourZhiMap = [
    { range: [23, 1], zhi: "子" },
    { range: [1, 3], zhi: "丑" },
    { range: [3, 5], zhi: "寅" },
    { range: [5, 7], zhi: "卯" },
    { range: [7, 9], zhi: "辰" },
    { range: [9, 11], zhi: "巳" },
    { range: [11, 13], zhi: "午" },
    { range: [13, 15], zhi: "未" },
    { range: [15, 17], zhi: "申" },
    { range: [17, 19], zhi: "酉" },
    { range: [19, 21], zhi: "戌" },
    { range: [21, 23], zhi: "亥" },
  ];

  let zhi = "子";
  for (const item of hourZhiMap) {
    if (hour >= item.range[0] || hour < item.range[1]) {
      if (item.range[0] === 23 && hour >= 23) { zhi = "子"; break; }
      if (hour >= item.range[0] && hour < item.range[1]) { zhi = item.zhi; break; }
    }
  }

  const zhiIdx = diZhi.indexOf(zhi as typeof diZhi[number]);
  const dayGanIdx = tianGan.indexOf(dayGan as typeof tianGan[number]);
  const startGanIdx = (dayGanIdx % 5) * 2; // 甲己日起甲子
  const gan = tianGan[(startGanIdx + zhiIdx) % 10];

  return { gan, zhi };
}

// 五行统计
export function countWuXing(pillars: { gan: string; zhi: string }[]): Record<string, number> {
  const count: Record<string, number> = { "木": 0, "火": 0, "土": 0, "金": 0, "水": 0 };
  for (const pillar of pillars) {
    count[tianGanWuXing[pillar.gan] || ""] = (count[tianGanWuXing[pillar.gan] || ""] || 0) + 1;
    count[diZhiWuXing[pillar.zhi] || ""] = (count[diZhiWuXing[pillar.zhi] || ""] || 0) + 1;
  }
  return count;
}

// 五行缺失分析
export function analyzeWuXing(count: Record<string, number>): {
  strong: string[];
  weak: string[];
  missing: string[];
  summary: string;
} {
  const strong: string[] = [];
  const weak: string[] = [];
  const missing: string[] = [];

  for (const element of wuXing) {
    const c = count[element] || 0;
    if (c === 0) missing.push(element);
    else if (c >= 3) strong.push(element);
    else if (c <= 1) weak.push(element);
  }

  let summary = "";
  if (strong.length > 0) summary += `五行偏旺：${strong.join("、")}。`;
  if (weak.length > 0) summary += `五行偏弱：${weak.join("、")}。`;
  if (missing.length > 0) summary += `五行缺：${missing.join("、")}，起名时可适当补益。`;
  if (strong.length === 0 && weak.length === 0 && missing.length === 0) {
    summary = "五行均衡，命格中正平和。";
  }

  return { strong, weak, missing, summary };
}

// 完整八字排盘
export interface BaziResult {
  year: { gan: string; zhi: string };
  month: { gan: string; zhi: string };
  day: { gan: string; zhi: string };
  hour: { gan: string; zhi: string };
  shengXiao: string;
  wuXingCount: Record<string, number>;
  wuXingAnalysis: ReturnType<typeof analyzeWuXing>;
  dayMaster: string; // 日主（日干）
  dayMasterElement: string; // 日主五行
}

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0
): BaziResult {
  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(yearPillar.gan, month);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.gan, hour);

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const wuXingCount = countWuXing(pillars);
  const wuXingAnalysis = analyzeWuXing(wuXingCount);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    shengXiao: getShengXiao(year),
    wuXingCount,
    wuXingAnalysis,
    dayMaster: dayPillar.gan,
    dayMasterElement: tianGanWuXing[dayPillar.gan] || "",
  };
}
