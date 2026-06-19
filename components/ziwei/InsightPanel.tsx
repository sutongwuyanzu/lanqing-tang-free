'use client';
import { useState, useMemo } from 'react';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS, SI_HUA_TABLE } from '@/lib/ziwei/constants';
import { detectPatterns } from '@/lib/ziwei/patterns';

const TOPICS = [
  { key: 'overview', label: '命格' },
  { key: 'love', label: '感情' },
  { key: 'career', label: '事业' },
  { key: 'wealth', label: '财运' },
  { key: 'health', label: '健康' },
  { key: 'personality', label: '性格' },
] as const;

const PALACE_ROLES: Record<string, string> = {
  '命宫': '自我、性格、先天格局',
  '兄弟宫': '兄弟关系、合伙人',
  '夫妻宫': '感情关系、婚姻状态',
  '子女宫': '子女缘分、下属关系',
  '财帛宫': '财运来源、收入方式',
  '疾厄宫': '身体健康、意外',
  '迁移宫': '外出机遇、人际格局',
  '交友宫': '朋友圈、贵人、小人',
  '官禄宫': '事业成就、社会地位',
  '田宅宫': '不动产、家庭环境',
  '福德宫': '精神享受、内心福分',
  '父母宫': '父母关系、文书契约',
};

function getStarDesc(starName: string): string {
  const d = STAR_DESCRIPTIONS[starName];
  return d ? `${d.keywords}（${d.nature}·${d.element}）` : '';
}

function getPalaceStars(palace: Palace): string {
  const majors = palace.stars.filter(s => s.type === 'major');
  if (majors.length === 0) return '空宫';
  return majors.map(s => {
    const bright = s.brightness === 'bright' ? '（庙旺）' : s.brightness === 'dim' ? '（落陷）' : '';
    const hua = s.siHua ? `化${s.siHua}` : '';
    return `${s.name}${bright}${hua}`;
  }).join('、');
}

function getSanFang(palaceName: string, chart: ZiweiChart): Palace[] {
  const palace = chart.palaces.find(p => p.name === palaceName);
  if (!palace) return [];
  const branch = palace.branch;
  const sfBranches = [(branch + 6) % 12, (branch + 4) % 12, (branch + 8) % 12];
  return chart.palaces.filter(p => sfBranches.includes(p.branch));
}

function getSihuaInfo(stemIndex: number): string {
  const stars = SI_HUA_TABLE[stemIndex];
  if (!stars) return '';
  return `化禄入${stars[0]}、化权入${stars[1]}、化科入${stars[2]}、化忌入${stars[3]}`;
}

