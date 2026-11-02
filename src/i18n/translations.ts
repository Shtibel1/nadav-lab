export type Locale = "he" | "en";

export const translations = {
  he: {
    nav: {
      work: "עבודות",
      systems: "מערכות",
      reach: "פריסה",
      stack: "כלים",
      contact: "קשר",
      menu: "תפריט",
      close: "סגירה",
      skip: "דילוג לתוכן",
    },
    hero: {
      eyebrow: "מהנדס Full-Stack · תל אביב",
      name: ["נדב", "שטיבל"],
      statement:
        "אני בונה סוכני AI, כלי MCP ואוטומציות שרצים בפרודקשן — עברית מהיסוד, באמינות של מערכות מסחר.",
      ctaWork: "עבודות נבחרות",
      ctaContact: "בואו נדבר",
      scroll: "גלילה",
      sim: "סימולציה חיה",
      still: "פריים סטטי",
      local: "שעון מקומי",
      coords: "32.08°N 34.78°E",
    },
    work: {
      index: "01",
      label: "עבודות נבחרות",
      title: ["תוכנה שיש", "לה תפקיד."],
      intro:
        "מערכות שתכננתי ובניתי מקצה לקצה — מצנרות OCR שקוראות חשבוניות בעברית ועד פלטפורמות מסחר שסולקות תשלומים.",
      repo: "למאגר הקוד",
      private: "פרויקט סגור",
      visibilityPublic: "ציבורי",
      visibilityPrivate: "פרטי",
      stars: "כוכבים",
    },
    systems: {
      index: "02",
      label: "מערכות בפעולה",
      title: ["סוכנים שעושים", "עבודה אמיתית."],
      intro:
        "עקבות ריצה מהאוטומציות שאני מפעיל: עיבוד מסמכים, ממשקי שיחה, צנרות דיפלוי ומנועי ניתוח.",
      processes: "תהליכים",
      streaming: "משדר",
      complete: "הושלם",
      replay: "הרצה חוזרת",
    },
    reach: {
      index: "03",
      label: "פריסת תשתית",
      title: ["נבנה בתל אביב.", "רץ בכל מקום."],
      intro:
        "השירותים נפרסים מ־il-central-1 לאזורי AWS בשלוש יבשות. המרחק מחושב לפי מעגל גדול, וההשהיה היא הגבול הפיזיקלי של אור בסיב אופטי.",
      region: "אזור",
      distance: "מרחק",
      rtt: "RTT מינימלי",
      origin: "מקור",
      drag: "גררו לסיבוב",
      km: "ק״מ",
      ms: "מ״ש",
    },
    stack: {
      index: "04",
      label: "כלי עבודה",
      title: ["ארגז הכלים,", "לפי תחום."],
      intro:
        "נבחרו בזכות עמידות ולא בזכות חידוש. טיפוסים מקצה לקצה, נצפות מלאה בפרודקשן, ומשעממים בדיוק איפה שצריך.",
    },
    contact: {
      index: "05",
      label: "צור קשר",
      title: ["יש לכם משהו", "ששווה לבנות?"],
      intro: "ספרו לי מה זה צריך לעשות. אני אספר לכם איך הייתי בונה את זה.",
      name: "שם",
      email: "אימייל",
      message: "על מה מדובר?",
      send: "שליחת הודעה",
      sending: "פותח את תוכנת הדואר…",
      direct: "או כתבו ישירות",
      based: "ממוקם בישראל · עובד בעברית ובאנגלית",
    },
    footer: {
      rights: "כל הזכויות שמורות",
      top: "חזרה למעלה",
      city: "תל אביב",
    },
  },
  en: {
    nav: {
      work: "Work",
      systems: "Systems",
      reach: "Reach",
      stack: "Stack",
      contact: "Contact",
      menu: "Menu",
      close: "Close",
      skip: "Skip to content",
    },
    hero: {
      eyebrow: "Full-stack engineer · Tel Aviv",
      name: ["Nadav", "Shtibel"],
      statement:
        "I build AI agents, MCP tooling and automation that run in production — Hebrew-first, commerce-grade, quietly reliable.",
      ctaWork: "Selected work",
      ctaContact: "Start a conversation",
      scroll: "Scroll",
      sim: "Live simulation",
      still: "Still frame",
      local: "Local time",
      coords: "32.08°N 34.78°E",
    },
    work: {
      index: "01",
      label: "Selected work",
      title: ["Software with", "a job to do."],
      intro:
        "Systems I've designed and shipped end to end — from OCR pipelines that read Hebrew invoices to commerce platforms that take payments.",
      repo: "View repository",
      private: "Private build",
      visibilityPublic: "Public",
      visibilityPrivate: "Private",
      stars: "stars",
    },
    systems: {
      index: "02",
      label: "Systems in operation",
      title: ["Agents that do", "real work."],
      intro:
        "Run traces from the automations I operate: document intelligence, conversational gateways, delivery pipelines and analysis engines.",
      processes: "Processes",
      streaming: "Streaming",
      complete: "Complete",
      replay: "Replay",
    },
    reach: {
      index: "03",
      label: "Infrastructure reach",
      title: ["Built in Tel Aviv.", "Running everywhere."],
      intro:
        "Services deploy from il-central-1 to AWS regions on three continents. Distance is great-circle; latency is the physical floor for light in fiber.",
      region: "Region",
      distance: "Distance",
      rtt: "RTT floor",
      origin: "Origin",
      drag: "Drag to rotate",
      km: "km",
      ms: "ms",
    },
    stack: {
      index: "04",
      label: "Instruments",
      title: ["The toolkit,", "by discipline."],
      intro:
        "Chosen for longevity over novelty. Typed end to end, observable in production, boring exactly where it should be.",
    },
    contact: {
      index: "05",
      label: "Contact",
      title: ["Have something", "worth building?"],
      intro: "Tell me what it needs to do. I'll tell you how I'd build it.",
      name: "Name",
      email: "Email",
      message: "What are we building?",
      send: "Send message",
      sending: "Opening your mail app…",
      direct: "Or write directly",
      based: "Based in Israel · Working in Hebrew & English",
    },
    footer: {
      rights: "All rights reserved",
      top: "Back to top",
      city: "Tel Aviv",
    },
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Translations = Widen<(typeof translations)["he"]>;
