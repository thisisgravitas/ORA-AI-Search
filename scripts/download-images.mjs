/* Downloads curated imagery from the live ORA site into public/images.
   Re-run with: node scripts/download-images.mjs */

import { writeFile, mkdir } from "node:fs/promises";

const CDN = "https://d3lfybzdo3x59a.cloudfront.net/website-assets/";

const map = {
  /* Communities and destinations */
  "zed-elsheikh-zayed.jpg": "zed-el-sheikh-zayed-web.jpg",
  "zed-park.jpg": "view21.jpg",
  "zed-strip.jpg": "View-11.jpg",
  "zed-towers.jpg": "view1.jpg",
  "zed-sports.jpg": "View-12.jpg",
  "zed-east.jpg": "2011_0820_Cam_06_01_0050.jpg",
  "zed-east-apartments.jpg": "APARTMENTS-CAM-08-.-NO-PEOPLE.jpg",
  "zed-academy.jpg": "APARTMENTS-CAM-10-.-NO-PEOPLE.jpg",
  "silversands-north-coast.jpg": "silversands-north-coast.jpg",
  "silversands-nc-dusk.jpg": "2B-Back-Dusk-m4-FINAL.jpg",
  "silversands-beach-club.jpg": "4-Back-m1-s.jpg",
  "solana.jpg": "solana-by-ora-web-2.jpg",
  "pyramid-hills.jpg": "FMD00141.JPG",
  "bayn.jpg": "bayn-web-1.jpg",
  "bayn-shore.jpg": "bayn-web-4.jpg",
  "bayn-wellness.jpg": "bayn-web-3.jpg",
  "ayia-napa-marina.jpg": "ayia-napa-marina---web.jpg",
  "anm-hero.jpg": "ayia-napa-marina---web-2.jpg",
  "anm-towers.jpg": "anm-may-2023--62.jpg",
  "anm-yacht-club.jpg": "r6__7340.jpg",
  "anm-events.jpg": "anm-may-2023--54.jpg",
  "silversands-villas.jpg": "DJI_0540-HIGH.jpg",
  "silversands-grand-anse.jpg": "untitled-11.jpg",
  "silversands-beach-house.jpg": "back-of-property.jpg",
  "merveilles.jpg": "main-entrance.jpg",
  "mykonos.jpg": "silversands-mykonos.jpg",
  "eighteen.jpg": "1724_1127_PhysCameraANIM_02_Parkway_Aerial.jpg",
  "eighteen-club.jpg": "1724_1127_PhysCamera27_Gatehouse_Aerial.jpg",
  "eighteen-villas.jpg": "1724_1127_PhysCamera43-AERIAL-OF-PHASE-002.jpg",
  "eighteen-hero.jpg": "eighteen-web.jpg",
  "madinat-al-ward.jpg": "cgi-03-–-park-semi-aerial-evening.jpg",
  "maw-park.jpg": "parkfront-resi.jpg",
  "about.jpg": "Image1.jpg",
  "hospitality-cover.jpg": "Hospitalitycoverphoto.jpg",

  /* News */
  "news-maw.jpg": "iraq-1.jpg",
  "news-bayn.jpg": "bayn-5.jpg",
  "news-merveilles.jpg": "whatsapp-image-2024-09-24-at-12.38.06-pm.jpeg",
  "news-afreximbank.jpg": "agreement-1.jpg",
  "news-eighteen-resident.jpg": "1688832116594.jpg.jpg",
  "news-eighteen-club.jpg": "eighteen-1.png",
  "news-yi-mykonos.jpg": "iiki.png",
  "news-trailer.jpg": "maxresdefault.jpg",
};

await mkdir("public/images", { recursive: true });

/* Brand logo from the live site */
const logo = await fetch("https://oradevelopers.com/_nuxt/img/ora-logo-greyer.52c8cfb.png");
await writeFile("public/images/ora-logo.png", Buffer.from(await logo.arrayBuffer()));
console.log("ok ora-logo.png");

for (const [local, remote] of Object.entries(map)) {
  const url = CDN + encodeURI(remote);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (POC asset fetch)" } });
  if (!res.ok) {
    console.log(`FAIL ${res.status} ${local} <- ${remote}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(`public/images/${local}`, buf);
  console.log(`ok ${local} (${Math.round(buf.length / 1024)} KB)`);
  await new Promise((r) => setTimeout(r, 150));
}
