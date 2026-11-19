/* Agenda AZ: descàrregues i subscripció, sense inventar hores. */
(()=>{
 const labels={
 ca:{add:'Afegeix al calendari',follow:"Segueix l'agenda d'AZ",missing:'Hora pendent de confirmar',note:"Les actuacions amb hora pendent no s'inclouen encara al calendari."},
 es:{add:'Añadir al calendario',follow:'Sigue la agenda de AZ',missing:'Hora pendiente de confirmar',note:'Los eventos sin hora confirmada todavía no se incluyen en el calendario.'},
 en:{add:'Add to calendar',follow:'Follow AZ events',missing:'Time to be confirmed',note:'Events without a confirmed start time are not yet included in the calendar.'}
 };
 const lang=(document.documentElement.lang||'ca').slice(0,2),t=labels[lang]||labels.ca;
 const valid=i=>/^\d{4}-\d{2}-\d{2}$/.test(i.date||'')&&/^([01]\d|2[0-3]):[0-5]\d$/.test(i.time||'');
 const esc=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const dt=(d,h)=>d.replace(/-/g,'')+'T'+h.replace(':','')+'00';
 function eventIcs(i){
  const url=/^https:\/\//i.test(i.url||'')?i.url:location.origin;
  const uid='az-'+i.date+'-'+i.time+'-'+(i.title||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'@aerolineaszeta.com';
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aerolineas Zeta//Agenda//CA','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),
  'DTSTART;TZID=Europe/Madrid:'+dt(i.date,i.time),'SUMMARY:'+esc('Aerolíneas Zeta · '+i.title),'LOCATION:'+esc([i.venue,i.city].filter(Boolean).join(', ')),'URL:'+url];
  if(/^([01]\d|2[0-3]):[0-5]\d$/.test(i.end_time||''))lines.push('DTEND;TZID=Europe/Madrid:'+dt(i.date,i.end_time));
  return [...lines,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
 }
 function download(i){
  const blob=new Blob([eventIcs(i)],{type:'text/calendar;charset=utf-8'});
  const u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download='aerolineas-zeta-'+i.date+'.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);
 }
 function addButton(article,i){
  if(!valid(i))return;
  const b=document.createElement('button');b.type='button';b.className='az-calendar-add';b.textContent=t.add;
  b.style.cssText='display:inline-flex;align-items:center;justify-content:center;cursor:pointer;margin-top:14px;padding:10px 14px;border:1px solid currentColor;background:transparent;color:inherit;font:600 13px "DM Sans",sans-serif';
  b.addEventListener('click',()=>download(i));article.append(b);
 }
 function subscribe(upcoming){
  if(!upcoming||document.getElementById('az-agenda-follow'))return;
  const wrap=document.createElement('div');wrap.id='az-agenda-follow';wrap.style.cssText='margin:28px 0 12px';
  const a=document.createElement('a');a.textContent=t.follow;a.href='webcal://'+location.host+'/agenda.ics';
  a.style.cssText='display:inline-block;padding:13px 20px;border:1px solid currentColor;background:var(--ink,#201c21);color:var(--paper,#fff);font:700 14px "DM Sans",sans-serif;text-decoration:none';
  const note=document.createElement('p');note.textContent=t.note;note.style.cssText='font-size:12px;opacity:.7;margin:9px 0';
  wrap.append(a,note);upcoming.after(wrap);
 }
 window.AZAgenda={addButton,subscribe};
})();
