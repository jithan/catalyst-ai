import { useMemo } from 'react';
import { useAppContext } from '../context/DataContext';
import { Badge, Button } from '../components/ui/Primitives';

const progressName = {
  planning: 'Study Planning',
  startUp: 'Start-up',
  activation: 'Site Activation',
  enrollment: 'Enrollment',
  closeout: 'Close-out',
};

export default function PipelinePage() {
  const { data } = useAppContext();
  const phaseMap: Record<number, keyof typeof progressName> = {
    1: 'planning',
    2: 'activation',
    3: 'enrollment',
  };
  const portfolioProgress = useMemo(() => {
    const counts: Record<keyof typeof progressName, number> = { planning: 0, startUp: 0, activation: 0, enrollment: 0, closeout: 0 };
    data.studies.forEach((study) => {
      const stage = phaseMap[study.phase] || 'closeout';
      counts[stage] += 1;
    });
    return counts;
  }, [data.studies]);

  const total = data.studies.length;

  return (
    <div className="scroll-y h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Portfolio Pipeline</h1>
        <p className="text-sm text-slate-500 mt-1">Track study progression from planning through close-out with forecasted transitions and bottleneck warnings.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="tile p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Portfolio transition summary</div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{total} studies</div>
            </div>
            <Button variant="ghost">Refresh data</Button>
          </div>
          <div className="space-y-3">
            {(Object.keys(progressName) as Array<keyof typeof progressName>).map((step) => {
              const count = portfolioProgress[step];
              const ratio = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={step} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="font-semibold text-slate-700">{progressName[step]}</div>
                    <Badge>{count}</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${ratio}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{ratio}% of portfolio</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tile p-4">
          <div className="font-semibold text-slate-700 mb-4">Pipeline staging matrix</div>
          <div className="grid gap-3">
            {data.studies.map((study) => {
              const siteCount = data.sites.filter((site) => site.studyId === study.id).length;
              return (
                <div key={study.id} className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">{study.id}</div>
                      <div className="text-xs text-slate-500">{study.condition} • {study.therapyArea}</div>
                    </div>
                    <Badge>{phaseMap[study.phase] || 'closeout'}</Badge>
                  </div>
                  <div className="text-sm text-slate-600">{study.title}</div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="chip">Sites: {siteCount}</span>
                    <span className="chip">Target: {study.plannedEnrollment}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
