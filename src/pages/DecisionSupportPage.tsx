import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/DataContext';
import { deriveInferences, filterRisksByPersona, graphHops, findShortestPath, ONTOLOGY } from '../data/mockData';
import { Button, Badge, SevBadge, Kbd } from '../components/ui/Primitives';
import OntologyGraph from '../components/OntologyGraph';

export default function DecisionSupportPage() {
  const { data, kpis, risks, persona } = useAppContext();
  const [activeStudy, setActiveStudy] = useState('all');
  const [start, setStart] = useState('OP:001');
  const [end, setEnd] = useState('V:001');
  const [maxHops, setMaxHops] = useState(3);
  const [relFilter, setRelFilter] = useState('all');
  const [paths, setPaths] = useState<Array<Array<{ node: string; rel?: string }>>>([]);
  const [shortest, setShortest] = useState<Array<{ node: string; rel?: string }> | null>(null);

  const visibleRisks = useMemo(() => filterRisksByPersona(risks, persona), [risks, persona]);
  const filteredRisks = useMemo(
    () => visibleRisks.filter((risk) => activeStudy === 'all' || risk.studyId === activeStudy),
    [activeStudy, visibleRisks],
  );
  const inferences = useMemo(() => deriveInferences(filteredRisks, data), [filteredRisks, data]);

  useEffect(() => {
    const filtered = relFilter === 'all' ? null : relFilter;
    setPaths(graphHops(start, maxHops, filtered));
    setShortest(end ? findShortestPath(start, end, filtered) : null);
  }, [start, end, maxHops, relFilter]);

  const scopeLabel = [persona.ruleFilter ? `rules ${persona.ruleFilter.join(', ')}` : null, persona.severityFilter ? `${persona.severityFilter}-severity only` : null]
    .filter(Boolean)
    .join(' • ') || 'all rules, all severities';

  const allConcepts = ONTOLOGY.nodes;
  const relKeys = [...new Set(ONTOLOGY.edges.map((edge) => edge[1]))];

  return (
    <div className="scroll-y h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900">Decision Support — Ontology-Driven Inferences</h1>
        <p className="text-sm text-slate-500 mt-1">Anchored in SNOMED CT, aligned with LOINC, ICD-10, RxNorm, MedDRA. Every inference derives from graph hops.</p>
        <div className="text-xs text-slate-500 mt-2">Visible to you: <strong>{scopeLabel}</strong> — {visibleRisks.length} of {risks.length} risks feed this view.</div>
      </div>

      <div className="tile p-4 mb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-semibold text-slate-700 mb-2">Active Inferences</div>
            <div className="text-xs text-slate-500">{inferences.length} derived inference{inferences.length === 1 ? '' : 's'} for the selected scope.</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="input" value={activeStudy} onChange={(event) => setActiveStudy(event.target.value)}>
              <option value="all">All studies</option>
              {data.studies.map((study) => <option key={study.id} value={study.id}>{study.id} — {study.condition}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 mt-4">
          {inferences.slice(0, 8).map((inf) => (
            <div key={inf.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs text-slate-500">{inf.studyId} • {inf.ruleId} ({inf.ruleName})</div>
                  <div className="font-semibold text-slate-800">{inf.recommendation}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <SevBadge value={inf.severity} />
                  <Badge>{inf.confidence} confidence</Badge>
                </div>
              </div>
              <div className="text-xs text-slate-600 mb-2"><strong>Operational chain:</strong></div>
              <div className="flex flex-wrap gap-1 text-xs">
                {inf.operationalChain.map((step, index) => (
                  <span key={`${step.node}-${index}`} className="chip">{step.node}{step.rel ? ` —${step.rel}→` : ''}</span>
                ))}
              </div>
              <div className="text-xs text-slate-600 mt-3 mb-2"><strong>Clinical chain:</strong></div>
              <div className="flex flex-wrap gap-1 text-xs">
                {inf.clinicalChain.map((step, index) => (
                  <span key={`${step.node}-${index}`} className="chip">{step.node}{step.rel ? ` —${step.rel}→` : ''}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tile p-4">
        <div className="font-semibold text-slate-700 mb-3">Ontology Graph Query</div>
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr] mb-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-500">Start concept</label>
              <select className="input mt-1 w-full" value={start} onChange={(event) => setStart(event.target.value)}>
                {allConcepts.map((concept) => <option key={concept.id} value={concept.id}>{concept.id} — {concept.fsn}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">End concept</label>
              <select className="input mt-1 w-full" value={end} onChange={(event) => setEnd(event.target.value)}>
                <option value="">— none —</option>
                {allConcepts.map((concept) => <option key={concept.id} value={concept.id}>{concept.id} — {concept.fsn}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Max hops</label>
              <select className="input mt-1 w-full" value={maxHops} onChange={(event) => setMaxHops(Number(event.target.value))}>
                {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Relation filter</label>
              <select className="input mt-1 w-full" value={relFilter} onChange={(event) => setRelFilter(event.target.value)}>
                <option value="all">all relations</option>
                {relKeys.map((relation) => <option key={relation} value={relation}>{relation}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Button onClick={() => { const filtered = relFilter === 'all' ? null : relFilter; setPaths(graphHops(start, maxHops, filtered)); setShortest(end ? findShortestPath(start, end, filtered) : null); }}>Refresh</Button>
          </div>
        </div>
        <div className="overflow-auto mb-4">
          <OntologyGraph start={start} end={end || null} paths={paths} shortest={shortest} relFilter={relFilter === 'all' ? null : relFilter} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="border border-slate-200 rounded-2xl p-4">
            <div className="font-semibold text-slate-700 mb-2">Reachable paths</div>
            <div className="text-xs text-slate-500 max-h-56 overflow-y-auto space-y-2">
              {paths.slice(0, 30).map((path, index) => (
                <div key={index} className="font-mono text-[12px] text-slate-700">
                  {path.map((step, idx) => (`${idx > 0 ? ` —${step.rel}→ ` : ''}${step.node}`)).join('')}
                </div>
              ))}
              {paths.length === 0 ? <div className="text-slate-400">No reachable paths within selected hops.</div> : null}
            </div>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4">
            <div className="font-semibold text-slate-700 mb-2">Shortest path</div>
            {shortest ? (
              <div className="text-xs text-slate-700">
                {shortest.map((step, idx) => (`${idx > 0 ? ` —${step.rel}→ ` : ''}${step.node}`)).join('')}
              </div>
            ) : (
              <div className="text-xs text-slate-400">Select an end concept to compute shortest path.</div>
            )}
            <div className="text-xs text-slate-500 mt-3">
              Total ontology concepts: {ONTOLOGY.nodes.length} • relations: {relKeys.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
