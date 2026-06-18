"""
兰清堂 - 支付宝头像专用logo
生成多个版本供选择
支付宝头像建议：500x500 正方形
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
SIZE = 500


def draw_lotus(draw, cx, cy, scale, gold, gold_bright, gold_dark):
    """绘制对称莲花"""
    # 8片花瓣（外层）
    for i in range(8):
        angle = math.radians(i * 45 + 22.5)
        # 花瓣用椭圆
        dist = scale * 0.7
        px = cx + dist * math.sin(angle) * 0  # 都从中心出发
        py = cy
        # 旋转花瓣
        for layer, (mult, w_mul, h_mul, color) in enumerate([
            (1.0, 0.18, 0.42, gold),
            (0.85, 0.15, 0.35, gold_bright),
        ]):
            d = dist * mult
            for j in range(8):
                a = math.radians(j * 45 + 22.5)
                fx = cx + d * math.cos(a)
                fy = cy + d * math.sin(a)
                pw = scale * w_mul
                ph = scale * h_mul
                # 沿角度方向的椭圆
                bbox = [fx - pw, fy - ph, fx + pw, fy + ph]
                draw.ellipse(bbox, fill=color, outline=gold_dark, width=max(1, int(scale*0.02)))


def make_version1_lotus():
    """版本1：莲花 + 兰字（经典款）"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    gold = (212, 175, 119, 255)
    gold_bright = (245, 215, 155, 255)
    gold_dark = (150, 120, 70, 255)
    dark_bg = (26, 20, 16, 255)
    circle_bg = (42, 32, 24, 255)

    cx, cy = SIZE // 2, SIZE // 2
    R = SIZE // 2 - 8

    # 背景圆（深棕）
    draw.ellipse([cx-R, cy-R, cx+R, cy+R], fill=circle_bg)

    # 外金环
    for i, (offset, width) in enumerate([(0, 4), (8, 2), (14, 1)]):
        r = R - offset
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=gold if i==0 else gold_dark, width=width)

    # 8片莲花瓣（手工绘制，更精美）
    petal_layers = [
        # (距离比例, 宽比例, 高比例, 颜色)
        (0.72, 0.12, 0.32, gold_dark),
        (0.72, 0.09, 0.28, gold),
        (0.55, 0.10, 0.26, gold),
        (0.55, 0.07, 0.22, gold_bright),
    ]
    for dist_m, wm, hm, color in petal_layers:
        for j in range(8):
            a = math.radians(j * 45 + 22.5)
            dist = R * dist_m
            fx = cx + dist * math.cos(a)
            fy = cy + dist * math.sin(a)
            pw = R * wm
            ph = R * hm
            draw.ellipse([fx-pw, fy-ph, fx+pw, fy+ph], fill=color)

    # 中心圆
    cr = R * 0.30
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=gold, outline=gold_dark, width=2)
    # 内圈
    cr2 = cr - 6
    draw.ellipse([cx-cr2, cy-cr2, cx+cr2, cy+cr2], outline=gold_dark, width=1)

    # "兰"字
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", int(R * 0.32))
    except:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", int(R * 0.32))

    text = "兰"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw//2, cy - th//2 - bbox[1]), text, fill=(50, 35, 18, 255), font=font)

    return img


