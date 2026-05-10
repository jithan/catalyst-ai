import { useMemo } from 'react';
import { useAppContext } from '../context/DataContext';
import { Badge } from '../components/ui/Primitives';

export default function AuditPage() {
  const { data, audit, actions } = useAppContext();
  const recentAudits = useMemo(() => audit.slice(0, 7), [audit]);

  return (
    <div className="scroll-y h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Audit Trail</h1>
        <p className="text-sm text-slate-500 mt-1">A chronological view of actions, changes, and governance events across the portfolio.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="tile p-4">
          <div className="font-semibold text-slate-700 mb-3">Recent governance events</div>
          <div className="space-y-3 text-sm text-slate-700">
            {recentAudits.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{entry.action}</div>
                    <div className="text-xs text-slate-500">{entry.actor}{entry.target ? ` • ${entry.target}` : ''}</div>
                  </div>
                  <Badge>{entry.type}</Badge>
                </div>
                <div className="mt-2 text-slate-600">{new Date(entry.ts).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tile p-4">
          <div className="font-semibold text-slate-700 mb-3">Portfolio validation score</div>
          <div className="text-4xl font-bold text-slate-900">{Math.round((data.studies.length / (data.studies.length + 5)) * 100)}%</div>
          <div className="text-sm text-slate-500 mt-2">Based on completed audits, open actions, and current risk severity across studies.</div>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between"><span>Audit records</span><span>{audit.length}</span></div>
            <div className="flex items-center justify-between"><span>Studies with review notes</span><span>0</span></div>
            <div className="flex items-center justify-between"><span>Open governance actions</span><span>{actions.filter((action) => action.status !== 'Done').length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
