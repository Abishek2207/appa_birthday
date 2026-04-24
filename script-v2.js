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

todayBadge.textContent = "Friday, 1 May 2026";

function setSpotlightPosition(x, y) {
  document.documentElement.style.setProperty("--spot-x", `${x}px`);
  document.documentElement.style.setProperty("--spot-y", `${y}px`);
}

setSpotlightPosition(window.innerWidth * 0.5, window.innerHeight * 0.2);

if (!motionReduced) {
  window.addEventListener("pointermove", (event) => {
    setSpotlightPosition(event.clientX, event.clientY);
  });
}

if (starfield && !motionReduced) {
  const totalStars = 26;

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

const confettiColors = ["#ebb96d", "#f5d9a6", "#8db9f7", "#ffffff"];

function launchConfetti(total = 70) {
  if (motionReduced) {
    return;
  }

  for (let index = 0; index < total; index += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = confettiColors[index % confettiColors.length];
    confetti.style.animationDuration = `${3.8 + Math.random() * 2.8}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.setProperty("--drift", `${-140 + Math.random() * 280}px`);
    confettiLayer.appendChild(confetti);

    window.setTimeout(() => confetti.remove(), 7600);
  }
}

function unlockExperience(targetId) {
  introScreen.classList.add("is-hidden");
  body.classList.remove("is-locked");

  window.setTimeout(() => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: motionReduced ? "auto" : "smooth",
      block: "start",
    });
  }, 220);

  launchConfetti(90);
}

introTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    unlockExperience(trigger.dataset.target);
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
    if (motionReduced) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 8;
    const rotateX = ((offsetY / bounds.height) - 0.5) * -8;

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
  launchConfetti(80);
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
