import {chromium} from "@playwright/test";
import {PNG} from "pngjs";
import pixelmatch from "pixelmatch";
import {spawn} from "node:child_process";
import {mkdir,writeFile} from "node:fs/promises";
const routes=["/","/work","/services","/pricing","/about","/journal","/contact"];
const widths=[375,768,1440];
const dir="visual-audit";await mkdir(dir,{recursive:true});
const server=spawn("npx",["serve","-s",".","-l","3010"],{stdio:"ignore"});
async function ready(){for(let i=0;i<60;i++){try{const r=await fetch("http://127.0.0.1:3010");if(r.ok)return}catch{}await new Promise(ok=>setTimeout(ok,500))}throw new Error("Local server unavailable")}
const results=[];let browser;
try{
 await ready();browser=await chromium.launch({headless:true});
 for(const width of widths){const context=await browser.newContext({viewport:{width,height:900},reducedMotion:"reduce",deviceScaleFactor:1});
 const source=await context.newPage(),target=await context.newPage();
 for(const route of routes){const id=(route==="/"?"home":route.slice(1)).replaceAll("/","_")+"_"+width;
 try{
 const [a,b]=await Promise.all([source.goto("https://cobalt-web.framer.website"+route,{waitUntil:"domcontentloaded",timeout:30000}),target.goto("http://127.0.0.1:3010"+route,{waitUntil:"domcontentloaded",timeout:30000})]);
 if(!a?.ok()||!b?.ok())throw new Error("Response: reference="+a?.status()+" local="+b?.status());
 await source.waitForTimeout(1300);await target.waitForTimeout(350);
 const s=PNG.sync.read(await source.screenshot({animations:"disabled"}));const t=PNG.sync.read(await target.screenshot({animations:"disabled"}));
 if(s.width!==t.width||s.height!==t.height)throw new Error("Viewport dimension mismatch");
 const diff=new PNG({width:s.width,height:s.height});
 const pixels=pixelmatch(s.data,t.data,diff.data,s.width,s.height,{threshold:.12,includeAA:false});
 await writeFile(dir+"/"+id+"_difference.png",PNG.sync.write(diff));
 results.push({route,width,referenceStatus:a.status(),localStatus:b.status(),differentPixels:pixels,percentage:Number((pixels/(s.width*s.height)*100).toFixed(2)),state:"measured"});
 console.log("VISUAL",route,width,"different="+(pixels/(s.width*s.height)*100).toFixed(2)+"%");
 }catch(e){results.push({route,width,state:"not measured",error:String(e.message||e)});console.log("VISUAL UNVERIFIED",route,width,String(e.message||e))}}
 await context.close()}
}finally{if(browser)await browser.close();server.kill("SIGTERM");await writeFile(dir+"/report.json",JSON.stringify({reference:"https://cobalt-web.framer.website",local:"http://127.0.0.1:3010",date:new Date().toISOString(),results},null,2))}
if(!results.some(x=>x.state==="measured"))process.exitCode=1;
