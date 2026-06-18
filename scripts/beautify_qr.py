"""
兰清堂 - 支付宝收款码美化 V2
改进：精准裁剪 + 对比度增强 + 二值化，确保可扫描
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import os
import math

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
ORIGINAL = os.path.join(PUBLIC_DIR, "alipay-original.png")
OUTPUT = os.path.join(PUBLIC_DIR, "alipay-qr.png")


def extract_qr_precise():
    """精准提取二维码并二值化，保证可扫描"""
    img = Image.open(ORIGINAL).convert("L")  # 转灰度
    w, h = img.size
    print(f"原图: {w}x{h}")

    # 竖版图 1182x1772
    # 支付宝二维码核心区：约占宽度65-70%，居中，垂直略偏上
    qr_size = int(w * 0.68)  # 803
    left = (w - qr_size) // 2  # 189
    top = int(h * 0.22)        # 389
    right = left + qr_size
    bottom = top + qr_size

    qr = img.crop((left, top, right, bottom))
    print(f"二维码裁剪: {qr.size}")

    # 二值化：阈值140，纯黑纯白，保证扫码识别
    qr = qr.point(lambda p: 0 if p < 140 else 255, "1")
    qr = qr.convert("L")  # 转回灰度模式方便后续处理

    return qr


def create_lotus_logo(size):
    """兰清堂莲花logo"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    r = size // 2 - 3

    gold = (212, 175, 119, 255)
    bg = (42, 32, 24, 255)
    gold_dark = (160, 130, 75, 255)

    # 背景圆
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=bg, outline=gold, width=2)

    # 莲花瓣
    petal_r = r * 0.42
    petal_dist = r * 0.55
    for i in range(6):
        angle = math.radians(i * 60 + 30)
        px = cx + petal_dist * math.cos(angle)
        py = cy + petal_dist * math.sin(angle)
        draw.ellipse(
            [px - petal_r * 0.45, py - petal_r * 0.7,
             px + petal_r * 0.45, py + petal_r * 0.7],
            fill=gold, outline=gold_dark, width=1
        )

    # 中心圆
    cr = r * 0.25
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=gold)

    return img


def build_final():
    """合成最终美化版"""
    # 1. 提取并二值化二维码
    qr = extract_qr_precise()
    qr_w, qr_h = qr.size

    # 2. 创建logo
    logo_size = int(qr_w * 0.20)
    logo = create_lotus_logo(logo_size)

    # 3. logo 白底圆（支付宝容错设计）
    pad = 16
    disc = Image.new("RGBA", (logo_size + pad * 2, logo_size + pad * 2), (0, 0, 0, 0))
    ddraw = ImageDraw.Draw(disc)
    ddraw.ellipse([0, 0, disc.width - 1, disc.height - 1], fill=(255, 255, 255, 255))
    disc.paste(logo, (pad, pad), logo)

    # 4. 贴到二维码中心
    qr_rgba = qr.convert("RGBA")
    cx, cy = qr_w // 2, qr_h // 2
    pos = (cx - disc.width // 2, cy - disc.height // 2)
    qr_rgba.paste(disc, pos, disc)

    # ====== 合成最终图 ======
    FS = 640
    final = Image.new("RGBA", (FS, FS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(final)

    bg = (26, 20, 16, 255)        # #1a1410
    gold = (212, 175, 119, 255)
    gold_dim = (150, 125, 80, 255)

    # 背景
    draw.rectangle([0, 0, FS, FS], fill=bg)

    # 金色双层边框
    m = 12
    draw.rectangle([m, m, FS - m, FS - m], outline=gold_dim, width=1)
    draw.rectangle([m + 5, m + 5, FS - m - 5, FS - m - 5], outline=gold, width=1)

    # 字体
    def get_font(size):
        for fp in ["C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/simhei.ttf", "C:/Windows/Fonts/simsun.ttc"]:
            if os.path.exists(fp):
                return ImageFont.truetype(fp, size)
        return ImageFont.load_default()

    f_title = get_font(38)
    f_sub = get_font(20)

    # 标题"兰清堂"
    title = "兰清堂"
    bbox = draw.textbbox((0, 0), title, font=f_title)
    tw = bbox[2] - bbox[0]
    draw.text(((FS - tw) // 2, 30), title, fill=gold, font=f_title)

    # 副标题
    sub = "· 祈福功德 ·"
    bbox = draw.textbbox((0, 0), sub, font=f_sub)
    sw = bbox[2] - bbox[0]
    draw.text(((FS - sw) // 2, 78), sub, fill=gold_dim, font=f_sub)

    # 二维码区域（白色衬底 + 金色细边）
    qr_size = FS - 130
    qr_resized = qr_rgba.resize((qr_size, qr_size), Image.LANCZOS)
    qr_x = (FS - qr_size) // 2
    qr_y = 118

    # 白色背景块
    draw.rectangle([qr_x - 6, qr_y - 6, qr_x + qr_size + 5, qr_y + qr_size + 5], fill=(255, 255, 255, 255))
    # 金色细边
    draw.rectangle([qr_x - 7, qr_y - 7, qr_x + qr_size + 6, qr_y + qr_size + 6], outline=gold_dim, width=1)

    final.paste(qr_resized, (qr_x, qr_y), qr_resized)

    # 底部文字
    bottom = "扫码祈福 · 心诚则灵"
    bbox = draw.textbbox((0, 0), bottom, font=f_sub)
    bw = bbox[2] - bbox[0]
    draw.text(((FS - bw) // 2, FS - 48), bottom, fill=gold_dim, font=f_sub)

    # 保存
    out = Image.new("RGB", (FS, FS), (26, 20, 16))
    out.paste(final, (0, 0), final)
    out.save(OUTPUT, "PNG")
    print(f"✅ 已保存: {OUTPUT} ({FS}x{FS})")

    # 验证对比度
    gray = out.convert("L")
    region = gray.crop((qr_x + 10, qr_y + 10, qr_x + qr_size - 10, qr_y + qr_size - 10))
    pixels = list(region.get_flattened_data() if hasattr(region, 'get_flattened_data') else region.getdata())
    dark = sum(1 for p in pixels if p < 100) / len(pixels)
    bright = sum(1 for p in pixels if p > 200) / len(pixels)
    print(f"二维码 黑:{dark:.0%} 白:{bright:.0%} → {'✅对比良好' if dark > 0.2 and bright > 0.4 else '⚠️需检查'}")


if __name__ == "__main__":
    build_final()
