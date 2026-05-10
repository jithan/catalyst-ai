export interface Study {
  id: string;
  nctId: string;
  title: string;
  phase: number;
  condition: string;
  therapyArea: string;
  sponsor: string;
  plannedEnrollment: number;
  plannedFpiDate: string;
  plannedLpiDate: string;
  status: string;
  ownerId: string;
  stress: string;
}

export interface Site {
  id: string;
  studyId: string;
  country: string;
  region: string;
  plannedSivDate: string;
  actualSivDate: string;
  status: string;
  pi: string;
  vendorId: string;
}

export interface Milestone {
  id: string;
  studyId: string;
  name: string;
  plannedDate: string;
  actualDate: string | null;
  status: string;
  criticality: 'high' | 'medium' | 'low';
}

export interface WeeklyMetric {
  weekStart: string;
  studyId: string;
  screened: number;
  failed: number;
  enrolled: number;
  withdrawn: number;
  cumEnroll: number;
  plannedCum: number;
  openQueries: number;
  deviationsMajor: number;
  deviationsMinor: number;
  vendorTickets: number;
}

export interface AppData {
  studies: Study[];
  sites: Site[];
  milestones: Milestone[];
  weekly: WeeklyMetric[];
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  tagline: string;
  permissionLabel: string;
  landing: ScreenKey;
  screens: ScreenKey[];
  studyTabDefault: StudyTabKey;
  ruleFilter: string[] | null;
  severityFilter: string | null;
  kpiEmphasis: string[];
  canCreate: boolean;
  canEdit: boolean;
  canExport: boolean;
  actionsScope: 'all' | 'mine' | 'none';
  ownedStudies?: string[];
}

export type ScreenKey =
  | 'portfolio'
  | 'study'
  | 'risks'
  | 'decisions_support'
  | 'pipeline'
  | 'pack'
  | 'actions'
  | 'audit';

export type StudyTabKey = 'overview' | 'sites' | 'queries' | 'milestones' | 'risks';

export interface KpiSnapshot {
  studyId: string;
  weekStart: string;
  cumActual: number;
  cumPlanned: number;
  variance: number;
  enrollRate: number;
  sfRate: number;
  funnel: number;
  activatedPct: number;
  sitesCount: number;
  maxLag: number;
  avgLag: number;
  sitesEnrollingPct: number;
  openQ: number;
  qBacklogTrend: number;
  medQAge: number;
  devMean: number;
  devStd: number;
  last4DevAvg: number;
  vendorBreach30: number;
  onTrack: number;
  slippedCount: number;
  slippedNames: string[];
  forecastLpi: string;
  forecastMissDays: number;
  plannedLpi: string;
  daysToLock: number;
  lockRisk: number;
  sparkEnroll: number[];
  sparkPlanned: number[];
  sparkSF: number[];
  sparkQ: number[];
  sparkDev: number[];
}

export interface RiskItem {
  id: string;
  studyId: string;
  ruleId: string;
  ruleName: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
  contributingKpis: string[];
  slice: {
    studyId: string;
    weekStart: string;
    kpiSummary: KpiSnapshot | null;
  };
  openedAt: string;
  status: 'Open' | 'Closed';
  daysOpen: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  studyId: string;
  ownerName: string;
  dueDate: string;
  status: 'Open' | 'InProgress' | 'Blocked' | 'Done';
  sourceRiskId?: string | null;
  sourceInsightId?: string | null;
  createdAt: string;
  createdBy: string;
}

export interface DecisionItem {
  id: string;
  title: string;
  rationale: string;
  studyId: string;
  riskId?: string | null;
  createdAt: string;
  createdBy: string;
}

export interface MeetingPack {
  id: string;
  studyId: string;
  generatedAt: string;
  agenda: string[];
  kpiSnapshot: {
    enrollment: string;
    variance: string;
    sfRate: string;
    openQueries: number;
    forecastLpi: string;
    forecastMissDays: number;
    highRisks: number;
  };
  insights: { id: string; title: string; kpis: string[]; body: string }[];
  decisionsNeeded: { riskId: string; ruleName: string; mitigation: string }[];
  version: number;
  createdBy: string;
  edits: any[];
}

export interface AuditEvent {
  id: string;
  type: string;
  action: string;
  target?: string;
  actor: string;
  ts: number;
}

export interface OntologyNode {
  id: string;
  fsn: string;
  tag: string;
  alt?: Record<string, string>;
}

export type OntologyEdge = [string, string, string];

export interface DrilldownContext {
  studyId: string;
  kpiId: string;
  weekStart: string;
  label: string;
}

export interface ToastMessage {
  msg: string;
  type: 'success' | 'info' | 'error';
}

export interface AppContextValue {
  data: AppData;
  kpis: Record<string, KpiSnapshot>;
  risks: RiskItem[];
  persona: Persona;
  switchPersona: (id: string) => void;
  actions: ActionItem[];
  decisions: DecisionItem[];
  packs: Record<string, MeetingPack>;
  audit: AuditEvent[];
  toast: ToastMessage | null;
  drilldown: DrilldownContext | null;
  createAction: (payload: Partial<ActionItem>) => void;
  updateAction: (id: string, patch: Partial<ActionItem>) => void;
  captureDecision: (payload: Partial<DecisionItem>) => void;
  addAudit: (evt: Omit<AuditEvent, 'ts'>) => void;
  setToast: (toast: ToastMessage | null) => void;
  setDrilldown: (drilldown: DrilldownContext | null) => void;
  pulseOn: boolean;
  togglePulse: () => void;
}
