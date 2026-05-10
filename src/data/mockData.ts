import type {
  AppData,
  KpiSnapshot,
  Persona,
  RiskItem,
  Study,
  Site,
  Milestone,
  WeeklyMetric,
  OntologyEdge,
  OntologyNode,
  MeetingPack,
} from '../types';
import { addDays, diffDays, todayISO, weekStartISO } from '../utils/format';

export const CONFIG = {
  seed: 20260509,
  studyCount: 8,
  weeksHistory: 16,
  pulseSeconds: 15,
  thresholds: {
    slowEnrollHigh: -30,
    slowEnrollMed: -20,
    sfHigh: 45,
    sfMed: 30,
    siteLagHigh: 30,
    siteLagMed: 14,
    queryGrowth: 20,
    queryAge: 21,
    deviationSigma: 2,
    vendorBreach: 3,
    forecastMissHigh: 60,
    forecastMissMed: 30,
    inactiveDays: 30,
  },
};

export const PERSONAS: Persona[] = [
  {
    id: 'P1',
    name: 'Sarah Chen',
    role: 'Study Lead',
    tagline: 'Owns study health & governance',
    permissionLabel: 'Full access',
    landing: 'study',
    screens: ['portfolio', 'study', 'risks', 'decisions_support', 'pack', 'actions', 'pipeline', 'audit'],
    studyTabDefault: 'overview',
    ruleFilter: null,
    severityFilter: null,
    kpiEmphasis: ['enroll', 'milestones', 'risks', 'sf'],
    canCreate: true,
    canEdit: true,
    canExport: true,
    actionsScope: 'all',
    ownedStudies: ['S-001', 'S-002'],
  },
  {
    id: 'P2',
    name: 'Marcus Patel',
    role: 'Clinical Operations Manager',
    tagline: 'Sites, activation, deviations',
    permissionLabel: 'Sites & deviations',
    landing: 'study',
    screens: ['study', 'risks', 'decisions_support', 'actions', 'pipeline', 'audit'],
    studyTabDefault: 'sites',
    ruleFilter: ['R-002', 'R-003', 'R-006', 'R-007'],
    severityFilter: null,
    kpiEmphasis: ['sites', 'sf', 'deviations'],
    canCreate: true,
    canEdit: false,
    canExport: false,
    actionsScope: 'mine',
  },
  {
    id: 'P3',
    name: 'Priya Iyer',
    role: 'Data Management Lead',
    tagline: 'Queries, data quality, lock readiness',
    permissionLabel: 'Queries & lock readiness',
    landing: 'study',
    screens: ['study', 'risks', 'decisions_support', 'actions', 'pipeline', 'audit'],
    studyTabDefault: 'queries',
    ruleFilter: ['R-004', 'R-010'],
    severityFilter: null,
    kpiEmphasis: ['queries', 'lockrisk'],
    canCreate: true,
    canEdit: false,
    canExport: false,
    actionsScope: 'mine',
  },
  {
    id: 'P4',
    name: 'David Okafor',
    role: 'Vendor Manager',
    tagline: 'Vendor SLAs & escalations',
    permissionLabel: 'Vendor performance',
    landing: 'risks',
    screens: ['risks', 'decisions_support', 'study', 'actions', 'pipeline', 'audit'],
    studyTabDefault: 'sites',
    ruleFilter: ['R-008'],
    severityFilter: null,
    kpiEmphasis: ['vendors'],
    canCreate: true,
    canEdit: false,
    canExport: false,
    actionsScope: 'mine',
  },
  {
    id: 'P5',
    name: 'Helen Rivera',
    role: 'Executive / Portfolio Director',
    tagline: 'Cross-study oversight',
    permissionLabel: 'Read-only oversight',
    landing: 'portfolio',
    screens: ['portfolio', 'risks', 'decisions_support', 'pack', 'pipeline', 'audit'],
    studyTabDefault: 'overview',
    ruleFilter: null,
    severityFilter: 'High',
    kpiEmphasis: ['portfolio', 'risks'],
    canCreate: false,
    canEdit: false,
    canExport: true,
    actionsScope: 'none',
  },
];

export const VENDORS = [
  { id: 'V-01', name: 'NorthStar CRO', type: 'CRO', critical: true },
  { id: 'V-02', name: 'Helios eCOA', type: 'eCOA', critical: true },
  { id: 'V-03', name: 'Atlas IRT', type: 'IRT', critical: true },
  { id: 'V-04', name: 'Vertex Central Lab', type: 'Lab', critical: true },
  { id: 'V-05', name: 'Beacon eTMF', type: 'eTMF', critical: false },
];

export const USERS = [
  { id: 'U-001', name: 'Sarah Chen', role: 'Study Lead' },
  { id: 'U-002', name: 'Marcus Patel', role: 'Clinical Ops' },
  { id: 'U-003', name: 'Priya Iyer', role: 'DM Lead' },
  { id: 'U-004', name: 'David Okafor', role: 'Vendor Mgr' },
  { id: 'U-005', name: 'Helen Rivera', role: 'Exec' },
  { id: 'U-006', name: 'James Liu', role: 'Country Lead' },
  { id: 'U-007', name: 'Aisha Nuru', role: 'CRA' },
  { id: 'U-008', name: 'Olivia Brown', role: 'DM Analyst' },
];

const STRESS: Record<string, string> = {
  S001: 'baseline',
  S002: 'slow_enrollment',
  S003: 'high_screen_failure',
  S004: 'site_activation_lag',
  S005: 'query_backlog_growth',
  S006: 'milestone_slippage',
  S007: 'vendor_sla',
  S008: 'deviation_spike',
};

const COUNTRIES = [
  'United States',
  'Germany',
  'France',
  'Spain',
  'United Kingdom',
  'Brazil',
  'Japan',
  'Canada',
  'Australia',
  'Poland',
];

