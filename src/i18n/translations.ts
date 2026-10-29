export type Locale = "he" | "en";

export interface Translations {
  nav: {
    home: string;
    projects: string;
    timeline: string;
    contact: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    subtitle: string;
    scrollHint: string;
  };
  terminal: {
    title: string;
    subtitle: string;
  };
  projects: {
    title: string;
    subtitle: string;
    viewCode: string;
    stars: string;
    noStars: string;
  };
  timeline: {
    title: string;
    subtitle: string;
  };
  globe: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    askAgent: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
  };
  footer: {
    rights: string;
    builtWith: string;
  };
  common: {
    loading: string;
    error: string;
  };
}

export const translations: Record<Locale, Translations> = {
  he: {
    nav: {
      home: "בית",
      projects: "פרויקטים",
      timeline: "ציר זמן",
      contact: "צור קשר",
    },
    hero: {
      greeting: "שלום, אני",
      name: "נדב שטיבל",
      title: "מהנדס Full-Stack",
      subtitle: "בונה סוכני AI, כלי MCP, אוטומציות, כלים בעברית, ואי-קומרס",
      scrollHint: "גלול למטה",
    },
    terminal: {
      title: "סוכנים בעבודה",
      subtitle: "צפה בסוכנים ואוטומציות בפעולה",
    },
    projects: {
      title: "פרויקטים",
      subtitle: "קוד פתוח ופרויקטים נבחרים",
      viewCode: "צפה בקוד",
      stars: "כוכבים",
      noStars: "—",
    },
    timeline: {
      title: "הטכנולוגיות שלי",
      subtitle: "המסע והכלים שמרכיבים את הסטאק",
    },
    globe: {
      title: "תשתית גלובלית",
      subtitle: "פריסה ברחבי העולם",
    },
    contact: {
      title: "בוא נדבר",
      subtitle: "יש לך רעיון? פרויקט? סתם רוצה להגיד שלום?",
      askAgent: "שאל את הסוכן שלי",
      namePlaceholder: "השם שלך",
      emailPlaceholder: "האימייל שלך",
      messagePlaceholder: "מה תרצה לשאול?",
      send: "שלח",
      sending: "שולח...",
    },
    footer: {
      rights: "כל הזכויות שמורות",
      builtWith: "נבנה עם",
    },
    common: {
      loading: "טוען...",
      error: "משהו השתבש",
    },
  },
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      timeline: "Timeline",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      name: "Nadav Shtibel",
      title: "Full-Stack Engineer",
      subtitle: "Building AI agents, MCP tools, automation, Hebrew tooling, and e-commerce",
      scrollHint: "Scroll down",
    },
    terminal: {
      title: "Agents at Work",
      subtitle: "Watch agents and automations in action",
    },
    projects: {
      title: "Projects",
      subtitle: "Open source and selected works",
      viewCode: "View Code",
      stars: "stars",
      noStars: "—",
    },
    timeline: {
      title: "My Stack",
      subtitle: "The journey and tools that shape my work",
    },
    globe: {
      title: "Global Infrastructure",
      subtitle: "Deployed worldwide",
    },
    contact: {
      title: "Let's Talk",
      subtitle: "Got an idea? A project? Just want to say hi?",
      askAgent: "Ask My Agent",
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      messagePlaceholder: "What would you like to ask?",
      send: "Send",
      sending: "Sending...",
    },
    footer: {
      rights: "All rights reserved",
      builtWith: "Built with",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
    },
  },
};
