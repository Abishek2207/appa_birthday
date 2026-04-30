const body = document.body;
const todayBadge = document.getElementById("todayBadge");
const introScreen = document.getElementById("introScreen");
const introTriggers = document.querySelectorAll(".intro-trigger");
const confettiLayer = document.getElementById("confettiLayer");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt-card]");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");
const videoRevealButton = document.getElementById("videoRevealButton");
const videoFrame = document.getElementById("videoFrame");
const surpriseVideo = document.getElementById("surpriseVideo");
const videoFallback = document.getElementById("videoFallback");
const starfield = document.getElementById("starfield");
const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canUseRichMotion = !motionReduced && window.matchMedia("(pointer: fine) and (min-width: 781px)").matches;
let spotlightFrame = 0;

todayBadge.textContent = "Friday, 1 May 2026";

function setSpotlightPosition(x, y) {
  document.documentElement.style.setProperty("--spot-x", `${x}px`);
  document.documentElement.style.setProperty("--spot-y", `${y}px`);
}

setSpotlightPosition(window.innerWidth * 0.5, window.innerHeight * 0.2);

if (canUseRichMotion) {
  window.addEventListener("pointermove", (event) => {
    if (spotlightFrame) {
      return;
    }

    spotlightFrame = requestAnimationFrame(() => {
      setSpotlightPosition(event.clientX, event.clientY);
      spotlightFrame = 0;
    });
  });
}

if (starfield && !motionReduced) {
  const totalStars = canUseRichMotion ? 16 : 8;

  for (let index = 0; index < totalStars; index += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${3 + Math.random() * 4}s`);
    star.style.animationDelay = `${Math.random() * 3}s`;
    starfield.appendChild(star);
  }
}

const confettiColors = ["#f6b85f", "#ffe0a3", "#78ddff", "#ff6f91", "#58f0c8", "#b894ff", "#ffffff"];

function launchConfetti(total = 36) {
  if (motionReduced) {
    return;
  }

  const cappedTotal = Math.min(total, canUseRichMotion ? 42 : 18);

  for (let index = 0; index < cappedTotal; index += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = confettiColors[index % confettiColors.length];
    confetti.style.width = `${8 + Math.random() * 10}px`;
    confetti.style.height = `${10 + Math.random() * 18}px`;
    confetti.style.setProperty("--confetti-radius", index % 4 === 0 ? "999px" : "4px");
    confetti.style.animationDuration = `${3.8 + Math.random() * 2.8}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.setProperty("--drift", `${-140 + Math.random() * 280}px`);
    confettiLayer.appendChild(confetti);

    window.setTimeout(() => confetti.remove(), 4600);
  }
}

function launchSparkles(x, y, total = 10) {
  if (motionReduced || !confettiLayer) {
    return;
  }

  const cappedTotal = Math.min(total, canUseRichMotion ? 12 : 6);

  for (let index = 0; index < cappedTotal; index += 1) {
    const sparkle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / cappedTotal;
    const distance = 50 + Math.random() * 90;

    sparkle.className = "confetti sparkle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.width = `${5 + Math.random() * 6}px`;
    sparkle.style.height = `${5 + Math.random() * 6}px`;
    sparkle.style.background = confettiColors[index % confettiColors.length];
    sparkle.style.animation = "none";
    sparkle.style.transform = "translate(-50%, -50%) scale(1)";
    sparkle.style.transition = "transform 720ms ease, opacity 720ms ease";
    sparkle.style.setProperty("--confetti-radius", "999px");
    confettiLayer.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.opacity = "0";
      sparkle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.1)`;
    });

    window.setTimeout(() => sparkle.remove(), 820);
  }
}

function unlockExperience(targetId) {
  introScreen.classList.add("is-hidden");
  body.classList.remove("is-locked");

  window.setTimeout(() => {
    const target = document.getElementById(targetId);
    target?.classList.add("visible");
    target?.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    target?.scrollIntoView({
      behavior: motionReduced ? "auto" : "smooth",
      block: "start",
    });
  }, 220);

  launchConfetti(36);
}

introTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    unlockExperience(trigger.dataset.target);
  });
});

document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    launchSparkles(event.clientX, event.clientY, 8);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!canUseRichMotion) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 8;
    const rotateX = ((offsetY / bounds.height) - 0.5) * -8;

    card.style.setProperty("--mx", `${(offsetX / bounds.width) * 100}%`);
    card.style.setProperty("--my", `${(offsetY / bounds.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

function openLightbox(trigger) {
  const image = trigger.querySelector("img");
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = trigger.dataset.caption || image.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  body.classList.add("is-locked");
  launchSparkles(window.innerWidth / 2, window.innerHeight / 2, 10);
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");

  if (introScreen.classList.contains("is-hidden")) {
    body.classList.remove("is-locked");
  }
}

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightbox(trigger);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

function revealVideoSurprise() {
  if (!videoFrame) {
    return;
  }

  videoFrame.hidden = false;
  surpriseVideo?.load();
  videoFrame.scrollIntoView({
    behavior: motionReduced ? "auto" : "smooth",
    block: "start",
  });

  const tryPlay = surpriseVideo?.play();

  if (tryPlay && typeof tryPlay.catch === "function") {
    tryPlay.catch(() => {
      if (videoFallback) {
        videoFallback.hidden = false;
      }
    });
  }
}

if (surpriseVideo) {
  surpriseVideo.addEventListener("error", () => {
    if (videoFallback) {
      videoFallback.hidden = false;
    }
  });
}

videoRevealButton?.addEventListener("click", () => {
  revealVideoSurprise();
  launchConfetti(30);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("is-open")) {
      closeLightbox();
      return;
    }

    if (!introScreen.classList.contains("is-hidden")) {
      unlockExperience("hero");
    }
  }
});