const CONDITIONS: Array<[string, string, number]> = [
  ['Hypertension', 'Cardiovascular', 3],
  ['Type 2 Diabetes', 'Metabolic', 3],
  ['Major Depression', 'CNS', 2],
  ['Atopic Dermatitis', 'Dermatology', 3],
  ['NSCLC', 'Oncology', 2],
  ['Crohn\'s Disease', 'GI', 3],
  ['Migraine', 'CNS', 2],
  ['Heart Failure', 'Cardiovascular', 3],
];

const SPONSORS = ['Novartis', 'Novartis', 'Roche', 'Sanofi', 'GSK', 'Merck', 'BMS', 'AstraZeneca'];

function rngFactory(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RAND = rngFactory(CONFIG.seed);
const randInt = (min: number, max: number) => Math.floor(RAND() * (max - min + 1)) + min;
const randPick = <T>(items: T[]) => items[Math.floor(RAND() * items.length)];

export function generateData(): AppData {
  const today = new Date();
  const studies: Study[] = [];
  const sites: Site[] = [];
  const milestones: Milestone[] = [];
  const weekly: WeeklyMetric[] = [];
  const fpiBase = addDays(todayISO(today), -180);

  for (let i = 1; i <= CONFIG.studyCount; i += 1) {
    const id = `S-${String(i).padStart(3, '0')}`;
    const stressKey = `S00${i}`;
    const stress = STRESS[stressKey] || 'baseline';
    const [condition, area, phase] = CONDITIONS[(i - 1) % CONDITIONS.length];
    const sponsor = SPONSORS[(i - 1) % SPONSORS.length];
    const planned = 200 + i * 70;
    const plannedFpi = addDays(fpiBase, i * 7);
    const plannedLpi = addDays(plannedFpi, 365);
    studies.push({
      id,
      nctId: `NCT0521${String(34000 + i * 7)}`,
      title: `${condition} ${phase === 3 ? 'Phase III' : 'Phase II'} Confirmatory Study ${i}`,
      phase,
      condition,
      therapyArea: area,
      sponsor,
      plannedEnrollment: planned,
      plannedFpiDate: plannedFpi,
      plannedLpiDate: plannedLpi,
      status: 'Active',
      ownerId: 'U-001',
      stress,
    });

    const siteCount = randInt(5, 8);
    for (let s = 1; s <= siteCount; s += 1) {
      const sid = `${id}-ST${String(s).padStart(2, '0')}`;
      const country = randPick(COUNTRIES);
      const plannedSiv = addDays(plannedFpi, -30 + s * 5);
      let lag = randInt(0, 7);
      if (stress === 'site_activation_lag' && s <= 3) lag = randInt(18, 38);
      const actualSiv = addDays(plannedSiv, lag);
      sites.push({
        id: sid,
        studyId: id,
        country,
        region:
          country === 'United States' || country === 'Canada'
            ? 'North America'
            : country === 'Brazil'
            ? 'LATAM'
            : country === 'Japan' || country === 'Australia'
            ? 'APAC'
            : 'EMEA',
        plannedSivDate: plannedSiv,
        actualSivDate: actualSiv,
        status: 'Activated',
        pi: `Dr. ${randPick(['A. Müller', 'J. Park', 'E. Garcia', 'R. Tanaka', 'S. Reyes', 'B. Ahmed', 'L. Romano', 'N. Singh', 'M. Dubois', 'C. Wright'])}`,
        vendorId: VENDORS[(i + s) % VENDORS.length].id,
      });
    }

    const schedule = [
      { name: 'FPI', planned: plannedFpi, criticality: 'high' },
      { name: '25% Enrollment', planned: addDays(plannedFpi, 90), criticality: 'medium' },
      { name: '50% Enrollment', planned: addDays(plannedFpi, 180), criticality: 'medium' },
      { name: 'LPI', planned: plannedLpi, criticality: 'high' },
      { name: 'Database Lock (DBL)', planned: addDays(plannedLpi, 60), criticality: 'high' },
    ] as const;

    schedule.forEach((item, idx) => {
      const past = new Date(item.planned) < today;
      let actual: string | null = null;
      let status = 'Planned';
      if (past) {
        actual = addDays(item.planned, randInt(-3, 5));
        status = 'Done';
      }
      if (stress === 'milestone_slippage' && item.name === '25% Enrollment') {
        actual = null;
        status = 'Slipped';
      }
      milestones.push({
        id: `${id}-M${idx}`,
        studyId: id,
        name: item.name,
        plannedDate: item.planned,
        actualDate: actual,
        status,
        criticality: item.criticality,
      });
    });
  }

  const weeksAgo = (n: number) => weekStartISO(addDays(todayISO(today), -7 * n));
  for (const study of studies) {
    let cumEnroll = 0;
    const stress = STRESS[study.id.replace('S-', 'S00')] || 'baseline';
    for (let w = CONFIG.weeksHistory - 1; w >= 0; w -= 1) {
      const weekStart = weeksAgo(w);
      const weekIdx = CONFIG.weeksHistory - w;
      const plannedThisWeek = Math.round(study.plannedEnrollment * Math.min(1, weekIdx / 52));
      let weeklyEnrollTarget = Math.max(2, Math.round(study.plannedEnrollment / 52));
      let actualEnroll = weeklyEnrollTarget + randInt(-1, 2);
      if (stress === 'slow_enrollment') actualEnroll = Math.max(0, Math.round(weeklyEnrollTarget * 0.55) + randInt(-1, 1));
      const screened = Math.max(actualEnroll + 1, Math.round(actualEnroll * (1.4 + RAND() * 0.4)));
      let sfRate = 0.18 + (RAND() - 0.5) * 0.06;
      if (stress === 'high_screen_failure') sfRate = 0.42 + (RAND() - 0.5) * 0.05;
      const failed = Math.min(screened - actualEnroll, Math.round(screened * sfRate));
      const enrolled = screened - failed;
      cumEnroll += enrolled;
      let queries = 30 + randInt(-5, 10);
      if (stress === 'query_backlog_growth') queries = 40 + Math.round(weekIdx * 5) + randInt(-2, 3);
      let devMajor = randInt(0, 2);
      let devMinor = randInt(1, 5);
      if (stress === 'deviation_spike' && w <= 3) {
        devMajor = randInt(3, 6);
        devMinor = randInt(8, 12);
      }
      let tickets = randInt(2, 8);
      if (stress === 'vendor_sla' && w <= 4) tickets = randInt(10, 16);
      weekly.push({
        weekStart,
        studyId: study.id,
        screened,
        failed,
        enrolled,
        withdrawn: randInt(0, 1),
        cumEnroll,
        plannedCum: plannedThisWeek,
        openQueries: queries,
        deviationsMajor: devMajor,
        deviationsMinor: devMinor,
        vendorTickets: tickets,
      });
    }
  }

  return { studies, sites, milestones, weekly };
}

export function kpiForStudy(data: AppData, studyId: string): KpiSnapshot | null {
  const history = data.weekly.filter((week) => week.studyId === studyId).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  if (!history.length) return null;
  const last = history[history.length - 1];
  const prev = history[history.length - 2] || last;
  const last4 = history.slice(-4);
  const last12 = history.slice(-12);
  const study = data.studies.find((item) => item.id === studyId);
  if (!study) return null;
  const cumActual = last.cumEnroll;
  const cumPlanned = last.plannedCum;
  const variance = cumPlanned ? ((cumActual - cumPlanned) / cumPlanned) * 100 : 0;
  const enrollRate = last.enrolled;
  const screened4 = last4.reduce((sum, item) => sum + item.screened, 0);
  const failed4 = last4.reduce((sum, item) => sum + item.failed, 0);
  const sfRate = screened4 ? (failed4 / screened4) * 100 : 0;
  const enrolled12 = last12.reduce((sum, item) => sum + item.enrolled, 0);
  const screened12 = last12.reduce((sum, item) => sum + item.screened, 0);
  const funnel = screened12 ? (enrolled12 / screened12) * 100 : 0;
  const sites = data.sites.filter((site) => site.studyId === studyId);
  const activatedPct = sites.length ? 100 : 0;
  const lags = sites.map((site) => diffDays(site.plannedSivDate, site.actualSivDate));
  const maxLag = lags.length ? Math.max(...lags) : 0;
  const avgLag = lags.length ? lags.reduce((sum, x) => sum + x, 0) / lags.length : 0;
  const enroll4 = last4.reduce((sum, item) => sum + item.enrolled, 0);
  const sitesEnrollingPct = sites.length ? (enroll4 > 0 ? 100 : 0) : 0;
  const openQ = last.openQueries;
  const q4 = last4.map((item) => item.openQueries);
  const qPrev4 = history.slice(-8, -4).map((item) => item.openQueries);
  const qSum4 = q4.reduce((sum, x) => sum + x, 0);
  const qSumPrev = qPrev4.reduce((sum, x) => sum + x, 0) || qSum4;
  const qBacklogTrend = qSumPrev ? ((qSum4 - qSumPrev) / qSumPrev) * 100 : 0;
  const medQAge = 12 + Math.round(qBacklogTrend / 4);
  const devSeries = history.map((item) => item.deviationsMajor + item.deviationsMinor);
  const mean = devSeries.reduce((sum, x) => sum + x, 0) / devSeries.length;
  const varianceDev = devSeries.reduce((sum, x) => sum + (x - mean) ** 2, 0) / devSeries.length;
  const std = Math.sqrt(varianceDev);
  const last4DevAvg = last4.reduce((sum, item) => sum + item.deviationsMajor + item.deviationsMinor, 0) / 4;
  const vendorBreach30 = history.slice(-4).reduce((sum, item) => sum + (item.vendorTickets > 10 ? 1 : 0), 0);
  const mss = data.milestones.filter((item) => item.studyId === studyId);
  const slipped = mss.filter((item) => !item.actualDate && new Date(item.plannedDate) < new Date());
  const onTrack = mss.length ? 100 - (slipped.length / mss.length) * 100 : 100;
  const xs = history.map((_, index) => index);
  const ys = history.map((item) => item.cumEnroll);
  const xbar = xs.reduce((sum, x) => sum + x, 0) / xs.length;
  const ybar = ys.reduce((sum, y) => sum + y, 0) / ys.length;
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - xbar) * (ys[i] - ybar);
    den += (x - xbar) ** 2;
  });
  const slope = den ? num / den : 0;
  const intercept = ybar - slope * xbar;
  const target = study.plannedEnrollment;
  let weeksToLpi = slope > 0 ? Math.ceil((target - last.cumEnroll) / slope) : 999;
  if (weeksToLpi < 0) weeksToLpi = 0;
  const forecastLpi = addDays(last.weekStart, weeksToLpi * 7);
  const forecastMissDays = diffDays(study.plannedLpiDate, forecastLpi);
  const dbl = mss.find((item) => item.name.includes('DBL'));
  const daysToLock = dbl ? diffDays(todayISO(), dbl.plannedDate) : 999;
  const lockRisk = Math.min(100, Math.max(0, qBacklogTrend / 2 + medQAge / 2 + (daysToLock < 60 ? 60 - daysToLock : 0)));
  return {
    studyId,
    weekStart: last.weekStart,
    cumActual,
    cumPlanned,
    variance,
    enrollRate,
    sfRate,
    funnel,
    activatedPct,
    sitesCount: sites.length,
    maxLag,
    avgLag,
    sitesEnrollingPct,
    openQ,
    qBacklogTrend,
    medQAge,
    devMean: mean,
    devStd: std,
    last4DevAvg,
    vendorBreach30,
    onTrack,
    slippedCount: slipped.length,
    slippedNames: slipped.map((item) => item.name),
    forecastLpi,
    forecastMissDays,
    plannedLpi: study.plannedLpiDate,
    daysToLock,
    lockRisk,
    sparkEnroll: history.map((item) => item.cumEnroll),
    sparkPlanned: history.map((item) => item.plannedCum),
    sparkSF: history.map((item) => {
      const sc = item.screened || 1;
      return Math.round((item.failed / sc) * 100);
    }),
    sparkQ: history.map((item) => item.openQueries),
    sparkDev: history.map((item) => item.deviationsMajor + item.deviationsMinor),
  };
}

