/* Common Mix-Ups: Exam 1 & 2 review. Nelu Radpour, NeuroSims. MIT license. */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
const $=id=>document.getElementById(id);
const C={ink:'#2a2a2a',muted:'#646a72',blue:'#1f6fd1',red:'#c8343f',green:'#2a8a4c',orange:'#e4572e',gold:'#f2a900',
  purple:'#7b4fb3',teal:'#16898f',pink:'#d4508a',line:'#e2ddd2',cream:'#fbf6ea',hand:'"Segoe Print","Ink Free","Noteworthy","Chalkboard SE","Bradley Hand","Comic Sans MS",cursive'};
const REDUCE=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function S(tag,a,p){const e=document.createElementNS(NS,tag);if(a)for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function T(x,y,txt,a,p){const t=S('text',Object.assign({x:x,y:y,'font-size':14,fill:C.ink},a||{}),p);t.textContent=txt;return t;}
function arrowDef(svg,id,color){let d=svg.querySelector('defs')||S('defs',null,svg);
  const m=S('marker',{id:id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'},d); if(id==='kA'){m.setAttribute('markerUnits','userSpaceOnUse');m.setAttribute('markerWidth',26);m.setAttribute('markerHeight',26);}
  S('path',{d:'M0,0 L10,5 L0,10 z',fill:color},m);return 'url(#'+id+')';}
function tween(ms,fn,done){const t0=performance.now();if(REDUCE)ms=1;
  function f(now){const k=Math.min(1,(now-t0)/ms);fn(k);if(k<1)requestAnimationFrame(f);else if(done)done();}requestAnimationFrame(f);}
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
function along(path,k){const L=path.getTotalLength();return path.getPointAtLength(k*L);}
function pressGroup(btns,onPick){btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.setAttribute('aria-pressed',x===b));onPick(b);}));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function onVisible(el,start,stop){if(!('IntersectionObserver'in window)){start();return;}
  new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?start():stop&&stop())).observe(el);}

