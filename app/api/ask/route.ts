import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { search } from "@/lib/search";
import { findAnswer } from "@/lib/answers";
import details from "@/data/details.json";
import type { AnswerSource, ScriptedAnswer } from "@/lib/types";

/* Full crawled page copy per destination, including Product Mix tables
   (land area, unit counts, hotels, lagoons, retail) */
const detailById = details as Record<string, string>;

/* Live RAG endpoint. Retrieval runs in process over the crawled content
   (the Optimizely Graph stand in); generation calls Claude (the Opal AI
   stand in). Falls back to scripted answers when no key is configured or
   the call fails, so the demo cannot die mid pitch. */

export const maxDuration = 60;

const answerSchema = {
  type: "object" as const,
  properties: {
    paragraphs: {
      type: "array" as const,
      description:
        "One to two short answer paragraphs. Cite sources inline with [n] markers placed after punctuation.",
      items: { type: "string" as const },
    },
    follow_ups: {
      type: "array" as const,
      description: "Three short follow up questions the visitor might ask next.",
      items: { type: "string" as const },
    },
  },
  required: ["paragraphs", "follow_ups"],
  additionalProperties: false,
};

export async function POST(req: Request) {
  const { question, lang } = (await req.json()) as {
    question?: string;
    lang?: "en" | "ar";
  };

  if (!question?.trim()) {
    return NextResponse.json({ error: "question required" }, { status: 400 });
  }

  const scripted = findAnswer(question);

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ source: "scripted", answer: scripted });
  }

  try {
    const retrieved = search(question).slice(0, 6);
    if (retrieved.length === 0) {
      return NextResponse.json({ source: "scripted", answer: scripted });
    }

    const sources: AnswerSource[] = retrieved.map((r, i) => ({
      itemId: r.item.id,
      citation: i + 1,
    }));

    const context = retrieved
      .map((r, i) => {
        const detail = detailById[r.item.id];
        return `[${i + 1}] ${r.item.title} (${r.item.type}, ${r.item.market}, ${r.item.opco})\n${detail ?? r.item.snippet}`;
      })
      .join("\n\n");

    const client = new Anthropic();
    const response = await client.messages.create(
      {
        model: "claude-opus-4-8",
        max_tokens: 2048,
        output_config: {
          effort: "low",
          format: { type: "json_schema", schema: answerSchema },
        },
        system: [
          "You are ORA AI, the concierge assistant on the ORA Developers Super Site.",
          "Answer only from the numbered sources provided. Cite with [n] markers placed after punctuation, like: ...on the Mediterranean.[1]",
          "Write one or two short paragraphs in a confident, plain, premium tone. British and Gulf English conventions. Never use em dashes.",
          "Answer in the same language as the question (English or Arabic).",
          "If the sources do not cover the question, say so briefly and point to the closest relevant destination.",
        ].join(" "),
        messages: [
          {
            role: "user",
            content: `Question (${lang === "ar" ? "Arabic" : "English"}): ${question}\n\nSources:\n${context}`,
          },
        ],
      },
      { timeout: 45_000 },
    );

    const textBlock = response.content.find((b) => b.type === "text");
    if (response.stop_reason === "refusal" || !textBlock) {
      return NextResponse.json({ source: "scripted", answer: scripted });
    }

    const parsed = JSON.parse(textBlock.text) as {
      paragraphs: string[];
      follow_ups: string[];
    };

    /* Keep only sources the answer actually cites, in citation order */
    const citedNumbers = new Set(
      parsed.paragraphs.flatMap((p) => [...p.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1]))),
    );
    const usedSources = sources.filter((s) => citedNumbers.has(s.citation));

    const answer: ScriptedAnswer = {
      id: `live-${Date.now()}`,
      matchTerms: [],
      question,
      body: parsed.paragraphs,
      sources: usedSources.length ? usedSources : sources.slice(0, 3),
      followUps: parsed.follow_ups.slice(0, 3),
    };

    return NextResponse.json({ source: "live", answer });
  } catch {
    return NextResponse.json({ source: "scripted", answer: scripted });
  }
}