export function kpiAll(data: AppData): Record<string, KpiSnapshot> {
  return data.studies.reduce((acc, study) => {
    const snapshot = kpiForStudy(data, study.id);
    if (snapshot) acc[study.id] = snapshot;
    return acc;
  }, {} as Record<string, KpiSnapshot>);
}

export function filterRisksByPersona(risks: RiskItem[], persona: Persona): RiskItem[] {
  return risks.filter((risk) => {
    const ruleOk = !persona.ruleFilter || persona.ruleFilter.includes(risk.ruleId);
    const severityOk = !persona.severityFilter || risk.severity === persona.severityFilter;
    return ruleOk && severityOk;
  });
}

export const RULES = [
  {
    id: 'R-001',
    name: 'Slow Enrollment',
    kpis: ['K-001', 'K-003', 'K-005'],
    eval: (k: KpiSnapshot) => {
      if (k.variance < CONFIG.thresholds.slowEnrollMed && k.variance >= CONFIG.thresholds.slowEnrollHigh) {
        return { sev: 'Medium' as const, mitigation: 'Reforecast LPI; activate backup sites; review screening funnel' };
      }
      if (k.variance < CONFIG.thresholds.slowEnrollHigh) {
        return { sev: 'High' as const, mitigation: 'Escalate to sponsor; emergency site activation; protocol amendment review' };
      }
      return null;
    },
  },
  {
    id: 'R-002',
    name: 'High Screen Failure',
    kpis: ['K-010', 'K-011', 'K-012'],
    eval: (k: KpiSnapshot) => {
      if (k.sfRate > CONFIG.thresholds.sfHigh) return { sev: 'High' as const, mitigation: 'Re-train sites on I/E criteria; protocol amendment review' };
      if (k.sfRate > CONFIG.thresholds.sfMed) return { sev: 'Medium' as const, mitigation: 'Site-level I/E review; investigator training' };
      return null;
    },
  },
  {
    id: 'R-003',
    name: 'Delayed Site Activation',
    kpis: ['K-020', 'K-021'],
    eval: (k: KpiSnapshot) => {
      if (k.maxLag > CONFIG.thresholds.siteLagHigh) return { sev: 'High' as const, mitigation: 'Escalate with site/CRO; reassign country lead' };
      if (k.maxLag > CONFIG.thresholds.siteLagMed) return { sev: 'Medium' as const, mitigation: 'Site readiness review; CRA on-site visit' };
      return null;
    },
  },
  {
    id: 'R-004',
    name: 'Query Backlog Growth',
    kpis: ['K-030', 'K-031', 'K-032'],
    eval: (k: KpiSnapshot) => {
      if (k.qBacklogTrend > CONFIG.thresholds.queryGrowth && k.medQAge > CONFIG.thresholds.queryAge) return { sev: 'High' as const, mitigation: 'DM surge resourcing; escalate to vendor; pre-lock plan' };
      if (k.qBacklogTrend > CONFIG.thresholds.queryGrowth) return { sev: 'Medium' as const, mitigation: 'DM team review; weekly query triage' };
      return null;
    },
  },
  {
    id: 'R-005',
    name: 'Milestone Slippage',
    kpis: ['K-060', 'K-061'],
    eval: (k: KpiSnapshot) => {
      if (k.slippedCount > 0) return { sev: 'High' as const, mitigation: 'Replan with sponsor; assess downstream impact' };
      return null;
    },
  },
  {
    id: 'R-006',
    name: 'Inactive Site',
    kpis: ['K-022', 'K-004'],
    eval: (k: KpiSnapshot) => {
      if (k.sitesEnrollingPct < 50) return { sev: 'Medium' as const, mitigation: 'Site engagement plan; consider deactivation' };
      return null;
    },
  },
  {
    id: 'R-007',
    name: 'Deviation Spike',
    kpis: ['K-040', 'K-041', 'K-042'],
    eval: (k: KpiSnapshot) => {
      if (k.last4DevAvg > k.devMean + CONFIG.thresholds.deviationSigma * k.devStd && k.devStd > 0) return { sev: 'High' as const, mitigation: 'Site retraining; CAPA review; QA audit' };
      return null;
    },
  },
  {
    id: 'R-008',
    name: 'Vendor SLA Breach',
    kpis: ['K-050', 'K-051', 'K-052'],
    eval: (k: KpiSnapshot) => {
      if (k.vendorBreach30 >= CONFIG.thresholds.vendorBreach) return { sev: 'High' as const, mitigation: 'Vendor governance escalation; secondary vendor activation' };
      return null;
    },
  },
  {
    id: 'R-009',
    name: 'Forecast Miss',
    kpis: ['K-001', 'K-002', 'K-005'],
    eval: (k: KpiSnapshot) => {
      if (k.forecastMissDays > CONFIG.thresholds.forecastMissHigh) return { sev: 'High' as const, mitigation: 'Activate contingency sites; sponsor decision on enrollment plan' };
      if (k.forecastMissDays > CONFIG.thresholds.forecastMissMed) return { sev: 'Medium' as const, mitigation: 'Watch list; weekly forecast review' };
      return null;
    },
  },
  {
    id: 'R-010',
    name: 'Data Lock Risk',
    kpis: ['K-030', 'K-031', 'K-032', 'K-034', 'K-060'],
    eval: (k: KpiSnapshot) => {
      if (k.daysToLock < 60 && k.lockRisk > 50) return { sev: 'High' as const, mitigation: 'Query surge plan; pre-lock review meeting' };
      return null;
    },
  },
];