def make_version2_text():
    """版本2：纯文字"兰清堂"金色印章风"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    gold = (212, 175, 119, 255)
    gold_dark = (150, 120, 70, 255)
    circle_bg = (42, 32, 24, 255)
    red = (180, 60, 60, 255)

    cx, cy = SIZE // 2, SIZE // 2
    R = SIZE // 2 - 8

    # 红色印章背景
    draw.ellipse([cx-R, cy-R, cx+R, cy+R], fill=red)

    # 金色双环
    draw.ellipse([cx-R+3, cy-R+3, cx+R-3, cy+R-3], outline=gold, width=3)
    r2 = R - 14
    draw.ellipse([cx-r2, cy-r2, cx+r2, cy+r2], outline=gold, width=1)

    # 竖排"兰清堂"
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 72)
    except:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 72)

    chars = ["兰", "清", "堂"]
    total_h = len(chars) * 80
    start_y = cy - total_h // 2 + 5
    for i, ch in enumerate(chars):
        bbox = draw.textbbox((0, 0), ch, font=font)
        cw = bbox[2] - bbox[0]
        draw.text((cx - cw//2, start_y + i * 80), ch, fill=gold, font=font)

    return img


def make_version3_lotus_clean():
    """版本3：纯净莲花（无文字，最简洁）"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    gold = (212, 175, 119, 255)
    gold_bright = (250, 220, 160, 255)
    gold_light = (230, 200, 140, 255)
    gold_dark = (140, 110, 60, 255)
    circle_bg = (38, 28, 20, 255)

    cx, cy = SIZE // 2, SIZE // 2
    R = SIZE // 2 - 8

    # 深色圆底
    draw.ellipse([cx-R, cy-R, cx+R, cy+R], fill=circle_bg, outline=gold_dark, width=2)

    # 莲花 - 多层花瓣
    # 外层8瓣（最大）
    for j in range(8):
        a = math.radians(j * 45)
        dist = R * 0.62
        fx = cx + dist * math.cos(a)
        fy = cy + dist * math.sin(a)
        draw.ellipse([fx-R*0.14, fy-R*0.38, fx+R*0.14, fy+R*0.38], fill=gold_dark)

    # 中层8瓣（错开）
    for j in range(8):
        a = math.radians(j * 45 + 22.5)
        dist = R * 0.50
        fx = cx + dist * math.cos(a)
        fy = cy + dist * math.sin(a)
        draw.ellipse([fx-R*0.12, fy-R*0.30, fx+R*0.12, fy+R*0.30], fill=gold)

    # 内层8瓣
    for j in range(8):
        a = math.radians(j * 45)
        dist = R * 0.35
        fx = cx + dist * math.cos(a)
        fy = cy + dist * math.sin(a)
        draw.ellipse([fx-R*0.10, fy-R*0.22, fx+R*0.10, fy+R*0.22], fill=gold_bright)

    # 花心
    cr = R * 0.18
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=gold_light, outline=gold_dark, width=1)
    # 花心点
    for j in range(6):
        a = math.radians(j * 60)
        d = cr * 0.5
        draw.ellipse([cx+d*math.cos(a)-3, cy+d*math.sin(a)-3,
                      cx+d*math.cos(a)+3, cy+d*math.sin(a)+3], fill=gold_dark)

    return img


def make_version4_zen():
    """版本4：禅意风 - 莲花+经文装饰"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    gold = (212, 175, 119, 255)
    gold_dark = (140, 110, 60, 255)
    cream = (232, 220, 200, 255)
    circle_bg = (52, 40, 30, 255)

    cx, cy = SIZE // 2, SIZE // 2
    R = SIZE // 2 - 8

    # 渐变效果背景（多层圆）
    for i in range(10):
        alpha = 255 - i * 8
        r = R - i * 3
        c = (52 + i*3, 40 + i*2, 30 + i)
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(*c, 255))

    # 外环
    draw.ellipse([cx-R, cy-R, cx+R, cy+R], outline=gold, width=3)
    draw.ellipse([cx-R+10, cy-R+10, cx+R-10, cy+R-10], outline=gold_dark, width=1)

    # 莲花
    for j in range(8):
        a = math.radians(j * 45 + 22.5)
        dist = R * 0.55
        fx = cx + dist * math.cos(a)
        fy = cy + dist * math.sin(a)
        draw.ellipse([fx-R*0.11, fy-R*0.32, fx+R*0.11, fy+R*0.32], fill=gold, outline=gold_dark, width=1)

    # 中心
    cr = R * 0.25
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=gold_dark, outline=gold, width=2)

    # "禅"字
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", int(R * 0.28))
    except:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", int(R * 0.28))

    text = "禅"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw//2, cy - th//2 - bbox[1]), text, fill=cream, font=font)

    return img


def add_circle_bg(img):
    """确保是圆形（支付宝头像会自动裁圆，但做成圆形更保险）"""
    return img  # 保持方形透明背景


if __name__ == "__main__":
    versions = [
        ("logo-v1-lotus.png", make_version1_lotus, "莲花+兰字（经典金）"),
        ("logo-v2-seal.png", make_version2_text, "兰清堂印章（红底金字）"),
        ("logo-v3-lotus-clean.png", make_version3_lotus_clean, "纯净莲花（无字）"),
        ("logo-v4-zen.png", make_version4_zen, "禅意莲花+禅字"),
    ]

    print("正在生成4个版本的头像logo...\n")
    for filename, func, desc in versions:
        img = func()
        # 转RGB保存（支付宝需要不透明背景）
        final = Image.new("RGB", (SIZE, SIZE), (26, 20, 16))
        final.paste(img, (0, 0), img)
        path = os.path.join(OUTPUT_DIR, filename)
        final.save(path, "PNG")
        print(f"✅ {filename} - {desc} ({SIZE}x{SIZE})")

    print(f"\n所有版本已保存到: {OUTPUT_DIR}")
    print("请在浏览器打开 http://localhost:3000 查看效果，或直接到 public/ 目录查看图片")
