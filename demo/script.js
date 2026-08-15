(() => {
  const boundary = document.querySelector('#boundary');
  const main = document.querySelector('#main');
  const enter = document.querySelector('#enter');
  const bodyLevel = document.querySelector('#body-level');
  const feltLevel = document.querySelector('#felt-level');
  const insight = document.querySelector('#insight');
  const learning = document.querySelector('#learning');
  const motionNote = document.querySelector('#motion-note');
  const connector = document.querySelector('#connector-dot');
  const reset = document.querySelector('#reset');

  function update() {
    const body = Number(bodyLevel.value);
    const felt = Number(feltLevel.value);
    const divergent = Math.abs(body - felt) >= 22;
    insight.textContent = divergent ? 'They can diverge' : 'Aligned';
    insight.style.background = divergent ? '#e5e2ff' : '#ffc5b5';
    connector.style.setProperty('--dot-y', `${(body - felt) * 0.35}px`);
    if (divergent) {
      learning.hidden = false;
      motionNote.textContent = 'Different tracks can still be honest signals. Keep exploring, or read the idea below.';
    }
  }

  function enterExhibit() {
    boundary.hidden = true;
    main.removeAttribute('aria-hidden');
    bodyLevel.focus();
  }

  function resetExhibit() {
    bodyLevel.value = 35;
    feltLevel.value = 35;
    learning.hidden = true;
    insight.textContent = 'Aligned';
    insight.style.background = '#ffc5b5';
    connector.style.setProperty('--dot-y', '0px');
    motionNote.textContent = 'You can explore this with a keyboard, touch, or pointer.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    bodyLevel.focus();
  }

  enter.addEventListener('click', enterExhibit);
  bodyLevel.addEventListener('input', update);
  feltLevel.addEventListener('input', update);
  reset.addEventListener('click', resetExhibit);
})();
