import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}) {
  const base = 'btn';
  const variantClass =
    variant === 'ghost'
      ? 'btn-ghost'
      : variant === 'danger'
      ? 'btn-danger'
      : variant === 'success'
      ? 'btn-success'
      : 'btn-primary';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${base} ${variantClass} ${sizeClass} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`chip ${className}`}>{children}</span>;
}

export function SevBadge({ value }: { value: 'High' | 'Medium' | 'Low' }) {
  const className = value === 'High' ? 'severity-high' : value === 'Medium' ? 'severity-medium' : 'severity-low';
  return <Badge className={className}>{value}</Badge>;
}

export function Tile({
  label,
  value,
  sub,
  color = '#4338ca',
  spark,
  planned,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  color?: string;
  spark?: number[];
  planned?: number[];
}) {
  return (
    <div className="tile p-4">
      <div className="text-xs text-slate-500 uppercase tracking-[0.12em] font-semibold">{label}</div>
      <div className="flex items-end justify-between gap-4 mt-2">
        <div>
          <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          {sub ? <div className="text-xs text-slate-500">{sub}</div> : null}
        </div>
        {spark ? <Sparkline values={spark} planned={planned} color={color} /> : null}
      </div>
    </div>
  );
}

export function Sparkline({
  values,
  planned,
  color = '#4338ca',
  width = 120,
  height = 36,
}: {
  values: number[];
  planned?: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (!values.length) return null;
  const minValue = Math.min(...values, ...(planned || []));
  const maxValue = Math.max(...values, ...(planned || []));
  const range = maxValue - minValue || 1;
  const xFn = (index: number) => (index / (values.length - 1)) * (width - 4) + 2;
  const yFn = (value: number) => height - ((value - minValue) / range) * (height - 4) - 2;
  const path = values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xFn(index).toFixed(2)},${yFn(value).toFixed(2)}`).join(' ');
  const plannedPath = planned
    ? planned.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xFn(index).toFixed(2)},${yFn(value).toFixed(2)}`).join(' ')
    : '';
  const areaPath = `M ${xFn(0).toFixed(2)} ${height - 2} ${path} L ${xFn(values.length - 1).toFixed(2)} ${height - 2} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <path d={areaPath} fill={color} fillOpacity="0.08" />
      {planned ? <path d={plannedPath} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" fill="none" /> : null}
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="kbd">{children}</span>;
}
