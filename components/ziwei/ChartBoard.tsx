'use client';
import { useState } from 'react';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import PalaceCell from './PalaceCell';
import TimeNav, { type TimeView, getYearStemIndex, buildSiHuaOverlay } from './TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [branch, (branch + 6) % 12, (branch + 4) % 12, (branch + 8) % 12];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

export default function ChartBoard({ chart, onStarSelect, onPalaceSelect, onSiHuaClick }: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState<number>(new Date().getFullYear());

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData: Record<string, string> = (() => {
    if (timeView === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (timeView === 'liunian') return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    return {};
  })();
  const overlayLabel = timeView === 'daxian' ? '限' : timeView === 'liunian' ? '年' : undefined;

  const handlePalaceClick = (branch: number) => {
    const isDeselecting = selectedBranch === branch;
    setSelectedBranch(prev => prev === branch ? null : branch);
    if (!isDeselecting) {
      const palace = palaceMap[branch];
      if (palace) onPalaceSelect?.(palace);
    }
  };

  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  return (
    <div className="w-full select-none">
      <TimeNav chart={chart} view={timeView} liunianYear={liunianYear} onViewChange={setTimeView} onYearChange={setLiunianYear} />

      {/* 命盘标题 */}
      <div className="animate-fade-in-up text-center mb-3">
        <div className="text-[10px] tracking-[0.5em] uppercase mb-1" style={{ color: 'var(--t-faint)' }}>
          Zi Wei Dou Shu
        </div>
        <h2 className="text-sm tracking-[0.25em] font-medium" style={{ color: 'var(--t-gold)' }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}紫微斗数命盘
        </h2>
      </div>

      {/* 4x4 命盘网格 */}
      <div
        className="grid rounded-xl overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          gap: '1px',
          background: 'var(--t-border)',
          border: '1px solid var(--t-border)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col, background: 'var(--t-bg)' }}>
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                overlayStarSiHua={Object.keys(overlayData).length > 0 ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, timeView)}
              />
            </div>
          );
        })}

        {/* 中央信息区 */}
        <div
          className="animate-fade-in flex flex-col items-center justify-center p-4 gap-3"
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4', background: 'var(--t-bg)' }}
        >
          <div className="text-5xl select-none leading-none" style={{ color: 'var(--t-gold)', opacity: 0.12 }}>
            ☯
          </div>
          <div className="text-center space-y-1">
            <div className="text-[9px] tracking-[0.3em] font-medium" style={{ color: 'var(--t-gold)' }}>紫微斗数</div>
            <div className="text-[10px] space-y-0.5" style={{ color: 'var(--t-faint)' }}>
              <div>命宫 <span style={{ color: 'var(--t-gold)', opacity: 0.7 }}>{BRANCHES[chart.mingGongBranch]}</span></div>
              <div>身宫 <span className="text-sky-500/70">{BRANCHES[chart.shenGongBranch]}</span></div>
              <div className="text-[9px]" style={{ color: 'var(--t-gold)', opacity: 0.75 }}>{chart.wuxingJuName}</div>
            </div>
          </div>

          {chart.currentDaXianIndex >= 0 && (() => {
            const dx = chart.daXians[chart.currentDaXianIndex];
            return (
              <div className="border border-purple-500/30 rounded-lg px-3 py-1.5 text-center"
                style={{ background: 'rgba(147,51,234,0.06)' }}>
                <div className="text-[8px] text-purple-500/80 mb-0.5 tracking-wider">当前大限</div>
                <div className="text-[12px] text-purple-400 font-medium tabular-nums">{dx.startAge}–{dx.endAge}岁</div>
                <div className="text-[9px] text-purple-500/60">{dx.palaceName}</div>
              </div>
            );
          })()}

          <div className="text-[8px] text-center leading-relaxed font-mono" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
            {chart.lunarInfo.lunarYear}·{chart.lunarInfo.isLeapMonth ? '闰' : ''}{chart.lunarInfo.lunarMonth}·{chart.lunarInfo.lunarDay}
          </div>
        </div>

        {/* 三方四正 SVG 连线 */}
        {sanFangBranches !== null && (
          <div className="pointer-events-none animate-fade-in" style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              {(() => {
                const [p0, p1, p2, p3] = sanFangBranches.map(b => BRANCH_SVG_POS[b]);
                const dash = "6,5";
                const stroke = "rgba(92,122,74,0.55)";
                const sw = "1.5";
                return (
                  <>
                    <line x1={`${p0[0]}%`} y1={`${p0[1]}%`} x2={`${p1[0]}%`} y2={`${p1[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    <line x1={`${p0[0]}%`} y1={`${p0[1]}%`} x2={`${p2[0]}%`} y2={`${p2[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    <line x1={`${p2[0]}%`} y1={`${p2[1]}%`} x2={`${p3[0]}%`} y2={`${p3[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    <line x1={`${p3[0]}%`} y1={`${p3[1]}%`} x2={`${p0[0]}%`} y2={`${p0[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    {[p0, p1, p2, p3].map((p, i) => (
                      <circle key={i} cx={`${p[0]}%`} cy={`${p[1]}%`} r="3" fill={i === 0 ? 'rgba(92,122,74,0.8)' : 'rgba(92,122,74,0.45)'} />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="animate-fade-in mt-3 flex items-center justify-center gap-2 text-[9px] flex-wrap">
        {[
          { h: '化禄', c: 'text-emerald-500 border-emerald-500/30' },
          { h: '化权', c: 'text-blue-500 border-blue-500/30' },
          { h: '化科', c: 'text-yellow-500 border-yellow-500/30' },
          { h: '化忌', c: 'text-red-500 border-red-500/30' },
        ].map(({ h, c }) => (
          <span key={h} className={`border px-1.5 py-0.5 rounded-full font-medium ${c}`}>{h}</span>
        ))}
        <span className="px-1.5 py-0.5 rounded-full" style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}>
          点击宫位看三方四正
        </span>
      </div>
    </div>
  );
}
