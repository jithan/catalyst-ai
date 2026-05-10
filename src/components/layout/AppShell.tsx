import { useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/DataContext';
import { PERSONAS } from '../../data/mockData';
import PortfolioPage from '../../pages/PortfolioPage';
import StudyPage from '../../pages/StudyPage';
import RisksPage from '../../pages/RisksPage';
import DecisionSupportPage from '../../pages/DecisionSupportPage';
import PipelinePage from '../../pages/PipelinePage';
import PackPage from '../../pages/PackPage';
import ActionsPage from '../../pages/ActionsPage';
import AuditPage from '../../pages/AuditPage';
import NotFoundPage from '../../pages/NotFoundPage';
import { Button, Kbd } from '../ui/Primitives';

const navItems = [
  { key: 'portfolio', label: 'Portfolio Overview', path: '/portfolio' },
  { key: 'study', label: 'Study Detail', path: '/study' },
  { key: 'risks', label: 'Risk Register', path: '/risks' },
  { key: 'decisions_support', label: 'Decision Support', path: '/decision-support' },
  { key: 'pipeline', label: 'Data & Pipeline', path: '/data-pipeline' },
  { key: 'pack', label: 'Meeting Pack', path: '/meeting-pack' },
  { key: 'actions', label: 'Actions & Decisions', path: '/actions' },
  { key: 'audit', label: 'Audit Trail', path: '/audit' },
] as const;

type NavKey = (typeof navItems)[number]['key'];

function AppShell() {
  const { persona, switchPersona, data, toast, drilldown, setDrilldown, pulseOn, togglePulse } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const firstStudyId = data.studies[0]?.id || 'S-001';
  const currentPath = location.pathname;

  const computedPersonaTarget = useMemo(() => {
    const route = navItems.find((item) => item.key === persona.landing)?.path || '/portfolio';
    if (persona.landing === 'study') return `${route}/${firstStudyId}`;
    return route;
  }, [firstStudyId, persona.landing]);

  const handlePersonaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PERSONAS.find((item) => item.id === event.target.value);
    if (selected) {
      switchPersona(selected.id);
      const route = navItems.find((item) => item.key === selected.landing)?.path || '/portfolio';
      navigate(selected.landing === 'study' ? `${route}/${firstStudyId}` : route, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 grid place-items-center text-white font-bold">C</div>
          <div>
            <div className="font-semibold">Catalyst.AI</div>
            <div className="text-xs text-slate-500">Trial Health Co-Pilot</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <div className="pulse-dot" /> Live pulse: every {CONFIG.pulseSeconds}s • {pulseOn ? 'running' : 'paused'}
          <button type="button" className="underline" onClick={togglePulse}>{pulseOn ? 'Pause' : 'Resume'}</button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">{data.studies.length} studies • {persona.permissionLabel}</div>
          <select className="input text-sm" value={persona.id} onChange={handlePersonaChange}>
            {PERSONAS.map((item) => (
              <option key={item.id} value={item.id}>{item.name} — {item.role}</option>
            ))}
          </select>
          <Button variant="ghost" onClick={() => setMobileOpen((prev) => !prev)} className="md:hidden">Menu</Button>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-68px)]">
        <aside className={`bg-white border-r border-slate-200 w-72 p-4 space-y-4 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Persona</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="font-semibold">{persona.name}</div>
            <div className="text-sm text-slate-600">{persona.role}</div>
            <div className="mt-2 text-[11px] text-slate-500">{persona.tagline}</div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-4 mb-2">Navigation</div>
          <nav className="space-y-2">
            {navItems.filter((item) => persona.screens.includes(item.key as NavKey)).map((item) => {
              const target = item.key === 'study' ? `/study/${firstStudyId}` : item.path;
              return (
                <NavLink key={item.key} to={target} className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 mt-4">
            {persona.canCreate ? 'Full workspace and decision capabilities.' : persona.canExport ? 'View and export authorized.' : 'Read-only oversight view.'}
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to={computedPersonaTarget} replace />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/study" element={<Navigate to={`/study/${firstStudyId}`} replace />} />
            <Route path="/study/:studyId" element={<StudyPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/decision-support" element={<DecisionSupportPage />} />
            <Route path="/data-pipeline" element={<PipelinePage />} />
            <Route path="/meeting-pack" element={<PackPage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      {toast ? (
        <div className="fixed right-4 bottom-4 z-50">
          <div className={`tile px-4 py-3 ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : toast.type === 'info' ? 'border-indigo-200 bg-indigo-50 text-indigo-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
            {toast.msg}
          </div>
        </div>
      ) : null}
      {drilldown ? (
        <div className="modal-backdrop" onClick={() => setDrilldown(null)}>
          <div className="tile p-5 w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500">KPI Drilldown</div>
                <div className="text-xl font-semibold">{drilldown.kpiId} • {drilldown.label}</div>
              </div>
              <button type="button" className="text-slate-600 hover:text-slate-900" onClick={() => setDrilldown(null)}>✕</button>
            </div>
            <div className="text-sm text-slate-600">Study {drilldown.studyId} • week {drilldown.weekStart} • click outside to close.</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const CONFIG = {
  pulseSeconds: 15,
};

export default AppShell;
