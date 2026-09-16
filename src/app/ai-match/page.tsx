'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Send, User, Bot, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { formatPrice } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  recommendations?: Recommendation[];
  signInLink?: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  type: 'vehicle' | 'property';
  price: number;
  image: string;
  location: string;
  matchReasons?: string[];
  link: string;
}

const suggestionPrompts = [
  'Find me a luxury SUV under ₦200 million suitable for Lagos',
  'I need 3–5 acres of verified land in Abuja for a luxury estate',
  'Show me exotic cars with low mileage',
  'Waterfront property in Lagos under ₦1 billion',
];

export default function AIMatchPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: "Hello, I'm your AI Asset Match assistant. Describe what you're looking for — budget, location, type — and I'll find the perfect assets for you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), type: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          query: userMsg.content,
        }),
      });

      if (response.status === 401) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Please sign in to use AI Asset Match.',
          signInLink: true,
        }]);
        return;
      }

      if (!response.ok) {
        // Show the server's explanation (e.g. "temporarily unavailable") when there is one
        const problem = await response.json().catch(() => null);
        throw new Error(problem?.error || 'Failed to get response');
      }

      const data = await response.json();
      
      if (!sessionId) {
        setSessionId(data.sessionId);
      }

      // Format recommendations for display
      const recommendations: Recommendation[] = (data.recommendations || []).map((rec: any) => ({
        id: rec.id,
        title: rec.title,
        type: rec.type,
        price: Number(rec.price),
        image: rec.images?.[0] || '/placeholder.svg',
        location: rec.location,
        matchReasons: [],
        link: rec.type === 'vehicle' ? `/automotive/${rec.id}` : `/property/${rec.id}`,
      }));

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        recommendations,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: error instanceof Error && error.message !== 'Failed to get response'
          ? error.message
          : 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
        <div className="section-padding py-6 border-b border-luxury-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h1 className="text-xl font-medium">AI Asset Match</h1>
              <p className="text-xs text-luxury-muted">Smart recommendations that understand you</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto section-padding py-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-gold-400" />
                </div>
              )}
              <div className={`max-w-2xl ${msg.type === 'user' ? 'bg-gold-500/10 border-gold-500/20' : 'bg-luxury-card border-luxury-border'} rounded-2xl px-5 py-4 border`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                {msg.signInLink && (
                  <Link href="/login?next=/ai-match" className="inline-block mt-3 text-sm text-gold-400 hover:underline">
                    Sign in →
                  </Link>
                )}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-5 space-y-4">
                    <p className="text-xs text-gold-400 uppercase tracking-wider font-medium">Recommended For You</p>
                    {msg.recommendations.map((rec) => (
                      <Link key={rec.id} href={rec.link}>
                        <div className="flex gap-4 p-4 bg-luxury-dark/50 rounded-xl border border-luxury-border hover:border-gold-500/30 transition-colors group">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={rec.image} alt={rec.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${rec.type === 'vehicle' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {rec.type === 'vehicle' ? 'VEHICLE' : 'PROPERTY'}
                            </span>
                            <h4 className="font-medium text-sm group-hover:text-gold-400 transition-colors mt-1">{rec.title}</h4>
                            <p className="text-gold-400 text-sm font-medium mt-1">{formatPrice(rec.price)}</p>
                            <p className="text-xs text-luxury-muted flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {rec.location}
                            </p>
                            <div className="mt-2 space-y-1">
                              {rec.matchReasons?.map((reason, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-luxury-muted">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                  {reason}
                                </div>
                              ))}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-luxury-muted group-hover:text-gold-400 transition-colors self-center flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-luxury-card border border-luxury-border flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-luxury-muted" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gold-400" />
              </div>
              <div className="bg-luxury-card border border-luxury-border rounded-2xl px-5 py-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="section-padding pb-4">
            <p className="text-xs text-luxury-muted mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((prompt) => (
                <button key={prompt} onClick={() => { setInput(prompt); }}
                  className="px-4 py-2 rounded-xl bg-luxury-card border border-luxury-border text-xs text-luxury-muted hover:text-luxury-ivory hover:border-gold-500/30 transition-colors text-left">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="section-padding py-4 border-t border-luxury-border/50">
          <div className="relative max-w-3xl mx-auto">
            <input type="text" maxLength={1000} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe what you're looking for..."
              className="w-full bg-luxury-card border border-luxury-border rounded-2xl pl-5 pr-14 py-4 text-luxury-ivory placeholder:text-luxury-muted/60 focus:outline-none focus:border-gold-500/50 transition-colors" />
            <button onClick={handleSend} disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gold-500 text-luxury-black rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
