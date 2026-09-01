import { describe, expect, it } from 'vitest';
import {
  InvalidReportStateTransitionError,
  assertValidReportStateTransition,
  isValidReportStateTransition,
} from './index';

describe('report state transitions', () => {
  it('permits the citizen confirmation and processing flow', () => {
    expect(isValidReportStateTransition('CREATED', 'PROCESSING')).toBe(true);
    expect(isValidReportStateTransition('PROCESSING', 'AWAITING_CONFIRMATION')).toBe(true);
    expect(isValidReportStateTransition('AWAITING_CONFIRMATION', 'SUBMITTED')).toBe(true);
    expect(isValidReportStateTransition('SUBMITTED', 'AI_PROCESSED')).toBe(true);
  });

  it('rejects terminal and arbitrary transitions', () => {
    expect(isValidReportStateTransition('RESOLVED', 'IN_PROGRESS')).toBe(false);
    expect(() => assertValidReportStateTransition('CREATED', 'RESOLVED')).toThrow(
      InvalidReportStateTransitionError,
    );
  });
});
