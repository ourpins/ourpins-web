/* An illustrative neighborhood map. Cache the streets and trees; only the
   dotted route is redrawn while the cover is in view. */
(() => {
  const board = document.querySelector('.pin-board');
  if (!board) return;
  const canvas = board.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const art = document.createElement('canvas');
  art.width = canvas.width;
  art.height = canvas.height;
  const pen = art.getContext('2d');
  if (pen) {
    pen.fillStyle = '#fff9e6';
    pen.fillRect(0, 0, 750, 600);
    pen.save();
    pen.rotate(-.17);
    const blocks = ['#f4dfaa', '#fae9b9', '#e9e8c7', '#f4dcc4', '#f4e7b7'];
    for (let y = -2; y < 9; y++) {
      for (let x = -2; x < 10; x++) {
        const left = x * 103 + (y % 2) * 22;
        const top = y * 85;
        pen.fillStyle = blocks[Math.abs(x * 7 + y * 3) % blocks.length];
        pen.beginPath(); pen.roundRect(left, top, 88, 70, 10); pen.fill();
        pen.fillStyle = '#fff5d7';
        pen.fillRect(left + 14, top + 12, 23, 17);
        pen.fillRect(left + 45, top + 32, 25, 22);
      }
    }
    pen.restore();
    pen.lineCap = 'round';
    function stroke(path, color, width) {
      pen.strokeStyle = color; pen.lineWidth = width; pen.stroke(new Path2D(path));
    }
    const river = 'M575 -60 C460 85 775 90 707 258 S475 358 585 502 S717 613 729 675';
    stroke(river, '#daf4da', 100);
    stroke(river, '#acddea', 75);
    stroke(river, '#c7eaf0', 3);
    const avenue = 'M-30 430 Q125 280 353 360 T800 280';
    stroke(avenue, '#ead9aa', 23); stroke(avenue, '#fffbea', 17);
    for (const [x,y,r] of [[40,410,60],[136,530,48],[447,90,47],[713,493,44]]) {
      pen.fillStyle = '#b6dba4';
      pen.beginPath(); pen.ellipse(x,y,r*1.4,r,.2,0,2*Math.PI); pen.fill();
      for (let i=0;i<8;i++) {
        const tx=x+Math.cos(i*2.4)*r*.89, ty=y+Math.sin(i*2.4)*r*.59;
        pen.fillStyle = i%2 ? '#8fc698' : '#a1cf94';
        pen.beginPath(); pen.arc(tx,ty,8,0,2*Math.PI); pen.fill();
      }
    }
  }
  const route = new Path2D('M126 175 C12 286 73 413 268 444 S565 584 559 469 S698 288 619 160');
  function draw(offset) {
    if (!ctx) return;
    ctx.drawImage(art, 0, 0);
    ctx.strokeStyle = '#dd7164'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.setLineDash([5, 11]); ctx.lineDashOffset = -offset; ctx.stroke(route);
  }
  const cards = [...board.querySelectorAll('.postcard')];
  const choices = [...board.querySelectorAll('.map-choice')];
  const control = board.querySelector('.motion-switch');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ja = document.documentElement.lang === 'ja';
  let playing = !reduced.matches;
  let visible = true;
  let index = 0;
  let elapsed = 0;
  let frame = 0;
  let last = 0;
  function select(next) {
    index = next;
    elapsed = 0;
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', index === i);
      card.setAttribute('aria-hidden', String(index !== i));
      choices[i].setAttribute('aria-pressed', String(index === i));
    });
    board.dataset.place = String(index);
  }
  function tick(now) {
    if (!last) last = now;
    const dt = now - last;
    if (dt >= 32) {
      elapsed += dt;
      last = now;
      if (elapsed >= 4200) select((index + 1) % cards.length);
      draw(now / 55);
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    last = 0;
    const run = playing && visible && !document.hidden;
    board.classList.toggle('at-rest', !run);
    control.setAttribute('aria-label', playing ? (ja ? '動きを止める' : 'Pause motion') : (ja ? '動きを再生する' : 'Play motion'));
    control.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
    if (run) frame = requestAnimationFrame(tick);
  }
  choices.forEach((button, i) => button.addEventListener('click', () => {
    playing = false; select(i); sync();
  }));
  control.addEventListener('click', () => { playing = !playing; sync(); });
  reduced.addEventListener('change', () => { playing = !reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(board);
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('arrived');
        reveal.unobserve(entry.target);
      }
    }, {threshold: .12});
    document.querySelectorAll('.screen-story, .guide-steps > div').forEach(el => reveal.observe(el));
  }
  board.querySelector('.pin-choices').hidden = false;
  control.hidden = false;
  draw(0);
  sync();
})();