// ─── 各主题解读生成 ──────────────────────────────────────
function generateInterpretation(chart: ZiweiChart, topic: string, selectedPalace?: Palace | null): string {
  const mingGong = chart.palaces.find(p => p.isMingGong);
  const fuQi = chart.palaces.find(p => p.name === '夫妻宫');
  const guanLu = chart.palaces.find(p => p.name === '官禄宫');
  const caiBo = chart.palaces.find(p => p.name === '财帛宫');
  const jiE = chart.palaces.find(p => p.name === '疾厄宫');
  const tianZhai = chart.palaces.find(p => p.name === '田宅宫');
  const fuDe = chart.palaces.find(p => p.name === '福德宫');
  const qianYi = chart.palaces.find(p => p.name === '迁移宫');

  const mingStars = mingGong ? mingGong.stars.filter(s => s.type === 'major') : [];
  const mingStarNames = mingStars.map(s => s.name);
  const sihua = getSihuaInfo(chart.lunarInfo.yearStem);
  const patterns = detectPatterns(chart);
  const dx = chart.daXians[chart.currentDaXianIndex];
  const dxPalace = dx ? chart.palaces.find(p => p.branch === dx.palaceBranch) : null;

  // 通用结构
  const sections: string[] = [];

  if (topic === 'overview') {
    sections.push(`**【命格定性】**`);
    sections.push(mingStars.length > 0
      ? `命宫主星${mingStarNames.join('、')}，${getStarDesc(mingStarNames[0])}。${mingGong?.isEmpty === false ? '命宫有主星坐守，先天格局明朗。' : '命宫空借对宫之力，后天努力尤为关键。'}`
      : `命宫空宫，借对宫${mingGong?.borrowedFromName || ''}之力。后天格局靠自身修行为主。`);
    sections.push('');
    sections.push(`**【主星解读】**`);
    mingStars.forEach(s => {
      const d = STAR_DESCRIPTIONS[s.name];
      if (d) sections.push(`${s.name}：${d.keywords}，属${d.element}，性质${d.nature}。${s.brightness === 'bright' ? '星曜庙旺，能量充足，正面特质发挥明显。' : s.brightness === 'dim' ? '星曜落陷，正面特质打折，需注意负面表现。' : '星曜平位，中性表现。'}`);
    });
    sections.push('');
    sections.push(`**【三方四正】**`);
    const sf = mingGong ? getSanFang('命宫', chart) : [];
    sf.forEach(p => {
      const stars = p.stars.filter(s => s.type === 'major');
      sections.push(`${p.name}：${stars.length > 0 ? stars.map(s => s.name).join('、') : '空宫'}（${PALACE_ROLES[p.name] || ''}）`);
    });
    sections.push('');
    sections.push(`**【四化】**`);
    sections.push(`${chart.lunarInfo.yearStem}年生人四化：${sihua}。`);
    sections.push('');
    if (patterns.length > 0) {
      sections.push(`**【格局】**`);
      patterns.slice(0, 3).forEach(p => sections.push(`·${p.name}：${p.description}`));
      sections.push('');
    }
    if (dx && dxPalace) {
      sections.push(`**【当前大限】**`);
      sections.push(`${dx.startAge}–${dx.endAge}岁，大限在${dx.palaceName}。${dxPalace.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫'}坐守，${dx.palaceName === '命宫' ? '回归本命，重新定位' : `${PALACE_ROLES[dx.palaceName] || ''}领域为重点`}`);
    }
  } else if (topic === 'personality') {
    sections.push(`**【命宫主星性格】**`);
    mingStars.forEach(s => {
      const d = STAR_DESCRIPTIONS[s.name];
      if (d) sections.push(`${s.name}：${d.keywords}。${s.name === '紫微' ? '帝王气质，自尊心强，有领导欲。' : s.name === '天机' ? '思维敏捷，善于谋划，但易多虑。' : s.name === '太阳' ? '热情大方，乐于付出，有官贵之气。' : s.name === '武曲' ? '刚毅果断，重财轻义，执行力强。' : s.name === '天同' ? '温和随缘，享受生活，不喜争斗。' : s.name === '廉贞' ? '多才多艺，情绪起伏，桃花重。' : s.name === '天府' ? '稳重保守，财库丰盈，安逸守成。' : s.name === '太阴' ? '细腻敏感，审美出众，内敛温柔。' : s.name === '贪狼' ? '欲望强烈，多才多艺，交际广泛。' : s.name === '巨门' ? '口才出众，善辩是非，疑心较重。' : s.name === '天相' ? '辅佐之才，行政能力强，循规蹈矩。' : s.name === '天梁' ? '荫护他人，有医药缘，长辈缘佳。' : s.name === '七杀' ? '将星之命，果决刚毅，孤独克苦。' : s.name === '破军' ? '开创变动，破坏重建，不安于现状。' : ''}`);
    });
    sections.push('');
    sections.push(`**【三方性格综合】**`);
    const sf = mingGong ? getSanFang('命宫', chart) : [];
    sf.forEach(p => {
      const stars = p.stars.filter(s => s.type === 'major');
      if (stars.length > 0) sections.push(`${p.name}（${PALACE_ROLES[p.name]}）：${stars.map(s => s.name).join('、')}`);
    });
    sections.push('');
    sections.push(`**【优势与课题】**`);
    sections.push(`优势：${mingStars.length > 0 ? `${mingStarNames[0]}的正面特质——${getStarDesc(mingStarNames[0])}` : '后天塑造能力强'}。`);
    sections.push(`课题：${mingStars.some(s => s.brightness === 'dim') ? '星曜落陷，需修炼短板，化煞为用。' : '善用三方四正的资源，全面发展。'}`);
  } else if (topic === 'career') {
    const star = guanLu?.stars.find(s => s.type === 'major');
    sections.push(`**【事业格局】**`);
    sections.push(`官禄宫主星：${star ? `${star.name}（${getStarDesc(star.name)}）` : '空宫'}。${star ? `以${STAR_DESCRIPTIONS[star.name]?.element || ''}属行业为宜。` : '事业方向需综合命宫三方判断。'}`);
    sections.push('');
    sections.push(`**【官禄宫分析】**`);
    sections.push(`官禄宫星曜：${guanLu ? getPalaceStars(guanLu) : '无数据'}。`);
    sections.push(`三方联动：命宫${mingStarNames.join('、') || '空'}+ 财帛${caiBo?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空'}+ 迁移${qianYi?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空'}。`);
    sections.push('');
    if (dx && dxPalace) {
      sections.push(`**【当前大限事业运】**`);
      sections.push(`${dx.startAge}–${dx.endAge}岁大限在${dx.palaceName}，${dxPalace.stars.filter(s => s.type === 'major').map(s => s.name).join('、') || '空宫'}。`);
    }
    sections.push('');
    sections.push(`**【建议】**`);
    sections.push(`适合方向：${star ? `${STAR_DESCRIPTIONS[star.name]?.element || ''}相关行业` : '综合命宫特质选择'}。`);
  } else if (topic === 'wealth') {
    const star = caiBo?.stars.find(s => s.type === 'major');
    sections.push(`**【财运格局】**`);
    sections.push(`财帛宫主星：${star ? `${star.name}（${getStarDesc(star.name)}）` : '空宫'}。`);
    sections.push('');
    sections.push(`**【财帛宫分析】**`);
    sections.push(`星曜：${caiBo ? getPalaceStars(caiBo) : '无数据'}。`);
    sections.push(`${star ? `${star.name}在财帛宫，${star.brightness === 'bright' ? '庙旺利财，进财能力强。' : star.brightness === 'dim' ? '落陷不利财，需注意守财。' : '中性，财运平稳。'}` : ''}`);
    sections.push('');
    sections.push(`**【田宅宫（财库）】**`);
    sections.push(`田宅宫星曜：${tianZhai ? getPalaceStars(tianZhai) : '无数据'}。${tianZhai?.stars.some(s => s.type === 'major') ? '有主星坐守财库，积蓄能力较强。' : '财库空虚，需主动理财规划。'}`);
    sections.push('');
    if (dx && dxPalace) {
      sections.push(`**【当前大限财运】**`);
      sections.push(`${dx.startAge}–${dx.endAge}岁大限在${dx.palaceName}，注意该阶段财务波动。`);
    }
  } else if (topic === 'love') {
    const star = fuQi?.stars.find(s => s.type === 'major');
    sections.push(`**【感情格局】**`);
    sections.push(`夫妻宫主星：${star ? `${star.name}（${getStarDesc(star.name)}）` : '空宫'}。`);
    sections.push('');
    sections.push(`**【夫妻宫分析】**`);
    sections.push(`星曜：${fuQi ? getPalaceStars(fuQi) : '无数据'}。`);
    sections.push(`${star ? `${star.name}在夫妻宫，${star.name === '紫微' ? '配偶有领导气质，关系中对方主导。' : star.name === '天机' ? '配偶聪慧善变，感情需要智慧经营。' : star.name === '太阳' ? '配偶热情慷慨，男命得贤妻。' : star.name === '武曲' ? '配偶刚毅务实，感情偏理性。' : star.name === '天同' ? '配偶温和体贴，感情生活安逸。' : star.name === '廉贞' ? '感情波折多，桃花较重。' : star.name === '天府' ? '配偶稳重可靠，感情安定。' : star.name === '太阴' ? '配偶温柔细腻，感情丰富。' : star.name === '贪狼' ? '感情热烈但不稳定，桃花重。' : star.name === '巨门' ? '口舌是非多，需注意沟通方式。' : star.name === '天相' ? '配偶辅佐型，关系和谐。' : star.name === '天梁' ? '配偶有荫护之心，年龄差可能较大。' : star.name === '七杀' ? '感情激烈，聚散无常。' : star.name === '破军' ? '感情变动大，需包容理解。' : ''}` : '夫妻宫空宫，感情需靠自身主动争取。'}`);
    sections.push('');
    sections.push(`**【福德宫（感情精神层面）】**`);
    sections.push(`福德宫星曜：${fuDe ? getPalaceStars(fuDe) : '无数据'}。`);
  } else if (topic === 'health') {
    const star = jiE?.stars.find(s => s.type === 'major');
    sections.push(`**【疾厄宫主星】**`);
    sections.push(`星曜：${jiE ? getPalaceStars(jiE) : '无数据'}。`);
    sections.push(`${star ? `${star.name}在疾厄宫，${STAR_DESCRIPTIONS[star.name]?.element || ''}属性，需关注相关脏腑。` : '疾厄宫空宫，健康方面相对平顺，但不可忽视。'}`);
    sections.push('');
    sections.push(`**【主要风险】**`);
    sections.push(`${star ? `主星${star.name}属${STAR_DESCRIPTIONS[star.name]?.element || ''}，` : ''}${star?.brightness === 'dim' ? '星曜落陷，该方面健康需重点关注。' : '星曜尚可，注意日常保养即可。'}`);
    sections.push('');
    if (dx && dxPalace) {
      sections.push(`**【大限健康走势】**`);
      sections.push(`${dx.startAge}–${dx.endAge}岁大限在${dx.palaceName}，${dxPalace.stars.some(s => s.type === 'sha') ? '有煞星，注意该阶段健康。' : '整体平稳。'}`);
    }
    sections.push('');
    sections.push(`**【预防建议】**`);
    sections.push(`命盘呈示的健康课题仅供参考，具体请结合现实体检与医嘱。`);
  }

  // 选中宫位分析
  if (selectedPalace) {
    sections.push('');
    sections.push(`**【${selectedPalace.name}详解】**`);
    sections.push(`宫位主管：${PALACE_ROLES[selectedPalace.name] || ''}`);
    sections.push(`星曜：${getPalaceStars(selectedPalace)}`);
    const palMajors = selectedPalace.stars.filter(s => s.type === 'major');
    palMajors.forEach(s => {
      const d = STAR_DESCRIPTIONS[s.name];
      if (d) sections.push(`${s.name}：${d.keywords}，${d.nature}。`);
    });
    if (selectedPalace.isEmpty) {
      sections.push(`空宫，借对宫${selectedPalace.borrowedFromName || ''}之力。${selectedPalace.borrowedStars?.join('、') || ''}`);
    }
  }

  return sections.join('\n');
}

