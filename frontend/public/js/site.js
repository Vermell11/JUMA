/* ============================================================
   Interacciones del sitio
   ============================================================ */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- i18n ---------- */
  const I18N={
    es:{
      'nav.about':'Nosotros','nav.impact':'Impacto','nav.programs':'Programas',
      'nav.gallery':'Galería','nav.donate':'Donar','nav.contact':'Contacto',
      'nav.donateCta':'Donar ahora',
    },
    en:{
      'nav.about':'About','nav.impact':'Impact','nav.programs':'Programs',
      'nav.gallery':'Gallery','nav.donate':'Give','nav.contact':'Contact',
      'nav.donateCta':'Donate now',
    }
  };
  let lang=localStorage.getItem('juma_lang')||'es';
  function applyLang(l){
    lang=l; localStorage.setItem('juma_lang',l);
    document.documentElement.lang=l;
    document.querySelectorAll('[data-es]').forEach(el=>{
      const v=el.getAttribute('data-'+l);
      if(v!=null){
        if(el.hasAttribute('data-attr')) el.setAttribute(el.getAttribute('data-attr'),v);
        else el.innerHTML=v;
      }
    });
    document.querySelectorAll('[data-'+l+'-alt]').forEach(el=>{
      const v=el.getAttribute('data-'+l+'-alt'); if(v!=null)el.setAttribute('alt',v);
    });
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); const v=I18N[l]&&I18N[l][k];
      if(v!=null)el.textContent=v;
    });
    document.querySelectorAll('.lang [data-flag]').forEach(s=>{
      s.classList.toggle('active', s.getAttribute('data-flag')===l);
    });
    const lt=document.querySelector('.lang__txt'); if(lt)lt.textContent=l==='es'?'EN':'ES';
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-lang-toggle]');
    if(b){applyLang(lang==='es'?'en':'es');}
  });

  /* ---------- header solid on scroll ---------- */
  const header=document.querySelector('.site-header');
  const progress=document.querySelector('.scroll-progress span');
  const hero=document.querySelector('.hero');
  const about=document.querySelector('#nosotros');
  const clamp01=(v)=>Math.min(1,Math.max(0,v));
  const smooth=(v)=>v*v*(3-2*v);
  const mobileQuery=window.matchMedia('(max-width: 920px)');
  const cssCache=new Map();
  const setRootVar=(name,value)=>{
    if(cssCache.get(name)===value)return;
    cssCache.set(name,value);
    document.documentElement.style.setProperty(name,value);
  };
  let ticking=false;
  function updateScrollEffects(){
    ticking=false;
    if(header) header.classList.toggle('solid', window.scrollY>60);
    if(progress){
      const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      setRootVar('--scroll-pct',(window.scrollY/max).toFixed(4));
    }
    if(hero&&!reduce){
      const rect=hero.getBoundingClientRect();
      const span=Math.max(1,hero.offsetHeight-window.innerHeight);
      const k=Math.min(1,Math.max(0,-rect.top/span));
      const e=smooth(clamp01(k/.9));
      const late=clamp01((k-.72)/.28);
      const lateEase=smooth(late);
      const isMobile=mobileQuery.matches;
      if(window.__jumaHeroCamera) window.__jumaHeroCamera(isMobile ? 0 : e);
      setRootVar('--hero-copy-y',`${(-e*54).toFixed(1)}px`);
      setRootVar('--hero-copy-opacity',Math.max(0,1-lateEase*1.28).toFixed(3));
      setRootVar('--hero-scene-opacity',Math.max(0,1-lateEase*.92).toFixed(3));
      setRootVar('--hero-blue-opacity',lateEase.toFixed(3));
    }
    if(about&&!reduce){
      const r=about.getBoundingClientRect();
      const p=clamp01((window.innerHeight-r.top)/(window.innerHeight*.92));
      const head=smooth(clamp01((p-.04)/.46));
      const lead=smooth(clamp01((p-.12)/.5));
      setRootVar('--about-head-opacity',head.toFixed(3));
      setRootVar('--about-lead-opacity',lead.toFixed(3));
      setRootVar('--about-head-y',`${((1-head)*18).toFixed(1)}px`);
      setRootVar('--about-lead-y',`${((1-lead)*16).toFixed(1)}px`);
      setRootVar('--about-head-blur',`${((1-head)*4).toFixed(1)}px`);
      setRootVar('--about-lead-blur',`${((1-lead)*3).toFixed(1)}px`);
    }
  }
  function onScroll(){
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(updateScrollEffects);
  }
  window.addEventListener('scroll',onScroll,{passive:true}); updateScrollEffects();
  window.addEventListener('resize',()=>{cssCache.clear(); updateScrollEffects();},{passive:true});

  /* ---------- mobile menu ---------- */
  const menu=document.querySelector('.mobile-menu');
  const menuBtn=document.querySelector('[data-menu-toggle]');
  if(menuBtn) menuBtn.setAttribute('aria-expanded','false');
  function setMenu(open){
    if(!menu)return;
    menu.classList.toggle('open',open);
    if(menuBtn) menuBtn.setAttribute('aria-expanded',open?'true':'false');
    document.body.classList.toggle('menu-open',open);
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-menu-toggle]')) setMenu(!menu.classList.contains('open'));
    else if(e.target.closest('.mobile-menu a')) setMenu(false);
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menu&&menu.classList.contains('open')) setMenu(false);
  });

  /* ---------- scroll reveal ---------- */
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{ if(reduce)el.classList.add('in'); else io.observe(el); });

  /* ---------- section choreography ---------- */
  const choreoGroups=[
    '.mv .mv__item',
    '.prog-list .prog',
    '.impact__row .impact__stat',
    '.tiers .tier',
    '.mosaic figure',
    '.contact-grid .cinfo',
  ];
  choreoGroups.forEach(sel=>{
    document.querySelectorAll(sel).forEach((el,i)=>{
      el.classList.add('choreo-item');
      el.style.setProperty('--stagger', i);
    });
  });
  if(reduce){
    document.querySelectorAll('.has-doodles').forEach(el=>el.classList.add('doodles-in'));
    document.querySelectorAll('.choreo-item').forEach(el=>el.classList.add('in'));
  }else{
    const sectionIo=new IntersectionObserver((ents)=>{
      ents.forEach(en=>{
        if(!en.isIntersecting)return;
        en.target.classList.add('doodles-in');
        en.target.querySelectorAll('.choreo-item').forEach(el=>el.classList.add('in'));
        sectionIo.unobserve(en.target);
      });
    },{threshold:0.14,rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('.has-doodles,.prog-list,.mv,.impact__row,.tiers,.mosaic,.contact-grid').forEach(el=>sectionIo.observe(el));
  }

  /* ---------- counters ---------- */
  function animateCount(el){
    const target=parseFloat(el.getAttribute('data-count'));
    const dur=1500, t0=performance.now();
    const dec=(el.getAttribute('data-dec')|0);
    function step(t){
      const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3);
      const val=target*e;
      el.textContent=dec?val.toFixed(dec):Math.round(val).toLocaleString('es-CO');
      if(k<1)requestAnimationFrame(step);
      else el.textContent=dec?target.toFixed(dec):target.toLocaleString('es-CO');
    }
    if(reduce){el.textContent=dec?target.toFixed(dec):target.toLocaleString('es-CO');return;}
    requestAnimationFrame(step);
  }
  const cio=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ animateCount(en.target); cio.unobserve(en.target);} });
  },{threshold:0.6});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  /* ---------- donate tiers ---------- */
  document.querySelectorAll('[data-tiers]').forEach(group=>{
    const story=document.querySelector('.donate-story__line');
    const syncStory=(tier)=>{
      if(!story||!tier)return;
      const text=tier.getAttribute(`data-story-${lang}`);
      if(text) story.textContent=text;
    };
    group.querySelectorAll('.tier').forEach(t=>{
      t.addEventListener('click',()=>{
        group.querySelectorAll('.tier').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        syncStory(t);
      });
    });
    group._syncStory=()=>syncStory(group.querySelector('.tier.active'));
    group._syncStory();
  });

  /* ---------- copy buttons + toast ---------- */
  let toast=document.querySelector('.toast');
  function showToast(msg){
    if(!toast)return;
    toast.querySelector('.toast__msg').textContent=msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t=setTimeout(()=>toast.classList.remove('show'),2100);
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-copy]');
    if(!b)return;
    const val=b.getAttribute('data-copy');
    const done=()=>showToast(lang==='es'?'Copiado: '+val:'Copied: '+val);
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(val).then(done).catch(()=>{fallback(val);done();});
    } else {fallback(val);done();}
  });
  function fallback(text){
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);
  }

  /* ---------- testimonials ---------- */
  const tWrap=document.querySelector('[data-testi]');
  if(tWrap){
    const data=JSON.parse(tWrap.getAttribute('data-testi'));
    const qEl=tWrap.querySelector('.testi__q');
    const nEl=tWrap.querySelector('.testi__name');
    const rEl=tWrap.querySelector('.testi__role');
    const avEl=tWrap.querySelector('.testi__avatar');
    const dots=tWrap.querySelectorAll('.testi__dot');
    let idx=0,timer=null;
    function show(i){
      idx=(i+data.length)%data.length; const d=data[idx];
      qEl.style.opacity=0;
      setTimeout(()=>{
        qEl.innerHTML='“'+d['q_'+lang]+'”';
        nEl.textContent=d.name; rEl.textContent=d['role_'+lang]; avEl.textContent=d.name[0];
        qEl.style.opacity=1;
      },180);
      dots.forEach((dt,j)=>dt.classList.toggle('active',j===idx));
    }
    dots.forEach((dt,j)=>dt.addEventListener('click',()=>{show(j);restart();}));
    function restart(){ if(reduce)return; clearInterval(timer); timer=setInterval(()=>show(idx+1),6000); }
    tWrap._refresh=()=>show(idx);
    show(0); restart();
    window.__testiRefresh=tWrap._refresh;
  }

  /* ---------- lightbox ---------- */
  const lb=document.querySelector('.lightbox');
  if(lb){
    const imgEl=lb.querySelector('img');
    const figs=[...document.querySelectorAll('.mosaic figure')];
    let cur=0;
    function open(i){
      cur=(i+figs.length)%figs.length;
      const src=figs[cur].getAttribute('data-full')||figs[cur].querySelector('img').src;
      imgEl.src=src;
      lb.classList.add('open'); document.body.style.overflow='hidden';
    }
    function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    figs.forEach((f,i)=>f.addEventListener('click',()=>open(i)));
    lb.querySelector('.lb-close').addEventListener('click',close);
    lb.querySelector('.lb-next').addEventListener('click',()=>open(cur+1));
    lb.querySelector('.lb-prev').addEventListener('click',()=>open(cur-1));
    lb.addEventListener('click',e=>{ if(e.target===lb)close(); });
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close();
      else if(e.key==='ArrowRight')open(cur+1);
      else if(e.key==='ArrowLeft')open(cur-1);
    });
  }

  /* apply language last (after testi wired) */
  const _orig=applyLang;
  applyLang=function(l){
    _orig(l);
    document.querySelectorAll('[data-tiers]').forEach(group=>{ if(group._syncStory)group._syncStory(); });
    if(window.__testiRefresh)window.__testiRefresh();
  };
  applyLang(lang);
})();
