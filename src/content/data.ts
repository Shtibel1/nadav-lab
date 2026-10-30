type Bi = { he: string; en: string };

export interface Project {
  id: string;
  name: Bi;
  kind: Bi;
  description: Bi;
  repo: string;
  tags: string[];
  isPrivate?: boolean;
  span: "wide" | "narrow" | "third";
  seed: number;
}

export const projects: Project[] = [
  {
    id: "account-management",
    name: { en: "Account Management", he: "ניהול חשבונות" },
    kind: { en: "Document intelligence", he: "עיבוד מסמכים" },
    description: {
      en: "Hebrew invoice OCR with automated extraction and validation — scanned PDFs in, structured and checked records out.",
      he: "OCR לחשבוניות בעברית עם חילוץ ואימות אוטומטיים — סריקות PDF נכנסות, רשומות מובנות ומאומתות יוצאות.",
    },
    repo: "Shtibel1/account-management",
    tags: ["OCR", "Hebrew", "Automation"],
    span: "wide",
    seed: 11,
  },
  {
    id: "alex",
    name: { en: "Alex", he: "Alex" },
    kind: { en: "AI assistant", he: "עוזר AI" },
    description: {
      en: "A framework for AI assistants with multi-modal capabilities, built to be extended rather than rewritten.",
      he: "תשתית לעוזרי AI עם יכולות מולטי־מודאליות, שנבנתה כדי להתרחב — לא כדי להיכתב מחדש.",
    },
    repo: "Shtibel1/Alex",
    tags: ["AI", "Agents", "Multi-modal"],
    span: "narrow",
    seed: 47,
  },
  {
    id: "blueapps",
    name: { en: "BlueApps", he: "BlueApps" },
    kind: { en: "Commerce platform", he: "פלטפורמת מסחר" },
    description: {
      en: "E-commerce platform on a modern stack, with payment integrations built in from day one.",
      he: "פלטפורמת אי־קומרס על סטאק מודרני, עם אינטגרציות תשלום מהיום הראשון.",
    },
    repo: "Shtibel1/blueapps",
    tags: ["E-commerce", "Next.js", "Payments"],
    isPrivate: true,
    span: "third",
    seed: 83,
  },
  {
    id: "chessapi",
    name: { en: "Chess API", he: "Chess API" },
    kind: { en: "Analysis engine", he: "מנוע ניתוח" },
    description: {
      en: "A REST interface over the Stockfish engine for position analysis at depth.",
      he: "ממשק REST מעל מנוע Stockfish לניתוח עמדות לעומק.",
    },
    repo: "Shtibel1/ChessApi",
    tags: ["API", "Stockfish", "Analysis"],
    span: "third",
    seed: 29,
  },
  {
    id: "installersapi2",
    name: { en: "Installers API", he: "Installers API" },
    kind: { en: "Field operations", he: "תפעול שטח" },
    description: {
      en: "Service management and installer scheduling for teams that work in the field.",
      he: "ניהול שירות ותזמון מתקינים לצוותים שעובדים בשטח.",
    },
    repo: "Shtibel1/InstallersApi2",
    tags: ["API", "Scheduling", "Services"],
    span: "third",
    seed: 64,
  },
];

export type TraceKind = "cmd" | "step" | "data" | "ok";

export interface Trace {
  kind: TraceKind;
  text: string;
  at: number;
}

export interface AgentRun {
  id: string;
  title: string;
  role: Bi;
  host: string;
  lines: Trace[];
}

export const agentRuns: AgentRun[] = [
  {
    id: "invoice-ocr",
    title: "invoice-ocr",
    role: { en: "Document intelligence", he: "עיבוד מסמכים" },
    host: "mcp://agenthub/2.1",
    lines: [
      { kind: "cmd", text: "agent run invoice-ocr --input scan_0847.pdf", at: 0 },
      { kind: "step", text: "load model hebrew-ocr · 3 pages", at: 900 },
      { kind: "step", text: "extract fields → supplier, vat_id, total, due", at: 1500 },
      { kind: "data", text: "ח.פ 514825370 · סה״כ ₪12,450.00 · מע״מ 17%", at: 2300 },
      { kind: "step", text: "validate against ledger schema v4", at: 2900 },
      { kind: "ok", text: "filed invoices/2024-01/inv-0847.json · 1.84s", at: 3500 },
    ],
  },
  {
    id: "wa-gateway",
    title: "support-gateway",
    role: { en: "Conversational agent", he: "סוכן שיחה" },
    host: "wa-business/eu-west-1",
    lines: [
      { kind: "cmd", text: "bot listen --channel support --lang he", at: 0 },
      { kind: "step", text: "session open · +972-50-•••-1234", at: 1000 },
      { kind: "data", text: "user: \u201Cמה הסטטוס של ההזמנה שלי?\u201D", at: 1700 },
      { kind: "step", text: "tool orders.lookup(#8472) → shipped", at: 2400 },
      { kind: "step", text: "compose reply · he-IL · 38 tokens", at: 3000 },
      { kind: "ok", text: "delivered · order #8472 arrives tomorrow", at: 3600 },
    ],
  },
  {
    id: "deploy",
    title: "deploy-pipeline",
    role: { en: "Delivery pipeline", he: "צנרת דיפלוי" },
    host: "ci/blueapps@main",
    lines: [
      { kind: "cmd", text: "pipeline run --trigger push --branch main", at: 0 },
      { kind: "step", text: "install · lockfile verified", at: 800 },
      { kind: "ok", text: "tests 47/47 passed · 12.4s", at: 1700 },
      { kind: "step", text: "build image · push ecr/eu-west-1", at: 2500 },
      { kind: "step", text: "ecs rolling update · 3/3 healthy", at: 3200 },
      { kind: "ok", text: "v2.4.1 live · zero downtime", at: 3800 },
    ],
  },
  {
    id: "chess",
    title: "chess-engine",
    role: { en: "Analysis engine", he: "מנוע ניתוח" },
    host: "api/chess/v1",
    lines: [
      { kind: "cmd", text: "chess analyze --fen r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2 --depth 20", at: 0 },
      { kind: "step", text: "engine stockfish · 4 threads · 256 MB hash", at: 900 },
      { kind: "data", text: "opening: Italian Game, Two Knights", at: 1600 },
      { kind: "step", text: "depth 20 · 1.2M nodes/s", at: 2400 },
      { kind: "ok", text: "best d2d4 · eval +0.42", at: 3100 },
      { kind: "data", text: "pv: d4 exd4 e5 Ne4 O-O", at: 3600 },
    ],
  },
];

