import type { LeadProfile, Message, QualificationSettings } from '../types';

export const DEFAULT_QUALIFICATION_SETTINGS: QualificationSettings = {
  mqlThreshold: 40,
  sqlThreshold: 75,
  minimumMonthlyBudget: 500,
  sqlRoutingDestination: 'Account Executive team',
};

export const INITIAL_LEAD_PROFILE: LeadProfile = {
  name: 'Anonymous Visitor',
  email: 'Not captured',
  company: 'Unknown Organization',
  bant: {
    budget: { value: null, score: 0, confidence: 'Low' },
    authority: { value: null, score: 0, confidence: 'Low' },
    need: { value: null, score: 0, confidence: 'Low' },
    timeline: { value: null, score: 0, confidence: 'Low' },
  },
  totalScore: 0,
  status: 'Cold',
  recommendedAction: 'Continue discovery conversation to uncover BANT signals.',
};

export function scoreBudget(
  value: string | null,
  minimumMonthlyBudget: number
): { score: number; confidence: 'Low' | 'Medium' | 'High' } {
  if (!value || /no allocated budget|\$0/i.test(value)) {
    return { score: 5, confidence: 'Low' };
  }

  const amounts = [...value.matchAll(/\$\s*([\d,]+(?:\.\d+)?)\s*(k)?/gi)]
    .map((match) => {
      const amount = Number(match[1].replace(/,/g, ''));
      return match[2] ? amount * 1000 : amount;
    })
    .filter(Number.isFinite);

  if (!amounts.length) {
    return { score: 5, confidence: 'Low' };
  }

  const lower = amounts[0];
  const upper = amounts.length > 1
    ? amounts[1]
    : lower;

  if (upper < minimumMonthlyBudget) {
    return { score: 5, confidence: 'Low' };
  }

  if (lower >= minimumMonthlyBudget) {
    return { score: 25, confidence: 'High' };
  }

  return { score: 12, confidence: 'Medium' };
}

export function applyQualificationSettings(
  profile: LeadProfile,
  settings: QualificationSettings
): LeadProfile {
  const updated: LeadProfile = {
    ...profile,
    bant: {
      budget: { ...profile.bant.budget },
      authority: { ...profile.bant.authority },
      need: { ...profile.bant.need },
      timeline: { ...profile.bant.timeline },
    },
  };

  if (updated.bant.budget.value) {
    const budgetResult = scoreBudget(
      updated.bant.budget.value,
      settings.minimumMonthlyBudget
    );

    updated.bant.budget = {
      ...updated.bant.budget,
      ...budgetResult,
    };
  } else {
    updated.bant.budget = {
      ...updated.bant.budget,
      score: 0,
      confidence: 'Low',
    };
  }

  updated.totalScore =
    updated.bant.budget.score +
    updated.bant.authority.score +
    updated.bant.need.score +
    updated.bant.timeline.score;

  if (updated.totalScore >= settings.sqlThreshold) {
    updated.status = 'Qualified (SQL)';
    updated.recommendedAction =
      `Meets the SQL threshold. Mark for handoff to ${settings.sqlRoutingDestination}. No external routing integration is configured.`;
  } else if (updated.totalScore >= settings.mqlThreshold) {
    updated.status = 'Warm (MQL)';
    updated.recommendedAction =
      'Meets the MQL threshold. Continue discovery and nurture the lead.';
  } else {
    updated.status = 'Cold';
    updated.recommendedAction =
      'Below the MQL threshold. Continue discovery and share relevant resources.';
  }

  return updated;
}

function extractBudget(userText: string): string | null {
  const normalized = userText.replace(/,/g, '');
  const amountPattern = /\$\s*\d+(?:\.\d+)?\s*k?/gi;
  const matches = normalized.match(amountPattern);

  if (matches?.length) {
    const amounts = matches.map((amount) =>
      amount.replace(/\s/g, '').toUpperCase()
    );

    if (amounts.length >= 2) {
      return `${amounts[0]}-${amounts[1]} monthly range`;
    }

    return `${amounts[0]} monthly budget stated`;
  }

  if (
    /no budget|without a budget|free tier|\$0/i.test(userText)
  ) {
    return 'No allocated budget ($0)';
  }

  return null;
}

