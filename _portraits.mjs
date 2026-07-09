/* 下载作曲家 + 名家（指挥/独奏/歌唱家）肖像到本地 portraits/，生成 portraits.js（window.PORTRAITS）。
 * 目的：中国大陆访问 en.wikipedia.org 不稳定，运行时 JSONP 拉肖像会失败；
 * 改为构建期下载、同源(GitHub Pages)托管，保证肖像稳定显示。
 * 仅个人拉肖像（乐团/合唱/四重奏等合奏体保留字母徽章）。
 * 用法：node _portraits.mjs   （node 24 内置 fetch）*/
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const w = {}; global.window = w;
await import("./composers.js");
await import("./data.js");
const BIOS = w.ARTIST_BIOS, ALBUMS = w.ALBUMS;

// 1) 作曲家（有生年者 = 个人）
const composerNames = Object.keys(BIOS).filter(n => BIOS[n].born);

// 2) 名家：从 perf 拆出、收录≥2 张、且非合奏体（乐团/合唱/四重奏…）
const perfList = a => String(a.perf||"").split("·").map(s=>s.trim()).filter(Boolean);
const ENS = /Philharmoni|Symphony|Orchestra|Choir|Chor\b|Ensemble|Consort|Quartet|Concert\b|Soloists|Academy|Capp|Musici|Antiqua|Players|Band|Festival|Singers|Scholars|Florissants|Octet|Trio|Cast|Radio|Köln/i;
const pc = {};
ALBUMS.forEach(a => perfList(a).forEach(p => pc[p] = (pc[p]||0)+1));
const performerNames = Object.keys(pc).filter(n => pc[n] >= 2 && !ENS.test(n));

// 名家名 → Wikipedia 标题的少量修正（同名消歧 / 常见拼写）
const WIKI = {
  "Karl Richter": "Karl Richter (conductor)",
  "Charles Munch": "Charles Munch (conductor)",
  "William Christie": "William Christie (musician)"
};

const targets = [...new Set([...composerNames, ...performerNames])];
mkdirSync("portraits", { recursive: true });

const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"")
  .replace(/[^a-zA-Z0-9]+/g,"-").toLowerCase().replace(/^-|-$/g,"");
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const UA = { "User-Agent":"1001classical-portrait-fetch/1.0 (popstudy@gmail.com)" };

const PORTRAITS = {};
let ok=0, miss=0, skipped=0;
const missing = [];

for(const name of targets){
  const title = WIKI[name] || (BIOS[name] && BIOS[name].wiki) || name;
  let thumb="";
  try{
    const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=480&redirects=1&titles=${encodeURIComponent(title)}`;
    const d = await (await fetch(api, { headers: UA })).json();
    const pages = d.query.pages, p = pages[Object.keys(pages)[0]];
    thumb = p && p.thumbnail && p.thumbnail.source || "";
  }catch(e){ /* ignore */ }
  if(!thumb){ missing.push(name); miss++; await sleep(100); continue; }
  const ext = (thumb.match(/\.(jpg|jpeg|png)(?:$|\?)/i)||[,"jpg"])[1].toLowerCase().replace("jpeg","jpg");
  const file = `portraits/${slug(name)}.${ext}`;
  if(existsSync(file)){ PORTRAITS[name]=file; skipped++; continue; } // 已下载则跳过下载，仍记录
  try{
    const buf = Buffer.from(await (await fetch(thumb, { headers: UA })).arrayBuffer());
    writeFileSync(file, buf);
    PORTRAITS[name] = file; ok++;
    if(ok%15===0) console.log("...", ok, "downloaded");
  }catch(e){ console.log("DL-FAIL", name, e.message); miss++; }
  await sleep(100);
}

const banner = "/* 1001 Classical — 作曲家 + 名家肖像本地路径（window.PORTRAITS，键=英文名）。\n"+
  " * 构建期由 _portraits.mjs 从 Wikipedia 下载、同源托管，避免运行时跨域失败。自动生成，勿手改。 */\n";
writeFileSync("portraits.js", banner + "window.PORTRAITS = " + JSON.stringify(PORTRAITS, null, 0) + ";\n");
console.log(`\nDONE: ${Object.keys(PORTRAITS).length} portraits (${ok} new, ${skipped} cached), ${miss} missing`);
console.log(`  composers: ${composerNames.length}, performers(person,>=2): ${performerNames.length}`);
if(missing.length) console.log("  MISSING:", missing.join(", "));
