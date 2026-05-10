import type { ReactNode } from 'react';
import { ONTOLOGY } from '../data/mockData';

interface NodeView {
  id: string;
  fsn: string;
  tag: string;
}

interface Props {
  start: string;
  end: string | null;
  paths: Array<Array<{ node: string; rel?: string }>>;
  shortest: Array<{ node: string; rel?: string }> | null;
  relFilter: string | null;
}

function nodeLabel(id: string): string {
  const node = ONTOLOGY.nodes.find((item) => item.id === id);
  return node ? `${node.id} — ${node.fsn}` : id;
}

function badge(content: ReactNode) {
  return <span className="chip">{content}</span>;
}

export default function OntologyGraph({ start, end, paths, shortest, relFilter }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="font-semibold text-slate-700">Graph view</div>
          <div className="text-xs text-slate-500">Start: {nodeLabel(start)}{end ? ` • End: ${nodeLabel(end)}` : ''}</div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {relFilter ? badge(`filtered: ${relFilter}`) : badge('all relations')}
          {badge(`${paths.length} paths`)}
          {shortest ? badge(`shortest ${shortest.length - 1} hops`) : badge('no shortest path')}
        </div>
      </div>
      <div className="grid gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Sample ontology nodes</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {ONTOLOGY.nodes.slice(0, 6).map((node) => (
              <div key={node.id} className="rounded-xl border border-slate-200 bg-white p-3 text-[11px]">
                <div className="font-semibold text-slate-800">{node.id}</div>
                <div className="text-slate-500">{node.tag}</div>
                <div className="text-xs text-slate-600 mt-1">{node.fsn}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {paths.slice(0, 10).map((path, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 p-3 bg-slate-50 text-xs text-slate-700">
              {path.map((step, stepIndex) => (
                <span key={`${step.node}-${stepIndex}`}>
                  {stepIndex > 0 ? ` —${step.rel}→ ` : ''}{nodeLabel(step.node)}
                </span>
              ))}
            </div>
          ))}
          {paths.length === 0 ? <div className="text-slate-500 text-sm">No paths to render at current hop count.</div> : null}
        </div>
      </div>
    </div>
  );
}
