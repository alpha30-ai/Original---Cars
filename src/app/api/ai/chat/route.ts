import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fetch AI settings from SiteSettings
    let settingsMap: Record<string, string> = {};
    try {
      const records = await prisma.siteSettings.findMany();
      settingsMap = records.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (e) {
      console.error("Could not load AI settings from DB:", e);
    }

    const apiKey = settingsMap["ai_api_key"] || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
    const systemPrompt = settingsMap["ai_system_prompt"] || 
      "أنت المساعد الذكي والمستشار الفني الرسمي لمركز 'أورجينال لفرش وعناية السيارات الفاخرة' (Original Car Upholstery & Detailing). " +
      "مهمتك مساعدة العملاء بلباقة واحترافية فائقة، الإجابة عن استفسارات تنجيد وتفصيل جلود النابا الألمانية، أسقف الألكانتارا ونجوم رولز رويس، تجديد التابلوه والأبواب، ودواسات 7D، وتوجيههم لروابط الموقع المناسبة. " +
      "مركزنا يقدم ضمان ذهبي 5 سنوات، ويستخدم خامات أوروبية معتمدة 100%، وخياطة أمان مخصصة للوسائد الهوائية (Airbags).";

    // If an external Gemini API key is provided, try Gemini API
    if (apiKey && (apiKey.startsWith("AIza") || settingsMap["ai_provider"] === "gemini")) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${systemPrompt}\n\nسياق المحادثة السابقة:\n${JSON.stringify(
                        conversationHistory.slice(-4)
                      )}\n\nرسالة العميل الحالية: "${message}"\n\nأجب باللغة العربية بأسلوب راقٍ واقترح روابط مناسبة.`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              suggestions: generateSuggestions(message),
              quickActions: generateQuickActions(message)
            });
          }
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to smart engine:", geminiError);
      }
    }

    // High-Intelligence Built-in Automotive Knowledge Base (Zero-Failure Fallback)
    const lower = message.toLowerCase();
    let reply = "";
    let quickActions: any[] = [];
    let suggestions: string[] = [];

    if (lower.includes("سعر") || lower.includes("اسعار") || lower.includes("تكلفة") || lower.includes("بكام") || lower.includes("فلوس") || lower.includes("كم يكلف")) {
      reply = "إليك باقات وتكاليف التجهيز في مركز أورجينال:\n\n" +
        "• **فرش جلد نابا ألماني كامل (VIP)**: يبدأ من 6,500 إلى 14,000 ج.م بحسب حجم السيارة ومستوى التطريز CNC.\n" +
        "• **سقف ألكانتارا إيطالي + نجوم رولز رويس (Starlight)**: يبدأ من 4,500 إلى 8,500 ج.م مع تحكم عبر تطبيق الهاتف.\n" +
        "• **طقم دواسات 7D ليزر مع عزل كامل**: يبدأ من 1,800 ج.م.\n" +
        "• **تجديد الطارة (الدركسيون) جلد نابا / كاربون فايبر**: يبدأ من 1,200 ج.م.\n\n" +
        "✨ جميع أعمالنا مشمولة بشهادة ضمان ذهبي موثقة لمدة 5 سنوات ضد التقشير وتغير الألوان.";
      quickActions = [
        { label: "احجز موعد لمعاينة سيارتك", href: "/booking" },
        { label: "تصفح أسعار المتجر", href: "/shop" }
      ];
      suggestions = ["ما هي الخامات الألمانية المتوفرة؟", "هل الفرش آمن مع الإيرباج؟", "كم يستغرق وقت التركيب؟"];
    } else if (lower.includes("حجز") || lower.includes("موعد") || lower.includes("اركب") || lower.includes("عنوان") || lower.includes("مكانك") || lower.includes("فرع")) {
      reply = "أهلاً بك في مركز أورجينال المعتمد! 🚗\n\n" +
        "📍 **العنوان**: القاهرة - مدينة العبور - الحي الأول (بالقرب من المحور الرئيسي).\n" +
        "🕒 **مواعيد العمل**: يومياً من السبت إلى الخميس (10:00 ص حتى 11:00 م)، والجمعة (1:00 م حتى 11:00 م).\n\n" +
        "يمكنك حجز موعدك مسبقاً لاختيار درجات الألوان وقص الباترونات مسبقاً وتوفير وقتك في المركز.";
      quickActions = [
        { label: "حجز موعد خدمة الآن", href: "/booking" },
        { label: "محادثة عبر واتساب", href: `https://wa.me/201008499476?text=${encodeURIComponent("مرحباً أورجينال، أود حجز موعد لسيارتي")}`, external: true }
      ];
      suggestions = ["ما هي مدة تفصيل الفرش؟", "هل أحتاج لترك السيارة بالمركز؟"];
    } else if (lower.includes("جلد") || lower.includes("نابا") || lower.includes("خامات") || lower.includes("الكانتارا") || lower.includes("الكانتار") || lower.includes("طبيعي")) {
      reply = "نستخدم في أورجينال أرقى الخامات الأوروبية المعتمدة عالمياً:\n\n" +
        "1. **جلد نابا ألماني طبيعي (German Nappa)**: ملمس حريري ومسامي، معالج بتقنية النانو ضد حرارة الصيف وأشعة الشمس UV.\n" +
        "2. **ألكانتارا إيطالية أصلية 100%**: مظهر رياضي ملوكي فائق الفخامة للأسقف والقوائم والأبواب.\n" +
        "3. **خيوط ماديرا الألمانية**: خيوط حريرية معززة لمقاومة الاحتكاك والاهتراء.\n" +
        "4. **تبطين ميموري فوم طبي**: دعم مريح للفقرات أثناء السفر الطويل.\n\n" +
        "كل خامة مسجلة وموثقة بضمان معتمد 5 سنوات.";
      quickActions = [
        { label: "مشاهدة معرض أعمال الجلود", href: "/gallery" },
        { label: "حجز موعد تفصيل", href: "/booking" }
      ];
      suggestions = ["هل الفرش يؤثر على الوسائد الهوائية (Airbags)؟", "كيف أعتني بجلد النابا؟"];
    } else if (lower.includes("ايرباج") || lower.includes("airbag") || lower.includes("أمان") || lower.includes("امان") || lower.includes("وسائد")) {
      reply = "سلامتك هي أولويتنا القصوى! 🛡️\n\n" +
        "نعتمد نظام خياطة ودرزات خاص ومطابق لمواصفات الأمان الأوروبية (Airbags Safe Stitching). الخياطة الجانبية مصممة لتفتح فوراً وبدون أي إعاقة عند انطلاق الوسائد الهوائية في أجزاء من الثانية.";
      quickActions = [
        { label: "معايير الأمان والضمان", href: "/about" },
        { label: "حجز موعد لسيارتك", href: "/booking" }
      ];
      suggestions = ["ما هي مدة الضمان؟", "احجز موعد تركيب"];
    } else if (lower.includes("سقف") || lower.includes("نجوم") || lower.includes("ستار لايت") || lower.includes("starlight") || lower.includes("رولز")) {
      reply = "تجهيز أسقف النجوم والألكانتارا (Rolls-Royce Starlight Style) ✨:\n\n" +
        "• استخدام ألياف بصرية ألمانية فائقة النقاء لا تسخن ولا تستهلك بطارية السيارة.\n" +
        "• توزيع مئات النجوم مع تأثير الشهب المتحركة (Shooting Stars).\n" +
        "• ريموت تحكم + تطبيق على الهاتف للتحكم الكامل بدرجات الألوان والسطوع.\n" +
        "• ضمان 3 سنوات على وحدات الإضاءة والألياف الضوئية.";
      quickActions = [
        { label: "حجز موعد تجهيز سقف", href: "/booking" },
        { label: "معرض الأسقف والنجوم", href: "/gallery" }
      ];
      suggestions = ["كم يستغرق تركيب سقف النجوم؟", "ما هي أسعار سقف الألكانتارا؟"];
    } else if (lower.includes("وقت") || lower.includes("مدة") || lower.includes("ساعة") || lower.includes("يوم") || lower.includes("بتاخد قد ايه")) {
      reply = "أوقات التجهيز في مركز أورجينال سريعة ومنظمة بفضل قص الليزر المسبق:\n\n" +
        "• **تركيب فرش جاهز ومفصل مسبقاً**: من 2 إلى 4 ساعات فقط.\n" +
        "• **تفصيل كامل مخصص (Custom VIP)**: من 6 إلى 8 ساعات (تسليم في نفس اليوم).\n" +
        "• **سقف ألكانتارا ونجوم رولز رويس**: يوم عمل كامل لضمان الدقة وتوزيع الألياف الضوئية.";
      quickActions = [
        { label: "حجز موعد بالمركز", href: "/booking" }
      ];
      suggestions = ["احجز موعد لسيارتي", "أسعار الفرش"];
    } else {
      reply = "أهلاً بك في غرفة استشارات أورجينال الذكية! ✨\n\n" +
        "أنا هنا لمساعدتك في كل ما يخص مقصورة سيارتك: أسعار الجلود الألمانية، أسقف الألكانتارا، خياطة الإيرباج الآمنة، الدواسات الـ 7D، وحجز المواعيد الفورية. كيف يمكنني خدمتك الآن؟";
      quickActions = [
        { label: "حجز موعد خدمة", href: "/booking" },
        { label: "تصفح المتجر", href: "/shop" },
        { label: "معرض الأعمال", href: "/gallery" }
      ];
      suggestions = ["ما هي أسعار تفصيل الفرش؟", "أنواع الجلود الألمانية", "حجز موعد لسيارتي"];
    }

    return NextResponse.json({
      reply,
      quickActions,
      suggestions
    });
  } catch (error: any) {
    console.error("AI Chatbot Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة المحادثة" },
      { status: 500 }
    );
  }
}

function generateSuggestions(userMsg: string): string[] {
  return [
    "ما هي أسعار تفصيل الفرش؟",
    "أنواع جلود النابا والألكانتارا",
    "احجز موعد لسيارتي بالمركز"
  ];
}

function generateQuickActions(userMsg: string): any[] {
  const lower = userMsg.toLowerCase();
  if (lower.includes("حجز") || lower.includes("طلب") || lower.includes("موعد")) {
    return [{ label: "الانتقال لصفحة الحجز", href: "/booking" }];
  }
  if (lower.includes("متجر") || lower.includes("منتج") || lower.includes("شراء")) {
    return [{ label: "الانتقال للمتجر", href: "/shop" }];
  }
  return [
    { label: "حجز موعد خدمة", href: "/booking" },
    { label: "تصفح المتجر", href: "/shop" }
  ];
}
