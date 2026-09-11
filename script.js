// ===== Scroll Progress Bar =====
function updateScrollProgress() {
  const sections = ['cover', 'letter', 'gallery', 'reasons', 'closing'];
  const segments = document.querySelectorAll('.scroll-progress .segment');
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;

  sections.forEach((id, index) => {
    const section = document.getElementById(id);
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const segment = segments[index];

    if (scrollTop >= sectionTop + sectionHeight) {
      // Fully scrolled past
      segment.classList.add('active');
      segment.classList.remove('partial');
      segment.style.removeProperty('--progress');
    } else if (scrollTop + windowHeight > sectionTop && scrollTop < sectionTop + sectionHeight) {
      // Currently in view
      const progress = Math.min(100, Math.max(0,
        ((scrollTop + windowHeight - sectionTop) / (sectionHeight + windowHeight)) * 100
      ));
      segment.classList.remove('active');
      segment.classList.add('partial');
      segment.style.setProperty('--progress', progress + '%');
      // Set the width directly via after pseudo element override
      segment.style.cssText = '';
      const afterStyle = document.createElement('style');
      afterStyle.textContent = `.scroll-progress .segment:nth-child(${index + 1}).partial::after { width: ${progress}% !important; }`;
      // Remove existing dynamic style for this segment
      const existingStyle = document.getElementById(`segment-style-${index}`);
      if (existingStyle) existingStyle.remove();
      afterStyle.id = `segment-style-${index}`;
      document.head.appendChild(afterStyle);
    } else {
      segment.classList.remove('active', 'partial');
      const existingStyle = document.getElementById(`segment-style-${index}`);
      if (existingStyle) existingStyle.remove();
    }
  });
}

// ===== Scroll Animations (Intersection Observer) =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve so re-entry works if needed (optional)
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children'
  );
  animatedElements.forEach(el => observer.observe(el));
}

// ===== Lightbox =====
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== Music Player =====
function initMusic() {
  const btn = document.getElementById('musicBtn');
  let isPlaying = false;

  // Create audio element with a royalty-free music URL
  const audio = new Audio();
  // Using a placeholder - user can replace with their own music file
  audio.loop = true;
  audio.volume = 0.4;

  audio.src = 'https://ik.imagekit.io/nunuibnu/websitewisuda/musik/tunggal_eka';

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      isPlaying = false;
    } else {
      audio.play().then(() => {
        btn.classList.add('playing');
        isPlaying = true;
      }).catch(() => {
        // Audio not available, just toggle visual
        btn.classList.toggle('playing');
      });
    }
  });
}

// ===== Floating Hearts =====
function initFloatingHearts() {
  const container = document.getElementById('heartsContainer');
  const hearts = ['🤍', '🩷', '🩶', '💛', '🤎'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (12 + Math.random() * 14) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    heart.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
      heart.remove();
    }, 14000);
  }

  // Create hearts periodically
  setInterval(createHeart, 3000);

  // Create initial batch
  for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 800);
  }
}

// ===== Smooth scroll for CTA =====
document.addEventListener('DOMContentLoaded', () => {
  const cta = document.getElementById('coverCta');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(cta.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initMusic();
  initFloatingHearts();
  updateScrollProgress();
});

window.addEventListener('scroll', () => {
  requestAnimationFrame(updateScrollProgress);
});

// Recalculate on resize
window.addEventListener('resize', () => {
  requestAnimationFrame(updateScrollProgress);
});
