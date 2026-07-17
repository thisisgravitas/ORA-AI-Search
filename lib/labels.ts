import type { ContentType } from "./types";
import type { Lang } from "./i18n";

export const typeLabels: Record<Lang, Record<ContentType, string>> = {
  en: {
    Community: "Communities",
    Venue: "Venues & amenities",
    Market: "Markets",
    News: "News",
    Event: "Events",
    Careers: "Careers",
    Page: "Pages",
  },
  ar: {
    Community: "المجتمعات",
    Venue: "المرافق والوجهات",
    Market: "الأسواق",
    News: "الأخبار",
    Event: "الفعاليات",
    Careers: "الوظائف",
    Page: "الصفحات",
  },
};

export const typeChip: Record<Lang, Record<ContentType, string>> = {
  en: {
    Community: "Community",
    Venue: "Venue",
    Market: "Market",
    News: "News",
    Event: "Event",
    Careers: "Careers",
    Page: "Page",
  },
  ar: {
    Community: "مجتمع",
    Venue: "مرفق",
    Market: "سوق",
    News: "خبر",
    Event: "فعالية",
    Careers: "وظيفة",
    Page: "صفحة",
  },
};
