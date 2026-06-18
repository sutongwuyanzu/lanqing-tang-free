"""
最终修复：彻底清除中间头像 + 贴金色莲花logo
增大白色覆盖范围 + 重新验证
"""
from PIL import Image, ImageDraw, ImageFont
import os
import math

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
OUTPUT = os.path.join(PUBLIC_DIR, "alipay-qr.png")


def create_lotus_logo(size):
    """兰清堂莲花logo - 金色莲花带"兰"字"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    r = size // 2 - 2

    gold = (212, 175, 119, 255)
    gold_bright = (240, 210, 150, 255)
    gold_dark = (150, 120, 70, 255)
    bg_circle = (42, 32, 24, 255)

    # 外圈
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg_circle, outline=gold, width=3)
    r2 = r - 6
    draw.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], outline=gold_dark, width=1)

    # 8片莲花瓣
    for i in range(8):
        angle = math.radians(i * 45)
        dist = r * 0.58
        px = cx + dist * math.cos(angle)
        py = cy + dist * math.sin(angle)
        pw = r * 0.14
        ph = r * 0.24
        draw.ellipse([px - pw, py - ph, px + pw, py + ph], fill=gold_bright, outline=gold_dark, width=1)

    # 中心金圆
    cr = r * 0.32
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=gold, outline=gold_dark, width=1)

    # "兰"字
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", int(r * 0.38))
    except Exception:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", int(r * 0.38))
        except Exception:
            font = ImageFont.load_default()

    text = "兰"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - bbox[1]), text, fill=(60, 40, 20, 255), font=font)

    return img


def fix_final():
    """彻底修复中间区域"""
    qr = Image.open(OUTPUT).convert("RGBA")
    w, h = qr.size

    # 二维码中心（640x640布局）
    qr_cx, qr_cy = 320, 320

    # 增大覆盖范围：半径80px的白色圆，彻底盖住头像
    cover_r = 82
    draw = ImageDraw.Draw(qr)

    # 先用稍大的白色圆覆盖（多盖一圈，确保头像完全消失）
    draw.ellipse(
        [qr_cx - cover_r - 4, qr_cy - cover_r - 4,
         qr_cx + cover_r + 4, qr_cy + cover_r + 4],
        fill=(255, 255, 255, 255)
    )

    # 创建logo（比白色圆略小，留白边）
    logo_size = (cover_r - 6) * 2  # 152
    logo = create_lotus_logo(logo_size)
    logo_pos = (qr_cx - logo_size // 2, qr_cy - logo_size // 2)
    qr.paste(logo, logo_pos, logo)

    # 保存
    out = Image.new("RGB", (w, h), (26, 20, 16))
    out.paste(qr, (0, 0), qr)
    out.save(OUTPUT, "PNG")

    # 验证：检查白圈外缘到logo之间有没有头像残留
    # 检查距离中心 85-95px 的环形区域（应该是纯白色，因为二维码定位点不在这里）
    gray = out.convert("L")
    cx, cy = 320, 320
    ring_pixels = []
    for angle in range(0, 360, 10):
        rad = math.radians(angle)
        for dist in [86, 90, 94]:
            px = int(cx + dist * math.cos(rad))
            py = int(cy + dist * math.sin(rad))
            if 0 <= px < w and 0 <= py < h:
                ring_pixels.append(gray.getpixel((px, py)))

    white_count = sum(1 for p in ring_pixels if p > 200)
    print(f"✅ 已保存 {OUTPUT}")
    print(f"白圈外缘采样 {len(ring_pixels)} 点，白色: {white_count} ({white_count/len(ring_pixels):.0%})")
    print("→ 头像已彻底清除" if white_count/len(ring_pixels) > 0.8 else "→ 仍有残留，需加大范围")


if __name__ == "__main__":
    fix_final()
