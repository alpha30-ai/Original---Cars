"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  Calendar, 
  ShoppingBag, 
  Layers, 
  ChevronDown,
  Loader2,
  ExternalLink,
  Minimize2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickActions?: Array<{ label: string; href: string; external?: boolean }>;
  suggestions?: string[];
}

export default function FloatingAIChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "مرحباً بك في أورجينال لفرش وعناية السيارات الفاخرة! ✨\nأنا مستشارك الذكي، كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن أنواع الجلود الألمانية، أسعار التفصيل، مدة التركيب، أو حجز موعد لسيارتك.",
      quickActions: [
        { label: "حجز موعد خدمة", href: "/booking" },
        { label: "تصفح المتجر", href: "/shop" },
        { label: "معرض الأعمال", href: "/gallery" }
      ],
      suggestions: [
        "ما هي أسعار تنجيد جلود النابا؟",
        "كم يستغرق تفصيل وتركيب الفرش؟",
        "هل يوجد ضمان على الفرش؟"
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Don't show floating widget on full admin or full ai-assistant page to avoid duplication
  const isHiddenPage = pathname.startsWith("/admin") || pathname === "/ai-assistant";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input.trim();
    if (!textToSend || loading) return;

    setInput("");
    const userMsgId = Date.now().toString();
    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, role: "user", content: textToSend }
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: newMessages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            quickActions: data.quickActions,
            suggestions: data.suggestions
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "أهلاً بك! يمكنك زيارة صفحة حجز الخدمة أو التواصل مباشرة مع فريقنا عبر واتساب للمساعدة الفورية.",
            quickActions: [{ label: "حجز موعد خدمة", href: "/booking" }]
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "عذراً، حدث خطأ مؤقت في الاتصال. يمكنك تصفح المتجر أو حجز موعدك مباشرة.",
          quickActions: [{ label: "الانتقال لصفحة الحجز", href: "/booking" }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (isHiddenPage) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40" dir="rtl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-primary text-primary-foreground p-4 rounded-3xl shadow-2xl flex items-center gap-3 border border-primary/40 hover:bg-primary/95 transition-all group"
          aria-label="المساعد الذكي AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-primary animate-pulse" />
          </div>
          <span className="font-black text-xs hidden sm:inline-block pr-1 font-heading">
            المساعد الذكي AI
          </span>
        </motion.button>
      </div>

      {/* Chat Window Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[80vh] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-primary/15 via-card to-card border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-foreground flex items-center gap-1.5 font-heading">
                    <span>مساعد أورجينال الذكي</span>
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </h3>
                  <p className="text-[10px] text-muted-foreground">استشارات الخامات والتوجيه والحجوزات 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/ai-assistant"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                  title="فتح في شاشة كاملة"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-2 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[90%] whitespace-pre-line leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground font-bold rounded-tl-sm shadow-sm"
                        : "bg-card border border-border text-foreground rounded-tr-sm shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Interactive Quick Action Buttons */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((act, i) => (
                        act.external ? (
                          <a
                            key={i}
                            href={act.href}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 px-3 py-1.5 rounded-xl font-black text-[11px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>{act.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            key={i}
                            href={act.href}
                            onClick={() => setIsOpen(false)}
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 px-3 py-1.5 rounded-xl font-black text-[11px] transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>{act.label}</span>
                            <ArrowLeft className="w-3 h-3" />
                          </Link>
                        )
                      ))}
                    </div>
                  )}

                  {/* Suggestion Pills */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors"
                        >
                          💬 {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>أورجينال AI يكتب الرد...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-card border-t border-border flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="اسأل عن الأسعار، الخامات، أو الحجز..."
                className="flex-1 bg-background border border-border rounded-2xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40 shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