export const ONTOLOGY = {
  nodes: [
    { id: '404684003', fsn: 'Clinical finding', tag: 'finding' },
    { id: '64572001', fsn: 'Disease (disorder)', tag: 'disorder' },
    { id: '49601007', fsn: 'Disorder of cardiovascular system', tag: 'disorder', alt: { 'ICD-10': 'I00–I99' } },
    { id: '38341003', fsn: 'Hypertensive disorder, systemic arterial', tag: 'disorder', alt: { 'ICD-10': 'I10', MedDRA: '10020772' } },
    { id: '84114007', fsn: 'Heart failure', tag: 'disorder', alt: { 'ICD-10': 'I50', MedDRA: '10019279' } },
    { id: '75934005', fsn: 'Metabolic disorder', tag: 'disorder' },
    { id: '44054006', fsn: 'Type 2 diabetes mellitus', tag: 'disorder', alt: { 'ICD-10': 'E11', MedDRA: '10067585' } },
    { id: '74732009', fsn: 'Mental disorder', tag: 'disorder' },
    { id: '370143000', fsn: 'Major depressive disorder, single episode', tag: 'disorder', alt: { 'ICD-10': 'F32', MedDRA: '10025454' } },
    { id: '118940003', fsn: 'Disorder of nervous system', tag: 'disorder' },
    { id: '37796009', fsn: 'Migraine', tag: 'disorder', alt: { 'ICD-10': 'G43', MedDRA: '10027599' } },
    { id: '95320005', fsn: 'Disorder of skin', tag: 'disorder' },
    { id: '24079001', fsn: 'Atopic dermatitis', tag: 'disorder', alt: { 'ICD-10': 'L20', MedDRA: '10003639' } },
    { id: '55342001', fsn: 'Neoplastic disease', tag: 'disorder' },
    { id: '254637007', fsn: 'Non-small cell lung carcinoma', tag: 'disorder', alt: { 'ICD-10': 'C34', MedDRA: '10029522' } },
    { id: '53619000', fsn: 'Disorder of digestive system', tag: 'disorder' },
    { id: '34000006', fsn: 'Crohn disease', tag: 'disorder', alt: { 'ICD-10': 'K50', MedDRA: '10011401' } },
    { id: '43396009', fsn: 'Hemoglobin A1c measurement', tag: 'procedure', alt: { LOINC: '4548-4' } },
    { id: '75367002', fsn: 'Blood pressure measurement', tag: 'procedure', alt: { LOINC: '85354-9' } },
    { id: '104727007', fsn: 'Eosinophil count', tag: 'procedure', alt: { LOINC: '711-2' } },
    { id: '372733002', fsn: 'Statin (substance)', tag: 'substance', alt: { RxNorm: '36567' } },
    { id: '372567009', fsn: 'Metformin (substance)', tag: 'substance', alt: { RxNorm: '6809' } },
    { id: 'OP:001', fsn: 'Slow enrollment risk', tag: 'operational' },
    { id: 'OP:002', fsn: 'High screen failure risk', tag: 'operational' },
    { id: 'OP:003', fsn: 'Delayed site activation', tag: 'operational' },
    { id: 'OP:004', fsn: 'Query backlog growth', tag: 'operational' },
    { id: 'OP:005', fsn: 'Milestone slippage', tag: 'operational' },
    { id: 'OP:007', fsn: 'Protocol deviation spike', tag: 'operational' },
    { id: 'OP:008', fsn: 'Vendor SLA breach', tag: 'operational' },
    { id: 'OP:010', fsn: 'Data lock risk', tag: 'operational' },
    { id: 'MIT:001', fsn: 'Activate backup sites', tag: 'mitigation' },
    { id: 'MIT:002', fsn: 'Investigator I/E retraining', tag: 'mitigation' },
    { id: 'MIT:003', fsn: 'Vendor governance escalation', tag: 'mitigation' },
    { id: 'MIT:004', fsn: 'Sponsor decision review', tag: 'mitigation' },
    { id: 'MIT:005', fsn: 'Data management surge resourcing', tag: 'mitigation' },
    { id: 'MIT:006', fsn: 'Pre-database-lock cleanup sprint', tag: 'mitigation' },
    { id: 'V:001', fsn: 'Cardiovascular CRO partner', tag: 'vendor' },
    { id: 'V:002', fsn: 'CNS CRO partner', tag: 'vendor' },
    { id: 'V:003', fsn: 'Oncology CRO partner', tag: 'vendor' },
    { id: 'V:004', fsn: 'Metabolic/Endocrine CRO', tag: 'vendor' },
    { id: 'V:005', fsn: 'Central laboratory provider', tag: 'vendor' },
  ] as OntologyNode[],
  edges: [
    ['64572001', 'isa', '404684003'],
    ['49601007', 'isa', '64572001'],
    ['38341003', 'isa', '49601007'],
    ['84114007', 'isa', '49601007'],
    ['75934005', 'isa', '64572001'],
    ['44054006', 'isa', '75934005'],
    ['74732009', 'isa', '64572001'],
    ['370143000', 'isa', '74732009'],
    ['118940003', 'isa', '64572001'],
    ['37796009', 'isa', '118940003'],
    ['95320005', 'isa', '64572001'],
    ['24079001', 'isa', '95320005'],
    ['55342001', 'isa', '64572001'],
    ['254637007', 'isa', '55342001'],
    ['53619000', 'isa', '64572001'],
    ['34000006', 'isa', '53619000'],
    ['44054006', 'has-criterion', '43396009'],
    ['38341003', 'has-criterion', '75367002'],
    ['84114007', 'has-criterion', '75367002'],
    ['24079001', 'has-criterion', '104727007'],
    ['49601007', 'typical-vendor', 'V:001'],
    ['74732009', 'typical-vendor', 'V:002'],
    ['118940003', 'typical-vendor', 'V:002'],
    ['55342001', 'typical-vendor', 'V:003'],
    ['75934005', 'typical-vendor', 'V:004'],
    ['95320005', 'typical-vendor', 'V:001'],
    ['53619000', 'typical-vendor', 'V:003'],
    ['OP:001', 'mitigation', 'MIT:001'],
    ['OP:001', 'mitigation', 'MIT:004'],
    ['OP:002', 'mitigation', 'MIT:002'],
    ['OP:003', 'mitigation', 'MIT:003'],
    ['OP:004', 'mitigation', 'MIT:005'],
    ['OP:005', 'mitigation', 'MIT:004'],
    ['OP:007', 'mitigation', 'MIT:002'],
    ['OP:008', 'mitigation', 'MIT:003'],
    ['OP:010', 'mitigation', 'MIT:006'],
    ['OP:010', 'mitigation', 'MIT:005'],
    ['MIT:001', 'executes-via', 'V:001'],
    ['MIT:001', 'executes-via', 'V:002'],
    ['MIT:001', 'executes-via', 'V:003'],
    ['MIT:001', 'executes-via', 'V:004'],
    ['MIT:003', 'executes-via', 'V:005'],
    ['MIT:005', 'executes-via', 'V:005'],
    ['44054006', 'typical-treatment', '372567009'],
    ['49601007', 'typical-treatment', '372733002'],
  ] as OntologyEdge[],
};

