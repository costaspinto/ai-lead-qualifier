import { LeadProfile, Message } from '../types';

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

export function analyzeConversationAndGenerateReply(
  userText: string,
  currentProfile: LeadProfile,
  _history: Message[]
): { updatedProfile: LeadProfile; reply: string } {
  const lower = userText.toLowerCase();
  const updated: LeadProfile = JSON.parse(JSON.stringify(currentProfile));

  const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    updated.email = emailMatch[0];
    const domain = emailMatch[0].split('@')[1];
    if (domain && !['gmail.com', 'yahoo.com', 'outlook.com'].includes(domain)) {
      updated.company = domain.split('.')[0].toUpperCase();
    }
  }

  const nameMatch = userText.match(/(?:i'm|i am|my name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch) {
    updated.name = nameMatch[1];
  }

  if (
    lower.includes('seo') ||
    lower.includes('lead') ||
    lower.includes('automation') ||
    lower.includes('conversion') ||
    lower.includes('support') ||
    lower.includes('scale') ||
    lower.includes('dashboard') ||
    lower.includes('workflow')
  ) {
    if (lower.includes('enterprise') || lower.includes('automation') || lower.includes('scale')) {
      updated.bant.need = {
        value: 'High-volume AI workflow & conversion automation',
        score: 25,
        confidence: 'High',
      };
    } else {
      updated.bant.need = {
        value: 'Inbound lead capture & qualification',
        score: 20,
        confidence: 'Medium',
      };
    }
  }

  if (
    lower.includes('cto') ||
    lower.includes('ceo') ||
    lower.includes('vp') ||
    lower.includes('founder') ||
    lower.includes('director') ||
    lower.includes('head of') ||
    lower.includes('decision maker')
  ) {
    updated.bant.authority = {
      value: 'Executive / Direct Decision Maker',
      score: 25,
      confidence: 'High',
    };
  } else if (
    lower.includes('manager') ||
    lower.includes('lead') ||
    lower.includes('engineer') ||
    lower.includes('evaluating')
  ) {
    updated.bant.authority = {
      value: 'Technical Evaluator / Champion',
      score: 15,
      confidence: 'Medium',
    };
  } else if (lower.includes('student') || lower.includes('just browsing') || lower.includes('intern')) {
    updated.bant.authority = {
      value: 'Researcher / Non-buyer',
      score: 5,
      confidence: 'High',
    };
  }

  if (
    lower.includes('$10k') ||
    lower.includes('$5,000') ||
    lower.includes('$5k') ||
    lower.includes('$2,000') ||
    lower.includes('$2k') ||
    lower.includes('5000') ||
    lower.includes('approved budget')
  ) {
    updated.bant.budget = {
      value: '$2,000-$10,000+/mo allocated',
      score: 25,
      confidence: 'High',
    };
  } else if (
    lower.includes('$500') ||
    lower.includes('$1,000') ||
    lower.includes('$1k') ||
    lower.includes('starter')
  ) {
    updated.bant.budget = {
      value: '$500-$1,500/mo range',
      score: 18,
      confidence: 'Medium',
    };
  } else if (lower.includes('free') || lower.includes('no budget') || lower.includes('$0')) {
    updated.bant.budget = {
      value: 'No allocated budget ($0)',
      score: 5,
      confidence: 'High',
    };
  }

  if (
    lower.includes('immediately') ||
    lower.includes('this week') ||
    lower.includes('this month') ||
    lower.includes('urgent') ||
    lower.includes('asap')
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

  const total =
    updated.bant.budget.score +
    updated.bant.authority.score +
    updated.bant.need.score +
    updated.bant.timeline.score;

  updated.totalScore = total;

  if (total >= 75) {
    updated.status = 'Qualified (SQL)';
    updated.recommendedAction =
      'Route immediately to Account Executive & trigger instant calendar booking link.';
  } else if (total >= 40) {
    updated.status = 'Warm (MQL)';
    updated.recommendedAction =
      'Enroll in automated product demo sequence and capture remaining BANT criteria.';
  } else {
    updated.status = 'Cold';
    updated.recommendedAction = 'Share self-serve documentation and continue discovery questions.';
  }

  let reply = '';
  if (!updated.bant.need.value) {
    reply =
      "Thanks for reaching out! What is the biggest bottleneck you're trying to solve right now (e.g., inbound lead conversion, SEO automation, or customer workflows)?";
  } else if (!updated.bant.authority.value) {
    reply =
      'Got it! Quick question: what is your role on the team, and are you leading the evaluation for this tool?';
  } else if (!updated.bant.budget.value) {
    reply =
      'That makes sense. Do you have a rough monthly budget allocated for this project (e.g., $500/mo, $2k-$5k/mo, or enterprise)?';
  } else if (!updated.bant.timeline.value) {
    reply =
      'Helpful context! How soon are you looking to launch in production - immediately this month, or next quarter?';
  } else if (updated.email === 'Not captured') {
    reply = `Awesome, your profile is a ${updated.totalScore}% match! What is the best work email to send your custom architecture breakdown to?`;
  } else {
    reply = `Perfect! I have logged your details (${updated.email}) with a ${updated.totalScore}/100 SQL score. An Account Executive has your BANT brief and will reach out shortly!`;
  }

  return { updatedProfile: updated, reply };
}
