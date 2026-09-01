import { describe, expect, it } from 'vitest';
import { calculatePriorityScore } from './index';

describe('calculatePriorityScore', () => {
  it('returns 100 when all normalized components are 100', () => {
    expect(
      calculatePriorityScore({
        demand: 100,
        severity: 100,
        needGap: 100,
        infrastructureGap: 100,
        populationNeed: 100,
        planGap: 100,
      }),
    ).toBe(100);
  });

  it('returns 0 when all normalized components are 0', () => {
    expect(
      calculatePriorityScore({
        demand: 0,
        severity: 0,
        needGap: 0,
        infrastructureGap: 0,
        populationNeed: 0,
        planGap: 0,
      }),
    ).toBe(0);
  });

  it('rounds to two decimal places', () => {
    expect(
      calculatePriorityScore({
        demand: 71,
        severity: 82,
        needGap: 65,
        infrastructureGap: 54,
        populationNeed: 47,
        planGap: 38,
      }),
    ).toBe(65.75);
  });
});

