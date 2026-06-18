// 用户系统 - 手机登录、吉祥号、福报值、记录汇总
// 纯前端方案，数据存储在 localStorage

export interface UserRecord {
  phone: string;
  luckyId: string;        // 吉祥号
  nickname: string;
  merit: number;           // 福报值
  createdAt: string;
  // 各类记录
  lotRecords: LotHistoryItem[];
  dreamRecords: DreamHistoryItem[];
  lampRecords: LampHistoryItem[];
}

export interface LotHistoryItem {
  id: number;
  level: string;
  title: string;
  wish: string;
  time: string;
}

export interface DreamHistoryItem {
  title: string;
  luck: string;
  time: string;
}

export interface LampHistoryItem {
  orderId: string;
  name: string;
  lamp: string;
  duration: string;
  price: number;
  wish: string;
  time: string;
}

// 根据手机号生成吉祥号（8位，含吉利数字）
export function generateLuckyId(phone: string): string {
  // 取手机号后4位 + 固定吉利前缀
  const tail = phone.slice(-4);
  const luckyNums = ["8", "6", "9", "3"];
  let prefix = "";
  for (let i = 0; i < 4; i++) {
    const idx = (parseInt(phone[i] || "0") + i) % luckyNums.length;
    prefix += luckyNums[idx];
  }
  return `${prefix}${tail}`;
}

// 获取当前登录用户
export function getCurrentUser(): UserRecord | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("lqt_user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// 手机号登录/注册
export function loginWithPhone(phone: string): UserRecord {
  // 检查是否已有该手机号的记录
  const existingKey = `lqt_user_${phone}`;
  const existing = localStorage.getItem(existingKey);

  let user: UserRecord;
  if (existing) {
    user = JSON.parse(existing);
  } else {
    user = {
      phone,
      luckyId: generateLuckyId(phone),
      nickname: `善信${phone.slice(-4)}`,
      merit: 0,
      createdAt: new Date().toISOString(),
      lotRecords: [],
      dreamRecords: [],
      lampRecords: [],
    };
  }

  localStorage.setItem("lqt_user", JSON.stringify(user));
  localStorage.setItem(existingKey, JSON.stringify(user));
  return user;
}

// 退出登录
export function logout(): void {
  localStorage.removeItem("lqt_user");
}

// 更新用户信息
export function updateUser(updates: Partial<UserRecord>): UserRecord | null {
  const user = getCurrentUser();
  if (!user) return null;
  const updated = { ...user, ...updates };
  localStorage.setItem("lqt_user", JSON.stringify(updated));
  localStorage.setItem(`lqt_user_${user.phone}`, JSON.stringify(updated));
  return updated;
}

// 增加福报值
export function addMerit(amount: number): UserRecord | null {
  const user = getCurrentUser();
  if (!user) return null;
  return updateUser({ merit: user.merit + amount });
}

// 添加灵签记录
export function addLotRecord(item: LotHistoryItem): void {
  const user = getCurrentUser();
  if (!user) return;
  const records = [item, ...user.lotRecords].slice(0, 100);
  updateUser({ lotRecords: records });
}

// 添加解梦记录
export function addDreamRecord(item: DreamHistoryItem): void {
  const user = getCurrentUser();
  if (!user) return;
  const records = [item, ...user.dreamRecords].slice(0, 100);
  updateUser({ dreamRecords: records });
}

// 添加点灯记录
export function addLampRecord(item: LampHistoryItem): void {
  const user = getCurrentUser();
  if (!user) return;
  const records = [item, ...user.lampRecords].slice(0, 100);
  updateUser({ lampRecords: records });
}

// 分享相关
export function getShareLink(userId: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://lanqing-tang.pages.dev";
  return `${base}/?ref=${userId}`;
}

// 分享增加福报（每次分享+10福报）
export function handleShare(): { merit: number; link: string } {
  const user = getCurrentUser();
  const link = user ? getShareLink(user.luckyId) : "";
  const updated = addMerit(10);
  return { merit: updated?.merit || 0, link };
}

// 刷新灵签免费次数（分享后刷新）
export function refreshLotCount(): void {
  if (typeof window === "undefined") return;
  const d = new Date();
  const key = `lqt_draw_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
  localStorage.setItem(key, "0"); // 重置为0次（即恢复2次免费）
}

// 手机号格式验证
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}