export const CONDITION_SCT: Record<string, string> = {
  Hypertension: '38341003',
  'Type 2 Diabetes': '44054006',
  'Major Depression': '370143000',
  'Atopic Dermatitis': '24079001',
  NSCLC: '254637007',
  "Crohn's Disease": '34000006',
  Migraine: '37796009',
  'Heart Failure': '84114007',
};

export const RULE_OP: Record<string, string> = {
  'R-001': 'OP:001',
  'R-002': 'OP:002',
  'R-003': 'OP:003',
  'R-004': 'OP:004',
  'R-005': 'OP:005',
  'R-007': 'OP:007',
  'R-008': 'OP:008',
  'R-009': 'OP:001',
  'R-010': 'OP:010',
};

const buildAdjacency = () => {
  const nodes: Record<string, { node: OntologyNode; out: Array<{ rel: string; to: string }>; in: Array<{ rel: string; from: string }> }> = {};
  ONTOLOGY.nodes.forEach((node) => {
    nodes[node.id] = { node, out: [], in: [] };
  });
  ONTOLOGY.edges.forEach(([source, rel, target]) => {
    nodes[source]?.out.push({ rel, to: target });
    nodes[target]?.in.push({ rel, from: source });
  });
  return nodes;
};

const ADJ = buildAdjacency();

