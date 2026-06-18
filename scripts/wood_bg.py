"""
收款码背景美化 - 两个版本
版本A（推荐）：外圈木色边框装饰，二维码保留白底（安全，可扫码）
版本B（激进）：全木色背景（高风险，扫码可能失败）
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
SOURCE = os.path.join(PUBLIC_DIR, "alipay-qr.png")
OUT_A = os.path.join(PUBLIC_DIR, "alipay-qr.png")      # 推荐（覆盖原文件）
OUT_B = os.path.join(PUBLIC_DIR, "alipay-qr-wood.png")  # 激进版

# 木色调色板
WOOD_LIGHT = (193, 154, 107, 255)   # 浅木色 #C19A6B
WOOD_MID = (139, 111, 71, 255)      # 中木色 #8B6F47
WOOD_DARK = (101, 78, 50, 255)      # 深木色 #654E32
WOOD_TEXTURE = (120, 95, 60, 255)   # 木纹色


def add_wood_texture(draw, x1, y1, x2, y2, base_color, texture_color):
    """给区域添加木纹纹理"""
    # 基色
    draw.rectangle([x1, y1, x2, y2], fill=base_color)
    # 添加木纹横线
    w = x2 - x1
    h = y2 - y1
    for i in range(0, h, 3):
        # 木纹深浅变化
        intensity = (math.sin(i * 0.3) + 1) / 2  # 0~1
        r = int(base_color[0] * (1 - intensity * 0.15) + texture_color[0] * intensity * 0.15)
        g = int(base_color[1] * (1 - intensity * 0.15) + texture_color[1] * intensity * 0.15)
        b = int(base_color[2] * (1 - intensity * 0.15) + texture_color[2] * intensity * 0.15)
        draw.line([(x1, y1 + i), (x2, y1 + i)], fill=(r, g, b), width=1)


def make_version_a():
    """
    版本A（推荐安全版）：
    - 二维码保留纯白底（确保可扫码）
    - 外圈装饰换成木色边框 + 木纹纹理
    - 更优雅的古风画框效果
    """
    src = Image.open(SOURCE).convert("RGBA")
    w, h = src.size

    # 创建新画布（比原图大，留出木色边框空间）
    border = 50
    new_size = w + border * 2
    img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. 整体深棕底
    draw.rectangle([0, 0, new_size, new_size], fill=(26, 20, 16, 255))

    # 2. 木色边框（带纹理）
    add_wood_texture(draw, 10, 10, new_size - 10, new_size - 10, WOOD_MID, WOOD_TEXTURE)

    # 3. 内圈金色细线
    gold = (212, 175, 119, 255)
    draw.rectangle([14, 14, new_size - 14, new_size - 14], outline=gold, width=2)
    draw.rectangle([border - 8, border - 8, new_size - border + 8, new_size - border + 8], outline=gold, width=1)

    # 4. 四角装饰（中式云纹简化）
    corner_size = 20
    corners = [
        (border - 8, border - 8),                          # 左上
        (new_size - border - corner_size + 8, border - 8),  # 右上
        (border - 8, new_size - border - corner_size + 8),  # 左下
        (new_size - border - corner_size + 8, new_size - border - corner_size + 8),  # 右下
    ]
    for cx, cy in corners:
        # 金色小菱形
        mid_x = cx + corner_size // 2
        mid_y = cy + corner_size // 2
        draw.polygon([
            (mid_x, cy), (cx + corner_size, mid_y),
            (mid_x, cy + corner_size), (cx, mid_y)
        ], fill=gold)

    # 5. 粘贴原二维码（居中，保留白底）
    img.paste(src, (border, border), src)

    # 转RGB保存
    out = Image.new("RGB", (new_size, new_size), (26, 20, 16))
    out.paste(img, (0, 0), img)
    out.save(OUT_A, "PNG")
    print(f"✅ 版本A（安全版）已保存: {OUT_A} ({new_size}x{new_size})")
    print("   二维码保留白底 → 可正常扫码")


def make_version_b():
    """
    版本B（激进版 - 全木色）：
    - 二维码背景也换成浅木色
    - ⚠️ 高风险：扫码识别率可能下降
    """
    src = Image.open(SOURCE).convert("RGBA")
    w, h = src.size
    pixels = src.load()

    # 创建木色版
    img = src.copy()
    draw = ImageDraw.Draw(img)

    # 将二维码的白色像素替换为浅木色
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # 白色区域（二维码背景）→ 浅木色
            if r > 200 and g > 200 and b > 200:
                # 添加轻微木纹变化
                variation = int(math.sin(x * 0.05 + y * 0.03) * 8)
                nr = min(255, WOOD_LIGHT[0] + variation)
                ng = min(255, WOOD_LIGHT[1] + variation)
                nb = min(255, WOOD_LIGHT[2] + variation)
                pixels[x, y] = (nr, ng, nb, a)

    out = Image.new("RGB", (w, h), (26, 20, 16))
    out.paste(img, (0, 0), img)
    out.save(OUT_B, "PNG")
    print(f"⚠️  版本B（全木色）已保存: {OUT_B} ({w}x{h})")
    print("   二维码背景已改木色 → 需实际测试扫码")


if __name__ == "__main__":
    print("=" * 50)
    print("兰清堂收款码 - 木色背景美化")
    print("=" * 50)
    make_version_a()
    print()
    make_version_b()
    print("\n" + "=" * 50)
    print("版本A（alipay-qr.png）：安全版，外圈木色边框，可扫码")
    print("版本B（alipay-qr-wood.png）：激进版，全木色，需测试")
    print("=" * 50)
