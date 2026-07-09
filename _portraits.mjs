/* 下载作曲家肖像到本地 portraits/，生成 portraits.js（window.PORTRAITS）。
 * 目的：中国大陆访问 en.wikipedia.org 不稳定，运行时 JSONP 拉肖像会失败；
 * 改为构建期下载、同源(GitHub Pages)托管，保证肖像稳定显示。
 * 用法：node _portraits.mjs   （node 24 内置 fetch）*/
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const w = {}; global.window = w;
await import("./composers.js");
const BIOS = w.ARTIST_BIOS;

const names = Object.keys(BIOS).filter(n => BIOS[n].born); // 仅个人拉肖像
mkdirSync("portraits", { recursive: true });

const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"")
  .replace(/[^a-zA-Z0-9]+/g,"-").toLowerCase().replace(/^-|-$/g,"");

const sleep = ms => new Promise(r=>setTimeout(r,ms));
const PORTRAITS = {};
let ok=0, miss=0;

for(const name of names){
  const title = (BIOS[name].wiki) || name;
  const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=480&redirects=1&titles=${encodeURIComponent(title)}`;
  let thumb="";
  try{
    const r = await fetch(api, { headers:{ "User-Agent":"1001classical-portrait-fetch/1.0 (popstudy@gmail.com)" }});
    const d = await r.json();
    const pages = d.query.pages;
    const p = pages[Object.keys(pages)[0]];
    thumb = p && p.thumbnail && p.thumbnail.source || "";
  }catch(e){ /* ignore */ }
  if(!thumb){ console.log("MISS", name); miss++; await sleep(120); continue; }
  const ext = (thumb.match(/\.(jpg|jpeg|png)(?:$|\?)/i)||[,"jpg"])[1].toLowerCase().replace("jpeg","jpg");
  const file = `portraits/${slug(name)}.${ext}`;
  try{
    const img = await fetch(thumb, { headers:{ "User-Agent":"1001classical-portrait-fetch/1.0 (popstudy@gmail.com)" }});
    const buf = Buffer.from(await img.arrayBuffer());
    writeFileSync(file, buf);
    PORTRAITS[name] = file;
    ok++;
    if(ok%15===0) console.log("...", ok, "downloaded");
  }catch(e){ console.log("DL-FAIL", name, e.message); miss++; }
  await sleep(120);
}

const banner = "/* 1001 Classical — 作曲家肖像本地路径（window.PORTRAITS，键=作曲家英文名）。\n"+
  " * 构建期由 _portraits.mjs 从 Wikipedia 下载、同源托管，避免运行时跨域失败。自动生成，勿手改。 */\n";
writeFileSync("portraits.js", banner + "window.PORTRAITS = " + JSON.stringify(PORTRAITS, null, 0) + ";\n");
console.log(`\nDONE: ${ok} portraits, ${miss} missing, ${names.length} composers total`);
