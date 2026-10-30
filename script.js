(() => {
  const $ = (s) => document.querySelector(s);
  const calma = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== SPLASH: aparece por 3 segundos ===== */
  const splash = $('#splash'), cv = $('#confete'), ctx = cv.getContext('2d'), spGato = $('#spGato');
  const cores = ['#b012e6', '#4ae0e0', '#2f6bff', '#f5b82e', '#b79bff', '#ffffff'];
  let parts = [], rodando = true, fim;
  const ajusta = () => { cv.width = innerWidth; cv.height = innerHeight; };
  ajusta(); addEventListener('resize', ajusta);
  const estoura = (x, y, n = 28) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 6;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, r: 3 + Math.random() * 5, c: cores[i % cores.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .4, vida: 90 + Math.random() * 40 });
    }
  };
  const anima = () => {
    if (!rodando) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    // confete caindo suave o tempo todo
    if (!calma && Math.random() < .25) parts.push({ x: Math.random() * cv.width, y: -10, vx: (Math.random() - .5) * 1.2, vy: 1 + Math.random() * 1.6, r: 3 + Math.random() * 4, c: cores[(Math.random() * cores.length) | 0], rot: 0, vr: (Math.random() - .5) * .2, vida: 260, leve: 1 });
    parts = parts.filter((p) => p.vida-- > 0);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; if (!p.leve) p.vy += .18; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.vida / 40);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); ctx.restore();
    });
    requestAnimationFrame(anima);
  };
  anima();
  // interação: o gato olha para o dedo/mouse e pula com clique, soltando confete
  splash.addEventListener('pointermove', (e) => {
    const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2;
    spGato.style.translate = `${x * 14}px ${y * 8}px`;
  });
  spGato.addEventListener('click', (e) => {
    spGato.classList.remove('pula'); void spGato.offsetWidth; spGato.classList.add('pula');
    const r = spGato.getBoundingClientRect(); estoura(r.left + r.width / 2, r.top + r.height / 3, 40);
  });
  splash.addEventListener('pointerdown', (e) => estoura(e.clientX, e.clientY, 14));
  setTimeout(() => estoura(innerWidth / 2, innerHeight * .35, 36), 700);

  const fecha = () => {
    clearTimeout(fim);
    splash.classList.add('sai'); document.body.classList.remove('carregando');
    setTimeout(() => { rodando = false; splash.remove(); }, 600);
  };
  fim = setTimeout(fecha, 3000);
  $('#pular').addEventListener('click', fecha);

  /* ===== HERO: gato acompanha o cursor ===== */
  const hero = $('.hero'), fig = $('.figura'), halo = $('#halo'), titulo = $('#titulo');
  const balao = $('#balao'), gato = $('#gato'), num = $('#num');
  let alvoX = 0, alvoY = 0, x = 0, y = 0;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    alvoX = ((e.clientX - r.left) / r.width - .5) * 2; alvoY = ((e.clientY - r.top) / r.height - .5) * 2;
  });
  hero.addEventListener('pointerleave', () => { alvoX = 0; alvoY = 0; });
  const loop = () => {
    x += (alvoX - x) * .08; y += (alvoY - y) * .08;
    fig.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translate(${x * 10}px, ${y * 8}px)`;
    halo.style.transform = `translate(calc(-50% + ${-x * 30}px), calc(-50% + ${-y * 22}px))`;
    titulo.style.transform = `translate(calc(-50% + ${x * 16}px), calc(-50% + ${y * 8}px))`;
    requestAnimationFrame(loop);
  };
  if (!calma) loop();

  const falas = ['Olá! Vamos estudar hoje?', 'Variável é como uma caixa com etiqueta.', 'Errar faz parte. Tente de novo!',
    'Estudar um pouco por dia vale mais que muito de uma vez.', 'Já fez seus exercícios de hoje?', 'Mantenha sua ofensiva!'];
  let i = -1, t, n = 1;
  gato.addEventListener('click', () => {
    i = (i + 1) % falas.length; balao.textContent = falas[i]; balao.classList.add('on');
    gato.classList.remove('pula'); void gato.offsetWidth; gato.classList.add('pula');
    n++; num.textContent = String(n).padStart(2, '0'); num.classList.add('bump'); setTimeout(() => num.classList.remove('bump'), 250);
    clearTimeout(t); t = setTimeout(() => balao.classList.remove('on'), 3200);
  });

  const jo = $('#joinha');
  jo.addEventListener('click', () => { jo.classList.remove('pula'); void jo.offsetWidth; jo.classList.add('pula'); });
  jo.addEventListener('animationend', (e) => { if (e.animationName === 'pulo2') jo.classList.remove('pula'); });

  /* ===== Carrossel ===== */
  const car = $('#carrossel'), passo = () => car.querySelector('figure').offsetWidth + 28;
  $('#prev').onclick = () => car.scrollBy({ left: -passo(), behavior: 'smooth' });
  $('#next').onclick = () => car.scrollBy({ left: passo(), behavior: 'smooth' });
  car.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') car.scrollBy({ left: passo(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') car.scrollBy({ left: -passo(), behavior: 'smooth' });
  });
  let down = false, sx = 0, sl = 0;
  car.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = car.scrollLeft; car.style.scrollSnapType = 'none'; });
  addEventListener('pointerup', () => { if (down) { down = false; car.style.scrollSnapType = ''; } });
  addEventListener('pointermove', (e) => { if (down) car.scrollLeft = sl - (e.clientX - sx); });

  /* ===== Menu: mobile e link ativo ===== */
  const b = $('#burger'), m = $('#menu');
  b.onclick = () => b.setAttribute('aria-expanded', m.classList.toggle('aberto'));
  m.addEventListener('click', () => { m.classList.remove('aberto'); b.setAttribute('aria-expanded', 'false'); });
  const links = [...m.querySelectorAll('a')];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
})();
