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
  function onScroll(){
    if(header) header.classList.toggle('solid', window.scrollY>60);
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- mobile menu ---------- */
  const menu=document.querySelector('.mobile-menu');
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-menu-toggle]')) menu.classList.toggle('open');
    else if(e.target.closest('.mobile-menu a')) menu.classList.remove('open');
  });

  /* ---------- scroll reveal ---------- */
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{ if(reduce)el.classList.add('in'); else io.observe(el); });

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
    group.querySelectorAll('.tier').forEach(t=>{
      t.addEventListener('click',()=>{
        group.querySelectorAll('.tier').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
      });
    });
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
  applyLang=function(l){ _orig(l); if(window.__testiRefresh)window.__testiRefresh(); };
  applyLang(lang);
})();
