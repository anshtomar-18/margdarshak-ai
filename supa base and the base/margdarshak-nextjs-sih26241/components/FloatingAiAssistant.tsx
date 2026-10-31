'use client';

import React, { useState } from 'react';
import { TRADES, SOURCES } from '@/lib/db/catalogue';
import { EvidenceBadge } from './EvidenceBadge';

type ChatLang = 'en' | 'hi' | 'hinglish' | 'ta' | 'te' | 'bn' | 'mr';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  sourceId?: string;
  badge?: 'verified' | 'estimate' | 'illustrative' | 'unavailable';
  needsEscalation?: boolean;
}

export function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<ChatLang>('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! I am the Margdarshak AI Assistant, grounded in all 4 registered sources (NCVET, DGT, PMKVY 4.0, NSDC Demo) and 8+ NSQF trades. Ask me about earnings, placement rates, NSQF pathways, or parent concerns in English, Hindi, or Hinglish!',
      sourceId: 'SRC-NCVET-NSQF',
      badge: 'verified',
    },
  ]);

  const handleSend = (queryText?: string) => {
    const q = (queryText ?? input).trim();
    if (!q) return;
    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: q };
    setInput('');

    const lower = q.toLowerCase();
    // 1. Sensitive / distress detection -> immediate counsellor escalation
    if (/distress|conflict|forced|loan|debt|tanaav|दबाव|कर्ज|परेशान/i.test(lower)) {
      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text:
            lang === 'hi'
              ? 'यह एक संवेदनशील पारिवारिक या वित्तीय विषय है। एआई इस पर अनुमान नहीं लगाएगा — कृपया मानव काउंसलर कॉलबैक का अनुरोध करें।'
              : 'This involves sensitive family or financial circumstances. Our AI does not improvise advice here—please use the Request Counsellor Callback option for human support.',
          needsEscalation: true,
        },
      ]);
      return;
    }

    // 2. Match trade from catalogue
    const matchedTrade = TRADES.find(
      (t) =>
        lower.includes(t.nameEn.toLowerCase().split(' ')[0] || '') ||
        lower.includes(t.id.toLowerCase()) ||
        (lower.includes('solar') && t.id === 'TRD-SOLAR') ||
        (lower.includes('electric') && t.id === 'TRD-ELEC') ||
        (lower.includes('cnc') && t.id === 'TRD-CNC') ||
        (lower.includes('plumb') && t.id === 'TRD-PLUMB') ||
        (lower.includes('health') && t.id === 'TRD-HEALTH') ||
        (lower.includes('retail') && t.id === 'TRD-RETAIL') ||
        (lower.includes('copa') && t.id === 'TRD-COPA') ||
        (lower.includes('ev') && t.id === 'TRD-EV')
    );

    if (matchedTrade) {
      const src = SOURCES.find((s) => s.id === matchedTrade.sourceId);
      const salaryText =
        matchedTrade.earningsMinInr && matchedTrade.earningsMaxInr
          ? `₹${matchedTrade.earningsMinInr.toLocaleString('en-IN')}–₹${matchedTrade.earningsMaxInr.toLocaleString('en-IN')}/month`
          : 'Unavailable in current sample';
      const placementText =
        matchedTrade.placementRatePct !== null
          ? `${matchedTrade.placementRatePct}% (${matchedTrade.reportingPeriod})`
          : 'Unavailable (high self-employment share)';

      const reply =
        lang === 'hi'
          ? `${matchedTrade.nameHi} (NSQF स्तर ${matchedTrade.nsqfLevel}, अवधि: ${matchedTrade.durationMonths} महीने): शुरुआती आय रेंज ${salaryText}, प्लेसमेंट दर: ${placementText}। सीमाएं: ${matchedTrade.limitationsHi} (स्रोत: ${src?.publisher})`
          : `${matchedTrade.nameEn} (NSQF Level ${matchedTrade.nsqfLevel}, Duration: ${matchedTrade.durationMonths} months): Starting earnings range ${salaryText}, Placement rate: ${placementText}. Caveat: ${matchedTrade.limitationsEn} (Source: ${src?.publisher}, Verified: ${matchedTrade.verifiedAt})`;

      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: reply,
          sourceId: matchedTrade.sourceId,
          badge: matchedTrade.evidenceStatus,
        },
      ]);
      return;
    }

    // 3. Default grounded overview across all sources
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text:
          lang === 'hi'
            ? 'मैं NCVET, DGT ITI, PMKVY 4.0 और NSDC प्रदर्शन डेटासेट से जुड़ा हूँ। किसी भी ट्रेड (जैसे इलेक्ट्रीशियन, सूर्यमित्र सोलर, CNC, GDA हेल्थकेयर, COPA, या EV तकनीशियन) के वेतन, NSQF स्तर या स्रोतों के बारे में पूछें।'
            : 'I only answer from verified & clearly labelled catalogue records (NCVET, DGT ITI, PMKVY 4.0, NSDC Demo). Ask me about Electrician, Solar Suryamitra, CNC Operator, Healthcare GDA, Plumber, COPA, or EV Technician!',
        sourceId: 'SRC-NCVET-NSQF',
        badge: 'verified',
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-96 max-w-[92vw] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-primary text-white p-3.5 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-sm">Margdarshak AI Assistant</h3>
              <p className="text-[11px] opacity-90">Grounded in NCVET • DGT • PMKVY • NSDC Sources</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                aria-label="Select chat language"
                value={lang}
                onChange={(e) => setLang(e.target.value as ChatLang)}
                className="text-xs bg-white/15 text-white rounded px-1.5 py-1 border border-white/30"
              >
                <option value="en" className="text-black">English</option>
                <option value="hi" className="text-black">हिन्दी</option>
                <option value="hinglish" className="text-black">Hinglish</option>
                <option value="ta" className="text-black">தமிழ்</option>
                <option value="te" className="text-black">తెలుగు</option>
                <option value="bn" className="text-black">বাংলা</option>
                <option value="mr" className="text-black">मराठी</option>
              </select>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/20 rounded p-1 text-xs"
                aria-label="Close AI Chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-3 h-80 overflow-y-auto space-y-3 bg-background">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary text-white ml-8'
                    : 'bg-surface border border-border text-text-primary mr-4'
                }`}
              >
                <p>{m.text}</p>
                {m.badge && (
                  <div className="mt-1.5 flex items-center justify-between">
                    <EvidenceBadge status={m.badge} lang={lang === 'hi' ? 'hi' : 'en'} />
                    {m.sourceId && <span className="text-[10px] text-text-secondary">{m.sourceId}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-2.5 border-t border-border bg-surface flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'hi' ? 'इलेक्ट्रीशियन, सोलर, वेतन पूछें...' : 'Ask about trades, salary, NSQF...'}
              className="flex-1 text-xs border border-border rounded-lg px-2.5 py-2 bg-background"
            />
            <button
              onClick={() => handleSend()}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-medium px-3 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm border-2 border-accent"
          data-testid="floating-ai-trigger"
        >
          <span>🤖 Ask Margdarshak AI</span>
        </button>
      )}
    </div>
  );
}
