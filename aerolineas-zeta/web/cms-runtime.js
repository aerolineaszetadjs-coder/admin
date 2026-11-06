(async()=>{try{const lang=document.documentElement.lang||'ca';const [a,b]=await Promise.all([fetch('/content/'+lang+'.json',{cache:'no-store'}),fetch('/content/design.json',{cache:'no-store'})]);if(!a.ok||!b.ok)return;const c=await a.json(),d=await b.json();for(const [k,v] of Object.entries(c.text||{})){const el=document.querySelector('[data-cms-text="'+k+'"]');if(el)el.textContent=v;}for(const [k,v] of Object.entries(c.images||{})){const el=document.querySelector('[data-cms-image="'+k+'"]');if(el&&v&&v.src){el.src=v.src;el.alt=v.alt||'';}}for(const [k,v] of Object.entries(c.links||{})){const el=document.querySelector('[data-cms-link="'+k+'"]');if(el&&typeof v==='string'&&(/^(https?:|mailto:|#|\/)/i.test(v)))el.setAttribute('href',v);}for(const [k,v] of Object.entries(d.colors||{})){if(/^#[0-9a-f]{3,8}$/i.test(v))document.documentElement.style.setProperty('--'+k,v);}const main=document.querySelector('main');if(main){main.style.display='flex';main.style.flexDirection='column';for(const s of d.sections||[]){const el=main.querySelector('[data-cms-section="'+s.key+'"]');if(el){el.hidden=s.visible===false;el.style.setProperty('display',s.visible===false?'none':'','important');el.style.order=Number.isFinite(Number(s.order))?Number(s.order):0;}}}}catch(e){console.warn('CMS: contingut original conservat',e)}})();

/* Publicacions musicals afegides des de Decap CMS. Les targetes originals es conserven. */
(async function azMusicCatalog(){
  const sections={remix:'#bootlegs .tracks',bootleg:'#bootlegs .tracks',mashup:'#mashups .tracks',mixtape:'#mixtapes .tracks'};
  const palette=['#f6a05f','#7f9bea','#d7e76b','#f18ebc','#8fd6d0','#bca5e6','#f4cc65','#7cc9a1','#eaa28c','#9ab8ee','#e5a5d1','#b9d98a','#edbb78','#a4b1dc'];
  const ink='#201c21';
  const labels={ca:{listen:'Escoltar',close:'Tancar',open:'Obrir a SoundCloud',remix:'Remix',bootleg:'Bootleg',mashup:'Mashup',mixtape:'Mixtape'},es:{listen:'Escuchar',close:'Cerrar',open:'Abrir en SoundCloud',remix:'Remix',bootleg:'Bootleg',mashup:'Mashup',mixtape:'Mixtape'},en:{listen:'Listen',close:'Close',open:'Open on SoundCloud',remix:'Remix',bootleg:'Bootleg',mashup:'Mashup',mixtape:'Mixtape'}};
  const lang=document.documentElement.lang||'ca', tr=labels[lang]||labels.ca;
  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function text(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=value||'';return e;}
  function validUrl(s){try{const u=new URL(s);return u.protocol==='https:'&&(['soundcloud.com','www.soundcloud.com','on.soundcloud.com','youtube.com','www.youtube.com','youtu.be'].includes(u.hostname));}catch{return false;}}
  function embedUrl(s){const u=new URL(s);if(u.hostname.includes('soundcloud.com'))return 'https://w.soundcloud.com/player/?'+new URLSearchParams({url:s,color:'#f747a5',auto_play:'false',hide_related:'true',show_comments:'false',show_user:'true',show_reposts:'false',show_teaser:'false',visual:'false'});
    let id='';if(u.hostname==='youtu.be')id=u.pathname.slice(1).split('/')[0];else if(u.pathname.startsWith('/shorts/'))id=u.pathname.split('/')[2];else if(u.pathname.startsWith('/watch'))id=u.searchParams.get('v')||'';else if(u.pathname.startsWith('/embed/'))id=u.pathname.split('/')[2];return /^[\w-]{11}$/.test(id)?'https://www.youtube-nocookie.com/embed/'+id:null;
  }
  try{
    const res=await fetch('/content/music.json',{cache:'no-store'});if(!res.ok)return;
    const data=await res.json();if(!Array.isArray(data.items))return;
    data.items.forEach((item,index)=>{
      if(!item||item.visible===false||!sections[item.type]||!validUrl(item.url))return;
      const dest=document.querySelector(sections[item.type]);if(!dest)return;
      const embed=embedUrl(item.url);if(!embed)return;
      const title=String(item.title||'').trim(),artist=String(item.artist||'Aerolíneas Zeta').trim();if(!title)return;
      const category=tr[item.type], credit=String(item.credit||'Aerolíneas Zeta');
      const key=[item.type,artist,title].join('|');const automatic=palette[hash(key)%palette.length];
      const color=/^#[0-9a-f]{6}$/i.test(item.color||'')?item.color:automatic;
      const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
      const fg=(rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)<.20?'#f6edda':ink;
      const article=text('article','track');const details=text('details','record');const summary=document.createElement('summary');summary.setAttribute('aria-label',artist+' — '+title);
      const cover=text('div','record-cover motif-'+(hash(key+'motif')%3));cover.style.setProperty('--cover-bg',color);cover.style.setProperty('--cover-fg',fg);
      const top=text('div','record-top');top.append(text('span','',`AZ / ${String(index+10).padStart(2,'0')}`),text('span','',category));
      const mid=text('div','record-type');mid.append(text('span','record-artist',artist),text('h3',title.length>28?'long-title':'',title));
      const bottom=text('div','record-bottom');const by=text('span','',credit);by.append(document.createElement('br'),document.createTextNode(category));
      const listen=text('span','record-listen');listen.append(text('span','closed-label',tr.listen),text('span','open-label',tr.close),text('span','record-icon','+'));bottom.append(by,listen);
      cover.append(top,mid,bottom);summary.append(cover);
      const player=text('div','record-player');const frame=document.createElement('iframe');frame.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');frame.dataset.src=embed;frame.title=artist+' — '+title;frame.width='100%';frame.height=item.url.includes('soundcloud.com')?'166':'250';frame.loading='lazy';player.append(frame);
      const link=text('a','',item.url.includes('soundcloud.com')?tr.open:'YouTube ↗');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';player.append(link);
      const desc=item['description_'+lang];if(desc)player.append(text('p','',desc));
      details.append(summary,player);article.append(details);dest.append(article);
      details.addEventListener('toggle',()=>{if(details.open){document.querySelectorAll('.record[open]').forEach(other=>{if(other!==details)other.open=false;});if(!frame.hasAttribute('src'))frame.src=frame.dataset.src;}else frame.removeAttribute('src');});
    });
  }catch(err){console.warn('CMS: no s’han pogut carregar les noves publicacions',err);}
})();
