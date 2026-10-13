
document.addEventListener('DOMContentLoaded', function(){

  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  if(burger){
    burger.addEventListener('click', function(){
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', function(){
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40){ header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  });

  const revealEls = document.querySelectorAll('.reveal, .about-headline h2');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el=>observer.observe(el));

  document.querySelectorAll('.service-tile').forEach(tile=>{
    tile.addEventListener('click', function(){
      if(window.matchMedia('(hover: none)').matches){
        document.querySelectorAll('.service-tile').forEach(t=>{
          if(t!==tile) t.classList.remove('is-open-touch');
        });
        tile.classList.toggle('is-open-touch');
      }
    });
  });

  const rotWrap = document.querySelector('.rotating-word');
  if(rotWrap){
    const inner = rotWrap.querySelector('.rw-inner');
    const measure = rotWrap.querySelector('.rw-measure');
    const words = JSON.parse(inner.dataset.words || '[]');
    let wIndex = 0;

    function setWidth(word){
      // On mobile the word is a block, no fixed width necessary
      if(window.innerWidth <= 768){
        rotWrap.style.width = 'auto';
        return;
      }
      measure.textContent = word;
      const w = measure.getBoundingClientRect().width;
      rotWrap.style.width = w + 'px';
    }
    setWidth(words[0]);
    window.addEventListener('resize', ()=>setWidth(inner.textContent));

    if(words.length > 1){
      setInterval(()=>{
        inner.classList.add('rw-fade');
        setTimeout(()=>{
          wIndex = (wIndex + 1) % words.length;
          const nextWord = words[wIndex];
          setWidth(nextWord);
          inner.textContent = nextWord;
          inner.classList.remove('rw-fade');
        }, 400);
      }, 2600);
    }
  }

  // Desktop category selector: left tabs + right fixed-height panel
  const catTabs = document.querySelectorAll('.category-tab');
  const catPanels = document.querySelectorAll('.category-panel');
  if(catTabs.length){
    let activeIndex = 0;
    let autoTimer = null;
    const AUTO_MS = 5500;

    function activate(index){
      activeIndex = index;
      catTabs.forEach((t,i)=>t.classList.toggle('active', i===index));
      catPanels.forEach((p,i)=>p.classList.toggle('active-panel', i===index));
    }

    function restartAuto(){
      clearTimeout(autoTimer);
      autoTimer = setTimeout(()=>{
        activate((activeIndex + 1) % catTabs.length);
        restartAuto();
      }, AUTO_MS);
    }

    catTabs.forEach((tab, i)=>{
      tab.addEventListener('click', ()=>{
        activate(i);
        restartAuto();
      });
    });

    activate(0);
    restartAuto();

    const selector = document.querySelector('.category-selector');
    selector.addEventListener('mouseenter', ()=>clearTimeout(autoTimer));
    selector.addEventListener('mouseleave', ()=>restartAuto());
  }

  // Mobile category accordion
  document.querySelectorAll('.cat-acc-item').forEach(item=>{
    const head = item.querySelector('.cat-acc-head');
    head.addEventListener('click', function(){
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.cat-acc-item').forEach(i=>i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });
  const firstAcc = document.querySelector('.cat-acc-item');
  if(firstAcc) firstAcc.classList.add('open');

  const teamTrack = document.querySelector('.opt-team-track');
  if(teamTrack){
    const originalCards = Array.from(teamTrack.children);
    const total = originalCards.length;
    originalCards.forEach(card=>{
      teamTrack.appendChild(card.cloneNode(true));
    });

    let index = 0;
    const dotsWrap = document.querySelector('.opt-team-dots');
    const numDots = total;
    dotsWrap.innerHTML = '';
    for(let i=0;i<numDots;i++){
      const dot = document.createElement('button');
      dot.type = 'button';
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', ()=>goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.querySelectorAll('button');

    function cardWidth(){
      return teamTrack.children[0].getBoundingClientRect().width;
    }

    function render(withTransition){
      teamTrack.style.transition = withTransition ? '' : 'none';
      const offset = index * cardWidth();
      teamTrack.style.transform = `translateX(-${offset}px)`;
      if(!withTransition){
        requestAnimationFrame(()=>{ teamTrack.style.transition = ''; });
      }
    }

    function updateDots(){
      const activeDot = index % numDots;
      dots.forEach((d,i)=>d.classList.toggle('active', i===activeDot));
    }

    function goTo(i){
      index = i;
      updateDots();
      render(true);
    }

    function next(){
      index++;
      updateDots();
      render(true);
      if(index >= total){
        setTimeout(()=>{
          index = 0;
          render(false);
        }, 580);
      }
    }

    function prev(){
      if(index <= 0){
        index = total;
        render(false);
        requestAnimationFrame(()=>{
          index = total - 1;
          updateDots();
          render(true);
        });
      } else {
        index--;
        updateDots();
        render(true);
      }
    }

    document.querySelector('.opt-team-next').addEventListener('click', next);
    document.querySelector('.opt-team-prev').addEventListener('click', prev);

    window.addEventListener('resize', ()=>{
      render(false);
    });

    render(false);

    let autoplay = setInterval(next, 5500);
    const wrapEl = document.querySelector('.opt-team-wrapper');
    wrapEl.addEventListener('mouseenter', ()=>clearInterval(autoplay));
    wrapEl.addEventListener('mouseleave', ()=>{ autoplay = setInterval(next, 5500); });
  }

  const blogGrid = document.querySelector('.blog-grid[data-paginate]');
  if(blogGrid){
    const cards = Array.from(blogGrid.children);
    const perPage = 3;
    const totalPages = Math.ceil(cards.length / perPage);
    const pagWrap = document.querySelector('.blog-pagination');

    function showPage(p){
      cards.forEach((c,i)=>{
        c.style.display = (i >= (p-1)*perPage && i < p*perPage) ? '' : 'none';
      });
      pagWrap.querySelectorAll('button').forEach(b=>{
        b.classList.toggle('active', parseInt(b.dataset.page)===p);
      });
    }

    if(pagWrap && totalPages > 1){
      pagWrap.innerHTML = '';
      for(let p=1;p<=totalPages;p++){
        const b = document.createElement('button');
        b.textContent = p;
        b.dataset.page = p;
        b.addEventListener('click', ()=>showPage(p));
        pagWrap.appendChild(b);
      }
      showPage(1);
    }
  }

  const contactForm = document.querySelector('.contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Wysyłanie...';
      setTimeout(()=>{
        btn.innerHTML = 'Wysłano';
        contactForm.reset();
        setTimeout(()=>{ btn.innerHTML = originalText; }, 2500);
      }, 900);
    });
  }

});

// Services index page: filter by ?cat=prawne or ?cat=podatkowe
(function(){
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const prawneSection = document.getElementById('sekcja-prawne');
  const podatkoweSection = document.getElementById('sekcja-podatkowe');
  if(prawneSection && podatkoweSection){
    if(cat === 'prawne'){
      podatkoweSection.style.display = 'none';
    } else if(cat === 'podatkowe'){
      prawneSection.style.display = 'none';
    }
  }
})();
