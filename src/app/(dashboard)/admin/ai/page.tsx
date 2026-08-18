"use client";

import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  Key, 
  Send, 
  Save, 
  Loader2, 
  Check, 
  Wrench, 
  Package, 
  TrendingUp, 
  FileText, 
  Cpu, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  Crown, 
  RotateCcw, 
  CheckCircle2, 
  Tag, 
  Flame, 
  Layers 
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAIPage() {
  const [apiKey, setApiKey] = useState("");
  const [aiProvider, setAiProvider] = useState("gemini");
  const [aiModel, setAiModel] = useState("gemini-1.5-flash");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [botName, setBotName] = useState("مساعد أورجينال الذكي");
  const [welcomeMessage, setWelcomeMessage] = useState("أهلاً بك في أورجينال لفرش وعناية السيارات الفاخرة! كيف يمكنني مساعدتك اليوم؟");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Copilot Interactive Chat
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: "user" | "assistant"; content: string; actionResult?: any }>>([
    {
      role: "assistant",
      content: "مرحباً بك يا مدير! أنا مساعدك الذكي لتنفيذ أي مهمة إدارية فوراً. يمكنك أن تطلب مني بكلماتك البسيطة:\n\n• «أنشئ 20 منتج عشوائي بالصور والأسعار والمواصفات»\n• «أنشئ أقسام وتصنيفات جديدة للمتجر»\n• «حلل لي أداء المبيعات والأرباح»\n• «اكتب نص تسويقي فاخر لمنتج جديد»"
    }
  ]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.ai_api_key) setApiKey(data.ai_api_key);
        if (data.ai_provider) setAiProvider(data.ai_provider);
        if (data.ai_model) setAiModel(data.ai_model);
        if (data.ai_system_prompt) setSystemPrompt(data.ai_system_prompt);
        if (data.ai_bot_name) setBotName(data.ai_bot_name);
        if (data.ai_welcome_message) setWelcomeMessage(data.ai_welcome_message);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            ai_api_key: apiKey,
            ai_provider: aiProvider,
            ai_model: aiModel,
            ai_system_prompt: systemPrompt,
            ai_bot_name: botName,
            ai_welcome_message: welcomeMessage
          }
        }),
      });

      if (res.ok) {
        toast.success("تم حفظ إعدادات ومفتاح الذكاء الاصطناعي بنجاح!");
      } else {
        toast.error("حدث خطأ أثناء الحفظ");
      }
    } catch (e) {
      toast.error("خطأ في الاتصال");
    } finally {
      setIsSaving(false);
    }
  };

  const executeCopilotAction = async (action: string, payload?: any, promptText?: string) => {
    const userText = promptText || (
      action === "bulk_create_products" ? "أنشئ لي 20 منتج عشوائي فاخر بالصور والمعلومات فوراً" :
      action === "create_category" ? "أضف لي تصنيفات وأقسام جديدة في المتجر" :
      "حلل لي أداء المبيعات والأرباح"
    );
    
    setCopilotMessages(prev => [...prev, { role: "user", content: userText }]);
    setCopilotLoading(true);

    try {
      const res = await fetch("/api/ai/admin-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload, prompt: userText })
      });

      const data = await res.json();
      if (res.ok) {
        let replyMsg = data.message || data.analysis || data.description || "تم تنفيذ الإجراء بنجاح في قاعدة البيانات!";
        setCopilotMessages(prev => [...prev, { role: "assistant", content: replyMsg, actionResult: data }]);
        toast.success("تم تنفيذ الأمر بنجاح!");
      } else {
        setCopilotMessages(prev => [...prev, { role: "assistant", content: `❌ عذراً: ${data.error || "فشل تنفيذ الأمر"}` }]);
        toast.error(data.error || "حدث خطأ");
      }
    } catch (e) {
      setCopilotMessages(prev => [...prev, { role: "assistant", content: "❌ خطأ في الاتصال بالخادم." }]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleCopilotSend = () => {
    if (!copilotInput.trim()) return;
    const text = copilotInput.trim();
    setCopilotInput("");

    if (text.includes("تصنيف") || text.includes("قسم") || text.includes("أقسام")) {
      executeCopilotAction("create_category", {}, text);
    } else if (text.includes("منتج") || text.includes("منتجات") || text.includes("سلع") || text.includes("بضائع")) {
      executeCopilotAction("bulk_create_products", {}, text);
    } else if (text.includes("تحليل") || text.includes("أرباح") || text.includes("مبيعات") || text.includes("احصائيات")) {
      executeCopilotAction("analyze_business", {}, text);
    } else {
      executeCopilotAction("generate_copy", { productName: text }, text);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground font-heading">إدارة الذكاء الاصطناعي والمساعد الإداري</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">تكوين مفاتيح API، تدريب المساعد الذكي، وتنفيذ أي إجراء تلقائي في لوحة التحكم</p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all shadow-xl shadow-primary/20 disabled:opacity-70 shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>حفظ إعدادات الـ AI</span>
        </button>
      </div>

      {/* Grid: Left Copilot Assistant, Right Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Right 7 Cols: Admin AI Copilot */}
        <div className="lg:col-span-7 bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8 flex flex-col justify-between space-y-6">
          
          <div className="space-y-2 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2 font-heading">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>مساعد الإدارة الذكي الخارق (AI Copilot)</span>
              </h2>
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                متصل وجاهز للعمل
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              أخبر المساعد بما تريد تنفيذه في المتجر (مثال: إنشاء 20 منتج عشوائي، إضافة تصنيفات، تحليل الأرباح) وسيقوم بإنشائها ونشرها في قاعدة البيانات فوراً!
            </p>
          </div>

          {/* Quick Action Presets */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => executeCopilotAction("bulk_create_products", { count: 20 })}
              disabled={copilotLoading}
              className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ إنشاء 20 منتج عشوائي بالصور والمعلومات فوراً</span>
            </button>

            <button
              onClick={() => executeCopilotAction("create_category")}
              disabled={copilotLoading}
              className="px-3 py-1.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all flex items-center gap-1.5 border border-border"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>+ توليد أقسام وتصنيفات جديدة</span>
            </button>

            <button
              onClick={() => executeCopilotAction("analyze_business")}
              disabled={copilotLoading}
              className="px-3 py-1.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all flex items-center gap-1.5 border border-border"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>📊 تحليل المبيعات الشامل</span>
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="h-[360px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-muted/20 border border-border">
            {copilotMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 rounded-tl-sm"
                      : "bg-card border border-border text-foreground shadow-sm rounded-tr-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {copilotLoading && (
              <div className="flex gap-2 items-center text-xs text-muted-foreground font-bold">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>جاري معالجة طلبك وتنفيذه في قاعدة البيانات...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCopilotSend()}
              placeholder="اكتب أمرك هنا... (مثال: أنشئ 20 منتج عشوائي، أو أضف تصنيفات جديدة، أو حلل المبيعات)"
              className="flex-1 bg-background border border-border rounded-2xl px-4 py-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleCopilotSend}
              disabled={copilotLoading || !copilotInput.trim()}
              className="px-5 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال</span>
            </button>
          </div>

        </div>

        {/* Left 5 Cols: AI Configuration & Model Settings */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* API Keys Box */}
          <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-foreground font-heading">مفتاح API ومزود الخدمة</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">مزود الذكاء الاصطناعي (AI Provider)</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="gemini">Google Gemini (موصى به - فائق السرعة)</option>
                <option value="openai">OpenAI (ChatGPT)</option>
                <option value="builtin">المحرك المدمج الذكي (بدون مفتاح خارجي)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">مفتاح الـ API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... أو sk-..."
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs font-mono text-left text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
              <p className="text-[10px] text-muted-foreground">
                يمكنك تركه فارغاً لاستخدام المحرك الداخلي الذكي للموقع تلقائياً.
              </p>
            </div>
          </div>

          {/* Chatbot Persona & Instructions */}
          <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-foreground font-heading">إعدادات شات بوت العملاء</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">اسم المساعد التفاعلي</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">رسالة الترحيب الأولى للعميل</label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={2}
                className="w-full bg-background border border-border rounded-2xl p-3.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">تعليمات الذكاء الاصطناعي (System Prompt)</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                placeholder="أنت المستشار الفني لأورجينال... جاوب العملاء بدقة عن الجلود الألمانية والأسعار وتوجيههم لصفحة الحجز."
                className="w-full bg-background border border-border rounded-2xl p-3.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