export function analyzeConversationAndGenerateReply(
  userText: string,
  currentProfile: LeadProfile,
  _history: Message[],
  settings: QualificationSettings = DEFAULT_QUALIFICATION_SETTINGS
): { updatedProfile: LeadProfile; reply: string } {
  const lower = userText.toLowerCase();
  const updated: LeadProfile = {
    ...currentProfile,
    bant: {
      budget: { ...currentProfile.bant.budget },
      authority: { ...currentProfile.bant.authority },
      need: { ...currentProfile.bant.need },
      timeline: { ...currentProfile.bant.timeline },
    },
  };

  const emailMatch = userText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );

  if (emailMatch) {
    updated.email = emailMatch[0];
    const domain = emailMatch[0].split('@')[1];

    if (domain && !['gmail.com', 'yahoo.com', 'outlook.com'].includes(domain.toLowerCase())) {
      updated.company = domain.split('.')[0].toUpperCase();
    }
  }

  const nameMatch = userText.match(
    /(?:i'm|i am|my name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  );

  if (nameMatch) updated.name = nameMatch[1];

  if (
    ['seo', 'lead', 'automation', 'conversion', 'support', 'scale', 'dashboard', 'workflow']
      .some((word) => lower.includes(word))
  ) {
    updated.bant.need = {
      value: lower.includes('enterprise') || lower.includes('automation') || lower.includes('scale')
        ? 'High-volume AI workflow & conversion automation'
        : 'Inbound lead capture & qualification',
      score: lower.includes('enterprise') || lower.includes('automation') || lower.includes('scale')
        ? 25
        : 20,
      confidence: lower.includes('enterprise') || lower.includes('automation') || lower.includes('scale')
        ? 'High'
        : 'Medium',
    };
  }

  if (
    ['cto', 'ceo', 'vp', 'founder', 'director', 'head of', 'decision maker']
      .some((word) => lower.includes(word))
  ) {
    updated.bant.authority = {
      value: 'Executive / Direct Decision Maker',
      score: 25,
      confidence: 'High',
    };
  } else if (
    ['manager', 'lead', 'engineer', 'evaluating']
      .some((word) => lower.includes(word))
  ) {
    updated.bant.authority = {
      value: 'Technical Evaluator / Champion',
      score: 15,
      confidence: 'Medium',
    };
  } else if (
    ['student', 'just browsing', 'intern'].some((word) => lower.includes(word))
  ) {
    updated.bant.authority = {
      value: 'Researcher / Non-buyer',
      score: 5,
      confidence: 'High',
    };
  }

  const budget = extractBudget(userText);
  if (budget) {
    updated.bant.budget = {
      value: budget,
      score: 0,
      confidence: 'Low',
    };
  }

  if (
    ['immediately', 'this week', 'this month', 'urgent', 'asap']
      .some((word) => lower.includes(word))
  ) {
    updated.bant.timeline = {
      value: 'Immediate (Within 14-30 days)',
      score: 25,
      confidence: 'High',
    };
  } else if (lower.includes('next quarter') || lower.includes('3 months')) {
    updated.bant.timeline = {
      value: 'Medium-term (1-2 Quarters)',
      score: 15,
      confidence: 'Medium',
    };
  } else if (lower.includes('next year') || lower.includes('no rush')) {
    updated.bant.timeline = {
      value: 'Long-term exploratory',
      score: 5,
      confidence: 'Medium',
    };
  }

  const classifiedProfile = applyQualificationSettings(updated, settings);

  let reply: string;

  if (!classifiedProfile.bant.need.value) {
    reply = "Thanks for reaching out! What is the biggest bottleneck you're trying to solve right now (e.g., inbound lead conversion, SEO automation, or customer workflows)?";
  } else if (!classifiedProfile.bant.authority.value) {
    reply = 'Got it! What is your role on the team, and are you leading the evaluation for this tool?';
  } else if (!classifiedProfile.bant.budget.value) {
    reply = 'Do you have a rough monthly budget allocated for this project? An approximate amount is fine.';
  } else if (!classifiedProfile.bant.timeline.value) {
    reply = 'How soon are you looking to launch in production: this month, next quarter, or later?';
  } else if (classifiedProfile.email === 'Not captured') {
    reply = `Your current qualification score is ${classifiedProfile.totalScore}/100. What is the best work email to associate with this lead?`;
  } else if (classifiedProfile.status === 'Qualified (SQL)') {
    reply = `This lead meets the SQL criteria with a score of ${classifiedProfile.totalScore}/100. It is marked for handoff to ${settings.sqlRoutingDestination}. No external notification or CRM handoff has been performed.`;
  } else {
    reply = `Your lead profile has a score of ${classifiedProfile.totalScore}/100. The current status is ${classifiedProfile.status}.`;
  }

  return { updatedProfile: classifiedProfile, reply };
}
