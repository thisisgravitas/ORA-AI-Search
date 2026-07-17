import type { ScriptedAnswer } from "./types";

/* Pre scripted conversational answers standing in for Opal AI over
   Graph retrieval. Citation markers [n] map to the sources array. */

export const answers: ScriptedAnswer[] = [
  {
    id: "family-egypt",
    matchTerms: ["family", "families", "school", "schools", "children", "kids", "عائلية", "مدارس", "أطفال"],
    question: "Which ORA communities suit families with young children in Egypt?",
    questionAr: "ما مجتمعات أورا الأنسب للعائلات ذات الأطفال في مصر؟",
    body: [
      "Two communities are designed around family life. ZED East in New Cairo is the most complete fit: 360 feddans with over half the land in greenery, where villas and apartments overlook gardens, courtyards or The Club.[1] Its education district clusters schools, academies and clinics at the core, so families reach daily life on foot.[2]",
      "In West Cairo, ZED El Sheikh Zayed places homes within walking distance of ZED Park, a 45 acre public park with play trails and seasonal family festivals.[3][4] For families who want a summer base as well, Silversands North Coast adds a swimmable lagoon and a protected beach on the Mediterranean.[5]",
    ],
    bodyAr: [
      "هناك مجتمعان صمما حول حياة العائلة. زيد إيست في القاهرة الجديدة هو الأنسب: 360 فدانا أكثر من نصفها مساحات خضراء، تطل فيه الفلل والشقق على الحدائق أو الأفنية أو النادي.[1] ويجمع حيه التعليمي المدارس والأكاديميات والعيادات في القلب، لتصل العائلات إلى حياتها اليومية سيرا على الأقدام.[2]",
      "وفي غرب القاهرة، يضع زيد الشيخ زايد المنازل على مسافة سير من حديقة زيد، وهي حديقة عامة على 45 فدانا بمسارات لعب ومهرجانات عائلية موسمية.[3][4] وللعائلات التي تبحث عن مقر صيفي أيضا، تضيف سيلفرساندز الساحل الشمالي بحيرة صالحة للسباحة وشاطئا محميا على المتوسط.[5]",
    ],
    sources: [
      { itemId: "zed-east", citation: 1 },
      { itemId: "zed-academy", citation: 2 },
      { itemId: "zed-sheikh-zayed", citation: 3 },
      { itemId: "zed-park", citation: 4 },
      { itemId: "silversands-north-coast", citation: 5 },
    ],
    followUps: [
      "What is in the ZED East education district?",
      "What payment plans are available at ZED East?",
      "Compare ZED East and Solana for a young family",
    ],
    followUpsAr: [
      "ماذا يضم الحي التعليمي في زيد إيست؟",
      "ما خطط السداد المتاحة في زيد إيست؟",
      "قارن بين زيد إيست وسولانا لعائلة شابة",
    ],
  },
  {
    id: "sea-egypt",
    matchTerms: ["sea", "beach", "coast", "seafront", "beachfront", "البحر", "شاطئ", "الساحل"],
    question: "Where can I find apartments near the sea in Egypt?",
    questionAr: "أين أجد شققا قريبة من البحر في مصر؟",
    body: [
      "Silversands North Coast is the direct answer: over a kilometre of beachfront at Ras El Hekma on the Mediterranean, with apartments, chalets and villas set on crystal white sands.[1] A members beach club anchors the shoreline with cabanas, dining and summer residencies.[2]",
      "If your search extends beyond Egypt, BAYN by ORA offers shoreline living at Ghantoot between Dubai and Abu Dhabi,[3] and Marina Residences at Ayia Napa Marina pairs sea view apartments with berthing privileges in Cyprus.[4]",
    ],
    bodyAr: [
      "سيلفرساندز الساحل الشمالي هي الإجابة المباشرة: أكثر من كيلومتر من الواجهة البحرية في رأس الحكمة على المتوسط، بشقق وشاليهات وفلل على رمال بيضاء ناصعة.[1] ويرسخ نادي الشاطئ الخاص بالأعضاء الواجهة البحرية بأجنحته ومطاعمه وإقاماته الصيفية.[2]",
      "وإذا اتسع بحثك خارج مصر، يقدم مشروع بين من أورا إقامة شاطئية في غنتوت بين دبي وأبوظبي،[3] بينما تجمع مساكن المارينا في أيا نابا بين شقق بإطلالة بحرية وامتيازات رسو في قبرص.[4]",
    ],
    sources: [
      { itemId: "silversands-north-coast", citation: 1 },
      { itemId: "silversands-beach-club", citation: 2 },
      { itemId: "bayn", citation: 3 },
      { itemId: "anm-east-tower", citation: 4 },
    ],
    followUps: [
      "What is the payment plan at Silversands North Coast?",
      "Is Silversands managed for seasonal rental?",
      "Show me beachfront villas in the UAE",
    ],
    followUpsAr: [
      "ما خطة السداد في سيلفرساندز الساحل الشمالي؟",
      "هل تدار سيلفرساندز للتأجير الموسمي؟",
      "أرني فلل الواجهة البحرية في الإمارات",
    ],
  },
  {
    id: "invest-grenada",
    matchTerms: ["invest", "investment", "citizenship", "yield", "returns", "passport", "استثمار", "جنسية"],
    question: "How do I invest in Silversands Grenada?",
    body: [
      "Silversands Villas in Grenada are fully managed beachfront homes beside the Grand Anse resort, sold rental ready.[1] Qualifying purchases meet the approved threshold for Grenada's citizenship by investment programme; the guide sets out the route and holding requirements.[2]",
      "The resort itself, Silversands Grand Anse, operates year round and anchors rental demand.[3] ORA hosts periodic investor briefings in Dubai covering returns and the citizenship process.[4]",
    ],
    sources: [
      { itemId: "silversands-villas-grenada", citation: 1 },
      { itemId: "grenada-cbi-guide", citation: 2 },
      { itemId: "silversands-grand-anse", citation: 3 },
      { itemId: "event-silversands-investor", citation: 4 },
    ],
    followUps: [
      "What yields do the Grenada villas achieve?",
      "When is the next investor evening in Dubai?",
      "Compare Grenada and Cyprus for investment",
    ],
  },
  {
    id: "marina-life",
    matchTerms: ["marina", "yacht", "yachts", "cyprus", "berthing", "مارينا", "يخت"],
    question: "What is it like to live at Ayia Napa Marina?",
    body: [
      "Ayia Napa Marina is a completed, full service Mediterranean destination: 600 berths, twin residential towers, waterfront villas and a dining promenade.[1] Residents in the East Tower receive furnished apartments with berthing privileges through the yacht club.[2][3]",
      "The calendar runs through the season, from regatta week to summer concerts on the events quarter stage.[4]",
    ],
    sources: [
      { itemId: "ayia-napa-marina", citation: 1 },
      { itemId: "anm-east-tower", citation: 2 },
      { itemId: "anm-yacht-club", citation: 3 },
      { itemId: "event-anm-regatta", citation: 4 },
    ],
    followUps: [
      "Are there apartments still available at the marina?",
      "What did the marina win awards for?",
      "How does berthing work for residents?",
    ],
  },
];