export interface StackItem {
  name: string;
  note: Bi;
}

export interface StackGroup {
  id: string;
  label: Bi;
  items: StackItem[];
}

export const stack: StackGroup[] = [
  {
    id: "lang",
    label: { en: "Languages", he: "שפות" },
    items: [
      { name: "TypeScript", note: { en: "Type-safe from database to UI", he: "בטיחות טיפוסים ממסד הנתונים ועד הממשק" } },
      { name: "Python", note: { en: "ML, OCR and automation scripting", he: "ML, OCR וסקריפטים לאוטומציה" } },
    ],
  },
  {
    id: "frameworks",
    label: { en: "Frameworks", he: "פריימוורקים" },
    items: [
      { name: "Next.js", note: { en: "Full-stack React, static to edge", he: "React מלא, מסטטי ועד Edge" } },
      { name: "React", note: { en: "Component systems and interfaces", he: "מערכות קומפוננטות וממשקים" } },
      { name: "Node.js", note: { en: "APIs, workers and agent runtimes", he: "APIs, וורקרים וסביבות ריצה לסוכנים" } },
    ],
  },
  {
    id: "data",
    label: { en: "Data", he: "נתונים" },
    items: [
      { name: "PostgreSQL", note: { en: "Relational source of truth", he: "מקור האמת הרלציוני" } },
      { name: "Redis", note: { en: "Queues, caching and rate limits", he: "תורים, קאשינג והגבלת קצב" } },
    ],
  },
  {
    id: "cloud",
    label: { en: "Cloud & ops", he: "ענן ותפעול" },
    items: [
      { name: "AWS", note: { en: "ECS, Lambda, S3 across regions", he: "ECS, Lambda ו־S3 בכמה אזורים" } },
      { name: "Docker", note: { en: "Reproducible builds and deploys", he: "בילדים ודיפלויים שניתן לשחזר" } },
    ],
  },
  {
    id: "ai",
    label: { en: "AI systems", he: "מערכות AI" },
    items: [
      { name: "OpenAI", note: { en: "LLM integration and agent loops", he: "שילוב LLM ולולאות סוכנים" } },
      { name: "MCP", note: { en: "Model Context Protocol servers and tools", he: "שרתים וכלים ל־Model Context Protocol" } },
    ],
  },
];

export interface Region {
  code: string;
  city: Bi;
  coords: [number, number];
}

export const origin: Region = {
  code: "il-central-1",
  city: { en: "Tel Aviv", he: "תל אביב" },
  coords: [32.0853, 34.7818],
};

export const regions: Region[] = [
  { code: "eu-central-1", city: { en: "Frankfurt", he: "פרנקפורט" }, coords: [50.1109, 8.6821] },
  { code: "eu-west-2", city: { en: "London", he: "לונדון" }, coords: [51.5074, -0.1278] },
  { code: "eu-west-1", city: { en: "Dublin", he: "דבלין" }, coords: [53.3498, -6.2603] },
  { code: "ap-south-1", city: { en: "Mumbai", he: "מומבאי" }, coords: [19.076, 72.8777] },
  { code: "us-east-1", city: { en: "N. Virginia", he: "וירג׳יניה" }, coords: [38.9519, -77.4480] },
  { code: "ap-southeast-1", city: { en: "Singapore", he: "סינגפור" }, coords: [1.3521, 103.8198] },
  { code: "ap-northeast-1", city: { en: "Tokyo", he: "טוקיו" }, coords: [35.6762, 139.6503] },
  { code: "us-west-2", city: { en: "Oregon", he: "אורגון" }, coords: [45.8399, -119.7006] },
];
