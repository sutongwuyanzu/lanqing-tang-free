"""
最终版收款码处理 - 一步到位
1. 从原始二维码截图裁剪出纯净二维码
2. 自动检测中间头像位置和大小
3. 白色圆覆盖头像
4. 贴金色莲花logo
5. 加木色边框装饰
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
RAW = os.path.join(PUBLIC_DIR, "qr-raw.png")
OUTPUT = os.path.join(PUBLIC_DIR, "alipay-qr.png")


def detect_avatar(img):
    """
    自动检测中间头像的半径
    头像区域 = 中心附近的非纯黑非白像素（彩色或灰色）
    """
    gray = img.convert("L")
    w, h = gray.size
    cx, cy = w // 2, h // 2

    # 从中心向外扫描，找头像边界
    # 头像特征：不是纯黑(<60)也不是纯白(>200)的像素
    max_radius = min(w, h) // 4  # 头像最多占1/4

    detected_radii = []
    for angle_deg in range(0, 360, 15):
        angle = math.radians(angle_deg)
        # 从中心向外扫描
        for dist in range(10, max_radius):
            px = int(cx + dist * math.cos(angle))
            py = int(cy + dist * math.sin(angle))
            if not (0 <= px < w and 0 <= py < h):
                break
            v = gray.getpixel((px, py))
            # 头像像素：中间灰度（彩色照片转灰度后）
            is_avatar = 60 <= v <= 200
            if is_avatar:
                detected_radii.append(dist)
                break

    if detected_radii:
        # 头像半径 ≈ 检测到的最远边界
        radius = max(detected_radii) + 5  # 留余量
        print(f"检测到头像半径: {radius}px (采样{len(detected_radii)}个方向)")
        return min(radius, max_radius)
    else:
        print("未检测到明显头像，使用默认值")
        return int(min(w, h) * 0.15)


def create_gold_logo(size):
    """金色莲花logo"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    r = size // 2 - 2

    gold = (212, 175, 119, 255)
    gold_bright = (245, 215, 155, 255)
    gold_dark = (140, 110, 60, 255)
    bg_circle = (60, 45, 30, 255)

    # 深色圆底
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_circle, outline=gold, width=3)
    r2 = r - 6
    draw.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], outline=gold_dark, width=1)

    # 莲花瓣（多层）
    layers = [
        (0.62, 0.13, 0.30, gold_dark),
        (0.62, 0.10, 0.26, gold),
        (0.45, 0.11, 0.24, gold),
        (0.45, 0.08, 0.20, gold_bright),
    ]
    for dist_m, wm, hm, color in layers:
        for j in range(8):
            a = math.radians(j * 45 + 22.5)
            dist = r * dist_m
            fx = cx + dist * math.cos(a)
            fy = cy + dist * math.sin(a)
            pw = r * wm
            ph = r * hm
            draw.ellipse([fx - pw, fy - ph, fx + pw, fy + ph], fill=color)

    # 中心金圆
    cr = r * 0.30
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=gold, outline=gold_dark, width=1)

    # "兰"字
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", int(r * 0.36))
    except Exception:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", int(r * 0.36))
        except Exception:
            font = ImageFont.load_default()

    text = "兰"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - bbox[1]), text, fill=(50, 35, 18, 255), font=font)

    return img


