import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/DataContext';
import { Badge, Button, SevBadge, Sparkline, Tile } from '../components/ui/Primitives';
import NarrativeBlocks from '../components/NarrativeBlocks';
import { filterRisksByPersona } from '../data/mockData';
import { diffDays, todayISO } from '../utils/format';
import type { StudyTabKey } from '../types';

const tabs: StudyTabKey[] = ['overview', 'sites', 'queries', 'milestones', 'risks'];

export default function StudyPage() {
  const { studyId } = useParams();
  const { data, kpis, risks, persona, createAction, setDrilldown } = useAppContext();
  const navigate = useNavigate();
  const study = data.studies.find((item) => item.id === studyId) || data.studies[0];
  const [tab, setTab] = useState<StudyTabKey>(persona.studyTabDefault);

  useEffect(() => {
    setTab(persona.studyTabDefault);
  }, [persona.studyTabDefault]);

  const kpi = kpis[study.id];
  const studySites = data.sites.filter((site) => site.studyId === study.id);
  const studyMilestones = data.milestones.filter((milestone) => milestone.studyId === study.id);
  const studyRisks = filterRisksByPersona(risks.filter((risk) => risk.studyId === study.id), persona);
  const emphasis = persona.kpiEmphasis || [];

  const RoleTile = ({ label, value, sub, color, spark }: { label: string; value: React.ReactNode; sub?: string; color: string; spark?: number[] }) => (
    <div className={`tile p-4 ${emphasis.some((key) => label.toLowerCase().includes(key)) ? 'ring-2 ring-indigo-200' : ''}`}>
      <div className="text-xs text-slate-500 uppercase tracking-[0.15em] font-semibold">{label}</div>
      <div className="flex items-end justify-between gap-4 mt-2">
        <div>
          <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          {sub ? <div className="text-xs text-slate-500">{sub}</div> : null}
        </div>
        {spark ? <Sparkline values={spark} planned={undefined} color={color} /> : null}
      </div>
    </div>
  );

  if (!kpi) return <div className="text-slate-500">Loading study KPI data...</div>;

  return (
    <div className="scroll-y h-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">{study.nctId} • {study.sponsor} • {study.therapyArea}</div>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{study.title}</h1>
          <div className="mt-2 text-xs text-slate-500">
            <span className="chip mr-2" style={{ background: '#eef2ff', color: '#4338ca' }}>Role: {persona.role}</span>
            Default tab: <strong>{persona.studyTabDefault}</strong> • focus: <strong>{emphasis.join(' • ') || 'all'}</strong> • filtered risks: <strong>{studyRisks.length}</strong>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {studyRisks.slice(0, 5).map((risk) => <SevBadge key={risk.id} value={risk.severity} />)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((option) => (
          <button key={option} type="button" className={`tab ${tab === option ? 'tab-active' : 'text-slate-600 hover:bg-slate-100'}`} onClick={() => setTab(option)}>{option.charAt(0).toUpperCase() + option.slice(1)}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
            <RoleTile label="Cum Enrollment" value={kpi.cumActual} sub={`plan ${kpi.cumPlanned} (${kpi.variance.toFixed(1)}%)`} color={kpi.variance < -20 ? '#b91c1c' : '#4338ca'} spark={kpi.sparkEnroll} />
            <RoleTile label="Screen-Failure %" value={`${kpi.sfRate.toFixed(1)}%`} sub="trailing 4 weeks" color={kpi.sfRate > 40 ? '#b91c1c' : '#b45309'} spark={kpi.sparkSF} />
            <RoleTile label="Open Queries" value={kpi.openQ} sub={`trend ${kpi.qBacklogTrend.toFixed(1)}%`} color={kpi.qBacklogTrend > 20 ? '#b91c1c' : '#0891b2'} spark={kpi.sparkQ} />
            <RoleTile label="Forecast LPI" value={kpi.forecastLpi} sub={kpi.forecastMissDays > 0 ? `+${kpi.forecastMissDays}d vs plan` : 'on plan'} color={kpi.forecastMissDays > 30 ? '#b91c1c' : '#047857'} />
          </div>
          <div className="tile p-4">
            <div className="font-semibold text-slate-700 mb-3">Auto-generated Insights</div>
            <NarrativeBlocks study={study} kpi={kpi} risks={studyRisks} openCite={(cite) => setDrilldown(cite)} />
          </div>
        </div>
      )}

      {tab === 'sites' && (
        <div className="tile p-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-h">Site ID</th>
                <th className="table-h">Country</th>
                <th className="table-h">PI</th>
                <th className="table-h">Planned SIV</th>
                <th className="table-h">Actual SIV</th>
                <th className="table-h">Lag</th>
                <th className="table-h">Status</th>
                <th className="table-h">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {studySites.map((site) => {
                const lag = diffDays(site.plannedSivDate, site.actualSivDate);
                return (
                  <tr key={site.id} className="row-hover">
                    <td className="table-c font-mono text-xs">{site.id}</td>
                    <td className="table-c">{site.country}</td>
                    <td className="table-c">{site.pi}</td>
                    <td className="table-c">{site.plannedSivDate}</td>
                    <td className="table-c">{site.actualSivDate}</td>
                    <td className="table-c"><span className={lag > 30 ? 'text-rose-700 font-semibold' : lag > 14 ? 'text-amber-700 font-semibold' : ''}>{lag}d</span></td>
                    <td className="table-c"><Badge>{site.status}</Badge></td>
                    <td className="table-c text-xs">{site.vendorId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'queries' && (
        <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
          <RoleTile label="Open Queries" value={kpi.openQ} color="#0891b2" />
          <RoleTile label="Backlog Trend (4w)" value={`${kpi.qBacklogTrend.toFixed(1)}%`} color={kpi.qBacklogTrend > 20 ? '#b91c1c' : '#0891b2'} />
          <RoleTile label="Median Query Age" value={`${kpi.medQAge}d`} color={kpi.medQAge > 21 ? '#b91c1c' : '#0891b2'} />
          <RoleTile label="Lock Risk Index" value={`${Math.round(kpi.lockRisk)}/100`} sub={`${kpi.daysToLock}d to DBL`} color={kpi.lockRisk > 50 ? '#b91c1c' : '#0891b2'} />
        </div>
      )}

      {tab === 'milestones' && (
        <div className="tile p-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-h">Milestone</th>
                <th className="table-h">Planned</th>
                <th className="table-h">Actual</th>
                <th className="table-h">Slip</th>
                <th className="table-h">Criticality</th>
                <th className="table-h">Status</th>
              </tr>
            </thead>
            <tbody>
              {studyMilestones.map((milestone) => {
                const slip = milestone.actualDate ? diffDays(milestone.plannedDate, milestone.actualDate) : new Date(milestone.plannedDate) < new Date() ? diffDays(milestone.plannedDate, todayISO()) : 0;
                return (
                  <tr key={milestone.id} className="row-hover">
                    <td className="table-c font-semibold">{milestone.name}</td>
                    <td className="table-c">{milestone.plannedDate}</td>
                    <td className="table-c">{milestone.actualDate || '—'}</td>
                    <td className="table-c"><span className={slip > 0 ? 'text-rose-700 font-semibold' : slip < 0 ? 'text-emerald-700 font-semibold' : ''}>{slip > 0 ? `+${slip}` : slip}</span></td>
                    <td className="table-c"><Badge>{milestone.criticality}</Badge></td>
                    <td className="table-c"><Badge className={milestone.status === 'Slipped' ? 'severity-high' : milestone.status === 'Done' ? 'severity-low' : ''}>{milestone.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'risks' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
            <span className="chip">{studyRisks.length} risks visible</span>
            <Button variant="ghost" onClick={() => navigate('/risks')}>Go to register</Button>
          </div>
          {studyRisks.length === 0 ? (
            <div className="tile p-6 text-slate-500">No active risks for this study.</div>
          ) : (
            <div className="space-y-3">
              {studyRisks.map((risk) => (
                <details key={risk.id} className="tile p-3">
                  <summary className="flex items-center gap-3 cursor-pointer">
                    <SevBadge value={risk.severity} />
                    <div>
                      <div className="font-semibold text-slate-800">{risk.ruleName}</div>
                      <div className="text-xs text-slate-500">{risk.ruleId} • opened {risk.openedAt}</div>
                    </div>
                  </summary>
                  <div className="mt-3 text-sm text-slate-700">
                    <div className="mb-2"><strong>Mitigation:</strong> {risk.mitigation}</div>
                    <div className="mb-2"><strong>Contributing KPIs:</strong> {risk.contributingKpis.join(', ')}</div>
                    {persona.canCreate ? (
                      <Button size="sm" onClick={() => createAction({ title: `Mitigate: ${risk.ruleName}`, description: risk.mitigation, studyId: risk.studyId, ownerName: persona.name })}>Create Action</Button>
                    ) : (
                      <div className="text-xs text-slate-400 italic">Read-only role</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