export function graphHops(start: string, maxHops = 3, relFilter: string | null = null) {
  if (!ADJ[start]) return [] as Array<Array<{ node: string; rel?: string }>>;
  const paths: Array<Array<{ node: string; rel?: string }>> = [];
  const seen = new Set<string>([start]);
  const queue = [{ node: start, path: [{ node: start }] }];
  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    if (current.path.length - 1 >= maxHops) continue;
    const node = ADJ[current.node];
    for (const edge of node.out) {
      if (relFilter && edge.rel !== relFilter) continue;
      const key = [...current.path.map((step) => step.node), edge.to].join('>');
      if (seen.has(key)) continue;
      seen.add(key);
      const nextPath = [...current.path, { rel: edge.rel, node: edge.to }];
      paths.push(nextPath);
      queue.push({ node: edge.to, path: nextPath });
    }
  }
  return paths;
}

export function findShortestPath(start: string, end: string, relFilter: string | null = null) {
  if (!ADJ[start] || !ADJ[end]) return null;
  if (start === end) return [{ node: start }];
  const visited = new Set<string>([start]);
  const queue: Array<Array<{ node: string; rel?: string }>> = [[{ node: start }]];
  while (queue.length) {
    const path = queue.shift();
    if (!path) break;
    const tail = path[path.length - 1].node;
    const node = ADJ[tail];
    for (const edge of node.out) {
      if (relFilter && edge.rel !== relFilter) continue;
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      const next = [...path, { rel: edge.rel, node: edge.to }];
      if (edge.to === end) return next;
      queue.push(next);
    }
  }
  return null;
}

