import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/DataContext';
import { SevBadge, Tile } from '../components/ui/Primitives';

export default function PortfolioPage() {
  const { data, kpis, risks } = useAppContext();
  const navigate = useNavigate();

  const counts = useMemo(() => {
    return data.studies.reduce((acc, study) => {
      acc[study.id] = { High: 0, Medium: 0, Low: 0 };
      return acc;
    }, {} as Record<string, { High: number; Medium: number; Low: number }>);
  }, [data.studies]);

  risks.forEach((risk) => {
    if (counts[risk.studyId]) counts[risk.studyId][risk.severity] += 1;
  });

  const totalHigh = risks.filter((risk) => risk.severity === 'High').length;
  const totalMed = risks.filter((risk) => risk.severity === 'Medium').length;
  const onTrack = data.studies.filter((study) => {
    const kpi = kpis[study.id];
    return kpi && kpi.slippedCount === 0;
  }).length;
  const totalQueries = Object.values(kpis).reduce((sum, kpi) => sum + (kpi?.openQ || 0), 0);

  return (
    <div className="scroll-y h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Portfolio Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Cross-study health at a glance — click any study to drill in.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 mb-6">
        <Tile label="Studies" value={data.studies.length} color="#4338ca" />
        <Tile label="High-Severity Risks" value={totalHigh} sub={`${totalMed} medium`} color="#b91c1c" />
        <Tile label="Studies On Track" value={`${onTrack}/${data.studies.length}`} color="#047857" />
        <Tile label="Total Open Queries" value={totalQueries} color="#b45309" />
      </div>

      <div className="tile p-4 mb-6">
        <div className="font-semibold text-slate-700 mb-3">Risk Heat-map</div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-h">Study</th>
                <th className="table-h">High</th>
                <th className="table-h">Medium</th>
                <th className="table-h">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.studies.map((study) => {
                const row = counts[study.id];
                const total = row.High + row.Medium + row.Low;
                const highColor = row.High >= 2 ? '#fecaca' : row.High >= 1 ? '#fee2e2' : '#f1f5f9';
                const medColor = row.Medium >= 2 ? '#fde68a' : row.Medium >= 1 ? '#fef3c7' : '#f1f5f9';
                return (
                  <tr key={study.id} className="row-hover cursor-pointer" onClick={() => navigate(`/study/${study.id}`)}>
                    <td className="table-c font-semibold">{study.id} <div className="text-xs text-slate-500">{study.condition}</div></td>
                    <td className="table-c"><div className="heat-cell" style={{ background: highColor, color: row.High ? '#b91c1c' : '#94a3b8' }}>{row.High}</div></td>
                    <td className="table-c"><div className="heat-cell" style={{ background: medColor, color: row.Medium ? '#b45309' : '#94a3b8' }}>{row.Medium}</div></td>
                    <td className="table-c text-slate-700 font-semibold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tile p-4">
        <div className="font-semibold text-slate-700 mb-3">All Studies</div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-h">ID / NCT</th>
                <th className="table-h">Title</th>
                <th className="table-h">Phase</th>
                <th className="table-h">Therapy</th>
                <th className="table-h">Sponsor</th>
                <th className="table-h">Enrollment</th>
                <th className="table-h">Forecast LPI</th>
                <th className="table-h">Top Risks</th>
              </tr>
            </thead>
            <tbody>
              {data.studies.map((study) => {
                const kpi = kpis[study.id];
                if (!kpi) return null;
                const studyRisks = risks.filter((risk) => risk.studyId === study.id).slice(0, 3);
                const percentComplete = Math.min(100, (kpi.cumActual / study.plannedEnrollment) * 100);
                return (
                  <tr key={study.id} className="row-hover cursor-pointer" onClick={() => navigate(`/study/${study.id}`)}>
                    <td className="table-c font-semibold">{study.id}<div className="text-xs text-slate-500">{study.nctId}</div></td>
                    <td className="table-c max-w-xs">{study.title}</td>
                    <td className="table-c">P{study.phase}</td>
                    <td className="table-c">{study.therapyArea}</td>
                    <td className="table-c">{study.sponsor}</td>
                    <td className="table-c">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-2 rounded-full" style={{ width: `${percentComplete}%`, background: kpi.variance < -20 ? '#b91c1c' : kpi.variance < 0 ? '#b45309' : '#047857' }} />
                        </div>
                        <span className="text-xs">{kpi.cumActual}/{study.plannedEnrollment}</span>
                      </div>
                    </td>
                    <td className="table-c text-xs">{kpi.forecastLpi} {kpi.forecastMissDays > 0 ? <span className="text-rose-600">(+{kpi.forecastMissDays}d)</span> : <span className="text-emerald-600">on plan</span>}</td>
                    <td className="table-c">
                      <div className="flex flex-wrap gap-1">
                        {studyRisks.length ? studyRisks.map((risk) => <SevBadge key={risk.id} value={risk.severity} />) : <span className="text-xs text-slate-400">none</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
