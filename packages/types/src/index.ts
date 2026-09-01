export const USER_ROLES = [
  'CITIZEN',
  'FIELD_WORKER',
  'OFFICER',
  'DISTRICT_ADMIN',
  'ANALYST',
  'AUDITOR',
  'SUPER_ADMIN',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const REPORT_STATUSES = [
  'CREATED',
  'PROCESSING',
  'AWAITING_CONFIRMATION',
  'SUBMITTED',
  'AI_PROCESSED',
  'CLUSTERED',
  'PRIORITIZED',
  'UNDER_REVIEW',
  'NEEDS_MORE_INFO',
  'ACTION_PLANNED',
  'IN_PROGRESS',
  'RESOLVED',
  'REJECTED',
  'DUPLICATE',
] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

const reportTransitions: Readonly<Record<ReportStatus, readonly ReportStatus[]>> = {
  CREATED: ['PROCESSING'],
  PROCESSING: ['AWAITING_CONFIRMATION', 'NEEDS_MORE_INFO', 'REJECTED'],
  AWAITING_CONFIRMATION: ['SUBMITTED', 'NEEDS_MORE_INFO'],
  SUBMITTED: ['AI_PROCESSED', 'NEEDS_MORE_INFO', 'DUPLICATE'],
  AI_PROCESSED: ['CLUSTERED', 'NEEDS_MORE_INFO', 'DUPLICATE'],
  CLUSTERED: ['PRIORITIZED', 'UNDER_REVIEW', 'DUPLICATE'],
  PRIORITIZED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['ACTION_PLANNED', 'NEEDS_MORE_INFO', 'REJECTED', 'DUPLICATE'],
  NEEDS_MORE_INFO: ['PROCESSING', 'REJECTED'],
  ACTION_PLANNED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'ACTION_PLANNED'],
  RESOLVED: [],
  REJECTED: [],
  DUPLICATE: [],
};

export function isValidReportStateTransition(
  current: ReportStatus,
  next: ReportStatus,
): boolean {
  return reportTransitions[current].includes(next);
}

export class InvalidReportStateTransitionError extends Error {
  constructor(current: ReportStatus, next: ReportStatus) {
    super(`Invalid report status transition: ${current} -> ${next}`);
    this.name = 'InvalidReportStateTransitionError';
  }
}

export function assertValidReportStateTransition(current: ReportStatus, next: ReportStatus): void {
  if (!isValidReportStateTransition(current, next)) {
    throw new InvalidReportStateTransitionError(current, next);
  }
}

export type PriorityComponents = {
  demand: number;
  severity: number;
  needGap: number;
  infrastructureGap: number;
  populationNeed: number;
  planGap: number;
};

export type PriorityWeights = {
  demand: number;
  severity: number;
  needGap: number;
  infrastructureGap: number;
  populationNeed: number;
  planGap: number;
};

export const DEFAULT_PRIORITY_WEIGHTS: Readonly<PriorityWeights> = {
  demand: 0.3,
  severity: 0.2,
  needGap: 0.2,
  infrastructureGap: 0.15,
  populationNeed: 0.1,
  planGap: 0.05,
};

const priorityComponentNames = Object.keys(DEFAULT_PRIORITY_WEIGHTS) as Array<keyof PriorityComponents>;

export function calculatePriorityScore(
  components: PriorityComponents,
  weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
): number {
  const totalWeight = priorityComponentNames.reduce((total, component) => total + weights[component], 0);
  if (Math.abs(totalWeight - 1) > Number.EPSILON) {
    throw new Error('Priority weights must sum to 1.');
  }

  const rawScore = priorityComponentNames.reduce((total, component) => {
    const value = components[component];
    if (value < 0 || value > 100) {
      throw new RangeError(`${component} must be between 0 and 100.`);
    }
    return total + value * weights[component];
  }, 0);

  return Math.round(rawScore * 100) / 100;
}