export function deriveInferences(risks: RiskItem[], data: AppData) {
  const results: Array<{
    id: string;
    studyId: string;
    ruleId: string;
    ruleName: string;
    severity: 'High' | 'Medium' | 'Low';
    recommendation: string;
    confidence: 'High' | 'Medium' | 'Low';
    operationalChain: Array<{ node: string; rel?: string }>;
    clinicalChain: Array<{ node: string; rel?: string }>;
  }> = [];
  for (const risk of risks) {
    const study = data.studies.find((item) => item.id === risk.studyId);
    const opCpt = RULE_OP[risk.ruleId];
    const condCpt = study ? CONDITION_SCT[study.condition] : undefined;
    if (!opCpt || !condCpt) continue;
    const mitigationEdges = ADJ[opCpt].out.filter((edge) => edge.rel === 'mitigation');
    if (!mitigationEdges.length) continue;
    let parent = condCpt;
    const isaChain: Array<{ node: string; rel?: string }> = [{ node: condCpt }];
    while (true) {
      const up = ADJ[parent].out.find((edge) => edge.rel === 'isa');
      if (!up) break;
      isaChain.push({ rel: up.rel, node: up.to });
      parent = up.to;
      if (ADJ[parent].out.some((edge) => edge.rel === 'typical-vendor')) break;
    }
    const vendorEdge = ADJ[parent].out.find((edge) => edge.rel === 'typical-vendor');
    const clinicalChain = vendorEdge ? [...isaChain, { rel: vendorEdge.rel, node: vendorEdge.to }] : isaChain;
    for (const mitigationEdge of mitigationEdges) {
      const exec = ADJ[mitigationEdge.to].out.find((edge) => edge.rel === 'executes-via' && edge.to === (vendorEdge?.to || ''));
      results.push({
        id: `INF-${risk.id}-${mitigationEdge.to}`,
        studyId: risk.studyId,
        ruleId: risk.ruleId,
        ruleName: risk.ruleName,
        severity: risk.severity,
        recommendation: `${ADJ[mitigationEdge.to].node.fsn}${exec ? ` via ${ADJ[exec.to].node.fsn}` : vendorEdge ? ` (vendor type: ${ADJ[vendorEdge.to].node.fsn})` : ''}`,
        confidence: vendorEdge ? 'High' : 'Medium',
        operationalChain: [{ node: opCpt }, { rel: 'mitigation', node: mitigationEdge.to }, ...(exec ? [{ rel: 'executes-via', node: exec.to }] : [])],
        clinicalChain,
      });
    }
  }
  const unique = results.reduce((acc, item) => {
    acc[`${item.studyId}-${item.recommendation}-${item.ruleId}`] = item;
    return acc;
  }, {} as Record<string, typeof results[number]>);
  return Object.values(unique).sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 } as const;
    return order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order];
  });
}

export function evaluateRisks(data: AppData, kpis: Record<string, KpiSnapshot>): RiskItem[] {
  const list: RiskItem[] = [];
  for (const study of data.studies) {
    const k = kpis[study.id];
    if (!k) continue;
    for (const rule of RULES) {
      const evaluated = rule.eval(k);
      if (!evaluated) continue;
      list.push({
        id: `RISK-${study.id}-${rule.id}`,
        studyId: study.id,
        ruleId: rule.id,
        ruleName: rule.name,
        severity: evaluated.sev,
        mitigation: evaluated.mitigation,
        contributingKpis: rule.kpis,
        slice: { studyId: study.id, weekStart: k.weekStart, kpiSummary: k },
        openedAt: todayISO(),
        status: 'Open',
        daysOpen: 0,
      });
    }
  }
  return list.sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 } as const;
    if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
    return a.studyId.localeCompare(b.studyId);
  });
}

export const KPI_DEFS = {
  'K-001': { name: 'Cumulative Actual Enrollment', formula: 'Σ enrolled subjects through week W', grain: 'Study × Week' },
  'K-002': { name: 'Planned Cumulative Enrollment', formula: 'Plan curve through week W', grain: 'Study × Week' },
  'K-003': { name: 'Enrollment Variance %', formula: '(K-001 − K-002)/K-002 × 100', grain: 'Study × Week' },
  'K-004': { name: 'Enrollment Rate', formula: 'ΔK-001 between consecutive weeks', grain: 'Study × Site × Week' },
  'K-005': { name: 'Enrollment Forecast LPI', formula: 'Linear regression on K-001 to plan target', grain: 'Study' },
  'K-010': { name: 'Screening Volume', formula: 'Count screened in window', grain: 'Study × Week' },
  'K-011': { name: 'Screen Failure %', formula: 'Failed/Screened trailing 4 weeks × 100', grain: 'Study × Site' },
  'K-012': { name: 'Funnel Conversion %', formula: 'Enrolled/Screened trailing 12 weeks', grain: 'Study × Site' },
  'K-020': { name: 'Site Activation Lag', formula: 'Actual − Planned SIV (days)', grain: 'Site' },
  'K-021': { name: '% Sites Activated', formula: 'Activated/Planned × 100', grain: 'Study' },
  'K-022': { name: '% Sites Enrolling', formula: 'Sites with ≥1 subject in 30d / Activated × 100', grain: 'Study' },
  'K-030': { name: 'Open Data Queries', formula: 'Count of open queries', grain: 'Study × Site' },
  'K-031': { name: 'Query Backlog Trend', formula: 'Δ open queries trailing 4w', grain: 'Study' },
  'K-032': { name: 'Median Query Age', formula: 'Median(now − created) for open queries', grain: 'Study' },
  'K-034': { name: 'Data Lock Risk Score', formula: 'f(K-031, K-032, days-to-lock)', grain: 'Study' },
  'K-040': { name: 'Protocol Deviations', formula: 'Count of deviations in window', grain: 'Study × Week' },
  'K-041': { name: 'Deviation Rate per Subject-Month', formula: 'Deviations/subject-months', grain: 'Study × Site' },
  'K-042': { name: 'Major/Minor Deviation Split', formula: 'Major/(Major+Minor) × 100', grain: 'Study' },
  'K-050': { name: 'Vendor Ticket Volume', formula: 'Open tickets by vendor in window', grain: 'Vendor × Study' },
  'K-051': { name: 'Vendor SLA Breach Count', formula: 'Tickets > SLA threshold', grain: 'Vendor × Study' },
  'K-052': { name: 'Vendor Time-to-Resolve', formula: 'Median resolution time', grain: 'Vendor × Study' },
  'K-060': { name: 'Milestone Slippage Days', formula: 'Actual − Planned (or today − Planned for overdue)', grain: 'Study × Milestone' },
  'K-061': { name: '% Milestones On Track', formula: 'On-track/total × 100', grain: 'Study' },
  'K-070': { name: 'Portfolio Risk Heat', formula: 'Weighted active high/medium risks per study', grain: 'Portfolio' },
} as const;