export const fallbackAnswer: ScriptedAnswer = {
  id: "fallback",
  matchTerms: [],
  question: "",
  body: [
    "ORA builds destinations across Egypt, the UAE, Cyprus, Grenada and Pakistan, from urban districts like ZED to resort communities like Silversands.[1] Each is masterplanned around the group's central idea, reimagining time.[2]",
    "Tell me what matters most to you, a market, a lifestyle or an investment goal, and I will narrow this down to the right community.",
  ],
  bodyAr: [
    "تبني أورا وجهات في مصر والإمارات وقبرص وغرينادا وباكستان، من الأحياء العمرانية مثل زيد إلى المجتمعات الساحلية مثل سيلفرساندز.[1] كل منها مخطط حول فكرة المجموعة المركزية، إعادة تصور الزمن.[2]",
    "أخبرني بما يهمك أكثر، سوقا أو نمط حياة أو هدفا استثماريا، وسأرشح لك المجتمع الأنسب.",
  ],
  sources: [
    { itemId: "about-odhl", citation: 1 },
    { itemId: "reimagining-time", citation: 2 },
  ],
  followUps: [
    "Which ORA communities suit families in Egypt?",
    "Where can I find apartments near the sea?",
    "How do I invest in Silversands Grenada?",
  ],
  followUpsAr: [
    "ما مجتمعات أورا الأنسب للعائلات في مصر؟",
    "أين أجد شققا قريبة من البحر؟",
    "كيف أستثمر في سيلفرساندز غرينادا؟",
  ],
};

export function findAnswer(question: string): ScriptedAnswer {
  const q = question.toLowerCase();
  let best: ScriptedAnswer | null = null;
  let bestHits = 0;
  for (const a of answers) {
    const hits = a.matchTerms.filter((tm) => q.includes(tm)).length;
    if (hits > bestHits) {
      best = a;
      bestHits = hits;
    }
  }
  return best ?? fallbackAnswer;
}
