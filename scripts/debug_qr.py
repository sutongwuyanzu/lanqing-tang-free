"""纯PIL版二维码对比度检查"""
from PIL import Image
import os

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
final = Image.open(os.path.join(PUBLIC_DIR, "alipay-qr.png")).convert("L")
fw, fh = final.size
print(f"最终图: {fw}x{fh}")

# 检查二维码区域（排除边框和文字）
qr_region = final.crop((60, 130, 540, 520))
pixels = list(qr_region.getdata())
total = len(pixels)

# 统计黑白像素
dark = sum(1 for p in pixels if p < 80)
bright = sum(1 for p in pixels if p > 180)
mid = total - dark - bright

avg = sum(pixels) / total

print(f"二维码区域像素数: {total}")
print(f"黑色像素(<80): {dark/total:.1%}")
print(f"白色像素(>180): {bright/total:.1%}")
print(f"灰色像素: {mid/total:.1%}")
print(f"平均亮度: {avg:.1f}")
print(f"黑白对比: {'良好 - 可扫描' if dark/total > 0.15 and bright/total > 0.35 else '需要检查'}")

# 检查中心 logo 区域
center = final.crop((250, 260, 350, 360))
center_pixels = list(center.getdata())
center_dark = sum(1 for p in center_pixels if p < 100)
print(f"\n中心logo区域暗色比例: {center_dark/len(center_pixels):.1%} (说明logo已覆盖)")
