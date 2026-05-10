import type { KpiSnapshot, RiskItem, Study } from '../types';

interface Props {
  study: Study;
  kpi: KpiSnapshot;
  risks: RiskItem[];
  openCite: (cite: { studyId: string; kpiId: string; weekStart: string; label: string }) => void;
}

const bullet = (label: string, value: string | number, note?: string) => (
  <li className="mb-3">
    <div className="font-semibold text-slate-800">{label}</div>
    <div className="text-sm text-slate-600">{value}{note ? <span className="text-xs text-slate-500"> {note}</span> : null}</div>
  </li>
);

export default function NarrativeBlocks({ study, kpi, risks, openCite }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {bullet('Study health', `${kpi.onTrack.toFixed(0)}% on track`, 'Risks and milestone slip indicators available')}
        {bullet('Enrollment momentum', `${kpi.cumActual}/${study.plannedEnrollment} enrolled`, `Forecast LPI ${kpi.forecastLpi}`)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {bullet('Screen failure trend', `${kpi.sfRate.toFixed(1)}%`, kpi.sfRate > 40 ? 'High alert' : 'Within expected range')}
        {bullet('Query backlog', `${kpi.qBacklogTrend.toFixed(1)}%`, `${kpi.openQ} open queries`)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {bullet('Activation lag', `${kpi.maxLag}d`, `${kpi.sitesCount} active sites`)}
        {bullet('Lock readiness', `${Math.round(kpi.lockRisk)}/100`, `${kpi.daysToLock} days until DBL planned`) }
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="font-semibold text-slate-700 mb-3">Suggested narrative</div>
        <ul className="list-disc pl-5 text-sm text-slate-700">
          <li className="mb-2">Enrollment is {kpi.cumActual >= kpi.cumPlanned ? 'tracking ahead' : 'behind'} plan by {Math.abs(kpi.variance).toFixed(1)}%.</li>
          <li className="mb-2">Screen failure remains at {kpi.sfRate.toFixed(1)}%, indicating a need to reinforce site eligibility checks.</li>
          <li className="mb-2">Query volume is {kpi.qBacklogTrend.toFixed(1)}% over the prior period; focus actions on the top data quality sites.</li>
          <li className="mb-2">Risk register shows {risks.length} active risk{risks.length === 1 ? '' : 's'} for this study; click any citation to inspect KPI source.</li>
        </ul>
        <div className="mt-3 text-xs text-slate-500">Citations:</div>
        <div className="flex flex-wrap gap-2 mt-2">
          <button type="button" className="narrative-cite" onClick={() => openCite({ studyId: study.id, kpiId: 'K-001', weekStart: kpi.weekStart, label: 'Cumulative enrollment' })}>K-001</button>
          <button type="button" className="narrative-cite" onClick={() => openCite({ studyId: study.id, kpiId: 'K-011', weekStart: kpi.weekStart, label: 'Screen failure' })}>K-011</button>
          <button type="button" className="narrative-cite" onClick={() => openCite({ studyId: study.id, kpiId: 'K-030', weekStart: kpi.weekStart, label: 'Open queries' })}>K-030</button>
          <button type="button" className="narrative-cite" onClick={() => openCite({ studyId: study.id, kpiId: 'K-010', weekStart: kpi.weekStart, label: 'Query backlog trend' })}>K-010</button>
        </div>
      </div>
    </div>
  );
}
