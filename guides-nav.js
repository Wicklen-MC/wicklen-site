(() => {
  const links = [...document.querySelectorAll('.nav-shell a[href^="#"]')];
  const sections = links.map(link => ({link, section: document.getElementById(link.hash.slice(1))})).filter(item => item.section);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const offset = document.querySelector('.nav-shell').getBoundingClientRect().height + 32;
    let current = sections[0];
    for (const item of sections) if (item.section.getBoundingClientRect().top <= offset) current = item;
    for (const item of sections) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  };
  addEventListener('scroll', () => {if (!scheduled) {scheduled = true;requestAnimationFrame(update);}}, {passive:true});
  addEventListener('resize', update);addEventListener('hashchange', update);update();
})();
