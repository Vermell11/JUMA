/* ============================================================
   Hero · "El mundo que dibujan"
   Dibujo infantil a crayón. Dos capas de animación:
   · AMBIENTE  — movimiento continuo y suave (sol, nubes, pájaros,
     corazones, flores, niños que respiran). CSS keyframes.
   · ENTRADA   — el paisaje se traza con el scroll; los niños,
     corazones y flores entran creciendo desde el suelo al cruzar
     su umbral. JS.
   ============================================================ */
(function(){
  const stage=document.getElementById('inicio');
  if(!stage)return;
  const svg=stage.querySelector('.hero__draw');
  if(!svg)return;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const NS='http://www.w3.org/2000/svg';
  const INK='#34424E';

  function el(tag,attrs,kids){
    const e=document.createElementNS(NS,tag);
    for(const k in attrs) e.setAttribute(k,attrs[k]);
    if(kids) kids.forEach(c=>e.appendChild(c));
    return e;
  }
  // outline path that "draws on" with scroll
  function ink(d,w,extra){
    return el('path',Object.assign({d:d,class:'ink','data-w':w,fill:'none',stroke:INK,
      'stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round'},extra||{}));
  }
  // landscape group that fades + scales in with scroll
  function pop(w){ return el('g',{class:'fill pop','data-w':w}); }
  // group that enters (grows from the ground) when scroll passes its threshold
  function entrance(th,delay){ return el('g',{class:'enter','data-th':String(th),
    style:'transition-delay:'+(delay||0)+'s'}); }

  const root=el('g',{});

  /* ---------- SUN (ambient bob + ray pulse, rises on scroll) ---------- */
  const cx=1342, cy=224, r=92;
  const sunBob=el('g',{class:'amb-sunbob'});
  const riser=el('g',{'data-rise':'78'});
  riser.appendChild(el('circle',{cx:cx,cy:cy,r:r,class:'fill','data-w':'0.16,0.28',fill:'#FFC84D',stroke:INK,'stroke-width':5}));
  let rays='';
  for(let i=0;i<10;i++){const a=i*Math.PI/5;
    const x1=cx+Math.cos(a)*(r+18),y1=cy+Math.sin(a)*(r+18);
    const x2=cx+Math.cos(a)*(r+52),y2=cy+Math.sin(a)*(r+52);
    rays+=`M${x1.toFixed(0)},${y1.toFixed(0)} L${x2.toFixed(0)},${y2.toFixed(0)} `;}
  riser.appendChild(el('g',{class:'amb-rays'},[ink(rays,'0.14,0.24',{stroke:'#F2A91E','stroke-width':6})]));
  riser.appendChild(ink(`M${cx-30},${cy-8} h0.1 M${cx+30},${cy-8} h0.1`,'0.24,0.31',{stroke:'#A9690A','stroke-width':11}));
  riser.appendChild(ink(`M${cx-30},${cy+22} q30,30 60,0`,'0.25,0.32',{stroke:'#A9690A','stroke-width':6}));
  sunBob.appendChild(riser);
  root.appendChild(sunBob);

  /* ---------- CLOUDS (ambient drift) ---------- */
  function cloud(x,y,s,w){
    const g=pop(w);
    [[0,8,42],[-44,16,30],[44,16,32],[-20,-14,30],[24,-12,28]].forEach(p=>
      g.appendChild(el('ellipse',{cx:x+p[0]*s,cy:y+p[1]*s,rx:p[2]*s,ry:p[2]*s*0.8,fill:'#FFFFFF',stroke:INK,'stroke-width':4})));
    g.appendChild(el('rect',{x:x-78*s,y:y+2*s,width:156*s,height:24*s,fill:'#FFFFFF'}));
    return g;
  }
  root.appendChild(el('g',{class:'amb-cloud1'},[cloud(1010,150,1,'0.2,0.32')]));
  root.appendChild(el('g',{class:'amb-cloud2'},[cloud(1240,250,0.7,'0.24,0.36')]));

  /* ---------- BIRDS (ambient bob) ---------- */
  root.appendChild(el('g',{class:'amb-bird'},[
    ink('M740,214 q15,-15 30,0 q15,-15 30,0 M838,184 q13,-13 26,0 q13,-13 26,0 M690,256 q12,-12 24,0 q12,-12 24,0','0.28,0.38',{'stroke-width':5})
  ]));

  /* ---------- HILLS ---------- */
  const backHillD='M0,602 Q420,540 820,576 T1600,556 L1600,1000 L0,1000 Z';
  const frontHillD='M0,716 Q540,656 1040,700 T1600,684 L1600,1000 L0,1000 Z';
  root.appendChild(el('path',{d:backHillD,class:'fill','data-w':'0.02,0.14',fill:'#A9D08A'}));
  root.appendChild(ink('M0,602 Q420,540 820,576 T1600,556','0.0,0.1',{'stroke-width':5}));

  /* ---------- HOUSES + CHURCH ---------- */
  function house(o){
    const g=pop(o.w);
    g.appendChild(el('rect',{x:o.x,y:o.y,width:o.bw,height:o.bh,rx:4,fill:o.wall,stroke:INK,'stroke-width':5}));
    g.appendChild(el('polygon',{points:`${o.x-12},${o.y} ${o.x+o.bw/2},${o.y-o.rh} ${o.x+o.bw+12},${o.y}`,fill:o.roof,stroke:INK,'stroke-width':5,'stroke-linejoin':'round'}));
    g.appendChild(el('rect',{x:o.x+o.bw/2-19,y:o.y+o.bh-52,width:38,height:52,rx:3,fill:o.door,stroke:INK,'stroke-width':4}));
    g.appendChild(el('rect',{x:o.x+14,y:o.y+18,width:26,height:26,rx:3,fill:'#FBF7EF',stroke:INK,'stroke-width':4}));
    return g;
  }
  root.appendChild(house({x:556,y:500,bw:140,bh:108,rh:62,w:'0.26,0.37',wall:'#F2906F',roof:'#D9694B',door:'#7A4A36'}));
  root.appendChild(house({x:1296,y:516,bw:124,bh:96,rh:56,w:'0.31,0.42',wall:'#FBD24D',roof:'#E0A92E',door:'#7A4A36'}));
  (function(){
    const g=pop('0.35,0.48'); const x=1010,y=470,bw=150,bh=140;
    g.appendChild(el('rect',{x:x,y:y,width:bw,height:bh,rx:4,fill:'#FCFAF4',stroke:INK,'stroke-width':5}));
    g.appendChild(el('polygon',{points:`${x-12},${y} ${x+bw/2},${y-70} ${x+bw+12},${y}`,fill:'#2E6DA6',stroke:INK,'stroke-width':5,'stroke-linejoin':'round'}));
    g.appendChild(el('path',{d:`M${x+bw/2},${y-70} L${x+bw/2},${y-118} M${x+bw/2-16},${y-100} L${x+bw/2+16},${y-100}`,stroke:INK,'stroke-width':6,'stroke-linecap':'round',fill:'none'}));
    g.appendChild(el('path',{d:`M${x+bw/2-24},${y+bh} L${x+bw/2-24},${y+bh-58} a24,24 0 0 1 48,0 L${x+bw/2+24},${y+bh} Z`,fill:'#2E6DA6',stroke:INK,'stroke-width':4}));
    g.appendChild(el('circle',{cx:x+bw/2,cy:y+34,r:15,fill:'#9FCBEC',stroke:INK,'stroke-width':4}));
    root.appendChild(g);
  })();

  // front hill (kids stand here)
  root.appendChild(el('path',{d:frontHillD,class:'fill','data-w':'0.08,0.2',fill:'#83BD5C'}));
  root.appendChild(ink('M0,716 Q540,656 1040,700 T1600,684','0.06,0.16',{'stroke-width':5}));

  /* ---------- FLOWERS (ambient sway · enter) ---------- */
  function flower(x,yBase,col,th,delay){
    const g=entrance(th,delay);
    g.appendChild(el('path',{d:`M${x},${yBase} L${x},${yBase-58}`,stroke:'#3E7D3A','stroke-width':5,'stroke-linecap':'round',fill:'none'}));
    const py=yBase-66;
    [[0,-16],[15,-5],[9,13],[-9,13],[-15,-5]].forEach(p=>g.appendChild(el('circle',{cx:x+p[0],cy:py+p[1],r:11,fill:col,stroke:INK,'stroke-width':3.5})));
    g.appendChild(el('circle',{cx:x,cy:py,r:8,fill:'#FBD24D',stroke:INK,'stroke-width':3.5}));
    return el('g',{class:'amb-flower',style:'animation-delay:'+delay+'s'},[g]);
  }
  root.appendChild(flower(316,968,'#E86A8E',0.72,0));
  root.appendChild(flower(1196,980,'#7C9BE0',0.78,0.6));
  root.appendChild(flower(1452,966,'#F2906F',0.84,0.3));

  /* ---------- CHILDREN holding hands (ambient bob · enter from ground) ---------- */
  const kids=[
    {x:602,skin:'#E7B488',shirt:'#E53935'},
    {x:754,skin:'#C98A57',shirt:'#0077C8'},
    {x:906,skin:'#8F5E38',shirt:'#F2B705'},
    {x:1058,skin:'#DDA46F',shirt:'#22A39A'}
  ];
  kids.forEach((k,i)=>{
    const g=entrance(0.54+i*0.06, i*0.05);
    const x=k.x;
    g.appendChild(el('path',{d:`M${x-12},862 L${x-16},892 M${x+12},862 L${x+16},892`,stroke:INK,'stroke-width':5,'stroke-linecap':'round',fill:'none'}));
    g.appendChild(el('path',{d:`M${x-76},812 L${x},782 L${x+76},812`,stroke:INK,'stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',fill:'none'}));
    g.appendChild(el('circle',{cx:x-76,cy:812,r:7,fill:k.skin,stroke:INK,'stroke-width':3.5}));
    g.appendChild(el('circle',{cx:x+76,cy:812,r:7,fill:k.skin,stroke:INK,'stroke-width':3.5}));
    g.appendChild(el('polygon',{points:`${x-34},864 ${x},760 ${x+34},864`,fill:k.shirt,stroke:INK,'stroke-width':5,'stroke-linejoin':'round'}));
    g.appendChild(el('circle',{cx:x,cy:724,r:34,fill:k.skin,stroke:INK,'stroke-width':5}));
    g.appendChild(el('path',{d:`M${x-12},718 h0.1 M${x+12},718 h0.1`,stroke:INK,'stroke-width':8,'stroke-linecap':'round',fill:'none'}));
    g.appendChild(el('path',{d:`M${x-13},734 q13,12 26,0`,stroke:INK,'stroke-width':4.5,'stroke-linecap':'round',fill:'none'}));
    root.appendChild(el('g',{class:'amb-kid',style:'animation-delay:'+(i*0.55).toFixed(2)+'s'},[g]));
  });

  /* ---------- HEARTS (ambient float · enter) ---------- */
  function heart(x,y,s,th,delay){
    const g=entrance(th,delay);
    g.appendChild(el('path',{d:'M0,9 C0,-5 -20,-6 -20,8 C-20,19 -6,26 0,33 C6,26 20,19 20,8 C20,-6 0,-5 0,9 Z',
      transform:`translate(${x},${y}) scale(${s})`,fill:'#E5556B',stroke:INK,'stroke-width':4}));
    return el('g',{class:'amb-heart',style:'animation-delay:'+delay+'s'},[g]);
  }
  root.appendChild(heart(812,604,1,0.78,0));
  root.appendChild(heart(1006,560,0.7,0.84,0.5));

  svg.appendChild(root);

  /* ================= animation wiring ================= */
  const inks=[...svg.querySelectorAll('.ink')];
  const fills=[...svg.querySelectorAll('.fill')];
  const pops=[...svg.querySelectorAll('.pop')];
  const enters=[...svg.querySelectorAll('.enter')];
  inks.forEach(e=>{e.style.strokeDasharray='1 1';});
  pops.forEach(p=>{p.style.transformBox='fill-box';p.style.transformOrigin='50% 92%';});

  const clamp=v=>v<0?0:v>1?1:v;
  const win=n=>n.dataset.w.split(',').map(Number);
  const easeBack=t=>{const c=2.70158;return t<=0?0:t>=1?1:1+c*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2);};

  function setP(p){
    inks.forEach(e=>{if(!e.dataset.w)return;const[s,en]=win(e);const k=clamp((p-s)/(en-s));e.style.strokeDashoffset=String(1-k);});
    fills.forEach(e=>{const[s,en]=win(e);e.style.opacity=clamp((p-s)/(en-s));});
    pops.forEach(g=>{const[s,en]=win(g);const k=clamp((p-s)/(en-s));g.style.opacity=k;g.style.transform=`scale(${(0.82+0.18*easeBack(k)).toFixed(3)})`;});
    enters.forEach(g=>{ if(p>=+g.dataset.th) g.classList.add('go'); });
    if(riser){const k=clamp((p-0.05)/0.5);riser.setAttribute('transform',`translate(0,${((1-k)*78).toFixed(1)})`);}
  }

  function progress(){
    if(reduce)return 1;
    const total=stage.offsetHeight-window.innerHeight;
    if(total<=0)return 1;
    return clamp((-stage.getBoundingClientRect().top)/total);
  }

  if(reduce){
    inks.forEach(e=>{e.style.strokeDashoffset='0';});
    fills.forEach(e=>{e.style.opacity='1';});
    pops.forEach(g=>{g.style.opacity='1';g.style.transform='scale(1)';});
    enters.forEach(g=>g.classList.add('go'));
    if(riser)riser.setAttribute('transform','translate(0,0)');
    return;
  }

  // autonomous opening: the landscape draws itself to ~0.5, then scroll reveals the children
  setP(0);
  const easeOut=t=>1-Math.pow(1-t,3);
  let introVal=0, introStart=null;
  function render(){ setP(Math.max(introVal, progress())); }
  function introLoop(ts){
    if(introStart==null)introStart=ts;
    const k=Math.min(1,(ts-introStart)/2000);
    introVal=easeOut(k)*0.5;
    render();
    if(k<1) requestAnimationFrame(introLoop);
  }
  let raf=null;
  const onScroll=()=>{ if(raf)return; raf=requestAnimationFrame(()=>{raf=null;render();}); };
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  requestAnimationFrame(introLoop);
})();