// ─── Markdown 渲染 ──────────────────────────────────────
function RenderContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide text-gold">【{sectionMatch[1]}】</span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        if (line.startsWith('·')) {
          return <div key={i} className="text-[11px] leading-relaxed pl-2 text-text-secondary">{line}</div>;
        }
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed text-text-secondary">
            {parts.map((part, j) => j % 2 === 0 ? part : <strong key={j} className="font-medium text-text-primary">{part}</strong>)}
          </div>
        );
      })}
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────
interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
}

export default function InsightPanel({ chart, selectedPalace }: InsightPanelProps) {
  const [activeTopic, setActiveTopic] = useState<string>('overview');

  const content = useMemo(
    () => generateInterpretation(chart, activeTopic, selectedPalace),
    [chart, activeTopic, selectedPalace],
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}>
      {/* 主题按钮 */}
      <div className="px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTopic(t.key)}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(92,122,74,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(92,122,74,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 解读内容 */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="text-[9px] tracking-widest mb-3 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
          <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
          命理解读 · 倪海夏体系
        </div>
        <RenderContent text={content} />
        {selectedPalace && (
          <div className="mt-4 pt-3 text-[10px]" style={{ borderTop: '1px solid var(--t-border)', color: 'var(--t-faint)' }}>
            点击命盘其他宫位可查看该宫详解
          </div>
        )}
      </div>
    </div>
  );
}
