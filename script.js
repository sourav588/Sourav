// window.addEventListener('load', () => {
//   const audio = document.getElementById('bg-music');

//   // Attempt auto-play (may be blocked)
//   audio.play().catch(() => {
//     console.log("Autoplay blocked! Waiting for user interaction...");
    
//     // If blocked, play on first click anywhere
//     document.body.addEventListener('click', () => {
//       audio.play();
//     }, { once: true });
//   });
// });



(function () {
  const WRAPPER_SEL = ".circle";
  const PATH_SEL = "svg circle:last-child"; // the progress ring

  // Init all circles (hide progress at start)
  function prepCircle(wrap) {
    const path = wrap.querySelector(PATH_SEL);
    if (!path) return;
    const r = path.r.baseVal.value;
    const C = 2 * Math.PI * r;

    // set dash to total length so it's fully hidden
    path.style.strokeDasharray = C;
    path.style.strokeDashoffset = C;

    // prepare number text (0% -> skill name)
    const label = wrap.querySelector(".number");
    if (label) {
      const skill = label.querySelector("p")?.outerHTML || "";
      label.innerHTML = `<span class="val">0%</span>${skill}`;
    }
  }

  // Read percent from --percent (fallback to data-progress if you use it)
  function getPercent(path, wrap) {
    const cssVar = path.style.getPropertyValue("--percent");
    const val =
      parseFloat(cssVar) ||
      parseFloat(wrap.getAttribute("data-progress")) ||
      0;
    return Math.max(0, Math.min(100, val));
  }

  // Animate stroke + number
  function animateCircle(wrap) {
    if (wrap.dataset.animated) return; // run once
    wrap.dataset.animated = "1";

    const path = wrap.querySelector(PATH_SEL);
    const label = wrap.querySelector(".number .val");
    if (!path) return;

    const r = path.r.baseVal.value;
    const C = 2 * Math.PI * r;
    const target = getPercent(path, wrap);

    const duration = 1800; // ms
    const start = performance.now();

    // easeOutCubic
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const e = ease(t);
      const current = Math.round(target * e);

      // stroke progress
      const offset = C - (current / 100) * C;
      path.style.strokeDashoffset = offset;

      // number progress
      if (label) label.textContent = current + "%";

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        // lock to final value
        path.style.strokeDashoffset = C - (target / 100) * C;
        if (label) label.textContent = target + "%";
      }
    }
    requestAnimationFrame(frame);
  }

  function onReady() {
    const wraps = document.querySelectorAll(WRAPPER_SEL);
    wraps.forEach(prepCircle);

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              animateCircle(e.target);
              io.unobserve(e.target); // animate once
            }
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
      );
      wraps.forEach((w) => io.observe(w));
    } else {
      // Fallback for very old browsers
      const onScroll = () => {
        wraps.forEach((w) => {
          const rect = w.getBoundingClientRect();
          const visible =
            rect.top < window.innerHeight * 0.65 && rect.bottom > 0;
          if (visible) animateCircle(w);
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();



const faqs = document.querySelectorAll('.faq');

faqs.forEach(faq => {
  faq.addEventListener('click', () => {
    // toggle active class
    faq.classList.toggle('active');

    // optional: close other FAQs when one opens
    faqs.forEach(otherFaq => {
      if(otherFaq !== faq) {
        otherFaq.classList.remove('active');
      }
    });
  });
});




const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

let currentIndex = 0;

// Create dots dynamically
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
}

function updateSlider() {
  const slideWidth = slides[0].clientWidth;
  document.querySelector('.slides').style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

// Auto slide
setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}, 4000); // every 4 seconds
