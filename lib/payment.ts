// 支付工具：支付宝 scheme 唤起 + 微信收款码引导 + 订单写入封装
//
// 【支付宝】技术原理：个人收款码内容形如 https://qr.alipay.com/xxxxx
// 通过 alipays:// scheme 协议可唤起支付宝 App 直接打开收款页面：
//   alipays://platformapi/startapp?saId=10000007&qrcode=<UrlEncode(收款码链接)>
// 用户点按钮 → 拉起支付宝 App → 显示收款码页面 → 用户输入金额付款
//
// 【微信】个人收款码是 wxp:// 私有协议，只能用微信"扫一扫"识别，
// 无法像支付宝那样从外部浏览器一键唤起（微信平台有意限制）。
// 所以微信走"长按收款码图片保存 → 微信扫一扫"路径，稳定可靠不踩风控。
// 若需微信一键拉起，须申请微信支付商户号走官方 H5 支付（要营业执照）。

import { supabase, isSupabaseConfigured, type Order } from "./supabase";
import { PRODUCT_KEYS } from "./pricing";

// ============ 支付宝配置 ============
// 你的支付宝收款码链接（二维码扫出来的内容）。
// 优先读环境变量，便于在 Cloudflare Pages 后台修改而无需改代码。
// 获取方式：支付宝 App → 收付款 → 二维码收款 → 分享/保存 → 复制链接，
// 或用任意扫码工具扫 public/alipay-qr.png 得到的链接。
const ALIPAY_RECEIVE_URL =
  process.env.NEXT_PUBLIC_ALIPAY_QR_URL ||
  "https://qr.alipay.com/tsx17590cb3tpjqzral4j96";

/**
 * 拼接唤起支付宝 App 收款页的 scheme 链接
 */
export function buildAlipayScheme(): string {
  return (
    "alipays://platformapi/startapp?saId=10000007&qrcode=" +
    encodeURIComponent(ALIPAY_RECEIVE_URL)
  );
}

/**
 * 检测当前是否在微信内打开（微信会拦截 alipays:// 协议，需提示用户用浏览器打开）
 */
export function isInWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

/**
 * 唤起支付宝 App 付款。
 * - 普通手机浏览器：直接跳转 alipays:// 拉起 App
 * - 微信内：返回 false，由调用方提示用户用浏览器打开
 * @returns true 表示已触发跳转，false 表示环境不支持（微信内）
 */
export function openAlipay(): boolean {
  if (typeof window === "undefined") return false;

  // 微信内打开会拦截 alipays 协议，不能直接唤起
  if (isInWeChatBrowser()) return false;

  try {
    window.location.href = buildAlipayScheme();
    return true;
  } catch {
    return false;
  }
}

// ============ 微信收款码 ============
// 微信个人收款码图片路径（放在 public/ 下，随项目部署）。
// 支持环境变量覆盖，便于更换。
export const WECHAT_QR_IMAGE =
  process.env.NEXT_PUBLIC_WECHAT_QR_IMAGE || "/wechat-qr.png";

/**
 * 判断当前是否在微信内打开。
 * - 微信内：可直接长按图片识别收款码（微信原生能力）
 * - 微信外：引导用户保存图片后打开微信扫一扫
 */
export function isOpenedInWeChat(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

// ============ 订单写入封装 ============

export interface InsertOrderInput {
  /** 业务类型：lot 灵签 / pray 祈福 / naming 起名 */
  type: "lot" | "pray" | "naming";
  /** 商品 key（对应 products 表 product_key） */
  productKey: string | null;
  /** 商品展示名 */
  productName: string | null;
  /** 金额（元） */
  amount: number;
  /** 客户名（可空） */
  customerName?: string | null;
  /** 订单详情（jsonb） */
  detail?: Record<string, unknown> | null;
}

// 按 type 分配订单号前缀，便于后台筛选
const ORDER_PREFIX: Record<InsertOrderInput["type"], string> = {
  lot: "L",
  pray: "P",
  naming: "N",
};

/**
 * 写入订单到 Supabase（失败仅 console.warn，不阻塞业务流程）。
 * 三处支付页（灵签/祈福/起名）的订单写入逻辑统一收敛到这里。
 * 未配置 Supabase 时静默跳过（前台降级到纯本地）。
 */
export function insertOrder(input: InsertOrderInput): void {
  if (!isSupabaseConfigured) return;

  const orderNo = `${ORDER_PREFIX[input.type]}${Date.now()}`;
  const payload: Omit<Order, "id" | "created_at"> = {
    order_no: orderNo,
    type: input.type,
    product_key: input.productKey,
    product_name: input.productName,
    amount: input.amount,
    customer_name: input.customerName ?? null,
    customer_phone: null,
    detail: input.detail ?? null,
    status: "paid",
  };

  supabase
    .from("orders")
    .insert(payload)
    .then(({ error }) => {
      if (error) console.warn(`[order] ${input.type} insert failed:`, error.message);
    });
}

export { PRODUCT_KEYS };
