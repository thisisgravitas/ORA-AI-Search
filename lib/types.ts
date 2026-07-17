/* Shapes mirror a flattened Optimizely Graph GraphQL result so the
   production swap is a query change, not a UI change. */

export type ContentType =
  | "Community"
  | "Venue"
  | "Market"
  | "News"
  | "Event"
  | "Careers"
  | "Page";

export type Opco =
  | "ORA Egypt"
  | "ORA UAE"
  | "ORA Cyprus"
  | "ORA Grenada"
  | "ORA Pakistan"
  | "ORA Iraq"
  | "ORA Hospitality"
  | "ODHL Group";

export type Market =
  | "Egypt"
  | "UAE"
  | "Cyprus"
  | "Grenada"
  | "Pakistan"
  | "Iraq"
  | "Greece"
  | "Group";

export type Vertical =
  | "Residential"
  | "Hospitality"
  | "Marina"
  | "Retail"
  | "Education"
  | "Corporate";

export type Segment = "all" | "investor" | "resident" | "firstTime";

export interface GraphItem {
  id: string;
  title: string;
  titleAr?: string;
  type: ContentType;
  opco: Opco;
  market: Market;
  vertical: Vertical;
  languages: ("en" | "ar")[];
  snippet: string;
  snippetAr?: string;
  /* Live page on oradevelopers.com */
  url: string;
  /* Local copy of imagery pulled from the live site */
  image?: string;
  /* Publication date for news and events */
  date?: string;
  /* Editorial boost set by the business, 0 to 10 */
  boost: number;
  /* Base relevance the mock engine starts from, 0 to 1 */
  relevance: number;
  /* Keywords the semantic layer matches beyond the visible copy */
  tags: string[];
  /* Gradient stops for the imagery placeholder */
  palette: [string, string];
  /* Per segment lift applied by the personalisation layer */
  segmentBoost?: Partial<Record<Exclude<Segment, "all">, number>>;
  /* Reframed snippet shown when a segment is active */
  segmentNote?: Partial<Record<Exclude<Segment, "all">, string>>;
}

export interface AnswerSource {
  itemId: string;
  citation: number;
}

export interface ScriptedAnswer {
  id: string;
  matchTerms: string[];
  question: string;
  questionAr?: string;
  /* Paragraphs; [n] markers become citation chips */
  body: string[];
  bodyAr?: string[];
  sources: AnswerSource[];
  followUps: string[];
  followUpsAr?: string[];
}