/* ============ 1. Afferent / efferent ============ */
{
  const svg=$('affSvg');
  const aB=arrowDef(svg,'aB',C.blue), aG=arrowDef(svg,'aG',C.green);
  S('rect',{x:30,y:60,width:130,height:62,rx:14,fill:'#f9dcc4',stroke:'#b98b6a','stroke-width':1.5},svg);
  T(95,88,'skin',{'text-anchor':'middle','font-size':15},svg);
  T(95,108,'(sensory receptor)',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  const stove=S('rect',{x:30,y:140,width:130,height:26,rx:6,fill:'#e9e4da',stroke:'#999'},svg);
  const stoveT=T(95,158,'stove',{'text-anchor':'middle','font-size':13},svg);
  S('rect',{x:300,y:45,width:160,height:120,rx:18,fill:'#eef3fb',stroke:C.blue,'stroke-width':1.5},svg);
  T(380,75,'CNS',{'text-anchor':'middle','font-size':18,'font-weight':700},svg);
  T(380,95,'(spinal cord)',{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);
  const muscle=S('ellipse',{cx:680,cy:110,rx:58,ry:30,fill:'#f3b8b0',stroke:'#a5544a','stroke-width':1.5},svg);
  T(680,115,'muscle',{'text-anchor':'middle','font-size':14},svg);
  const pA=S('path',{d:'M160,85 C215,62 255,70 300,88',fill:'none',stroke:C.blue,'stroke-width':4,'marker-end':aB},svg);
  const pI=S('path',{d:'M318,100 C350,120 410,130 442,130',fill:'none',stroke:'#8b8b8b','stroke-width':2.5,'stroke-dasharray':'5 5'},svg);
  const pE=S('path',{d:'M460,130 C530,150 575,140 620,118',fill:'none',stroke:C.green,'stroke-width':4,'marker-end':aG},svg);
  T(228,46,'AFFERENT = arrives',{'text-anchor':'middle','font-size':15,'font-weight':700,fill:C.blue},svg);
  T(228,30,'sensory, toward the CNS',{'text-anchor':'middle','font-size':12.5,fill:C.blue},svg);
  T(545,180,'EFFERENT = exits',{'text-anchor':'middle','font-size':15,'font-weight':700,fill:C.green},svg);
  T(545,198,'motor, away from the CNS',{'text-anchor':'middle','font-size':12.5,fill:C.green},svg);
  const dot=S('circle',{r:8,fill:C.gold,stroke:C.ink,'stroke-width':1.5,opacity:0},svg);
  let busy=false;
  $('affGo').addEventListener('click',()=>{ if(busy)return; busy=true;
    stove.setAttribute('fill','#f08a4b'); stoveT.textContent='HOT stove!';
    dot.setAttribute('opacity',1);
    const run=(p,ms,next)=>tween(ms,k=>{const q=along(p,k);dot.setAttribute('cx',q.x);dot.setAttribute('cy',q.y);},next);
    run(pA,900,()=>run(pI,500,()=>run(pE,900,()=>{
      tween(500,k=>{const s=Math.sin(k*Math.PI);muscle.setAttribute('rx',58-14*s);muscle.setAttribute('ry',30+9*s);},()=>{
        dot.setAttribute('opacity',0);stove.setAttribute('fill','#e9e4da');stoveT.textContent='stove';busy=false;});
    })));
  });
}

/* ============ 1b. Breathing ============ */
{
  const svg=$('breathSvg');
  const box=(x,y,w,h,t1,t2,col)=>{S('rect',{x,y,width:w,height:h,rx:14,fill:'#fff',stroke:col,'stroke-width':2},svg);
    T(x+w/2,y+h/2-3,t1,{'text-anchor':'middle','font-size':15.5,'font-weight':700,fill:col},svg);
    T(x+w/2,y+h/2+16,t2,{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);};
  box(20,25,240,64,'Motor cortex','voluntary: hold, talk, sing',C.purple);
  box(20,205,240,64,'Brainstem (medulla + pons)','automatic rhythm, senses CO₂',C.teal);
  box(320,115,215,72,'Phrenic motor neurons','spinal cord C3–C5 · somatic',C.ink);
  const pC=S('path',{d:'M260,57 C300,57 290,138 320,138',fill:'none','stroke-width':5,'stroke-linecap':'round'},svg);
  const pB=S('path',{d:'M260,237 C300,237 290,164 320,164',fill:'none','stroke-width':5,'stroke-linecap':'round'},svg);
  const pM=S('path',{d:'M535,151 L592,151',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linecap':'round'},svg);
  const xMark=T(296,108,'✗',{'font-size':26,fill:C.red,opacity:0,'text-anchor':'middle'},svg);
  S('rect',{x:598,y:30,width:150,height:250,rx:40,fill:'#fbf6ea',stroke:'#b8ad99','stroke-width':1.5},svg);
  const lungL=S('ellipse',{cx:643,cy:118,rx:26,ry:56,fill:'#f6d3d8',stroke:'#c98f99'},svg);
  const lungR=S('ellipse',{cx:703,cy:118,rx:26,ry:56,fill:'#f6d3d8',stroke:'#c98f99'},svg);
  const dia=S('path',{fill:'none',stroke:C.red,'stroke-width':6,'stroke-linecap':'round'},svg);
  T(673,232,'diaphragm',{'text-anchor':'middle','font-size':13.5,fill:C.red,'font-weight':700},svg);
  T(673,250,'(skeletal muscle)',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  const TX={
    auto:'<b>Asleep:</b> the brainstem generates the rhythm by itself and drives the phrenic motor neurons. You never think about it.',
    hold:'<b>Holding your breath:</b> the motor cortex takes over the <i>same</i> phrenic motor neurons and keeps the diaphragm still. That is voluntary control of a somatic pathway.',
    talk:'<b>Talking or singing:</b> the cortex shapes each breath (quick in, long controlled out) on top of the brainstem\'s rhythm.',
    co2:'<b>Held too long:</b> CO₂ builds up and the brainstem\'s chemoreceptors fire hard enough to override the cortex. You gasp. The automatic system always wins in the end.'};
  let mode='auto', ph=0, last=performance.now(), off=0, running=false;
  function style(){
    const on=(p,col)=>{p.setAttribute('stroke',col);p.setAttribute('stroke-dasharray','10 8');p.setAttribute('opacity',1);};
    const dim=p=>{p.setAttribute('stroke','#c9c3b6');p.setAttribute('stroke-dasharray','none');p.setAttribute('opacity',.8);};
    if(mode==='auto'){dim(pC);on(pB,C.teal);} else if(mode==='hold'){on(pC,C.purple);dim(pB);}
    else if(mode==='talk'){on(pC,C.purple);on(pB,C.teal);} else {dim(pC);on(pB,C.teal);}
    xMark.setAttribute('opacity',mode==='co2'?1:0);
    $('breathTxt').innerHTML=TX[mode];
  }
  function frame(now){ if(!running)return; const dt=(now-last)/1000; last=now;
    let rate=mode==='auto'?.33:mode==='talk'?.22:mode==='co2'?.75:0; ph+=dt*rate*2*Math.PI;
    let s; if(mode==='hold') s=.85; else if(mode==='talk'){const c=(ph%(2*Math.PI))/(2*Math.PI); s=c<.2?c/.2:1-(c-.2)/.8;} else s=(1-Math.cos(ph))/2;
    const y=150+ s*45; dia.setAttribute('d','M606,'+(y+30)+' Q673,'+y+' 740,'+(y+30));
    lungL.setAttribute('ry',50+s*14);lungR.setAttribute('ry',50+s*14);
    off-=dt*30; [pC,pB].forEach(p=>p.setAttribute('stroke-dashoffset',off));
    requestAnimationFrame(frame);}
  pressGroup([...document.querySelectorAll('[data-b]')],b=>{mode=b.dataset.b;style();});
  style(); dia.setAttribute('d','M606,180 Q673,150 740,180');
  onVisible(svg,()=>{if(!running){running=true;last=performance.now();requestAnimationFrame(frame);}},()=>{running=false;});
}

/* ============ 2. Neuron types ============ */
{
  const svg=$('ntSvg'); const D='#1f6fd1',SO='#e4572e',AX='#2a9d55';
  const hl=S('g',{},svg), cell=S('g',{},svg), badges=S('g',{},svg);
  const line=(x1,y1,x2,y2,col,w)=>S('line',{x1,y1,x2,y2,stroke:col,'stroke-width':w||3,'stroke-linecap':'round'},cell);
  const stalk=(x1,y1,x2,y2)=>S('line',{x1,y1,x2,y2,stroke:C.gold,'stroke-width':13,'stroke-linecap':'round',opacity:.65},hl);
  const twig=(x,y,ang,col)=>{[-.5,0,.5].forEach(d=>{const a=ang+d;line(x,y,x+16*Math.cos(a),y+16*Math.sin(a),col,2);});};
  const term=(x,y)=>{[-14,0,14].forEach(dy=>{line(x,y,x+14,y+dy,AX,2);S('circle',{cx:x+14,cy:y+dy,r:3.5,fill:AX},cell);});};
  // multipolar
  const mx=120,my=125,mr=19;
  [125,165,205,245,85].forEach(deg=>{const a=deg*Math.PI/180, sx=mx+mr*Math.cos(a), sy=my-mr*Math.sin(a), ex=mx+70*Math.cos(a), ey=my-70*Math.sin(a);
    line(sx,sy,ex,ey,D,3.2); twig(ex,ey,Math.atan2(ey-my,ex-mx),D); stalk(sx,sy,mx+38*Math.cos(a),my-38*Math.sin(a));});
  line(mx+mr,my,235,my,AX,3.2); term(235,my); stalk(mx+mr,my,mx+42,my);
  S('circle',{cx:mx,cy:my,r:mr,fill:SO,stroke:'#9b3a1d','stroke-width':1.5},cell);
  // bipolar
  const bx=400,by=125;
  line(bx-19,by,315,by,D,3.2); twig(315,by,Math.PI,D); stalk(bx-19,by,bx-42,by);
  line(bx+19,by,490,by,AX,3.2); term(490,by); stalk(bx+19,by,bx+42,by);
  S('ellipse',{cx:bx,cy:by,rx:19,ry:14,fill:SO,stroke:'#9b3a1d','stroke-width':1.5},cell);
  // pseudounipolar
  const px=665,py=62;
  line(px,py+19,px,140,AX,3.2); stalk(px,py+19,px,py+42);
  line(px,140,575,140,AX,3.2); line(px,140,765,140,AX,3.2);
  [-12,0,12].forEach(dy=>{S('path',{d:`M575,140 q-8,${dy/2} -16,${dy}`,stroke:D,'stroke-width':2,fill:'none'},cell);});
  term(765-14,140);
  S('circle',{cx:px,cy:py,r:19,fill:SO,stroke:'#9b3a1d','stroke-width':1.5},cell);
  T(560,165,'to skin',{'font-size':12.5,fill:C.muted},cell); T(710,165,'to spinal cord',{'font-size':12.5,fill:C.muted},cell);
  T(px+10,128,'T-split',{'font-size':12,fill:C.muted},cell);
  const badge=(x,y,n)=>{S('circle',{cx:x,cy:y,r:15,fill:C.ink},badges);T(x,y+5,n,{'text-anchor':'middle',fill:'#fff','font-size':14,'font-weight':700},badges);};
  badge(mx-38,my-55,'6'); badge(bx,by-42,'2'); badge(px+40,py-12,'1');
  const lab=(x,n,c,w)=>{T(x,215,n,{'text-anchor':'middle','font-size':21,'font-family':C.hand},svg);
    T(x,236,c,{'text-anchor':'middle','font-size':13.5,fill:SO,'font-weight':700},svg);T(x,256,w,{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);};
  lab(150,'Multipolar','many processes','most brain and motor neurons');
  lab(400,'Bipolar','2 processes','retina, nose, inner ear');
  lab(665,'Pseudounipolar','1 process, then a T','touch and pain neurons');
  const btn=$('ntCount'); btn.addEventListener('click',()=>{const on=btn.getAttribute('aria-pressed')!=='true';btn.setAttribute('aria-pressed',on);
    hl.setAttribute('opacity',on?1:0);badges.setAttribute('opacity',on?1:0);});
}

/* ============ 3. Midsagittal brain (shared drawing) ============ */
function drawMidsag(svg,pale){
  const g=S('g',{},svg); const P={};
  S('path',{d:'M80,250 C60,170 120,70 270,55 C400,45 520,85 548,170 C562,215 552,255 520,272 L410,276 C400,262 396,252 392,248 L345,248 C320,262 280,270 230,272 C160,276 100,275 80,250 Z',
    fill:pale?'#f6f1e7':'#f3ece0',stroke:'#8c8070','stroke-width':2},g);
  S('path',{d:'M190,190 C185,120 260,95 330,92 C420,90 480,125 470,190',fill:'none',stroke:'#cbbfa9','stroke-width':2},g);
  ['M120,140 C140,130 150,110 170,104','M450,95 C470,110 490,120 515,140','M100,200 C120,195 140,205 160,200','M490,200 C505,215 520,225 540,230'].forEach(d=>S('path',{d,fill:'none',stroke:'#d9cfbd','stroke-width':2},g));
  const fill=c=>pale?'#ece6da':c;
  P.cbl=S('path',{d:'M402,288 C430,275 500,278 526,298 C546,318 536,352 500,362 C460,370 418,352 403,328 C396,312 396,298 402,288 Z',fill:fill('#f6c28b'),stroke:'#a87b45','stroke-width':1.5},g);
  ['M410,300 C450,292 500,295 525,310','M406,316 C450,310 500,315 530,330','M410,334 C450,332 490,338 515,350'].forEach(d=>S('path',{d,fill:'none',stroke:pale?'#d8d0c0':'#c8925a','stroke-width':1.2,'pointer-events':'none'},g));
  P.mid=S('path',{d:'M345,248 L392,248 L392,268 L343,268 Z',fill:fill('#a8d8b9'),stroke:'#4f8a64','stroke-width':1.3},g);
  P.pons=S('path',{d:'M343,268 L392,268 L392,318 L345,318 C322,306 320,280 343,268 Z',fill:fill('#8fcf9f'),stroke:'#4f8a64','stroke-width':1.3},g);
  P.med=S('path',{d:'M345,318 L392,318 L384,380 L356,380 Z',fill:fill('#79c08d'),stroke:'#4f8a64','stroke-width':1.3},g);
  S('rect',{x:358,y:380,width:24,height:36,fill:pale?'#ece6da':'#d7ecd9',stroke:'#4f8a64','stroke-width':1.3},g);
  P.lv=S('path',{d:'M232,194 C270,166 360,160 412,180 C405,197 380,194 350,192 C300,190 262,200 240,208 Z',fill:fill('#9fd3f0'),stroke:'#3c7ea6','stroke-width':1.3},g);
  const cc=S('g',{},g); P.cc=cc;
  S('path',{d:'M215,205 C195,190 205,160 240,150 C300,135 370,135 415,158 C440,170 440,192 425,198',fill:'none',stroke:pale?'#d9d0bd':'#8c7a4a','stroke-width':17,'stroke-linecap':'round'},cc);
  S('path',{d:'M215,205 C195,190 205,160 240,150 C300,135 370,135 415,158 C440,170 440,192 425,198',fill:'none',stroke:pale?'#efe9dc':'#f7e3a8','stroke-width':12,'stroke-linecap':'round'},cc);
  P.thal=S('ellipse',{cx:338,cy:226,rx:40,ry:20,fill:fill('#c9b3e6'),stroke:'#6d4fa0','stroke-width':1.3},g);
  P.hypo=S('ellipse',{cx:286,cy:254,rx:22,ry:11,fill:fill('#f2a3b3'),stroke:'#a5485c','stroke-width':1.3},g);
  S('line',{x1:284,y1:264,x2:282,y2:280,stroke:'#a5485c','stroke-width':2},g);
  P.pit=S('circle',{cx:282,cy:287,r:8,fill:fill('#f7c6d0'),stroke:'#a5485c','stroke-width':1.3},g);
  const cs=S('g',{},g); P.cs=cs;
  S('path',{d:'M330,53 C336,64 338,74 346,88',fill:'none',stroke:'#4a4a4a','stroke-width':4,'stroke-linecap':'round'},cs);
  S('path',{d:'M330,53 C336,64 338,74 346,88',fill:'none',stroke:'transparent','stroke-width':22},cs);
  T(60,300,'← front',{'font-size':13,fill:C.muted},g); T(500,395,'back →',{'font-size':13,fill:C.muted},g);
  return P;
}
{
  const svg=$('msSvg'); const P=drawMidsag(svg,false);
  const INFO={
    cc:['Corpus callosum','A thick C-shaped band of axons (white matter) that connects the left and right hemispheres. On this view it is the arch across the middle.'],
    lv:['Lateral ventricle','A fluid-filled space (cerebrospinal fluid) tucked right <i>under</i> the corpus callosum. Think "pond under the bridge."'],
    thal:['Thalamus','The big oval in the center. It relays and filters sensory information on its way to the cortex (smell is the exception).'],
    hypo:['Hypothalamus','Small region just <i>below</i> and in front of the thalamus, above the pituitary. Runs homeostasis: temperature, hunger, thirst and the hormone system.'],
    pit:['Pituitary gland','Hangs from the hypothalamus on a stalk. The "master gland" releases hormones on the hypothalamus\'s orders.'],
    mid:['Midbrain','Top of the brainstem. Home of the substantia nigra and VTA, where dopamine neurons start.'],
    pons:['Pons','The bulge on the front of the brainstem. A bridge between cortex and cerebellum that also helps regulate breathing and sleep.'],
    med:['Medulla (oblongata)','Bottom of the brainstem, where it meets the spinal cord. Runs vital functions: heart rate, blood pressure and the breathing rhythm.'],
    cbl:['Cerebellum','The "little brain" at the back, with fine folds. It coordinates timing, balance and smooth movement.'],
    cs:['Central sulcus','The groove between the frontal lobe (motor strip in front) and the parietal lobe (touch strip behind). On the midline view it just nicks the top edge.']};
  const KEYS=Object.keys(INFO); let mode='explore', target=null, order=[], score=0;
  const txt=$('msTxt');
  function flash(k,col){const el=P[k];el.style.filter='drop-shadow(0 0 5px '+col+')';setTimeout(()=>el.style.filter='',700);}
  function ask(){ if(!order.length){txt.innerHTML='<b>Done! '+score+' / '+KEYS.length+' on the first try.</b> Press "Quiz me" to go again.';target=null;return;}
    target=order.shift(); txt.innerHTML='Click the <b>'+INFO[target][0]+'</b>.';}
  let first=true;
  KEYS.forEach(k=>{const el=P[k]; el.style.cursor='pointer'; el.setAttribute('tabindex',0); el.setAttribute('role','button'); el.setAttribute('aria-label',INFO[k][0]);
    const act=()=>{ if(mode==='explore'){flash(k,C.ink);txt.innerHTML='<b>'+INFO[k][0]+'</b><br>'+INFO[k][1];return;}
      if(!target)return;
      if(k===target){flash(k,C.green); if(first)score++; first=true; txt.innerHTML='Yes, that is the <b>'+INFO[k][0]+'</b>.'; setTimeout(ask,900);}
      else{flash(k,C.red); first=false; txt.innerHTML='That one is the <b>'+INFO[k][0]+'</b>. Try again: find the <b>'+INFO[target][0]+'</b>.<br><span style="color:#646a72">'+INFO[target][1]+'</span>';}};
    el.addEventListener('click',act); el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  $('msExplore').addEventListener('click',()=>{mode='explore';$('msExplore').setAttribute('aria-pressed',true);$('msQuiz').setAttribute('aria-pressed',false);txt.innerHTML='Click any colored structure.';});
  $('msQuiz').addEventListener('click',()=>{mode='quiz';$('msQuiz').setAttribute('aria-pressed',true);$('msExplore').setAttribute('aria-pressed',false);order=shuffle(KEYS);score=0;first=true;ask();});
}

/* ============ Lateral brain (shared drawing) ============ */
function drawLateral(svg){
  const g=S('g',{},svg);
  S('path',{d:'M392,282 L404,355 L378,358 L366,290 Z',fill:'#cfe6d4',stroke:'#4f8a64','stroke-width':1.3},g);
  const cb=S('ellipse',{cx:470,cy:298,rx:62,ry:32,fill:'#f6dcbc',stroke:'#a87b45','stroke-width':1.5},g);
  S('path',{d:'M95,205 C78,120 170,48 310,44 C450,40 545,108 548,192 C550,236 528,262 492,268 C470,282 440,282 418,276 C385,296 320,308 262,296 C222,288 196,268 182,252 C150,256 104,240 95,205 Z',fill:'#f3ece0',stroke:'#8c8070','stroke-width':2},g);
  ['M150,120 C180,110 200,90 230,85','M140,170 C170,160 190,170 215,160','M400,90 C420,110 450,115 470,110','M430,150 C460,150 480,165 500,160','M260,262 C300,270 340,268 380,262'].forEach(d=>S('path',{d,fill:'none',stroke:'#d9cfbd','stroke-width':2},g));
  S('path',{d:'M192,238 C250,214 330,204 405,196',fill:'none',stroke:'#6b6253','stroke-width':3,'stroke-linecap':'round'},g);
  S('path',{d:'M335,46 C328,95 318,150 300,206',fill:'none',stroke:'#6b6253','stroke-width':3,'stroke-linecap':'round'},g);
  const lab={'font-size':13,fill:'#9a917f','text-anchor':'middle'};
  T(165,140,'frontal',lab,g);T(430,95,'parietal',lab,g);T(320,286,'temporal',lab,g);T(520,215,'occipital',lab,g);
  T(70,330,'← front',{'font-size':13,fill:C.muted},g);
  return {g,cb};
}

/* ============ 4. Circuits sorter ============ */
{
  const svg=$('circSvg'); const L=drawLateral(svg);
  const R={
    bg:S('ellipse',{cx:290,cy:165,rx:46,ry:28,fill:C.purple,'fill-opacity':.25,stroke:C.purple,'stroke-width':2,'stroke-dasharray':'6 4'},svg),
    lb:S('g',{},svg), cb:L.cb};
  S('path',{d:'M290,250 C320,262 360,262 395,248',fill:'none',stroke:C.pink,'stroke-width':12,'stroke-linecap':'round',opacity:.55},R.lb);
  S('circle',{cx:272,cy:246,r:11,fill:C.pink,opacity:.75},R.lb);
  T(276,130,'basal ganglia (deep)',{'text-anchor':'end','font-size':13,fill:C.purple,'font-weight':700},svg);
  T(150,300,'hippocampus + amygdala',{'text-anchor':'start','font-size':12,fill:C.pink,'font-weight':700},svg);
  T(470,345,'cerebellum',{'text-anchor':'middle','font-size':13,fill:'#a0682c','font-weight':700},svg);
  const BINS=[['bg','Basal ganglia','start / stop / choose movements'],['cb','Cerebellum','smooth, timed, balanced movement'],['lb','Limbic system','emotion and memory']];
  const ITEMS=shuffle([
    ['Shaky at rest, and has trouble <i>starting</i> to walk','bg','Parkinson\'s: dopamine loss to the basal ganglia makes it hard to start movements.'],
    ['Sudden, jerky movements they can\'t stop','bg','Huntington\'s: basal ganglia damage makes it hard to <i>stop</i> unwanted movements.'],
    ['Reaching for a cup, the hand overshoots and wobbles','cb','The cerebellum corrects movement as it happens. Without it, reaching is jerky and overshoots.'],
    ['Walks with a wide, unsteady gait, as if drunk','cb','Balance and timing are cerebellum jobs (alcohol also hits the cerebellum!).'],
    ['Can\'t form new long-term memories','lb','The hippocampus (limbic system) turns new experiences into lasting memories, as in patient H.M.'],
    ['Doesn\'t recognize fear and has trouble regulating emotion','lb','The amygdala (limbic system) is central to fear and emotional regulation.']]);
  const chipsBox=$('circChips'), binsBox=$('circBins'), txt=$('circTxt'); let sel=null;
  const binEls={};
  BINS.forEach(([k,n,d])=>{const b=document.createElement('button');b.className='bin';b.innerHTML='<span class="bn">'+n+'</span><span class="bd">'+d+'</span>';binsBox.appendChild(b);binEls[k]=b;
    b.addEventListener('click',()=>{ if(!sel){txt.innerHTML='Pick a symptom first.';return;}
      const [label,ans,why]=sel.item;
      if(ans===k){const s=document.createElement('span');s.className='got';s.innerHTML=label;b.appendChild(s);sel.btn.remove();
        txt.innerHTML='<b style="color:#2a8a4c">Right.</b> '+why;
        const r=R[k]; r.style.filter='drop-shadow(0 0 6px '+C.gold+')'; setTimeout(()=>r.style.filter='',900); sel=null;
        if(!chipsBox.children.length) txt.innerHTML+=' <b>All sorted!</b>';}
      else{txt.innerHTML='<b style="color:#c8343f">Not quite.</b> Ask yourself: is it trouble <i>starting/stopping</i> (basal ganglia), <i>clumsiness</i> (cerebellum), or <i>feelings/memory</i> (limbic)?';
        sel.btn.classList.add('bad');const bb=sel.btn;setTimeout(()=>bb.classList.remove('bad'),600);}
    });});
  ITEMS.forEach(item=>{const b=document.createElement('button');b.className='chip';b.innerHTML=item[0];b.setAttribute('aria-pressed','false');chipsBox.appendChild(b);
    b.addEventListener('click',()=>{[...chipsBox.children].forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');sel={btn:b,item};txt.innerHTML='Now click the system you would blame.';});});
}

/* ============ 5. Language ============ */
{
  const svg=$('langSvg'); drawLateral(svg);
  const defs=S('defs',null,svg); const rg=S('radialGradient',{id:'heat'},defs);
  S('stop',{offset:'0%','stop-color':'#ff3b1f','stop-opacity':.95},rg);S('stop',{offset:'60%','stop-color':'#ff8a00','stop-opacity':.6},rg);S('stop',{offset:'100%','stop-color':'#ffd000','stop-opacity':0},rg);
  const spot=(cx,cy,rx,ry)=>S('ellipse',{cx,cy,rx,ry,fill:'url(#heat)',opacity:0,style:'transition:opacity .6s'},svg);
  const A={broca:spot(222,214,42,30),mouth:spot(292,184,26,20),wern:spot(412,222,48,30),aud:spot(335,226,40,18)};
  S('ellipse',{cx:222,cy:214,rx:30,ry:20,fill:'none',stroke:C.ink,'stroke-width':1.5,'stroke-dasharray':'4 3'},svg);
  S('ellipse',{cx:412,cy:222,rx:36,ry:20,fill:'none',stroke:C.ink,'stroke-width':1.5,'stroke-dasharray':'4 3'},svg);
  T(40,300,'Broca\'s area',{'font-size':15,'font-weight':700},svg); T(40,317,'(producing speech)',{'font-size':12.5,fill:C.muted},svg); S('line',{x1:110,y1:287,x2:205,y2:232,stroke:C.ink,'stroke-width':1.2},svg);
  T(455,330,'Wernicke\'s area',{'font-size':15,'font-weight':700},svg); T(455,347,'(understanding)',{'font-size':12.5,fill:C.muted},svg); S('line',{x1:470,y1:316,x2:425,y2:242,stroke:C.ink,'stroke-width':1.2},svg);
  T(300,20,'Also lights up: the mouth area of the motor strip and the auditory cortex',{'font-size':12,fill:C.muted,'text-anchor':'middle'},svg);
  const ST={speak:{broca:1,mouth:1,wern:.45,aud:.4,t:'<b>Speaking:</b> Broca\'s area plans the words and the mouth area of the motor strip moves your lips and tongue. Wernicke\'s and auditory areas stay a bit active because you hear and monitor yourself.'},
    listen:{broca:.25,mouth:0,wern:1,aud:1,t:'<b>Listening:</b> the auditory cortex processes the sounds and Wernicke\'s area works out the meaning.'},
    contrast:{broca:1,mouth:.7,wern:0,aud:0,t:'<b>Speaking minus listening:</b> subtract the listening scan from the speaking scan and what stands out is <b>Broca\'s area</b> (plus the mouth motor area). This is the result that fits production.'}};
  const set=k=>{const s=ST[k];['broca','mouth','wern','aud'].forEach(a=>A[a].setAttribute('opacity',s[a]));$('langTxt').innerHTML=s.t;};
  pressGroup([...document.querySelectorAll('[data-l]')],b=>set(b.dataset.l)); set('contrast');
}

/* ============ 6. Methods ============ */
{
  const svg=$('methSvg');
  S('rect',{x:70,y:30,width:400,height:280,fill:'#fbfaf6',stroke:C.line},svg);
  T(270,22,'Measures ACTIVITY',{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
  const aw=arrowDef(svg,'mA',C.muted);
  S('line',{x1:460,y1:330,x2:80,y2:330,stroke:C.muted,'stroke-width':2,'marker-end':aw},svg);
  T(270,352,'WHEN: better timing ←',{'text-anchor':'middle','font-size':13,fill:C.muted},svg);
  T(80,366,'milliseconds',{'font-size':12,fill:C.muted},svg); T(460,366,'minutes',{'font-size':12,fill:C.muted,'text-anchor':'end'},svg);
  S('line',{x1:50,y1:300,x2:50,y2:40,stroke:C.muted,'stroke-width':2,'marker-end':aw},svg);
  const yl=T(0,0,'WHERE: better localization ↑',{'font-size':13,fill:C.muted,'text-anchor':'middle'},svg); yl.setAttribute('transform','translate(36,170) rotate(-90)');
  S('rect',{x:495,y:30,width:215,height:185,rx:10,fill:'#f2f7fd',stroke:'#bcd3ee'},svg);
  T(602,52,'STRUCTURE only',{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
  T(602,70,'a still picture, no timing',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  S('rect',{x:495,y:232,width:215,height:110,rx:10,fill:'#fdf3ea',stroke:'#efc9a5'},svg);
  T(602,254,'CHANGES activity',{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
  T(602,272,'tests cause, not just correlation',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  const M={
    EEG:[115,255,C.orange,'<b>EEG</b> (electroencephalography): scalp electrodes pick up the summed electrical activity of many neurons. <b>Millisecond timing</b>, but it\'s hard to tell exactly where the signal came from. Best for <b>WHEN</b>.'],
    MEG:[150,200,C.orange,'<b>MEG</b>: measures the tiny magnetic fields made by neural currents. Millisecond timing, and somewhat better at localizing than EEG.'],
    fMRI:[300,85,C.blue,'<b>fMRI</b>: tracks blood oxygen (the BOLD signal) as a stand-in for activity. Pinpoints <b>WHERE</b> to within millimeters, but blood flow changes over seconds, so the timing is blurry.'],
    PET:[420,150,C.blue,'<b>PET</b>: tracks a radioactive tracer (glucose use, or a drug binding to receptors). Measures activity and brain chemistry, but it\'s slow (minutes) and blurrier than fMRI.'],
    MRI:[550,110,C.teal,'<b>MRI</b> (structural): a detailed picture of anatomy, with no activity and no timing. Use it for <b>shrinkage</b>, tumors and lesions.'],
    CT:[655,110,C.teal,'<b>CT</b>: X-ray slices of the head. A fast, cheap structural picture with less detail than MRI. Good for bleeding or skull fractures.'],
    DTI:[602,175,C.teal,'<b>DTI</b> (diffusion tensor imaging): an MRI technique that follows water moving along axons, so it maps <b>white-matter wiring</b>. Still structure, not activity.'],
    TMS:[602,308,C.red,'<b>TMS</b> (transcranial magnetic stimulation): a magnetic pulse briefly disrupts a patch of cortex, creating a temporary, reversible <b>"virtual lesion."</b> Because it <i>changes</i> activity, it can show a region is <b>necessary</b> for a behavior.']};
  const bub={};
  Object.entries(M).forEach(([k,[x,y,col,info]])=>{const g=S('g',{style:'cursor:pointer',tabindex:0,role:'button','aria-label':k},svg);
    const c=S('circle',{cx:x,cy:y,r:30,fill:col,'fill-opacity':.16,stroke:col,'stroke-width':2},g);
    T(x,y+5,k,{'text-anchor':'middle','font-size':15,'font-weight':700,fill:col},g); bub[k]=c;
    const act=()=>{Object.values(bub).forEach(b=>b.setAttribute('fill-opacity',.16));c.setAttribute('fill-opacity',.4);$('methTxt').innerHTML=info;};
    g.addEventListener('click',act); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  // scenarios
  const SC=[
    ['A neurologist wants to know whether a patient\'s hippocampus has physically shrunk.','MRI','It\'s a question about <b>structure</b> (size), so you want a detailed anatomical picture: MRI. fMRI, EEG and PET measure activity.'],
    ['A researcher wants to know exactly how many milliseconds after a beep the brain responds.','EEG','"Exactly when" needs <b>millisecond timing</b>: EEG (or MEG). fMRI is far too slow.'],
    ['A researcher wants to see which region is more active when people speak than when they listen.','fMRI','"Which region is more active" needs good <b>spatial</b> resolution of activity: fMRI.'],
    ['A researcher wants to test whether a region is <i>necessary</i> for a task, without harming anyone.','TMS','Necessity is a causal question. TMS creates a temporary, reversible "virtual lesion."'],
    ['A clinician wants to know whether the white-matter tracts linking two regions are damaged.','DTI','DTI tracks water moving along axons, so it maps white-matter tracts.']];
  let si=0; const OPTS=['MRI','fMRI','EEG','PET','TMS','DTI'];
  const box=$('scenBtns');
  function show(){ $('scenQ').innerHTML='<b>Case '+(si+1)+' of '+SC.length+':</b> '+SC[si][0]; $('scenTxt').innerHTML=''; box.innerHTML='';
    OPTS.forEach(o=>{const b=document.createElement('button');b.className='tg';b.textContent=o;box.appendChild(b);
      b.addEventListener('click',()=>{ if(o===SC[si][1]){b.classList.add('good');$('scenTxt').innerHTML='<b style="color:#2a8a4c">Yes.</b> '+SC[si][2]+(si<SC.length-1?' <button class="tg" id="scenNext">Next case →</button>':' <b>That\'s all five!</b> <button class="tg" id="scenNext">Start over</button>');
          $('scenNext').addEventListener('click',()=>{si=(si+1)%SC.length;show();});}
        else{b.classList.add('bad');$('scenTxt').innerHTML='<b style="color:#c8343f">Not the best fit.</b> '+M[o][3];}});});}
  show();
  // stains
  const ns=$('nisslSvg'); S('rect',{x:0,y:0,width:340,height:230,fill:'#f6eff8'},ns);
  const r=rng(7); const layers=[[0,22,.15],[22,60,.9],[60,80,.55],[80,120,1],[120,170,.5],[170,230,.85]];
  layers.forEach(([y0,y1,dens])=>{const n=Math.round((y1-y0)*dens*3.2);for(let i=0;i<n;i++){S('circle',{cx:26+r()*310,cy:y0+r()*(y1-y0),r:1.4+r()*2.2,fill:'#5b2d91',opacity:.55+r()*.4},ns);}});
  ['I','II','III','IV','V','VI'].forEach((l,i)=>T(6,[14,45,74,104,150,205][i],l,{'font-size':11,fill:'#5b2d91','font-weight':700},ns));
  const gs=$('golgiSvg'); S('rect',{x:0,y:0,width:340,height:230,fill:'#f3e3b0'},gs);
  const rg=rng(11);
  function branch(x,y,ang,len,depth,w){ if(depth===0||len<4)return; const x2=x+len*Math.cos(ang),y2=y+len*Math.sin(ang);
    S('line',{x1:x,y1:y,x2,y2,stroke:'#1d1a14','stroke-width':w,'stroke-linecap':'round'},gs);
    const n=depth>2?2:1+Math.round(rg()); for(let i=0;i<n;i++) branch(x2,y2,ang+(rg()-.5)*1.1,len*(.6+rg()*.2),depth-1,Math.max(.6,w*.7));}
  [[85,140],[200,115],[290,160]].forEach(([x,y])=>{
    branch(x,y-8,-Math.PI/2+(rg()-.5)*.2,38,5,2.4);
    for(let i=0;i<4;i++) branch(x,y+4,Math.PI/2+(i-1.5)*.7,22,4,1.6);
    S('line',{x1:x,y1:y+6,x2:x+(rg()-.5)*20,y2:228,stroke:'#1d1a14','stroke-width':1.1},gs);
    S('path',{d:`M${x-8},${y+6} L${x},${y-12} L${x+8},${y+6} Z`,fill:'#1d1a14'},gs);});
}

/* ============ 7. Spinal cord ============ */
{
  const svg=$('spineSvg');
  const REG=[['Cervical',8,C.blue,'neck, arms, diaphragm'],['Thoracic',12,C.teal,'chest, trunk'],['Lumbar',5,C.gold,'legs'],['Sacral',5,C.orange,'pelvis, bladder, bowel'],['Coccygeal',1,C.pink,'tailbone']];
  S('path',{d:'M160,8 C160,30 200,30 200,8',fill:'#e8f3ea',stroke:'#4f8a64'},svg); T(180,22,'brain',{'text-anchor':'middle','font-size':11,fill:C.muted},svg);
  let y=34; const groups=[];
  REG.forEach(([n,c,col,b],ri)=>{const g=S('g',{},svg); const y0=y;
    for(let i=0;i<c;i++){S('rect',{x:160,y,width:40,height:13,rx:3,fill:col,'fill-opacity':.85},g);
      S('line',{x1:160,y1:y+6,x2:132,y2:y+12,stroke:col,'stroke-width':1.5},g);S('line',{x1:200,y1:y+6,x2:228,y2:y+12,stroke:col,'stroke-width':1.5},g);y+=15;}
    const y1=y-2, mid=(y0+y1)/2;
    S('path',{d:`M240,${y0} h8 V${y1} h-8`,fill:'none',stroke:col,'stroke-width':2},g);
    const t1=T(258,mid-2,'?',{'font-size':17,'font-weight':700,fill:col},g);
    const t2=T(258,mid+15,'',{'font-size':12.5,fill:C.muted},g);
    groups.push({g,t1,t2,n,c,b});});
  const btns=$('spBtns'); let next=0;
  function reveal(i){groups[i].t1.textContent=groups[i].n+' · '+groups[i].c;groups[i].t2.textContent=groups[i].b;}
  shuffle(REG.map((r,i)=>i)).forEach(i=>{const b=document.createElement('button');b.className='tg';b.textContent=REG[i][0];btns.appendChild(b);
    b.addEventListener('click',()=>{ if(b.classList.contains('good'))return;
      if(i===next){b.classList.add('good');b.textContent=(i+1)+'. '+REG[i][0];reveal(i);next++;
        $('spTxt').innerHTML=next===REG.length?'<b style="color:#2a8a4c">Perfect order!</b> 8 + 12 + 5 + 5 + 1 = 31 pairs of spinal nerves.':'Good. What comes next going down?';}
      else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);$('spTxt').innerHTML='Not next. Picture your body from the neck down: neck, chest, lower back, pelvis, tailbone.';}});});
  const sa=document.createElement('button');sa.className='tg';sa.textContent='Show all';btns.appendChild(sa);
  sa.addEventListener('click',()=>{groups.forEach((g,i)=>reveal(i));});
}

/* ============ 8. Potassium / resting potential ============ */
{
  const svg=$('kSvg'); const Ki=140,Nao=145,Nai=15,pNa=.04;
  S('rect',{x:20,y:10,width:540,height:128,fill:'#eef6fb'},svg); S('rect',{x:20,y:162,width:540,height:128,fill:'#fbf3ea'},svg);
  T(30,30,'OUTSIDE the cell',{'font-size':13,'font-weight':700,fill:C.muted},svg); T(30,282,'INSIDE the cell',{'font-size':13,'font-weight':700,fill:C.muted},svg);
  S('rect',{x:20,y:138,width:540,height:24,fill:'#f2e3c4'},svg);
  for(let x=26;x<560;x+=12){S('circle',{cx:x,cy:142,r:4,fill:'#d9b77a'},svg);S('circle',{cx:x,cy:158,r:4,fill:'#d9b77a'},svg);}
  S('rect',{x:262,y:132,width:14,height:36,fill:C.purple,rx:3},svg);S('rect',{x:300,y:132,width:14,height:36,fill:C.purple,rx:3},svg);
  S('rect',{x:276,y:138,width:24,height:24,fill:'#eef6fb'},svg);
  T(322,132,'K⁺ leak channel',{'font-size':12,fill:C.purple},svg);
  const r=rng(3); const inside=S('g',{},svg), outside=S('g',{},svg), charges=S('g',{},svg);
  for(let i=0;i<46;i++){S('circle',{cx:30+r()*520,cy:172+r()*95,r:5,fill:C.purple,opacity:.8},inside);}
  const outPos=[];for(let i=0;i<60;i++)outPos.push([30+r()*520,40+r()*90]);
  const am=arrowDef(svg,'kA',C.purple);
  const arrow=S('line',{x1:288,y1:230,x2:288,y2:70,stroke:C.purple,'marker-end':am,'stroke-linecap':'round'},svg);
  const arrowT=T(320,60,'',{'font-size':12.5,fill:C.purple,'font-weight':700},svg);
  // meter
  const vy=v=>285-(v+100)*(235/140);
  S('rect',{x:640,y:vy(40),width:34,height:vy(-100)-vy(40),rx:8,fill:'#fff',stroke:'#bbb'},svg);
  [40,0,-50,-100].forEach(v=>{S('line',{x1:674,y1:vy(v),x2:682,y2:vy(v),stroke:'#999'},svg);T(686,vy(v)+4,(v>0?'+':'')+v,{'font-size':11,fill:C.muted},svg);});
  S('line',{x1:630,y1:vy(-55),x2:690,y2:vy(-55),stroke:C.red,'stroke-width':2,'stroke-dasharray':'5 3'},svg);
  T(626,vy(-55)+4,'threshold',{'font-size':11,fill:C.red,'text-anchor':'end'},svg);
  S('line',{x1:636,y1:vy(-70),x2:678,y2:vy(-70),stroke:'#999','stroke-dasharray':'2 2'},svg);
  T(626,vy(-70)+12,'normal rest',{'font-size':11,fill:C.muted,'text-anchor':'end'},svg);
  const fillBar=S('rect',{x:646,width:22,rx:5,fill:C.blue,opacity:.7},svg);
  const vt=T(657,20,'',{'font-size':14,'font-weight':700,'text-anchor':'middle'},svg);
  T(657,36,'membrane potential',{'font-size':10.5,'text-anchor':'middle',fill:C.muted},svg);
  function upd(){const Ko=+$('kSlide').value; $('kOut').textContent=Ko+' mM';
    const Vm=61.5*Math.log10((Ko+pNa*Nao)/(Ki+pNa*Nai)), EK=61.5*Math.log10(Ko/Ki);
    outside.innerHTML=''; const n=Math.round(Ko*2.6); for(let i=0;i<Math.min(n,60);i++) S('circle',{cx:outPos[i][0],cy:outPos[i][1],r:5,fill:C.purple,opacity:.8},outside);
    const push=Math.log(Ki/Ko)/Math.log(Ki/2); arrow.setAttribute('stroke-width',3+push*7); arrow.setAttribute('y2',150-95*push);
    arrowT.textContent='K⁺ push outward: '+(push>.75?'strong':push>.55?'medium':'weak');
    charges.innerHTML=''; const nc=Math.round(Math.max(0,-Vm)/10); T(30,206,'charge left inside:',{'font-size':11,fill:C.blue},charges); for(let i=0;i<nc;i++)T(140+i*42,208,'−',{'font-size':20,fill:C.blue,'font-weight':700},charges);
    fillBar.setAttribute('y',vy(Vm)); fillBar.setAttribute('height',vy(-100)-vy(Vm)); fillBar.setAttribute('fill',Vm>-55?C.red:Vm>-64?C.orange:C.blue);
    vt.textContent=Vm.toFixed(0)+' mV';
    let msg;
    if(Ko<3.4) msg='<b>Low K⁺ outside:</b> the gradient gets <i>steeper</i>, more K⁺ leaks out, and the inside becomes <b>more negative</b> (hyperpolarized) at <b>'+Vm.toFixed(0)+' mV</b>. The neuron is harder to excite.';
    else if(Ko<=5.5) msg='<b>Normal range:</b> K⁺ is about 35× more concentrated inside, so it leaks out and leaves the inside near <b>'+Vm.toFixed(0)+' mV</b>.';
    else if(Vm<-55) msg='<b>Hyperkalemia:</b> with more K⁺ outside, the gradient is <i>smaller</i>, <b>less</b> K⁺ leaks out, and the membrane <b>depolarizes</b> to <b>'+Vm.toFixed(0)+' mV</b>, closer to threshold. (The Na⁺/K⁺ pump can\'t fix this; it only maintains gradients slowly.)';
    else msg='<b>Severe hyperkalemia:</b> the membrane sits at <b>'+Vm.toFixed(0)+' mV</b>, at or past threshold. Held there, Na⁺ channels get stuck inactivated, so cells can actually <i>stop</i> firing properly. That\'s why high K⁺ is so dangerous for the heart.';
    $('kTxt').innerHTML=msg+' <span style="color:#646a72">(E<sub>K</sub> = '+EK.toFixed(0)+' mV)</span>';}
  $('kSlide').addEventListener('input',upd); upd();
}

/* ============ 9a. AP graph ============ */
{
  const svg=$('apSvg'); const x=t=>60+t*(590/5), y=v=>25+(40-v)*(240/130);
  const sm=k=>k*k*(3-2*k);
  function V(t){ if(t<.6)return -70; if(t<1)return -70+15*sm((t-.6)/.4); if(t<1.45)return -55+90*Math.pow((t-1)/.45,1.6);
    if(t<2.35)return 35-117*sm((t-1.45)/.9); if(t<4.6)return -82+12*(1-Math.pow(1-(t-2.35)/2.25,2.2)); return -70;}
  const absR=S('rect',{x:x(1),y:20,width:x(2.15)-x(1),height:250,fill:'#555',opacity:.12},svg);
  const relR=S('rect',{x:x(2.15),y:20,width:x(4.1)-x(2.15),height:250,fill:'#b9b4aa',opacity:.18},svg);
  T((x(1)+x(2.15))/2,290,'absolute',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  T((x(2.15)+x(4.1))/2,290,'relative refractory',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  [40,0,-55,-70,-90].forEach(v=>{T(54,y(v)+4,(v>0?'+':'')+v,{'font-size':11,fill:C.muted,'text-anchor':'end'},svg);});
  S('line',{x1:60,y1:y(-55),x2:650,y2:y(-55),stroke:C.red,'stroke-dasharray':'5 4'},svg); T(646,y(-55)-5,'threshold',{'font-size':11,fill:C.red,'text-anchor':'end'},svg);
  S('line',{x1:60,y1:y(0),x2:650,y2:y(0),stroke:'#ddd'},svg);
  let d='';for(let t=0;t<=5;t+=.02)d+=(d?'L':'M')+x(t).toFixed(1)+','+y(V(t)).toFixed(1);
  S('path',{d,fill:'none',stroke:C.ink,'stroke-width':3},svg);
  const seg=(a,b)=>{let s='';for(let t=a;t<=b;t+=.01)s+=(s?'L':'M')+x(t).toFixed(1)+','+y(V(t)).toFixed(1);return s;};
  const hl=S('path',{fill:'none','stroke-width':7,'stroke-linecap':'round',opacity:.8},svg);
  const st=S('g',{},svg); S('rect',{x:440,y:28,width:200,height:58,rx:8,fill:'#fff',stroke:C.line},st);
  const naT=T(450,50,'',{'font-size':13},st), kT=T(450,72,'',{'font-size':13},st);
  const P={rise:{seg:[1,1.45],col:C.orange,na:'OPEN, Na⁺ rushing in',k:'mostly closed',t:'<b>Rising phase:</b> voltage-gated Na⁺ channels open and Na⁺ rushes <i>in</i>, so the inside shoots up toward +35 mV.'},
    fall:{seg:[1.45,2.35],col:C.blue,na:'INACTIVATED (plugged)',k:'OPEN, K⁺ flowing out',t:'<b>Falling phase (repolarization):</b> Na⁺ channels inactivate and voltage-gated K⁺ channels open. K⁺ flows <i>out</i> and the inside drops. This is done by <b>K⁺ channels, not the pump</b>.'},
    abs:{seg:null,na:'INACTIVATED, can\'t reopen',k:'open',t:'<b>Absolute refractory period:</b> Na⁺ channels are inactivated and <b>cannot reopen yet, no matter how strong the stimulus</b>. No new spike is possible.'},
    rel:{seg:null,na:'reset, ready again',k:'some still open (undershoot)',t:'<b>Relative refractory period:</b> Na⁺ channels have reset, but extra K⁺ channels are still open and the membrane is below rest. A spike <i>is</i> possible, but it takes a <b>bigger-than-normal stimulus</b>.'}};
  function set(k){const p=P[k]; if(p.seg){hl.setAttribute('d',seg(...p.seg));hl.setAttribute('stroke',p.col);}else hl.setAttribute('d','');
    absR.setAttribute('opacity',k==='abs'?.38:.12); relR.setAttribute('opacity',k==='rel'?.5:.18);
    naT.textContent='Na⁺ channels: '+p.na; kT.textContent='K⁺ channels: '+p.k; $('apTxt').innerHTML=p.t;}
  pressGroup([...document.querySelectorAll('[data-p]')],b=>set(b.dataset.p)); set('rise');
}

/* ============ 9b. Axon propagation ============ */
{
  const svg=$('axSvg'); const N=26, x0=112, x1=712, w=(x1-x0)/N;
  S('circle',{cx:52,cy:85,r:36,fill:'#f7d2c4',stroke:'#9b3a1d','stroke-width':1.5},svg);
  S('path',{d:'M86,72 L112,78 L112,92 L86,98 Z',fill:'#f7d2c4',stroke:'#9b3a1d','stroke-width':1.5},svg);
  T(52,90,'soma',{'text-anchor':'middle','font-size':12},svg); T(100,140,'axon hillock',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  [-12,0,12].forEach(dy=>S('circle',{cx:x1+16,cy:85+dy,r:6,fill:'#9cc9a8',stroke:'#2a8a4c'},svg));
  T(x1+6,140,'terminal',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
  const segs=[];for(let i=0;i<N;i++)segs.push(S('rect',{x:x0+i*w+1,y:72,width:w-2,height:26,rx:4,fill:'#fbf6ea',stroke:'#c9c3b6'},svg));
  const zap=T(0,58,'⚡',{'font-size':22,'text-anchor':'middle',opacity:0},svg);
  const age=new Array(N).fill(-1); let timer=null;
  const col=a=>a<0?'#fbf6ea':a===0?C.orange:a<=4?'#555':a<=7?'#b9b4aa':'#fbf6ea';
  function draw(){segs.forEach((s,i)=>s.setAttribute('fill',col(age[i])));}
  function step(){const fire=[];for(let i=0;i<N;i++){if(age[i]===-1&&((i>0&&age[i-1]===0)||(i<N-1&&age[i+1]===0)))fire.push(i);}
    for(let i=0;i<N;i++){if(age[i]>=0){age[i]++;if(age[i]>7)age[i]=-1;}} fire.forEach(i=>age[i]=0); draw();
    if(age.every(a=>a===-1)){clearInterval(timer);timer=null;}}
  function start(i,msg){if(timer)clearInterval(timer);age.fill(-1);age[i]=0;draw();
    zap.setAttribute('x',i===0?100:x0+i*w+w/2);zap.setAttribute('opacity',1);setTimeout(()=>zap.setAttribute('opacity',0),500);
    timer=setInterval(step,REDUCE?250:110);$('axTxt').innerHTML=msg;}
  $('axHill').addEventListener('click',()=>start(0,'Spikes normally start at the axon hillock. Each patch the spike leaves behind turns <b>refractory</b> (gray), so the only place it can spread is <b>forward</b> into fresh membrane.'));
  $('axMid').addEventListener('click',()=>start(13,'Zapped in the middle, the spike spreads <b>both ways</b>. The membrane itself has no "direction." Normally spikes start at the hillock, and the refractory patch behind them is what keeps them moving forward. The hillock isn\'t blocking anything, and ions don\'t "only flow one way."'));
  draw();
}

/* ============ 9c. Saltatory ============ */
{
  const svg=$('salSvg'); const nodes=[40,150,260,370,480,590,700];
  function axon(yc,label,damaged){const g=S('g',{},svg);
    T(40,yc-34,label,{'font-size':14,'font-weight':700},g);
    S('rect',{x:30,y:yc-6,width:690,height:12,rx:6,fill:'#f3d5c9',stroke:'#c28d7c'},g);
    const cur=S('rect',{x:0,y:yc-4,width:0,height:8,fill:C.blue,opacity:0},g);
    for(let k=0;k<nodes.length-1;k++){const a=nodes[k]+9,b=nodes[k+1]-9;
      if(damaged&&k===3) S('rect',{x:a,y:yc-17,width:b-a,height:34,rx:15,fill:'none',stroke:'#c9b98f','stroke-dasharray':'4 5'},g);
      else S('rect',{x:a,y:yc-17,width:b-a,height:34,rx:15,fill:'#f1e6c8',stroke:'#b8a473',opacity:.92},g);}
    const nd=nodes.map(n=>S('circle',{cx:n,cy:yc,r:7,fill:'#ddd',stroke:'#888'},g));
    const leak=S('g',{opacity:0},g); for(let i=0;i<5;i++){const lx=nodes[3]+18+i*18;S('line',{x1:lx,y1:yc-8,x2:lx+4,y2:yc-30,stroke:C.blue,'stroke-width':2},leak);}
    const fail=T(nodes[4],yc+38,'',{'font-size':12.5,fill:C.red,'text-anchor':'middle','font-weight':700},g);
    return {cur,nd,leak,fail,damaged};}
  const A=axon(60,'Healthy myelin',false), B=axon(170,'Damaged myelin (as in multiple sclerosis)',true);
  T(205,103,'current spreads under the myelin',{'font-size':11.5,fill:C.blue,'text-anchor':'middle'},svg);
  T(700,103,'spike rebuilt at each node',{'font-size':11.5,fill:C.orange,'text-anchor':'end'},svg);
  let busy=false;
  $('salGo').addEventListener('click',()=>{ if(busy)return; busy=true; const per=REDUCE?50:520, t0=performance.now();
    [A,B].forEach(o=>{o.nd.forEach(n=>n.setAttribute('fill','#ddd'));o.leak.setAttribute('opacity',0);o.fail.textContent='';});
    function f(now){const t=(now-t0)/per; let alive=false;
      [A,B].forEach(o=>{const k=Math.floor(t), p=t-k;
        if(o.damaged&&k>3){o.cur.setAttribute('opacity',0);o.fail.textContent='✗ too weak to reach threshold';return;}
        if(k>=nodes.length-1){o.cur.setAttribute('opacity',0);o.nd[nodes.length-1].setAttribute('fill',C.orange);return;}
        alive=true; for(let j=0;j<=k;j++)o.nd[j].setAttribute('fill',(t-j)<.45?C.orange:'#f7c7a6');
        let amp=1; if(o.damaged&&k===3){amp=Math.max(0,1-p*1.3);o.leak.setAttribute('opacity',Math.min(1,p*2));}
        o.cur.setAttribute('x',nodes[k]);o.cur.setAttribute('width',p*(nodes[k+1]-nodes[k]));o.cur.setAttribute('opacity',.25+.6*amp);});
      if(alive||t<nodes.length)requestAnimationFrame(f); else busy=false;}
    requestAnimationFrame(f);});
}

/* ============ 10. Synapse step-through ============ */
{
  const svg=$('synSvg');
  const term=S('path',{d:'M230,0 L230,40 C150,60 150,190 190,198 L530,198 C570,190 570,60 490,40 L490,0',fill:'#fdebd3',stroke:'#b07a3e','stroke-width':2.5},svg);
  T(360,24,'presynaptic terminal',{'text-anchor':'middle','font-size':13,fill:C.muted},svg);
  S('rect',{x:110,y:248,width:500,height:82,fill:'#e3eefb'},svg);
  S('line',{x1:110,y1:248,x2:610,y2:248,stroke:'#3c7ea6','stroke-width':3},svg);
  T(360,318,'postsynaptic neuron',{'text-anchor':'middle','font-size':13,fill:C.muted},svg);
  T(640,226,'synaptic cleft',{'font-size':12,fill:C.muted},svg);
  const ca=[]; const chan=[];
  [215,505].forEach(cx=>{const a=S('rect',{x:cx-12,y:188,width:9,height:20,fill:C.teal,rx:2},svg),b=S('rect',{x:cx+3,y:188,width:9,height:20,fill:C.teal,rx:2},svg);chan.push([a,b]);
    T(cx,240,'Ca²⁺ channel',{'text-anchor':'middle','font-size':11,fill:C.teal},svg);});
  [[178,212],[190,222],[243,213],[254,222],[478,214],[488,223],[533,212],[544,221]].forEach(([x,y])=>{const c=S('circle',{cx:x,cy:y,r:4.5,fill:C.teal,style:'transition:transform .8s, opacity .5s'},svg);ca.push(c);});
  const rec=[300,360,420].map(x=>S('path',{d:`M${x-14},248 L${x-14},236 L${x-6},236 L${x-6},242 L${x+6},242 L${x+6},236 L${x+14},236 L${x+14},248 Z`,fill:C.blue},svg));
  const trans=S('rect',{x:462,y:186,width:16,height:14,rx:3,fill:C.purple},svg); T(470,178,'reuptake',{'text-anchor':'middle','font-size':10.5,fill:C.purple},svg);
  const VP=[[290,110],[350,85],[410,112],[320,150],[390,150]];
  const ves=[],nt=[];
  VP.forEach(([x,y],i)=>{const v=S('circle',{cx:x,cy:y,r:17,fill:'#fff',stroke:'#b07a3e','stroke-width':2,style:'transition:transform .8s, opacity .6s'},svg);ves.push(v);});
  VP.forEach(([x,y],i)=>{for(let j=0;j<3;j++){const d=S('circle',{cx:x-6+j*6,cy:y+(j%2?4:-3),r:3.6,fill:C.orange,style:'transition:transform .9s, opacity .6s'},svg);nt.push({d,x:x-6+j*6,y:y+(j%2?4:-3),vi:i,j});}});
  const apTag=T(360,62,'',{'text-anchor':'middle','font-size':14,'font-weight':700,fill:C.orange},svg);
  const postTag=T(360,290,'',{'text-anchor':'middle','font-size':15,'font-weight':700,fill:C.green},svg);
  const STEPS=['<b>Resting terminal.</b> Vesicles full of transmitter wait near the membrane.',
    '<b>Step 1: The action potential arrives</b> at the terminal and depolarizes it.',
    '<b>Step 2: Voltage-gated Ca²⁺ channels open</b> and Ca²⁺ rushes into the terminal.',
    '<b>Step 3: Ca²⁺ triggers vesicles to fuse</b> with the membrane and dump transmitter into the cleft (exocytosis).',
    '<b>Step 4: Transmitter binds postsynaptic receptors</b>, creating an EPSP or IPSP.',
    '<b>Step 5: Transmitter is cleared</b> by reuptake transporters, enzymes, or diffusion away, so the signal ends.'];
  let step=0, noCa=false;
  const tr=(el,dx,dy)=>el.style.transform=`translate(${dx}px,${dy}px)`;
  function render(){ const s=step;
    term.setAttribute('stroke',s>=1?C.orange:'#b07a3e'); term.setAttribute('stroke-width',s>=1?4:2.5); apTag.textContent=s>=1?'⚡ action potential arrives ↓':'';
    chan.forEach(([a,b])=>{const o=s>=2?5:0;tr(a,-o,0);tr(b,o,0);});
    ca.forEach((c,i)=>{c.style.opacity=noCa?0:1; tr(c,0,s>=2&&!noCa?-(70+(i%4)*10):0);});
    const fused=s>=3&&!noCa;
    ves.forEach((v,i)=>{const[x,y]=VP[i];const tx=[255,325,395,445,365][i];tr(v,fused?tx-x:0,fused?180-y:0);v.style.opacity=fused?(s>=4?.25:.8):1;});
    nt.forEach((n,k)=>{let dx=0,dy=0,op=1;
      if(fused){const recX=[300,360,420][(n.vi+n.j)%3];
        if(s===3){dx=[255,325,395,445,365][n.vi]-VP[n.vi][0]+(n.j-1)*10;dy=215-n.y;}
        else if(s===4){dx=recX-n.x+(n.j-1)*5;dy=231-n.y;}
        else if(s>=5){ if(k%3===0){dx=470-n.x;dy=192-n.y;op=.3;} else {dx=recX-n.x+(n.j-1)*30+(n.vi%2?60:-60);dy=222-n.y;op=0;}}}
      tr(n.d,dx,dy);n.d.style.opacity=op;});
    rec.forEach(r=>r.setAttribute('fill',fused&&s===4?C.green:C.blue));
    postTag.textContent=fused&&s===4?'EPSP / IPSP':'';
    let t=STEPS[s];
    if(noCa&&s>=2) t='<b style="color:#c8343f">No Ca²⁺ outside:</b> the channels open but nothing flows in, so <b>vesicles never fuse and no transmitter is released</b>, even though the action potential arrived normally. Conduction along the axon is fine; release is what fails.';
    $('synTxt').innerHTML=t+' <span style="color:#646a72">('+s+' / 5)</span>';}
  $('synNext').addEventListener('click',()=>{step=Math.min(5,step+1);render();});
  $('synPrev').addEventListener('click',()=>{step=Math.max(0,step-1);render();});
  $('synNoCa').addEventListener('click',e=>{noCa=!noCa;e.currentTarget.setAttribute('aria-pressed',noCa);render();});
  render();
  // order game
  const ORD=['Action potential reaches the terminal','Ca²⁺ channels open and Ca²⁺ flows in','Vesicles fuse and release transmitter','Transmitter binds receptors','Transmitter is cleared'];
  const HINT=['Everything starts with the electrical signal arriving.','What has to come in before vesicles can fuse?','Ca²⁺ is in, so now what happens to the vesicles?','The transmitter is in the cleft. Where does it go?','Last, the signal has to be shut off.'];
  const box=$('ordBtns'); let nx=0;
  function build(){box.innerHTML='';nx=0;$('ordTxt').innerHTML='';shuffle(ORD.map((_,i)=>i)).forEach(i=>{const b=document.createElement('button');b.className='tg';b.textContent=ORD[i];box.appendChild(b);
    b.addEventListener('click',()=>{if(b.classList.contains('good'))return;
      if(i===nx){b.classList.add('good');b.textContent=(i+1)+'. '+ORD[i];nx++;$('ordTxt').innerHTML=nx===ORD.length?'<b style="color:#2a8a4c">All in order!</b> Remember: Ca²⁺ comes <i>before</i> fusion. <button class="tg" id="ordAgain">Shuffle again</button>':'';
        if(nx===ORD.length)$('ordAgain').addEventListener('click',build);}
      else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),500);$('ordTxt').innerHTML='Not yet. Hint: '+HINT[nx];}});});}
  build();
  // gas
  const gs=$('gasSvg');
  S('rect',{x:20,y:10,width:320,height:70,rx:16,fill:'#fdebd3',stroke:'#b07a3e','stroke-width':2},gs); T(30,30,'sending cell',{'font-size':12,fill:C.muted},gs);
  S('rect',{x:20,y:140,width:320,height:70,rx:16,fill:'#e3eefb',stroke:'#3c7ea6','stroke-width':2},gs); T(30,202,'receiving cell',{'font-size':12,fill:C.muted},gs);
  S('path',{d:'M175,175 m-16,0 a16,16 0 1,0 32,0 l-16,0 z',fill:C.gold,stroke:'#a87b00'},gs); T(198,182,'enzyme (NOS)',{'text-anchor':'start','font-size':11,fill:'#7a5a00'},gs);
  S('circle',{cx:290,cy:45,r:14,fill:'#fff',stroke:'#b07a3e','stroke-width':2},gs); S('line',{x1:276,y1:31,x2:304,y2:59,stroke:C.red,'stroke-width':3},gs);
  T(290,74,'no vesicles',{'text-anchor':'middle','font-size':11,fill:C.red},gs);
  const gas=[]; const gr=rng(5);
  for(let i=0;i<14;i++){const c=S('circle',{cx:175,cy:172,r:4,fill:C.teal,opacity:0},gs);gas.push({c,x:175,y:175,vx:0,vy:0,life:-i*20});}
  let gRun=false;
  function gf(){ if(!gRun)return; gas.forEach(p=>{p.life++; if(p.life<0)return; if(p.life===0||p.life>140){p.x=175;p.y=172;const a=gr()*Math.PI*2;p.vx=Math.cos(a)*1.1;p.vy=Math.sin(a)*1.1-.35;p.life=0;}
    p.x+=p.vx+(gr()-.5)*.6;p.y+=p.vy+(gr()-.5)*.6;p.c.setAttribute('cx',p.x);p.c.setAttribute('cy',p.y);p.c.setAttribute('opacity',Math.max(0,1-p.life/140));});
    requestAnimationFrame(gf);}
  if(!REDUCE) onVisible(gs,()=>{if(!gRun){gRun=true;requestAnimationFrame(gf);}},()=>{gRun=false;});
}

/* ============ 11. Ionotropic vs metabotropic ============ */
{
  const svg=$('recSvg');
  S('line',{x1:380,y1:10,x2:380,y2:290,stroke:C.line,'stroke-width':2},svg);
  [[20,360],[400,740]].forEach(([a,b])=>{S('rect',{x:a,y:120,width:b-a,height:28,fill:'#f2e3c4'},svg);});
  T(190,28,'IONOTROPIC',{'text-anchor':'middle','font-size':16,'font-weight':700,fill:C.orange},svg);
  T(190,46,'the receptor IS the channel',{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);
  T(570,28,'METABOTROPIC',{'text-anchor':'middle','font-size':16,'font-weight':700,fill:C.blue},svg);
  T(570,46,'receptor → G protein → separate channel',{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);
  const tr=(el,dx,dy,ms)=>{el.style.transition='transform '+(ms||600)+'ms';el.style.transform=`translate(${dx}px,${dy}px)`;};
  const iL=S('rect',{x:166,y:110,width:20,height:48,rx:5,fill:C.orange},svg), iR=S('rect',{x:194,y:110,width:20,height:48,rx:5,fill:C.orange},svg);
  const iT=S('circle',{cx:190,cy:62,r:7,fill:C.purple},svg);
  const ions=[];for(let i=0;i<6;i++)ions.push(S('circle',{cx:150+i*16,cy:88,r:5,fill:C.green,opacity:.85},svg));
  T(240,95,'ions',{'font-size':11.5,fill:C.green},svg);
  const iClock=T(190,262,'',{'text-anchor':'middle','font-size':14,'font-weight':700,fill:C.orange},svg);
  const mR=S('path',{d:'M450,112 l0,44 m8,-44 l0,44 m8,-44 l0,44 m8,-44 l0,44',stroke:C.blue,'stroke-width':6,'stroke-linecap':'round'},svg);
  const mT=S('circle',{cx:462,cy:62,r:7,fill:C.purple},svg);
  const gP=S('g',{},svg); S('circle',{cx:500,cy:170,r:14,fill:C.teal},gP); T(500,175,'G',{'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#fff'},gP);
  const mL=S('rect',{x:646,y:110,width:20,height:48,rx:5,fill:'#7aa8e0'},svg), mRr=S('rect',{x:674,y:110,width:20,height:48,rx:5,fill:'#7aa8e0'},svg);
  const sm=[];for(let i=0;i<5;i++)sm.push(S('circle',{cx:590,cy:200,r:4,fill:C.gold,opacity:0},svg));
  const mIons=[];for(let i=0;i<5;i++)mIons.push(S('circle',{cx:640+i*14,cy:88,r:5,fill:C.green,opacity:.85},svg));
  T(590,232,'second messengers',{'text-anchor':'middle','font-size':11,fill:'#a07a00'},svg);
  const mClock=T(570,262,'',{'text-anchor':'middle','font-size':14,'font-weight':700,fill:C.blue},svg);
  let busy=false; const tm=[];
  function reset(){tm.forEach(clearTimeout);tm.length=0;[iL,iR,iT,mT,gP,mL,mRr,...ions,...mIons,...sm].forEach(e=>{e.style.transition='none';e.style.transform='';});sm.forEach(s=>s.setAttribute('opacity',0));iClock.textContent='';mClock.textContent='';}
  const at=(ms,fn)=>tm.push(setTimeout(fn,REDUCE?0:ms));
  $('recGo').addEventListener('click',()=>{ if(busy)return; busy=true; reset(); $('recTxt').innerHTML='Watch which side responds first, and which one lasts longer. (The timing is slowed way down.)';
    requestAnimationFrame(()=>{
    tr(iT,0,46,400); tr(mT,0,48,400);
    at(450,()=>{tr(iL,-8,0,200);tr(iR,8,0,200);ions.forEach((c,i)=>tr(c,190-(150+i*16),150+i*6,500+i*60));iClock.textContent='responds in ~1 ms';});
    at(1500,()=>{tr(iL,0,0,300);tr(iR,0,0,300);tr(iT,0,-30,500);iClock.textContent='~1 ms, then over quickly';});
    at(700,()=>{tr(gP,90,0,1200);});
    at(1900,()=>{sm.forEach((s,i)=>{s.setAttribute('opacity',1);tr(s,40+i*10,-20-(i%2)*14,900);});});
    at(2900,()=>{tr(mL,-8,0,300);tr(mRr,8,0,300);mIons.forEach((c,i)=>tr(c,670-(640+i*14),150+i*6,700+i*80));mClock.textContent='slower: tens of ms to seconds';});
    at(4300,()=>{mClock.textContent='…and the effect lasts longer';$('recTxt').innerHTML='<b>Ionotropic</b> (nicotinic ACh, GABA-A, AMPA): fast and brief. <b>Metabotropic</b> (muscarinic ACh, dopamine receptors, most serotonin receptors, GABA-B): slower, longer-lasting, and can change many things inside the cell.';busy=false;});
    });});
}

/* ============ 12. ACh ============ */
{
  const svg=$('achSvg');
  const heartD='M0,-14 C-22,-44 -60,-12 0,34 C60,-12 22,-44 0,-14 Z';
  S('rect',{x:150,y:15,width:90,height:40,rx:10,fill:'#fdebd3',stroke:'#b07a3e'},svg); T(195,40,'motor neuron',{'text-anchor':'middle','font-size':12},svg);
  S('rect',{x:520,y:15,width:90,height:40,rx:10,fill:'#fdebd3',stroke:'#b07a3e'},svg); T(565,40,'vagus nerve',{'text-anchor':'middle','font-size':12},svg);
  T(380,40,'same ACh molecule',{'text-anchor':'middle','font-size':14,'font-weight':700,fill:C.purple},svg);
  const mus=S('g',{style:'transition:transform .25s;transform-origin:195px 150px'},svg);
  S('rect',{x:60,y:120,width:270,height:60,rx:28,fill:'#f3b8b0',stroke:'#a5544a','stroke-width':1.5},mus);
  for(let x=80;x<320;x+=14)S('line',{x1:x,y1:126,x2:x,y2:174,stroke:'#d98d83','stroke-width':2},mus);
  T(195,205,'skeletal muscle',{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
  T(195,224,'nicotinic (ionotropic): Na⁺ in',{'text-anchor':'middle','font-size':12.5,fill:C.orange},svg);
  T(195,242,'→ depolarize → CONTRACT',{'text-anchor':'middle','font-size':12.5,fill:C.orange,'font-weight':700},svg);
  const hg=S('g',{transform:'translate(565,148)'},svg);
  const heart=S('path',{d:heartD,fill:'#e0475b',stroke:'#8f1f2e','stroke-width':2,class:'heart'},hg);
  heart.style.animation='beat .8s infinite';
  const bpm=T(565,205,'75 bpm',{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
  T(565,224,'muscarinic (metabotropic): G protein',{'text-anchor':'middle','font-size':12.5,fill:C.blue},svg);
  T(565,242,'opens K⁺ channels → SLOWER beat',{'text-anchor':'middle','font-size':12.5,fill:C.blue,'font-weight':700},svg);
  const dots=[];[[195,58],[565,58]].forEach(([x,y])=>{for(let i=0;i<5;i++)dots.push({c:S('circle',{cx:x-16+i*8,cy:y,r:4,fill:C.purple,opacity:0},svg),x:x-16+i*8,y});});
  let busy=false;
  $('achGo').addEventListener('click',()=>{ if(busy)return; busy=true;
    dots.forEach(d=>d.c.setAttribute('opacity',1));
    tween(700,k=>dots.forEach(d=>d.c.setAttribute('cy',d.y+k*52)),()=>{
      dots.forEach(d=>d.c.setAttribute('opacity',0));
      mus.style.transform='scaleX(.84)'; setTimeout(()=>mus.style.transform='',450);
      heart.style.animation='beat 1.6s infinite'; bpm.textContent='38 bpm';
      setTimeout(()=>{heart.style.animation='beat .8s infinite';bpm.textContent='75 bpm';busy=false;},4500);});});
}
{
  const svg=$('loewiSvg');
  const heartD='M0,-12 C-18,-36 -50,-10 0,28 C50,-10 18,-36 0,-12 Z';
  /* a heart with a face: awake (big eyes, smile) or sleepy (closed eyes, zzz) */
  const beaker=(x,label)=>{
    S('path',{d:`M${x},40 L${x},200 Q${x},215 ${x+15},215 L${x+185},215 Q${x+200},215 ${x+200},200 L${x+200},40`,fill:'none',stroke:'#8aa','stroke-width':2.5},svg);
    S('rect',{x:x+3,y:80,width:194,height:132,rx:10,fill:'#dff1f7'},svg);
    S('path',{d:`M${x+3},80 q24,-7 48,0 t48,0 t48,0 t48,0`,fill:'none',stroke:'#a9d6e6','stroke-width':2},svg);
    const bub=S('g',{},svg); const r0=rng(x+3);
    for(let i=0;i<6;i++){const c=S('circle',{cx:x+20+r0()*160,cy:200,r:2+r0()*2.5,fill:'#fff',stroke:'#b6dbe8',class:'bubble'},bub);c.style.animationDelay=(-r0()*4).toFixed(2)+'s';}
    const outer=S('g',{transform:`translate(${x+100},150) scale(1.15)`},svg);
    const g=S('g',{class:'heart'},outer); g.style.animation='beat .8s infinite';
    S('path',{d:heartD,fill:'#ef5a6f',stroke:'#8f1f2e','stroke-width':2},g);
    S('path',{d:'M-30,-14 C-32,-22 -24,-27 -18,-24',fill:'none',stroke:'#fff','stroke-width':3,'stroke-linecap':'round',opacity:.7},g);
    const awake=S('g',{},g);
    [-14,14].forEach(ex=>{S('circle',{cx:ex,cy:-4,r:7,fill:'#fff',stroke:'#5a1520','stroke-width':1.2},awake);S('circle',{cx:ex+1.5,cy:-3,r:3.6,fill:'#2a1a1d'},awake);S('circle',{cx:ex+2.8,cy:-4.6,r:1.2,fill:'#fff'},awake);});
    S('path',{d:'M-7,8 Q0,15 7,8',fill:'none',stroke:'#5a1520','stroke-width':2,'stroke-linecap':'round'},awake);
    const sleepy=S('g',{opacity:0},g);
    [-14,14].forEach(ex=>S('path',{d:`M${ex-6},-4 Q${ex},1 ${ex+6},-4`,fill:'none',stroke:'#5a1520','stroke-width':2,'stroke-linecap':'round'},sleepy));
    S('ellipse',{cx:0,cy:10,rx:3,ry:2.4,fill:'#5a1520'},sleepy);
    [-24,24].forEach(cx=>S('ellipse',{cx,cy:7,rx:6,ry:3.4,fill:'#ffb3c0',opacity:.9},g));
    const zz=S('g',{opacity:0},svg);
    [0,1,2].forEach(i=>{const z=T(x+150+i*9,105-i*11,'z',{'font-size':13+i*4,'font-weight':700,fill:'#6a7fa0',class:'zz'},zz);z.style.animationDelay=(i*.5)+'s';});
    T(x+100,238,label,{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
    const b=T(x+100,256,'normal rate',{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);
    const ach=S('g',{opacity:0},svg); const r=rng(x); for(let i=0;i<12;i++)S('circle',{cx:x+20+r()*160,cy:95+r()*105,r:3.5,fill:C.purple},ach);
    const set=slow=>{g.style.animation=slow?'beat 1.8s infinite':'beat .8s infinite';awake.setAttribute('opacity',slow?0:1);sleepy.setAttribute('opacity',slow?1:0);zz.setAttribute('opacity',slow?1:0);};
    return {b,ach,set};};
  const H1=beaker(60,'Heart 1 (with vagus nerve)'), H2=beaker(500,'Heart 2 (no nerve)');
  const nerve=S('path',{d:'M20,20 C80,30 120,90 150,135',fill:'none',stroke:'#d4a017','stroke-width':4,'stroke-linecap':'round'},svg);
  T(14,52,'vagus',{'font-size':11.5,fill:'#9a7410','font-weight':700},svg);T(14,65,'nerve',{'font-size':11.5,fill:'#9a7410','font-weight':700},svg);
  const bolt=T(28,22,'⚡',{'font-size':22,opacity:.25},svg);
  const pipe=S('path',{d:'M250,70 C330,-10 430,-10 510,70',fill:'none',stroke:'#8aa','stroke-width':2,'stroke-dasharray':'6 5'},svg);
  const drop=S('circle',{r:9,fill:'#b9d9ea',stroke:C.purple,'stroke-width':2,opacity:0},svg);
  /* the frog: big eyes that look at whichever heart matters */
  const frog=S('g',{},svg);
  S('ellipse',{cx:380,cy:244,rx:74,ry:13,fill:'#8fd08a',stroke:'#4f9a4c','stroke-width':1.5},frog);
  S('path',{d:'M380,244 L440,236 L446,246 Z',fill:'#dff1f7'},frog);
  const fb=S('g',{},frog);
  [[336,226],[424,226]].forEach(([cx,cy])=>S('ellipse',{cx,cy,rx:24,ry:14,fill:'#5fae5a',stroke:'#3f8a3e','stroke-width':1.5},fb));
  S('ellipse',{cx:380,cy:202,rx:50,ry:40,fill:'#74c46f',stroke:'#3f8a3e','stroke-width':2},fb);
  S('ellipse',{cx:380,cy:215,rx:31,ry:24,fill:'#e2f5cf'},fb);
  [[357,170],[403,170]].forEach(([cx,cy])=>{S('circle',{cx,cy,r:17,fill:'#74c46f',stroke:'#3f8a3e','stroke-width':2},fb);S('circle',{cx,cy:cy-1,r:12,fill:'#fff'},fb);});
  const pupils=[357,403].map(cx=>{const p=S('g',{},fb);S('circle',{cx,cy:170,r:6.5,fill:'#1d2a1c'},p);S('circle',{cx:cx+2.5,cy:167,r:2,fill:'#fff'},p);return p;});
  [[345,197],[415,197]].forEach(([cx,cy])=>S('ellipse',{cx,cy,rx:8,ry:4.5,fill:'#ff9fb0',opacity:.85},fb));
  const mouth=S('path',{d:'M362,196 Q380,210 398,196',fill:'none',stroke:'#2f5d2d','stroke-width':2.4,'stroke-linecap':'round'},fb);
  [[362,240],[398,240]].forEach(([cx,cy])=>S('ellipse',{cx,cy,rx:11,ry:5,fill:'#5fae5a',stroke:'#3f8a3e','stroke-width':1.5},fb));
  const bubG=S('g',{},svg);
  S('rect',{x:296,y:84,width:168,height:34,rx:17,fill:'#fff',stroke:'#3f8a3e','stroke-width':1.6},bubG);
  S('path',{d:'M372,117 L380,131 L388,117',fill:'#fff',stroke:'#3f8a3e','stroke-width':1.6},bubG);
  S('rect',{x:373,y:114,width:14,height:4,fill:'#fff'},bubG);
  const say=T(380,106,'',{'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#2f5d2d'},bubG);
  const look=dx=>pupils.forEach(p=>p.setAttribute('transform',`translate(${dx},${dx?2:0})`));
  const face=mode=>mouth.setAttribute('d',mode==='o'?'M372,200 Q380,212 388,200 Q380,192 372,200':mode==='big'?'M358,194 Q380,218 402,194 Z':'M362,196 Q380,210 398,196');
  const hop=()=>tween(650,k=>fb.setAttribute('transform',`translate(0,${-Math.sin(Math.PI*k)*18})`));
  const reset=()=>{say.textContent='Electrical or chemical?';look(0);face('smile');mouth.setAttribute('fill','none');};
  reset();
  let s1=false, busy=false;
  $('lwStim').addEventListener('click',()=>{ if(busy)return; s1=true;bolt.setAttribute('opacity',1);setTimeout(()=>bolt.setAttribute('opacity',.25),600);
    H1.set(true);H1.b.textContent='SLOWED';H1.ach.setAttribute('opacity',1);
    look(-4);face('o');mouth.setAttribute('fill','#2f5d2d');say.textContent='Heart 1 slowed down!';
    $('lwTxt').innerHTML='Stimulating the vagus nerve slows heart 1. Something (purple dots) was released into its fluid. Was the signal electrical, or a chemical?';});
  $('lwMove').addEventListener('click',()=>{ if(busy)return; if(!s1){say.textContent='Zap heart 1 first!';$('lwTxt').innerHTML='Stimulate heart 1 first, so there is something in its fluid to move.';return;}
    busy=true; drop.setAttribute('opacity',1); say.textContent='Moving the fluid...';
    tween(1300,k=>{const p=along(pipe,ease(k));drop.setAttribute('cx',p.x);drop.setAttribute('cy',p.y);look(-4+8*ease(k));},()=>{drop.setAttribute('opacity',0);busy=false;
      H2.ach.setAttribute('opacity',1);H2.set(true);H2.b.textContent='SLOWED (no nerve touched!)';
      face('big');mouth.setAttribute('fill','#c8343f');say.textContent="It's a chemical! Ribbit!";hop();
      $('lwTxt').innerHTML='<b>Heart 2 slowed too, with no nerve stimulation.</b> A <b>chemical</b> in the fluid carried the message. Loewi called it "vagus substance"; we know it as <b>acetylcholine</b>. That showed nerves communicate <b>chemically</b>.';});});
  $('lwReset').addEventListener('click',()=>{ if(busy)return; s1=false;[H1,H2].forEach(H=>{H.set(false);H.b.textContent='normal rate';H.ach.setAttribute('opacity',0);});reset();$('lwTxt').innerHTML='Both hearts beat at their normal rate.';});
}
{
  const svg=$('pillSvg');
  S('rect',{x:20,y:14,width:180,height:92,rx:16,fill:'#eef1f4',stroke:'#b9c2cb','stroke-width':1.5},svg);
  [[70,60,'#fff7d6','#c9a93a'],[150,60,'#ffffff','#b9b2a6']].forEach(([cx,cy,f,s],i)=>{
    S('ellipse',{cx,cy:cy+4,rx:30,ry:20,fill:'#d6dbe0'},svg);
    S('ellipse',{cx,cy,rx:30,ry:20,fill:f,stroke:s,'stroke-width':1.8},svg);
    S('ellipse',{cx:cx-10,cy:cy-8,rx:9,ry:4,fill:'#fff',opacity:.9},svg);
    T(cx,cy+5,i?'5':'10',{'text-anchor':'middle','font-size':13,'font-weight':700,fill:s},svg);});
  T(110,128,'donepezil (Aricept)',{'text-anchor':'middle','font-size':14,'font-weight':700},svg);
  T(110,145,'tablets, 5 or 10 mg',{'text-anchor':'middle','font-size':12,fill:C.muted},svg);
}
/* ============ 12b. Donepezil and the cholinergic hypothesis ============ */
{
  const svg=$('adSvg'); drawMidsag(svg,true);
  const BF=[240,250];
  const TG=[[118,172,'frontal'],[168,104],[268,70],[384,70],[486,112],[530,196],[424,236,'hip']];
  const ALIVE=[true,false,false,true,false,true,false];
  S('ellipse',{cx:424,cy:236,rx:28,ry:12,fill:C.teal,'fill-opacity':.12,stroke:C.teal,'stroke-dasharray':'5 4','stroke-width':1.6},svg);
  T(458,241,'hippocampus',{'text-anchor':'start','font-size':12,fill:C.teal,'font-weight':700},svg);
  T(442,46,'cortex',{'font-size':12.5,fill:C.muted,'font-weight':700},svg);
  const fibers=TG.map(([x,y],i)=>{const mx=(BF[0]+x)/2-20, my=Math.min(BF[1],y)-10;
    const p=S('path',{d:`M${BF[0]},${BF[1]} Q${mx},${my} ${x},${y}`,fill:'none',stroke:C.purple,'stroke-width':3.2,'stroke-linecap':'round'},svg);
    const halo=S('circle',{cx:x,cy:y,r:9,fill:C.purple,'fill-opacity':.18,stroke:'none'},svg);
    const end=S('circle',{cx:x,cy:y,r:4,fill:C.purple},svg);
    return {p,halo,end};});
  const cells=[[-14,-4],[-5,-10],[6,-6],[-10,6],[2,4],[13,2],[-2,13]].map(([dx,dy])=>S('circle',{cx:BF[0]+dx,cy:BF[1]+dy,r:5,fill:C.purple,stroke:'#fff','stroke-width':1.2},svg));
  T(178,292,'basal forebrain',{'text-anchor':'middle','font-size':12.5,fill:C.purple,'font-weight':700},svg);
  T(178,307,'(nucleus basalis)',{'text-anchor':'middle','font-size':11.5,fill:C.purple},svg);
  const dots=fibers.map(()=>[0,1,2].map(()=>S('circle',{r:3.6,fill:C.gold,stroke:'#7a5a00','stroke-width':.8,opacity:0},svg)));
  /* meters */
  const mt=(x,label1,label2,col)=>{S('rect',{x,y:70,width:44,height:240,rx:10,fill:'#fff',stroke:'#c9c3b6'},svg);
    const bar=S('rect',{x:x+5,width:34,rx:7,fill:col},svg);
    T(x+22,334,label1,{'text-anchor':'middle','font-size':12,'font-weight':700,fill:col},svg);T(x+22,349,label2,{'text-anchor':'middle','font-size':12,'font-weight':700,fill:col},svg);
    const v=T(x+22,60,'',{'text-anchor':'middle','font-size':13,'font-weight':700,fill:col},svg);
    return {bar,v,cur:1};};
  const M1=mt(600,'ACh neurons','still alive',C.purple), M2=mt(680,'ACh signal','in cortex',C.gold);
  const setM=(M,k)=>{M.bar.setAttribute('y',305-230*k);M.bar.setAttribute('height',230*k);M.v.textContent=Math.round(k*100)+'%';};
  const LV={healthy:[1,1],ad:[.4,.35],don:[.4,.62]};
  const TX={healthy:'<b>Healthy brain:</b> a small cluster of <b>cholinergic</b> (ACh-making) neurons in the basal forebrain sends axons to the <b>whole cortex</b> and the <b>hippocampus</b>. The ACh they release (gold dots) helps with attention, learning and memory.',
    ad:'<b>Alzheimer\'s disease:</b> these cholinergic neurons are among the <b>first to die</b> (grey). Less ACh reaches the cortex and hippocampus, and memory and attention get worse. This is the <b>cholinergic hypothesis</b>: part of the memory loss comes from <b>too little ACh</b>. (The underlying disease, with its amyloid plaques and tau tangles, is what kills the neurons.)',
    don:'<b>Alzheimer\'s + donepezil:</b> the lost neurons are <b>still lost</b>. Donepezil can\'t bring them back. It blocks the enzyme that breaks ACh down, so the ACh the <b>surviving</b> neurons release lasts longer and spreads farther (glow at the axon tips). Symptoms improve a little for a while, but the disease keeps progressing.'};
  let mode='healthy', run=false, t=0;
  function style(){const dead=mode!=='healthy';
    fibers.forEach((f,i)=>{const ok=ALIVE[i]||!dead;
      f.p.setAttribute('stroke',ok?C.purple:'#c9c3b6');f.p.setAttribute('stroke-dasharray',ok?'none':'4 7');f.p.setAttribute('opacity',ok?.85:.7);
      f.end.setAttribute('fill',ok?C.purple:'#c9c3b6');
      f.halo.setAttribute('r',ok?(mode==='don'?22:9):0);f.halo.setAttribute('fill-opacity',mode==='don'?.22:.15);});
    cells.forEach((c,i)=>c.setAttribute('fill',dead&&i%5!==0&&i!==3?'#c9c3b6':C.purple));
    $('adTxt').innerHTML=TX[mode];}
  let shown=[1,1];
  function f(){ if(!run)return; t=(t+.005)%1;
    const tgtv=LV[mode]; shown=shown.map((s,i)=>s+(tgtv[i]-s)*.06); setM(M1,shown[0]); setM(M2,shown[1]);
    fibers.forEach((fb,i)=>{const ok=ALIVE[i]||mode==='healthy';
      dots[i].forEach((d,j)=>{const k=(t+j/3+i*.13)%1;const q=along(fb.p,k);d.setAttribute('cx',q.x);d.setAttribute('cy',q.y);d.setAttribute('opacity',ok?1:0);});});
    requestAnimationFrame(f);}
  pressGroup([...document.querySelectorAll('[data-ad]')],b=>{mode=b.dataset.ad;style();if(REDUCE){shown=LV[mode].slice();setM(M1,shown[0]);setM(M2,shown[1]);}});
  setM(M1,1);setM(M2,1); style();
  onVisible(svg,()=>{if(!run){run=true;requestAnimationFrame(f);}},()=>{run=false;});
}
{
  const svg=$('donSvg');
  S('rect',{x:20,y:20,width:640,height:36,fill:'#fdebd3',stroke:'#b07a3e'},svg); T(30,42,'sending (cholinergic) neuron',{'font-size':12,fill:C.muted},svg);
  S('rect',{x:20,y:174,width:640,height:36,fill:'#e3eefb',stroke:'#3c7ea6'},svg); T(30,200,'receiving neuron',{'font-size':12,fill:C.muted},svg);
  const recs=[100,220,340,460,580].map(x=>S('rect',{x:x-10,y:166,width:20,height:10,rx:2,fill:C.blue},svg));
  const ENZ=[[150,110],[280,135],[410,100],[540,130],[620,95]];
  const enz=ENZ.map(([x,y])=>{const g=S('g',{transform:`translate(${x},${y})`},svg);
    S('path',{d:'M0,0 L14,-8 A16,16 0 1,0 14,8 Z',fill:C.gold,stroke:'#a87b00'},g);
    const blk=S('g',{opacity:0},g); S('rect',{x:4,y:-5,width:14,height:10,rx:2,fill:C.red},blk);
    return {g,blk,x,y};});
  T(150,160,'AChE (enzyme)',{'text-anchor':'middle','font-size':11,fill:'#7a5a00'},svg);
  S('rect',{x:690,y:30,width:26,height:170,rx:6,fill:'#fff',stroke:'#bbb'},svg);
  const meter=S('rect',{x:694,width:18,rx:4,fill:C.purple},svg);
  T(703,222,'ACh',{'text-anchor':'middle','font-size':12,fill:C.purple,'font-weight':700},svg);
  const g=S('g',{},svg); const r=rng(9); let ps=[], on=false, run=false, last=0, avg=0;
  function frame(now){ if(!run)return; if(now-last>200){last=now;
      const x=50+r()*600; ps.push({x,y:62,vx:(r()-.5)*1.2,vy:.4+r()*.6,life:0,c:S('circle',{cx:x,cy:62,r:5,fill:C.purple},g)});}
    ps=ps.filter(p=>{p.life++;p.x+=p.vx+(r()-.5)*1.4;p.y+=p.vy+(r()-.5)*1.4;
      if(p.y>160){p.y=160;p.vy=-Math.abs(p.vy);} if(p.y<62){p.y=62;p.vy=Math.abs(p.vy);} if(p.x<25||p.x>655)p.vx*=-1;
      let dead=p.life>(on?520:400);
      if(!on) for(const e of enz){if(Math.hypot(p.x-e.x,p.y-e.y)<20){dead=true;break;}}
      if(dead){p.c.remove();return false;} p.c.setAttribute('cx',p.x);p.c.setAttribute('cy',p.y);return true;});
    avg=avg*.95+ps.length*.05; const h=Math.min(160,avg*4); meter.setAttribute('y',196-h);meter.setAttribute('height',h);
    recs.forEach(rc=>rc.setAttribute('fill',ps.some(p=>p.y>150&&Math.abs(p.x-(+rc.getAttribute('x')+10))<18)?C.green:C.blue));
    requestAnimationFrame(frame);}
  function txt(){$('donTxt').innerHTML=on?'<b>With donepezil:</b> the enzymes are blocked (red), so each ACh molecule lasts longer and more of it builds up in the synapse. The surviving cholinergic neurons get more effect out of the ACh they release. It doesn\'t make new neurons or block reuptake.':'<b>Normally:</b> acetylcholinesterase (yellow) chops ACh into choline + acetate within milliseconds. ACh is <b>not</b> taken back up by a transporter (only the leftover choline is recycled).';}
  $('donTog').addEventListener('click',e=>{on=!on;e.currentTarget.setAttribute('aria-pressed',on);enz.forEach(z=>z.blk.setAttribute('opacity',on?1:0));txt();});
  txt();
  onVisible(svg,()=>{if(!run){run=true;requestAnimationFrame(frame);}},()=>{run=false;});
}

/* ============ 13. Families ============ */
{
  const svg=$('famSvg');
  const tree=S('g',{transform:'translate(70,0)'},svg);
  const node=(x,y,w,t,sub,col,fillc)=>{const g=S('g',{},tree);const r=S('rect',{x:x-w/2,y:y-20,width:w,height:sub?44:34,rx:10,fill:fillc||'#fff',stroke:col,'stroke-width':2},g);
    T(x,y+(sub?0:2),t,{'text-anchor':'middle','font-size':14.5,'font-weight':700,fill:col},g); if(sub)T(x,y+16,sub,{'text-anchor':'middle','font-size':11.5,fill:C.muted},g);return r;};
  const ln=(x1,y1,x2,y2)=>S('line',{x1,y1,x2,y2,stroke:'#b8b1a3','stroke-width':2},tree);
  ln(380,48,230,92);ln(380,48,590,92);ln(230,136,95,166);ln(230,136,240,166);ln(230,136,390,166);ln(590,136,590,166);
  node(380,32,150,'Monoamines',null,C.ink);
  node(230,110,190,'Catecholamines','made from tyrosine',C.blue,'#eef3fb');
  node(590,110,190,'Indolamine','made from tryptophan',C.pink,'#fbeef4');
  node(95,186,120,'Dopamine',null,C.blue);node(240,186,150,'Norepinephrine',null,C.blue);node(390,186,126,'Epinephrine',null,C.blue);
  node(590,186,120,'Serotonin',null,C.pink);
  T(590,226,'monoamine, but NOT a catecholamine',{'text-anchor':'middle','font-size':12.5,fill:C.red,'font-weight':700},tree);
  /* little food drawings */
  const FOOD={
    cheese:g=>{S('path',{d:'M-17,11 L17,11 L17,-3 L-17,-13 Z',fill:'#f7c948',stroke:'#c99a1e','stroke-width':1.4,'stroke-linejoin':'round'},g);
      S('path',{d:'M-17,-13 L17,-3 L17,-6 L-12,-15 Z',fill:'#fbe08a',stroke:'#c99a1e','stroke-width':1.2,'stroke-linejoin':'round'},g);
      [[-7,2,3.2],[7,4,2.6],[1,-4,2],[11,-1,1.6]].forEach(([cx,cy,r])=>S('circle',{cx,cy,r,fill:'#e0aa2a'},g));},
    egg:g=>{S('ellipse',{cx:0,cy:0,rx:11.5,ry:15,fill:'#fffaf0',stroke:'#c9b79a','stroke-width':1.4},g);S('ellipse',{cx:-4,cy:-6,rx:3,ry:4.5,fill:'#fff'},g);},
    fish:g=>{S('path',{d:'M12,0 L22,-8 L22,8 Z',fill:'#6fb3dd',stroke:'#3c7ea6','stroke-width':1.3,'stroke-linejoin':'round'},g);
      S('ellipse',{cx:-2,cy:0,rx:16,ry:9,fill:'#8ec5e8',stroke:'#3c7ea6','stroke-width':1.4},g);S('circle',{cx:-10,cy:-2,r:1.8,fill:'#1d3a52'},g);
      S('path',{d:'M-2,-6 Q2,0 -2,6',fill:'none',stroke:'#3c7ea6','stroke-width':1.1},g);},
    drum:g=>{S('rect',{x:6,y:-3,width:13,height:6,rx:3,fill:'#fffaf0',stroke:'#b8ad99',transform:'rotate(-35)'},g);
      S('circle',{cx:19,cy:-15,r:3.4,fill:'#fffaf0',stroke:'#b8ad99'},g);S('circle',{cx:22,cy:-10,r:3.4,fill:'#fffaf0',stroke:'#b8ad99'},g);
      S('ellipse',{cx:-4,cy:4,rx:15,ry:11,fill:'#c98a4b',stroke:'#8a5a2b','stroke-width':1.4,transform:'rotate(-35 -4 4)'},g);
      S('ellipse',{cx:-8,cy:0,rx:5,ry:2.5,fill:'#e0aa70',transform:'rotate(-35 -8 0)'},g);},
    milk:g=>{S('path',{d:'M-11,-15 L11,-15 L9,15 L-9,15 Z',fill:'#fff',stroke:'#8a9aa6','stroke-width':1.4,'stroke-linejoin':'round'},g);
      S('path',{d:'M-10,-7 L10,-7 L9,15 L-9,15 Z',fill:'#f4f7fb'},g);S('path',{d:'M-10,-7 Q-5,-10 0,-7 T10,-7',fill:'none',stroke:'#c7d3dc','stroke-width':1.2},g);},
    seeds:g=>{[[-9,4,-25],[0,-6,10],[9,5,35]].forEach(([cx,cy,a])=>S('ellipse',{cx,cy,rx:5.5,ry:9,fill:'#e8d9a8',stroke:'#a8925a','stroke-width':1.3,transform:`rotate(${a} ${cx} ${cy})`},g));}
  };
  const am=arrowDef(svg,'fA','#999');
  const pantry=(y,col,bg,items,cap)=>{const g=S('g',{},svg);
    const r=S('rect',{x:10,y:y-38,width:176,height:76,rx:14,fill:bg,stroke:col,'stroke-width':1.6,'stroke-dasharray':'5 4'},g);
    T(98,y-26,'from food',{'text-anchor':'middle','font-size':11,fill:col,'font-weight':700,'letter-spacing':'.08em'},g);
    const icons=items.map((k,i)=>{const ig=S('g',{transform:`translate(${46+i*52},${y+1})`},g);const inner=S('g',{transform:'scale(1.3)'},ig);FOOD[k](inner);return inner;});
    T(98,y+32,cap,{'text-anchor':'middle','font-size':11.5,fill:C.muted},g);
    S('line',{x1:188,y1:y,x2:205,y2:y,stroke:'#999','stroke-width':1.6,'marker-end':am},svg);
    return {r,icons,bg};};
  const F1=pantry(306,C.blue,'#f4f8fd',['cheese','egg','fish'],'cheese, eggs, fish, soy');
  const F2=pantry(392,C.pink,'#fdf4f8',['drum','milk','seeds'],'turkey, milk, oats, seeds');
  const chain1=['Tyrosine','L-DOPA','Dopamine','Norepinephrine','Epinephrine'], chain2=['Tryptophan','5-HTP','Serotonin'];
  const mk=(arr,y,col)=>{let cx=210,prev=null;return arr.map(t=>{const w=Math.max(80,t.length*8+24);const r=S('rect',{x:cx,y:y-14,width:w,height:28,rx:14,fill:'#fff',stroke:col,'stroke-width':1.6},svg);
    T(cx+w/2,y+5,t,{'text-anchor':'middle','font-size':12.5},svg); if(prev!==null)S('line',{x1:prev,y1:y,x2:cx-3,y2:y,stroke:'#999','stroke-width':1.6,'marker-end':am},svg); prev=cx+w; cx+=w+28; return r;});};
  const R1=mk(chain1,306,C.blue), R2=mk(chain2,392,C.pink);
  T(210,280,'catecholamine line',{'font-size':12,fill:C.blue,'font-weight':700},svg); T(210,366,'serotonin line',{'font-size':12,fill:C.pink,'font-weight':700},svg);
  let busy=false;
  const wiggle=F=>{F.r.setAttribute('fill',F.bg==='#f4f8fd'?'#dbe8f8':'#f8dbe8');
    F.icons.forEach((ic,i)=>setTimeout(()=>tween(420,k=>ic.setAttribute('transform',`translate(0,${-Math.sin(Math.PI*k)*9})`)),REDUCE?0:i*110));};
  $('famGo').addEventListener('click',()=>{ if(busy)return; busy=true; [...R1,...R2].forEach(r=>r.setAttribute('fill','#fff'));
    [F1,F2].forEach(F=>F.r.setAttribute('fill',F.bg));
    const lit=(arr,col,i,done)=>{ if(i>=arr.length){done&&done();return;} arr[i].setAttribute('fill',col); setTimeout(()=>lit(arr,col,i+1,done),REDUCE?0:450);};
    wiggle(F1); setTimeout(()=>lit(R1,'#d7e6fa',0,()=>{wiggle(F2);setTimeout(()=>lit(R2,'#f8d9e7',0,()=>busy=false),REDUCE?0:500);}),REDUCE?0:500);});
  const DR=[['LSD / psilocybin','Serotonin: activate <b>5-HT2A</b> receptors (agonists). Not dopamine!',true],
    ['Cocaine','Blocks reuptake transporters for dopamine, norepinephrine and serotonin.'],
    ['Amphetamine','Makes dopamine and norepinephrine transporters run in reverse, pushing transmitter out.'],
    ['SSRIs (e.g., fluoxetine)','Block the <b>serotonin reuptake</b> transporter.'],
    ['Haloperidol','Blocks <b>dopamine D2</b> receptors (antagonist).'],
    ['Benzodiazepines','Boost <b>GABA-A</b> receptors (more Cl⁻ in when GABA binds).'],
    ['Alcohol','Boosts <b>GABA-A</b> and blocks <b>NMDA</b> glutamate receptors.'],
    ['Naloxone (Narcan)','<b>Mu-opioid</b> antagonist: binds tightly (high affinity) but doesn\'t activate the receptor (no efficacy).'],
    ['Nicotine','Activates <b>nicotinic acetylcholine</b> receptors.'],
    ['Donepezil','Blocks <b>acetylcholinesterase</b>, so ACh lasts longer.'],
    ['MAO inhibitors','Block the enzyme that breaks down monoamines (serotonin, NE, dopamine).'],
    ['Caffeine','Blocks <b>adenosine</b> receptors.']];
  const grid=$('drugGrid');
  DR.forEach(([n,a,star])=>{const b=document.createElement('button');b.className='drug'+(star?' star':'');b.setAttribute('aria-expanded','false');
    b.innerHTML='<span class="dn">'+n+'</span><span class="dq">What does it target? Click to check.</span><span class="da">'+a+'</span>';
    b.addEventListener('click',()=>b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')!=='true'));grid.appendChild(b);});
}

/* ============ 14. Dopamine pathways ============ */
{
  const svg=$('daSvg'); drawMidsag(svg,true);
  const tgt={striatal:[300,203],limbic:[250,240],cortical:[130,165]};
  S('ellipse',{cx:300,cy:203,rx:40,ry:20,fill:C.blue,'fill-opacity':.15,stroke:C.blue,'stroke-dasharray':'5 4','stroke-width':1.8},svg);
  T(300,177,'striatum',{'text-anchor':'middle','font-size':12.5,fill:C.blue,'font-weight':700},svg);
  S('circle',{cx:250,cy:240,r:13,fill:C.pink,'fill-opacity':.25,stroke:C.pink,'stroke-width':1.8},svg);
  T(196,232,'nucleus',{'text-anchor':'end','font-size':12,fill:C.pink,'font-weight':700},svg);T(196,246,'accumbens',{'text-anchor':'end','font-size':12,fill:C.pink,'font-weight':700},svg);
  S('ellipse',{cx:130,cy:165,rx:46,ry:36,fill:C.purple,'fill-opacity':.13,stroke:C.purple,'stroke-width':1.8},svg);
  T(130,120,'prefrontal cortex',{'text-anchor':'middle','font-size':12.5,fill:C.purple,'font-weight':700},svg);
  const P={striatal:S('path',{d:'M380,256 C392,222 340,200 300,203',fill:'none','stroke-width':5,stroke:C.blue,'stroke-linecap':'round'},svg),
    limbic:S('path',{d:'M356,262 C320,270 285,258 250,240',fill:'none','stroke-width':5,stroke:C.pink,'stroke-linecap':'round'},svg),
    cortical:S('path',{d:'M356,262 C300,290 200,280 165,220 C155,200 145,185 132,168',fill:'none','stroke-width':5,stroke:C.purple,'stroke-linecap':'round'},svg)};
  const sn=S('circle',{cx:380,cy:256,r:7,fill:'#222'},svg), vta=S('circle',{cx:356,cy:262,r:7,fill:'#555'},svg);
  T(420,240,'substantia nigra',{'font-size':12,'font-weight':700},svg); S('line',{x1:418,y1:236,x2:386,y2:252,stroke:'#555'},svg);
  T(300,312,'VTA',{'font-size':12,'font-weight':700,'text-anchor':'end'},svg); S('line',{x1:303,y1:308,x2:350,y2:267,stroke:'#555'},svg);
  const xs=S('g',{opacity:0},svg); Object.values(tgt).forEach(([x,y])=>T(x,y+8,'✗',{'text-anchor':'middle','font-size':26,fill:C.red,'font-weight':700},xs));
  const dots=[];for(let i=0;i<3;i++)dots.push(S('circle',{r:5,fill:C.gold,stroke:'#222',opacity:0},svg));
  const TX={striatal:'<b>Mesostriatal (nigrostriatal):</b> substantia nigra → striatum (part of the basal ganglia). <b>Job:</b> starting and smoothing voluntary movement. Lose it → Parkinson\'s. Block it → tremor and rigidity.',
    limbic:'<b>Mesolimbic:</b> VTA → nucleus accumbens. <b>Job:</b> reward, motivation, "wanting." Too much activity here is linked to psychosis (hallucinations, delusions), and addictive drugs hijack it. Blocking D2 here is how antipsychotics help.',
    cortical:'<b>Mesocortical:</b> VTA → prefrontal cortex. <b>Job:</b> attention, planning, working memory. Blocking it can worsen flat mood and thinking problems.'};
  let cur='striatal', hal=false, pd=false, run=false, t=0;
  function txt(){let s=TX[cur];
    if(hal)s='<b>Haloperidol blocks D2 in all three pathways at once:</b><br>• Mesolimbic → fewer hallucinations and delusions (<b>the goal</b>)<br>• Mesostriatal → tremor, stiffness, restlessness (<b>side effects that look like Parkinson\'s</b>)<br>• Mesocortical → can dull motivation and thinking';
    if(pd)s='<b>Parkinson\'s disease:</b> the substantia nigra neurons of the <b>mesostriatal</b> pathway die, so the striatum is starved of dopamine and movements are hard to start. The reward pathway (VTA) is mostly a separate system.'+(hal?'<br><br>'+s:'');
    $('daTxt').innerHTML=s;}
  function style(){Object.entries(P).forEach(([k,p])=>{p.setAttribute('opacity',k===cur||hal?1:.18);p.setAttribute('stroke-dasharray',pd&&k==='striatal'?'3 9':'none');});
    sn.setAttribute('fill',pd?'#ccc':'#222'); xs.setAttribute('opacity',hal?1:0); txt();}
  pressGroup([...document.querySelectorAll('[data-d]')],b=>{cur=b.dataset.d;style();});
  $('daHal').addEventListener('click',e=>{hal=!hal;e.currentTarget.setAttribute('aria-pressed',hal);style();});
  $('daPd').addEventListener('click',e=>{pd=!pd;e.currentTarget.setAttribute('aria-pressed',pd);style();});
  function f(){ if(!run)return; t=(t+.006)%1; const p=P[cur]; const off=pd&&cur==='striatal';
    dots.forEach((d,i)=>{const k=(t+i/3)%1;const q=along(p,k);d.setAttribute('cx',q.x);d.setAttribute('cy',q.y);d.setAttribute('opacity',off?.15:1);});
    requestAnimationFrame(f);}
  style(); if(!REDUCE) onVisible(svg,()=>{if(!run){run=true;requestAnimationFrame(f);}},()=>{run=false;});
}

/* ============ 15. Dose-response ============ */
function plotFrame(svg,lo,hi,yLabel){
  const X0=80,X1=650,Y0=290,Y1=30;
  const x=d=>X0+(Math.log10(d)-lo)/(hi-lo)*(X1-X0), y=e=>Y0-e/100*(Y0-Y1);
  S('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'#888'},svg);S('line',{x1:X0,y1:Y0,x2:X0,y2:Y1,stroke:'#888'},svg);
  for(let p=lo;p<=hi;p++){const v=Math.pow(10,p);S('line',{x1:x(v),y1:Y0,x2:x(v),y2:Y0+5,stroke:'#888'},svg);T(x(v),Y0+20,v>=1?v.toLocaleString():String(v),{'text-anchor':'middle','font-size':12,fill:C.muted},svg);}
  T((X0+X1)/2,Y0+40,'dose (mg, log scale)',{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);
  [0,50,100].forEach(e=>{T(X0-8,y(e)+4,e+'%',{'text-anchor':'end','font-size':12,fill:C.muted},svg);S('line',{x1:X0,y1:y(e),x2:X1,y2:y(e),stroke:'#eee'},svg);});
  const yl=T(0,0,yLabel,{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);yl.setAttribute('transform',`translate(24,${(Y0+Y1)/2}) rotate(-90)`);
  return {x,y,lo,hi,curve(ed,emax,n){let d='';for(let i=0;i<=200;i++){const lg=lo+(hi-lo)*i/200, v=Math.pow(10,lg), e=emax*Math.pow(v,n)/(Math.pow(v,n)+Math.pow(ed,n));d+=(i?'L':'M')+x(v).toFixed(1)+','+y(e).toFixed(1);}return d;}};
}
{
  const svg=$('drSvg'); const F=plotFrame(svg,-1,3,'effect (% of max)'); const n=1.6;
  S('path',{d:F.curve(10,100,n),fill:'none',stroke:'#aaa','stroke-width':2,'stroke-dasharray':'6 5'},svg);
  T(F.x(10)-6,F.y(50)-8,'reference',{'text-anchor':'end','font-size':11.5,fill:'#999'},svg);
  const vline=S('line',{stroke:C.orange,'stroke-dasharray':'3 3','stroke-width':1.6},svg), hline=S('line',{stroke:C.orange,'stroke-dasharray':'3 3','stroke-width':1.6},svg);
  const edT=T(0,0,'',{'font-size':12.5,fill:C.orange,'font-weight':700,'text-anchor':'middle'},svg);
  const path=S('path',{fill:'none',stroke:C.ink,'stroke-width':3.5},svg);
  const plat=T(645,0,'',{'font-size':12,fill:C.green,'text-anchor':'end','font-weight':700},svg);
  let ed=10,em=100;
  const ST={reset:[10,100,'The reference drug: <b>ED50 = 10 mg</b> (the dose that gives half of the maximum effect). The flat top is the <b>plateau</b>, where adding more drug no longer increases the effect.'],
    potent:[2,100,'<b>More potent:</b> the curve moves <b>left</b>, so just 2 mg gives a half-max effect. Less drug is needed. The maximum is unchanged, so efficacy is the same.'],
    weak:[50,100,'<b>Less potent:</b> the curve moves <b>right</b>, so you need 50 mg for the same effect. It can still reach the same maximum (same efficacy).'],
    tol:[40,100,'<b>Tolerance:</b> after repeated use the same dose does less, so the curve shifts <b>right</b>. The maximum is usually still reachable, but only with more drug.'],
    sens:[3,100,'<b>Sensitization:</b> repeated, intermittent use makes the same dose do <b>more</b> (like a stimulant causing more and more movement), so the curve shifts <b>left</b>.'],
    partial:[10,55,'<b>Partial agonist:</b> it binds and activates the receptor, but even a huge dose can\'t reach the full effect. A <b>lower plateau = lower efficacy</b>.']};
  function draw(){path.setAttribute('d',F.curve(ed,em,n));const xx=F.x(ed),yy=F.y(em/2);
    vline.setAttribute('x1',xx);vline.setAttribute('x2',xx);vline.setAttribute('y1',yy);vline.setAttribute('y2',290);
    hline.setAttribute('x1',80);hline.setAttribute('x2',xx);hline.setAttribute('y1',yy);hline.setAttribute('y2',yy);
    edT.setAttribute('x',xx);edT.setAttribute('y',306-26);edT.textContent='ED50 = '+(ed<10?ed.toFixed(1):Math.round(ed));
    plat.setAttribute('y',F.y(em)-8);plat.textContent='plateau = max effect ('+Math.round(em)+'%)';}
  document.querySelectorAll('[data-r]').forEach(b=>b.addEventListener('click',()=>{const [e2,m2,t]=ST[b.dataset.r];const e1=ed,m1=em;
    tween(650,k=>{const q=ease(k);ed=Math.pow(10,Math.log10(e1)+(Math.log10(e2)-Math.log10(e1))*q);em=m1+(m2-m1)*q;draw();});$('drTxt').innerHTML=t;}));
  draw(); $('drTxt').innerHTML=ST.reset[2];
}
{
  const svg=$('tiSvg'); const F=plotFrame(svg,-1,4,'% of people');
  const shade=S('rect',{y:30,height:260,fill:C.green,opacity:.1},svg);
  const eP=S('path',{fill:'none',stroke:C.green,'stroke-width':3.5},svg), lP=S('path',{fill:'none',stroke:C.red,'stroke-width':3.5},svg);
  const eT=T(0,0,'helped (effective)',{'font-size':12.5,fill:C.green,'font-weight':700},svg), lT=T(0,0,'killed (lethal)',{'font-size':12.5,fill:C.red,'font-weight':700},svg);
  const gapT=T(0,60,'',{'text-anchor':'middle','font-size':13,'font-weight':700,fill:C.green},svg);
  const D={x:[10,1000,'<b>Drug X:</b> TI = 1,000 ÷ 10 = <b>100</b>. A huge gap between the helpful dose and the lethal one, so it\'s much safer.'],
    y:[10,40,'<b>Drug Y:</b> TI = 40 ÷ 10 = <b>4</b>. The <i>same ED50</i>, but the lethal dose is close by. A small mistake can be fatal. Same potency doesn\'t mean same safety.'],
    barb:[30,150,'<b>Barbiturate-like:</b> a narrow therapeutic index. The calming dose isn\'t far from the dose that shuts down breathing, which is why overdoses were common in the 1950s.'],
    benzo:[5,5000,'<b>Benzodiazepine-like:</b> a very wide therapeutic index on its own, which is why benzos replaced barbiturates. (Mixing with alcohol changes that: see topic 16.)']};
  let e=10,l=1000;
  function draw(){eP.setAttribute('d',F.curve(e,100,2));lP.setAttribute('d',F.curve(l,100,2.5));
    shade.setAttribute('x',F.x(e));shade.setAttribute('width',Math.max(0,F.x(l)-F.x(e)));
    eT.setAttribute('x',F.x(e)-120);eT.setAttribute('y',F.y(80));lT.setAttribute('x',Math.min(F.x(l)+8,560));lT.setAttribute('y',F.y(30));
    gapT.setAttribute('x',(F.x(e)+F.x(l))/2);gapT.textContent='TI = '+Math.round(l/e).toLocaleString();}
  pressGroup([...document.querySelectorAll('[data-t]')],b=>{const [e2,l2,t]=D[b.dataset.t];const e1=e,l1=l;
    tween(650,k=>{const q=ease(k);e=Math.pow(10,Math.log10(e1)+(Math.log10(e2)-Math.log10(e1))*q);l=Math.pow(10,Math.log10(l1)+(Math.log10(l2)-Math.log10(l1))*q);draw();});$('tiTxt').innerHTML=t;});
  draw(); $('tiTxt').innerHTML=D.x[2];
}

/* ============ 16. Opioid gap, alcohol, stacking ============ */
{
  const svg=$('opSvg'); const F=plotFrame(svg,0,3,'effect (% of max)');
  const hP=S('path',{fill:'none',stroke:C.purple,'stroke-width':3.5},svg), rP=S('path',{fill:'none',stroke:C.red,'stroke-width':3.5},svg);
  S('path',{d:F.curve(10,100,2),fill:'none',stroke:C.purple,'stroke-width':1.5,'stroke-dasharray':'4 4',opacity:.5},svg);
  const hT=T(0,0,'the high / pain relief',{'font-size':12.5,fill:C.purple,'font-weight':700},svg);
  const rT=T(0,0,'breathing suppression',{'font-size':12.5,fill:C.red,'font-weight':700},svg);
  const v=S('line',{y1:30,y2:290,stroke:C.ink,'stroke-dasharray':'4 3'},svg);
  const vT=T(0,22,'',{'font-size':12,'text-anchor':'middle','font-weight':700},svg);
  const dot=S('circle',{r:7,fill:C.red,stroke:'#fff','stroke-width':2},svg);
  const dT=T(0,0,'',{'font-size':12.5,fill:C.red,'font-weight':700},svg);
  function upd(){const m=+$('opSlide').value;$('opOut').textContent=m;
    const eh=10*(1+.55*m), er=120*(1+.03*m);
    hP.setAttribute('d',F.curve(eh,100,2)); rP.setAttribute('d',F.curve(er,100,2));
    hT.setAttribute('x',F.x(eh)-150);hT.setAttribute('y',F.y(75)); rT.setAttribute('x',Math.min(F.x(er)+10,520));rT.setAttribute('y',F.y(45));
    const dose=eh, risk=100*dose*dose/(dose*dose+er*er);
    v.setAttribute('x1',F.x(dose));v.setAttribute('x2',F.x(dose)); vT.setAttribute('x',F.x(dose)); vT.textContent='dose for the same high: '+Math.round(dose)+' mg';
    dot.setAttribute('cx',F.x(dose));dot.setAttribute('cy',F.y(risk)); dT.setAttribute('x',F.x(dose)+12);dT.setAttribute('y',F.y(risk)-8);dT.textContent=risk.toFixed(1)+'% breathing suppression';
    const gap=er/eh;
    $('opTxt').innerHTML=m===0?'<b>First use:</b> the high takes about <b>10 mg</b>, while breathing suppression doesn\'t start in earnest until around <b>120 mg</b>. That\'s a <b>12×</b> safety gap. Drag the slider to see what tolerance does to it.':'<b>After '+m+' month'+(m>1?'s':'')+':</b> the high now takes <b>'+Math.round(dose)+' mg</b> (the purple curve slid right), but the breathing curve has barely moved. The gap between the two curves shrank from <b>12×</b> to <b>'+gap.toFixed(1)+'×</b>. Chasing the same high puts the user much closer to the dose that stops breathing.';}
  $('opSlide').addEventListener('input',upd); upd();
}
{
  const svg=$('alSvg'); const X0=80,X1=650,Y0=250,Y1=30;
  const x=b=>X0+b/.4*(X1-X0), y=e=>Y0-e/100*(Y0-Y1);
  S('rect',{x:x(.3),y:Y1,width:X1-x(.3),height:Y0-Y1,fill:C.red,opacity:.08},svg);
  T(x(.35),Y1+16,'danger: brainstem',{'text-anchor':'middle','font-size':11.5,fill:C.red,'font-weight':700},svg);
  T(x(.35),Y1+30,'(breathing) depressed',{'text-anchor':'middle','font-size':11.5,fill:C.red},svg);
  S('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'#888'},svg);S('line',{x1:X0,y1:Y0,x2:X0,y2:Y1,stroke:'#888'},svg);
  [0,.08,.1,.2,.3,.4].forEach(b=>{S('line',{x1:x(b),y1:Y0,x2:x(b),y2:Y0+5,stroke:'#888'},svg);T(x(b),Y0+19,b.toFixed(2),{'text-anchor':'middle','font-size':11.5,fill:C.muted},svg);});
  T(x(.08),Y0+33,'US driving limit',{'text-anchor':'middle','font-size':10.5,fill:C.muted},svg);
  T((X0+X1)/2,Y0+46,'blood alcohol concentration (BAC)',{'text-anchor':'middle','font-size':12.5,fill:C.muted},svg);
  const brk=b=>100/(1+Math.pow(b/.04,2.5)), act=b=>100/(1+Math.pow(b/.18,3)), liv=b=>act(b)*(.45+.55*(1-brk(b)/100));
  const line=(fn,col,w,dash)=>{let d='';for(let i=0;i<=200;i++){const b=.4*i/200;d+=(i?'L':'M')+x(b).toFixed(1)+','+y(fn(b)).toFixed(1);}return S('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-dasharray':dash||'none'},svg);};
  line(brk,C.purple,2.5,'6 4'); line(act,C.blue,2.5,'2 4'); line(liv,C.orange,4);
  T(x(.045)+6,y(brk(.045))-6,'prefrontal "brakes"',{'font-size':12,fill:C.purple,'font-weight':700},svg);
  T(x(.24),y(act(.24))-30,'overall brain activity',{'font-size':12,fill:C.blue,'font-weight':700},svg);
  T(x(.1)+14,y(liv(.1))-10,'how lively behavior looks',{'font-size':12,fill:C.orange,'font-weight':700},svg);
  const m=S('line',{y1:Y1,y2:Y0,stroke:C.ink,'stroke-width':1.5},svg);
  const pts=[C.purple,C.blue,C.orange].map(c=>S('circle',{r:6,fill:c,stroke:'#fff','stroke-width':2},svg));
  function upd(){const b=+$('alSlide').value;$('alOut').textContent=b.toFixed(2);
    m.setAttribute('x1',x(b));m.setAttribute('x2',x(b));[brk,act,liv].forEach((fn,i)=>{pts[i].setAttribute('cx',x(b));pts[i].setAttribute('cy',y(fn(b)));});
    let t;
    if(b<.015)t='<b>Sober:</b> the prefrontal cortex is keeping behavior in check.';
    else if(b<.1)t='<b>Low dose:</b> alcohol is already <i>depressing</i> neurons, but the prefrontal "brakes" (self-control circuits) are quieted first, and reward circuits release some dopamine. With the brakes off, people get talkative, impulsive and take more risks. It <i>looks</i> like stimulation, but it\'s <b>disinhibition</b>.';
    else if(b<.2)t='<b>Moderate to high:</b> now overall brain activity is clearly dropping: slowed reactions, poor coordination (cerebellum), slurred speech, memory gaps.';
    else if(b<.3)t='<b>Very high:</b> heavy sedation, confusion, possible blackout. Everything is slowed.';
    else t='<b>Life-threatening:</b> the brainstem centers that drive breathing are depressed. This is how alcohol poisoning kills.';
    $('alTxt').innerHTML=t;}
  $('alSlide').addEventListener('input',upd); upd();
  T(80,18,'Illustrative curves, not exact values.',{'font-size':10.5,fill:C.muted},svg);
}
{
  const svg=$('stSvg'); const X0=150,X1=640, x=p=>X0+p/100*(X1-X0);
  S('rect',{x:X0,y:40,width:X1-X0,height:110,fill:'#fbfaf6',stroke:C.line},svg);
  S('line',{x1:x(80),y1:28,x2:x(80),y2:165,stroke:C.red,'stroke-width':2.5,'stroke-dasharray':'6 4'},svg);
  T(x(80),20,'breathing danger',{'text-anchor':'middle','font-size':12.5,fill:C.red,'font-weight':700},svg);
  T(X0-10,100,'CNS depression',{'text-anchor':'end','font-size':13,'font-weight':700},svg);
  const bA=S('rect',{x:X0,y:70,height:50,fill:C.gold,rx:4,style:'transition:width .6s'},svg);
  const bB=S('rect',{y:70,height:50,fill:C.purple,rx:4,style:'transition:width .6s, x .6s'},svg);
  const tA=T(0,100,'alcohol',{'font-size':13,fill:'#fff','font-weight':700,'text-anchor':'middle'},svg), tB=T(0,100,'benzo',{'font-size':13,fill:'#fff','font-weight':700,'text-anchor':'middle'},svg);
  
  function set(k){const a=k!=='b'?45:0, bb=k!=='a'?42:0, extra=k==='ab'?8:0;
    bA.setAttribute('width',x(a)-X0); bB.setAttribute('x',x(a)); bB.setAttribute('width',x(bb+extra)-X0);
    tA.setAttribute('x',X0+(x(a)-X0)/2); tA.setAttribute('opacity',a?1:0); tB.setAttribute('x',x(a)+(x(bb+extra)-X0)/2); tB.setAttribute('opacity',bb?1:0);
    $('stTxt').innerHTML=k==='ab'?'<b>Together:</b> both drugs enhance GABA-A receptors (alcohol also blocks NMDA), so their depressant effects stack on the same system. Each dose alone stays below the danger line, but combined they push CNS depression past it, suppressing breathing and protective reflexes. (Values are illustrative.)':k==='a'?'<b>Alcohol alone</b> at this dose: sedating, but below the breathing-danger line.':'<b>Benzodiazepine alone</b> at a normal dose: calming, with a wide safety margin.';}
  pressGroup([...document.querySelectorAll('[data-s]')],b=>set(b.dataset.s)); set('ab');
}

/* embed copy */
$('copyBtn').addEventListener('click',()=>{const t=$('embedCode').textContent;if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>{$('copyBtn').textContent='Copied';setTimeout(()=>$('copyBtn').textContent='Copy',1500);},()=>{});});
})();
