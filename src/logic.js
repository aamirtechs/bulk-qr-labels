"use strict";
function parseCSV(text){
  const rows=[]; let row=[], cur="", q=false; const s=String(text||"");
  for(let i=0;i<s.length;i++){ const c=s[i];
    if(q){ if(c==='"'){ if(s[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
    else if(c==='"') q=true;
    else if(c===','){ row.push(cur); cur=""; }
    else if(c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=""; }
    else if(c!=='\r') cur+=c;
  }
  if(cur!==""||row.length){ row.push(cur); rows.push(row); }
  return rows.filter(r=>r.some(c=>String(c).trim()!==""));
}
function rowsToObjects(text){
  const raw=parseCSV(text); if(!raw.length) return {headers:[],rows:[]};
  const headers=raw[0].map(h=>String(h).trim());
  const rows=raw.slice(1).map(cells=>{ const o={}; headers.forEach((h,i)=>{o[h]=String(cells[i]||"").trim();}); return o; });
  return {headers,rows};
}
function sanitizeFilename(name,fallback){
  let s=String(name||"").trim().toLowerCase().replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60);
  if(!s) s=fallback||"qr-code";
  return s;
}
function applyTemplate(template,row){
  return String(template||"").replace(/\{([^}]+)\}/g,(m,key)=>{ const k=key.trim(); return row[k]!==undefined? String(row[k]) : m; });
}
function uniqueFilenames(names){
  const seen={}, out=[];
  for(const n of names){ if(!seen[n]){ seen[n]=1; out.push(n); } else { seen[n]++; out.push(n+"-"+seen[n]); } }
  return out;
}
function buildEntries(rows,encodeCol,filenameCol,template){
  const raw=rows.map((row,i)=>{
    const content= template? applyTemplate(template,row) : String(row[encodeCol]||"");
    const base= filenameCol? sanitizeFilename(row[filenameCol],"qr-"+(i+1)) : "qr-"+(i+1);
    return {content:content.trim(), filename:base, row:i+2};
  });
  const names=uniqueFilenames(raw.map(e=>e.filename));
  raw.forEach((e,i)=>{ e.filename=names[i]; });
  const entries=raw.filter(e=>e.content);
  const skipped=raw.filter(e=>!e.content);
  return {entries,skipped};
}
function buildManifest(entries){
  const esc=v=>{ const s=String(v); return /[",\n]/.test(s)? '"'+s.replace(/"/g,'""')+'"' : s; };
  const lines=["filename,content,status"];
  entries.forEach(e=>lines.push(esc(e.filename+".png")+","+esc(e.content)+","+(e.status||"generated")));
  return lines.join("\n")+"\n";
}
function mmToPt(mm){ return mm*72/25.4; }
const QR_TEMPLATES={
  avery5160:{name:"Avery 5160 (Letter)",pageW:215.9,pageH:279.4,labelW:66.675,labelH:25.4,cols:3,rows:10,marginLeft:4.7625,marginTop:12.7,gapX:3.175,gapY:0},
  avery6460:{name:"Avery 6460 (Letter)",pageW:215.9,pageH:279.4,labelW:66.675,labelH:33.867,cols:3,rows:7,marginLeft:4.7625,marginTop:12.7,gapX:3.175,gapY:0},
  square40:{name:"Square 40mm grid (A4)",pageW:210,pageH:297,labelW:40,labelH:40,cols:4,rows:6,marginLeft:13,marginTop:16,gapX:4,gapY:4}
};
function getQrTemplate(key){ return QR_TEMPLATES[key]||QR_TEMPLATES.avery5160; }
function labelsPerSheet(t){ return t.cols*t.rows; }
function gridPositions(t){
  const out=[];
  for(let r=0;r<t.rows;r++) for(let c=0;c<t.cols;c++) out.push({x:mmToPt(t.marginLeft+c*(t.labelW+t.gapX)), y:mmToPt(t.marginTop+r*(t.labelH+t.gapY)), w:mmToPt(t.labelW), h:mmToPt(t.labelH), row:r, col:c});
  return out;
}
function planPages(count,t){ const per=labelsPerSheet(t); return {perSheet:per, pages: count===0?0:Math.ceil(count/per)}; }
const ECC_LEVELS=["L","M","Q","H"];
function validateEcc(level){ return ECC_LEVELS.includes(String(level||"M").toUpperCase())? String(level).toUpperCase() : null; }
function logoWarning(logoPercent,ecc){
  const p=Number(logoPercent)||0; if(p<=0) return null;
  const safe={L:10,M:15,Q:20,H:25}[validateEcc(ecc)||"M"];
  return p>safe? "Logo covers "+p+"% which exceeds the safe "+safe+"% for error correction "+(validateEcc(ecc)||"M") : null;
}
function verificationSummary(results){
  const total=results.length; const passed=results.filter(r=>r.ok).length;
  return {total,passed,failed:total-passed, allPassed: total>0&&passed===total};
}
const api={parseCSV,rowsToObjects,sanitizeFilename,applyTemplate,uniqueFilenames,buildEntries,buildManifest,mmToPt,QR_TEMPLATES,getQrTemplate,labelsPerSheet,gridPositions,planPages,validateEcc,logoWarning,verificationSummary};
if(typeof module!=="undefined"&&module.exports){module.exports=api;}
if(typeof window!=="undefined"){window.BulkQrLabels=api;}
