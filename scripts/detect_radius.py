"""
精准检测二维码中心头像的真实半径
通过分析像素分布找出头像边缘
"""
from PIL import Image
import os
import math

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
QR_FILE = os.path.join(PUBLIC_DIR, "alipay-qr.png")

def detect_avatar_radius():
    """检测头像区域半径"""
    # 重新从美化前的原始二维码开始检测
    # 当前 alipay-qr.png 已经被白色覆盖过，需要看二维码本身的定位点
    img = Image.open(QR_FILE).convert("L")
    w, h = img.size
    cx, cy = 320, 320

    print(f"图像: {w}x{h}, 中心: ({cx},{cy})")
    print("\n沿不同角度扫描中心区域，找出头像边界：")
    print("(头像区域是连续的非黑白像素，二维码是纯黑白)")

    # 扫描从中心向外的多条射线
    avatar_radii = []
    for angle_deg in range(0, 360, 30):
        angle = math.radians(angle_deg)
        # 从中心向外扫描，记录像素值
        last_pure = 0  # 最后一个"纯黑或纯白"的位置
        for dist in range(20, 130):
            px = int(cx + dist * math.cos(angle))
            py = int(cy + dist * math.sin(angle))
            if not (0 <= px < w and 0 <= py < h):
                break
            v = img.getpixel((px, py))
            # 二维码像素：纯黑(<50)或纯白(>200)
            # 头像像素：灰色或彩色（中间值）
            is_pure = (v < 50) or (v > 200)
            if is_pure:
                last_pure = dist

        # 头像半径 ≈ 最后一个纯像素之前的位置
        # 但白色覆盖区域也是"纯白"，所以要从外向内找
        # 找第一个连续纯白区域（我们的白色覆盖）结束的地方
        white_start = None
        white_end = None
        for dist in range(130, 20, -1):
            px = int(cx + dist * math.cos(angle))
            py = int(cy + dist * math.sin(angle))
            if not (0 <= px < w and 0 <= py < h):
                continue
            v = img.getpixel((px, py))
            if v > 200:  # 白色
                if white_end is None:
                    white_end = dist
                white_start = dist
            else:
                if white_end is not None:
                    break  # 白色区域结束

        if white_end and white_start:
            # 白色覆盖的外边缘就是头像原来的外边缘
            avatar_radii.append(white_end)

    if avatar_radii:
        max_r = max(avatar_radii)
        avg_r = sum(avatar_radii) / len(avatar_radii)
        print(f"\n白色覆盖外边缘（=原头像半径）:")
        print(f"  各角度: {avatar_radii}")
        print(f"  最大: {max_r}px, 平均: {avg_r:.0f}px")
        print(f"\n建议覆盖半径: {max_r + 10}px（留余量）")
        return max_r + 10
    else:
        print("未能检测到，使用默认值")
        return 100

if __name__ == "__main__":
    r = detect_avatar_radius()
    print(f"\n→ 应使用覆盖半径: {r}")
