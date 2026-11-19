/* Decap custom widget: visual crop editor, stored as JSON string. */
(function(){
'use strict';
const React=window.React, CMS=window.CMS;
if(!React||!CMS){console.warn('AZ crop widget: Decap/React unavailable');return}
const h=React.createElement;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
function parse(value){try{const x=JSON.parse(value||'{}');return {x:clamp(x.x??50,0,100),y:clamp(x.y??50,0,100),zoom:clamp(x.zoom??1,1,3)}}catch(e){return{x:50,y:50,zoom:1}}}
function Control(props){
 const v=typeof props.value==='string'?props.value:props.value?.toString?.()||'';
 const state=parse(v),[source,setSource]=React.useState(''),[drag,setDrag]=React.useState(null);
 const frame=React.useRef(null);
 const commit=(patch)=>props.onChange(JSON.stringify({...state,...patch}));
 const id=String(props.forID||'');
 const match=id.match(/(?:main|access)[-_]slides[-_](\d+)/i);
 const slideIndex=match?Number(match[1]):null;
 const entry=props.entry;
 let slide;
 try{const data=entry?.get('data');const group=id.includes('access')?'access':'main';slide=data?.getIn([group,'slides',slideIndex]);}catch(e){}
 const src=source||slide?.get?.('mobile_src')||slide?.get?.('src')||'';
 const img=typeof src==='string'?src:'';
 const imgUrl=img.startsWith('/assets/')?img:img;
 function start(e){e.currentTarget.setPointerCapture(e.pointerId);setDrag({x:e.clientX,y:e.clientY,px:state.x,py:state.y});}
 function move(e){if(!drag||!frame.current)return;const r=frame.current.getBoundingClientRect();commit({x:clamp(drag.px+(e.clientX-drag.x)/r.width*100,0,100),y:clamp(drag.py+(e.clientY-drag.y)/r.height*100,0,100)});}
 const control=(name,value,min,max,step,change)=>h('label',{style:{display:'grid',gap:4,fontSize:12}},name+' · '+value,h('input',{type:'range',min,max,step,value,onChange:e=>change(Number(e.target.value)),style:{width:'100%'}}));
 return h('div',{style:{padding:'12px',border:'1px solid #ddd',borderRadius:10,maxWidth:380,background:'#fff',color:'#222'}},
 h('div',{style:{fontWeight:700,marginBottom:8}},'Plantilla mòbil · 9:16'),
 h('div',{ref:frame,onPointerDown:start,onPointerMove:move,onPointerUp:()=>setDrag(null),onPointerCancel:()=>setDrag(null),style:{width:225,height:400,maxWidth:'100%',position:'relative',overflow:'hidden',background:'#111',borderRadius:12,touchAction:'none',cursor:'grab',margin:'0 auto 12px'}},
 img?h('img',{src:imgUrl,alt:'Previsualització',draggable:false,style:{width:'100%',height:'100%',objectFit:'cover',objectPosition:state.x+'% '+state.y+'%',transform:'scale('+state.zoom+')',transformOrigin:'center',pointerEvents:'none',userSelect:'none'}}):h('div',{style:{color:'#fff',padding:20,fontSize:13}},'Carrega una fotografia al camp superior o indica la ruta a continuació.'),
 h('div',{style:{position:'absolute',inset:0,pointerEvents:'none',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:12,background:'linear-gradient(transparent 45%,#0009)',color:'#fff'}},h('b',{style:{fontSize:25,lineHeight:1}},'AEROLÍNEAS ZETA'),h('span',{style:{fontSize:10,marginTop:10}},'Groovy Mixes since 2007'),h('span',{style:{background:'#ef4f8e',color:'#111',borderRadius:24,padding:9,fontSize:11,marginTop:12}},'Escolta el nostre univers'))),
 h('p',{style:{fontSize:11,color:'#666'}},'Arrossega la fotografia per enquadrar. Si la vista prèvia no carrega la imatge del carrusel, enganxa la ruta /assets/... aquí:'),
 h('input',{type:'text',value:source,onChange:e=>setSource(e.target.value),placeholder:img||'/assets/fotografia.webp',style:{boxSizing:'border-box',width:'100%',padding:8,marginBottom:12,border:'1px solid #ccc',borderRadius:4}}),
 control('Zoom',state.zoom,1,3,.05,z=>commit({zoom:z})),
 control('Horitzontal',state.x,0,100,1,x=>commit({x})),
 control('Vertical',state.y,0,100,1,y=>commit({y})),
 h('button',{type:'button',onClick:()=>commit({x:50,y:50,zoom:1}),style:{marginTop:12,padding:'7px 12px',border:'1px solid #aaa',borderRadius:5,background:'#fff'}},'Restablir enquadrament')
 );
}
CMS.registerWidget('azMobileCrop',Control);
})();
