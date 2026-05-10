import { useMemo } from 'react';
import { useAppContext } from '../context/DataContext';
import { Button, Badge, Kbd } from '../components/ui/Primitives';

export default function PackPage() {
  const { data, persona, risks } = useAppContext();
  const studyCount = data.studies.length;
  const mostRecent = data.studies[0];
  const roles = useMemo(() => ['CRA', 'Clinical Lead', 'Medical Monitor', 'SIV Team'], []);

  return (
    <div className="scroll-y h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Meeting Pack Generator</h1>
        <p className="text-sm text-slate-500 mt-1">Generate a dynamic site initiation or executive pack tailored to your role and current portfolio context.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="tile p-4 space-y-4">
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Pack summary</div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{persona.role} briefing</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Studies in scope</div>
                <div className="text-3xl font-bold text-slate-900">{studyCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Active alerts</div>
                <div className="text-3xl font-bold text-rose-700">{risks.length}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">Key risk trend</div>
                <div className="text-3xl font-bold text-amber-700">{risks.filter((risk) => risk.severity === 'High').length}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="font-semibold text-slate-700 mb-2">Latest selected study</div>
              <div className="text-sm text-slate-800">{mostRecent.title}</div>
              <div className="text-xs text-slate-500 mt-2">{mostRecent.id} • {mostRecent.nctId}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="font-semibold text-slate-700 mb-2">Suggested agenda</div>
              <div className="text-xs text-slate-500">Purpose, site performance, current risks, decision items, next actions.</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">Export instructions</div>
            <div className="space-y-3 text-sm text-slate-700">
              <div>Use <Kbd>Ctrl</Kbd>+<Kbd>P</Kbd> to print or export. Include the latest risk and milestone slides for your steering committee.</div>
              <div>Consider customizing the narrative for target audience: clinical operations, medical team, or vendor performance.</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <Button>Generate pack</Button>
            <Button variant="ghost">Download PDF</Button>
          </div>
        </div>

        <div className="tile p-4">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Role-specific checklist</div>
            <div className="text-lg font-semibold text-slate-900 mt-1">{persona.role} priorities</div>
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            {roles.map((role) => (
              <div key={role} className="rounded-2xl border border-slate-200 p-3">
                <div className="font-semibold">{role}</div>
                <div className="text-xs text-slate-500 mt-1">Review the latest operational exceptions and ensure escalation items are visible in your pack.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
