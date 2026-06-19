'use client';
import { useState, useMemo, useEffect } from 'react';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { PROVINCES } from '@/lib/ziwei/cities';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  gender: 'male' | 'female';
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  hideSubmit?: boolean;
}

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? '',
    city: initialData?.city ?? '',
    longitude: initialData?.longitude ?? 120,
    gender: initialData?.gender ?? 'male',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => { onFormSave?.({ ...form }); }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  const cityList = useMemo(() => {
    const prov = PROVINCES.find(p => p.name === form.province);
    return prov ? prov.cities : [];
  }, [form.province]);

  const branch = useMemo(() => {
    if (form.unknownTime) return 0;
    return calcTrueSolarBranch(parseInt(form.clockHour) || 0, parseInt(form.clockMinute) || 0, form.longitude);
  }, [form.clockHour, form.clockMinute, form.longitude, form.unknownTime]);

  const offsetMin = Math.round((form.longitude - 120) * 4);
  const shichenInfo = SHICHEN[branch];

  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;

  const errors = {
    year: !form.year ? '请选择出生年份' : y < 1900 || y > 2026 ? '年份范围：1900–2026' : '',
    month: !form.month ? '请选择月份' : '',
    day: !form.day ? '请选择日期' : form.year && form.month && !isValidDate(y, m, d) ? `${m}月没有${d}日` : '',
  };
  const hasError = Object.values(errors).some(Boolean);

  const steps = [
    !!form.year && !!form.month && !!form.day && !errors.year && !errors.month && !errors.day,
    !!form.province && !!form.city,
    form.unknownTime || (!!form.clockHour && !!form.clockMinute),
    true,
  ];
  const completedSteps = steps.filter(Boolean).length;

  const showSummary = steps[0] && steps[2] && !hasError;
  const summaryText = showSummary
    ? [`${y}年${m}月${d}日`, form.city || form.province, form.unknownTime ? '时辰不详' : `${SHICHEN_NAMES[branch]}时`, form.gender === 'male' ? '男' : '女'].filter(Boolean).join(' · ')
    : '';

  const handleProvince = (prov: string) => {
    const provData = PROVINCES.find(p => p.name === prov);
    const firstCity = provData?.cities[0];
    setForm({ ...form, province: prov, city: firstCity?.name || '', longitude: firstCity?.longitude ?? 120 });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? 120 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form });
    onSubmit({ year: y, month: m, day: d, hour: branch, gender: form.gender, name: form.name || undefined, province: form.province || undefined, city: form.city || undefined, longitude: form.province ? form.longitude : undefined });
  };

  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up card-classic p-6 space-y-4">
      <h3 className="text-center text-sm font-medium tracking-widest text-gold mb-4">
        ── 输入生辰八字 ──
      </h3>

      {/* 进度条 */}
      <div className="flex gap-1 mb-4">
        {steps.map((done, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{ background: done ? 'var(--color-gold)' : 'var(--color-border)' }} />
        ))}
      </div>

      {/* 姓名 */}
      <div>
        <label className="block text-xs text-text-muted mb-1.5 tracking-wide">姓名（可选）</label>
        <input type="text" placeholder="请输入姓名" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="input-classic" />
      </div>

      {/* 出生日期 */}
      <div>
        <label className="block text-xs text-text-muted mb-1.5 tracking-wide">出生日期（公历）</label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <select value={form.year} onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }} className="input-classic">
              <option value="">年份</option>
              {Array.from({ length: 127 }, (_, i) => 2026 - i).map(yr => <option key={yr} value={String(yr)}>{yr}</option>)}
            </select>
            {showErr('year') && errors.year && <p className="text-red-accent text-[11px] mt-1">✕ {errors.year}</p>}
          </div>
          <div>
            <select value={form.month} onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }} className="input-classic">
              <option value="">月份</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(mo => <option key={mo} value={String(mo)}>{mo} 月</option>)}
            </select>
            {showErr('month') && errors.month && <p className="text-red-accent text-[11px] mt-1">✕ {errors.month}</p>}
          </div>
          <div>
            <select value={form.day} onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }} className="input-classic">
              <option value="">日期</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(dy => <option key={dy} value={String(dy)}>{dy} 日</option>)}
            </select>
            {showErr('day') && errors.day && <p className="text-red-accent text-[11px] mt-1">✕ {errors.day}</p>}
          </div>
        </div>
      </div>

      {/* 出生地点 */}
      <div>
        <label className="block text-xs text-text-muted mb-1.5 tracking-wide">出生地点（用于真太阳时校正）</label>
        <div className="grid grid-cols-2 gap-2">
          <select value={form.province} onChange={e => handleProvince(e.target.value)} className="input-classic">
            <option value="">省份 / 直辖市</option>
            {PROVINCES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          <select value={form.city} onChange={e => handleCity(e.target.value)} disabled={!form.province}
            className="input-classic" style={{ opacity: form.province ? 1 : 0.45 }}>
            <option value="">{form.province ? '城市' : '先选省份'}</option>
            {cityList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          {form.province
            ? `${form.city || '（请选择城市）'} · 经度 ${form.longitude.toFixed(1)}°E · 时差 ${offsetMin > 0 ? '+' : ''}${offsetMin} 分钟`
            : '* 倪海夏批命用真太阳时，建议填写出生地以自动校正时辰'}
        </p>
      </div>

      {/* 出生时间 */}
      <div>
        <label className="block text-xs text-text-muted mb-1.5 tracking-wide">出生时间（北京时间）</label>
        <div className="rounded-xl p-3 border transition-opacity" style={{ background: 'var(--color-bg-input)', borderColor: 'var(--color-border)', opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto' }}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={form.clockHour} onChange={e => setForm({ ...form, clockHour: e.target.value })} className="input-classic">
              {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={String(h)}>{h.toString().padStart(2, '0')} 时</option>)}
            </select>
            <select value={form.clockMinute} onChange={e => setForm({ ...form, clockMinute: e.target.value })} className="input-classic">
              {Array.from({ length: 60 }, (_, i) => i).map(min => <option key={min} value={String(min)}>{min.toString().padStart(2, '0')} 分</option>)}
            </select>
          </div>
          <div className="text-center py-1">
            <span className="text-[10px] text-text-muted">真太阳时 → </span>
            <span className="text-base font-semibold text-gold tracking-wide">{SHICHEN_NAMES[branch]}时</span>
            {shichenInfo && <span className="text-[10px] text-text-muted ml-1">（{shichenInfo.range}）</span>}
          </div>
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input type="checkbox" checked={form.unknownTime} onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            className="w-3.5 h-3.5 rounded cursor-pointer" />
          <span className="text-[10px] text-text-muted">不知道出生时间，以子时（23:00–01:00）起盘</span>
        </label>
      </div>

      {/* 性别 */}
      <div>
        <label className="block text-xs text-text-muted mb-1.5 tracking-wide">性别</label>
        <div className="flex gap-3">
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            return (
              <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                style={{
                  background: active ? (isMale ? 'rgba(92,122,74,0.1)' : 'rgba(194,92,92,0.1)') : 'var(--color-bg-input)',
                  borderColor: active ? (isMale ? 'var(--color-gold)' : 'var(--color-red-accent)') : 'var(--color-border)',
                  color: active ? (isMale ? 'var(--color-gold)' : 'var(--color-red-accent)') : 'var(--color-text-muted)',
                }}>
                {isMale ? '♂ 男' : '♀ 女'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 确认信息 */}
      {showSummary && (
        <div className="animate-fade-in rounded-xl p-3 border flex items-center gap-2"
          style={{ background: 'rgba(92,122,74,0.06)', borderColor: 'rgba(92,122,74,0.2)' }}>
          <span className="text-sm text-gold">✓</span>
          <span className="text-xs text-gold tracking-wide">{summaryText}</span>
        </div>
      )}

      {/* 提交按钮 */}
      {!hideSubmit && (
        <button type="submit" disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              紫微起盘中…
            </>
          ) : '立即起盘 · 解命运密码'}
        </button>
      )}
    </form>
  );
}
