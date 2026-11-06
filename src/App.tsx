import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  UserCheck,
  Target,
  Download,
  RotateCcw,
  Code2,
  Building2,
  Mail,
  User,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { LeadProfile, Message, PresetScenario } from './types';
import {
  INITIAL_LEAD_PROFILE,
  analyzeConversationAndGenerateReply,
} from './services/aiEngine';

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    label: 'Simulate Enterprise Buyer (SQL)',
    description: 'VP of Growth with $5k/mo budget needing immediate automation',
    messages: [
      "Hi, I'm Sarah Chen, VP of Growth. We need to scale our inbound lead qualification and conversion automation.",
      'I am the direct decision maker and we have an approved budget of $5,000/mo.',
      'We want to launch this month ASAP. My email is sarah@acmecloud.io',
    ],
  },
  {
    label: 'Simulate Mid-Market Evaluator (MQL)',
    description: 'Product Manager comparing options for next quarter',
    messages: [
      'Hello! We are looking to improve our website chat workflow and lead scoring.',
      'I am a Product Manager evaluating tools on a $1,000 monthly starter budget.',
      'We are planning to roll this out next quarter.',
    ],
  },
  {
    label: 'Simulate Low-Intent Visitor (Cold)',
    description: 'Student researching AI tools with no budget',
    messages: [
      'Hi, I am a student just browsing how AI chat widgets work.',
      'I only want a free $0 tier with no rush on timeline.',
    ],
  },
];

const QUICK_REPLIES = [
  'We need inbound lead automation',
  "I'm the CTO / Decision Maker",
  'Our budget is $5,000/mo',
  'We want to launch this month ASAP',
  'My email is alex@techcorp.io',
];

export function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Hi! I'm FlyRank's AI Solutions Architect. Tell me a bit about what your team is building or the workflow you want to automate!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState<LeadProfile>(INITIAL_LEAD_PROFILE);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { updatedProfile, reply } = analyzeConversationAndGenerateReply(
        trimmed,
        profile,
        nextHistory
      );
      setProfile(updatedProfile);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const runScenario = (scenario: PresetScenario) => {
    let tempProfile = INITIAL_LEAD_PROFILE;
    const builtMessages: Message[] = [
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: "Hi! I'm FlyRank's AI Solutions Architect. Tell me a bit about what your team is building or the workflow you want to automate!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    scenario.messages.forEach((msgText, idx) => {
      builtMessages.push({
        id: `sim-user-${idx}`,
        sender: 'user',
        text: msgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      const result = analyzeConversationAndGenerateReply(msgText, tempProfile, builtMessages);
      tempProfile = result.updatedProfile;
      builtMessages.push({
        id: `sim-ai-${idx}`,
        sender: 'ai',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    setProfile(tempProfile);
    setMessages(builtMessages);
  };

  const handleReset = () => {
    setProfile(INITIAL_LEAD_PROFILE);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "Hi! I'm FlyRank's AI Solutions Architect. Tell me a bit about what your team is building or the workflow you want to automate!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleExportJson = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        leadProfile: profile,
        transcriptCount: messages.length,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const statusBadgeColor =
    profile.status === 'Qualified (SQL)'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : profile.status === 'Warm (MQL)'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-slate-700/60 text-slate-300 border-slate-600';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white">
                  FlyRank LeadQualifier AI
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  FE Capstone
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-Time Conversational BANT Extraction & Sales Routing Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowJsonModal(!showJsonModal)}
              aria-label="Toggle CRM JSON Payload View"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              {showJsonModal ? 'Hide CRM JSON' : 'Inspect CRM JSON'}
            </button>
            <button
              onClick={handleExportJson}
              aria-label="Copy Lead JSON to Clipboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {copiedNotice ? 'Copied!' : 'Export CRM Payload'}
            </button>
            <button
              onClick={handleReset}
              aria-label="Reset Conversation"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section
          aria-label="Live Visitor Chat Widget"
          className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden h-[680px]"
        >
          <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 absolute bottom-0 right-0" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">AI Solutions Concierge</h2>
                <p className="text-xs text-emerald-400">
                  Online · Instant BANT Qualification Active
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              Widget Preview
            </span>
          </div>

          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo Personas:
            </span>
            {PRESET_SCENARIOS.map((sc, i) => (
              <button
                key={i}
                onClick={() => runScenario(sc)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-indigo-600/20 hover:text-indigo-300 border border-slate-700 text-slate-300 transition cursor-pointer"
              >
                {sc.label}
              </button>
            ))}
          </div>

          <div
            role="log"
            aria-live="polite"
            className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/30"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/80'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {m.sender === 'ai' ? 'FlyRank AI' : 'Visitor'} · {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_REPLIES.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              aria-label="Chat message input"
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </section>

        <aside
          aria-label="Live Lead Qualification Scorecard"
          className="lg:col-span-5 flex flex-col gap-5"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Real-Time Lead Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-extrabold text-white">
                    {profile.totalScore}
                  </span>
                  <span className="text-sm text-slate-400">/ 100 pts</span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeColor}`}
              >
                {profile.status}
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-500 ${
                  profile.totalScore >= 75
                    ? 'bg-emerald-500'
                    : profile.totalScore >= 40
                    ? 'bg-amber-400'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${profile.totalScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> Contact
                </span>
                <p className="font-medium text-slate-200 truncate">{profile.name}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email
                </span>
                <p className="font-medium text-slate-200 truncate">{profile.email}</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 mb-0.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Org
                </span>
                <p className="font-medium text-slate-200 truncate">{profile.company}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                BANT Qualification Signals
              </h3>
              <span className="text-xs text-slate-400">25 pts max / dimension</span>
            </div>

            {[
              { key: 'need', label: 'Need / Pain Point', icon: Target, data: profile.bant.need },
              { key: 'authority', label: 'Decision Authority', icon: UserCheck, data: profile.bant.authority },
              { key: 'budget', label: 'Allocated Budget', icon: DollarSign, data: profile.bant.budget },
              { key: 'timeline', label: 'Target Timeline', icon: Clock, data: profile.bant.timeline },
            ].map(({ key, label, icon: Icon, data }) => (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    {label}
                  </span>
                  <span className="text-xs font-semibold text-indigo-300">
                    {data.score} / 25 pts
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {data.value ? (
                    <span className="text-emerald-300 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      {data.value}
                    </span>
                  ) : (
                    'Awaiting conversational signal...'
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-300">
              AI Recommended Routing Action
            </span>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {profile.recommendedAction}
            </p>
          </div>

          {showJsonModal && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <pre className="text-[11px] font-mono text-indigo-200 bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
