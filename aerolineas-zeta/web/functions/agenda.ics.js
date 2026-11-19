// Cloudflare Pages Function: calendari subscrivible generat de sessions.json
export async function onRequestGet({request,env}){
 const asset=await env.ASSETS.fetch(new URL('/content/sessions.json',request.url));
 if(!asset.ok)return new Response('Agenda unavailable',{status:503});
 const data=await asset.json();
 const valid=i=>i&&i.visible!==false&&/^\d{4}-\d{2}-\d{2}$/.test(i.date||'')&&/^([01]\d|2[0-3]):[0-5]\d$/.test(i.time||'')&&i.title;
 const escape=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const dt=(d,h)=>d.replace(/-/g,'')+'T'+h.replace(':','')+'00';
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aerolineas Zeta//Agenda//CA','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Aerolíneas Zeta · Agenda','X-WR-TIMEZONE:Europe/Madrid','REFRESH-INTERVAL;VALUE=DURATION:PT6H'];
 for(const i of (data.items||[]).filter(valid).filter(i=>i.date>=today)){
  const uid='az-'+i.date+'-'+i.time+'-'+i.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'@aerolineaszeta.com';
  const url=/^https:\/\//i.test(i.url||'')?i.url:new URL('/',request.url).href;
  lines.push('BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),
   'DTSTART;TZID=Europe/Madrid:'+dt(i.date,i.time),'SUMMARY:'+escape('Aerolíneas Zeta · '+i.title),
   'LOCATION:'+escape([i.venue,i.city].filter(Boolean).join(', ')),'URL:'+url);
  if(/^([01]\d|2[0-3]):[0-5]\d$/.test(i.end_time||''))lines.push('DTEND;TZID=Europe/Madrid:'+dt(i.date,i.end_time));
  lines.push('END:VEVENT');
 }
 lines.push('END:VCALENDAR','');
 return new Response(lines.join('\r\n'),{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'inline; filename="aerolineas-zeta-agenda.ics"','Cache-Control':'public, max-age=300','Access-Control-Allow-Origin':'*'}});
}
