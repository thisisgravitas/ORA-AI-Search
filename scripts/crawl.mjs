/* One shot crawler for oradevelopers.com.
   Pulls page copy and imagery into data/crawl.json and downloads the
   best images into public/images. Re-run with: node scripts/crawl.mjs */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "https://oradevelopers.com";

const pages = [
  "/",
  "/about",
  "/properties",
  "/hospitality",
  "/latest-news",
  "/properties/zed-elsheikh-zayed",
  "/properties/zed-east",
  "/properties/silversands-north-coast",
  "/properties/solana-by-ora",
  "/properties/pyramid-hills",
  "/properties/bayn-by-ora",
  "/properties/ayia-napa-marina",
  "/properties/silversands-villas",
  "/properties/eighteen",
  "/properties/madinat-al-ward",
  "/hospitality/silversands-grand-anse",
  "/hospitality/silversands-beach-house",
  "/hospitality/merveilles",
  "/hospitality/mykonos",
  "/latest-news/eighteen-by-ora-welcomes-its-first-resident",
  "/latest-news/eighteen-celebrates-the-opening-of-the-club",
  "/latest-news/yi-hotel-mykonos-opens-in-greece",
  "/latest-news/ora-launches-the-trailer-of-a-journey-through-time",
  "/latest-news/ayia-napa-marina-receives-two-new-distinctions-at-the-luxury-lifestyle-awards-2022",
];

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;|&ndash;/g, ", ");

function extractText(raw) {
  let body = raw.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, " ");
  body = body.replace(/<[^>]+>/g, " ");
  return decode(body).replace(/\s+/g, " ").trim();
}

function extractImages(raw) {
  const urls = new Set();
  for (const m of raw.matchAll(/https:\/\/d3lfybzdo3x59a\.cloudfront\.net\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)/gi)) {
    urls.add(decode(m[0]));
  }
  return [...urls];
}

const results = [];
for (const p of pages) {
  const res = await fetch(BASE + p, { headers: { "user-agent": "Mozilla/5.0 (POC crawl, one shot)" } });
  const raw = await res.text();
  const text = extractText(raw);
  const images = extractImages(raw);
  const h1 = raw.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]?.trim() ?? "";
  results.push({ path: p, status: res.status, h1: decode(h1), textLength: text.length, text: text.slice(0, 4000), images });
  console.log(`${res.status} ${p} · h1: ${h1 || "-"} · ${images.length} images`);
  await new Promise((r) => setTimeout(r, 400));
}

await mkdir("data", { recursive: true });
await writeFile("data/crawl.json", JSON.stringify(results, null, 2));
console.log(`\nWrote data/crawl.json with ${results.length} pages`);
