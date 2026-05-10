import { useMemo, useState } from 'react';
import { useAppContext } from '../context/DataContext';
import { filterRisksByPersona } from '../data/mockData';
import { Badge, Button, SevBadge } from '../components/ui/Primitives';

export default function RisksPage() {
  const { data, kpis, risks, persona, setDrilldown, createAction } = useAppContext();
  const [studyFilter, setStudyFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const visibleRisks = useMemo(() => filterRisksByPersona(risks, persona), [risks, persona]);
  const filteredRisks = useMemo(
    () => visibleRisks.filter((risk) => (studyFilter === 'all' || risk.studyId === studyFilter) && (severityFilter === 'all' || risk.severity === severityFilter)),
    [visibleRisks, studyFilter, severityFilter],
  );

  const scopeLabel = [persona.ruleFilter ? `rules ${persona.ruleFilter.join(', ')}` : null, persona.severityFilter ? `${persona.severityFilter}-severity only` : null]
    .filter(Boolean)
    .join(' • ') || 'all rules, all severities';

  return (
    <div className="scroll-y h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Risk Register</h1>
        <p className="text-sm text-slate-500 mt-1">Ranked by severity then study. Each risk shows its trigger, contributing KPIs, and recommended mitigation.</p>
        <div className="text-xs text-slate-500 mt-2">
          Visible to you: <strong>{scopeLabel}</strong> — {visibleRisks.length} of {risks.length} portfolio risks.
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select className="input" value={studyFilter} onChange={(event) => setStudyFilter(event.target.value)}>
          <option value="all">All studies</option>
          {data.studies.map((study) => (
            <option key={study.id} value={study.id}>{study.id} — {study.condition}</option>
          ))}
        </select>
        <select className="input" value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
          <option value="all">All severities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
        <div className="ml-auto text-xs text-slate-500 self-center">{filteredRisks.length} shown</div>
      </div>

      {filteredRisks.length === 0 ? (
        <div className="tile p-6 text-slate-500">No risks match the current filters.</div>
      ) : (
        <div className="space-y-3">
          {filteredRisks.map((risk) => (
            <details key={risk.id} className="tile">
              <summary className="p-3 flex items-center gap-3 cursor-pointer">
                <SevBadge value={risk.severity} />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{risk.ruleName}</div>
                  <div className="text-xs text-slate-500">{risk.ruleId} • {risk.studyId}</div>
                </div>
                <div className="text-xs text-slate-400">click for details</div>
              </summary>
              <div className="p-4 border-t border-slate-200 text-sm text-slate-700">
                <div className="mb-2"><strong>Recommended mitigation:</strong> {risk.mitigation}</div>
                <div className="mb-2"><strong>Contributing KPIs:</strong> {risk.contributingKpis.map((kpi) => (
                  <button key={kpi} type="button" className="narrative-cite mr-2" onClick={() => setDrilldown({ kpiId: kpi, studyId: risk.studyId, weekStart: risk.slice.weekStart, label: kpi })}>{kpi}</button>
                ))}</div>
                {persona.canCreate ? (
                  <Button size="sm" onClick={() => createAction({ title: `Mitigate: ${risk.ruleName}`, description: risk.mitigation, studyId: risk.studyId, sourceRiskId: risk.id })}>Create Action</Button>
                ) : (
                  <div className="text-xs text-slate-400 italic">Read-only — your role cannot create actions.</div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