export function kpiValueFor(id: string, k?: KpiSnapshot) {
  if (!k) return '—';
  const mapping: Record<string, string | number> = {
    'K-001': k.cumActual,
    'K-002': k.cumPlanned,
    'K-003': `${((k.variance || 0) >= 0 ? '+' : '')}${k.variance.toFixed(1)}%`,
    'K-004': k.enrollRate,
    'K-005': k.forecastLpi,
    'K-010': '—',
    'K-011': `${k.sfRate.toFixed(1)}%`,
    'K-012': `${k.funnel.toFixed(1)}%`,
    'K-020': `${k.maxLag}d`,
    'K-021': `${k.activatedPct}%`,
    'K-022': `${k.sitesEnrollingPct}%`,
    'K-030': k.openQ,
    'K-031': `${k.qBacklogTrend.toFixed(1)}%`,
    'K-032': `${k.medQAge}d`,
    'K-034': `${Math.round(k.lockRisk)}/100`,
    'K-040': k.last4DevAvg.toFixed(1),
    'K-041': '—',
    'K-042': '—',
    'K-050': '—',
    'K-051': k.vendorBreach30,
    'K-052': '—',
    'K-060': `${k.slippedCount} slipped`,
    'K-061': `${k.onTrack.toFixed(1)}%`,
    'K-070': '—',
  };
  return mapping[id] ?? '—';
}

export function renderPackHtml(study: Study, k: KpiSnapshot, pack: MeetingPack, risks: RiskItem[]) {
  const stRisks = risks.filter((risk) => risk.studyId === study.id);
  const insights = [
    `<p><strong>Enrollment.</strong> Cumulative ${k.cumActual} vs planned ${k.cumPlanned} (variance ${((k.variance || 0) >= 0 ? '+' : '')}${k.variance.toFixed(1)}%). Forecast LPI ${k.forecastLpi}${k.forecastMissDays > 0 ? ` (+${k.forecastMissDays}d vs plan)` : ''}.</p>`,
    `<p><strong>Sites & Screening.</strong> SF ${k.sfRate.toFixed(1)}%, max activation lag ${k.maxLag}d, sites enrolling ${k.sitesEnrollingPct}%.</p>`,
    `<p><strong>Data Management.</strong> Open queries ${k.openQ}, backlog ${k.qBacklogTrend.toFixed(1)}%, median age ${k.medQAge}d, lock risk ${Math.round(k.lockRisk)}/100.</p>`,
    `<p><strong>Quality.</strong> 4w deviation avg ${k.last4DevAvg.toFixed(1)} vs mean ${k.devMean.toFixed(1)} (σ ${k.devStd.toFixed(1)}).</p>`,
    `<p><strong>Vendor.</strong> SLA breach events in trailing 4 weeks: ${k.vendorBreach30}.</p>`,
  ].join('\n');
  const riskRows = stRisks
    .map((risk) => `<tr><td><strong>${risk.severity}</strong></td><td>${risk.ruleName}</td><td>${risk.contributingKpis.join(', ')}</td><td>${risk.mitigation}</td></tr>`)
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>Meeting Pack — ${study.id}</title><style>body{font-family:Arial,sans-serif;max-width:920px;margin:24px auto;padding:0 24px;color:#0f172a}h1{margin-bottom:0}h2{border-bottom:2px solid #4338ca;padding-bottom:4px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #e2e8f0;padding:6px 10px;font-size:13px;text-align:left}.kpis td{padding:8px 12px}.high{background:#fee2e2;color:#b91c1c;font-weight:bold}.med{background:#fef3c7;color:#b45309}</style></head><body><div style="font-size:11px;color:#64748b">Study Health Pack — generated ${new Date(pack.generatedAt).toLocaleString()} by ${pack.createdBy}</div><h1>${study.title}</h1><div style="color:#64748b">${study.nctId} • ${study.sponsor} • ${study.therapyArea} • Phase ${study.phase}</div><h2>Agenda</h2><ol>${pack.agenda.map((item) => `<li>${item}</li>`).join('')}</ol><h2>KPI Snapshot</h2><table class="kpis"><tr><td>Enrollment</td><td>${pack.kpiSnapshot.enrollment} (${pack.kpiSnapshot.variance})</td><td>Screen Failure</td><td>${pack.kpiSnapshot.sfRate}</td></tr><tr><td>Open Queries</td><td>${pack.kpiSnapshot.openQueries}</td><td>Forecast LPI</td><td>${pack.kpiSnapshot.forecastLpi}${pack.kpiSnapshot.forecastMissDays > 0 ? ` (+${pack.kpiSnapshot.forecastMissDays}d)` : ''}</td></tr></table><h2>Narrative</h2>${insights}<h2>Risks (${stRisks.length})</h2><table><tr><th>Severity</th><th>Rule</th><th>Contributing KPIs</th><th>Recommended Mitigation</th></tr>${riskRows}</table><h2>Decisions Needed</h2><ul>${pack.decisionsNeeded.map((d) => `<li><strong>${d.ruleName}</strong> — ${d.mitigation}</li>`).join('') || '<li>None.</li>'}</ul><p style="font-size:11px;color:#94a3b8;margin-top:32px">Catalyst.AI prototype — every claim above is traceable to KPI ID and underlying weekly_metrics slice (week of ${k.weekStart}).</p></body></html>`;
}
