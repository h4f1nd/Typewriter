/* Typewriter — small, dependency-free behaviour.
   Nothing here stores or transmits what you type. */

(() => {
  "use strict";

  const HEADLINE = "Words, one key at a time.";
  const CLEAR_ARM_MS = 3200;

  const typed = document.querySelector(".typed");
  const caret = document.querySelector(".caret");
  const paper = document.getElementById("paper");
  const count = document.getElementById("count");
  const newSheet = document.getElementById("new-sheet");
  const soundButton = document.getElementById("sound");
  const status = document.getElementById("status");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let typingStopped = false;

  /* ---------------------------------------------------------- headline */

  const finishHeadline = () => {
    typingStopped = true;
    typed.textContent = HEADLINE;
    caret.hidden = true;
  };

  const typeHeadline = () => {
    if (typingStopped) return;

    let index = 0;

    const step = () => {
      if (typingStopped) return;

      index += 1;
      typed.textContent = HEADLINE.slice(0, index);

      if (index >= HEADLINE.length) {
        return;
      }

      const character = HEADLINE[index - 1];
      const delay = character === " " ? 95 : 46 + Math.random() * 34;
      window.setTimeout(step, delay);
    };

    window.setTimeout(step, 450);
  };

  if (reduceMotion.matches) {
    finishHeadline();
  } else {
    typeHeadline();
    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) finishHeadline();
    });
  }

  /* -------------------------------------------------------- typing pad */

  const grow = () => {
    paper.style.height = "auto";
    paper.style.height = `${paper.scrollHeight}px`;
  };

  const updateCount = () => {
    count.textContent = String(paper.value.length).padStart(3, "0");
  };

  paper.addEventListener("input", () => {
    grow();
    updateCount();
    click();
  });

  window.addEventListener("resize", grow, { passive: true });

  /* -------------------------------------------------------- new sheet */

  let armed = false;
  let armTimer = 0;

  const disarm = () => {
    armed = false;
    window.clearTimeout(armTimer);
    newSheet.textContent = "New sheet";
  };

  newSheet.addEventListener("click", () => {
    if (!paper.value) {
      paper.focus();
      return;
    }

    if (!armed) {
      armed = true;
      newSheet.textContent = "Press again to clear";
      status.textContent = "Press the button again to clear the sheet.";
      armTimer = window.setTimeout(disarm, CLEAR_ARM_MS);
      return;
    }

    disarm();
    paper.value = "";
    grow();
    updateCount();
    status.textContent = "Sheet cleared.";
    paper.focus();
  });

  /* ------------------------------------------------------------ sound */

  let audioContext = null;

  const soundOn = () => soundButton.getAttribute("aria-pressed") === "true";

  const click = () => {
    if (!soundOn()) return;

    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;

      audioContext = audioContext || new AudioCtor();
      if (audioContext.state === "suspended") audioContext.resume();

      const duration = 0.035;
      const frames = Math.floor(audioContext.sampleRate * duration);
      const buffer = audioContext.createBuffer(1, frames, audioContext.sampleRate);
      const samples = buffer.getChannelData(0);

      for (let i = 0; i < frames; i += 1) {
        const decay = 1 - i / frames;
        samples[i] = (Math.random() * 2 - 1) * decay * decay * decay;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1700 + Math.random() * 700;
      filter.Q.value = 0.9;

      const gain = audioContext.createGain();
      gain.gain.value = 0.12;

      source.connect(filter).connect(gain).connect(audioContext.destination);
      source.start();
    } catch {
      /* audio is a nice-to-have, never a requirement */
    }
  };

  soundButton.addEventListener("click", () => {
    const next = !soundOn();
    soundButton.setAttribute("aria-pressed", String(next));
    soundButton.textContent = next ? "Sound: on" : "Sound: off";
    if (next) click();
  });

  /* ------------------------------------------------------------- init */

  grow();
  updateCount();
})();