def process_qr():
    """主处理函数"""
    # 1. 打开原始二维码
    img = Image.open(RAW).convert("RGBA")
    w, h = img.size
    print(f"原始二维码: {w}x{h}")

    # 2. 检测头像半径
    avatar_r = detect_avatar(img)

    cx, cy = w // 2, h // 2

    # 3. 白色圆覆盖头像（先盖一层白色，确保干净）
    draw = ImageDraw.Draw(img)
    cover_r = avatar_r + 12  # 多盖一圈
    draw.ellipse(
        [cx - cover_r, cy - cover_r, cx + cover_r, cy + cover_r],
        fill=(255, 255, 255, 255)
    )
    print(f"白色覆盖半径: {cover_r}px")

    # 4. 贴金色莲花logo（略小于白圈）
    logo_size = (avatar_r + 5) * 2
    logo = create_gold_logo(logo_size)
    logo_pos = (cx - logo_size // 2, cy - logo_size // 2)
    img.paste(logo, logo_pos, logo)
    print(f"莲花logo: {logo_size}x{logo_size}")

    # ====== 5. 加木色边框装饰 ======
    border = 55
    FS = max(w, h) + border * 2
    final = Image.new("RGBA", (FS, FS), (0, 0, 0, 0))
    fdraw = ImageDraw.Draw(final)

    # 深棕底
    fdraw.rectangle([0, 0, FS, FS], fill=(26, 20, 16, 255))

    # 木色边框 + 纹理
    wood_mid = (139, 111, 71, 255)
    wood_tex = (120, 95, 60, 255)
    # 木色区域
    fdraw.rectangle([12, 12, FS - 12, FS - 12], fill=wood_mid)
    # 木纹横线
    for i in range(12, FS - 12, 2):
        intensity = (math.sin(i * 0.4) + 1) / 2
        r = int(wood_mid[0] * (1 - intensity * 0.2) + wood_tex[0] * intensity * 0.2)
        g = int(wood_mid[1] * (1 - intensity * 0.2) + wood_tex[1] * intensity * 0.2)
        b = int(wood_mid[2] * (1 - intensity * 0.2) + wood_tex[2] * intensity * 0.2)
        fdraw.line([(12, i), (FS - 12, i)], fill=(r, g, b), width=1)

    # 金色双线边框
    gold = (212, 175, 119, 255)
    fdraw.rectangle([14, 14, FS - 14, FS - 14], outline=gold, width=2)
    fdraw.rectangle([border - 6, border - 6, FS - border + 6, FS - border + 6], outline=gold, width=1)

    # 四角金色菱形装饰
    corners = [(20, 20), (FS - 40, 20), (20, FS - 40), (FS - 40, FS - 40)]
    for ccx, ccy in corners:
        mid_x = ccx + 10
        mid_y = ccy + 10
        fdraw.polygon([
            (mid_x, ccy), (ccx + 20, mid_y),
            (mid_x, ccy + 20), (ccx, mid_y)
        ], fill=gold)

    # 6. 粘贴二维码（居中，保留原始白底，不改动二维码本身）
    qr_x = (FS - w) // 2
    qr_y = (FS - h) // 2
    final.paste(img, (qr_x, qr_y), img)

    # 7. 顶部和底部文字
    try:
        font_title = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 32)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 18)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    title = "兰清堂"
    bbox = fdraw.textbbox((0, 0), title, font=font_title)
    tw = bbox[2] - bbox[0]
    fdraw.text(((FS - tw) // 2, 22), title, fill=gold, font=font_title)

    sub = "· 扫码祈福 ·"
    bbox = fdraw.textbbox((0, 0), sub, font=font_sub)
    sw = bbox[2] - bbox[0]
    fdraw.text(((FS - sw) // 2, FS - 38), sub, fill=gold, font=font_sub)

    # 8. 保存
    out = Image.new("RGB", (FS, FS), (26, 20, 16))
    out.paste(final, (0, 0), final)
    out.save(OUTPUT, "PNG")
    print(f"\n✅ 完成! 已保存: {OUTPUT} ({FS}x{FS})")

    # 验证：检查中心区域
    verify = out.convert("L")
    center = verify.crop((FS // 2 - 15, FS // 2 - 15, FS // 2 + 15, FS // 2 + 15))
    pixels = list(center.getdata())
    # 金色logo区域应该偏亮
    bright_count = sum(1 for p in pixels if p > 100)
    print(f"中心区域亮度验证: {bright_count}/{len(pixels)} 偏亮 → {'✅logo已贴上' if bright_count > len(pixels) * 0.5 else '⚠️需检查'}")


if __name__ == "__main__":
    process_qr()
