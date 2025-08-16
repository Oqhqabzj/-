import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { detectLang } from '../nlp/detectLang';
import { chooseIntent } from '../nlp/intent';
import { TPL, translateKey } from '../templates';
import { fetchOrderStatus, fetchProductDetails } from '../api/integrations';
import { learningStore, submitFeedbackBatch } from '../store/learningStore';

export type Message = { id: string; role: 'user' | 'assistant'; text: string; lang?: string; intent?: string; meta?: Record<string, any> };
export type Customer = { id: string; name: string; locale?: string; traits?: Record<string, any>; lastOrderId?: string };

export default function OmniSupportMiniApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const me: Customer = useMemo(() => ({ id: 'u1', name: 'Mostafa', locale: 'ar-EG', traits: { tier: 'vip' }, lastOrderId: '9876' }), []);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const lang = detectLang(text);
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text, lang };
    setMessages((m) => [...m, userMsg]);
    setBusy(true);

    const intent = chooseIntent(text);

    let entities: any = {};
    const orderMatch = text.match(/(?:(?:order|طلب)\s*#?)(\d{3,})/i) || text.match(/\b(\d{4,})\b/);
    const productMatch = text.match(/(?:about|spec|details|price)\s+([\w\- ]+)/i) || text.match(/منتج\s+([\w\- ]+)/);

    if (intent === 'order.track' && orderMatch) entities.orderId = orderMatch[1] ?? orderMatch[0];
    if (intent === 'product.info' && productMatch) entities.product = (productMatch[1] ?? '').trim();

    let data: any = null;
    if (intent === 'order.track' && (entities.orderId || me.lastOrderId)) {
      data = await fetchOrderStatus(entities.orderId || me.lastOrderId!);
    } else if (intent === 'product.info' && entities.product) {
      data = await fetchProductDetails(entities.product);
    }

    const key = translateKey(intent, lang);
    const tpl = TPL[key] || TPL[translateKey('clarify.request', lang)];
    const replyText = tpl(me, data);

    const botMsg: Message = { id: crypto.randomUUID(), role: 'assistant', text: replyText, lang, intent, meta: { entities, data } };

    setMessages((m) => [...m, botMsg]);
    setBusy(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    // fire-and-forget: submit feedback periodically
    submitFeedbackBatch().catch(() => {});
  };

  const rate = (id: string, val: 'up' | 'down') => {
    const msg = messages.find((m) => m.id === id);
    if (!msg || msg.role !== 'assistant') return;
    learningStore.push({ utterance: msg.text, intent: msg.intent ?? null, feedback: val, lang: msg.lang ?? 'en' });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="card shadow-xl rounded-2xl">
        <div className="card-header pb-2">
          <div className="flex items-center gap-2">
            <div className="text-lg">Omni Support</div>
            <div className="ml-auto">Mini‑App</div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Real‑time multilingual auto‑reply</div>
        </div>
        <div className="card-content">
          <div className="border rounded-xl overflow-hidden">
            <div className="scroll-area h-80 p-3 bg-muted/30">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <div className="text-xs text-muted-foreground">Try: «فين حالة الطلب 9876؟», "When do you deliver?", "I want to return my order"</div>
                )}
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}> 
                      <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white'}`}> 
                        <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground"> 
                          <div>{m.role === 'user' ? 'User' : 'Bot'}</div>
                          {m.intent && <div className="badge">{m.intent}</div>} 
                          {m.lang && <div className="badge secondary">{m.lang}</div>} 
                        </div>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
                        {m.role === 'assistant' && (
                          <div className="flex gap-2 pt-2">
                            <button aria-label="Good" onClick={() => rate(m.id, 'up')}>👍</button>
                            <button aria-label="Bad" onClick={() => rate(m.id, 'down')}>👎</button>
                          </div>
                        )} 
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="flex gap-2 p-2 border-t bg-background">
              <input placeholder="اكتب رسالتك… / Type your message…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
              <button onClick={send} disabled={busy}>{busy ? '...' : 'Send'}</button>
            </div>

          </div>

          <div className="text-[11px] text-muted-foreground mt-3">
            • Personalization demo uses name "Mostafa" and last order #9876. Replace with real CRM data.<br />
            • Replace mocked handlers with real APIs (Meta, WhatsApp, Shopify, Zendesk).<br />
            • Feedback (👍/👎) is stored in‑memory; POST to `/feedback` in production for learning.
          </div>

        </div>
      </div>
    </div>
  );
}