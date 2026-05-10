import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  ActionItem,
  AppContextValue,
  AppData,
  AuditEvent,
  DecisionItem,
  DrilldownContext,
  KpiSnapshot,
  MeetingPack,
  Persona,
  RiskItem,
  ToastMessage,
} from '../types';
import { CONFIG, PERSONAS, evaluateRisks, filterRisksByPersona, kpiAll, generateData, renderPackHtml } from '../data/mockData';
import { todayISO, addDays } from '../utils/format';

const DataContext = createContext<AppContextValue | null>(null);

const initialPersona = PERSONAS[0];

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<AppData>(() => generateData());
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [packs, setPacks] = useState<Record<string, MeetingPack>>({});
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [drilldown, setDrilldown] = useState<DrilldownContext | null>(null);
  const [pulseOn, setPulseOn] = useState(true);

  const kpis = useMemo(() => kpiAll(data), [data]);
  const risks = useMemo(() => evaluateRisks(data, kpis), [data, kpis]);

  const addAudit = useCallback((evt: Omit<AuditEvent, 'ts'>) => {
    setAudit((prev) => [...prev, { ...evt, ts: Date.now(), id: `${evt.type}-${Date.now()}` }]);
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ msg: message, type });
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const switchPersona = useCallback((id: string) => {
    const found = PERSONAS.find((item) => item.id === id);
    if (found) setPersona(found);
  }, []);

  const createAction = useCallback(
    (payload: Partial<ActionItem>) => {
      const id = `ACT-${Date.now()}`;
      const item: ActionItem = {
        id,
        title: payload.title || 'New action',
        description: payload.description || '',
        studyId: payload.studyId || data.studies[0]?.id || 'S-001',
        ownerName: payload.ownerName || persona.name,
        dueDate: payload.dueDate || addDays(todayISO(), 7),
        status: payload.status || 'Open',
        sourceRiskId: payload.sourceRiskId || null,
        sourceInsightId: payload.sourceInsightId || null,
        createdAt: todayISO(),
        createdBy: persona.name,
      };
      setActions((prev) => [item, ...prev]);
      addAudit({ type: 'action', action: 'create', actor: persona.name, target: item.studyId, id });
      showToast(`Action created (${id})`);
    },
    [addAudit, data.studies, persona.name, showToast],
  );

  const updateAction = useCallback(
    (id: string, patch: Partial<ActionItem>) => {
      setActions((prev) => prev.map((action) => (action.id === id ? { ...action, ...patch } : action)));
      addAudit({ type: 'action', action: `update:${JSON.stringify(patch)}`, actor: persona.name, target: id, id });
      showToast(`Action updated (${id})`, 'info');
    },
    [addAudit, persona.name, showToast],
  );

  const captureDecision = useCallback(
    (payload: Partial<DecisionItem>) => {
      const id = `DEC-${Date.now()}`;
      const item: DecisionItem = {
        id,
        title: payload.title || 'Decision',
        rationale: payload.rationale || '',
        studyId: payload.studyId || data.studies[0]?.id || 'S-001',
        riskId: payload.riskId || null,
        createdAt: todayISO(),
        createdBy: persona.name,
      };
      setDecisions((prev) => [item, ...prev]);
      addAudit({ type: 'decision', action: 'create', actor: persona.name, target: item.studyId, id });
      showToast(`Decision captured (${id})`);
    },
    [addAudit, data.studies, persona.name, showToast],
  );

  const togglePulse = useCallback(() => setPulseOn((prev) => !prev), []);

  useEffect(() => {
    if (!pulseOn) return undefined;
    const interval = window.setInterval(() => {
      setData((current) => {
        const updatedWeekly = current.weekly.map((week) => ({ ...week }));
        current.studies.forEach((study) => {
          const last = [...updatedWeekly.filter((week) => week.studyId === study.id)].sort((a, b) => a.weekStart.localeCompare(b.weekStart)).slice(-1)[0];
          if (!last) return;
          last.openQueries = Math.max(0, last.openQueries + Math.round((Math.random() - 0.45) * 4));
          last.vendorTickets = Math.max(0, last.vendorTickets + Math.round((Math.random() - 0.5) * 3));
          last.cumEnroll = Math.max(0, last.cumEnroll + Math.max(0, Math.round((Math.random() - 0.3) * 2)));
          if (study.stress === 'deviation_spike') last.deviationsMajor = Math.max(0, last.deviationsMajor + Math.round((Math.random() - 0.3) * 2));
        });
        return { ...current, weekly: updatedWeekly };
      });
    }, CONFIG.pulseSeconds * 1000);
    return () => window.clearInterval(interval);
  }, [pulseOn]);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      kpis,
      risks,
      persona,
      switchPersona,
      actions,
      decisions,
      packs,
      audit,
      toast,
      drilldown,
      createAction,
      updateAction,
      captureDecision,
      addAudit,
      setToast,
      setDrilldown,
      pulseOn,
      togglePulse,
    }),
    [actions, addAudit, audit, captureDecision, createAction, data, decisions, drilldown, kpis, packs, persona, risks, switchPersona, toast, togglePulse, updateAction, pulseOn],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useAppContext must be used within DataProvider');
  return context;
};
