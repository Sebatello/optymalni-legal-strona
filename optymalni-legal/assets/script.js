
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

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn=>{
    btn.addEventListener('click', function(){
      tabBtns.forEach(b=>b.classList.remove('active'));
      tabPanels.forEach(p=>p.classList.remove('active-panel'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active-panel');
    });
  });

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
      measure.textContent = word;
      const w = measure.getBoundingClientRect().width;
      rotWrap.style.width = w + 'px';
    }
    setWidth(words[0]);

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

  const contactForm = document.querySelector('.contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Wysyłanie...';
      setTimeout(()=>{
        btn.innerHTML = 'Wysłano ✓';
        contactForm.reset();
        setTimeout(()=>{ btn.innerHTML = originalText; }, 2500);
      }, 900);
    });
  }

});
