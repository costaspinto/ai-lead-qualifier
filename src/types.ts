export type Sender = 'ai' | 'user';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

export interface BantCriterion {
  value: string | null;
  score: number;
  confidence: 'Low' | 'Medium' | 'High';
}

export interface LeadProfile {
  name: string;
  email: string;
  company: string;
  bant: {
    budget: BantCriterion;
    authority: BantCriterion;
    need: BantCriterion;
    timeline: BantCriterion;
  };
  totalScore: number;
  status: 'Cold' | 'Warm (MQL)' | 'Qualified (SQL)';
  recommendedAction: string;
}

export interface PresetScenario {
  label: string;
  description: string;
  messages: string[];
}
