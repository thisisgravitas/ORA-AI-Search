/* Distils the crawled page text into per item detail blocks for the RAG
   context, including the Product Mix tables (land area, unit counts,
   hotels, lagoons, retail). Writes data/details.json.
   Re-run after scripts/crawl.mjs with: node scripts/extract-details.mjs */

import { readFile, writeFile } from "node:fs/promises";

const pathToItem = {
  "/properties/zed-elsheikh-zayed": "zed-sheikh-zayed",
  "/properties/zed-east": "zed-east",
  "/properties/silversands-north-coast": "silversands-north-coast",
  "/properties/solana-by-ora": "solana",
  "/properties/pyramid-hills": "pyramid-hills",
  "/properties/bayn-by-ora": "bayn",
  "/properties/ayia-napa-marina": "ayia-napa-marina",
  "/properties/silversands-villas": "silversands-villas-grenada",
  "/properties/eighteen": "eighteen",
  "/properties/madinat-al-ward": "madinat-al-ward",
  "/hospitality/silversands-grand-anse": "silversands-grand-anse",
  "/hospitality/silversands-beach-house": "silversands-beach-house",
  "/hospitality/merveilles": "merveilles",
  "/hospitality/mykonos": "yi-mykonos",
  "/about": "about-odhl",
};

function clean(text) {
  let t = text;
  /* Strip the site chrome that precedes the page copy */
  const lastContact = t.lastIndexOf("Contact Us");
  if (lastContact > -1 && lastContact < 400) t = t.slice(lastContact + "Contact Us".length);
  /* Strip footer blocks and gallery controls */
  for (const marker of ["For more info", "download brochure PROPERTIES", "ⓒ Copyrights"]) {
    const i = t.indexOf(marker);
    if (i > -1) t = t.slice(0, i);
  }
  t = t.replace(/view all pictures\s*×?/gi, " ").replace(/\+\d+\s/g, " ");
  return t.replace(/\s+/g, " ").trim().slice(0, 2600);
}

const crawl = JSON.parse(await readFile("data/crawl.json", "utf8"));
const details = {};
for (const page of crawl) {
  const itemId = pathToItem[page.path];
  if (!itemId) continue;
  details[itemId] = clean(page.text);
}

await writeFile("data/details.json", JSON.stringify(details, null, 2));
console.log(`Wrote data/details.json with ${Object.keys(details).length} entries`);
for (const [id, text] of Object.entries(details)) {
  console.log(` ${id}: ${text.length} chars${text.includes("Product Mix") ? " (incl. Product Mix)" : ""}`);
}
