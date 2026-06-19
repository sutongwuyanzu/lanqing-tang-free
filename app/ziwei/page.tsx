"use client";

import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { generateChart } from "@/lib/ziwei/algorithm";
import type { BirthInfo, ZiweiChart, Palace } from "@/lib/ziwei/types";
import BirthForm from "@/components/ziwei/BirthForm";
import ChartBoard from "@/components/ziwei/ChartBoard";
import InsightPanel from "@/components/ziwei/InsightPanel";
import PatternsCard from "@/components/ziwei/PatternsCard";
import { ShareButton } from "@/components/ShareButton";

export default function ZiweiPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (info: BirthInfo) => {
    setLoading(true);
    // 模拟计算延迟（排盘本身是同步的，延迟给用户"正在计算"的感受）
    setTimeout(() => {
      const result = generateChart(info);
      setChart(result);
      setSelectedPalace(null);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setChart(null);
    setSelectedPalace(null);
  };

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
            <Sparkles className="h-7 w-7 text-gold" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">紫微斗数排盘</h1>
        <p className="text-sm text-text-secondary">输入生辰，排盘解命</p>
      </div>

      {/* 未起盘：出生表单 */}
      {!chart && (
        <div className="mx-auto max-w-lg">
          <BirthForm onSubmit={handleSubmit} loading={loading} />
          <div className="mt-6 card-classic p-5 text-center text-sm text-text-secondary space-y-2">
            <p>紫微斗数，中国传统命理学精华，以出生时辰排十二宫命盘。</p>
            <p className="text-xs text-text-muted">
              本排盘引擎基于开源库 iztro，默认采用三合派安星诀与生年四化表。
            </p>
          </div>
        </div>
      )}

      {/* 已起盘：命盘 + 解读 */}
      {chart && (
        <>
          {/* 重新起盘按钮 */}
          <div className="mb-4 flex items-center justify-between">
            <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4" /> 重新起盘
            </button>
            <ShareButton label="分享命盘" />
          </div>

          {/* 双栏布局 */}
          <div className="page-grid">
            {/* 左栏：命盘 + 解读 */}
            <div className="space-y-4">
              <ChartBoard
                chart={chart}
                onPalaceSelect={setSelectedPalace}
              />
              <InsightPanel
                chart={chart}
                selectedPalace={selectedPalace}
              />
            </div>

            {/* 右栏：格局 + 捐赠 */}
            <aside className="page-sidebar space-y-4">
              <PatternsCard chart={chart} />

              {/* 命盘信息摘要 */}
              <div className="card-classic p-4 text-xs text-text-secondary space-y-2">
                <div className="font-medium text-gold text-sm mb-2">命盘信息</div>
                <div>五行局：<span className="text-text-primary font-medium">{chart.wuxingJuName}</span></div>
                <div>命宫：<span className="text-text-primary">{chart.palaces.find(p => p.isMingGong)?.name || ''}</span></div>
                <div>身宫：<span className="text-text-primary">{chart.palaces.find(p => p.isShenGong)?.name || ''}</span></div>
                <div>当前年龄：<span className="text-text-primary">{chart.currentAge}岁</span></div>
                {chart.daXians[chart.currentDaXianIndex] && (
                  <div>当前大限：<span className="text-text-primary font-medium">
                    {chart.daXians[chart.currentDaXianIndex].startAge}–{chart.daXians[chart.currentDaXianIndex].endAge}岁 {chart.daXians[chart.currentDaXianIndex].palaceName}
                  </span></div>
                )}
              </div>

              {/* 提示 */}
              <div className="card-classic p-4 text-xs text-text-muted text-center space-y-1">
                <p>命盘展示的是倾向、结构与课题，不是绝对命定。</p>
                <p>后天选择与持续行动同样重要。</p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
