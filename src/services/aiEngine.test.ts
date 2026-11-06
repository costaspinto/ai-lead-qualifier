import { describe, expect, it } from 'vitest';
import {
  applyQualificationSettings,
  DEFAULT_QUALIFICATION_SETTINGS,
  INITIAL_LEAD_PROFILE,
  scoreBudget,
} from './aiEngine';
import type { LeadProfile, QualificationSettings } from '../types';

const settings: QualificationSettings = {
  ...DEFAULT_QUALIFICATION_SETTINGS,
  minimumMonthlyBudget: 5000,
};

describe('scoreBudget', () => {
  it('awards 25 when the entire range meets the minimum', () => {
    expect(scoreBudget('$5,000-$10,000 monthly range', 5000).score).toBe(25);
  });

  it('awards 5 when the entire range is below the minimum', () => {
    expect(scoreBudget('$500-$1,500 monthly range', 5000).score).toBe(5);
  });

  it('awards 12 when a range overlaps the minimum', () => {
    expect(scoreBudget('$2,000-$10,000 monthly range', 5000).score).toBe(12);
  });

  it('handles reversed budget ranges conservatively', () => {
    expect(scoreBudget('$10,000-$5,000 monthly range', 5000).score).toBe(25);
    expect(scoreBudget('$3,000-$1,000 monthly range', 5000).score).toBe(5);
  });

  it('does not treat an unknown amount as qualified budget', () => {
    expect(scoreBudget('Approved budget', 500).score).toBe(5);
  });

  it('scores a stated amount conservatively', () => {
    expect(scoreBudget('$5,000 monthly budget stated', 5000).score).toBe(25);
    expect(scoreBudget('$1,000 monthly budget stated', 5000).score).toBe(5);
  });

  it('gives no-budget leads a low score', () => {
    expect(scoreBudget('No allocated budget ($0)', 0).score).toBe(5);
  });
});

describe('applyQualificationSettings', () => {
  it('recalculates score and status using configured thresholds', () => {
    const profile: LeadProfile = {
      ...INITIAL_LEAD_PROFILE,
      bant: {
        budget: { value: '$5,000 monthly budget stated', score: 0, confidence: 'Low' },
        authority: { value: 'Decision maker', score: 25, confidence: 'High' },
        need: { value: 'Automation', score: 25, confidence: 'High' },
        timeline: { value: 'Immediate', score: 25, confidence: 'High' },
      },
    };

    const result = applyQualificationSettings(profile, settings);

    expect(result.totalScore).toBe(100);
    expect(result.status).toBe('Qualified (SQL)');
    expect(result.recommendedAction).toContain('Account Executive team');
    expect(result.recommendedAction).toContain('No external routing integration');
  });

  it('does not mutate the original profile', () => {
    const original = structuredClone(INITIAL_LEAD_PROFILE);
    applyQualificationSettings(INITIAL_LEAD_PROFILE, settings);
    expect(INITIAL_LEAD_PROFILE).toEqual(original);
  });

  it('resets an absent budget score to zero', () => {
    const profile = {
      ...INITIAL_LEAD_PROFILE,
      bant: {
        ...INITIAL_LEAD_PROFILE.bant,
        budget: { value: null, score: 25, confidence: 'High' as const },
      },
    };

    expect(applyQualificationSettings(profile, settings).bant.budget.score).toBe(0);
  });

  it('uses the MQL threshold boundary', () => {
    const profile: LeadProfile = {
      ...INITIAL_LEAD_PROFILE,
      bant: {
        budget: { value: null, score: 0, confidence: 'Low' },
        authority: { value: 'Evaluator', score: 15, confidence: 'Medium' },
        need: { value: 'Need', score: 20, confidence: 'Medium' },
        timeline: { value: 'Later', score: 5, confidence: 'Medium' },
      },
    };

    expect(applyQualificationSettings(profile, {
      ...DEFAULT_QUALIFICATION_SETTINGS,
      mqlThreshold: 40,
      sqlThreshold: 75,
    }).status).toBe('Warm (MQL)');
  });
});
