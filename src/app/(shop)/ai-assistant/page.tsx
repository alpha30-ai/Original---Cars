"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Crown, 
  ArrowLeft, 
  Calendar, 
  ShoppingBag, 
  Layers, 
  ExternalLink,
  Loader2,
  Wrench,
  ShieldCheck,
  Zap,
  Car,
  Compass,
  MessageSquare,
  Flame,
  Award,
  RefreshCw,
  Home
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickActions?: Array<{ label: string; href: string; external?: boolean }>;
  suggestions?: string[];
}

const POPULAR_TOPICS = [
  { icon: Crown, label: "أسعار فرش جلد النابا الألماني", query: "ما هي أسعار وتكلفة تفصيل فرش جلد نابا ألماني لسيارتي؟" },
  { icon: Sparkles, label: "سقف ألكانتارا ونجوم رولز رويس", query: "كم تكلفة ومميزات سقف الألكانتارا ونجوم رولز رويس؟" },
  { icon: ShieldCheck, label: "خياطة أمان الوسائد الهوائية (Airbags)", query: "هل خياطة الفرش آمنة وتدعم خروج الوسائد الهوائية (Airbags)؟" },
  { icon: Wrench, label: "مواعيد العمل وحجز موعد بالمركز", query: "أريد معرفة عنوان المركز ومواعيد العمل وحجز موعد" },
  { icon: Layers, label: "دواسات جلد 7D وعزل الأرضيات", query: "ما هي مميزات دواسات 7D وعزل أرضية السيارة؟" }
];

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "مرحباً بك في غرفة الاستشارات الفنية والذكاء الاصطناعي لمركز أورجينال! ✨\n\nأنا مستشارك الذكي المتاح على مدار الساعة. يمكنني مساعدتك في:\n• حساب التكلفة التقديرية لفرش سيارتك بحسب الموديل\n• مقارنة خامات جلود النابا الألمانية وأسقف الألكانتارا\n• حجز موعد للمعاينة والتنفيذ بالمركز\n• ترشيح المنتجات الأنسب من المتجر",
      quickActions: [
        { label: "حجز موعد خدمة", href: "/booking" },
        { label: "تصفح المتجر", href: "/shop" },
        { label: "معرض الأعمال", href: "/gallery" }
      ],
      suggestions: [
        "ما هي أسعار تنجيد جلود النابا الألمانية؟",
        "كم يستغرق تركيب سقف ألكانتارا ونجوم رولز رويس؟",
        "هل الفرش آمن مع الوسائد الهوائية (Airbags)؟",
        "احجز موعد لسيارتي"
      ]
    }
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

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
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error("فشل الاتصال");
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "شكراً لتواصلك! يمكنك أيضاً التواصل معنا عبر واتساب للمعاينة الفورية.",
          quickActions: data.quickActions || [{ label: "حجز موعد خدمة", href: "/booking" }],
          suggestions: data.suggestions || []
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "حدث خطأ مؤقت في الاتصال، يمكنك حجز موعدك مباشرة عبر صفحة الحجز.",
          quickActions: [{ label: "حجز موعد خدمة", href: "/booking" }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "تم بدء جلسة استشارة جديدة! كيف يمكنني مساعدتك اليوم؟",
        quickActions: [
          { label: "حجز موعد خدمة", href: "/booking" },
          { label: "تصفح المتجر", href: "/shop" }
        ],
        suggestions: [
          "ما هي أسعار تنجيد جلود النابا الألمانية؟",
          "كم يستغرق تركيب سقف ألكانتارا؟",
          "احجز موعد لسيارتي"
        ]
      }
    ]);
  };

  return (
    <div className="min-h-[100dvh] bg-background pt-24 sm:pt-36 pb-8 sm:pb-12 relative flex flex-col justify-between" dir="rtl">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-6 md:px-8 max-w-7xl relative z-10 flex-1 flex flex-col space-y-3 sm:space-y-6">
        
        {/* Top Header Bar (Sleek Compact Bar on Mobile & Grand Luxury on Desktop) */}
        <div className="bg-card/90 backdrop-blur-md p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
          <div className="flex items-center justify-between gap-3">
            
            {/* Right: Bot Info */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                  <Bot className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-xl md:text-2xl font-black text-foreground font-heading">
                    <span className="sm:hidden">المساعد الذكي AI</span>
                    <span className="hidden sm:inline">المساعد الذكي واستشارات مقصورة السيارات</span>
                  </h1>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  مستشارك الفني على مدار الساعة للأسعار، الخامات الألمانية، ومطابقة مقاسات سيارتك
                </p>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 sm:hidden flex items-center gap-1">
                  <span>مستشارك الفني 24/7</span>
                </p>
              </div>
            </div>

            {/* Left: Quick Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={handleResetChat}
                title="بدء محادثة جديدة"
                className="p-2.5 sm:px-4 sm:py-2.5 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl sm:rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-border transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">محادثة جديدة</span>
              </button>

              <Link
                href="/booking"
                className="px-3.5 py-2.5 sm:px-6 sm:py-2.5 bg-primary text-primary-foreground font-black rounded-xl sm:rounded-2xl text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">حجز موعد بالمركز</span>
                <span className="sm:hidden">حجز موعد</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Full-Page 2-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1 items-stretch min-h-[500px] sm:min-h-[620px]">
          
          {/* Right Column: Interactive Chat Area (8 Cols) */}
          <div className="lg:col-span-8 bg-card rounded-2xl sm:rounded-3xl border border-border shadow-xl flex flex-col overflow-hidden h-full min-h-[480px] sm:min-h-[580px]">
            
            {/* Scrollable Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 space-y-3.5 sm:space-y-6 bg-muted/10 max-h-[460px] sm:max-h-[560px]"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3.5 text-xs sm:text-sm ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md shadow-primary/20 mt-1">
                      <Bot className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </div>
                  )}

                  <div className={`space-y-2 sm:space-y-3 max-w-[90%] sm:max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl whitespace-pre-line leading-relaxed text-xs sm:text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-bold rounded-tl-sm shadow-md shadow-primary/20"
                          : "bg-card border border-border text-foreground rounded-tr-sm shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Quick Actions */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {msg.quickActions.map((act, i) => (
                          act.external ? (
                            <a
                              key={i}
                              href={act.href}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <span>{act.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link
                              key={i}
                              href={act.href}
                              className="bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <span>{act.label}</span>
                              <ArrowLeft className="w-3 h-3" />
                            </Link>
                          )
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-colors"
                          >
                            💬 {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-bold p-3 bg-muted/40 rounded-2xl border border-border w-fit">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>المساعد الذكي يحلل طلبك ويجهز الإجابة الفنية...</span>
                </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="p-2.5 sm:p-5 bg-card border-t border-border flex items-center gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="اكتب سؤالك عن الفرش، الأسعار، أو الخامات..."
                className="flex-1 bg-background border border-border rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 hover:bg-primary/90 transition-all disabled:opacity-40 shadow-md shadow-primary/20 shrink-0"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">إرسال</span>
              </button>
            </div>

          </div>

          {/* Left Column: Popular Quick Queries & Certified Center Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 flex flex-col justify-between">
            
            {/* Quick Prompt Cards */}
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
              <h3 className="text-xs font-black text-foreground font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>الاستفسارات الشائعة والأكثر طلباً:</span>
              </h3>
              
              <div className="space-y-2">
                {POPULAR_TOPICS.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(topic.query)}
                      className="w-full text-right p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-muted/30 hover:bg-primary/10 border border-border hover:border-primary/40 text-foreground transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold truncate group-hover:text-primary transition-colors">
                          {topic.label}
                        </span>
                      </div>
                      <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Certified Guarantee Badge */}
            <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl sm:rounded-3xl border border-primary/20 p-4 sm:p-6 shadow-sm space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-foreground font-heading">ضمان الجودة الألمانية</h4>
                  <p className="text-[10px] text-muted-foreground">5 سنوات ضمان موثق ضد التقشير والعيوب</p>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                يتم تنفيذ كافة الباترونات بماكينات CNC بالليزر وخياطة مطابقة لوسائد الأمان (Airbags).
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
